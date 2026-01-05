import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PartiesService } from './parties.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PartyStatus } from '@prisma/client';

@ApiTags('parties')
@Controller('parties')
export class PartiesController {
  constructor(private readonly partiesService: PartiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Criar nova partida', description: 'Cria uma nova sessão/partida de RPG com código único' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Aventura no Ermo' },
        maxPlayers: { type: 'number', example: 6, default: 6 }
      },
      required: ['name']
    }
  })
  @ApiResponse({ status: 201, description: 'Partida criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async createParty(
    @Request() req,
    @Body() createPartyDto: { name: string; maxPlayers?: number }
  ) {
    return this.partiesService.createParty(
      req.user.sub,
      createPartyDto.name,
      createPartyDto.maxPlayers
    );
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Buscar partida por código', description: 'Retorna detalhes da partida usando o código único' })
  @ApiParam({ name: 'code', description: 'Código da partida (6 caracteres)', example: 'ABC123' })
  @ApiResponse({ status: 200, description: 'Partida encontrada' })
  @ApiResponse({ status: 404, description: 'Partida não encontrada' })
  async getPartyByCode(@Param('code') code: string) {
    return this.partiesService.findPartyByCode(code);
  }

  @Get('my-parties')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar minhas partidas', description: 'Retorna todas as partidas onde o usuário é GM' })
  @ApiResponse({ status: 200, description: 'Lista de partidas' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async getMyParties(@Request() req) {
    return this.partiesService.findAllPartiesByGM(req.user.sub);
  }

  @Post(':code/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Entrar na partida', description: 'Adiciona um personagem à partida' })
  @ApiParam({ name: 'code', description: 'Código da partida', example: 'ABC123' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        characterId: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' }
      },
      required: ['characterId']
    }
  })
  @ApiResponse({ status: 201, description: 'Personagem entrou na partida' })
  @ApiResponse({ status: 400, description: 'Partida cheia ou personagem já está na partida' })
  async joinParty(
    @Param('code') code: string,
    @Body() joinDto: { characterId: string }
  ) {
    return this.partiesService.joinParty(code, joinDto.characterId);
  }

  @Post(':code/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Sair da partida', description: 'Remove um personagem da partida' })
  @ApiParam({ name: 'code', description: 'Código da partida', example: 'ABC123' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        characterId: { type: 'string', format: 'uuid' }
      },
      required: ['characterId']
    }
  })
  @ApiResponse({ status: 200, description: 'Personagem saiu da partida' })
  async leaveParty(
    @Param('code') code: string,
    @Body() leaveDto: { characterId: string }
  ) {
    return this.partiesService.leaveParty(code, leaveDto.characterId);
  }

  @Put(':code/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Atualizar status da partida', description: 'Muda status: ACTIVE, PAUSED ou FINISHED' })
  @ApiParam({ name: 'code', description: 'Código da partida', example: 'ABC123' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['ACTIVE', 'PAUSED', 'FINISHED'], example: 'ACTIVE' }
      },
      required: ['status']
    }
  })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  async updateStatus(
    @Param('code') code: string,
    @Body() statusDto: { status: PartyStatus }
  ) {
    return this.partiesService.updatePartyStatus(code, statusDto.status);
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Deletar partida', description: 'Remove partida permanentemente (apenas GM)' })
  @ApiParam({ name: 'code', description: 'Código da partida', example: 'ABC123' })
  @ApiResponse({ status: 200, description: 'Partida deletada' })
  @ApiResponse({ status: 400, description: 'Apenas o GM pode deletar' })
  async deleteParty(@Param('code') code: string, @Request() req) {
    return this.partiesService.deleteParty(code, req.user.sub);
  }
}
