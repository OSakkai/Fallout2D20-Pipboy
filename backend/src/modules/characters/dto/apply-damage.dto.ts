import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsEnum, IsOptional } from 'class-validator';

export enum BodyLocation {
  HEAD = 'HEAD',
  TORSO = 'TORSO',
  LEFT_ARM = 'LEFT_ARM',
  RIGHT_ARM = 'RIGHT_ARM',
  LEFT_LEG = 'LEFT_LEG',
  RIGHT_LEG = 'RIGHT_LEG',
}

export class ApplyDamageDto {
  @ApiProperty({ description: 'Quantidade de dano', example: 10, minimum: 0 })
  @IsInt()
  @Min(0)
  damage: number;

  @ApiProperty({ enum: BodyLocation, description: 'Localização do corpo (opcional, se não fornecido aplica no HP geral)', required: false })
  @IsOptional()
  @IsEnum(BodyLocation)
  location?: BodyLocation;
}

export class ApplyRadiationDto {
  @ApiProperty({ description: 'Quantidade de radiação (RADs)', example: 50, minimum: 0 })
  @IsInt()
  @Min(0)
  rads: number;
}

export class ApplyPoisonDto {
  @ApiProperty({ description: 'Nível de veneno (poison level)', example: 2, minimum: 0 })
  @IsInt()
  @Min(0)
  poisonLevel: number;
}

export class HealDto {
  @ApiProperty({ description: 'Quantidade de HP para curar', example: 20, minimum: 0 })
  @IsInt()
  @Min(0)
  amount: number;

  @ApiProperty({ enum: BodyLocation, description: 'Localização do corpo (opcional, se não fornecido cura HP geral)', required: false })
  @IsOptional()
  @IsEnum(BodyLocation)
  location?: BodyLocation;
}
