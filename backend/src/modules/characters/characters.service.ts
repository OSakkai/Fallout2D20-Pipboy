import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class CharactersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    name: string;
    strength?: number;
    perception?: number;
    endurance?: number;
    charisma?: number;
    intelligence?: number;
    agility?: number;
    luck?: number;
    maxHP: number;
  }) {
    return this.prisma.character.create({
      data: {
        ...data,
        currentHP: data.maxHP,
        userId,
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.character.findMany({
      where: { userId },
      include: { inventory: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.character.findUnique({
      where: { id },
      include: { inventory: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.character.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.character.delete({
      where: { id },
    });
  }
}
