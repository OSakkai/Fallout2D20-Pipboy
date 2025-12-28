import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { useSound } from '../../hooks/useSound';

const DataContainer = styled.div`
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
  padding: 20px;
  background: rgba(18, 255, 21, 0.05);
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
  overflow-y: auto;
`;

const QuestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const QuestRow = styled(motion.div)<{ $selected: boolean; $completed?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: ${props => props.$selected ? 'rgba(18, 255, 21, 0.15)' : 'transparent'};
  border-left: ${props => props.$selected ? `3px solid ${PIPBOY_COLORS.primary}` : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${props => props.$completed ? 0.5 : props.$selected ? 1 : 0.8};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};

  &:hover {
    background: rgba(18, 255, 21, 0.1);
    opacity: ${props => props.$completed ? 0.6 : 1};
  }
`;

const QuestName = styled.span`
  font-size: 16px;
  flex: 1;
`;

const QuestStatus = styled.span`
  font-size: 12px;
  opacity: 0.7;
`;

const QuestDetail = styled.div`
  width: 100%;
  text-align: left;
`;

const DetailTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
`;

const DetailDescription = styled.div`
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
  opacity: 0.8;
`;

const ObjectivesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`;

const ObjectiveItem = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  background: rgba(18, 255, 21, 0.05);
  border-left: 3px solid ${props => props.$completed ? PIPBOY_COLORS.primary : 'rgba(18, 255, 21, 0.3)'};
  opacity: ${props => props.$completed ? 0.5 : 1};
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
`;

const Checkbox = styled.div<{ $checked: boolean }>`
  width: 16px;
  height: 16px;
  border: 2px solid ${PIPBOY_COLORS.primary};
  background: ${props => props.$checked ? PIPBOY_COLORS.primary : 'transparent'};
  flex-shrink: 0;
  margin-top: 2px;
`;

type DataSubTab = 'quests' | 'notes' | 'stats';

interface Quest {
  id: string;
  name: string;
  description: string;
  objectives: { text: string; completed: boolean }[];
  completed: boolean;
}

// Dados de exemplo
const questData: Quest[] = [
  {
    id: 'main_1',
    name: 'Out of Time',
    description: 'You woke up in Vault 111 after being frozen for over 200 years. Find out what happened to your family.',
    objectives: [
      { text: 'Exit Vault 111', completed: true },
      { text: 'Go to Sanctuary Hills', completed: true },
      { text: 'Talk to Codsworth', completed: false },
      { text: 'Find information about Shaun', completed: false }
    ],
    completed: false
  },
  {
    id: 'side_1',
    name: 'When Freedom Calls',
    description: 'Help Preston Garvey and the settlers in Concord.',
    objectives: [
      { text: 'Go to Concord', completed: true },
      { text: 'Clear the raiders from the Museum', completed: false },
      { text: 'Get the Power Armor', completed: false },
      { text: 'Defeat the Deathclaw', completed: false }
    ],
    completed: false
  },
  {
    id: 'completed_1',
    name: 'Tutorial Quest',
    description: 'Learn the basics of survival in the wasteland.',
    objectives: [
      { text: 'Open Pip-Boy', completed: true },
      { text: 'Check SPECIAL stats', completed: true },
      { text: 'Navigate tabs', completed: true }
    ],
    completed: true
  }
];

export const DataTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<DataSubTab>('quests');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const { playSound } = useSound();

  const handleSubTabChange = (tab: DataSubTab) => {
    playSound('click');
    setActiveSubTab(tab);
    setSelectedQuest(null);
  };

  const handleQuestSelect = (quest: Quest) => {
    playSound('select');
    setSelectedQuest(quest);
  };

  return (
    <DataContainer>
      <SubNav>
        <SubNavButton
          $active={activeSubTab === 'quests'}
          onClick={() => handleSubTabChange('quests')}
          onMouseEnter={() => playSound('hover')}
        >
          Quests
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'notes'}
          onClick={() => handleSubTabChange('notes')}
          onMouseEnter={() => playSound('hover')}
        >
          Notes
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'stats'}
          onClick={() => handleSubTabChange('stats')}
          onMouseEnter={() => playSound('hover')}
        >
          Stats
        </SubNavButton>
      </SubNav>

      {activeSubTab === 'quests' && (
        <ContentGrid>
          <LeftPanel>
            <QuestList>
              {questData.map((quest) => (
                <QuestRow
                  key={quest.id}
                  $selected={selectedQuest?.id === quest.id}
                  $completed={quest.completed}
                  onClick={() => handleQuestSelect(quest)}
                  onMouseEnter={() => playSound('hover')}
                  whileHover={{ x: 5 }}
                >
                  <QuestName>{quest.name}</QuestName>
                  <QuestStatus>{quest.completed ? 'COMPLETED' : 'ACTIVE'}</QuestStatus>
                </QuestRow>
              ))}
            </QuestList>
          </LeftPanel>

          <RightPanel>
            {selectedQuest ? (
              <QuestDetail>
                <DetailTitle>{selectedQuest.name}</DetailTitle>
                <DetailDescription>{selectedQuest.description}</DetailDescription>

                <div style={{ fontWeight: 'bold', marginBottom: '10px', textShadow: PIPBOY_TEXT_GLOW.subtle }}>
                  OBJECTIVES:
                </div>
                <ObjectivesList>
                  {selectedQuest.objectives.map((objective, index) => (
                    <ObjectiveItem key={index} $completed={objective.completed}>
                      <Checkbox $checked={objective.completed} />
                      <span>{objective.text}</span>
                    </ObjectiveItem>
                  ))}
                </ObjectivesList>
              </QuestDetail>
            ) : (
              <div style={{ opacity: 0.5, textAlign: 'center', marginTop: '50px' }}>
                SELECT A QUEST
              </div>
            )}
          </RightPanel>
        </ContentGrid>
      )}

      {activeSubTab === 'notes' && (
        <div style={{ padding: '20px', fontSize: '14px', fontFamily: PIPBOY_TYPOGRAPHY.fontFamily }}>
          Notes system will be implemented here...
        </div>
      )}

      {activeSubTab === 'stats' && (
        <div style={{ padding: '20px', fontSize: '14px', fontFamily: PIPBOY_TYPOGRAPHY.fontFamily }}>
          Statistics tracking will be implemented here...
        </div>
      )}
    </DataContainer>
  );
};
