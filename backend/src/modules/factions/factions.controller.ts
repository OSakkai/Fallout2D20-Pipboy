import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FactionsService } from './factions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFactionDto } from './dto/create-faction.dto';
import { UpdateReputationDto, AdjustReputationDto } from './dto/update-reputation.dto';

@ApiTags('factions')
@Controller('factions')
export class FactionsController {
  constructor(private factionsService: FactionsService) {}

  // ============================================================================
  // FACTION ENDPOINTS
  // ============================================================================

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[ADMIN] Criar Facção',
    description: 'Cria uma nova facção no jogo'
  })
  @ApiResponse({ status: 201, description: 'Facção criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async createFaction(@Body() dto: CreateFactionDto) {
    return this.factionsService.createFaction(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar Todas as Facções',
    description: 'Retorna todas as facções disponíveis no jogo'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de facções',
    schema: {
      example: [
        {
          id: 'faction-uuid-123',
          name: 'Brotherhood of Steel',
          description: 'Technological zealots...',
          imageUrl: '/assets/images/factions/brotherhood.png'
        }
      ]
    }
  })
  async findAllFactions() {
    return this.factionsService.findAllFactions();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar Facção por ID',
    description: 'Retorna detalhes de uma facção específica'
  })
  @ApiParam({ name: 'id', description: 'UUID da facção' })
  @ApiResponse({ status: 200, description: 'Facção encontrada' })
  @ApiResponse({ status: 404, description: 'Facção não encontrada' })
  async findFactionById(@Param('id') id: string) {
    return this.factionsService.findFactionById(id);
  }

  // ============================================================================
  // REPUTATION ENDPOINTS
  // ============================================================================

  @Get('reputations/character/:characterId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Listar Reputações do Personagem',
    description: 'Retorna todas as reputações do personagem com diferentes facções'
  })
  @ApiParam({ name: 'characterId', description: 'UUID do personagem' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reputações',
    schema: {
      example: [
        {
          id: 'rep-uuid-123',
          level: 'LIKED',
          points: 60,
          faction: {
            id: 'faction-uuid-123',
            name: 'Brotherhood of Steel',
            imageUrl: '/assets/images/factions/brotherhood.png'
          }
        }
      ]
    }
  })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getCharacterReputations(@Param('characterId') characterId: string) {
    return this.factionsService.getCharacterReputations(characterId);
  }

  @Put('reputations/character/:characterId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[DEV] Definir Reputação',
    description: 'Define o nível e/ou pontos de reputação com uma facção'
  })
  @ApiParam({ name: 'characterId', description: 'UUID do personagem' })
  @ApiResponse({ status: 200, description: 'Reputação atualizada' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Personagem ou facção não encontrados' })
  async setReputation(
    @Param('characterId') characterId: string,
    @Body() dto: UpdateReputationDto
  ) {
    return this.factionsService.setReputation(characterId, dto);
  }

  @Post('reputations/character/:characterId/adjust')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: '[DEV] Ajustar Reputação',
    description: 'Adiciona ou remove pontos de reputação (calcula nível automaticamente)'
  })
  @ApiParam({ name: 'characterId', description: 'UUID do personagem' })
  @ApiResponse({ status: 200, description: 'Reputação ajustada' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 404, description: 'Personagem ou facção não encontrados' })
  async adjustReputation(
    @Param('characterId') characterId: string,
    @Body() dto: AdjustReputationDto
  ) {
    return this.factionsService.adjustReputation(characterId, dto);
  }
}
