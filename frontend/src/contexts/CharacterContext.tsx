import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CharacterAttributes {
  strength: number;
  perception: number;
  endurance: number;
  charisma: number;
  intelligence: number;
  agility: number;
  luck: number;
}

interface DerivedStats {
  defense: number;
  initiative: number;
  meleeDamage: number;
  maxHP: number;
  currentHP: number;
  carryWeightMax: number;
  carryWeightCurrent: number;
  maxLuckPoints: number;
  poisonDR: number;
}

interface BodyLocation {
  id: string;
  location: string;
  diceRange: string;
  maxHP: number;
  currentHP: number;
  physicalDR: number;
  energyDR: number;
  radiationDR: number;
}

interface CharacterSkill {
  skill: string;
  rank: number;
  isTagged: boolean;
}

interface CharacterPerk {
  id: string;
  rank: number;
  acquiredAtLevel: number;
  perk: {
    id: string;
    name: string;
    ranks: number;
    requirements: any;
    condition: string;
    benefit: string;
    mechanicalEffects?: any;
    corebookPage?: number;
  };
}

interface Character {
  id: string;
  name: string;
  level: number;
  xpCurrent: number;
  xpToNext: number;
  origin: string;
  attributes: CharacterAttributes;
  skills: CharacterSkill[];
  derivedStats: DerivedStats;
  bodyLocations: BodyLocation[];
  perks: CharacterPerk[];
  inventory: any[];
}

interface CharacterContextType {
  character: Character | null;
  loading: boolean;
  error: string | null;
  loadCharacter: (characterId: string) => Promise<void>;
  refreshCharacter: () => Promise<void>;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};

interface CharacterProviderProps {
  children: ReactNode;
}

export const CharacterProvider = ({ children }: CharacterProviderProps) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : `http://${window.location.hostname}:3000`;

  const loadCharacter = async (characterId: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiUrl}/characters/${characterId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load character');
      }

      const data = await response.json();
      setCharacter(data);
      localStorage.setItem('selectedCharacterId', characterId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load character');
      console.error('Error loading character:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshCharacter = async () => {
    if (!character) return;
    await loadCharacter(character.id);
  };

  // Auto-load character from localStorage on mount
  useEffect(() => {
    const savedCharacterId = localStorage.getItem('selectedCharacterId');
    if (savedCharacterId) {
      loadCharacter(savedCharacterId);
    }
  }, []);

  return (
    <CharacterContext.Provider value={{ character, loading, error, loadCharacter, refreshCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
};
