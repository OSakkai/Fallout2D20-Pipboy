import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsBoolean, IsOptional } from 'class-validator';

export class AddInventoryItemDto {
  @ApiProperty({ description: 'ID do item (weapon, armor, consumable, etc.)', example: 'cmk2k22bp000q1tdrja0jcfyj' })
  @IsUUID()
  itemId: string;

  @ApiProperty({ description: 'Tipo do item (WEAPON, ARMOR, CONSUMABLE, AMMO, etc.)', example: 'WEAPON' })
  itemType: 'WEAPON' | 'ARMOR' | 'CONSUMABLE' | 'AMMO' | 'MOD' | 'MAGAZINE' | 'TOOL';

  @ApiProperty({ description: 'Quantidade', example: 1, minimum: 1, required: false, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiProperty({ description: 'Item está equipado?', example: false, required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isEquipped?: boolean;
}
