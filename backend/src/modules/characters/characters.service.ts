import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCharacterDto, Origin as DtoOrigin, Skill } from './dto/create-character.dto';
import { Origin as PrismaOrigin } from '@prisma/client';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  private mapOriginToPrisma(origin: DtoOrigin): PrismaOrigin {
    const originMap: Record<DtoOrigin, PrismaOrigin> = {
      [DtoOrigin.VAULT_DWELLER]: 'VAULT_DWELLER',
      [DtoOrigin.SURVIVOR]: 'SURVIVOR',
      [DtoOrigin.GHOUL]: 'GHOUL',
      [DtoOrigin.SUPER_MUTANT]: 'SUPER_MUTANT',
      [DtoOrigin.BROTHERHOOD]: 'BROTHERHOOD',
      [DtoOrigin.MISTER_HANDY]: 'MISTER_HANDY',
    };
    return originMap[origin];
  }

  async createFromWizard(userId: string, dto: CreateCharacterDto) {
    // Ensure user exists in database (for guest users)
    let user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      // Create guest user in database
      user = await this.prisma.user.create({
        data: {
          id: userId,
          email: 'guest@local',
          username: `Guest_${userId.slice(-8)}`,
          password: 'guest',
          role: 'PLAYER',
        },
      });
    }

    // Validate campaign if provided
    let campaignId = dto.campaignId;

    if (campaignId) {
      const campaign = await this.prisma.campaign.findUnique({
        where: { id: campaignId },
      });
      if (!campaign) {
        throw new NotFoundException(`Campaign with ID ${campaignId} not found`);
      }
    } else {
      // If no campaign provided, find or create a default campaign
      let defaultCampaign = await this.prisma.campaign.findFirst({
        where: { name: 'Default Campaign' },
      });

      if (!defaultCampaign) {
        // Create a system user for default campaign if it doesn't exist
        let systemUser = await this.prisma.user.findUnique({
          where: { email: 'system@pipboy.local' },
        });

        if (!systemUser) {
          systemUser = await this.prisma.user.create({
            data: {
              email: 'system@pipboy.local',
              username: 'System',
              password: 'system',
              role: 'GM',
            },
          });
        }

        defaultCampaign = await this.prisma.campaign.create({
          data: {
            name: 'Default Campaign',
            description: 'Default campaign for characters without a specific campaign',
            gmId: systemUser.id,
          },
        });
      }

      campaignId = defaultCampaign.id;
    }

    // Create character with all related data in a transaction
    return this.prisma.$transaction(async (tx) => {
      // 1. Create base character
      const character = await tx.character.create({
        data: {
          userId,
          campaignId,
          name: dto.characterName,
          level: dto.level,
          xpCurrent: 0,
          xpToNext: 100,
          origin: this.mapOriginToPrisma(dto.origin),
          type: 'NORMAL',
        },
      });

      // 2. Create SPECIAL attributes
      await tx.characterAttributes.create({
        data: {
          characterId: character.id,
          strength: dto.special.strength,
          perception: dto.special.perception,
          endurance: dto.special.endurance,
          charisma: dto.special.charisma,
          intelligence: dto.special.intelligence,
          agility: dto.special.agility,
          luck: dto.special.luck,
        },
      });

      // 3. Create skills with ranks and tags
      const skillsData = Object.values(Skill).map((skill) => ({
        characterId: character.id,
        skill: skill,
        rank: dto.skillRanks[skill] || 0,
        isTagged: dto.tagSkills.includes(skill),
      }));

      await tx.characterSkill.createMany({
        data: skillsData,
      });

      // 4. Create derived stats
      await tx.derivedStats.create({
        data: {
          characterId: character.id,
          defense: dto.defense,
          initiative: dto.initiative,
          meleeDamage: dto.meleeDamage,
          maxHP: dto.maxHP,
          currentHP: dto.maxHP,
          carryWeightMax: dto.special.strength * 10,
          carryWeightCurrent: 0,
          maxLuckPoints: dto.special.luck,
          poisonDR: 0,
        },
      });

      // 5. Create body locations with default HP
      const bodyLocations = [
        { location: 'HEAD', diceRange: '20', maxHP: Math.floor(dto.maxHP * 0.2) },
        { location: 'TORSO', diceRange: '1-10', maxHP: Math.floor(dto.maxHP * 0.4) },
        { location: 'LEFT_ARM', diceRange: '11-13', maxHP: Math.floor(dto.maxHP * 0.15) },
        { location: 'RIGHT_ARM', diceRange: '14-16', maxHP: Math.floor(dto.maxHP * 0.15) },
        { location: 'LEFT_LEG', diceRange: '17-18', maxHP: Math.floor(dto.maxHP * 0.2) },
        { location: 'RIGHT_LEG', diceRange: '19', maxHP: Math.floor(dto.maxHP * 0.2) },
      ];

      for (const loc of bodyLocations) {
        await tx.bodyLocation.create({
          data: {
            characterId: character.id,
            location: loc.location,
            diceRange: loc.diceRange,
            maxHP: loc.maxHP,
            currentHP: loc.maxHP,
            physicalDR: 0,
            energyDR: 0,
            radiationDR: 0,
          },
        });
      }

      // Return complete character with all relations
      return tx.character.findUnique({
        where: { id: character.id },
        include: {
          attributes: true,
          skills: true,
          derivedStats: true,
          bodyLocations: true,
          perks: true,
          campaign: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.character.findMany({
      where: { userId },
      include: {
        attributes: true,
        derivedStats: true,
        campaign: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const character = await this.prisma.character.findUnique({
      where: { id },
      include: {
        attributes: true,
        skills: true,
        derivedStats: true,
        bodyLocations: true,
        perks: {
          include: {
            perk: true,
          },
        },
        inventory: true,
        activeEffects: true,
        reputations: {
          include: {
            faction: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
            description: true,
            gm: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return character;
  }

  async update(id: string, data: any) {
    const character = await this.prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return this.prisma.character.update({
      where: { id },
      data,
      include: {
        attributes: true,
        derivedStats: true,
        skills: true,
      },
    });
  }

  async delete(id: string) {
    const character = await this.prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    return this.prisma.character.delete({
      where: { id },
    });
  }

  // ============= DEV/CHEAT ENDPOINTS =============

  async updateSPECIAL(characterId: string, updates: any) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { attributes: true },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    return this.prisma.characterAttributes.update({
      where: { characterId },
      data: updates,
    });
  }

  async updateSkill(characterId: string, skill: string, rank: number) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    const characterSkill = await this.prisma.characterSkill.findFirst({
      where: {
        characterId,
        skill,
      },
    });

    if (!characterSkill) {
      throw new NotFoundException(`Skill ${skill} not found for this character`);
    }

    return this.prisma.characterSkill.update({
      where: { id: characterSkill.id },
      data: { rank },
    });
  }

  async updateStats(characterId: string, updates: any) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { derivedStats: true },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    // Update character level/XP if provided
    const characterUpdates: any = {};
    if (updates.level !== undefined) characterUpdates.level = updates.level;
    if (updates.xpCurrent !== undefined) characterUpdates.xpCurrent = updates.xpCurrent;

    if (Object.keys(characterUpdates).length > 0) {
      await this.prisma.character.update({
        where: { id: characterId },
        data: characterUpdates,
      });
    }

    // Update derived stats
    const statsUpdates: any = {};
    if (updates.currentHP !== undefined) statsUpdates.currentHP = updates.currentHP;
    if (updates.maxHP !== undefined) statsUpdates.maxHP = updates.maxHP;
    if (updates.defense !== undefined) statsUpdates.defense = updates.defense;
    if (updates.initiative !== undefined) statsUpdates.initiative = updates.initiative;
    if (updates.meleeDamage !== undefined) statsUpdates.meleeDamage = updates.meleeDamage;

    if (Object.keys(statsUpdates).length > 0) {
      await this.prisma.derivedStats.update({
        where: { characterId },
        data: statsUpdates,
      });
    }

    return this.findOne(characterId);
  }

  async applyDamage(characterId: string, damage: number, location?: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { derivedStats: true, bodyLocations: true },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    if (location) {
      // Apply damage to specific body location
      const bodyLocation = character.bodyLocations.find(bl => bl.location === location);
      if (!bodyLocation) {
        throw new NotFoundException(`Body location ${location} not found`);
      }

      const newHP = Math.max(0, bodyLocation.currentHP - damage);
      await this.prisma.bodyLocation.update({
        where: { id: bodyLocation.id },
        data: { currentHP: newHP },
      });
    } else {
      // Apply damage to general HP
      const newHP = Math.max(0, character.derivedStats.currentHP - damage);
      await this.prisma.derivedStats.update({
        where: { characterId },
        data: { currentHP: newHP },
      });
    }

    return this.findOne(characterId);
  }

  async heal(characterId: string, amount: number, location?: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { derivedStats: true, bodyLocations: true },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    if (location) {
      // Heal specific body location
      const bodyLocation = character.bodyLocations.find(bl => bl.location === location);
      if (!bodyLocation) {
        throw new NotFoundException(`Body location ${location} not found`);
      }

      const newHP = Math.min(bodyLocation.maxHP, bodyLocation.currentHP + amount);
      await this.prisma.bodyLocation.update({
        where: { id: bodyLocation.id },
        data: { currentHP: newHP },
      });
    } else {
      // Heal general HP
      const newHP = Math.min(character.derivedStats.maxHP, character.derivedStats.currentHP + amount);
      await this.prisma.derivedStats.update({
        where: { characterId },
        data: { currentHP: newHP },
      });
    }

    return this.findOne(characterId);
  }

  async applyRadiation(characterId: string, rads: number) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { derivedStats: true },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    // Note: You'll need to add a 'radiationLevel' field to DerivedStats in your schema
    // For now, we'll return a placeholder response
    return {
      message: `Applied ${rads} RADs to character ${character.name}`,
      character: await this.findOne(characterId),
      note: 'Add radiationLevel field to DerivedStats schema to persist this value',
    };
  }

  async applyPoison(characterId: string, poisonLevel: number) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: { derivedStats: true },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    // Update poison DR (existing field)
    await this.prisma.derivedStats.update({
      where: { characterId },
      data: { poisonDR: poisonLevel },
    });

    return this.findOne(characterId);
  }

  async addInventoryItem(characterId: string, itemId: string, itemType: string, quantity = 1, isEquipped = false) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    // Verify item exists in the appropriate table
    let itemExists = false;
    switch (itemType) {
      case 'WEAPON':
        itemExists = !!(await this.prisma.weapon.findUnique({ where: { id: itemId } }));
        break;
      case 'ARMOR':
        itemExists = !!(await this.prisma.armor.findUnique({ where: { id: itemId } }));
        break;
      case 'CONSUMABLE':
        itemExists = !!(await this.prisma.consumable.findUnique({ where: { id: itemId } }));
        break;
      case 'AMMO':
        itemExists = !!(await this.prisma.ammo.findUnique({ where: { id: itemId } }));
        break;
      case 'MOD':
        itemExists = !!(await this.prisma.mod.findUnique({ where: { id: itemId } }));
        break;
      case 'MAGAZINE':
        itemExists = !!(await this.prisma.magazine.findUnique({ where: { id: itemId } }));
        break;
      case 'TOOL':
        itemExists = !!(await this.prisma.tool.findUnique({ where: { id: itemId } }));
        break;
    }

    if (!itemExists) {
      throw new NotFoundException(`${itemType} with ID ${itemId} not found`);
    }

    // Create inventory item
    const data: any = {
      characterId,
      quantity,
      isEquipped,
    };

    // Set the appropriate foreign key based on item type
    switch (itemType) {
      case 'WEAPON':
        data.weaponId = itemId;
        break;
      case 'ARMOR':
        data.armorId = itemId;
        break;
      case 'CONSUMABLE':
        data.consumableId = itemId;
        break;
      case 'AMMO':
        data.ammoId = itemId;
        break;
      case 'MOD':
        data.modId = itemId;
        break;
      case 'MAGAZINE':
        data.magazineId = itemId;
        break;
      case 'TOOL':
        data.toolId = itemId;
        break;
    }

    const inventoryItem = await this.prisma.inventory.create({ data });

    return this.findOne(characterId);
  }

  async removeInventoryItem(characterId: string, inventoryItemId: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    const inventoryItem = await this.prisma.inventory.findUnique({
      where: { id: inventoryItemId },
    });

    if (!inventoryItem || inventoryItem.characterId !== characterId) {
      throw new NotFoundException(`Inventory item not found for this character`);
    }

    await this.prisma.inventory.delete({
      where: { id: inventoryItemId },
    });

    return this.findOne(characterId);
  }
}
