import styled from 'styled-components';
import { motion } from 'framer-motion';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.8);
  border-top: 2px solid ${PIPBOY_COLORS.primary};
  box-shadow: 0 0 15px rgba(18, 255, 21, 0.3);
  gap: 20px;

  @media (max-width: 768px) {
    padding: 10px 15px;
    flex-direction: column;
    gap: 10px;
  }
`;

const StatGroup = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-around;
  }
`;

const StatBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 150px;

  @media (max-width: 768px) {
    min-width: 120px;
  }
`;

const StatLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${PIPBOY_TYPOGRAPHY.sizes.footer};
  color: ${PIPBOY_COLORS.primary};
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const BarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(18, 255, 21, 0.1);
  border: 2px solid ${PIPBOY_COLORS.primary};
  border-radius: 2px;
  overflow: hidden;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
`;

const BarFill = styled(motion.div)<{ $percentage: number; $color?: string }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: ${props => props.$color || PIPBOY_COLORS.primary};
  box-shadow: 0 0 10px ${props => props.$color || 'rgba(18, 255, 21, 0.6)'};
  transition: width 0.5s ease;
`;

const LevelInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const LevelLabel = styled.div`
  font-size: 11px;
  color: ${PIPBOY_COLORS.primary};
  opacity: 0.7;
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
`;

const LevelValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${PIPBOY_COLORS.primary};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const CharacterName = styled.div`
  font-size: 14px;
  color: ${PIPBOY_COLORS.primary};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};
  letter-spacing: ${PIPBOY_TYPOGRAPHY.letterSpacing.normal};

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

interface PipBoyFooterProps {
  hp?: number;
  maxHP?: number;
  ap?: number;
  maxAP?: number;
  level?: number;
  characterName?: string;
}

export const PipBoyFooter = ({
  hp = 110,
  maxHP = 110,
  ap = 90,
  maxAP = 90,
  level = 6,
  characterName = 'CHUCK'
}: PipBoyFooterProps) => {
  const hpPercentage = (hp / maxHP) * 100;
  const apPercentage = (ap / maxAP) * 100;

  // Cor da barra de HP baseada na porcentagem
  const getHPColor = () => {
    if (hpPercentage > 66) return PIPBOY_COLORS.primary;
    if (hpPercentage > 33) return '#ffa500';
    return '#ff4444';
  };

  return (
    <Footer>
      <StatGroup>
        <StatBar>
          <StatLabel>
            <span>HP</span>
            <span>{hp}/{maxHP}</span>
          </StatLabel>
          <BarContainer>
            <BarFill
              $percentage={hpPercentage}
              $color={getHPColor()}
              initial={{ width: 0 }}
              animate={{ width: `${hpPercentage}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </BarContainer>
        </StatBar>

        <StatBar>
          <StatLabel>
            <span>AP</span>
            <span>{ap}/{maxAP}</span>
          </StatLabel>
          <BarContainer>
            <BarFill
              $percentage={apPercentage}
              initial={{ width: 0 }}
              animate={{ width: `${apPercentage}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </BarContainer>
        </StatBar>
      </StatGroup>

      <LevelInfo>
        <LevelLabel>Level</LevelLabel>
        <LevelValue>{level}</LevelValue>
      </LevelInfo>

      <CharacterName>{characterName}</CharacterName>
    </Footer>
  );
};
