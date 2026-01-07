import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdateStatsDto {
  @ApiProperty({ description: 'HP atual', example: 50, minimum: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  currentHP?: number;

  @ApiProperty({ description: 'HP máximo', example: 100, minimum: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxHP?: number;

  @ApiProperty({ description: 'XP atual', example: 250, minimum: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  xpCurrent?: number;

  @ApiProperty({ description: 'Level', example: 3, minimum: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  level?: number;

  @ApiProperty({ description: 'Defense', example: 2, minimum: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  defense?: number;

  @ApiProperty({ description: 'Initiative', example: 15, minimum: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  initiative?: number;

  @ApiProperty({ description: 'Melee Damage', example: 3, minimum: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  meleeDamage?: number;
}
