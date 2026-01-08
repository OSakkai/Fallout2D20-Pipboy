import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { PerksTab } from './PerksTabWithData';
import { useSound } from '../../hooks/useSound';
import { useCharacter } from '../../contexts/CharacterContext';
import { EffectsCategory } from './Categories/EffectsCategory';
import { SkillsCategory } from './Categories/SkillsCategory';
import { GeneralCategory } from './Categories/GeneralCategory';

// Import all styled components from original StatTab.tsx
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

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 20px;
  color: ${PIPBOY_COLORS.primary};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
`;

type StatSubTab = 'status' | 'effects' | 'special' | 'skills' | 'perks' | 'general';

interface SPECIALAttribute {
  name: string;
  fullName: string;
  value: number;
  description: string;
  image: string;
}

const SPECIAL_DESCRIPTIONS = {
  strength: 'Strength is a measure of your raw physical power. It affects how much you can carry, and the damage of all melee attacks.',
  perception: 'Perception affects your awareness of nearby enemies, your ability to detect traps and your weapon accuracy in V.A.T.S.',
  endurance: 'Endurance is a measure of your overall physical fitness. It affects your total Health and the Action Point drain from sprinting.',
  charisma: 'Charisma affects your success to persuade in dialogue and prices when you barter. It also affects the rewards from quests.',
  intelligence: 'Intelligence affects the number of Experience Points earned and the difficulty of the hacking minigame.',
  agility: 'Agility affects the number of Action Points in V.A.T.S. and your ability to sneak.',
  luck: 'Luck affects the recharge rate of Critical Hits and your chances of finding better items in containers.',
};

// STATUS CONTENT COMPONENT WITH REAL DATA
const StatusContent = () => {
  const { character } = useCharacter();

  if (!character) {
    return <LoadingMessage>NO CHARACTER DATA</LoadingMessage>;
  }

  const { derivedStats, bodyLocations } = character;

  // Map body locations by type
  const bodyPartsMap = {
    head: bodyLocations.find(bl => bl.location === 'HEAD'),
    torso: bodyLocations.find(bl => bl.location === 'TORSO'),
    leftArm: bodyLocations.find(bl => bl.location === 'LEFT_ARM'),
    rightArm: bodyLocations.find(bl => bl.location === 'RIGHT_ARM'),
    leftLeg: bodyLocations.find(bl => bl.location === 'LEFT_LEG'),
    rightLeg: bodyLocations.find(bl => bl.location === 'RIGHT_LEG'),
  };

  return (
    <StatusContainer>
      {/* Top Stats Row */}
      <TopStatsRow>
        <TopStatItem>
          <TopStatLabel>Melee Damage</TopStatLabel>
          <TopStatValue>{derivedStats.meleeDamage}</TopStatValue>
        </TopStatItem>
        <TopStatItem>
          <TopStatLabel>Defense</TopStatLabel>
          <TopStatValue>{derivedStats.defense}</TopStatValue>
        </TopStatItem>
        <TopStatItem>
          <TopStatLabel>Initiative</TopStatLabel>
          <TopStatValue>{derivedStats.initiative}</TopStatValue>
        </TopStatItem>
      </TopStatsRow>

      {/* Main Content Grid */}
      <MainContentGrid>
        {/* Left Body Parts */}
        <LeftBodyParts>
          {bodyPartsMap.head && (
            <BodyPartPanel>
              <BodyPartTitle>Head</BodyPartTitle>
              <BodyPartLocation>Hit Location: {bodyPartsMap.head.diceRange}</BodyPartLocation>
              <BodyPartStats>
                <BodyPartStat>
                  <StatLabel>Phys. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.head.physicalDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>Rad. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.head.radiationDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>En. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.head.energyDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>HP:</StatLabel>
                  <StatValue>{bodyPartsMap.head.currentHP}/{bodyPartsMap.head.maxHP}</StatValue>
                </BodyPartStat>
              </BodyPartStats>
            </BodyPartPanel>
          )}

          {bodyPartsMap.leftArm && (
            <BodyPartPanel>
              <BodyPartTitle>Left Arm</BodyPartTitle>
              <BodyPartLocation>Hit Location: {bodyPartsMap.leftArm.diceRange}</BodyPartLocation>
              <BodyPartStats>
                <BodyPartStat>
                  <StatLabel>Phys. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.leftArm.physicalDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>Rad. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.leftArm.radiationDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>En. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.leftArm.energyDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>HP:</StatLabel>
                  <StatValue>{bodyPartsMap.leftArm.currentHP}/{bodyPartsMap.leftArm.maxHP}</StatValue>
                </BodyPartStat>
              </BodyPartStats>
            </BodyPartPanel>
          )}

          {bodyPartsMap.leftLeg && (
            <BodyPartPanel>
              <BodyPartTitle>Left Leg</BodyPartTitle>
              <BodyPartLocation>Hit Location: {bodyPartsMap.leftLeg.diceRange}</BodyPartLocation>
              <BodyPartStats>
                <BodyPartStat>
                  <StatLabel>Phys. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.leftLeg.physicalDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>Rad. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.leftLeg.radiationDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>En. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.leftLeg.energyDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>HP:</StatLabel>
                  <StatValue>{bodyPartsMap.leftLeg.currentHP}/{bodyPartsMap.leftLeg.maxHP}</StatValue>
                </BodyPartStat>
              </BodyPartStats>
            </BodyPartPanel>
          )}
        </LeftBodyParts>

        {/* Center Panel - Vault Boy and Health */}
        <CenterPanel>
          <VaultBoyStatusContainer>
            <VaultBoyStatusImage
              src="/assets/images/vault_boy_walking.gif"
              alt="Vault Boy Status"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/images/vault-boy/status.png";
              }}
            />
          </VaultBoyStatusContainer>

          <HealthPanel>
            <HealthTitle>Health</HealthTitle>
            <HealthRow>
              <HealthLabel>Maximum HP:</HealthLabel>
              <HealthValue>{derivedStats.maxHP}</HealthValue>
            </HealthRow>
            <HealthRow>
              <HealthLabel>Current HP:</HealthLabel>
              <HealthValue>{derivedStats.currentHP}</HealthValue>
            </HealthRow>
            <HealthRow>
              <HealthLabel>Poison DR:</HealthLabel>
              <HealthValue>{derivedStats.poisonDR}</HealthValue>
            </HealthRow>
          </HealthPanel>
        </CenterPanel>

        {/* Right Body Parts */}
        <RightBodyParts>
          {bodyPartsMap.torso && (
            <BodyPartPanel>
              <BodyPartTitle>Torso</BodyPartTitle>
              <BodyPartLocation>Hit Location: {bodyPartsMap.torso.diceRange}</BodyPartLocation>
              <BodyPartStats>
                <BodyPartStat>
                  <StatLabel>Phys. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.torso.physicalDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>Rad. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.torso.radiationDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>En. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.torso.energyDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>HP:</StatLabel>
                  <StatValue>{bodyPartsMap.torso.currentHP}/{bodyPartsMap.torso.maxHP}</StatValue>
                </BodyPartStat>
              </BodyPartStats>
            </BodyPartPanel>
          )}

          {bodyPartsMap.rightArm && (
            <BodyPartPanel>
              <BodyPartTitle>Right Arm</BodyPartTitle>
              <BodyPartLocation>Hit Location: {bodyPartsMap.rightArm.diceRange}</BodyPartLocation>
              <BodyPartStats>
                <BodyPartStat>
                  <StatLabel>Phys. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.rightArm.physicalDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>Rad. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.rightArm.radiationDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>En. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.rightArm.energyDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>HP:</StatLabel>
                  <StatValue>{bodyPartsMap.rightArm.currentHP}/{bodyPartsMap.rightArm.maxHP}</StatValue>
                </BodyPartStat>
              </BodyPartStats>
            </BodyPartPanel>
          )}

          {bodyPartsMap.rightLeg && (
            <BodyPartPanel>
              <BodyPartTitle>Right Leg</BodyPartTitle>
              <BodyPartLocation>Hit Location: {bodyPartsMap.rightLeg.diceRange}</BodyPartLocation>
              <BodyPartStats>
                <BodyPartStat>
                  <StatLabel>Phys. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.rightLeg.physicalDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>Rad. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.rightLeg.radiationDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>En. DR:</StatLabel>
                  <StatValue>{bodyPartsMap.rightLeg.energyDR}</StatValue>
                </BodyPartStat>
                <BodyPartStat>
                  <StatLabel>HP:</StatLabel>
                  <StatValue>{bodyPartsMap.rightLeg.currentHP}/{bodyPartsMap.rightLeg.maxHP}</StatValue>
                </BodyPartStat>
              </BodyPartStats>
            </BodyPartPanel>
          )}
        </RightBodyParts>
      </MainContentGrid>
    </StatusContainer>
  );
};

export const StatTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<StatSubTab>('special');
  const [selectedSPECIALIndex, setSelectedSPECIALIndex] = useState(0);
  const { playBeep } = useSound();
  const { character } = useCharacter();

  if (!character) {
    return <LoadingMessage>LOADING CHARACTER DATA...</LoadingMessage>;
  }

  // Build SPECIAL attributes from character data
  const specialAttributes: SPECIALAttribute[] = [
    { name: 'strength', fullName: 'Strength', value: character.attributes.strength, description: SPECIAL_DESCRIPTIONS.strength, image: '/assets/images/vault-boy/strength.gif' },
    { name: 'perception', fullName: 'Perception', value: character.attributes.perception, description: SPECIAL_DESCRIPTIONS.perception, image: '/assets/images/vault-boy/perception.gif' },
    { name: 'endurance', fullName: 'Endurance', value: character.attributes.endurance, description: SPECIAL_DESCRIPTIONS.endurance, image: '/assets/images/vault-boy/endurance.gif' },
    { name: 'charisma', fullName: 'Charisma', value: character.attributes.charisma, description: SPECIAL_DESCRIPTIONS.charisma, image: '/assets/images/vault-boy/charisma.gif' },
    { name: 'intelligence', fullName: 'Intelligence', value: character.attributes.intelligence, description: SPECIAL_DESCRIPTIONS.intelligence, image: '/assets/images/vault-boy/intelligence.gif' },
    { name: 'agility', fullName: 'Agility', value: character.attributes.agility, description: SPECIAL_DESCRIPTIONS.agility, image: '/assets/images/vault-boy/agility.gif' },
    { name: 'luck', fullName: 'Luck', value: character.attributes.luck, description: SPECIAL_DESCRIPTIONS.luck, image: '/assets/images/vault-boy/luck.gif' },
  ];

  const selectedSPECIAL = specialAttributes[selectedSPECIALIndex];

  const handleSubTabChange = (tab: StatSubTab) => {
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
          STATUS
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'effects'}
          onClick={() => handleSubTabChange('effects')}
        >
          EFFECTS
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'special'}
          onClick={() => handleSubTabChange('special')}
        >
          S.P.E.C.I.A.L
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'skills'}
          onClick={() => handleSubTabChange('skills')}
        >
          SKILLS
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'perks'}
          onClick={() => handleSubTabChange('perks')}
        >
          PERKS
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'general'}
          onClick={() => handleSubTabChange('general')}
        >
          GENERAL
        </SubNavButton>
      </SubNav>

      {activeSubTab === 'status' && (
        <StatusContent />
      )}

      {activeSubTab === 'effects' && (
        <EffectsCategory />
      )}

      {activeSubTab === 'special' && (
        <ContentGrid>
          <LeftPanel>
            <SPECIALList>
              {specialAttributes.map((attr, index) => (
                <SPECIALItem
                  key={attr.name}
                  $selected={selectedSPECIALIndex === index}
                  onClick={() => {
                    playBeep();
                    setSelectedSPECIALIndex(index);
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

      {activeSubTab === 'skills' && (
        <SkillsCategory />
      )}

      {activeSubTab === 'perks' && (
        <PerksTab />
      )}

      {activeSubTab === 'general' && (
        <GeneralCategory />
      )}
    </StatContainer>
  );
};
