import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class EncyclopediaService {
  constructor(private prisma: PrismaService) {}

  // WEAPONS
  async getWeapons(filters?: {
    search?: string;
    weaponType?: string;
    rarity?: number;
    minWeight?: number;
    maxWeight?: number;
    minCost?: number;
    maxCost?: number;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    if (filters?.weaponType) {
      where.weaponType = filters.weaponType;
    }

    if (filters?.rarity !== undefined) {
      where.rarity = filters.rarity;
    }

    if (filters?.minWeight !== undefined || filters?.maxWeight !== undefined) {
      where.weight = {};
      if (filters.minWeight !== undefined) where.weight.gte = filters.minWeight;
      if (filters.maxWeight !== undefined) where.weight.lte = filters.maxWeight;
    }

    if (filters?.minCost !== undefined || filters?.maxCost !== undefined) {
      where.cost = {};
      if (filters.minCost !== undefined) where.cost.gte = filters.minCost;
      if (filters.maxCost !== undefined) where.cost.lte = filters.maxCost;
    }

    return this.prisma.weaponMaster.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  // ARMOR
  async getArmor(filters?: {
    search?: string;
    armorType?: string;
    location?: string;
    rarity?: number;
    minWeight?: number;
    maxWeight?: number;
    minCost?: number;
    maxCost?: number;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    if (filters?.armorType) {
      where.armorType = filters.armorType;
    }

    if (filters?.location) {
      where.location = filters.location;
    }

    if (filters?.rarity !== undefined) {
      where.rarity = filters.rarity;
    }

    if (filters?.minWeight !== undefined || filters?.maxWeight !== undefined) {
      where.weight = {};
      if (filters.minWeight !== undefined) where.weight.gte = filters.minWeight;
      if (filters.maxWeight !== undefined) where.weight.lte = filters.maxWeight;
    }

    if (filters?.minCost !== undefined || filters?.maxCost !== undefined) {
      where.cost = {};
      if (filters.minCost !== undefined) where.cost.gte = filters.minCost;
      if (filters.maxCost !== undefined) where.cost.lte = filters.maxCost;
    }

    return this.prisma.armorMaster.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  // CONSUMABLES
  async getConsumables(filters?: {
    search?: string;
    category?: 'AID' | 'CHEM' | 'FOOD' | 'BEVERAGE';
    rarity?: number;
    minCost?: number;
    maxCost?: number;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.rarity !== undefined) {
      where.rarity = filters.rarity;
    }

    if (filters?.minCost !== undefined || filters?.maxCost !== undefined) {
      where.cost = {};
      if (filters.minCost !== undefined) where.cost.gte = filters.minCost;
      if (filters.maxCost !== undefined) where.cost.lte = filters.maxCost;
    }

    return this.prisma.consumableMaster.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  // MODS
  async getMods(filters?: {
    search?: string;
    modType?: string;
    modSlot?: string;
    rarity?: number;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    if (filters?.modType) {
      where.modType = filters.modType;
    }

    if (filters?.modSlot) {
      where.modSlot = filters.modSlot;
    }

    return this.prisma.modMaster.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  // PERKS
  async getPerks(filters?: {
    search?: string;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    return this.prisma.perkMaster.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  // AMMO
  async getAmmo(filters?: {
    search?: string;
    ammoType?: string;
    rarity?: number;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    if (filters?.ammoType) {
      where.ammoType = { contains: filters.ammoType, mode: 'insensitive' };
    }

    if (filters?.rarity !== undefined) {
      where.rarity = filters.rarity;
    }

    return this.prisma.ammoMaster.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  // MAGAZINES
  async getMagazines(filters?: {
    search?: string;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    return this.prisma.magazineMaster.findMany({
      where,
      include: {
        issues: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  // TOOLS
  async getTools(filters?: {
    search?: string;
    category?: string;
    rarity?: number;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.name = { contains: filters.search, mode: 'insensitive' };
    }

    if (filters?.category) {
      where.category = { contains: filters.category, mode: 'insensitive' };
    }

    if (filters?.rarity !== undefined) {
      where.rarity = filters.rarity;
    }

    return this.prisma.toolMaster.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  // Get single item by ID and type
  async getItemById(type: string, id: string) {
    switch (type) {
      case 'weapon':
        return this.prisma.weaponMaster.findUnique({ where: { id } });
      case 'armor':
        return this.prisma.armorMaster.findUnique({ where: { id } });
      case 'consumable':
        return this.prisma.consumableMaster.findUnique({ where: { id } });
      case 'mod':
        return this.prisma.modMaster.findUnique({ where: { id } });
      case 'perk':
        return this.prisma.perkMaster.findUnique({ where: { id } });
      case 'ammo':
        return this.prisma.ammoMaster.findUnique({ where: { id } });
      case 'magazine':
        return this.prisma.magazineMaster.findUnique({
          where: { id },
          include: { issues: true },
        });
      case 'tool':
        return this.prisma.toolMaster.findUnique({ where: { id } });
      default:
        return null;
    }
  }
}
