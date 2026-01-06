import { useCallback, useRef } from 'react';

export type PipBoySoundType =
  | 'boot'
  | 'beep'
  | 'transition'
  | 'changeCategory'
  | 'lightUp'
  | 'loading'
  | 'idle';

const SOUND_PATHS: Record<PipBoySoundType, string> = {
  boot: '/assets/sounds/bootPipboy.mp3',
  beep: '/assets/sounds/beepPipboy.mp3',
  transition: '/assets/sounds/transitiontoUIPipboy.mp3',
  changeCategory: '/assets/sounds/changingcategoryPipboy.mp3',
  lightUp: '/assets/sounds/lightupPipboy.mp3',
  loading: '/assets/sounds/loadingUIPipboy.mp3',
  idle: '/assets/sounds/idlesoundPipboy.mp3',
};

export const usePipBoySound = () => {
  const audioRefs = useRef<Map<PipBoySoundType, HTMLAudioElement>>(new Map());

  const playSound = useCallback((soundType: PipBoySoundType, volume: number = 0.5) => {
    try {
      let audio = audioRefs.current.get(soundType);

      if (!audio) {
        audio = new Audio(SOUND_PATHS[soundType]);
        audio.volume = volume;
        audioRefs.current.set(soundType, audio);
      }

      // Reset and play
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(err => {
        console.warn(`Failed to play sound ${soundType}:`, err);
      });
    } catch (error) {
      console.warn(`Error playing sound ${soundType}:`, error);
    }
  }, []);

  const stopSound = useCallback((soundType: PipBoySoundType) => {
    const audio = audioRefs.current.get(soundType);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    audioRefs.current.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  return {
    playSound,
    stopSound,
    stopAllSounds,
  };
};
