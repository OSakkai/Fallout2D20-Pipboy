import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateFactionDto } from './dto/create-faction.dto';
import { UpdateReputationDto, AdjustReputationDto, ReputationLevel } from './dto/update-reputation.dto';

@Injectable()
export class FactionsService {
  constructor(private prisma: PrismaService) {}

  // ============================================================================
  // FACTION MANAGEMENT
  // ============================================================================

  async createFaction(dto: CreateFactionDto) {
    return this.prisma.faction.create({
      data: dto,
    });
  }

  async findAllFactions() {
    return this.prisma.faction.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findFactionById(id: string) {
    const faction = await this.prisma.faction.findUnique({
      where: { id },
    });

    if (!faction) {
      throw new NotFoundException(`Faction with ID ${id} not found`);
    }

    return faction;
  }

  // ============================================================================
  // REPUTATION MANAGEMENT
  // ============================================================================

  async getCharacterReputations(characterId: string) {
    return this.prisma.characterReputation.findMany({
      where: { characterId },
      include: {
        faction: true,
      },
      orderBy: {
        faction: { name: 'asc' },
      },
    });
  }

  async setReputation(characterId: string, dto: UpdateReputationDto) {
    // Check if character exists
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    // Check if faction exists
    await this.findFactionById(dto.factionId);

    // Calculate level based on points if only points provided
    let level = dto.level;
    if (!level && dto.points !== undefined) {
      level = this.calculateReputationLevel(dto.points);
    }

    // Upsert reputation
    return this.prisma.characterReputation.upsert({
      where: {
        characterId_factionId: {
          characterId,
          factionId: dto.factionId,
        },
      },
      create: {
        characterId,
        factionId: dto.factionId,
        level: level || ReputationLevel.NEUTRAL,
        points: dto.points || 0,
      },
      update: {
        ...(level && { level }),
        ...(dto.points !== undefined && { points: dto.points }),
      },
      include: {
        faction: true,
      },
    });
  }

  async adjustReputation(characterId: string, dto: AdjustReputationDto) {
    // Check if character exists
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException(`Character with ID ${characterId} not found`);
    }

    // Check if faction exists
    await this.findFactionById(dto.factionId);

    // Get current reputation or create if doesn't exist
    let reputation = await this.prisma.characterReputation.findUnique({
      where: {
        characterId_factionId: {
          characterId,
          factionId: dto.factionId,
        },
      },
    });

    const currentPoints = reputation?.points || 0;
    const newPoints = Math.max(-100, Math.min(100, currentPoints + dto.pointsChange));
    const newLevel = this.calculateReputationLevel(newPoints);

    return this.prisma.characterReputation.upsert({
      where: {
        characterId_factionId: {
          characterId,
          factionId: dto.factionId,
        },
      },
      create: {
        characterId,
        factionId: dto.factionId,
        level: newLevel,
        points: newPoints,
      },
      update: {
        points: newPoints,
        level: newLevel,
      },
      include: {
        faction: true,
      },
    });
  }

  private calculateReputationLevel(points: number): ReputationLevel {
    if (points >= 75) return ReputationLevel.IDOLIZED;
    if (points >= 50) return ReputationLevel.LIKED;
    if (points >= 25) return ReputationLevel.ACCEPTED;
    if (points >= -25) return ReputationLevel.NEUTRAL;
    if (points >= -50) return ReputationLevel.SHUNNED;
    return ReputationLevel.VILIFIED;
  }
}
