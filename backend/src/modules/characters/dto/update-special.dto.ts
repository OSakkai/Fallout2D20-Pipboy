import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateSPECIALDto {
  @ApiProperty({ description: 'Strength', example: 7, minimum: 1, maximum: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  strength?: number;

  @ApiProperty({ description: 'Perception', example: 6, minimum: 1, maximum: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  perception?: number;

  @ApiProperty({ description: 'Endurance', example: 8, minimum: 1, maximum: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  endurance?: number;

  @ApiProperty({ description: 'Charisma', example: 5, minimum: 1, maximum: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  charisma?: number;

  @ApiProperty({ description: 'Intelligence', example: 9, minimum: 1, maximum: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  intelligence?: number;

  @ApiProperty({ description: 'Agility', example: 7, minimum: 1, maximum: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  agility?: number;

  @ApiProperty({ description: 'Luck', example: 6, minimum: 1, maximum: 10, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  luck?: number;
}
