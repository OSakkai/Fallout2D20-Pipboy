import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ItemsService } from './items.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.itemsService.create(body.characterId, body);
  }

  @Get('character/:characterId')
  async findAllByCharacter(@Param('characterId') characterId: string) {
    return this.itemsService.findAllByCharacter(characterId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.itemsService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.itemsService.delete(id);
  }
}
