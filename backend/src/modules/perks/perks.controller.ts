import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PerksService } from './perks.service';
import { PerkType } from '@prisma/client';

@ApiTags('perks')
@Controller('perks')
export class PerksController {
  constructor(private perksService: PerksService) {}

  // ============================================================================
  // ENCYCLOPEDIA ENDPOINTS
  // ============================================================================

  @Get()
  @ApiOperation({
    summary: 'List All Perks',
    description: 'Get all perks with optional filters for encyclopedia'
  })
  @ApiQuery({ name: 'type', required: false, enum: PerkType, description: 'Filter by perk type' })
  @ApiQuery({ name: 'name', required: false, description: 'Search by perk name (partial match)' })
  @ApiResponse({
    status: 200,
    description: 'List of perks',
    schema: {
      example: [
        {
          id: 'perk-uuid-123',
          name: 'LIFE GIVER',
          type: 'EFFECT',
          requirements: null,
          minLevel: 'perkrank(1):5,perkrank(2):10,perkrank(3):15',
          restriction: null,
          effects: 'maximumHP: +att(E)x(PerkRank)',
          description: 'Increase your maximum health points by your Endurance rank...'
        }
      ]
    }
  })
  async findAll(
    @Query('type') type?: PerkType,
    @Query('name') name?: string,
  ) {
    return this.perksService.findAll({ type, name });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Perk by ID',
    description: 'Get detailed information about a specific perk'
  })
  @ApiParam({ name: 'id', description: 'UUID of the perk' })
  @ApiResponse({ status: 200, description: 'Perk details' })
  @ApiResponse({ status: 404, description: 'Perk not found' })
  async findOne(@Param('id') id: string) {
    return this.perksService.findOne(id);
  }

  @Get('search/by-name/:name')
  @ApiOperation({
    summary: 'Search Perks by Name',
    description: 'Search perks by name (partial match, case insensitive)'
  })
  @ApiParam({ name: 'name', description: 'Perk name to search' })
  @ApiResponse({
    status: 200,
    description: 'Matching perks',
    schema: {
      example: [
        {
          id: 'perk-uuid-123',
          name: 'LIFE GIVER',
          type: 'EFFECT',
          requirements: null,
          minLevel: 'perkrank(1):5,perkrank(2):10',
          restriction: null,
          effects: 'maximumHP: +att(E)x(PerkRank)',
          description: 'Increase your maximum health points...'
        }
      ]
    }
  })
  async searchByName(@Param('name') name: string) {
    return this.perksService.findAll({ name });
  }

  @Get('type/:type')
  @ApiOperation({
    summary: 'Get Perks by Type',
    description: 'Get all perks of a specific type (EFFECT, ABILITY, CRAFTING, COMPANION, SKILLS)'
  })
  @ApiParam({ name: 'type', enum: PerkType, description: 'Perk type' })
  @ApiResponse({ status: 200, description: 'Perks of specified type' })
  async findByType(@Param('type') type: PerkType) {
    return this.perksService.findAll({ type });
  }

  // ============================================================================
  // CHARACTER-SPECIFIC ENDPOINTS
  // ============================================================================

  @Get('available/:characterId')
  @ApiOperation({
    summary: 'Get Available Perks for Character',
    description: 'Get perks available for a character based on their level, SPECIAL attributes, and origin'
  })
  @ApiParam({ name: 'characterId', description: 'UUID of the character' })
  @ApiResponse({
    status: 200,
    description: 'Available perks with current rank information',
    schema: {
      example: [
        {
          id: 'perk-uuid-123',
          name: 'TOUGHNESS',
          type: 'EFFECT',
          requirements: 'E:(6), L:(6)',
          minLevel: 'perkrank(1):1,perkrank(2):5',
          restriction: null,
          effects: 'allparts(DR): +1x(PerkRank)',
          description: 'Your physical Damage Resistance to all hit locations increases...',
          currentRank: 1,
          nextRankAvailable: false
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async getAvailablePerks(@Param('characterId') characterId: string) {
    return this.perksService.findAvailableForCharacter(characterId);
  }

  // ============================================================================
  // PERK EFFECTS ENDPOINTS
  // ============================================================================

  @Get(':id/effects/:rank')
  @ApiOperation({
    summary: 'Get Calculated Effects for Perk',
    description: 'Get calculated effects for a perk at a specific rank (for EFFECT type perks)'
  })
  @ApiParam({ name: 'id', description: 'UUID of the perk' })
  @ApiParam({ name: 'rank', description: 'Perk rank (1, 2, 3, etc)' })
  @ApiQuery({ name: 'characterId', required: false, description: 'Character ID to calculate attribute-based effects' })
  @ApiResponse({
    status: 200,
    description: 'Calculated effects',
    schema: {
      example: [
        {
          type: 'resistance',
          target: 'DR',
          value: 2,
          description: '+2 DR to all body parts'
        },
        {
          type: 'hp',
          target: 'maxHP',
          value: 15,
          description: '+15 Maximum HP (5 ENDURANCE × 3 ranks)'
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Perk not found' })
  async getPerkEffects(
    @Param('id') id: string,
    @Param('rank') rank: string,
    @Query('characterId') characterId?: string,
  ) {
    const perk = await this.perksService.findOne(id);

    let characterAttributes;
    if (characterId) {
      const character = await this.perksService['prisma'].character.findUnique({
        where: { id: characterId },
        include: { attributes: true },
      });

      if (!character) {
        throw new NotFoundException('Character not found');
      }

      characterAttributes = character.attributes;
    }

    return this.perksService.getPerkEffects(id, parseInt(rank), characterAttributes);
  }

  @Get('character/:characterId/active-effects')
  @ApiOperation({
    summary: 'Get All Active Perk Effects for Character',
    description: 'Get all calculated effects from perks the character currently has (for Pip-Boy EFFECTS tab)'
  })
  @ApiParam({ name: 'characterId', description: 'UUID of the character' })
  @ApiResponse({
    status: 200,
    description: 'All active perk effects',
    schema: {
      example: [
        {
          perkName: 'TOUGHNESS',
          rank: 2,
          effects: [
            {
              type: 'resistance',
              target: 'DR',
              value: 2,
              description: '+2 DR to all body parts'
            }
          ]
        },
        {
          perkName: 'LIFE GIVER',
          rank: 3,
          effects: [
            {
              type: 'hp',
              target: 'maxHP',
              value: 15,
              description: '+15 Maximum HP (5 ENDURANCE × 3 ranks)'
            }
          ]
        }
      ]
    }
  })
  @ApiResponse({ status: 404, description: 'Character not found' })
  async getCharacterPerkEffects(@Param('characterId') characterId: string) {
    const character = await this.perksService['prisma'].character.findUnique({
      where: { id: characterId },
      include: {
        attributes: true,
        perks: {
          include: { perk: true },
          where: {
            perk: {
              type: PerkType.EFFECT, // Only EFFECT type perks have calculable effects
            },
          },
        },
      },
    });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    const allEffects = [];

    for (const characterPerk of character.perks) {
      const effects = await this.perksService.getPerkEffects(
        characterPerk.perkId,
        characterPerk.rank,
        character.attributes,
      );

      if (effects.length > 0) {
        allEffects.push({
          perkName: characterPerk.perk.name,
          rank: characterPerk.rank,
          effects,
        });
      }
    }

    return allEffects;
  }
}
