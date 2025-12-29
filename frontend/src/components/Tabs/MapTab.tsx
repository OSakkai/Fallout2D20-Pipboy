import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { useSound } from '../../hooks/useSound';

const MapContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  color: ${PIPBOY_COLORS.primary};
`;

const SubNav = styled.div`
  display: flex;
  gap: clamp(20px, 5vw, 60px);
  padding: 10px 0;
  border-bottom: 2px solid ${PIPBOY_COLORS.primary};
  margin-bottom: 20px;
`;

const SubNavButton = styled.button<{ $active: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.$active ? PIPBOY_COLORS.bright : PIPBOY_COLORS.primary};
  font-size: clamp(18px, 2.5vw, 24px);
  font-weight: bold;
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  letter-spacing: clamp(1px, 0.15vw, 2px);
  cursor: pointer;
  padding: 8px 12px;
  opacity: ${props => props.$active ? 1 : 0.7};
  text-shadow: ${props => props.$active ? PIPBOY_TEXT_GLOW.standard : PIPBOY_TEXT_GLOW.subtle};
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  }

  @media (max-width: 1024px) {
    font-size: clamp(16px, 2.2vw, 20px);
    padding: 6px 10px;
  }

  @media (max-width: 768px) {
    font-size: clamp(14px, 2vw, 18px);
    padding: 5px 8px;
    letter-spacing: clamp(0.5px, 0.1vw, 1.5px);
  }

  @media (max-width: 480px) {
    font-size: clamp(11px, 1.8vw, 14px);
    padding: 4px 6px;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
  flex: 1;
  overflow-y: auto;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(18, 255, 21, 0.05);
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
  position: relative;
  min-height: 400px;
`;

const LocationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LocationRow = styled(motion.div)<{ $selected: boolean; $discovered?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: ${props => props.$selected ? 'rgba(18, 255, 21, 0.15)' : 'transparent'};
  border-left: ${props => props.$selected ? `3px solid ${PIPBOY_COLORS.primary}` : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${props => props.$discovered ? (props.$selected ? 1 : 0.8) : 0.4};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};

  &:hover {
    background: rgba(18, 255, 21, 0.1);
    opacity: ${props => props.$discovered ? 1 : 0.5};
  }
`;

const LocationName = styled.span`
  font-size: 16px;
  flex: 1;
`;

const LocationIcon = styled.span`
  font-size: 14px;
  opacity: 0.7;
`;

const MapGrid = styled.div`
  position: absolute;
  width: 90%;
  height: 90%;
  background-image:
    linear-gradient(${PIPBOY_COLORS.primary}20 1px, transparent 1px),
    linear-gradient(90deg, ${PIPBOY_COLORS.primary}20 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.3;
`;

const LocationMarker = styled(motion.div)<{ $x: number; $y: number; $active: boolean }>`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  width: 20px;
  height: 20px;
  border: 3px solid ${props => props.$active ? PIPBOY_COLORS.bright : PIPBOY_COLORS.primary};
  background: ${props => props.$active ? PIPBOY_COLORS.primary : 'transparent'};
  box-shadow: ${props => props.$active ? `0 0 15px ${PIPBOY_COLORS.primary}` : 'none'};
  transform: translate(-50%, -50%);
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: ${PIPBOY_COLORS.primary};
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const LocationInfo = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
`;

const InfoTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
`;

const InfoText = styled.div`
  font-size: 14px;
  opacity: 0.8;
  line-height: 1.4;
`;

type MapSubTab = 'local' | 'world';

interface Location {
  id: string;
  name: string;
  type: string;
  discovered: boolean;
  description: string;
  x: number; // Posição X no mapa (0-100%)
  y: number; // Posição Y no mapa (0-100%)
}

// Dados de exemplo
const locations: Location[] = [
  {
    id: 'loc_1',
    name: 'Sanctuary Hills',
    type: 'Settlement',
    discovered: true,
    description: 'Your pre-war neighborhood. Now a potential settlement for survivors.',
    x: 30,
    y: 25
  },
  {
    id: 'loc_2',
    name: 'Red Rocket Truck Stop',
    type: 'Landmark',
    discovered: true,
    description: 'An abandoned truck stop. Good source of supplies.',
    x: 35,
    y: 30
  },
  {
    id: 'loc_3',
    name: 'Concord',
    type: 'Town',
    discovered: true,
    description: 'A small town overrun by raiders. Preston Garvey needs help here.',
    x: 45,
    y: 35
  },
  {
    id: 'loc_4',
    name: 'Diamond City',
    type: 'Major Settlement',
    discovered: false,
    description: 'The Great Green Jewel of the Commonwealth. Built in Fenway Park.',
    x: 60,
    y: 60
  },
  {
    id: 'loc_5',
    name: 'Vault 111',
    type: 'Vault',
    discovered: true,
    description: 'Your starting point. The cryogenic vault where you were frozen.',
    x: 25,
    y: 20
  },
  {
    id: 'loc_6',
    name: 'Goodneighbor',
    type: 'Settlement',
    discovered: false,
    description: 'A rough neighborhood controlled by criminals and drifters.',
    x: 65,
    y: 55
  }
];

export const MapTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<MapSubTab>('local');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(locations[0]);
  const { playBeep } = useSound();

  const handleSubTabChange = (tab: MapSubTab) => {
    playBeep();
    setActiveSubTab(tab);
  };

  const handleLocationSelect = (location: Location) => {
    if (location.discovered) {
      playBeep();
      setSelectedLocation(location);
    }
  };

  return (
    <MapContainer>
      <SubNav>
        <SubNavButton
          $active={activeSubTab === 'local'}
          onClick={() => handleSubTabChange('local')}
        >
          Local Map
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'world'}
          onClick={() => handleSubTabChange('world')}
        >
          World Map
        </SubNavButton>
      </SubNav>

      <ContentGrid>
        <LeftPanel>
          <LocationList>
            {locations.map((location) => (
              <LocationRow
                key={location.id}
                $selected={selectedLocation?.id === location.id}
                $discovered={location.discovered}
                onClick={() => handleLocationSelect(location)}
                whileHover={{ x: location.discovered ? 5 : 0 }}
              >
                <LocationName>
                  {location.discovered ? location.name : '???'}
                </LocationName>
                <LocationIcon>{location.type}</LocationIcon>
              </LocationRow>
            ))}
          </LocationList>
        </LeftPanel>

        <RightPanel>
          <MapGrid />

          {locations.filter(loc => loc.discovered).map((location) => (
            <LocationMarker
              key={location.id}
              $x={location.x}
              $y={location.y}
              $active={selectedLocation?.id === location.id}
              onClick={() => handleLocationSelect(location)}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}

          {selectedLocation && (
            <LocationInfo>
              <InfoTitle>{selectedLocation.name}</InfoTitle>
              <InfoText>
                <div style={{ marginBottom: '5px' }}>
                  <strong>Type:</strong> {selectedLocation.type}
                </div>
                <div>{selectedLocation.description}</div>
              </InfoText>
            </LocationInfo>
          )}

          {!selectedLocation && (
            <div style={{ opacity: 0.5, textAlign: 'center', position: 'absolute' }}>
              SELECT A LOCATION
            </div>
          )}
        </RightPanel>
      </ContentGrid>
    </MapContainer>
  );
};
