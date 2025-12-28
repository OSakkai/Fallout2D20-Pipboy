import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { useSound } from '../../hooks/useSound';

const InvContainer = styled.div`
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
  justify-content: flex-start;
  gap: 20px;
  padding: 20px;
  background: rgba(18, 255, 21, 0.05);
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ItemRow = styled(motion.div)<{ $selected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const ItemName = styled.span`
  font-size: 16px;
`;

const ItemWeight = styled.span`
  font-size: 14px;
  opacity: 0.7;
`;

const ItemDetail = styled.div`
  width: 100%;
  text-align: left;
`;

const DetailTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
`;

const DetailStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  line-height: 1.6;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(18, 255, 21, 0.2);
`;

type InvSubTab = 'weapons' | 'apparel' | 'aid' | 'misc';

interface InventoryItem {
  id: string;
  name: string;
  category: InvSubTab;
  weight: number;
  value: number;
  description: string;
  stats?: Record<string, string | number>;
}

// Dados de exemplo
const inventoryItems: InventoryItem[] = [
  {
    id: 'weapon_1',
    name: '10mm Pistol',
    category: 'weapons',
    weight: 3.5,
    value: 99,
    description: 'A common firearm of the post-apocalyptic wasteland.',
    stats: {
      'Damage': '18',
      'Fire Rate': '46',
      'Range': '119',
      'Accuracy': '66',
      'Ammo': '10mm'
    }
  },
  {
    id: 'weapon_2',
    name: 'Pipe Rifle',
    category: 'weapons',
    weight: 4.2,
    value: 24,
    description: 'A makeshift weapon cobbled together from scrap.',
    stats: {
      'Damage': '13',
      'Fire Rate': '33',
      'Range': '71',
      'Accuracy': '48',
      'Ammo': '.38'
    }
  },
  {
    id: 'apparel_1',
    name: 'Vault 111 Jumpsuit',
    category: 'apparel',
    weight: 2.0,
    value: 5,
    description: 'Standard issue Vault-Tec jumpsuit.',
    stats: {
      'DR': '5',
      'ER': '0',
      'RR': '0'
    }
  },
  {
    id: 'aid_1',
    name: 'Stimpak',
    category: 'aid',
    weight: 0.1,
    value: 48,
    description: 'Heals 30% of total health over 5 seconds.',
    stats: {
      'HP Restored': '+30%',
      'Duration': '5s'
    }
  },
  {
    id: 'aid_2',
    name: 'RadAway',
    category: 'aid',
    weight: 0.1,
    value: 80,
    description: 'Removes 300 rads over 5 seconds.',
    stats: {
      'Rads Removed': '-300',
      'Duration': '5s'
    }
  },
  {
    id: 'misc_1',
    name: 'Bottlecap',
    category: 'misc',
    weight: 0.0,
    value: 1,
    description: 'The standard currency of the wasteland.',
    stats: {}
  }
];

export const InvTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<InvSubTab>('weapons');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { playSound } = useSound();

  const handleSubTabChange = (tab: InvSubTab) => {
    playSound('click');
    setActiveSubTab(tab);
    setSelectedItem(null);
  };

  const handleItemSelect = (item: InventoryItem) => {
    playSound('select');
    setSelectedItem(item);
  };

  const filteredItems = inventoryItems.filter(item => item.category === activeSubTab);

  return (
    <InvContainer>
      <SubNav>
        <SubNavButton
          $active={activeSubTab === 'weapons'}
          onClick={() => handleSubTabChange('weapons')}
          onMouseEnter={() => playSound('hover')}
        >
          Weapons
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'apparel'}
          onClick={() => handleSubTabChange('apparel')}
          onMouseEnter={() => playSound('hover')}
        >
          Apparel
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'aid'}
          onClick={() => handleSubTabChange('aid')}
          onMouseEnter={() => playSound('hover')}
        >
          Aid
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'misc'}
          onClick={() => handleSubTabChange('misc')}
          onMouseEnter={() => playSound('hover')}
        >
          Misc
        </SubNavButton>
      </SubNav>

      <ContentGrid>
        <LeftPanel>
          <ItemList>
            {filteredItems.map((item) => (
              <ItemRow
                key={item.id}
                $selected={selectedItem?.id === item.id}
                onClick={() => handleItemSelect(item)}
                onMouseEnter={() => playSound('hover')}
                whileHover={{ x: 5 }}
              >
                <ItemName>{item.name}</ItemName>
                <ItemWeight>{item.weight} lbs</ItemWeight>
              </ItemRow>
            ))}
          </ItemList>
        </LeftPanel>

        <RightPanel>
          {selectedItem ? (
            <ItemDetail>
              <DetailTitle>{selectedItem.name}</DetailTitle>
              <DetailStats>
                <div style={{ marginBottom: '15px', opacity: 0.8 }}>
                  {selectedItem.description}
                </div>
                {selectedItem.stats && Object.keys(selectedItem.stats).length > 0 && (
                  <>
                    {Object.entries(selectedItem.stats).map(([key, value]) => (
                      <StatRow key={key}>
                        <span>{key}</span>
                        <span style={{ fontWeight: 'bold' }}>{value}</span>
                      </StatRow>
                    ))}
                  </>
                )}
                <StatRow>
                  <span>Weight</span>
                  <span style={{ fontWeight: 'bold' }}>{selectedItem.weight} lbs</span>
                </StatRow>
                <StatRow>
                  <span>Value</span>
                  <span style={{ fontWeight: 'bold' }}>{selectedItem.value} caps</span>
                </StatRow>
              </DetailStats>
            </ItemDetail>
          ) : (
            <div style={{ opacity: 0.5, textAlign: 'center', marginTop: '50px' }}>
              SELECT AN ITEM
            </div>
          )}
        </RightPanel>
      </ContentGrid>
    </InvContainer>
  );
};
