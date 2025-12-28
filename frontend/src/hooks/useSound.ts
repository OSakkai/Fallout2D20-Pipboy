import { useCallback } from 'react';
import { soundGenerator } from '../utils/soundGenerator';

export type SoundEffect =
  | 'click'
  | 'hover'
  | 'select'
  | 'tab_change'
  | 'boot'
  | 'error'
  | 'static';

// Hook para gerenciar sons do Pip-Boy usando Web Audio API
export const useSound = () => {
  const playSound = useCallback((sound: SoundEffect) => {
    try {
      switch (sound) {
        case 'click':
          soundGenerator.playClick();
          break;
        case 'hover':
          soundGenerator.playHover();
          break;
        case 'select':
          soundGenerator.playSelect();
          break;
        case 'tab_change':
          soundGenerator.playTabChange();
          break;
        case 'boot':
          soundGenerator.playBoot();
          break;
        case 'error':
          soundGenerator.playError();
          break;
        case 'static':
          soundGenerator.playStatic();
          break;
        default:
          console.warn(`Unknown sound effect: ${sound}`);
      }
    } catch (error) {
      console.warn(`Error playing sound ${sound}:`, error);
    }
  }, []);

  return { playSound };
};
