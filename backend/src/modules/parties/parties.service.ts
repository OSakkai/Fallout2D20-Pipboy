import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PartyStatus } from '@prisma/client';

@Injectable()
export class PartiesService {
  constructor(private prisma: PrismaService) {}

  async createParty(gmUserId: string, name: string, maxPlayers: number = 6) {
    const code = this.generateRoomCode();

    const party = await this.prisma.party.create({
      data: {
        code,
        name,
        gmUserId,
        maxPlayers,
        status: 'ACTIVE',
      },
      include: {
        gmUser: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        characters: {
          include: {
            character: {
              select: {
                id: true,
                name: true,
                level: true,
              },
            },
          },
        },
      },
    });

    return party;
  }

  async findPartyByCode(code: string) {
    const party = await this.prisma.party.findUnique({
      where: { code },
      include: {
        gmUser: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        characters: {
          where: {
            leftAt: null,
          },
          include: {
            character: {
              select: {
                id: true,
                name: true,
                level: true,
                currentHP: true,
                maxHP: true,
              },
            },
          },
        },
      },
    });

    if (!party) {
      throw new NotFoundException('Partida nao encontrada');
    }

    return party;
  }

  async findAllPartiesByGM(gmUserId: string) {
    return this.prisma.party.findMany({
      where: { gmUserId },
      include: {
        characters: {
          where: {
            leftAt: null,
          },
          include: {
            character: {
              select: {
                id: true,
                name: true,
                level: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async joinParty(partyCode: string, characterId: string) {
    const party = await this.findPartyByCode(partyCode);

    const activeCharacters = party.characters.filter(cp => cp.leftAt === null);
    if (activeCharacters.length >= party.maxPlayers) {
      throw new BadRequestException('Partida esta cheia');
    }

    const alreadyInParty = activeCharacters.find(
      cp => cp.character.id === characterId
    );
    if (alreadyInParty) {
      throw new BadRequestException('Personagem ja esta nesta partida');
    }

    const characterParty = await this.prisma.characterParty.create({
      data: {
        characterId,
        partyId: party.id,
      },
      include: {
        character: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
      },
    });

    return characterParty;
  }

  async leaveParty(partyCode: string, characterId: string) {
    const party = await this.findPartyByCode(partyCode);

    const characterParty = await this.prisma.characterParty.findFirst({
      where: {
        partyId: party.id,
        characterId,
        leftAt: null,
      },
    });

    if (!characterParty) {
      throw new NotFoundException('Personagem nao encontrado nesta partida');
    }

    return this.prisma.characterParty.update({
      where: { id: characterParty.id },
      data: { leftAt: new Date() },
    });
  }

  async updatePartyStatus(partyCode: string, status: PartyStatus) {
    const party = await this.findPartyByCode(partyCode);

    return this.prisma.party.update({
      where: { id: party.id },
      data: { status },
    });
  }

  async deleteParty(partyCode: string, gmUserId: string) {
    const party = await this.findPartyByCode(partyCode);

    if (party.gmUserId !== gmUserId) {
      throw new BadRequestException('Apenas o GM pode deletar a partida');
    }

    return this.prisma.party.delete({
      where: { id: party.id },
    });
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
