import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PerkType, Origin } from '@prisma/client';

export interface PerkEffectCalculated {
  type: 'resistance' | 'attribute' | 'hp' | 'carryWeight' | 'special' | 'skill';
  target: string; // 'allparts', 'DR', 'ER', 'RR', 'PR', 'maxHP', 'carryWeight', 'S', 'P', etc
  value: number;
  description: string;
}

@Injectable()
export class PerksService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find all perks with optional filters
   */
  async findAll(filters?: {
    type?: PerkType;
    name?: string;
    minLevel?: number;
    requirements?: string;
  }) {
    const where: any = {};

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.name) {
      where.name = {
        contains: filters.name,
        mode: 'insensitive',
      };
    }

    return this.prisma.perkMaster.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Find perk by ID
   */
  async findOne(id: string) {
    const perk = await this.prisma.perkMaster.findUnique({
      where: { id },
    });

    if (!perk) {
      throw new NotFoundException(`Perk with ID ${id} not found`);
    }

    return perk;
  }

  /**
   * Find perks available for a character based on level, SPECIAL, and origin
   */
  async findAvailableForCharacter(characterId: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: {
        attributes: true,
        perks: {
          include: { perk: true },
        },
      },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    // Get all perks
    const allPerks = await this.prisma.perkMaster.findMany();

    // Filter perks based on character's level, SPECIAL, and origin
    const availablePerks = allPerks.filter(perk => {
      // Check origin restrictions
      if (perk.restriction) {
        if (!this.checkRestriction(perk.restriction, character.origin)) {
          return false;
        }
      }

      // Check SPECIAL requirements
      if (perk.requirements && perk.requirements !== '–') {
        if (!this.checkRequirements(perk.requirements, character.attributes)) {
          return false;
        }
      }

      // Check minimum level for rank 1
      const minLevelForRank1 = this.getMinLevelForRank(perk.minLevel, 1);
      if (minLevelForRank1 > character.level) {
        return false;
      }

      return true;
    });

    // Add information about current rank if character has this perk
    const result = availablePerks.map(perk => {
      const characterPerk = character.perks.find(cp => cp.perkId === perk.id);
      return {
        ...perk,
        currentRank: characterPerk?.rank || 0,
        nextRankAvailable: characterPerk
          ? this.isNextRankAvailable(perk.minLevel, characterPerk.rank + 1, character.level)
          : true,
      };
    });

    return result;
  }

  /**
   * Get calculated effects for a perk at a specific rank
   */
  async getPerkEffects(perkId: string, rank: number, characterAttributes?: any): Promise<PerkEffectCalculated[]> {
    const perk = await this.findOne(perkId);

    if (!perk.effects || perk.effects === '–') {
      return [];
    }

    return this.parseAndCalculateEffects(perk.effects, rank, characterAttributes);
  }

  /**
   * Parse effects string and calculate values
   * Examples:
   * - "allparts(DR): +1x(PerkRank)" -> All body parts get +1 DR per rank
   * - "allparts(RR): 1x(PerkRank)" -> All body parts get +1 RR per rank
   * - "maximumHP: +att(E)x(PerkRank)" -> Max HP = Endurance * rank
   * - "carryWeight: +25x(PerkRank)" -> Carry Weight = +25 per rank
   * - "allparts(PR): +2" -> All body parts get +2 PR (fixed)
   */
  private parseAndCalculateEffects(effectsStr: string, rank: number, characterAttributes?: any): PerkEffectCalculated[] {
    const effects: PerkEffectCalculated[] = [];

    // Split by comma if multiple effects
    const effectParts = effectsStr.split(',').map(e => e.trim());

    for (const part of effectParts) {
      // Pattern: allparts(DR): +1x(PerkRank)
      const allpartsMatch = part.match(/allparts\((\w+)\):\s*\+?(\d+)x\(PerkRank\)/i);
      if (allpartsMatch) {
        const resistanceType = allpartsMatch[1]; // DR, ER, RR, PR
        const valuePerRank = parseInt(allpartsMatch[2]);
        const totalValue = valuePerRank * rank;

        effects.push({
          type: 'resistance',
          target: resistanceType,
          value: totalValue,
          description: `+${totalValue} ${resistanceType} to all body parts`,
        });
        continue;
      }

      // Pattern: allparts(PR): +2 (fixed value)
      const allpartsFixedMatch = part.match(/allparts\((\w+)\):\s*\+?(\d+)/i);
      if (allpartsFixedMatch) {
        const resistanceType = allpartsFixedMatch[1];
        const value = parseInt(allpartsFixedMatch[2]);

        effects.push({
          type: 'resistance',
          target: resistanceType,
          value: value,
          description: `+${value} ${resistanceType} to all body parts`,
        });
        continue;
      }

      // Pattern: maximumHP: +att(E)x(PerkRank)
      const hpAttrMatch = part.match(/maximumHP:\s*\+?att\((\w+)\)x\(PerkRank\)/i);
      if (hpAttrMatch && characterAttributes) {
        const attribute = hpAttrMatch[1].toLowerCase(); // E -> endurance
        const attrMap: Record<string, string> = {
          s: 'strength',
          p: 'perception',
          e: 'endurance',
          c: 'charisma',
          i: 'intelligence',
          a: 'agility',
          l: 'luck',
        };

        const attrName = attrMap[attribute.toLowerCase()];
        const attrValue = characterAttributes[attrName] || 0;
        const totalValue = attrValue * rank;

        effects.push({
          type: 'hp',
          target: 'maxHP',
          value: totalValue,
          description: `+${totalValue} Maximum HP (${attrValue} ${attrName.toUpperCase()} × ${rank} ranks)`,
        });
        continue;
      }

      // Pattern: carryWeight: +25x(PerkRank)
      const carryWeightMatch = part.match(/carryWeight:\s*\+?(\d+)x\(PerkRank\)/i);
      if (carryWeightMatch) {
        const valuePerRank = parseInt(carryWeightMatch[1]);
        const totalValue = valuePerRank * rank;

        effects.push({
          type: 'carryWeight',
          target: 'carryWeight',
          value: totalValue,
          description: `+${totalValue} lbs Carry Weight`,
        });
        continue;
      }
    }

    return effects;
  }

  /**
   * Check if character meets SPECIAL requirements
   * Format: "S:(5), I:(6)" means STR >= 5 AND INT >= 6
   */
  private checkRequirements(requirementsStr: string, attributes: any): boolean {
    if (!requirementsStr || requirementsStr === '–') {
      return true;
    }

    // Parse requirements: "S:(5), I:(6)"
    const reqParts = requirementsStr.split(',').map(r => r.trim());

    for (const req of reqParts) {
      const match = req.match(/(\w+):\((\d+)\)/);
      if (!match) continue;

      const attrShort = match[1];
      const minValue = parseInt(match[2]);

      const attrMap: Record<string, string> = {
        S: 'strength',
        P: 'perception',
        E: 'endurance',
        C: 'charisma',
        I: 'intelligence',
        A: 'agility',
        L: 'luck',
      };

      const attrName = attrMap[attrShort.toUpperCase()];
      if (!attrName) continue;

      const charValue = attributes[attrName] || 0;
      if (charValue < minValue) {
        return false;
      }
    }

    return true;
  }

  /**
   * Check if character's origin is restricted
   */
  private checkRestriction(restriction: string, origin: Origin): boolean {
    if (!restriction || restriction === '–') {
      return true;
    }

    const lowerRestriction = restriction.toLowerCase();

    // "Not a robot" restriction
    if (lowerRestriction.includes('not a robot') || lowerRestriction.includes('not robot')) {
      return origin !== Origin.MISTER_HANDY;
    }

    // "One for party only" (Dogmeat) - allow for now, check in controller
    if (lowerRestriction.includes('one for party')) {
      return true;
    }

    return true;
  }

  /**
   * Get minimum level required for a specific rank
   */
  private getMinLevelForRank(minLevelStr: string | null, rank: number): number {
    if (!minLevelStr || minLevelStr === '–') {
      return 1;
    }

    // Check if it's a simple number
    const simpleNumber = parseInt(minLevelStr);
    if (!isNaN(simpleNumber)) {
      return simpleNumber;
    }

    // Parse format: "perkrank(1):2,perkrank(2):6"
    const rankMatch = minLevelStr.match(new RegExp(`perkrank\\(${rank}\\):(\\d+)`));
    if (rankMatch) {
      return parseInt(rankMatch[1]);
    }

    // If rank not found, perk doesn't have this rank
    return 999;
  }

  /**
   * Check if next rank is available for character
   */
  private isNextRankAvailable(minLevelStr: string | null, nextRank: number, characterLevel: number): boolean {
    const requiredLevel = this.getMinLevelForRank(minLevelStr, nextRank);
    return characterLevel >= requiredLevel && requiredLevel !== 999;
  }
}
