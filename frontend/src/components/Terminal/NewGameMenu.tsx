import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { PIPBOY_COLORS } from '../../styles/pipboy-colors';
import { CRTEffect } from '../Effects/CRTEffect';

interface NewGameMenuProps {
  onStartCampaign: () => void;
  onCreateCharacter: () => void;
  onBack: () => void;
  playSound?: (volume?: number) => void;
}

export const NewGameMenu: React.FC<NewGameMenuProps> = ({
  onStartCampaign,
  onCreateCharacter,
  onBack,
  playSound,
}) => {
  const handleStartCampaign = () => {
    playSound?.();
    onStartCampaign();
  };

  const handleCreateCharacter = () => {
    playSound?.();
    onCreateCharacter();
  };

  const handleBack = () => {
    playSound?.();
    onBack();
  };

  return (
    <TerminalContainer>
      <TVBezel
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <ScreenOutline>
          <ScreenInset>
            <MonitorBezel>
              <TerminalFrame>
                <CRTEffect />
                <TerminalContent>
                  <AnimatePresence mode="wait">
                    <MenuView
                      key="newgame"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <PreLine>ROBCO INDUSTRIES (TM) TERMLINK</PreLine>
                      <PreLine>&nbsp;</PreLine>
                      <PreLine>NEW GAME - SELECT MODE</PreLine>
                      <PreLine>&nbsp;</PreLine>
                      <PreLine>&nbsp;</PreLine>

                      <MenuLine
                        onClick={handleStartCampaign}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        &gt; [1] START A CAMPAIGN
                      </MenuLine>
                      <Description>
                        Create or manage a campaign as Game Master
                      </Description>
                      <PreLine>&nbsp;</PreLine>

                      <MenuLine
                        onClick={handleCreateCharacter}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        &gt; [2] CREATE A CHARACTER
                      </MenuLine>
                      <Description>
                        Create a new character to join a campaign
                      </Description>
                      <PreLine>&nbsp;</PreLine>
                      <PreLine>&nbsp;</PreLine>

                      <BackLine
                        onClick={handleBack}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        &gt; [ESC] BACK TO MAIN MENU
                      </BackLine>
                    </MenuView>
                  </AnimatePresence>
                </TerminalContent>
              </TerminalFrame>
            </MonitorBezel>
          </ScreenInset>
        </ScreenOutline>
      </TVBezel>
    </TerminalContainer>
  );
};

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const TerminalContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background:
    linear-gradient(135deg,
      #2d3a32 0%,
      #1f2a24 25%,
      #12181a 50%,
      #1a2320 75%,
      #0d1412 100%
    );
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(ellipse at center, rgba(18, 255, 21, 0.08) 0%, transparent 50%),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(100, 150, 120, 0.015) 2px,
        rgba(100, 150, 120, 0.015) 4px
      ),
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 0, 0, 0.03) 2px,
        rgba(0, 0, 0, 0.03) 4px
      );
    pointer-events: none;
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.8; }
  }
`;

const TVBezel = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1400px;
  max-height: 800px;
  padding: 35px;
  background:
    linear-gradient(145deg, #1a1d20 0%, #151719 50%, #0f1113 100%);
  border-radius: 12px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.9),
    inset 0 2px 3px rgba(80, 90, 85, 0.05),
    inset 0 -2px 4px rgba(0, 0, 0, 0.7);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px;
    background:
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 1px,
        rgba(40, 50, 45, 0.015) 1px,
        rgba(40, 50, 45, 0.015) 2px
      );
    pointer-events: none;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 100%;
    padding: 25px;
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    padding: 18px;
    border-radius: 8px;
  }
`;

const ScreenOutline = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2px;
  background: #000000;
  border-radius: 3px;
`;

const ScreenInset = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 6px;
  background: #000000;
  border-radius: 2px;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.9);
`;

const MonitorBezel = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 12px;
  background: linear-gradient(145deg, #0d1113 0%, #080a0b 50%, #050607 100%);
  border-radius: 2px;
  box-shadow:
    inset 0 3px 8px rgba(0, 0, 0, 0.9),
    inset 0 -2px 6px rgba(0, 0, 0, 0.8);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    right: 10%;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(80, 100, 90, 0.15) 20%,
      rgba(80, 100, 90, 0.25) 50%,
      rgba(80, 100, 90, 0.15) 80%,
      transparent 100%
    );
  }
`;

const TerminalFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(ellipse at center, #0a1a0c 0%, #040a05 50%, #020502 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 2px;
  box-shadow:
    0 0 40px rgba(18, 255, 21, 0.4),
    0 0 80px rgba(18, 255, 21, 0.2),
    inset 0 0 100px rgba(18, 255, 21, 0.03);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at center, rgba(18, 255, 21, 0.08) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
`;

const TerminalContent = styled.div`
  flex: 1;
  padding: 60px;
  padding-left: 80px;
  color: ${PIPBOY_COLORS.primary};
  font-family: "Monofonto", "VT323", monospace;
  font-size: 28px;
  line-height: 1.5;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
  text-shadow: 0 0 3px rgba(18, 255, 21, 0.4);
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 40px;
    padding-left: 60px;
    font-size: 24px;
  }

  @media (max-width: 480px) {
    padding: 30px;
    padding-left: 40px;
    font-size: 20px;
  }
`;

const MenuView = styled(motion.div)`
  width: 100%;
`;

const PreLine = styled.div`
  margin: 0;
  padding: 0;
  white-space: pre;
  letter-spacing: 0.5px;
`;

const MenuLine = styled(motion.div)`
  margin: 0;
  padding: 8px 0;
  cursor: pointer;
  white-space: pre;
  letter-spacing: 0.5px;
  transition: all 0.2s;

  &:hover {
    background: ${PIPBOY_COLORS.primary};
    color: ${PIPBOY_COLORS.background};
    text-shadow: none;
    padding-left: 10px;
  }
`;

const Description = styled.div`
  margin: 4px 0 0 30px;
  padding: 0;
  font-size: 18px;
  color: ${PIPBOY_COLORS.disabled};
  letter-spacing: 0.3px;
  text-transform: none;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-left: 20px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    margin-left: 15px;
  }
`;

const BackLine = styled(motion.div)`
  margin: 0;
  padding: 8px 0;
  cursor: pointer;
  white-space: pre;
  letter-spacing: 0.5px;
  color: ${PIPBOY_COLORS.disabled};
  text-shadow: 0 0 2px rgba(18, 255, 21, 0.2);
  transition: all 0.2s;

  &:hover {
    background: ${PIPBOY_COLORS.disabled};
    color: ${PIPBOY_COLORS.background};
    text-shadow: none;
    padding-left: 10px;
  }
`;
