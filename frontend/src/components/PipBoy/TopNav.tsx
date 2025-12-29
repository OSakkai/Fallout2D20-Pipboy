import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { PipBoyTab } from '../../types';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { useSound } from '../../hooks/useSound';

const TopNavContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 20px;
  background: #000000;
  border-bottom: 2px solid ${PIPBOY_COLORS.primary};
  position: relative;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(18, 255, 21, 0.2);

  @media (max-width: 1024px) {
    padding: 12px 15px;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  gap: clamp(20px, 5vw, 60px);

  @media (max-width: 768px) {
    gap: clamp(15px, 4vw, 40px);
  }

  @media (max-width: 480px) {
    gap: clamp(10px, 3vw, 25px);
  }
`;

const TabButton = styled(motion.button)<{ $active: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.$active ? PIPBOY_COLORS.bright : PIPBOY_COLORS.primary};
  font-size: clamp(24px, 3.5vw, 32px);
  font-weight: bold;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};
  letter-spacing: clamp(1.5px, 0.2vw, 3px);
  cursor: pointer;
  padding: 10px 16px;
  position: relative;
  opacity: ${props => props.$active ? 1 : 0.7};
  text-shadow: ${props => props.$active ? PIPBOY_TEXT_GLOW.standard : PIPBOY_TEXT_GLOW.subtle};
  transition: all 0.2s ease;
  flex: 1;
  text-align: center;
  white-space: nowrap;

  &:hover {
    opacity: 1;
    text-shadow: ${PIPBOY_TEXT_GLOW.standard};
    transform: translateY(-2px);
  }

  ${props => props.$active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 10%;
      right: 10%;
      height: 3px;
      background: ${PIPBOY_COLORS.bright};
      box-shadow: 0 0 6px ${PIPBOY_COLORS.primary}, 0 0 10px ${PIPBOY_COLORS.primary};
    }
  `}

  @media (max-width: 1024px) {
    font-size: clamp(20px, 3vw, 26px);
    padding: 8px 14px;
  }

  @media (max-width: 768px) {
    font-size: clamp(18px, 2.5vw, 22px);
    padding: 6px 10px;
    letter-spacing: clamp(1px, 0.15vw, 2px);
  }

  @media (max-width: 480px) {
    font-size: clamp(14px, 2.2vw, 18px);
    padding: 5px 8px;
  }
`;

const SubTabIndicator = styled.div`
  position: absolute;
  right: 20px;
  font-size: clamp(11px, 1.2vw, 14px);
  color: ${PIPBOY_COLORS.primary};
  opacity: 0.7;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};

  @media (max-width: 768px) {
    font-size: clamp(9px, 1vw, 12px);
    right: 15px;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

interface TopNavProps {
  activeTab: PipBoyTab;
  onTabChange: (tab: PipBoyTab) => void;
  subTab?: string;
}

const tabs: { id: PipBoyTab; label: string }[] = [
  { id: 'stat', label: 'STAT' },
  { id: 'inv', label: 'INV' },
  { id: 'data', label: 'DATA' },
  { id: 'map', label: 'MAP' },
  { id: 'radio', label: 'RADIO' },
];

export const TopNav = ({ activeTab, onTabChange, subTab }: TopNavProps) => {
  const { playCategoryChange, playBeep } = useSound();

  const handleTabChange = (tab: PipBoyTab) => {
    if (tab !== activeTab) {
      playCategoryChange();
      onTabChange(tab);
    }
  };

  return (
    <TopNavContainer>
      <TabsContainer>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => handleTabChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabsContainer>

      {subTab && <SubTabIndicator>{subTab}</SubTabIndicator>}
    </TopNavContainer>
  );
};
