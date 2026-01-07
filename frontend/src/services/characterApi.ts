import type { CharacterCreationData } from '../types/character';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface CreateCharacterResponse {
  id: string;
  name: string;
  level: number;
  origin: string;
  attributes: {
    strength: number;
    perception: number;
    endurance: number;
    charisma: number;
    intelligence: number;
    agility: number;
    luck: number;
  };
  skills: Array<{
    skill: string;
    rank: number;
    isTagged: boolean;
  }>;
  derivedStats: {
    maxHP: number;
    currentHP: number;
    defense: number;
    initiative: number;
    meleeDamage: number;
    carryWeightMax: number;
    maxLuckPoints: number;
  };
  bodyLocations: Array<{
    location: string;
    maxHP: number;
    currentHP: number;
    armorPhysical: number;
    armorEnergy: number;
    armorRadiation: number;
  }>;
  campaign: {
    id: string;
    name: string;
    description: string | null;
  };
}

/**
 * Creates a new character using the wizard data
 */
export async function createCharacterFromWizard(
  data: CharacterCreationData,
  token: string
): Promise<CreateCharacterResponse> {
  const response = await fetch(`${API_URL}/characters/wizard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create character');
  }

  return response.json();
}

/**
 * Gets all characters for the authenticated user
 */
export async function getMyCharacters(token: string): Promise<CreateCharacterResponse[]> {
  const response = await fetch(`${API_URL}/characters`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch characters');
  }

  return response.json();
}

/**
 * Gets a single character by ID
 */
export async function getCharacterById(id: string, token: string): Promise<CreateCharacterResponse> {
  const response = await fetch(`${API_URL}/characters/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch character');
  }

  return response.json();
}

/**
 * Deletes a character by ID
 */
export async function deleteCharacter(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/characters/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete character');
  }
}
