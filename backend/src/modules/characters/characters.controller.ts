import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CharactersService } from './characters.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('characters')
@Controller('characters')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar personagem', description: 'Cria um novo personagem para o usuário autenticado' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Vault-Tec' },
        level: { type: 'number', example: 1, default: 1 },
        special: {
          type: 'object',
          properties: {
            strength: { type: 'number', example: 5 },
            perception: { type: 'number', example: 5 },
            endurance: { type: 'number', example: 5 },
            charisma: { type: 'number', example: 5 },
            intelligence: { type: 'number', example: 5 },
            agility: { type: 'number', example: 5 },
            luck: { type: 'number', example: 5 }
          }
        },
        hp: { type: 'number', example: 100 },
        ap: { type: 'number', example: 10 },
        xp: { type: 'number', example: 0, default: 0 },
        caps: { type: 'number', example: 0, default: 0 }
      },
      required: ['name']
    }
  })
  @ApiResponse({ status: 201, description: 'Personagem criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async create(@Request() req, @Body() body: any) {
    return this.charactersService.create(req.user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Listar meus personagens', description: 'Retorna todos os personagens do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Lista de personagens' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@Request() req) {
    return this.charactersService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar personagem por ID', description: 'Retorna detalhes completos de um personagem específico' })
  @ApiParam({ name: 'id', description: 'UUID do personagem', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Personagem encontrado' })
  @ApiResponse({ status: 404, description: 'Personagem não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findOne(@Param('id') id: string) {
    return this.charactersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar personagem', description: 'Atualiza informações de um personagem (HP, AP, XP, CAPS, etc)' })
  @ApiParam({ name: 'id', description: 'UUID do personagem', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        level: { type: 'number' },
        hp: { type: 'number' },
        ap: { type: 'number' },
        xp: { type: 'number' },
        caps: { type: 'number' },
        special: { type: 'object' }
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
  @ApiOperation({ summary: 'Deletar personagem', description: 'Remove permanentemente um personagem' })
  @ApiParam({ name: 'id', description: 'UUID do personagem', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Personagem deletado' })
  @ApiResponse({ status: 404, description: 'Personagem não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async delete(@Param('id') id: string) {
    return this.charactersService.delete(id);
  }
}
