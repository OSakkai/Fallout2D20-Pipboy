import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EncyclopediaService } from './encyclopedia.service';

@ApiTags('encyclopedia')
@Controller('encyclopedia')
export class EncyclopediaController {
  constructor(private readonly encyclopediaService: EncyclopediaService) {}

  @Get('weapons')
  @ApiOperation({ summary: 'Get all weapons with optional filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'weaponType', required: false })
  @ApiQuery({ name: 'rarity', required: false, type: Number })
  @ApiQuery({ name: 'minWeight', required: false, type: Number })
  @ApiQuery({ name: 'maxWeight', required: false, type: Number })
  @ApiQuery({ name: 'minCost', required: false, type: Number })
  @ApiQuery({ name: 'maxCost', required: false, type: Number })
  async getWeapons(
    @Query('search') search?: string,
    @Query('weaponType') weaponType?: string,
    @Query('rarity') rarity?: string,
    @Query('minWeight') minWeight?: string,
    @Query('maxWeight') maxWeight?: string,
    @Query('minCost') minCost?: string,
    @Query('maxCost') maxCost?: string,
  ) {
    return this.encyclopediaService.getWeapons({
      search,
      weaponType,
      rarity: rarity ? parseInt(rarity) : undefined,
      minWeight: minWeight ? parseFloat(minWeight) : undefined,
      maxWeight: maxWeight ? parseFloat(maxWeight) : undefined,
      minCost: minCost ? parseInt(minCost) : undefined,
      maxCost: maxCost ? parseInt(maxCost) : undefined,
    });
  }

  @Get('armor')
  @ApiOperation({ summary: 'Get all armor with optional filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'armorType', required: false })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'rarity', required: false, type: Number })
  @ApiQuery({ name: 'minWeight', required: false, type: Number })
  @ApiQuery({ name: 'maxWeight', required: false, type: Number })
  @ApiQuery({ name: 'minCost', required: false, type: Number })
  @ApiQuery({ name: 'maxCost', required: false, type: Number })
  async getArmor(
    @Query('search') search?: string,
    @Query('armorType') armorType?: string,
    @Query('location') location?: string,
    @Query('rarity') rarity?: string,
    @Query('minWeight') minWeight?: string,
    @Query('maxWeight') maxWeight?: string,
    @Query('minCost') minCost?: string,
    @Query('maxCost') maxCost?: string,
  ) {
    return this.encyclopediaService.getArmor({
      search,
      armorType,
      location,
      rarity: rarity ? parseInt(rarity) : undefined,
      minWeight: minWeight ? parseFloat(minWeight) : undefined,
      maxWeight: maxWeight ? parseFloat(maxWeight) : undefined,
      minCost: minCost ? parseInt(minCost) : undefined,
      maxCost: maxCost ? parseInt(maxCost) : undefined,
    });
  }

  @Get('consumables')
  @ApiOperation({ summary: 'Get all consumables with optional filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false, enum: ['AID', 'CHEM', 'FOOD', 'BEVERAGE'] })
  @ApiQuery({ name: 'rarity', required: false, type: Number })
  @ApiQuery({ name: 'minCost', required: false, type: Number })
  @ApiQuery({ name: 'maxCost', required: false, type: Number })
  async getConsumables(
    @Query('search') search?: string,
    @Query('category') category?: 'AID' | 'CHEM' | 'FOOD' | 'BEVERAGE',
    @Query('rarity') rarity?: string,
    @Query('minCost') minCost?: string,
    @Query('maxCost') maxCost?: string,
  ) {
    return this.encyclopediaService.getConsumables({
      search,
      category,
      rarity: rarity ? parseInt(rarity) : undefined,
      minCost: minCost ? parseInt(minCost) : undefined,
      maxCost: maxCost ? parseInt(maxCost) : undefined,
    });
  }

  @Get('mods')
  @ApiOperation({ summary: 'Get all mods with optional filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'modType', required: false })
  @ApiQuery({ name: 'modSlot', required: false })
  async getMods(
    @Query('search') search?: string,
    @Query('modType') modType?: string,
    @Query('modSlot') modSlot?: string,
  ) {
    return this.encyclopediaService.getMods({
      search,
      modType,
      modSlot,
    });
  }

  @Get('perks')
  @ApiOperation({ summary: 'Get all perks with optional filters' })
  @ApiQuery({ name: 'search', required: false })
  async getPerks(@Query('search') search?: string) {
    return this.encyclopediaService.getPerks({ search });
  }

  @Get('ammo')
  @ApiOperation({ summary: 'Get all ammo with optional filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'ammoType', required: false })
  @ApiQuery({ name: 'rarity', required: false, type: Number })
  async getAmmo(
    @Query('search') search?: string,
    @Query('ammoType') ammoType?: string,
    @Query('rarity') rarity?: string,
  ) {
    return this.encyclopediaService.getAmmo({
      search,
      ammoType,
      rarity: rarity ? parseInt(rarity) : undefined,
    });
  }

  @Get('magazines')
  @ApiOperation({ summary: 'Get all magazines with optional filters' })
  @ApiQuery({ name: 'search', required: false })
  async getMagazines(@Query('search') search?: string) {
    return this.encyclopediaService.getMagazines({ search });
  }

  @Get('tools')
  @ApiOperation({ summary: 'Get all tools with optional filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'rarity', required: false, type: Number })
  async getTools(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('rarity') rarity?: string,
  ) {
    return this.encyclopediaService.getTools({
      search,
      category,
      rarity: rarity ? parseInt(rarity) : undefined,
    });
  }

  @Get(':type/:id')
  @ApiOperation({ summary: 'Get single item by type and ID' })
  async getItemById(@Param('type') type: string, @Param('id') id: string) {
    return this.encyclopediaService.getItemById(type, id);
  }
}
