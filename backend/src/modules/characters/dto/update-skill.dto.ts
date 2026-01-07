import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Min, Max } from 'class-validator';

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

export class UpdateSkillDto {
  @ApiProperty({ enum: Skill, description: 'Nome da skill', example: 'SMALL_GUNS' })
  @IsEnum(Skill)
  skill: Skill;

  @ApiProperty({ description: 'Novo rank da skill', example: 3, minimum: 0, maximum: 6 })
  @IsInt()
  @Min(0)
  @Max(6)
  rank: number;
}
