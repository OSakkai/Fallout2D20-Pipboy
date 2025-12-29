import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { PerksTab } from './PerksTab';
import { useSound } from '../../hooks/useSound';

const StatContainer = styled.div`
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

// STATUS TAB COMPONENTS
const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  overflow: hidden;
  gap: 10px;
`;

const TopStatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 8px;
  border: 2px solid ${PIPBOY_COLORS.primary};
  background: rgba(18, 255, 21, 0.05);
`;

const TopStatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;

const TopStatLabel = styled.div`
  font-size: 10px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};
  opacity: 0.8;
`;

const TopStatValue = styled.div`
  font-size: 16px;
  font-weight: bold;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
`;

const MainContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px 1fr;
  gap: 10px;
  align-items: start;
  flex: 1;
  overflow: hidden;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 10px;
    overflow-y: auto;
  }
`;

const LeftBodyParts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
`;

const RightBodyParts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
`;

const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  overflow-y: auto;
`;

const VaultBoyStatusContainer = styled.div`
  width: 100%;
  max-width: 280px;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid ${PIPBOY_COLORS.primary};
  background: rgba(18, 255, 21, 0.05);
  box-shadow: 0 0 20px rgba(18, 255, 21, 0.3);
  position: relative;
`;

const VaultBoyStatusImage = styled.img`
  width: 90%;
  height: 90%;
  object-fit: contain;
  filter: grayscale(100%) brightness(1.5) sepia(100%) hue-rotate(70deg) saturate(400%);
  image-rendering: pixelated;
`;

const HealthPanel = styled.div`
  width: 100%;
  padding: 10px;
  border: 2px solid ${PIPBOY_COLORS.primary};
  background: rgba(18, 255, 21, 0.05);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const HealthTitle = styled.div`
  font-size: 13px;
  font-weight: bold;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  text-align: center;
  margin-bottom: 3px;
`;

const HealthRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 11px;
`;

const HealthLabel = styled.span`
  opacity: 0.8;
`;

const HealthValue = styled.span`
  font-size: 14px;
  font-weight: bold;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
`;

const BodyPartPanel = styled.div`
  padding: 8px;
  border: 2px solid ${PIPBOY_COLORS.primary};
  background: rgba(18, 255, 21, 0.05);
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const BodyPartTitle = styled.div`
  font-size: 12px;
  font-weight: bold;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  margin-bottom: 2px;
`;

const BodyPartLocation = styled.div`
  font-size: 9px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  opacity: 0.7;
  margin-bottom: 3px;
`;

const BodyPartStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  font-size: 10px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
`;

const BodyPartStat = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StatLabel = styled.span`
  opacity: 0.8;
`;

const StatValue = styled.span`
  font-weight: bold;
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
`;

type SubTab = 'status' | 'special' | 'perks';

interface SPECIALAttribute {
  name: string;
  fullName: string;
  value: number;
  description: string;
  image: string;
}

// STATUS TAB INTERFACES
interface BodyPartData {
  name: string;
  location: string;
  physDR: number;
  radDR: number;
  enDR: number;
  hp: number;
}

interface StatusData {
  meleeDamage: number;
  defense: number;
  initiative: number;
  maxHP: number;
  currentHP: number;
  poisonDR: number;
  bodyParts: {
    head: BodyPartData;
    leftArm: BodyPartData;
    rightArm: BodyPartData;
    torso: BodyPartData;
    leftLeg: BodyPartData;
    rightLeg: BodyPartData;
  };
}

// Hardcoded STATUS data - ready for backend integration
const statusData: StatusData = {
  meleeDamage: 12,
  defense: 8,
  initiative: 15,
  maxHP: 85,
  currentHP: 72,
  poisonDR: 5,
  bodyParts: {
    head: {
      name: 'Head',
      location: '1-2',
      physDR: 2,
      radDR: 0,
      enDR: 1,
      hp: 35
    },
    leftArm: {
      name: 'Left Arm',
      location: '3-11',
      physDR: 1,
      radDR: 0,
      enDR: 0,
      hp: 30
    },
    rightArm: {
      name: 'Right Arm',
      location: '12-14',
      physDR: 1,
      radDR: 0,
      enDR: 0,
      hp: 30
    },
    torso: {
      name: 'Torso',
      location: '3-8',
      physDR: 3,
      radDR: 1,
      enDR: 2,
      hp: 55
    },
    leftLeg: {
      name: 'Left Leg',
      location: '15-17',
      physDR: 1,
      radDR: 0,
      enDR: 1,
      hp: 40
    },
    rightLeg: {
      name: 'Right Leg',
      location: '18-20',
      physDR: 1,
      radDR: 0,
      enDR: 1,
      hp: 40
    }
  }
};

// STATUS CONTENT COMPONENT
const StatusContent = () => {
  return (
    <StatusContainer>
      {/* Top Stats Row */}
      <TopStatsRow>
        <TopStatItem>
          <TopStatLabel>Melee Damage</TopStatLabel>
          <TopStatValue>{statusData.meleeDamage}</TopStatValue>
        </TopStatItem>
        <TopStatItem>
          <TopStatLabel>Defense</TopStatLabel>
          <TopStatValue>{statusData.defense}</TopStatValue>
        </TopStatItem>
        <TopStatItem>
          <TopStatLabel>Initiative</TopStatLabel>
          <TopStatValue>{statusData.initiative}</TopStatValue>
        </TopStatItem>
      </TopStatsRow>

      {/* Main Content Grid */}
      <MainContentGrid>
        {/* Left Body Parts */}
        <LeftBodyParts>
          <BodyPartPanel>
            <BodyPartTitle>{statusData.bodyParts.head.name}</BodyPartTitle>
            <BodyPartLocation>Hit Location: {statusData.bodyParts.head.location}</BodyPartLocation>
            <BodyPartStats>
              <BodyPartStat>
                <StatLabel>Phys. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.head.physDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>Rad. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.head.radDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>En. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.head.enDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>HP:</StatLabel>
                <StatValue>{statusData.bodyParts.head.hp}</StatValue>
              </BodyPartStat>
            </BodyPartStats>
          </BodyPartPanel>

          <BodyPartPanel>
            <BodyPartTitle>{statusData.bodyParts.leftArm.name}</BodyPartTitle>
            <BodyPartLocation>Hit Location: {statusData.bodyParts.leftArm.location}</BodyPartLocation>
            <BodyPartStats>
              <BodyPartStat>
                <StatLabel>Phys. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.leftArm.physDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>Rad. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.leftArm.radDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>En. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.leftArm.enDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>HP:</StatLabel>
                <StatValue>{statusData.bodyParts.leftArm.hp}</StatValue>
              </BodyPartStat>
            </BodyPartStats>
          </BodyPartPanel>

          <BodyPartPanel>
            <BodyPartTitle>{statusData.bodyParts.leftLeg.name}</BodyPartTitle>
            <BodyPartLocation>Hit Location: {statusData.bodyParts.leftLeg.location}</BodyPartLocation>
            <BodyPartStats>
              <BodyPartStat>
                <StatLabel>Phys. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.leftLeg.physDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>Rad. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.leftLeg.radDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>En. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.leftLeg.enDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>HP:</StatLabel>
                <StatValue>{statusData.bodyParts.leftLeg.hp}</StatValue>
              </BodyPartStat>
            </BodyPartStats>
          </BodyPartPanel>
        </LeftBodyParts>

        {/* Center Panel - Vault Boy and Health */}
        <CenterPanel>
          <VaultBoyStatusContainer>
            <VaultBoyStatusImage
              src="/assets/images/vault_boy_walking.gif"
              alt="Vault Boy Status"
              onError={(e) => {
                // Fallback to PNG if GIF not found
                (e.target as HTMLImageElement).src = "/assets/images/vault-boy/status.png";
              }}
            />
          </VaultBoyStatusContainer>

          <HealthPanel>
            <HealthTitle>Health</HealthTitle>
            <HealthRow>
              <HealthLabel>Maximum HP:</HealthLabel>
              <HealthValue>{statusData.maxHP}</HealthValue>
            </HealthRow>
            <HealthRow>
              <HealthLabel>Current HP:</HealthLabel>
              <HealthValue>{statusData.currentHP}</HealthValue>
            </HealthRow>
            <HealthRow>
              <HealthLabel>Poison DR:</HealthLabel>
              <HealthValue>{statusData.poisonDR}</HealthValue>
            </HealthRow>
          </HealthPanel>
        </CenterPanel>

        {/* Right Body Parts */}
        <RightBodyParts>
          <BodyPartPanel>
            <BodyPartTitle>{statusData.bodyParts.torso.name}</BodyPartTitle>
            <BodyPartLocation>Hit Location: {statusData.bodyParts.torso.location}</BodyPartLocation>
            <BodyPartStats>
              <BodyPartStat>
                <StatLabel>Phys. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.torso.physDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>Rad. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.torso.radDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>En. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.torso.enDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>HP:</StatLabel>
                <StatValue>{statusData.bodyParts.torso.hp}</StatValue>
              </BodyPartStat>
            </BodyPartStats>
          </BodyPartPanel>

          <BodyPartPanel>
            <BodyPartTitle>{statusData.bodyParts.rightArm.name}</BodyPartTitle>
            <BodyPartLocation>Hit Location: {statusData.bodyParts.rightArm.location}</BodyPartLocation>
            <BodyPartStats>
              <BodyPartStat>
                <StatLabel>Phys. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.rightArm.physDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>Rad. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.rightArm.radDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>En. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.rightArm.enDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>HP:</StatLabel>
                <StatValue>{statusData.bodyParts.rightArm.hp}</StatValue>
              </BodyPartStat>
            </BodyPartStats>
          </BodyPartPanel>

          <BodyPartPanel>
            <BodyPartTitle>{statusData.bodyParts.rightLeg.name}</BodyPartTitle>
            <BodyPartLocation>Hit Location: {statusData.bodyParts.rightLeg.location}</BodyPartLocation>
            <BodyPartStats>
              <BodyPartStat>
                <StatLabel>Phys. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.rightLeg.physDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>Rad. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.rightLeg.radDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>En. DR:</StatLabel>
                <StatValue>{statusData.bodyParts.rightLeg.enDR}</StatValue>
              </BodyPartStat>
              <BodyPartStat>
                <StatLabel>HP:</StatLabel>
                <StatValue>{statusData.bodyParts.rightLeg.hp}</StatValue>
              </BodyPartStat>
            </BodyPartStats>
          </BodyPartPanel>
        </RightBodyParts>
      </MainContentGrid>
    </StatusContainer>
  );
};

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
  const { playBeep } = useSound();

  const handleSubTabChange = (tab: SubTab) => {
    playBeep();
    setActiveSubTab(tab);
  };

  return (
    <StatContainer>
      <SubNav>
        <SubNavButton
          $active={activeSubTab === 'status'}
          onClick={() => handleSubTabChange('status')}
        >
          Status
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'special'}
          onClick={() => handleSubTabChange('special')}
        >
          Special
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'perks'}
          onClick={() => handleSubTabChange('perks')}
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
                  onClick={() => {
                    playBeep();
                    setSelectedSPECIAL(attr);
                  }}
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
        <StatusContent />
      )}

      {activeSubTab === 'perks' && (
        <PerksTab />
      )}
    </StatContainer>
  );
};
