import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { useSound } from '../../hooks/useSound';
import { useCharacter } from '../../contexts/CharacterContext';

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

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 18px;
  opacity: 0.7;
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
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

const PerkCard = styled(motion.div)<{ $selected: boolean }>`
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
  transition: all 0.2s;
  box-shadow: ${props => props.$selected ? `0 0 15px rgba(18, 255, 21, 0.5)` : 'none'};

  &:hover {
    background: rgba(18, 255, 21, 0.12);
    border-color: ${PIPBOY_COLORS.bright};
  }
`;

const PerkIcon = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin-bottom: 8px;
  filter: grayscale(100%) brightness(1.5) sepia(100%) hue-rotate(70deg) saturate(400%);
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

const DetailIcon = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
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

const DetailSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  opacity: 0.8;
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
`;

const SectionContent = styled.div`
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.9;
  padding: 10px;
  background: rgba(18, 255, 21, 0.05);
  border-left: 3px solid ${PIPBOY_COLORS.primary};
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  opacity: 0.5;
  text-align: center;
  gap: 10px;
`;

interface CharacterPerk {
  id: string;
  rank: number;
  acquiredAtLevel: number;
  perk: {
    id: string;
    name: string;
    ranks: number;
    requirements: any;
    condition: string;
    benefit: string;
    mechanicalEffects?: any;
    corebookPage?: number;
  };
}

export const PerksTab = () => {
  const { character } = useCharacter();
  const [selectedPerk, setSelectedPerk] = useState<CharacterPerk | null>(null);
  const { playBeep } = useSound();

  const handlePerkSelect = (perk: CharacterPerk) => {
    playBeep();
    setSelectedPerk(perk);
  };

  if (!character) {
    return <LoadingMessage>LOADING CHARACTER DATA...</LoadingMessage>;
  }

  const perks = character.perks || [];

  // Set first perk as selected by default if none selected
  if (perks.length > 0 && !selectedPerk) {
    setSelectedPerk(perks[0]);
  }

  if (perks.length === 0) {
    return (
      <PerksContainer>
        <PerksHeader>
          <PerksTitle>PERKS</PerksTitle>
          <PerksCount>0 PERKS</PerksCount>
        </PerksHeader>
        <EmptyState>
          <div style={{ fontSize: '40px' }}>⭐</div>
          <div>NO PERKS ACQUIRED</div>
          <div style={{ fontSize: '12px', opacity: 0.6 }}>
            Earn perks by leveling up and completing challenges
          </div>
        </EmptyState>
      </PerksContainer>
    );
  }

  return (
    <PerksContainer>
      <PerksHeader>
        <PerksTitle>PERKS</PerksTitle>
        <PerksCount>{perks.length} PERK{perks.length !== 1 ? 'S' : ''}</PerksCount>
      </PerksHeader>

      <ContentGrid>
        <LeftPanel>
          <PerkGrid>
            {perks.map((characterPerk) => (
              <PerkCard
                key={characterPerk.id}
                $selected={selectedPerk?.id === characterPerk.id}
                onClick={() => handlePerkSelect(characterPerk)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PerkIcon>⭐</PerkIcon>
                <PerkName>{characterPerk.perk.name}</PerkName>
              </PerkCard>
            ))}
          </PerkGrid>
        </LeftPanel>

        <RightPanel>
          {selectedPerk ? (
            <PerkDetail>
              <DetailHeader>
                <DetailIcon>⭐</DetailIcon>
                <DetailTitle>{selectedPerk.perk.name}</DetailTitle>
                <DetailRank>
                  RANK {selectedPerk.rank} / {selectedPerk.perk.ranks}
                </DetailRank>
              </DetailHeader>

              <DetailSection>
                <SectionTitle>CONDITION</SectionTitle>
                <SectionContent>{selectedPerk.perk.condition}</SectionContent>
              </DetailSection>

              <DetailSection>
                <SectionTitle>BENEFIT</SectionTitle>
                <SectionContent>{selectedPerk.perk.benefit}</SectionContent>
              </DetailSection>

              <DetailStats>
                <StatRow>
                  <StatLabel>Acquired at Level</StatLabel>
                  <StatValue>{selectedPerk.acquiredAtLevel}</StatValue>
                </StatRow>
                {selectedPerk.perk.corebookPage && (
                  <StatRow>
                    <StatLabel>Corebook Page</StatLabel>
                    <StatValue>p. {selectedPerk.perk.corebookPage}</StatValue>
                  </StatRow>
                )}
                {selectedPerk.perk.requirements && (
                  <StatRow>
                    <StatLabel>Requirements</StatLabel>
                    <StatValue>{JSON.stringify(selectedPerk.perk.requirements)}</StatValue>
                  </StatRow>
                )}
              </DetailStats>
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
