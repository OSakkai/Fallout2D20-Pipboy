import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(characterId: string, data: {
    name: string;
    category: 'WEAPON' | 'APPAREL' | 'AID' | 'MISC' | 'JUNK' | 'AMMO';
    weight: number;
    value: number;
  }) {
    return this.prisma.item.create({
      data: {
        ...data,
        characterId,
      },
    });
  }

  async findAllByCharacter(characterId: string) {
    return this.prisma.item.findMany({
      where: { characterId },
    });
  }

  async findOne(id: string) {
    return this.prisma.item.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.item.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.item.delete({
      where: { id },
    });
  }
}
