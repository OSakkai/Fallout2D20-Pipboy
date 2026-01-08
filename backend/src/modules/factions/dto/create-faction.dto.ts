import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateFactionDto {
  @ApiProperty({ example: 'Brotherhood of Steel', description: 'Nome da facção' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Technological zealots dedicated to preserving pre-war technology', description: 'Descrição da facção' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '/assets/images/factions/brotherhood.png', description: 'URL da imagem da facção' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
