import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { useSound } from '../../hooks/useSound';
import { useCharacter } from '../../contexts/CharacterContext';

const InvContainer = styled.div`
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

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 18px;
  opacity: 0.7;
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
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

const ContentLayout = styled.div`
  display: flex;
  gap: 15px;
  flex: 1;
  overflow: hidden;

  @media (max-width: 968px) {
    flex-direction: column;
  }
`;

const LeftBox = styled.div`
  flex: 6;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 2px solid ${PIPBOY_COLORS.primary};
  background: rgba(0, 0, 0, 0.6);
  min-width: 0;

  @media (max-width: 968px) {
    flex: 1;
  }
`;

const RightBox = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  border: 2px solid ${PIPBOY_COLORS.primary};
  background: rgba(0, 0, 0, 0.6);
  padding: 10px;
  overflow: hidden;
  box-sizing: border-box;
  min-width: 0;

  @media (max-width: 968px) {
    flex: 1;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;

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

const ItemRow = styled(motion.div)<{ $selected: boolean; $equipped?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: ${props => props.$selected ? 'rgba(18, 255, 21, 0.15)' : 'transparent'};
  border-left: ${props => props.$selected ? `3px solid ${PIPBOY_COLORS.primary}` : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.2s;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 13px;

  &:hover {
    background: rgba(18, 255, 21, 0.1);
  }

  ${props => props.$equipped && `
    &::before {
      content: 'E';
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid ${PIPBOY_COLORS.primary};
      background: ${PIPBOY_COLORS.primary};
      color: #000;
      font-weight: bold;
      font-size: 10px;
      text-align: center;
      line-height: 12px;
      margin-right: 8px;
      border-radius: 2px;
    }
  `}
`;

const ItemName = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ItemQuantity = styled.span`
  font-size: 12px;
  opacity: 0.7;
  margin-left: 10px;
`;

const DetailBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(18, 255, 21, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: ${PIPBOY_COLORS.primary};
    border-radius: 3px;
  }
`;

const DetailTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: uppercase;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: uppercase;
  padding: 4px 0;
  border-bottom: 1px solid rgba(18, 255, 21, 0.2);

  span:first-child {
    opacity: 0.7;
    flex-shrink: 0;
    width: 40%;
  }

  span:last-child {
    font-weight: bold;
    text-align: right;
    width: 60%;
  }
`;

type InvSubTab = 'weapons' | 'apparel' | 'aid' | 'misc' | 'ammo';

interface InventoryItem {
  id: string;
  itemType: string;
  itemId: string;
  quantity: number;
  condition?: number;
  isEquipped: boolean;
  equippedSlot?: string;
}

// Map backend ItemType to frontend category
const mapItemTypeToCategory = (itemType: string): InvSubTab => {
  switch (itemType) {
    case 'WEAPON_RANGED':
    case 'WEAPON_MELEE':
      return 'weapons';
    case 'ARMOR':
    case 'CLOTHING':
      return 'apparel';
    case 'CONSUMABLE':
      return 'aid';
    case 'AMMO':
      return 'ammo';
    case 'MISC':
    case 'MOD':
    case 'MAGAZINE':
    default:
      return 'misc';
  }
};

const getCategoryLabel = (category: InvSubTab): string => {
  const labels: Record<InvSubTab, string> = {
    weapons: 'WEAPONS',
    apparel: 'APPAREL',
    aid: 'AID',
    misc: 'MISC',
    ammo: 'AMMO',
  };
  return labels[category];
};

export const InvTab = () => {
  const { character } = useCharacter();
  const [activeSubTab, setActiveSubTab] = useState<InvSubTab>('weapons');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const { playBeep } = useSound();

  const handleSubTabChange = (tab: InvSubTab) => {
    playBeep();
    setActiveSubTab(tab);
    setSelectedItem(null);
  };

  const handleItemSelect = (item: InventoryItem) => {
    playBeep();
    setSelectedItem(item);
  };

  if (!character) {
    return <LoadingMessage>LOADING CHARACTER DATA...</LoadingMessage>;
  }

  const inventory = character.inventory || [];

  // Group items by category
  const itemsByCategory = inventory.reduce((acc, item) => {
    const category = mapItemTypeToCategory(item.itemType);
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<InvSubTab, InventoryItem[]>);

  const currentItems = itemsByCategory[activeSubTab] || [];

  // Auto-select first item when changing tabs
  if (currentItems.length > 0 && !selectedItem) {
    setSelectedItem(currentItems[0]);
  }

  const renderItemDetails = () => {
    if (!selectedItem) {
      return (
        <div style={{ opacity: 0.5, textAlign: 'center', marginTop: '50px' }}>
          SELECT AN ITEM
        </div>
      );
    }

    return (
      <DetailBox>
        <DetailTitle>ITEM ID: {selectedItem.itemId.slice(0, 8).toUpperCase()}</DetailTitle>

        <DetailSection>
          <DetailRow>
            <span>Type</span>
            <span>{selectedItem.itemType}</span>
          </DetailRow>
          <DetailRow>
            <span>Quantity</span>
            <span>{selectedItem.quantity}</span>
          </DetailRow>
          {selectedItem.condition !== undefined && selectedItem.condition !== null && (
            <DetailRow>
              <span>Condition</span>
              <span>{selectedItem.condition}%</span>
            </DetailRow>
          )}
          <DetailRow>
            <span>Equipped</span>
            <span>{selectedItem.isEquipped ? 'YES' : 'NO'}</span>
          </DetailRow>
          {selectedItem.equippedSlot && (
            <DetailRow>
              <span>Slot</span>
              <span>{selectedItem.equippedSlot}</span>
            </DetailRow>
          )}
        </DetailSection>

        <div style={{
          fontSize: '10px',
          opacity: 0.6,
          marginTop: '20px',
          padding: '10px',
          background: 'rgba(18, 255, 21, 0.05)',
          border: `1px solid ${PIPBOY_COLORS.primary}`,
        }}>
          Note: Full item details (name, stats, description) require encyclopedia integration.
          Item ID can be used to fetch complete data from WeaponMaster/ArmorMaster/ConsumableMaster tables.
        </div>
      </DetailBox>
    );
  };

  return (
    <InvContainer>
      <SubNav>
        {(['weapons', 'apparel', 'aid', 'misc', 'ammo'] as InvSubTab[]).map((tab) => (
          <SubNavButton
            key={tab}
            $active={activeSubTab === tab}
            onClick={() => handleSubTabChange(tab)}
          >
            {getCategoryLabel(tab)}
          </SubNavButton>
        ))}
      </SubNav>

      {currentItems.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: '40px' }}>📦</div>
          <div>NO {getCategoryLabel(activeSubTab)}</div>
          <div style={{ fontSize: '12px', opacity: 0.6 }}>
            Use the dev cheats menu (F12) to add items to your inventory
          </div>
        </EmptyState>
      ) : (
        <ContentLayout>
          <LeftBox>
            <ItemsList>
              {currentItems.map((item) => (
                <ItemRow
                  key={item.id}
                  $selected={selectedItem?.id === item.id}
                  $equipped={item.isEquipped}
                  onClick={() => handleItemSelect(item)}
                  whileHover={{ x: 5 }}
                >
                  <ItemName>
                    {item.itemType} #{item.itemId.slice(0, 8)}
                  </ItemName>
                  {item.quantity > 1 && (
                    <ItemQuantity>x{item.quantity}</ItemQuantity>
                  )}
                </ItemRow>
              ))}
            </ItemsList>
          </LeftBox>

          <RightBox>
            {renderItemDetails()}
          </RightBox>
        </ContentLayout>
      )}
    </InvContainer>
  );
};
