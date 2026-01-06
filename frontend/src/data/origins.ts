import type { OriginData, Skill } from '../types/character';

export const ORIGINS: Record<string, OriginData> = {
  VAULT_DWELLER: {
    id: 'VAULT_DWELLER',
    name: 'Vault Dweller',
    description: 'Born and raised in the safety of a Vault, sheltered from the horrors of the Wasteland.',
    specialModifiers: {
      intelligence: 1,
      endurance: 1,
    },
    startingSkillPoints: 42,
    suggestedTagSkills: ['SCIENCE', 'REPAIR', 'MEDICINE'],
    flavorText: 'Growing up in a Vault has made you resourceful with technology and knowledgeable about pre-war science.',
  },
  WASTELANDER: {
    id: 'WASTELANDER',
    name: 'Wastelander',
    description: 'Hardened by life in the harsh Wasteland, you know how to survive against all odds.',
    specialModifiers: {
      endurance: 1,
      luck: 1,
    },
    startingSkillPoints: 42,
    suggestedTagSkills: ['SURVIVAL', 'SNEAK', 'SMALL_GUNS'],
    flavorText: 'Life in the Wasteland has taught you to be tough, resourceful, and always ready for danger.',
  },
  GHOUL: {
    id: 'GHOUL',
    name: 'Ghoul',
    description: 'Transformed by radiation, you are immune to its effects but suffer social stigma.',
    specialModifiers: {
      endurance: 2,
      charisma: -1,
    },
    startingSkillPoints: 42,
    suggestedTagSkills: ['SURVIVAL', 'MEDICINE', 'SPEECH'],
    flavorText: 'Radiation made you nearly immortal, but the wasteland fears what it doesn\'t understand.',
  },
  SUPER_MUTANT: {
    id: 'SUPER_MUTANT',
    name: 'Super Mutant',
    description: 'Created through FEV exposure, you possess immense strength but reduced intellect.',
    specialModifiers: {
      strength: 3,
      endurance: 2,
      intelligence: -2,
      charisma: -1,
    },
    startingSkillPoints: 42,
    suggestedTagSkills: ['MELEE_WEAPONS', 'BIG_GUNS', 'ATHLETICS'],
    flavorText: 'The FEV virus made you a towering giant of muscle and resilience, but at a cognitive cost.',
  },
  BROTHERHOOD_INITIATE: {
    id: 'BROTHERHOOD_INITIATE',
    name: 'Brotherhood Initiate',
    description: 'Trained by the Brotherhood of Steel, you are skilled in technology and combat.',
    specialModifiers: {
      strength: 1,
      intelligence: 1,
    },
    startingSkillPoints: 42,
    suggestedTagSkills: ['ENERGY_WEAPONS', 'SCIENCE', 'REPAIR'],
    flavorText: 'The Brotherhood has trained you in the ways of technology preservation and tactical warfare.',
  },
  ROBOT: {
    id: 'ROBOT',
    name: 'Robot',
    description: 'A mechanical being, immune to biological hazards but dependent on repairs.',
    specialModifiers: {
      strength: 2,
      endurance: 2,
      charisma: -2,
    },
    startingSkillPoints: 42,
    suggestedTagSkills: ['REPAIR', 'SCIENCE', 'ENERGY_WEAPONS'],
    flavorText: 'You are a machine, efficient and logical, but struggling to understand organic life.',
  },
};

export const getOriginModifiers = (originId: string) => {
  return ORIGINS[originId]?.specialModifiers || {};
};

export const getSuggestedTagSkills = (originId: string): Skill[] => {
  return ORIGINS[originId]?.suggestedTagSkills || [];
};
