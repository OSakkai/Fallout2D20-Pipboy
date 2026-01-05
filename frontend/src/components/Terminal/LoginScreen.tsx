import { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { PIPBOY_COLORS } from '../../styles/pipboy-colors';
import { CRTEffect } from '../Effects/CRTEffect';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, username: string) => void;
  onGuestAccess: () => void;
}

type ViewMode = 'menu' | 'login' | 'register';

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister, onGuestAccess }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('menu');
  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Function to play beep sound
  const playBeep = () => {
    const audio = new Audio('/assets/sounds/beepPipboy.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play failed:', err));
  };

  // Menu items
  const menuItems = [
    { label: 'LOGIN', action: () => { playBeep(); setViewMode('login'); } },
    { label: 'REGISTER', action: () => { playBeep(); setViewMode('register'); } },
    { label: 'GUEST MODE', action: () => { playBeep(); onGuestAccess(); } },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (viewMode === 'register') {
      if (!username || username.length < 3) {
        setError('ERROR: USERNAME MUST BE 3+ CHARACTERS');
        return;
      }
      if (password !== confirmPassword) {
        setError('ERROR: PASSWORDS DO NOT MATCH');
        return;
      }
      if (password.length < 6) {
        setError('ERROR: PASSWORD MUST BE 6+ CHARACTERS');
        return;
      }
      playBeep();
      onRegister(email, password, username);
    } else if (viewMode === 'login') {
      playBeep();
      onLogin(email, password);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (viewMode === 'menu') {
      if (e.key === 'ArrowUp') {
        playBeep();
        setSelectedMenuIndex((prev) => (prev > 0 ? prev - 1 : menuItems.length - 1));
      } else if (e.key === 'ArrowDown') {
        playBeep();
        setSelectedMenuIndex((prev) => (prev < menuItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter') {
        menuItems[selectedMenuIndex].action();
      }
    }
  };

  const handleBackToMenu = () => {
    playBeep();
    setViewMode('menu');
    setError('');
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
  };

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
                        <PreLine>CLEARANCE: UNAUTHORIZED</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        {menuItems.map((item, index) => (
                          <MenuLine
                            key={item.label}
                            selected={selectedMenuIndex === index}
                            onClick={() => {
                              playBeep();
                              setSelectedMenuIndex(index);
                              item.action();
                            }}
                          >
                            {selectedMenuIndex === index ? '> ' : '  '}[{index + 1}] {item.label}
                          </MenuLine>
                        ))}

                        <PreLine>&nbsp;</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <WarningLine>! USE ARROWS TO NAVIGATE AND ENTER TO SELECT</WarningLine>
                      </MenuView>
                    )}

                    {(viewMode === 'login' || viewMode === 'register') && (
                      <FormView
                        key={viewMode}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <PreLine>WELCOME TO ROBCO INDUSTRIES (TM) TERMLINK</PreLine>
                        <PreLine>&nbsp;</PreLine>
                        <PreLine>MODE: {viewMode === 'login' ? 'LOGIN' : 'REGISTER'}</PreLine>
                        <PreLine>&nbsp;</PreLine>

                        <FormContainer onSubmit={handleSubmit}>
                          <PreLine>&gt; EMAIL:</PreLine>
                          <TerminalInput
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@vault-tec.com"
                            required
                            autoComplete="email"
                            onFocus={playBeep}
                          />

                          {viewMode === 'register' && (
                            <>
                              <PreLine>&nbsp;</PreLine>
                              <PreLine>&gt; USERNAME:</PreLine>
                              <TerminalInput
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="vault_dweller"
                                required
                                minLength={3}
                                autoComplete="username"
                                onFocus={playBeep}
                              />
                            </>
                          )}

                          <PreLine>&nbsp;</PreLine>
                          <PreLine>&gt; PASSWORD:</PreLine>
                          <TerminalInput
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete={viewMode === 'register' ? 'new-password' : 'current-password'}
                            onFocus={playBeep}
                          />

                          {viewMode === 'register' && (
                            <>
                              <PreLine>&nbsp;</PreLine>
                              <PreLine>&gt; CONFIRM PASSWORD:</PreLine>
                              <TerminalInput
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                                onFocus={playBeep}
                              />
                            </>
                          )}

                          <PreLine>&nbsp;</PreLine>
                          <PreLine>&nbsp;</PreLine>

                          {error && (
                            <>
                              <WarningLine>[!] {error}</WarningLine>
                              <PreLine>&nbsp;</PreLine>
                            </>
                          )}

                          <SubmitLine type="submit">
                            &gt; {viewMode === 'login' ? '[ ACCESS SYSTEM ]' : '[ CREATE ACCOUNT ]'}
                          </SubmitLine>

                          <PreLine>&nbsp;</PreLine>
                          <BackLine onClick={handleBackToMenu}>
                            &gt; [ BACK ]
                          </BackLine>
                        </FormContainer>
                      </FormView>
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

// Styled Components - Monitor Structure (same as PipBoy)

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

  /* Metallic texture with greenish tone */
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

  @media (max-width: 768px) {
    padding: 2px;
    border-radius: 3px;
  }

  @media (max-width: 480px) {
    padding: 1px;
    border-radius: 2px;
  }
`;

const ScreenInset = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 6px;
  background: #000000;
  border-radius: 2px;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.9);

  @media (max-width: 768px) {
    padding: 5px;
  }

  @media (max-width: 480px) {
    padding: 4px;
  }
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

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 480px) {
    padding: 8px;
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

const FormView = styled(motion.div)`
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

const FormContainer = styled.form`
  width: 100%;
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
  text-transform: uppercase;
  margin-top: 4px;

  &::placeholder {
    color: ${PIPBOY_COLORS.disabled};
    opacity: 0.6;
    text-transform: lowercase;
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
