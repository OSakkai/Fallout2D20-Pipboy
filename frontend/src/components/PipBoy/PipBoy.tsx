import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import type { PipBoyTab } from '../../types';
import { CRTEffect } from '../Effects/CRTEffect';
import { PipBoyHeader } from './PipBoyHeader';
import { PipBoyNav } from './PipBoyNav';
import { TabContent } from './TabContent';
import { PipBoyFooter } from './PipBoyFooter';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';
import { useSound } from '../../hooks/useSound';

const PipBoyContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PipBoyPhysicalFrame = styled.div`
  position: relative;
  width: 95%;
  height: 95%;
  max-width: 1400px;
  max-height: 900px;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 50%, #0a0a0a 100%);
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.9),
    inset 0 0 40px rgba(0, 0, 0, 0.8);

  &::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border: 2px solid #333;
    border-radius: 15px;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
    padding: 20px 15px;
  }
`;

const PipBoyOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/assets/images/pip-boy_overlay.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
  opacity: 0.15;
  z-index: 10;
  mix-blend-mode: screen;
  filter: grayscale(100%) brightness(1.5) sepia(100%) hue-rotate(70deg) saturate(300%);

  @media (max-width: 768px) {
    opacity: 0.1;
  }
`;

const PipBoyFrame = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${PIPBOY_COLORS.background};
  border: 3px solid ${PIPBOY_COLORS.primary};
  border-radius: 4px;
  box-shadow: 0 0 20px rgba(18, 255, 21, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    border-radius: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const PipBoy = () => {
  const [activeTab, setActiveTab] = useState<PipBoyTab>('stat');
  const [isBooting, setIsBooting] = useState(true);
  const { playSound } = useSound();

  // Animação de boot com som
  useEffect(() => {
    playSound('boot');
    const timer = setTimeout(() => setIsBooting(false), 2000);
    return () => clearTimeout(timer);
  }, [playSound]);

  return (
    <PipBoyContainer>
      <CRTEffect />

      <AnimatePresence mode="wait">
        {isBooting ? (
          <BootScreen
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ) : (
          <PipBoyPhysicalFrame>
            <PipBoyOverlay />
            <PipBoyFrame
              key="pipboy"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <PipBoyHeader />

              <ContentArea>
                <PipBoyNav activeTab={activeTab} onTabChange={setActiveTab} />

                <MainContent>
                  <TabContent activeTab={activeTab} />
                </MainContent>
              </ContentArea>

              <PipBoyFooter />
            </PipBoyFrame>
          </PipBoyPhysicalFrame>
        )}
      </AnimatePresence>
    </PipBoyContainer>
  );
};

const BootScreen = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${PIPBOY_COLORS.primary};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 24px;
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};

  &::before {
    content: 'ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM';
    margin-bottom: 20px;
    font-size: 14px;
  }

  &::after {
    content: 'BOOTING...';
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;
