import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { PipBoyTab } from '../../types';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { useSound } from '../../hooks/useSound';

const Nav = styled.nav`
  width: 80px;
  background: rgba(0, 0, 0, 0.8);
  border-right: 2px solid ${PIPBOY_COLORS.primary};
  display: flex;
  flex-direction: column;
  padding: 10px 0;

  @media (max-width: 768px) {
    width: 60px;
  }

  @media (max-width: 480px) {
    width: 100%;
    flex-direction: row;
    border-right: none;
    border-bottom: 2px solid ${PIPBOY_COLORS.primary};
    justify-content: space-around;
    padding: 10px;
  }
`;

const NavButton = styled(motion.button)<{ $active: boolean }>`
  background: ${props => props.$active ? `rgba(18, 255, 21, 0.15)` : 'transparent'};
  border: 2px solid ${props => props.$active ? PIPBOY_COLORS.primary : 'transparent'};
  color: ${PIPBOY_COLORS.primary};
  padding: 15px;
  margin: 5px;
  cursor: pointer;
  font-size: 12px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};
  transition: all 0.2s;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  opacity: ${props => props.$active ? 1 : 0.6};
  text-shadow: ${props => props.$active ? PIPBOY_TEXT_GLOW.standard : PIPBOY_TEXT_GLOW.subtle};
  box-shadow: ${props => props.$active ? `0 0 15px rgba(18, 255, 21, 0.4)` : 'none'};

  &:hover {
    background: rgba(18, 255, 21, 0.1);
    border-color: ${PIPBOY_COLORS.primary};
    opacity: 1;
    text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 10px;
  }

  @media (max-width: 480px) {
    flex: 1;
    padding: 8px;
  }
`;

const NavIcon = styled.div`
  font-size: 24px;
  /* Filtro para converter emojis/ícones em verde monocromático */
  filter: grayscale(100%) brightness(2) sepia(100%) hue-rotate(70deg) saturate(500%);

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

interface PipBoyNavProps {
  activeTab: PipBoyTab;
  onTabChange: (tab: PipBoyTab) => void;
}

const tabs: { id: PipBoyTab; label: string; icon: string }[] = [
  { id: 'stat', label: 'STAT', icon: '📊' },
  { id: 'inv', label: 'INV', icon: '🎒' },
  { id: 'data', label: 'DATA', icon: '📋' },
  { id: 'map', label: 'MAP', icon: '🗺️' },
  { id: 'radio', label: 'RADIO', icon: '📻' },
];

export const PipBoyNav = ({ activeTab, onTabChange }: PipBoyNavProps) => {
  const { playSound } = useSound();

  const handleTabChange = (tab: PipBoyTab) => {
    playSound('tab_change');
    onTabChange(tab);
  };

  return (
    <Nav>
      {tabs.map((tab) => (
        <NavButton
          key={tab.id}
          $active={activeTab === tab.id}
          onClick={() => handleTabChange(tab.id)}
          onMouseEnter={() => playSound('hover')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavIcon>{tab.icon}</NavIcon>
          <span>{tab.label}</span>
        </NavButton>
      ))}
    </Nav>
  );
};
