import type { SkillData } from '../types/character';

export const SKILLS: SkillData[] = [
  {
    id: 'ATHLETICS',
    name: 'Athletics',
    attribute: 'strength',
    description: 'Physical prowess including climbing, jumping, and swimming.',
  },
  {
    id: 'BARTER',
    name: 'Barter',
    attribute: 'charisma',
    description: 'Negotiation and trade skills.',
  },
  {
    id: 'BIG_GUNS',
    name: 'Big Guns',
    attribute: 'endurance',
    description: 'Heavy weapons like miniguns, missile launchers, and flamers.',
  },
  {
    id: 'ENERGY_WEAPONS',
    name: 'Energy Weapons',
    attribute: 'perception',
    description: 'Laser rifles, plasma weapons, and other energy-based arms.',
  },
  {
    id: 'EXPLOSIVES',
    name: 'Explosives',
    attribute: 'perception',
    description: 'Handling grenades, mines, and explosive devices.',
  },
  {
    id: 'LOCKPICK',
    name: 'Lockpick',
    attribute: 'perception',
    description: 'Opening locks without keys.',
  },
  {
    id: 'MEDICINE',
    name: 'Medicine',
    attribute: 'intelligence',
    description: 'Healing injuries and treating illnesses.',
  },
  {
    id: 'MELEE_WEAPONS',
    name: 'Melee Weapons',
    attribute: 'strength',
    description: 'Close combat with swords, bats, and other melee weapons.',
  },
  {
    id: 'PILOT',
    name: 'Pilot',
    attribute: 'perception',
    description: 'Operating vehicles and aircraft.',
  },
  {
    id: 'REPAIR',
    name: 'Repair',
    attribute: 'intelligence',
    description: 'Fixing machinery, robots, and equipment.',
  },
  {
    id: 'SCIENCE',
    name: 'Science',
    attribute: 'intelligence',
    description: 'Knowledge of chemistry, physics, and computer systems.',
  },
  {
    id: 'SMALL_GUNS',
    name: 'Small Guns',
    attribute: 'agility',
    description: 'Pistols, rifles, and submachine guns.',
  },
  {
    id: 'SNEAK',
    name: 'Sneak',
    attribute: 'agility',
    description: 'Moving silently and staying hidden.',
  },
  {
    id: 'SPEECH',
    name: 'Speech',
    attribute: 'charisma',
    description: 'Persuasion, deception, and intimidation.',
  },
  {
    id: 'SURVIVAL',
    name: 'Survival',
    attribute: 'endurance',
    description: 'Finding food, water, and shelter in the Wasteland.',
  },
  {
    id: 'THROWING',
    name: 'Throwing',
    attribute: 'agility',
    description: 'Accuracy with thrown weapons and objects.',
  },
  {
    id: 'UNARMED',
    name: 'Unarmed',
    attribute: 'strength',
    description: 'Hand-to-hand combat and martial arts.',
  },
];

export const getSkillByAttribute = (attribute: string): SkillData[] => {
  return SKILLS.filter(skill => skill.attribute === attribute);
};

export const getSkillInfo = (skillId: string): SkillData | undefined => {
  return SKILLS.find(skill => skill.id === skillId);
};
