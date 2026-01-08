import { useState } from 'react';
import styled from 'styled-components';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../../styles/pipboy-colors';
import { useCharacter } from '../../../contexts/CharacterContext';

const GeneralContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: 100%;
  overflow: hidden;
`;

const FactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
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

const FactionRow = styled.div<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 12px 15px;
  border-bottom: 1px solid ${PIPBOY_COLORS.primary};
  cursor: pointer;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  background: ${props => props.$active ? 'rgba(18, 255, 21, 0.15)' : 'transparent'};
  transition: background 0.2s;

  &:hover {
    background: rgba(18, 255, 21, 0.1);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const FactionName = styled.div`
  font-weight: bold;
  font-size: 15px;
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
`;

const ReputationInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
`;

const ReputationLevel = styled.span<{ $level: string }>`
  font-weight: bold;
  color: ${props => {
    switch (props.$level) {
      case 'IDOLIZED': return '#00ff00';
      case 'LIKED': return '#66ff66';
      case 'ACCEPTED': return '#99ff99';
      case 'NEUTRAL': return '#ffff00';
      case 'SHUNNED': return '#ff9900';
      case 'VILIFIED': return '#ff4444';
      default: return PIPBOY_COLORS.primary;
    }
  }};
  text-shadow: ${PIPBOY_TEXT_GLOW.strong};
`;

const ReputationPoints = styled.span`
  opacity: 0.7;
`;

const FactionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  border: 1px solid ${PIPBOY_COLORS.primary};
  background: rgba(18, 255, 21, 0.05);
  overflow-y: auto;

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

const FactionImage = styled.div`
  width: 100%;
  height: 200px;
  background: rgba(18, 255, 21, 0.1);
  border: 1px solid ${PIPBOY_COLORS.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: brightness(0.9) contrast(1.1);
  }
`;

const FactionTitle = styled.h3`
  margin: 0;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 20px;
  text-shadow: ${PIPBOY_TEXT_GLOW.strong};
  color: ${PIPBOY_COLORS.primary};
`;

const FactionDescription = styled.div`
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 13px;
  line-height: 1.6;
  opacity: 0.9;
`;

const ReputationDetails = styled.div`
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 14px;
  padding: 15px;
  background: rgba(18, 255, 21, 0.1);
  border-left: 3px solid ${PIPBOY_COLORS.primary};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ReputationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid ${PIPBOY_COLORS.primary};
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number; $level: string }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: ${props => {
    switch (props.$level) {
      case 'IDOLIZED': return '#00ff00';
      case 'LIKED': return '#66ff66';
      case 'ACCEPTED': return '#99ff99';
      case 'NEUTRAL': return '#ffff00';
      case 'SHUNNED': return '#ff9900';
      case 'VILIFIED': return '#ff4444';
      default: return PIPBOY_COLORS.primary;
    }
  }};
  transition: width 0.3s ease;
  box-shadow: 0 0 10px currentColor;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  opacity: 0.5;
  text-align: center;
  gap: 10px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
`;

const formatReputationLevel = (level: string): string => {
  return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Convert points (-100 to 100) to percentage (0 to 100)
const pointsToPercentage = (points: number): number => {
  return ((points + 100) / 200) * 100;
};

// Default faction icons
const FACTION_ICONS: Record<string, string> = {
  'Brotherhood of Steel': '⚙️',
  'NCR': '🐻',
  "Caesar's Legion": '🏛️',
  'Railroad': '🚂',
  'Institute': '🔬',
  'Minutemen': '⭐',
  'Great Khans': '🏴',
  'default': '🏢',
};

const getFactionIcon = (factionName: string): string => {
  return FACTION_ICONS[factionName] || FACTION_ICONS['default'];
};

export const GeneralCategory = () => {
  const { character } = useCharacter();
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null);

  if (!character) {
    return <EmptyState>LOADING...</EmptyState>;
  }

  const reputations = character.reputations || [];

  if (reputations.length === 0) {
    return (
      <EmptyState>
        <div style={{ fontSize: '40px' }}>🏢</div>
        <div>NO FACTION REPUTATIONS</div>
        <div style={{ fontSize: '12px', opacity: 0.6 }}>
          Your reputation with various factions will appear here as you interact with them
        </div>
      </EmptyState>
    );
  }

  const currentReputation = reputations.find(r => r.faction.id === selectedFactionId) || reputations[0];
  const { faction, level, points, firstContact, lastUpdate } = currentReputation;

  return (
    <GeneralContainer>
      <FactionsList>
        {reputations.map((rep) => (
          <FactionRow
            key={rep.faction.id}
            $active={rep.faction.id === currentReputation.faction.id}
            onClick={() => setSelectedFactionId(rep.faction.id)}
          >
            <FactionName>{rep.faction.name}</FactionName>
            <ReputationInfo>
              <ReputationLevel $level={rep.level}>
                {formatReputationLevel(rep.level)}
              </ReputationLevel>
              <ReputationPoints>{rep.points} pts</ReputationPoints>
            </ReputationInfo>
          </FactionRow>
        ))}
      </FactionsList>

      <FactionDetails>
        <FactionImage>
          {faction.imageUrl ? (
            <img src={faction.imageUrl} alt={faction.name} />
          ) : (
            getFactionIcon(faction.name)
          )}
        </FactionImage>

        <FactionTitle>{faction.name}</FactionTitle>

        <ReputationDetails>
          <ReputationRow>
            <strong>Reputation:</strong>
            <ReputationLevel $level={level}>
              {formatReputationLevel(level)}
            </ReputationLevel>
          </ReputationRow>

          <ReputationRow>
            <strong>Points:</strong>
            <span>{points} / 100</span>
          </ReputationRow>

          <ProgressBar>
            <ProgressFill
              $percentage={pointsToPercentage(points)}
              $level={level}
            />
          </ProgressBar>

          <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '5px' }}>
            <div>First Contact: {formatDate(firstContact)}</div>
            <div>Last Update: {formatDate(lastUpdate)}</div>
          </div>
        </ReputationDetails>

        {faction.description && (
          <FactionDescription>
            {faction.description}
          </FactionDescription>
        )}
      </FactionDetails>
    </GeneralContainer>
  );
};
