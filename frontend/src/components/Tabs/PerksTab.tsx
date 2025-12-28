import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { useSound } from '../../hooks/useSound';

const PerksContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  color: ${PIPBOY_COLORS.primary};
`;

const PerksHeader = styled.div`
  padding: 10px 0;
  border-bottom: 2px solid ${PIPBOY_COLORS.primary};
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PerksTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
`;

const PerksCount = styled.div`
  font-size: 14px;
  opacity: 0.7;
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
  gap: 10px;
  overflow-y: auto;
  padding-right: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(18, 255, 21, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: ${PIPBOY_COLORS.primary};
    border-radius: 4px;
  }
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: rgba(18, 255, 21, 0.05);
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
  overflow-y: auto;
`;

const PerkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  width: 100%;
`;

const PerkCard = styled(motion.div)<{ $selected: boolean; $unlocked: boolean }>`
  aspect-ratio: 1;
  background: ${props => props.$selected ? 'rgba(18, 255, 21, 0.15)' : 'rgba(18, 255, 21, 0.05)'};
  border: 2px solid ${props => props.$selected ? PIPBOY_COLORS.bright : PIPBOY_COLORS.primary};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  opacity: ${props => props.$unlocked ? 1 : 0.4};
  transition: all 0.2s;
  box-shadow: ${props => props.$selected ? `0 0 15px rgba(18, 255, 21, 0.5)` : 'none'};

  &:hover {
    background: rgba(18, 255, 21, 0.12);
    border-color: ${PIPBOY_COLORS.bright};
    opacity: ${props => props.$unlocked ? 1 : 0.5};
  }
`;

const PerkIcon = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: grayscale(100%) brightness(1.5) sepia(100%) hue-rotate(70deg) saturate(400%);
  margin-bottom: 8px;
`;

const PerkName = styled.div`
  font-size: 11px;
  text-align: center;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PerkDetail = styled.div`
  width: 100%;
  text-align: left;
`;

const DetailHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid ${PIPBOY_COLORS.primary};
`;

const DetailIcon = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: grayscale(100%) brightness(1.5) sepia(100%) hue-rotate(70deg) saturate(400%);
  margin-bottom: 15px;
`;

const DetailTitle = styled.div`
  font-size: 22px;
  font-weight: bold;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  text-align: center;
  margin-bottom: 5px;
`;

const DetailRank = styled.div`
  font-size: 14px;
  opacity: 0.7;
  text-align: center;
`;

const DetailDescription = styled.div`
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.9;
`;

const DetailStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: rgba(18, 255, 21, 0.05);
  border-left: 3px solid ${PIPBOY_COLORS.primary};
`;

const StatLabel = styled.span`
  opacity: 0.7;
`;

const StatValue = styled.span`
  font-weight: bold;
`;

const UnlockButton = styled(motion.button)<{ $unlocked: boolean }>`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background: ${props => props.$unlocked ? 'rgba(18, 255, 21, 0.1)' : PIPBOY_COLORS.primary};
  color: ${props => props.$unlocked ? PIPBOY_COLORS.primary : '#000'};
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 16px;
  font-weight: bold;
  cursor: ${props => props.$unlocked ? 'default' : 'pointer'};
  text-shadow: ${props => props.$unlocked ? PIPBOY_TEXT_GLOW.subtle : 'none'};

  &:hover {
    background: ${props => props.$unlocked ? 'rgba(18, 255, 21, 0.1)' : PIPBOY_COLORS.bright};
    box-shadow: ${props => props.$unlocked ? 'none' : `0 0 15px rgba(18, 255, 21, 0.6)`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface Perk {
  id: string;
  name: string;
  rank: number;
  maxRank: number;
  description: string;
  requirements: {
    level: number;
    special?: string;
    specialValue?: number;
  };
  icon: string;
  unlocked: boolean;
}

// Dados de exemplo - incluindo os 3 perks baixados
const perksData: Perk[] = [
  {
    id: 'action_boy',
    name: 'Action Boy',
    rank: 1,
    maxRank: 2,
    description: 'You have a steady supply of AP, which helps you in combat. AP regenerates faster.',
    requirements: {
      level: 1,
      special: 'Agility',
      specialValue: 5
    },
    icon: '/assets/images/perks/2D20_Action_Boy.png',
    unlocked: true
  },
  {
    id: 'adamantium_skeleton',
    name: 'Adamantium Skeleton',
    rank: 1,
    maxRank: 1,
    description: 'Your skeleton has been specially treated. You take reduced limb damage.',
    requirements: {
      level: 3,
      special: 'Endurance',
      specialValue: 7
    },
    icon: '/assets/images/perks/2D20_Adamantium_Skeleton.png',
    unlocked: true
  },
  {
    id: 'adrenaline_rush',
    name: 'Adrenaline Rush',
    rank: 1,
    maxRank: 5,
    description: 'With each enemy you kill, your AP regeneration increases. The effect stacks and is reset after combat ends.',
    requirements: {
      level: 1,
      special: 'Endurance',
      specialValue: 7
    },
    icon: '/assets/images/perks/2D20_Adrenaline_Rush.png',
    unlocked: true
  },
  {
    id: 'armorer',
    name: 'Armorer',
    rank: 0,
    maxRank: 4,
    description: 'Protect yourself from the dangers of the Wasteland with access to base level and Rank 1 armor mods.',
    requirements: {
      level: 1,
      special: 'Strength',
      specialValue: 3
    },
    icon: '/assets/images/vault-boy/strength.gif',
    unlocked: false
  },
  {
    id: 'awareness',
    name: 'Awareness',
    rank: 0,
    maxRank: 1,
    description: 'To defeat your enemies, know their weaknesses! You can view a target\'s specific damage resistances.',
    requirements: {
      level: 2,
      special: 'Perception',
      specialValue: 3
    },
    icon: '/assets/images/vault-boy/perception.gif',
    unlocked: false
  },
  {
    id: 'basher',
    name: 'Basher',
    rank: 0,
    maxRank: 4,
    description: 'Get up close and personal! Gun bashing does +25% more damage.',
    requirements: {
      level: 1,
      special: 'Strength',
      specialValue: 2
    },
    icon: '/assets/images/vault-boy/strength.gif',
    unlocked: false
  },
  {
    id: 'big_leagues',
    name: 'Big Leagues',
    rank: 0,
    maxRank: 5,
    description: 'Swing for the fences! Do +20% more melee weapon damage.',
    requirements: {
      level: 1,
      special: 'Strength',
      specialValue: 2
    },
    icon: '/assets/images/vault-boy/strength.gif',
    unlocked: false
  },
  {
    id: 'black_widow',
    name: 'Black Widow',
    rank: 0,
    maxRank: 1,
    description: 'You deal +5% more damage against male opponents and gain unique dialogue options.',
    requirements: {
      level: 1,
      special: 'Charisma',
      specialValue: 2
    },
    icon: '/assets/images/vault-boy/charisma.gif',
    unlocked: false
  }
];

export const PerksTab = () => {
  const [selectedPerk, setSelectedPerk] = useState<Perk | null>(perksData[0]);
  const { playSound } = useSound();

  const handlePerkSelect = (perk: Perk) => {
    playSound('select');
    setSelectedPerk(perk);
  };

  const handleUnlock = (perk: Perk) => {
    if (perk.unlocked) {
      playSound('error');
    } else {
      playSound('select');
      // TODO: Implementar lógica de unlock
      console.log('Unlocking perk:', perk.name);
    }
  };

  const unlockedCount = perksData.filter(p => p.unlocked).length;

  return (
    <PerksContainer>
      <PerksHeader>
        <PerksTitle>PERKS</PerksTitle>
        <PerksCount>{unlockedCount} / {perksData.length} UNLOCKED</PerksCount>
      </PerksHeader>

      <ContentGrid>
        <LeftPanel>
          <PerkGrid>
            {perksData.map((perk) => (
              <PerkCard
                key={perk.id}
                $selected={selectedPerk?.id === perk.id}
                $unlocked={perk.unlocked}
                onClick={() => handlePerkSelect(perk)}
                onMouseEnter={() => playSound('hover')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PerkIcon src={perk.icon} alt={perk.name} />
                <PerkName>{perk.name}</PerkName>
              </PerkCard>
            ))}
          </PerkGrid>
        </LeftPanel>

        <RightPanel>
          {selectedPerk ? (
            <PerkDetail>
              <DetailHeader>
                <DetailIcon src={selectedPerk.icon} alt={selectedPerk.name} />
                <DetailTitle>{selectedPerk.name}</DetailTitle>
                <DetailRank>
                  RANK {selectedPerk.rank} / {selectedPerk.maxRank}
                </DetailRank>
              </DetailHeader>

              <DetailDescription>{selectedPerk.description}</DetailDescription>

              <DetailStats>
                <StatRow>
                  <StatLabel>Required Level</StatLabel>
                  <StatValue>{selectedPerk.requirements.level}</StatValue>
                </StatRow>
                {selectedPerk.requirements.special && (
                  <StatRow>
                    <StatLabel>Required {selectedPerk.requirements.special}</StatLabel>
                    <StatValue>{selectedPerk.requirements.specialValue}</StatValue>
                  </StatRow>
                )}
                <StatRow>
                  <StatLabel>Status</StatLabel>
                  <StatValue>{selectedPerk.unlocked ? 'UNLOCKED' : 'LOCKED'}</StatValue>
                </StatRow>
              </DetailStats>

              <UnlockButton
                $unlocked={selectedPerk.unlocked}
                onClick={() => handleUnlock(selectedPerk)}
                disabled={selectedPerk.unlocked}
                whileHover={!selectedPerk.unlocked ? { scale: 1.02 } : {}}
                whileTap={!selectedPerk.unlocked ? { scale: 0.98 } : {}}
              >
                {selectedPerk.unlocked ? 'ALREADY UNLOCKED' : 'UNLOCK PERK'}
              </UnlockButton>
            </PerkDetail>
          ) : (
            <div style={{ opacity: 0.5, textAlign: 'center', marginTop: '50px' }}>
              SELECT A PERK
            </div>
          )}
        </RightPanel>
      </ContentGrid>
    </PerksContainer>
  );
};
