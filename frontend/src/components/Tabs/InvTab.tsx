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

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: var(--columns);
  column-gap: 5px;
  padding: 10px 15px;
  background: rgba(18, 255, 21, 0.2);
  border-bottom: 2px solid ${PIPBOY_COLORS.primary};
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
`;

const TableBody = styled.div`
  overflow-y: auto;
  flex: 1;
`;

const ItemRow = styled(motion.div)<{ $selected: boolean }>`
  display: grid;
  grid-template-columns: var(--columns);
  column-gap: 5px;
  padding: 8px 15px;
  background: ${props => props.$selected ? 'rgba(18, 255, 21, 0.4)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  font-size: 11px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: uppercase;
  border-left: ${props => props.$selected ? `4px solid ${PIPBOY_COLORS.bright}` : '4px solid transparent'};
  color: ${props => props.$selected ? PIPBOY_COLORS.bright : PIPBOY_COLORS.primary};
  font-weight: ${props => props.$selected ? 'bold' : 'normal'};

  &:hover {
    background: ${props => props.$selected ? 'rgba(18, 255, 21, 0.4)' : 'rgba(18, 255, 21, 0.15)'};
  }
`;

const CellText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FirstCell = styled(CellText)`
  padding-right: 15px;
`;

const VaultBoySection = styled.div`
  width: 100%;
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${PIPBOY_COLORS.primary};
  background: rgba(18, 255, 21, 0.05);
  margin-bottom: 8px;
  position: relative;
  min-height: 120px;
  flex-shrink: 0;

  &::after {
    content: 'VAULT BOY';
    position: absolute;
    bottom: 6px;
    font-size: 9px;
    color: ${PIPBOY_COLORS.primary};
    opacity: 0.6;
    font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  }
`;

const DetailSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  padding: 0 4px 0 0;
  max-width: 100%;
`;

const DetailTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  margin-bottom: 6px;
  border-bottom: 2px solid ${PIPBOY_COLORS.primary};
  padding-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span:last-child {
    font-weight: bold;
    text-align: right;
    width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const DetailDescription = styled.div`
  font-size: 10px;
  opacity: 0.8;
  line-height: 1.5;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  margin-top: 6px;
  padding: 8px;
  background: rgba(18, 255, 21, 0.05);
  border: 1px solid ${PIPBOY_COLORS.primary};
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

type InvSubTab = 'weapons' | 'apparel' | 'aid' | 'misc' | 'junk' | 'ammo';

interface BaseItem {
  id: string;
  name: string;
  category: InvSubTab;
  weight: number;
  value: number;
  description: string;
}

interface WeaponItem extends BaseItem {
  category: 'weapons';
  dmg: string;
  damageType: string;
  ammoType: string;
  range: string;
  fireRate: string;
  qualities: string;
}

interface ApparelItem extends BaseItem {
  category: 'apparel';
  ar: string;
  arType: string;
  ballisticDR: number;
  energyDR: number;
  radiationDR: number;
  poisonDR?: number;
  bodyParts: string;
  extras?: string;
}

interface AidItem extends BaseItem {
  category: 'aid';
  hp: string;
  rad: string;
  effect: string;
  duration?: string;
  addiction?: string;
  extras?: string;
  quantity: number;
}

interface MiscItem extends BaseItem {
  category: 'misc';
  isQuestItem: boolean;
  quantity: number;
}

interface JunkItem extends BaseItem {
  category: 'junk';
  components: string;
  quantity: number;
}

interface AmmoItem extends BaseItem {
  category: 'ammo';
  caliber: string;
  damageBonus?: string;
  quantity: number;
}

type InventoryItem = WeaponItem | ApparelItem | AidItem | MiscItem | JunkItem | AmmoItem;

// DADOS MOCK
const inventoryItems: InventoryItem[] = [
  // WEAPONS
  { id: 'w1', category: 'weapons', name: '10MM PISTOL', dmg: '3 CD', damageType: 'Physical', ammoType: '10mm', range: 'Medium', fireRate: 'Single/Burst', qualities: 'Close Quarters, Reliable', weight: 1.5, value: 50, description: 'A reliable sidearm found throughout the wasteland. Standard issue for many security forces.' },
  { id: 'w2', category: 'weapons', name: 'LASER RIFLE', dmg: '5 CD', damageType: 'Energy', ammoType: 'Fusion Cell', range: 'Long', fireRate: 'Single/Burst', qualities: 'Burst, Reliable, Vicious', weight: 7, value: 200, description: 'Energy weapon firing concentrated beams of light. No ballistic drop.' },
  { id: 'w3', category: 'weapons', name: 'COMBAT SHOTGUN', dmg: '6 CD', damageType: 'Physical', ammoType: 'Shotgun Shell', range: 'Close', fireRate: 'Single', qualities: 'Spread, Vicious', weight: 12, value: 350, description: 'Devastating close-range weapon. Excellent for clearing rooms.' },
  { id: 'w4', category: 'weapons', name: 'HUNTING RIFLE', dmg: '4 CD', damageType: 'Physical', ammoType: '.308', range: 'Long', fireRate: 'Single', qualities: 'Accurate, Piercing 1', weight: 8, value: 180, description: 'Long-range precision rifle. Popular with wasteland snipers.' },
  { id: 'w5', category: 'weapons', name: 'PIPE RIFLE', dmg: '2 CD', damageType: 'Physical', ammoType: '.38', range: 'Medium', fireRate: 'Single', qualities: 'Inaccurate, Jamming', weight: 3, value: 25, description: 'Makeshift weapon cobbled together from scrap. Unreliable but common.' },
  { id: 'w6', category: 'weapons', name: 'MINIGUN', dmg: '8 CD', damageType: 'Physical', ammoType: '5mm', range: 'Medium', fireRate: 'Auto', qualities: 'Burst, Two-handed', weight: 28, value: 800, description: 'Rapid-fire heavy weapon. Devastating sustained fire.' },
  { id: 'w7', category: 'weapons', name: 'ASSAULT RIFLE', dmg: '5 CD', damageType: 'Physical', ammoType: '5.56mm', range: 'Long', fireRate: 'Single/Burst/Auto', qualities: 'Burst, Reliable', weight: 13, value: 400, description: 'Military-grade automatic rifle. Excellent balance of firepower and accuracy.' },
  { id: 'w8', category: 'weapons', name: 'PLASMA RIFLE', dmg: '6 CD', damageType: 'Energy', ammoType: 'Plasma Cartridge', range: 'Long', fireRate: 'Single/Burst', qualities: 'Vicious, Piercing 2, Burst', weight: 9, value: 500, description: 'Fires superheated bolts of plasma. Extremely powerful but rare ammunition.' },

  // APPAREL
  { id: 'a1', category: 'apparel', name: 'COMBAT ARMOR CHEST', ar: '40', arType: 'Physical', ballisticDR: 40, energyDR: 25, radiationDR: 0, bodyParts: 'Torso', weight: 5, value: 120, description: 'Military-grade polymer chest piece. Excellent all-around protection.' },
  { id: 'a2', category: 'apparel', name: 'LEATHER LEFT ARM', ar: '15', arType: 'Physical', ballisticDR: 15, energyDR: 5, radiationDR: 0, bodyParts: 'Left Arm', weight: 2, value: 30, description: 'Basic leather armor piece. Lightweight protection.' },
  { id: 'a3', category: 'apparel', name: 'METAL RIGHT LEG', ar: '25', arType: 'Physical', ballisticDR: 25, energyDR: 10, radiationDR: 0, bodyParts: 'Right Leg', weight: 8, value: 80, description: 'Heavy metal leg armor. Good protection but restricts movement.' },
  { id: 'a4', category: 'apparel', name: 'HAZMAT SUIT', ar: '1000', arType: 'Rad', ballisticDR: 0, energyDR: 0, radiationDR: 1000, bodyParts: 'Full Body', weight: 4, value: 150, extras: '-2 CHR', description: 'Protective suit designed for radiation zones. Excellent rad protection.' },
  { id: 'a5', category: 'apparel', name: 'POWER ARMOR HELMET', ar: '60', arType: 'Physical', ballisticDR: 60, energyDR: 50, radiationDR: 10, bodyParts: 'Head', weight: 10, value: 400, description: 'Pre-war powered armor helmet. Superior protection.' },
  { id: 'a6', category: 'apparel', name: 'VAULT SUIT', ar: '5', arType: 'Physical', ballisticDR: 5, energyDR: 0, radiationDR: 0, bodyParts: 'Torso, Arms, Legs', weight: 1, value: 10, extras: '+1 AGI', description: 'Standard issue Vault-Tec jumpsuit. Provides minimal protection.' },
  { id: 'a7', category: 'apparel', name: 'GAS MASK', ar: '50', arType: 'Rad', ballisticDR: 0, energyDR: 0, radiationDR: 50, bodyParts: 'Head', weight: 1, value: 25, description: 'Protective mask against airborne radiation and toxins.' },
  { id: 'a8', category: 'apparel', name: 'ROAD LEATHERS', ar: '10', arType: 'Physical', ballisticDR: 10, energyDR: 5, radiationDR: 0, bodyParts: 'Torso, Arms', weight: 3, value: 45, extras: '+1 CHR', description: 'Stylish wasteland outfit. Minimal protection but looks good.' },

  // AID
  { id: 'aid1', category: 'aid', name: 'STIMPAK', hp: '+15', rad: '0', effect: 'Restore HP', duration: 'Instant', addiction: 'No', weight: 0.1, value: 40, quantity: 5, description: 'Healing chemical. Restores health immediately.' },
  { id: 'aid2', category: 'aid', name: 'RADAWAY', hp: '0', rad: '-50', effect: 'Reduce Radiation', duration: '5 minutes', addiction: 'No', weight: 0.1, value: 80, quantity: 3, description: 'Removes radiation from the body over time.' },
  { id: 'aid3', category: 'aid', name: 'RAD-X', hp: '0', rad: '0', effect: 'Radiation Resistance', duration: '1 hour', addiction: 'No', extras: 'Rad Resist', weight: 0.1, value: 60, quantity: 4, description: 'Increases resistance to radiation temporarily.' },
  { id: 'aid4', category: 'aid', name: 'BUFFOUT', hp: '0', rad: '0', effect: '+2 STR, +2 END', duration: '30 minutes', addiction: 'Yes (15%)', extras: '+2 STR +2 END', weight: 0.1, value: 45, quantity: 2, description: 'Performance-enhancing chem. Increases strength and endurance.' },
  { id: 'aid5', category: 'aid', name: 'NUKA-COLA', hp: '+5', rad: '+5', effect: 'Restore HP and AP', duration: 'Instant', addiction: 'No', weight: 1, value: 20, quantity: 8, description: 'The taste you can see! Refreshing beverage from before the war.' },
  { id: 'aid6', category: 'aid', name: 'MENTATS', hp: '0', rad: '0', effect: '+2 INT, +2 PER', duration: '30 minutes', addiction: 'Yes (10%)', extras: '+2 INT +2 PER', weight: 0.1, value: 50, quantity: 3, description: 'Brain-boosting chem. Enhances mental acuity.' },
  { id: 'aid7', category: 'aid', name: 'PURIFIED WATER', hp: '+15', rad: '-10', effect: 'Restore HP, Reduce Rads', duration: 'Instant', addiction: 'No', weight: 0.5, value: 15, quantity: 6, description: 'Clean, purified water. Essential for survival.' },
  { id: 'aid8', category: 'aid', name: 'PSYCHO', hp: '0', rad: '0', effect: '+25% Damage', duration: '15 minutes', addiction: 'Yes (25%)', extras: '+3 DMG', weight: 0.1, value: 55, quantity: 1, description: 'Military combat drug. Increases damage output significantly.' },

  // MISC
  { id: 'm1', category: 'misc', name: 'DUCT TAPE', weight: 0.1, value: 8, isQuestItem: false, quantity: 4, description: 'Multi-purpose adhesive tape. Useful for crafting and repairs.' },
  { id: 'm2', category: 'misc', name: 'HOT PLATE', weight: 2, value: 15, isQuestItem: false, quantity: 1, description: 'Portable cooking device. Contains useful electronic components.' },
  { id: 'm3', category: 'misc', name: 'BOBBY PIN', weight: 0, value: 4, isQuestItem: false, quantity: 24, description: 'Essential lockpicking tool. Breaks easily.' },
  { id: 'm4', category: 'misc', name: 'BLAST RADIUS BOARD GAME', weight: 1, value: 18, isQuestItem: false, quantity: 1, description: 'Pre-war board game. Collector\'s item.' },
  { id: 'm5', category: 'misc', name: 'FLIP LIGHTER', weight: 0.1, value: 6, isQuestItem: false, quantity: 2, description: 'Reliable fire-starting device.' },
  { id: 'm6', category: 'misc', name: 'SENSOR MODULE', weight: 1, value: 45, isQuestItem: false, quantity: 1, description: 'Advanced electronic sensor. Valuable crafting component.' },
  { id: 'm7', category: 'misc', name: 'FUSION PULSE CHARGE', weight: 0.5, value: 120, isQuestItem: false, quantity: 3, description: 'Explosive device with fusion core. Handle with care.' },
  { id: 'm8', category: 'misc', name: 'HOLOTAPE - OVERSEER', weight: 0, value: 0, isQuestItem: true, quantity: 1, description: 'Audio recording from the Vault Overseer. Contains important information about Vault-Tec\'s true purpose.' },

  // JUNK
  { id: 'j1', category: 'junk', name: 'ALUMINUM CAN', components: 'Aluminum (2)', weight: 0.1, value: 2, quantity: 12, description: 'Empty aluminum can. Can be scrapped for aluminum.' },
  { id: 'j2', category: 'junk', name: 'CERAMIC BOWL', components: 'Ceramic (2)', weight: 0.5, value: 3, quantity: 5, description: 'Decorative ceramic bowl. Source of ceramic materials.' },
  { id: 'j3', category: 'junk', name: 'ABRAXO CLEANER', components: 'Acid (1), Cloth (1)', weight: 1, value: 5, quantity: 3, description: 'Pre-war cleaning product. Contains useful chemicals.' },
  { id: 'j4', category: 'junk', name: 'DUCT TAPE', components: 'Adhesive (2), Cloth (1)', weight: 0.1, value: 8, quantity: 7, description: 'Essential crafting material. Provides adhesive.' },
  { id: 'j5', category: 'junk', name: 'NUCLEAR MATERIAL', components: 'Nuclear Material (1)', weight: 0.1, value: 25, quantity: 2, description: 'Radioactive material. Used in advanced crafting.' },
  { id: 'j6', category: 'junk', name: 'STEEL', components: 'Steel (1)', weight: 0.1, value: 3, quantity: 45, description: 'Basic building material. Useful for repairs and crafting.' },
  { id: 'j7', category: 'junk', name: 'WOOD', components: 'Wood (1)', weight: 0.5, value: 1, quantity: 28, description: 'Scrap wood. Can be used for building and fuel.' },
  { id: 'j8', category: 'junk', name: 'CIRCUITRY', components: 'Circuitry (1)', weight: 0.1, value: 20, quantity: 8, description: 'Electronic circuitry. Valuable for advanced mods.' },

  // AMMO
  { id: 'am1', category: 'ammo', name: '.308 ROUND', caliber: '.308', weight: 0.02, value: 3, quantity: 87, description: 'High-powered rifle ammunition. Good stopping power.' },
  { id: 'am2', category: 'ammo', name: '10MM ROUND', caliber: '10mm', weight: 0.01, value: 1, quantity: 245, description: 'Common pistol ammunition. Widely available.' },
  { id: 'am3', category: 'ammo', name: 'FUSION CELL', caliber: 'Energy', weight: 0.03, value: 4, quantity: 156, description: 'Energy weapon ammunition. Powers laser weapons.' },
  { id: 'am4', category: 'ammo', name: 'SHOTGUN SHELL', caliber: '12 Gauge', weight: 0.05, value: 5, quantity: 64, description: 'Shotgun ammunition. Devastating at close range.' },
  { id: 'am5', category: 'ammo', name: '5.56MM ROUND', caliber: '5.56mm', weight: 0.02, value: 2, quantity: 312, description: 'Military rifle ammunition. Standard issue.' },
  { id: 'am6', category: 'ammo', name: '.50 CAL', caliber: '.50', weight: 0.1, value: 8, quantity: 42, description: 'Heavy caliber ammunition. Extreme stopping power.' },
  { id: 'am7', category: 'ammo', name: 'PLASMA CARTRIDGE', caliber: 'Energy', weight: 0.03, value: 6, quantity: 78, description: 'Plasma weapon ammunition. Superheated projectiles.' },
  { id: 'am8', category: 'ammo', name: 'MINI NUKE', caliber: 'Nuclear', damageBonus: '+50 Blast', weight: 3, value: 250, quantity: 5, description: 'Tactical nuclear warhead. Ultimate destructive power.' },
];

const getColumns = (category: InvSubTab) => {
  switch (category) {
    case 'weapons':
      return '1fr 75px 55px 65px 75px';
    case 'apparel':
      return '1fr 110px 55px 55px 65px 75px';
    case 'aid':
      return '1fr 110px 50px 50px 55px 65px 75px';
    case 'misc':
    case 'junk':
    case 'ammo':
      return '1fr 55px 65px 75px';
    default:
      return '1fr 55px 65px 75px';
  }
};

const getHeaders = (category: InvSubTab) => {
  switch (category) {
    case 'weapons':
      return ['INVENTORY', 'DMG', 'WT', 'VAL', 'V/W'];
    case 'apparel':
      return ['INVENTORY', 'EXTRAS', 'AR', 'WT', 'VAL', 'V/W'];
    case 'aid':
      return ['INVENTORY', 'EXTRAS', 'HP', 'RAD', 'WT', 'VAL', 'V/W'];
    case 'misc':
    case 'junk':
    case 'ammo':
      return ['INVENTORY', 'WT', 'VAL', 'V/W'];
    default:
      return ['INVENTORY', 'WT', 'VAL', 'V/W'];
  }
};

const getCellData = (item: InventoryItem) => {
  const vw = item.weight > 0 ? (item.value / item.weight).toFixed(1) : '0';

  switch (item.category) {
    case 'weapons':
      return [item.name, item.dmg, item.weight.toString(), item.value.toString(), vw];
    case 'apparel': {
      const apparel = item as ApparelItem;
      return [
        apparel.name,
        apparel.extras || '-',
        `${apparel.ar} ${apparel.arType}`,
        apparel.weight.toString(),
        apparel.value.toString(),
        vw
      ];
    }
    case 'aid': {
      const aid = item as AidItem;
      return [
        aid.name,
        aid.extras || '-',
        aid.hp,
        aid.rad,
        aid.weight.toString(),
        aid.value.toString(),
        vw
      ];
    }
    case 'misc':
    case 'junk':
    case 'ammo':
      return [item.name, item.weight.toString(), item.value.toString(), vw];
    default:
      return [item.name, item.weight.toString(), item.value.toString(), vw];
  }
};

const renderItemDetails = (item: InventoryItem | null) => {
  if (!item) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        opacity: 0.5,
        fontFamily: PIPBOY_TYPOGRAPHY.fontFamily,
        textTransform: 'uppercase'
      }}>
        SELECT AN ITEM
      </div>
    );
  }

  const vw = item.weight > 0 ? (item.value / item.weight).toFixed(1) : '0';

  switch (item.category) {
    case 'weapons': {
      const weapon = item as WeaponItem;
      return (
        <>
          <VaultBoySection>
            <span style={{ fontSize: '60px', opacity: 0.3 }}>🔫</span>
          </VaultBoySection>
          <DetailSection>
            <DetailTitle>{weapon.name}</DetailTitle>
            <DetailRow><span>DAMAGE</span><span>{weapon.dmg} {weapon.damageType}</span></DetailRow>
            <DetailRow><span>AMMO TYPE</span><span>{weapon.ammoType}</span></DetailRow>
            <DetailRow><span>RANGE</span><span>{weapon.range}</span></DetailRow>
            <DetailRow><span>FIRE RATE</span><span>{weapon.fireRate}</span></DetailRow>
            <DetailRow><span>QUALITIES</span><span>{weapon.qualities}</span></DetailRow>
            <DetailRow><span>WEIGHT</span><span>{weapon.weight} LBS</span></DetailRow>
            <DetailRow><span>VALUE</span><span>{weapon.value} CAPS</span></DetailRow>
            <DetailRow><span>VALUE/WEIGHT</span><span>{vw}</span></DetailRow>
            <DetailDescription>{weapon.description}</DetailDescription>
          </DetailSection>
        </>
      );
    }
    case 'apparel': {
      const apparel = item as ApparelItem;
      return (
        <>
          <VaultBoySection>
            <span style={{ fontSize: '60px', opacity: 0.3 }}>🛡️</span>
          </VaultBoySection>
          <DetailSection>
            <DetailTitle>{apparel.name}</DetailTitle>
            <DetailRow><span>BALLISTIC DR</span><span>{apparel.ballisticDR}</span></DetailRow>
            <DetailRow><span>ENERGY DR</span><span>{apparel.energyDR}</span></DetailRow>
            <DetailRow><span>RADIATION DR</span><span>{apparel.radiationDR}</span></DetailRow>
            {apparel.poisonDR && <DetailRow><span>POISON DR</span><span>{apparel.poisonDR}</span></DetailRow>}
            <DetailRow><span>BODY PARTS</span><span>{apparel.bodyParts}</span></DetailRow>
            {apparel.extras && <DetailRow><span>SPECIAL BONUS</span><span>{apparel.extras}</span></DetailRow>}
            <DetailRow><span>WEIGHT</span><span>{apparel.weight} LBS</span></DetailRow>
            <DetailRow><span>VALUE</span><span>{apparel.value} CAPS</span></DetailRow>
            <DetailRow><span>VALUE/WEIGHT</span><span>{vw}</span></DetailRow>
            <DetailDescription>{apparel.description}</DetailDescription>
          </DetailSection>
        </>
      );
    }
    case 'aid': {
      const aid = item as AidItem;
      return (
        <>
          <VaultBoySection>
            <span style={{ fontSize: '60px', opacity: 0.3 }}>💊</span>
          </VaultBoySection>
          <DetailSection>
            <DetailTitle>{aid.name}</DetailTitle>
            <DetailRow><span>EFFECT</span><span>{aid.effect}</span></DetailRow>
            <DetailRow><span>HP RESTORED</span><span>{aid.hp}</span></DetailRow>
            <DetailRow><span>RADS REMOVED/ADDED</span><span>{aid.rad}</span></DetailRow>
            {aid.duration && <DetailRow><span>DURATION</span><span>{aid.duration}</span></DetailRow>}
            {aid.addiction && <DetailRow><span>ADDICTION</span><span>{aid.addiction}</span></DetailRow>}
            {aid.extras && <DetailRow><span>SPECIAL BONUS</span><span>{aid.extras}</span></DetailRow>}
            <DetailRow><span>WEIGHT</span><span>{aid.weight} LBS</span></DetailRow>
            <DetailRow><span>VALUE</span><span>{aid.value} CAPS</span></DetailRow>
            <DetailRow><span>VALUE/WEIGHT</span><span>{vw}</span></DetailRow>
            <DetailRow><span>QUANTITY</span><span>{aid.quantity}</span></DetailRow>
            <DetailDescription>{aid.description}</DetailDescription>
          </DetailSection>
        </>
      );
    }
    case 'misc': {
      const misc = item as MiscItem;
      return (
        <>
          <VaultBoySection>
            <span style={{ fontSize: '60px', opacity: 0.3 }}>📦</span>
          </VaultBoySection>
          <DetailSection>
            <DetailTitle>{misc.name}</DetailTitle>
            <DetailRow><span>QUEST ITEM</span><span>{misc.isQuestItem ? 'YES' : 'NO'}</span></DetailRow>
            <DetailRow><span>WEIGHT</span><span>{misc.weight} LBS</span></DetailRow>
            <DetailRow><span>VALUE</span><span>{misc.value} CAPS</span></DetailRow>
            <DetailRow><span>VALUE/WEIGHT</span><span>{vw}</span></DetailRow>
            <DetailRow><span>QUANTITY</span><span>{misc.quantity}</span></DetailRow>
            <DetailDescription>{misc.description}</DetailDescription>
          </DetailSection>
        </>
      );
    }
    case 'junk': {
      const junk = item as JunkItem;
      return (
        <>
          <VaultBoySection>
            <span style={{ fontSize: '60px', opacity: 0.3 }}>🔧</span>
          </VaultBoySection>
          <DetailSection>
            <DetailTitle>{junk.name}</DetailTitle>
            <DetailRow><span>COMPONENTS</span><span>{junk.components}</span></DetailRow>
            <DetailRow><span>WEIGHT</span><span>{junk.weight} LBS</span></DetailRow>
            <DetailRow><span>VALUE</span><span>{junk.value} CAPS</span></DetailRow>
            <DetailRow><span>VALUE/WEIGHT</span><span>{vw}</span></DetailRow>
            <DetailRow><span>QUANTITY</span><span>{junk.quantity}</span></DetailRow>
            <DetailDescription>{junk.description}</DetailDescription>
          </DetailSection>
        </>
      );
    }
    case 'ammo': {
      const ammo = item as AmmoItem;
      return (
        <>
          <VaultBoySection>
            <span style={{ fontSize: '60px', opacity: 0.3 }}>🎯</span>
          </VaultBoySection>
          <DetailSection>
            <DetailTitle>{ammo.name}</DetailTitle>
            <DetailRow><span>CALIBER</span><span>{ammo.caliber}</span></DetailRow>
            {ammo.damageBonus && <DetailRow><span>DAMAGE BONUS</span><span>{ammo.damageBonus}</span></DetailRow>}
            <DetailRow><span>WEIGHT PER UNIT</span><span>{ammo.weight} LBS</span></DetailRow>
            <DetailRow><span>VALUE PER UNIT</span><span>{ammo.value} CAPS</span></DetailRow>
            <DetailRow><span>VALUE/WEIGHT</span><span>{vw}</span></DetailRow>
            <DetailRow><span>QUANTITY</span><span>{ammo.quantity}</span></DetailRow>
            <DetailDescription>{ammo.description}</DetailDescription>
          </DetailSection>
        </>
      );
    }
    default:
      return null;
  }
};

export const InvTab = () => {
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

  const filteredItems = inventoryItems.filter(item => item.category === activeSubTab);
  const columns = getColumns(activeSubTab);
  const headers = getHeaders(activeSubTab);

  return (
    <InvContainer>
      <SubNav>
        <SubNavButton
          $active={activeSubTab === 'weapons'}
          onClick={() => handleSubTabChange('weapons')}
        >
          WEAPONS
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'apparel'}
          onClick={() => handleSubTabChange('apparel')}
        >
          APPAREL
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'aid'}
          onClick={() => handleSubTabChange('aid')}
        >
          AID
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'misc'}
          onClick={() => handleSubTabChange('misc')}
        >
          MISC
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'junk'}
          onClick={() => handleSubTabChange('junk')}
        >
          JUNK
        </SubNavButton>
        <SubNavButton
          $active={activeSubTab === 'ammo'}
          onClick={() => handleSubTabChange('ammo')}
        >
          AMMO
        </SubNavButton>
      </SubNav>

      <ContentLayout>
        <LeftBox style={{ '--columns': columns } as React.CSSProperties}>
          <TableHeader style={{ '--columns': columns } as React.CSSProperties}>
            {headers.map((header, index) =>
              index === 0 ? (
                <FirstCell key={index}>{header}</FirstCell>
              ) : (
                <CellText key={index}>{header}</CellText>
              )
            )}
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <ItemRow
                key={item.id}
                $selected={selectedItem?.id === item.id}
                onClick={() => handleItemSelect(item)}
                style={{ '--columns': columns } as React.CSSProperties}
              >
                {getCellData(item).map((cell, index) =>
                  index === 0 ? (
                    <FirstCell key={index}>{cell}</FirstCell>
                  ) : (
                    <CellText key={index}>{cell}</CellText>
                  )
                )}
              </ItemRow>
            ))}
          </TableBody>
        </LeftBox>

        <RightBox>
          {renderItemDetails(selectedItem)}
        </RightBox>
      </ContentLayout>
    </InvContainer>
  );
};
