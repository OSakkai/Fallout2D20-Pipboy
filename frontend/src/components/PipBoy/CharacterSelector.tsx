import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';

interface Character {
  id: string;
  name: string;
  level: number;
  origin: string;
  attributes?: {
    strength: number;
    perception: number;
    endurance: number;
    charisma: number;
    intelligence: number;
    agility: number;
    luck: number;
  };
  derivedStats?: {
    currentHP: number;
    maxHP: number;
  };
}

interface CharacterSelectorProps {
  onCharacterSelect: (character: Character) => void;
  onClose: () => void;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(10px);
`;

const SelectorContainer = styled(motion.div)`
  background: rgba(2, 5, 2, 0.98);
  border: 3px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
  padding: 30px;
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow:
    0 0 30px rgba(18, 255, 21, 0.4),
    inset 0 0 40px rgba(18, 255, 21, 0.05);
`;

const Title = styled.div`
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 28px;
  color: ${PIPBOY_COLORS.bright};
  text-shadow: ${PIPBOY_TEXT_GLOW.intense};
  text-align: center;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const CharacterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const CharacterCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 3px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(18, 255, 21, 0.15);
    border-color: ${PIPBOY_COLORS.bright};
    box-shadow: 0 0 15px rgba(18, 255, 21, 0.3);
  }
`;

const CharacterName = styled.div`
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 20px;
  color: ${PIPBOY_COLORS.bright};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  margin-bottom: 10px;
`;

const CharacterInfo = styled.div`
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 14px;
  color: ${PIPBOY_COLORS.primary};
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const InfoItem = styled.span`
  &::before {
    content: '>';
    margin-right: 5px;
    color: ${PIPBOY_COLORS.bright};
  }
`;

const LoadingText = styled.div`
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 18px;
  color: ${PIPBOY_COLORS.primary};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  text-align: center;
  padding: 40px;
`;

const ErrorText = styled(LoadingText)`
  color: ${PIPBOY_COLORS.danger};
`;

const CloseButton = styled(motion.button)`
  margin-top: 20px;
  padding: 12px 30px;
  background: transparent;
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 3px;
  color: ${PIPBOY_COLORS.primary};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 16px;
  text-transform: uppercase;
  cursor: pointer;
  width: 100%;
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  transition: all 0.2s;

  &:hover {
    background: rgba(18, 255, 21, 0.2);
    border-color: ${PIPBOY_COLORS.bright};
    color: ${PIPBOY_COLORS.bright};
    box-shadow: 0 0 10px rgba(18, 255, 21, 0.3);
  }
`;

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ onCharacterSelect, onClose }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const apiUrl = window.location.hostname === 'localhost'
          ? 'http://localhost:3000'
          : `http://${window.location.hostname}:3000`;

        const response = await fetch(`${apiUrl}/characters`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch characters');
        }

        const data = await response.json();
        setCharacters(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load characters');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const handleSelect = (character: Character) => {
    onCharacterSelect(character);
  };

  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <SelectorContainer
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Title>SELECT CHARACTER</Title>

        {loading && <LoadingText>LOADING CHARACTERS...</LoadingText>}

        {error && <ErrorText>ERROR: {error}</ErrorText>}

        {!loading && !error && characters.length === 0 && (
          <LoadingText>NO CHARACTERS FOUND. CREATE ONE FIRST.</LoadingText>
        )}

        {!loading && !error && characters.length > 0 && (
          <CharacterList>
            {characters.map((char) => (
              <CharacterCard
                key={char.id}
                onClick={() => handleSelect(char)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CharacterName>{char.name}</CharacterName>
                <CharacterInfo>
                  <InfoItem>Level {char.level}</InfoItem>
                  <InfoItem>{char.origin}</InfoItem>
                  {char.derivedStats && (
                    <InfoItem>HP: {char.derivedStats.currentHP}/{char.derivedStats.maxHP}</InfoItem>
                  )}
                  {char.attributes && (
                    <InfoItem>
                      S:{char.attributes.strength} P:{char.attributes.perception} E:{char.attributes.endurance}
                    </InfoItem>
                  )}
                </CharacterInfo>
              </CharacterCard>
            ))}
          </CharacterList>
        )}

        <CloseButton
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </CloseButton>
      </SelectorContainer>
    </Overlay>
  );
};
