import { useCallback } from 'react';

// Hook simplificado para tocar sons customizados do Pip-Boy
export const useSound = () => {
  const playCategoryChange = useCallback(() => {
    try {
      // Tocar apenas o som custom do Fallout
      const audio = new Audio('/assets/sounds/changingcategoryPipboy.mp3');
      audio.volume = 0.7;
      audio.play().catch(err => console.warn('Failed to play category change sound:', err));
    } catch (error) {
      console.warn('Error playing category change sound:', error);
    }
  }, []);

  const playBeep = useCallback(() => {
    try {
      const audio = new Audio('/assets/sounds/beepPipboy.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.warn('Failed to play beep sound:', err));
    } catch (error) {
      console.warn('Error playing beep sound:', error);
    }
  }, []);

  return { playCategoryChange, playBeep };
};
