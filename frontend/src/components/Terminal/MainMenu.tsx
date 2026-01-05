import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { PIPBOY_COLORS } from '../../styles/pipboy-colors';
import { CRTEffect } from '../Effects/CRTEffect';

interface MainMenuProps {
  onNewGame: () => void;
  onLoadGame: () => void;
  onSettings: () => void;
  onExit: () => void;
  onNavigateToPipboy: () => void;
  userEmail?: string;
  userName?: string;
  isGuest?: boolean;
}

type ViewMode = 'menu' | 'devTools' | 'pageNav' | 'apiTest';

export const MainMenu: React.FC<MainMenuProps> = ({
  onNewGame,
  onLoadGame,
  onSettings,
  onExit,
  onNavigateToPipboy,
  userEmail,
  userName,
  isGuest = false
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('menu');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [apiEndpoint, setApiEndpoint] = useState('/auth/guest');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('POST');
  const [apiBody, setApiBody] = useState('{}');
  const [apiResponse, setApiResponse] = useState('');

  const playBeep = () => {
    const audio = new Audio('/assets/sounds/beepPipboy.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play failed:', err));
  };

  const menuItems = [
    { label: 'NEW GAME', action: onNewGame },
    { label: 'LOAD GAME', action: onLoadGame },
    { label: 'SETTINGS', action: onSettings },
    { label: 'DEV TOOLS', action: () => { playBeep(); setViewMode('devTools'); } },
    { label: 'EXIT', action: onExit },
  ];

  const devToolsItems = [
    { label: 'PAGE NAVIGATION', action: () => { playBeep(); setViewMode('pageNav'); } },
    { label: 'API TESTING', action: () => { playBeep(); setViewMode('apiTest'); } },
    { label: 'BACK', action: () => { playBeep(); setViewMode('menu'); } },
  ];

  const pageNavItems = [
    { label: 'PIP-BOY', action: () => { playBeep(); onNavigateToPipboy(); } },
    { label: 'LOGIN SCREEN', action: () => { playBeep(); onExit(); } },
    { label: 'BACK', action: () => { playBeep(); setViewMode('devTools'); } },
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentItems = viewMode === 'menu' ? menuItems :
                        viewMode === 'devTools' ? devToolsItems :
                        viewMode === 'pageNav' ? pageNavItems : [];

    if (viewMode !== 'apiTest') {
      if (e.key === 'ArrowUp') {
        playBeep();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : currentItems.length - 1));
      } else if (e.key === 'ArrowDown') {
        playBeep();
        setSelectedIndex((prev) => (prev < currentItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        currentItems[selectedIndex]?.action();
      }
    }
  };

  const handleApiTest = async () => {
    playBeep();
    setApiResponse('LOADING...');

    try {
      const apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : `http://${window.location.hostname}:3000`;

      const options: RequestInit = {
        method: apiMethod,
        headers: { 'Content-Type': 'application/json' },
      };

      if (apiMethod === 'POST') {
        options.body = apiBody;
      }

      const response = await fetch(`${apiUrl}${apiEndpoint}`, options);
      const data = await response.json();

      setApiResponse(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setApiResponse(`ERROR: ${error.message}`);
    }
  };

  const displayName = isGuest
    ? 'GUEST_USER'
    : (userName || userEmail?.split('@')[0] || 'UNKNOWN').toUpperCase();

  return (
    <TerminalContainer onKeyDown={handleKeyDown} tabIndex={0}>
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
                        <PreLine>WELCOME TO ROBCO INDUSTRIES (TM) TERMLINK</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>CLEARANCE: {displayName}</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        {menuItems.map((item, index) => (
                          <MenuLine
                            key={item.label}
                            selected={selectedIndex === index}
                            onClick={() => {
                              playBeep();
                              setSelectedIndex(index);
                              item.action();
                            }}
                          >
                            {selectedIndex === index ? '> ' : '  '}[{index + 1}] {item.label}
                          </MenuLine>
                        ))}

                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        {isGuest && (
                          <>
                            <WarningLine>! WARNING: GUEST MODE - DATA WILL NOT BE SAVED</WarningLine>
                            <PreLine>&nbsp;</PreLine>
                          </>
                        )}
                      </MenuView>
                    )}

                    {viewMode === 'devTools' && (
                      <DevToolsView
                        key="devTools"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PreLine>DEVELOPER TOOLS</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>SYSTEM DIAGNOSTIC AND TESTING UTILITIES</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        {devToolsItems.map((item, index) => (
                          <MenuLine
                            key={item.label}
                            selected={selectedIndex === index}
                            onClick={() => {
                              playBeep();
                              setSelectedIndex(index);
                              item.action();
                            }}
                          >
                            {selectedIndex === index ? '> ' : '  '}[{index + 1}] {item.label}
                          </MenuLine>
                        ))}
                      </DevToolsView>
                    )}

                    {viewMode === 'pageNav' && (
                      <PageNavView
                        key="pageNav"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PreLine>PAGE NAVIGATION</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>SELECT A PAGE TO NAVIGATE TO:</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        {pageNavItems.map((item, index) => (
                          <MenuLine
                            key={item.label}
                            selected={selectedIndex === index}
                            onClick={() => {
                              playBeep();
                              setSelectedIndex(index);
                              item.action();
                            }}
                          >
                            {selectedIndex === index ? '> ' : '  '}[{index + 1}] {item.label}
                          </MenuLine>
                        ))}
                      </PageNavView>
                    )}

                    {viewMode === 'apiTest' && (
                      <ApiTestView
                        key="apiTest"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PreLine>API TESTING INTERFACE</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>TEST BACKEND API ENDPOINTS</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        <PreLine>&gt; METHOD:</PreLine>
                        <SelectContainer>
                          <ApiSelect
                            value={apiMethod}
                            onChange={(e) => setApiMethod(e.target.value as 'GET' | 'POST')}
                            onFocus={playBeep}
                          >
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                          </ApiSelect>
                        </SelectContainer>

                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&gt; ENDPOINT:</PreLine>
                        <TerminalInput
                          type="text"
                          value={apiEndpoint}
                          onChange={(e) => setApiEndpoint(e.target.value)}
                          placeholder="/auth/guest"
                          onFocus={playBeep}
                        />

                        {apiMethod === 'POST' && (
                          <>
                            <PreLine>&nbsp;</PreLine>
                            <PreLine>&gt; REQUEST BODY (JSON):</PreLine>
                            <TerminalTextarea
                              value={apiBody}
                              onChange={(e) => setApiBody(e.target.value)}
                              placeholder='{"key": "value"}'
                              rows={5}
                              onFocus={playBeep}
                            />
                          </>
                        )}

                        <PreLine>&nbsp;</PreLine>
                        <SubmitLine onClick={handleApiTest}>
                          &gt; [ TEST API ]
                        </SubmitLine>

                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&gt; RESPONSE:</PreLine>
                        <ResponseBox>
                          <ResponseText>{apiResponse || 'NO RESPONSE YET'}</ResponseText>
                        </ResponseBox>

                        <PreLine>&nbsp;</PreLine>
                        <BackLine onClick={() => { playBeep(); setViewMode('devTools'); }}>
                          &gt; [ BACK ]
                        </BackLine>
                      </ApiTestView>
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

// Styled Components - Monitor Structure (same as LoginScreen)

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

const DevToolsView = styled(motion.div)`
  width: 100%;
`;

const PageNavView = styled(motion.div)`
  width: 100%;
`;

const ApiTestView = styled(motion.div)`
  width: 100%;
`;

const PreLine = styled.div`
  margin: 0;
  padding: 0;
  white-space: pre;
  letter-spacing: 0.5px;
`;

const MenuLine = styled.div<{ selected: boolean }>`
  margin: 0;
  padding: 4px 0;
  cursor: pointer;
  white-space: pre;
  letter-spacing: 0.5px;
  background: ${props => props.selected ? PIPBOY_COLORS.primary : 'transparent'};
  color: ${props => props.selected ? PIPBOY_COLORS.background : PIPBOY_COLORS.primary};
  text-shadow: ${props => props.selected
    ? 'none'
    : '0 0 2px rgba(18, 255, 21, 0.3)'};
  transition: all 0.1s;

  &:hover {
    background: ${PIPBOY_COLORS.primary};
    color: ${PIPBOY_COLORS.background};
    text-shadow: none;
  }
`;

const SubmitLine = styled.button`
  margin: 0;
  padding: 4px 0;
  cursor: pointer;
  white-space: pre;
  letter-spacing: 0.5px;
  background: transparent;
  color: ${PIPBOY_COLORS.primary};
  text-shadow: 0 0 2px rgba(18, 255, 21, 0.3);
  transition: all 0.1s;
  border: none;
  font-family: "Monofonto", "VT323", monospace;
  font-size: 28px;
  text-transform: uppercase;
  text-align: left;
  display: block;
  width: 100%;

  &:hover {
    background: ${PIPBOY_COLORS.primary};
    color: ${PIPBOY_COLORS.background};
    text-shadow: none;
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const BackLine = styled.div`
  margin: 0;
  padding: 4px 0;
  cursor: pointer;
  white-space: pre;
  letter-spacing: 0.5px;
  color: ${PIPBOY_COLORS.disabled};
  text-shadow: 0 0 2px rgba(18, 255, 21, 0.2);
  transition: all 0.1s;

  &:hover {
    background: ${PIPBOY_COLORS.disabled};
    color: ${PIPBOY_COLORS.background};
    text-shadow: none;
  }
`;

const WarningLine = styled.div`
  margin: 0;
  padding: 0;
  white-space: pre;
  letter-spacing: 0.5px;
  animation: blinkWarning 1s ease-out infinite;

  @keyframes blinkWarning {
    0%, 60% {
      color: ${PIPBOY_COLORS.primary};
      text-shadow: 0 0 3px rgba(18, 255, 21, 0.4);
    }
    70%, 100% {
      color: ${PIPBOY_COLORS.amber};
      text-shadow: 0 0 6px rgba(255, 182, 65, 0.6);
    }
  }
`;

const TerminalInput = styled.input`
  width: calc(100% - 100px);
  max-width: 600px;
  background: rgba(18, 255, 21, 0.05);
  border: 1px solid ${PIPBOY_COLORS.primary};
  color: ${PIPBOY_COLORS.primary};
  padding: 6px 12px;
  font-family: "Monofonto", "VT323", monospace;
  font-size: 28px;
  letter-spacing: 0.5px;
  text-shadow: 0 0 2px rgba(18, 255, 21, 0.3);
  outline: none;
  transition: all 0.2s;
  text-transform: none;
  margin-top: 4px;

  &::placeholder {
    color: ${PIPBOY_COLORS.disabled};
    opacity: 0.6;
  }

  &:focus {
    background: rgba(18, 255, 21, 0.1);
    box-shadow: 0 0 12px rgba(18, 255, 21, 0.5);
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    width: calc(100% - 60px);
  }
`;

const TerminalTextarea = styled.textarea`
  width: calc(100% - 100px);
  max-width: 600px;
  background: rgba(18, 255, 21, 0.05);
  border: 1px solid ${PIPBOY_COLORS.primary};
  color: ${PIPBOY_COLORS.primary};
  padding: 6px 12px;
  font-family: "Monofonto", "VT323", monospace;
  font-size: 20px;
  letter-spacing: 0.5px;
  text-shadow: 0 0 2px rgba(18, 255, 21, 0.3);
  outline: none;
  transition: all 0.2s;
  text-transform: none;
  margin-top: 4px;
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

  @media (max-width: 480px) {
    font-size: 16px;
    width: calc(100% - 60px);
  }
`;

const SelectContainer = styled.div`
  margin-top: 4px;
`;

const ApiSelect = styled.select`
  background: rgba(18, 255, 21, 0.05);
  border: 1px solid ${PIPBOY_COLORS.primary};
  color: ${PIPBOY_COLORS.primary};
  padding: 6px 12px;
  font-family: "Monofonto", "VT323", monospace;
  font-size: 28px;
  letter-spacing: 0.5px;
  text-shadow: 0 0 2px rgba(18, 255, 21, 0.3);
  outline: none;
  transition: all 0.2s;
  text-transform: uppercase;
  cursor: pointer;

  &:focus {
    background: rgba(18, 255, 21, 0.1);
    box-shadow: 0 0 12px rgba(18, 255, 21, 0.5);
  }

  option {
    background: ${PIPBOY_COLORS.background};
    color: ${PIPBOY_COLORS.primary};
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const ResponseBox = styled.div`
  width: calc(100% - 100px);
  max-width: 600px;
  min-height: 200px;
  max-height: 400px;
  background: rgba(18, 255, 21, 0.05);
  border: 1px solid ${PIPBOY_COLORS.primary};
  padding: 12px;
  margin-top: 4px;
  overflow-y: auto;
  font-family: "Monofonto", "VT323", monospace;
  font-size: 18px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    width: calc(100% - 60px);
  }
`;

const ResponseText = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  color: ${PIPBOY_COLORS.primary};
  text-shadow: 0 0 2px rgba(18, 255, 21, 0.3);
  text-transform: none;
`;
