import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { PIPBOY_COLORS } from '../../styles/pipboy-colors';
import { CRTEffect } from '../Effects/CRTEffect';

interface CampaignData {
  name: string;
  description: string;
  maxPlayers: number;
}

interface CampaignManagerProps {
  onBack: () => void;
  onCampaignCreated: (data: CampaignData) => void;
  playSound?: (volume?: number) => void;
}

type ViewMode = 'menu' | 'create' | 'select';

export const CampaignManager: React.FC<CampaignManagerProps> = ({
  onBack,
  onCampaignCreated,
  playSound,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('menu');
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);

  const handleCreateNew = () => {
    playSound?.();
    setViewMode('create');
  };

  const handleSelectExisting = () => {
    playSound?.();
    setViewMode('select');
  };

  const handleBackToMenu = () => {
    playSound?.();
    setViewMode('menu');
  };

  const handleSubmit = () => {
    if (!campaignName.trim()) {
      return;
    }

    playSound?.();
    onCampaignCreated({
      name: campaignName,
      description: campaignDescription,
      maxPlayers,
    });
  };

  const canSubmit = campaignName.trim().length > 0;

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
                    {viewMode === 'menu' && (
                      <MenuView
                        key="menu"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PreLine>CAMPAIGN MANAGEMENT</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>GAME MASTER INTERFACE</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        <MenuLine onClick={handleCreateNew}>
                          &gt; [1] CREATE NEW CAMPAIGN
                        </MenuLine>
                        <Description>
                          Set up a new campaign and invite players
                        </Description>
                        <PreLine>&nbsp;</PreLine>

                        <MenuLine onClick={handleSelectExisting}>
                          &gt; [2] MANAGE EXISTING CAMPAIGN
                        </MenuLine>
                        <Description>
                          Load and manage an existing campaign
                        </Description>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        <BackLine onClick={onBack}>
                          &gt; [ESC] BACK
                        </BackLine>
                      </MenuView>
                    )}

                    {viewMode === 'create' && (
                      <CreateView
                        key="create"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PreLine>CREATE NEW CAMPAIGN</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        <Label>&gt; CAMPAIGN NAME:</Label>
                        <TerminalInput
                          type="text"
                          value={campaignName}
                          onChange={(e) => setCampaignName(e.target.value)}
                          onFocus={() => playSound?.(0.2)}
                          placeholder="Enter campaign name..."
                          maxLength={50}
                          autoFocus
                        />
                        <PreLine>&nbsp;</PreLine>

                        <Label>&gt; DESCRIPTION:</Label>
                        <TerminalTextarea
                          value={campaignDescription}
                          onChange={(e) => setCampaignDescription(e.target.value)}
                          onFocus={() => playSound?.(0.2)}
                          placeholder="Brief campaign description (optional)..."
                          rows={4}
                          maxLength={500}
                        />
                        <PreLine>&nbsp;</PreLine>

                        <Label>&gt; MAX PLAYERS: {maxPlayers}</Label>
                        <PlayerControls>
                          <PlayerButton
                            onClick={() => {
                              if (maxPlayers > 1) {
                                setMaxPlayers(maxPlayers - 1);
                                playSound?.(0.3);
                              }
                            }}
                            disabled={maxPlayers <= 1}
                          >
                            [ - ]
                          </PlayerButton>
                          <PlayerDisplay>{maxPlayers}</PlayerDisplay>
                          <PlayerButton
                            onClick={() => {
                              if (maxPlayers < 8) {
                                setMaxPlayers(maxPlayers + 1);
                                playSound?.(0.3);
                              }
                            }}
                            disabled={maxPlayers >= 8}
                          >
                            [ + ]
                          </PlayerButton>
                        </PlayerControls>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        <ButtonRow>
                          <SubmitButton
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            whileHover={canSubmit ? { scale: 1.02 } : {}}
                            whileTap={canSubmit ? { scale: 0.98 } : {}}
                          >
                            [ ENTER ] CREATE CAMPAIGN
                          </SubmitButton>
                        </ButtonRow>
                        <PreLine>&nbsp;</PreLine>

                        <BackLine onClick={handleBackToMenu}>
                          &gt; [ESC] BACK
                        </BackLine>
                      </CreateView>
                    )}

                    {viewMode === 'select' && (
                      <SelectView
                        key="select"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PreLine>EXISTING CAMPAIGNS</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        <InfoMessage>
                          &gt; NO CAMPAIGNS FOUND
                        </InfoMessage>
                        <Description>
                          You don't have any existing campaigns yet.
                        </Description>
                        <Description>
                          Create a new campaign to get started.
                        </Description>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        <BackLine onClick={handleBackToMenu}>
                          &gt; [ESC] BACK
                        </BackLine>
                      </SelectView>
                    )}
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

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background:
      radial-gradient(ellipse at center, rgba(18, 255, 21, 0.08) 0%, transparent 50%);
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
  background: linear-gradient(145deg, #1a1d20 0%, #151719 50%, #0f1113 100%);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.9);

  @media (max-width: 768px) {
    padding: 25px;
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
  overflow: hidden;
`;

const TerminalFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at center, #0a1a0c 0%, #040a05 50%, #020502 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 2px;
  box-shadow:
    0 0 40px rgba(18, 255, 21, 0.4),
    inset 0 0 100px rgba(18, 255, 21, 0.03);
`;

const TerminalContent = styled.div`
  flex: 1;
  padding: 60px 80px;
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
    padding: 40px 60px;
    font-size: 24px;
  }
`;

const MenuView = styled(motion.div)`
  width: 100%;
`;

const CreateView = styled(motion.div)`
  width: 100%;
`;

const SelectView = styled(motion.div)`
  width: 100%;
`;

const PreLine = styled.div`
  margin: 0;
  padding: 0;
  white-space: pre;
  letter-spacing: 0.5px;
`;

const MenuLine = styled.div`
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
  }
`;

const BackLine = styled.div`
  margin: 0;
  padding: 8px 0;
  cursor: pointer;
  white-space: pre;
  letter-spacing: 0.5px;
  color: ${PIPBOY_COLORS.disabled};
  transition: all 0.2s;

  &:hover {
    background: ${PIPBOY_COLORS.disabled};
    color: ${PIPBOY_COLORS.background};
    text-shadow: none;
    padding-left: 10px;
  }
`;

const Label = styled.div`
  margin: 0 0 8px 0;
  letter-spacing: 0.5px;
`;

const TerminalInput = styled.input`
  width: calc(100% - 40px);
  max-width: 600px;
  background: rgba(18, 255, 21, 0.05);
  border: 1px solid ${PIPBOY_COLORS.primary};
  color: ${PIPBOY_COLORS.primary};
  padding: 8px 12px;
  font-family: "Monofonto", "VT323", monospace;
  font-size: 24px;
  letter-spacing: 0.5px;
  text-shadow: 0 0 2px rgba(18, 255, 21, 0.3);
  outline: none;
  transition: all 0.2s;
  text-transform: none;

  &::placeholder {
    color: ${PIPBOY_COLORS.disabled};
    opacity: 0.6;
  }

  &:focus {
    background: rgba(18, 255, 21, 0.1);
    box-shadow: 0 0 12px rgba(18, 255, 21, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const TerminalTextarea = styled.textarea`
  width: calc(100% - 40px);
  max-width: 600px;
  background: rgba(18, 255, 21, 0.05);
  border: 1px solid ${PIPBOY_COLORS.primary};
  color: ${PIPBOY_COLORS.primary};
  padding: 8px 12px;
  font-family: "Monofonto", "VT323", monospace;
  font-size: 20px;
  letter-spacing: 0.5px;
  text-shadow: 0 0 2px rgba(18, 255, 21, 0.3);
  outline: none;
  transition: all 0.2s;
  text-transform: none;
  resize: vertical;

  &::placeholder {
    color: ${PIPBOY_COLORS.disabled};
    opacity: 0.6;
  }

  &:focus {
    background: rgba(18, 255, 21, 0.1);
    box-shadow: 0 0 12px rgba(18, 255, 21, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 8px;
`;

const PlayerButton = styled.button<{ disabled?: boolean }>`
  background: ${props => props.disabled ? 'transparent' : `rgba(18, 255, 21, 0.1)`};
  border: 1px solid ${props => props.disabled ? PIPBOY_COLORS.disabled : PIPBOY_COLORS.primary};
  color: ${props => props.disabled ? PIPBOY_COLORS.disabled : PIPBOY_COLORS.primary};
  padding: 8px 20px;
  font-family: "Monofonto", "VT323", monospace;
  font-size: 24px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover:not(:disabled) {
    background: ${PIPBOY_COLORS.primary};
    color: ${PIPBOY_COLORS.background};
  }
`;

const PlayerDisplay = styled.div`
  font-size: 32px;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const SubmitButton = styled(motion.button)<{ disabled?: boolean }>`
  background: ${props => props.disabled ? 'transparent' : `rgba(18, 255, 21, 0.1)`};
  border: 2px solid ${props => props.disabled ? PIPBOY_COLORS.disabled : PIPBOY_COLORS.primary};
  color: ${props => props.disabled ? PIPBOY_COLORS.disabled : PIPBOY_COLORS.primary};
  padding: 12px 24px;
  font-family: "Monofonto", "VT323", monospace;
  font-size: 24px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  letter-spacing: 0.5px;
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:hover:not(:disabled) {
    background: ${PIPBOY_COLORS.primary};
    color: ${PIPBOY_COLORS.background};
  }
`;

const InfoMessage = styled.div`
  color: ${PIPBOY_COLORS.warning};
  margin: 20px 0;
  letter-spacing: 0.5px;
`;
