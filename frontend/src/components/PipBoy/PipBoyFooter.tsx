import styled from 'styled-components';
import { motion } from 'framer-motion';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';

const Footer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(15px, 2vh, 25px) clamp(20px, 3vw, 40px);
  background: #000000;
  border-top: 3px solid ${PIPBOY_COLORS.primary};
  box-shadow: 0 -2px 10px rgba(18, 255, 21, 0.2);
  gap: clamp(30px, 5vw, 80px);
  position: relative;
  z-index: 10;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: clamp(15px, 3vw, 30px);
    padding: clamp(12px, 1.5vh, 20px) clamp(15px, 2vw, 30px);
  }
`;

const StatSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1vh, 12px);
  min-width: clamp(150px, 20vw, 280px);
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

const StatLabel = styled.div`
  font-size: clamp(14px, 1.5vw, 18px);
  color: ${PIPBOY_COLORS.primary};
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: uppercase;
  letter-spacing: clamp(1px, 0.2vw, 2px);
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: clamp(12px, 1.3vw, 16px);
  }
`;

const BarContainer = styled.div`
  width: 100%;
  height: clamp(16px, 2vh, 24px);
  background: rgba(18, 255, 21, 0.15);
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 3px;
  overflow: hidden;
  box-shadow:
    inset 0 0 8px rgba(0, 0, 0, 0.6),
    0 0 6px rgba(18, 255, 21, 0.15);
  position: relative;

  @media (max-width: 768px) {
    height: clamp(14px, 1.8vh, 20px);
  }
`;

const BarFill = styled(motion.div)<{ $percentage: number; $color?: string }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: ${props => props.$color || PIPBOY_COLORS.primary};
  box-shadow:
    0 0 10px ${props => props.$color || 'rgba(18, 255, 21, 0.6)'},
    inset 0 0 8px ${props => props.$color || 'rgba(18, 255, 21, 0.4)'};
  transition: width 0.5s ease;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.3),
      transparent
    );
  }
`;

const BarText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(12px, 1.2vw, 16px);
  font-weight: bold;
  color: ${PIPBOY_COLORS.primary};
  text-shadow:
    0 0 3px #000,
    0 0 5px #000,
    ${PIPBOY_TEXT_GLOW.standard};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  letter-spacing: clamp(0.5px, 0.1vw, 1px);
  z-index: 1;

  @media (max-width: 768px) {
    font-size: clamp(10px, 1vw, 14px);
  }
`;

const LevelSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1vh, 12px);
  min-width: clamp(300px, 40vw, 500px);
  flex: 2;

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

const LevelLabel = styled.div`
  font-size: clamp(14px, 1.5vw, 18px);
  color: ${PIPBOY_COLORS.primary};
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: uppercase;
  letter-spacing: clamp(1px, 0.2vw, 2px);
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: clamp(12px, 1.3vw, 16px);
  }
`;

const LevelBarContainer = styled.div`
  width: 100%;
  height: clamp(16px, 2vh, 24px);
  background: rgba(18, 255, 21, 0.15);
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 3px;
  overflow: hidden;
  box-shadow:
    inset 0 0 8px rgba(0, 0, 0, 0.6),
    0 0 6px rgba(18, 255, 21, 0.15);
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 clamp(8px, 1vw, 15px);
  gap: 2px;

  @media (max-width: 768px) {
    height: clamp(14px, 1.8vh, 20px);
    padding: 0 clamp(6px, 0.8vw, 12px);
  }
`;

const XPBar = styled.div`
  display: flex;
  gap: clamp(1px, 0.1vw, 2px);
  flex: 1;
  height: 60%;
`;

const XPSegment = styled.div<{ $filled: boolean }>`
  flex: 1;
  background: ${props => props.$filled ? PIPBOY_COLORS.bright : 'rgba(18, 255, 21, 0.2)'};
  box-shadow: ${props => props.$filled
    ? `0 0 2px ${PIPBOY_COLORS.primary}, inset 0 0 1px rgba(255, 255, 255, 0.2)`
    : 'none'};
  border-radius: 1px;
  transition: all 0.3s ease;
`;

const LevelNumber = styled.span`
  font-size: clamp(13px, 1.3vw, 17px);
  font-weight: bold;
  color: ${PIPBOY_COLORS.bright};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  margin-left: clamp(6px, 0.8vw, 10px);

  @media (max-width: 768px) {
    font-size: clamp(11px, 1.1vw, 15px);
  }
`;

interface PipBoyFooterProps {
  hp?: number;
  maxHP?: number;
  ap?: number;
  maxAP?: number;
  level?: number;
  currentXP?: number;
  xpForNextLevel?: number;
}

export const PipBoyFooter = ({
  hp = 115,
  maxHP = 115,
  ap = 100,
  maxAP = 100,
  level = 6,
  currentXP = 850,
  xpForNextLevel = 1000
}: PipBoyFooterProps) => {
  const hpPercentage = (hp / maxHP) * 100;
  const apPercentage = (ap / maxAP) * 100;
  const xpPercentage = (currentXP / xpForNextLevel) * 100;

  // 20 segmentos para a barra de XP
  const totalSegments = 20;
  const filledSegments = Math.floor((xpPercentage / 100) * totalSegments);

  // Cor da barra de HP baseada na porcentagem
  const getHPColor = () => {
    if (hpPercentage > 66) return PIPBOY_COLORS.primary;
    if (hpPercentage > 33) return '#ffa500';
    return '#ff4444';
  };

  return (
    <Footer>
      {/* HP */}
      <StatSection>
        <StatLabel>HP: {hp}/{maxHP}</StatLabel>
        <BarContainer>
          <BarFill
            $percentage={hpPercentage}
            $color={getHPColor()}
            initial={{ width: 0 }}
            animate={{ width: `${hpPercentage}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </BarContainer>
      </StatSection>

      {/* LEVEL com barra de XP */}
      <LevelSection>
        <LevelLabel>LEVEL {level}</LevelLabel>
        <LevelBarContainer>
          <XPBar>
            {Array.from({ length: totalSegments }).map((_, index) => (
              <XPSegment
                key={index}
                $filled={index < filledSegments}
              />
            ))}
          </XPBar>
        </LevelBarContainer>
      </LevelSection>

      {/* AP */}
      <StatSection>
        <StatLabel>AP: {ap}/{maxAP}</StatLabel>
        <BarContainer>
          <BarFill
            $percentage={apPercentage}
            initial={{ width: 0 }}
            animate={{ width: `${apPercentage}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </BarContainer>
      </StatSection>
    </Footer>
  );
};
