import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsObject, IsArray, IsInt, Min, Max, IsOptional } from 'class-validator';

export enum Origin {
  VAULT_DWELLER = 'VAULT_DWELLER',
  SURVIVOR = 'SURVIVOR',
  GHOUL = 'GHOUL',
  SUPER_MUTANT = 'SUPER_MUTANT',
  BROTHERHOOD = 'BROTHERHOOD',
  MISTER_HANDY = 'MISTER_HANDY',
}

export enum Skill {
  ATHLETICS = 'ATHLETICS',
  BARTER = 'BARTER',
  BIG_GUNS = 'BIG_GUNS',
  ENERGY_WEAPONS = 'ENERGY_WEAPONS',
  EXPLOSIVES = 'EXPLOSIVES',
  LOCKPICK = 'LOCKPICK',
  MEDICINE = 'MEDICINE',
  MELEE_WEAPONS = 'MELEE_WEAPONS',
  PILOT = 'PILOT',
  REPAIR = 'REPAIR',
  SCIENCE = 'SCIENCE',
  SMALL_GUNS = 'SMALL_GUNS',
  SNEAK = 'SNEAK',
  SPEECH = 'SPEECH',
  SURVIVAL = 'SURVIVAL',
  THROWING = 'THROWING',
  UNARMED = 'UNARMED',
}

export class SPECIALDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 10, description: 'Strength attribute' })
  @IsInt()
  @Min(1)
  @Max(10)
  strength: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 10, description: 'Perception attribute' })
  @IsInt()
  @Min(1)
  @Max(10)
  perception: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 10, description: 'Endurance attribute' })
  @IsInt()
  @Min(1)
  @Max(10)
  endurance: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 10, description: 'Charisma attribute' })
  @IsInt()
  @Min(1)
  @Max(10)
  charisma: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 10, description: 'Intelligence attribute' })
  @IsInt()
  @Min(1)
  @Max(10)
  intelligence: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 10, description: 'Agility attribute' })
  @IsInt()
  @Min(1)
  @Max(10)
  agility: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 10, description: 'Luck attribute' })
  @IsInt()
  @Min(1)
  @Max(10)
  luck: number;
}

export class CreateCharacterDto {
  @ApiPropertyOptional({ example: 'campaign-id-123', description: 'Campaign ID (optional, can be set later)' })
  @IsOptional()
  @IsString()
  campaignId?: string;

  @ApiProperty({ example: 'Vault Dweller', description: 'Character name' })
  @IsString()
  @IsNotEmpty()
  characterName: string;

  @ApiProperty({ enum: Origin, example: Origin.VAULT_DWELLER, description: 'Character origin' })
  @IsEnum(Origin)
  origin: Origin;

  @ApiProperty({ type: SPECIALDto, description: 'SPECIAL attributes' })
  @IsObject()
  special: SPECIALDto;

  @ApiProperty({
    type: [String],
    enum: Skill,
    example: [Skill.SMALL_GUNS, Skill.LOCKPICK, Skill.SPEECH],
    description: 'Tag skills (3 skills)'
  })
  @IsArray()
  @IsEnum(Skill, { each: true })
  tagSkills: Skill[];

  @ApiProperty({
    type: 'object',
    example: { SMALL_GUNS: 2, LOCKPICK: 1, SPEECH: 2 },
    description: 'Skill ranks distribution'
  })
  @IsObject()
  skillRanks: Record<string, number>;

  @ApiProperty({ example: 1, description: 'Character level', default: 1 })
  @IsInt()
  @Min(1)
  level: number;

  @ApiProperty({ example: 60, description: 'Maximum HP' })
  @IsInt()
  @Min(1)
  maxHP: number;

  @ApiProperty({ example: 1, description: 'Defense value' })
  @IsInt()
  @Min(0)
  defense: number;

  @ApiProperty({ example: 2, description: 'Initiative bonus' })
  @IsInt()
  initiative: number;

  @ApiProperty({ example: 1, description: 'Melee damage bonus' })
  @IsInt()
  @Min(0)
  meleeDamage: number;
}
