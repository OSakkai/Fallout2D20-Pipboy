import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.8);
  border-bottom: 2px solid ${PIPBOY_COLORS.primary};

  @media (max-width: 768px) {
    padding: 10px 15px;
    flex-wrap: wrap;
  }
`;

const Logo = styled.div`
  font-size: ${PIPBOY_TYPOGRAPHY.sizes.headerEm};
  font-weight: ${PIPBOY_TYPOGRAPHY.fontWeight};
  color: ${PIPBOY_COLORS.primary};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  letter-spacing: ${PIPBOY_TYPOGRAPHY.letterSpacing.header};
  text-transform: ${PIPBOY_TYPOGRAPHY.textTransform};

  @media (max-width: 768px) {
    font-size: 18px;
    letter-spacing: 3px;
  }
`;

const StatusBar = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 10px;
    width: 100%;
    margin-top: 10px;
    justify-content: space-between;
  }
`;

const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: ${PIPBOY_TYPOGRAPHY.sizes.footer};

  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const StatusLabel = styled.span`
  color: ${PIPBOY_COLORS.primary};
  opacity: 0.7;
  margin-bottom: 2px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
`;

const StatusValue = styled(motion.span)`
  color: ${PIPBOY_COLORS.primary};
  font-size: ${PIPBOY_TYPOGRAPHY.sizes.valuesEm};
  font-weight: bold;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const DateTime = styled.div`
  font-size: 14px;
  color: ${PIPBOY_COLORS.primary};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const PipBoyHeader = () => {
  const [time, setTime] = useState(new Date());
  const [hp] = useState(100);
  const [ap] = useState(85);
  const [level] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Header>
      <Logo>PIP-BOY 3000 MK IV</Logo>

      <StatusBar>
        <StatusItem>
          <StatusLabel>HP</StatusLabel>
          <StatusValue
            animate={{
              textShadow: hp < 30
                ? '0 0 5px #fff, 0 0 10px #ff4444, 0 0 20px #ff4444'
                : PIPBOY_TEXT_GLOW.standard
            }}
          >
            {hp}
          </StatusValue>
        </StatusItem>

        <StatusItem>
          <StatusLabel>AP</StatusLabel>
          <StatusValue>{ap}</StatusValue>
        </StatusItem>

        <StatusItem>
          <StatusLabel>LVL</StatusLabel>
          <StatusValue>{level}</StatusValue>
        </StatusItem>

        <DateTime>
          {formatTime(time)} | {formatDate(time)}
        </DateTime>
      </StatusBar>
    </Header>
  );
};
