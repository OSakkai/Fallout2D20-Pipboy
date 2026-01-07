import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CharactersService } from './characters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCharacterDto } from './dto/create-character.dto';

@ApiTags('characters')
@Controller('characters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Post('wizard')
  @ApiOperation({
    summary: 'Criar personagem via wizard',
    description: 'Cria um personagem completo com todos os dados do wizard de criação (SPECIAL, skills, origin, etc.)'
  })
  @ApiBody({ type: CreateCharacterDto })
  @ApiResponse({
    status: 201,
    description: 'Personagem criado com sucesso com todos os atributos, skills e stats derivados',
    schema: {
      example: {
        id: 'clxyz123abc',
        name: 'Vault Dweller',
        level: 1,
        origin: 'VAULT_DWELLER',
        attributes: {
          strength: 5,
          perception: 6,
          endurance: 5,
          charisma: 4,
          intelligence: 7,
          agility: 6,
          luck: 5
        },
        skills: [
          { skill: 'SMALL_GUNS', rank: 2, isTagged: true },
          { skill: 'LOCKPICK', rank: 1, isTagged: true },
          { skill: 'SPEECH', rank: 2, isTagged: true }
        ],
        derivedStats: {
          maxHP: 60,
          currentHP: 60,
          defense: 1,
          initiative: 2,
          meleeDamage: 1
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada (se campaignId fornecido)' })
  async createFromWizard(@Request() req, @Body() dto: CreateCharacterDto) {
    return this.charactersService.createFromWizard(req.user.id, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar meus personagens',
    description: 'Retorna todos os personagens do usuário autenticado com attributes e derivedStats'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de personagens',
    schema: {
      example: [
        {
          id: 'clxyz123abc',
          name: 'Vault Dweller',
          level: 1,
          origin: 'VAULT_DWELLER',
          campaign: {
            id: 'camp123',
            name: 'Wasteland Chronicles',
            description: 'A journey through the wasteland'
          },
          attributes: { strength: 5, perception: 6 },
          derivedStats: { maxHP: 60, currentHP: 60 }
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@Request() req) {
    return this.charactersService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar personagem por ID',
    description: 'Retorna detalhes completos de um personagem incluindo SPECIAL, skills, perks, inventory, body locations'
  })
  @ApiParam({ name: 'id', description: 'UUID do personagem', example: 'clxyz123abc' })
  @ApiResponse({
    status: 200,
    description: 'Personagem encontrado com todos os detalhes',
    schema: {
      example: {
        id: 'clxyz123abc',
        name: 'Vault Dweller',
        level: 1,
        origin: 'VAULT_DWELLER',
        attributes: { strength: 5, perception: 6, endurance: 5, charisma: 4, intelligence: 7, agility: 6, luck: 5 },
        skills: [
          { skill: 'SMALL_GUNS', rank: 2, isTagged: true },
          { skill: 'LOCKPICK', rank: 1, isTagged: true }
        ],
        derivedStats: { maxHP: 60, currentHP: 60, defense: 1, initiative: 2, meleeDamage: 1 },
        bodyLocations: [
          { location: 'HEAD', maxHP: 12, currentHP: 12, armorPhysical: 0 },
          { location: 'TORSO', maxHP: 24, currentHP: 24, armorPhysical: 0 }
        ],
        perks: [],
        inventory: [],
        campaign: {
          id: 'camp123',
          name: 'Wasteland Chronicles',
          gm: { id: 'user123', username: 'GameMaster' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Personagem não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findOne(@Param('id') id: string) {
    return this.charactersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar personagem',
    description: 'Atualiza informações básicas de um personagem (nome, level, XP, etc.)'
  })
  @ApiParam({ name: 'id', description: 'UUID do personagem', example: 'clxyz123abc' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'New Character Name' },
        level: { type: 'number', example: 2 },
        xpCurrent: { type: 'number', example: 150 }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Personagem atualizado' })
  @ApiResponse({ status: 404, description: 'Personagem não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.charactersService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deletar personagem',
    description: 'Remove permanentemente um personagem e todos os seus dados relacionados'
  })
  @ApiParam({ name: 'id', description: 'UUID do personagem', example: 'clxyz123abc' })
  @ApiResponse({ status: 200, description: 'Personagem deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Personagem não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async delete(@Param('id') id: string) {
    return this.charactersService.delete(id);
  }

  // ============= DEV/CHEAT ENDPOINTS =============

  @Put(':id/special')
  @ApiOperation({
    summary: '[DEV] Atualizar SPECIAL',
    description: 'Atualiza atributos SPECIAL do personagem (para testes/cheats)'
  })
  @ApiParam({ name: 'id', description: 'UUID do personagem' })
  @ApiResponse({ status: 200, description: 'SPECIAL atualizado' })
  async updateSPECIAL(@Param('id') id: string, @Body() dto: any) {
    return this.charactersService.updateSPECIAL(id, dto);
  }

  @Put(':id/skill')
  @ApiOperation({
    summary: '[DEV] Atualizar Skill',
    description: 'Atualiza rank de uma skill específica (para testes/cheats)'
  })
  @ApiParam({ name: 'id', description: 'UUID do personagem' })
  @ApiResponse({ status: 200, description: 'Skill atualizada' })
  async updateSkill(@Param('id') id: string, @Body() dto: any) {
    return this.charactersService.updateSkill(id, dto.skill, dto.rank);
  }

  @Put(':id/stats')
  @ApiOperation({
    summary: '[DEV] Atualizar Stats',
    description: 'Atualiza HP, XP, Level, Defense, etc (para testes/cheats)'
  })
  @ApiParam({ name: 'id', description: 'UUID do personagem' })
  @ApiResponse({ status: 200, description: 'Stats atualizados' })
  async updateStats(@Param('id') id: string, @Body() dto: any) {
    return this.charactersService.updateStats(id, dto);
  }

  @Post(':id/damage')
  @ApiOperation({
    summary: '[DEV] Aplicar Dano',
    description: 'Aplica dano ao personagem (HP geral ou localização específica)'
  })
  @ApiParam({ name: 'id', description: 'UUID do personagem' })
  @ApiResponse({ status: 200, description: 'Dano aplicado' })
  async applyDamage(@Param('id') id: string, @Body() dto: any) {
    return this.charactersService.applyDamage(id, dto.damage, dto.location);
  }

  @Post(':id/heal')
  @ApiOperation({
    summary: '[DEV] Curar',
    description: 'Cura HP do personagem (HP geral ou localização específica)'
  })
  @ApiParam({ name: 'id', description: 'UUID do personagem' })
  @ApiResponse({ status: 200, description: 'Cura aplicada' })
  async heal(@Param('id') id: string, @Body() dto: any) {
    return this.charactersService.heal(id, dto.amount, dto.location);
  }

  @Post(':id/radiation')
  @ApiOperation({
    summary: '[DEV] Aplicar Radiação',
    description: 'Aplica radiação ao personagem'
  })
  @ApiParam({ name: 'id', description: 'UUID do personagem' })
  @ApiResponse({ status: 200, description: 'Radiação aplicada' })
  async applyRadiation(@Param('id') id: string, @Body() dto: any) {
    return this.charactersService.applyRadiation(id, dto.rads);
  }

  @Post(':id/poison')
  @ApiOperation({
    summary: '[DEV] Aplicar Veneno',
    description: 'Aplica veneno ao personagem'
  })
  @ApiParam({ name: 'id', description: 'UUID do personagem' })
  @ApiResponse({ status: 200, description: 'Veneno aplicado' })
  async applyPoison(@Param('id') id: string, @Body() dto: any) {
    return this.charactersService.applyPoison(id, dto.poisonLevel);
  }

  @Post(':id/inventory')
  @ApiOperation({
    summary: '[DEV] Adicionar Item ao Inventário',
    description: 'Adiciona um item (arma, armadura, consumível, etc.) ao inventário do personagem'
  })
  @ApiParam({ name: 'id', description: 'UUID do personagem' })
  @ApiResponse({ status: 200, description: 'Item adicionado ao inventário' })
  async addInventoryItem(@Param('id') id: string, @Body() dto: any) {
    return this.charactersService.addInventoryItem(
      id,
      dto.itemId,
      dto.itemType,
      dto.quantity || 1,
      dto.isEquipped || false
    );
  }

  @Delete(':id/inventory/:inventoryItemId')
  @ApiOperation({
    summary: '[DEV] Remover Item do Inventário',
    description: 'Remove um item do inventário do personagem'
  })
  @ApiParam({ name: 'id', description: 'UUID do personagem' })
  @ApiParam({ name: 'inventoryItemId', description: 'UUID do item no inventário' })
  @ApiResponse({ status: 200, description: 'Item removido do inventário' })
  async removeInventoryItem(@Param('id') id: string, @Param('inventoryItemId') inventoryItemId: string) {
    return this.charactersService.removeInventoryItem(id, inventoryItemId);
  }
}
