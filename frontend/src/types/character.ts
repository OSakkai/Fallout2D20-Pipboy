export type Origin =
  | 'VAULT_DWELLER'
  | 'SURVIVOR'
  | 'GHOUL'
  | 'SUPER_MUTANT'
  | 'BROTHERHOOD'
  | 'MISTER_HANDY';

export type Skill =
  | 'ATHLETICS'
  | 'BARTER'
  | 'BIG_GUNS'
  | 'ENERGY_WEAPONS'
  | 'EXPLOSIVES'
  | 'LOCKPICK'
  | 'MEDICINE'
  | 'MELEE_WEAPONS'
  | 'PILOT'
  | 'REPAIR'
  | 'SCIENCE'
  | 'SMALL_GUNS'
  | 'SNEAK'
  | 'SPEECH'
  | 'SURVIVAL'
  | 'THROWING'
  | 'UNARMED';

export interface SPECIALAttributes {
  strength: number;
  perception: number;
  endurance: number;
  charisma: number;
  intelligence: number;
  agility: number;
  luck: number;
}

export interface OriginData {
  id: Origin;
  name: string;
  description: string;
  specialModifiers: Partial<SPECIALAttributes>;
  startingSkillPoints: number;
  suggestedTagSkills: Skill[];
  flavorText: string;
}

export interface SkillData {
  id: Skill;
  name: string;
  attribute: keyof SPECIALAttributes;
  description: string;
}

export interface CharacterCreationData {
  // Campaign
  campaignId?: string;
  campaignName?: string;
  campaignDescription?: string;

  // Basic Info
  characterName: string;

  // Origin
  origin: Origin;

  // SPECIAL
  special: SPECIALAttributes;

  // Skills
  tagSkills: Skill[];
  skillRanks: Partial<Record<Skill, number>>;

  // Computed
  level: number;
  maxHP: number;
  defense: number;
  initiative: number;
  meleeDamage: number;
}
