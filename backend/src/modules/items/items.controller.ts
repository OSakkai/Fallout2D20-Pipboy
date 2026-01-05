import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('items')
@Controller('items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ItemsController {
  constructor(private itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar item ao inventário', description: 'Cria um novo item no inventário de um personagem' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        characterId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
        name: { type: 'string', example: 'Stimpak' },
        type: { type: 'string', enum: ['WEAPON', 'ARMOR', 'AID', 'MISC', 'AMMO'], example: 'AID' },
        quantity: { type: 'number', example: 5, default: 1 },
        weight: { type: 'number', example: 0.5 },
        value: { type: 'number', example: 20 },
        description: { type: 'string', example: 'Restaura 30 HP' }
      },
      required: ['characterId', 'name', 'type']
    }
  })
  @ApiResponse({ status: 201, description: 'Item adicionado ao inventário' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async create(@Body() body: any) {
    return this.itemsService.create(body.characterId, body);
  }

  @Get('character/:characterId')
  @ApiOperation({ summary: 'Listar inventário do personagem', description: 'Retorna todos os itens do inventário de um personagem' })
  @ApiParam({ name: 'characterId', description: 'UUID do personagem', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Lista de itens do inventário' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAllByCharacter(@Param('characterId') characterId: string) {
    return this.itemsService.findAllByCharacter(characterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar item por ID', description: 'Retorna detalhes de um item específico' })
  @ApiParam({ name: 'id', description: 'UUID do item', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Item encontrado' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar item', description: 'Atualiza quantidade, peso ou outras propriedades de um item' })
  @ApiParam({ name: 'id', description: 'UUID do item', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        quantity: { type: 'number' },
        weight: { type: 'number' },
        value: { type: 'number' },
        description: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Item atualizado' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.itemsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover item do inventário', description: 'Remove permanentemente um item do inventário' })
  @ApiParam({ name: 'id', description: 'UUID do item', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Item removido' })
  @ApiResponse({ status: 404, description: 'Item não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async delete(@Param('id') id: string) {
    return this.itemsService.delete(id);
  }
}
