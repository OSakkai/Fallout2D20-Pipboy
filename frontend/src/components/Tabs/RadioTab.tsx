import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { useSound } from '../../hooks/useSound';

const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  color: ${PIPBOY_COLORS.primary};
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

const RadioBox = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 40px;
  background: rgba(18, 255, 21, 0.05);
  border: 3px solid ${PIPBOY_COLORS.primary};
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(18, 255, 21, 0.3);
`;

const RadioTitle = styled.div`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
`;

const StationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
`;

const StationRow = styled(motion.div)<{ $active: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: ${props => props.$active ? 'rgba(18, 255, 21, 0.2)' : 'rgba(18, 255, 21, 0.05)'};
  border: 2px solid ${props => props.$active ? PIPBOY_COLORS.bright : PIPBOY_COLORS.primary};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  box-shadow: ${props => props.$active ? `0 0 15px rgba(18, 255, 21, 0.5)` : 'none'};

  &:hover {
    background: rgba(18, 255, 21, 0.15);
    border-color: ${PIPBOY_COLORS.bright};
  }
`;

const StationName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const StationFrequency = styled.div`
  font-size: 14px;
  opacity: 0.7;
`;

const NowPlaying = styled.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
  text-align: center;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const NowPlayingLabel = styled.div`
  font-size: 12px;
  opacity: 0.6;
  margin-bottom: 8px;
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};
`;

const NowPlayingTrack = styled.div`
  font-size: 16px;
  font-weight: bold;
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const ControlButton = styled(motion.button)<{ $active?: boolean }>`
  padding: 12px 24px;
  background: ${props => props.$active ? PIPBOY_COLORS.primary : 'transparent'};
  color: ${props => props.$active ? '#000' : PIPBOY_COLORS.primary};
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  text-shadow: ${props => props.$active ? 'none' : PIPBOY_TEXT_GLOW.subtle};

  &:hover {
    background: ${PIPBOY_COLORS.primary};
    color: #000;
    box-shadow: 0 0 15px rgba(18, 255, 21, 0.6);
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
`;

const VolumeLabel = styled.div`
  font-size: 14px;
  opacity: 0.7;
  min-width: 80px;
`;

const VolumeBar = styled.div`
  flex: 1;
  height: 8px;
  background: rgba(18, 255, 21, 0.2);
  border: 1px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
  position: relative;
  cursor: pointer;
`;

const VolumeFill = styled.div<{ $volume: number }>`
  height: 100%;
  width: ${props => props.$volume}%;
  background: ${PIPBOY_COLORS.primary};
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(18, 255, 21, 0.5);
  transition: width 0.2s;
`;

const VolumeValue = styled.div`
  font-size: 14px;
  min-width: 40px;
  text-align: right;
  font-weight: bold;
`;

interface RadioStation {
  id: string;
  name: string;
  frequency: string;
  description: string;
  tracks: string[];
}

const radioStations: RadioStation[] = [
  {
    id: 'dcr',
    name: 'Diamond City Radio',
    frequency: '101.5 MHz',
    description: 'Music from a more civilized time...',
    tracks: [
      'Anything Goes - Cole Porter',
      'Atom Bomb Baby - The Five Stars',
      'Butcher Pete (Part 1) - Roy Brown',
      'Civilization - Danny Kaye & The Andrews Sisters',
      'Crazy He Calls Me - Billie Holiday'
    ]
  },
  {
    id: 'classical',
    name: 'Classical Radio',
    frequency: '98.3 MHz',
    description: 'For the more refined wastelander.',
    tracks: [
      'Moonlight Sonata - Beethoven',
      'Waltz of the Flowers - Tchaikovsky',
      'Canon in D - Pachelbel',
      'Clair de Lune - Debussy'
    ]
  },
  {
    id: 'radio_freedom',
    name: 'Radio Freedom',
    frequency: '103.7 MHz',
    description: 'The voice of the Minutemen.',
    tracks: [
      'Minutemen Updates',
      'Settlement Notifications',
      'Recruitment Messages'
    ]
  }
];

export const RadioTab = () => {
  const [selectedStation, setSelectedStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const { playBeep } = useSound();

  const handleStationSelect = (station: RadioStation) => {
    playBeep();
    setSelectedStation(station);
    setCurrentTrackIndex(0);
  };

  const handlePlayPause = () => {
    playBeep();
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    if (selectedStation) {
      playBeep();
      setCurrentTrackIndex((prev) =>
        (prev + 1) % selectedStation.tracks.length
      );
    }
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.round((x / rect.width) * 100);
    setVolume(Math.max(0, Math.min(100, newVolume)));
  };

  return (
    <RadioContainer>
      <RadioBox>
        <RadioTitle>RADIO STATIONS</RadioTitle>

        <StationList>
          {radioStations.map((station) => (
            <StationRow
              key={station.id}
              $active={selectedStation?.id === station.id}
              onClick={() => handleStationSelect(station)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <StationName>{station.name}</StationName>
              <StationFrequency>{station.frequency}</StationFrequency>
            </StationRow>
          ))}
        </StationList>

        <NowPlaying>
          {selectedStation ? (
            <>
              <NowPlayingLabel>Now Playing on {selectedStation.name}</NowPlayingLabel>
              <NowPlayingTrack>
                {isPlaying ? selectedStation.tracks[currentTrackIndex] : 'PAUSED'}
              </NowPlayingTrack>
            </>
          ) : (
            <NowPlayingLabel>No Station Selected</NowPlayingLabel>
          )}
        </NowPlaying>

        <Controls>
          <ControlButton
            onClick={handlePlayPause}
            disabled={!selectedStation}
            $active={isPlaying}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? 'PAUSE' : 'PLAY'}
          </ControlButton>
          <ControlButton
            onClick={handleNextTrack}
            disabled={!selectedStation || !isPlaying}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            NEXT
          </ControlButton>
        </Controls>

        <VolumeControl>
          <VolumeLabel>VOLUME</VolumeLabel>
          <VolumeBar onClick={handleVolumeChange}>
            <VolumeFill $volume={volume} />
          </VolumeBar>
          <VolumeValue>{volume}%</VolumeValue>
        </VolumeControl>
      </RadioBox>
    </RadioContainer>
  );
};
