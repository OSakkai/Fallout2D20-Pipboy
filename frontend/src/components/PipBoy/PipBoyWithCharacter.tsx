import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PipBoy } from './PipBoy';
import { CharacterSelector } from './CharacterSelector';
import { DevCheatsOverlay } from './DevCheatsOverlay';
import { CharacterProvider, useCharacter } from '../../contexts/CharacterContext';

interface Character {
  id: string;
  name: string;
  level: number;
  origin: string;
}

const PipBoyContent = () => {
  const { character, loadCharacter, refreshCharacter } = useCharacter();
  const [showCharacterSelector, setShowCharacterSelector] = useState(!character);
  const [showDevCheats, setShowDevCheats] = useState(false);

  // Show selector if no character is loaded
  useEffect(() => {
    if (!character) {
      setShowCharacterSelector(true);
    }
  }, [character]);

  // F12 para abrir menu de cheats
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        setShowDevCheats(!showDevCheats);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDevCheats]);

  const handleCharacterSelect = async (selectedChar: Character) => {
    await loadCharacter(selectedChar.id);
    setShowCharacterSelector(false);
  };

  const handleCloseSelector = () => {
    setShowCharacterSelector(false);
  };

  const handleCloseCheats = async () => {
    setShowDevCheats(false);
    // Refresh character data after using cheats
    await refreshCharacter();
  };

  return (
    <>
      <PipBoy />

      <AnimatePresence>
        {showCharacterSelector && (
          <CharacterSelector
            onCharacterSelect={handleCharacterSelect}
            onClose={handleCloseSelector}
          />
        )}

        {showDevCheats && (
          <DevCheatsOverlay
            characterId={character?.id || null}
            onClose={handleCloseCheats}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export const PipBoyWithCharacter = () => {
  return (
    <CharacterProvider>
      <PipBoyContent />
    </CharacterProvider>
  );
};
