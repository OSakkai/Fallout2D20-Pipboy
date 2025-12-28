// Tipos principais do sistema

export interface Player {
  id: string;
  name: string;
  character: Character;
  isOnline: boolean;
}

export interface Character {
  name: string;
  stats: Stats;
  inventory: InventoryItem[];
  quests: Quest[];
  health: number;
  maxHealth: number;
  radiation: number;
  ap: number;
  maxAp: number;
}

export interface Stats {
  strength: number;
  perception: number;
  endurance: number;
  charisma: number;
  intelligence: number;
  agility: number;
  luck: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'aid' | 'misc' | 'ammo';
  quantity: number;
  weight: number;
  value: number;
  equipped?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  objectives: QuestObjective[];
  completed: boolean;
  active: boolean;
}

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
}

export interface GameSession {
  id: string;
  hostId: string;
  players: Player[];
  createdAt: number;
  settings: GameSettings;
}

export interface GameSettings {
  maxPlayers: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'survival';
  allowPvP: boolean;
}

export type PipBoyTab = 'stat' | 'inv' | 'data' | 'map' | 'radio';
