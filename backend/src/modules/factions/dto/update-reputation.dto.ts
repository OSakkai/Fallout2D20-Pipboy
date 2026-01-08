import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsInt, IsOptional } from 'class-validator';

export enum ReputationLevel {
  IDOLIZED = 'IDOLIZED',
  LIKED = 'LIKED',
  ACCEPTED = 'ACCEPTED',
  NEUTRAL = 'NEUTRAL',
  SHUNNED = 'SHUNNED',
  VILIFIED = 'VILIFIED',
}

export class UpdateReputationDto {
  @ApiProperty({ example: 'faction-uuid-123', description: 'ID da facção' })
  @IsString()
  @IsNotEmpty()
  factionId: string;

  @ApiPropertyOptional({ enum: ReputationLevel, example: ReputationLevel.LIKED, description: 'Nível de reputação' })
  @IsOptional()
  @IsEnum(ReputationLevel)
  level?: ReputationLevel;

  @ApiPropertyOptional({ example: 50, description: 'Pontos de reputação (0-100)' })
  @IsOptional()
  @IsInt()
  points?: number;
}

export class AdjustReputationDto {
  @ApiProperty({ example: 'faction-uuid-123', description: 'ID da facção' })
  @IsString()
  @IsNotEmpty()
  factionId: string;

  @ApiProperty({ example: 10, description: 'Pontos para adicionar (positivo) ou remover (negativo)' })
  @IsInt()
  pointsChange: number;
}
