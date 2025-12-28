import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { useSound } from '../../hooks/useSound';
import { PerksTab } from './PerksTab';

const StatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  color: ${PIPBOY_COLORS.primary};
`;

const SubNav = styled.div`
  display: flex;
  gap: 20px;
  padding: 10px 0;
  border-bottom: 2px solid ${PIPBOY_COLORS.primary};
  margin-bottom: 20px;
`;

const SubNavButton = styled.button<{ $active: boolean }>`
  color: ${PIPBOY_COLORS.primary};
  font-size: 16px;
  font-weight: bold;
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  opacity: ${props => props.$active ? 1 : 0.6};
  text-shadow: ${props => props.$active ? PIPBOY_TEXT_GLOW.standard : PIPBOY_TEXT_GLOW.subtle};
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  gap: 20px;
`;

const SPECIALList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SPECIALItem = styled(motion.div)<{ $selected: boolean }>`
  display: flex;
  justify-content: space-between;
  padding: 12px 15px;
  background: ${props => props.$selected ? 'rgba(18, 255, 21, 0.15)' : 'transparent'};
  border-left: ${props => props.$selected ? `3px solid ${PIPBOY_COLORS.primary}` : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${props => props.$selected ? 1 : 0.8};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};

  &:hover {
    background: rgba(18, 255, 21, 0.1);
    opacity: 1;
  }
`;

const SPECIALName = styled.span`
  font-size: 18px;
  text-transform: capitalize;
`;

const SPECIALValue = styled.span`
  font-size: 22px;
  font-weight: bold;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
`;

const VaultBoyContainer = styled.div`
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${PIPBOY_COLORS.primary};
  background: rgba(18, 255, 21, 0.05);
  box-shadow: 0 0 15px rgba(18, 255, 21, 0.3);
  position: relative;

  &::after {
    content: 'VAULT BOY';
    position: absolute;
    bottom: 10px;
    font-size: 14px;
    color: ${PIPBOY_COLORS.primary};
    opacity: 0.6;
    font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  }
`;

const VaultBoyImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
  /* Filtro para converter imagens coloridas em verde monocromático Pip-Boy */
  filter: grayscale(100%) brightness(1.5) sepia(100%) hue-rotate(70deg) saturate(400%);
  image-rendering: pixelated;
`;

const Description = styled.div`
  padding: 15px;
  background: rgba(18, 255, 21, 0.05);
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
  font-size: 14px;
  line-height: 1.6;
  max-width: 400px;
  text-align: center;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
`;

const DescriptionTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
`;

type SubTab = 'status' | 'special' | 'perks';

interface SPECIALAttribute {
  name: string;
  fullName: string;
  value: number;
  description: string;
  image: string;
}

const specialAttributes: SPECIALAttribute[] = [
  {
    name: 'strength',
    fullName: 'Strength',
    value: 4,
    description: 'Strength is a measure of your raw physical power. It affects how much you can carry, and the damage of all melee attacks.',
    image: '/assets/images/vault-boy/strength.gif'
  },
  {
    name: 'perception',
    fullName: 'Perception',
    value: 8,
    description: 'Perception affects your awareness of nearby enemies, your ability to detect traps and your weapon accuracy in V.A.T.S.',
    image: '/assets/images/vault-boy/perception.gif'
  },
  {
    name: 'endurance',
    fullName: 'Endurance',
    value: 3,
    description: 'Endurance is a measure of your overall physical fitness. It affects your total Health and the Action Point drain from sprinting.',
    image: '/assets/images/vault-boy/endurance.gif'
  },
  {
    name: 'charisma',
    fullName: 'Charisma',
    value: 5,
    description: 'Charisma affects your success to persuade in dialogue and prices when you barter. It also affects the rewards from quests.',
    image: '/assets/images/vault-boy/charisma.gif'
  },
  {
    name: 'intelligence',
    fullName: 'Intelligence',
    value: 2,
    description: 'Intelligence affects the number of Experience Points earned and the difficulty of the hacking minigame.',
    image: '/assets/images/vault-boy/intelligence.gif'
  },
  {
    name: 'agility',
    fullName: 'Agility',
    value: 3,
    description: 'Agility affects the number of Action Points in V.A.T.S. and your ability to sneak.',
    image: '/assets/images/vault-boy/agility.gif'
  },
  {
    name: 'luck',
    fullName: 'Luck',
    value: 3,
    description: 'Luck affects the recharge rate of Critical Hits and your chances of finding better items in containers.',
    image: '/assets/images/vault-boy/luck.gif'
  }
];

export const StatTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('special');
  const [selectedSPECIAL, setSelectedSPECIAL] = useState<SPECIALAttribute>(specialAttributes[0]);
  const { playSound } = useSound();

  const handleSubTabChange = (tab: SubTab) => {
    playSound('click');
    setActiveSubTab(tab);
  };

  const handleSPECIALSelect = (attr: SPECIALAttribute) => {
    playSound('select');
    setSelectedSPECIAL(attr);
  };

  return (
    <StatContainer>
      <SubNav>
        <SubNavButton
          $active={activeSubTab === 'status'}
          onClick={() => handleSubTabChange('status')}
          onMouseEnter={() => playSound('hover')}
        >
          Status
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'special'}
          onClick={() => handleSubTabChange('special')}
          onMouseEnter={() => playSound('hover')}
        >
          Special
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'perks'}
          onClick={() => handleSubTabChange('perks')}
          onMouseEnter={() => playSound('hover')}
        >
          Perks
        </SubNavButton>
      </SubNav>

      {activeSubTab === 'special' && (
        <ContentGrid>
          <LeftPanel>
            <SPECIALList>
              {specialAttributes.map((attr) => (
                <SPECIALItem
                  key={attr.name}
                  $selected={selectedSPECIAL.name === attr.name}
                  onClick={() => handleSPECIALSelect(attr)}
                  onMouseEnter={() => playSound('hover')}
                  whileHover={{ x: 5 }}
                >
                  <SPECIALName>{attr.fullName}</SPECIALName>
                  <SPECIALValue>{attr.value}</SPECIALValue>
                </SPECIALItem>
              ))}
            </SPECIALList>
          </LeftPanel>

          <RightPanel>
            <VaultBoyContainer>
              <VaultBoyImage
                src={selectedSPECIAL.image}
                alt={selectedSPECIAL.fullName}
              />
            </VaultBoyContainer>

            <Description>
              <DescriptionTitle>{selectedSPECIAL.fullName}</DescriptionTitle>
              {selectedSPECIAL.description}
            </Description>
          </RightPanel>
        </ContentGrid>
      )}

      {activeSubTab === 'status' && (
        <div style={{ padding: '20px', fontSize: '14px', color: PIPBOY_COLORS.primary, fontFamily: PIPBOY_TYPOGRAPHY.fontFamily }}>
          Status tab content will be implemented here...
        </div>
      )}

      {activeSubTab === 'perks' && (
        <PerksTab />
      )}
    </StatContainer>
  );
};
