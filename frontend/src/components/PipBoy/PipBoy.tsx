import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import type { PipBoyTab } from '../../types';
import { CRTEffect } from '../Effects/CRTEffect';
import { TopNav } from './TopNav';
import { TabContent } from './TabContent';
import { PipBoyFooter } from './PipBoyFooter';
import { PIPBOY_COLORS, PIPBOY_TEXT_GLOW, PIPBOY_TYPOGRAPHY } from '../../styles/pipboy-colors';

const PipBoyContainer = styled.div`
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

  /* Textura metálica com tom esverdeado */
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

  /* Sujeira e desgaste */
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image:
      radial-gradient(circle at 20% 30%, rgba(0, 0, 0, 0.3) 0%, transparent 3%),
      radial-gradient(circle at 80% 70%, rgba(0, 0, 0, 0.2) 0%, transparent 4%),
      radial-gradient(circle at 40% 80%, rgba(0, 0, 0, 0.25) 0%, transparent 2%),
      radial-gradient(circle at 90% 20%, rgba(0, 0, 0, 0.15) 0%, transparent 5%),
      radial-gradient(circle at 10% 90%, rgba(0, 0, 0, 0.2) 0%, transparent 3%),
      radial-gradient(circle at 60% 15%, rgba(0, 0, 0, 0.18) 0%, transparent 4%);
    pointer-events: none;
    opacity: 0.6;
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
  max-width: 1600px;
  max-height: 900px;
  padding: 35px;
  background:
    linear-gradient(145deg, #1a1d20 0%, #151719 50%, #0f1113 100%);
  border-radius: 12px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.9),
    inset 0 2px 3px rgba(80, 90, 85, 0.05),
    inset 0 -2px 4px rgba(0, 0, 0, 0.7);

  /* Textura de plástico envelhecido escuro */
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

  /* Arranhões e sujeira no bezel */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 12px;
    background-image:
      linear-gradient(125deg, transparent 40%, rgba(0, 0, 0, 0.2) 42%, transparent 43%),
      linear-gradient(235deg, transparent 60%, rgba(0, 0, 0, 0.15) 61%, transparent 62%),
      radial-gradient(circle at 15% 25%, rgba(10, 12, 10, 0.5) 0%, transparent 2%),
      radial-gradient(circle at 85% 75%, rgba(10, 12, 10, 0.4) 0%, transparent 3%),
      radial-gradient(circle at 50% 90%, rgba(10, 12, 10, 0.35) 0%, transparent 2.5%);
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

  /* Brilho na aresta superior do recuo */
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

const PipBoyFrame = styled(motion.div)`
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

  /* Brilho fosforescente verde em toda a tela */
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

const MainContent = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  background: #020502;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

type BootStage = 'off' | 'powering' | 'scrolling' | 'cursor' | 'booting' | 'loadingUI' | 'ready';

// Detecção de dispositivo
const detectDevice = (): 'DESKTOP' | 'TABLET' | 'MOBILE' => {
  const ua = navigator.userAgent;
  const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);

  if (isTablet) return 'TABLET';
  if (isMobile) return 'MOBILE';
  return 'DESKTOP';
};

// RAM baseado no dispositivo
const getRAMByDevice = (device: 'DESKTOP' | 'TABLET' | 'MOBILE'): string => {
  if (device === 'DESKTOP') return '128k';
  if (device === 'TABLET') return '96k';
  return '64k';
};

// Gerar bytes livres aleatórios
const getRandomBytes = (): number => {
  return Math.floor(Math.random() * 4000) + 28000;
};

// Sistema de Easter Eggs (15% de chance)
const getBootFinalLine = (): string => {
  const random = Math.random();

  // 85% chance de linha padrão
  if (random > 0.15) {
    return 'SYSTEM READY';
  }

  // 15% chance de easter egg - sortear um aleatoriamente
  const easterEggs = [
    'SYSADMIN: SAKKAI.SYS [AUTHORIZED]',
    'ENGINEER: SABOIA PROTOCOLS LOADED',
    'BOOTLOADER: SABAGOS BUILD 2077',
    'TECHNICIAN: SEGS MAINTENANCE MODE',
    'OVERSEER: GETUILIO NARGAS [VAULT-TEC]',
    'SECURITY: XANAH CARNIVORAH ONLINE'
  ];

  const randomIndex = Math.floor(Math.random() * easterEggs.length);
  return easterEggs[randomIndex];
};

// Versão do repositório
const REPO_VERSION = 'v0.1.0-ALPHA';

// Textos técnicos para scrolling rápido (60 linhas para duração de 10 segundos)
const SCROLL_BOOT_TEXTS = [
  '0x00000001 0 0x00014 0x00000000000000000000 CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO',
  'starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA',
  '0x00000000000000000000 1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009',
  '0x00000000000000000000 CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA',
  '0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA',
  '0x00000000000000000000 1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009',
  '0x00000000000000000000 CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA',
  '0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA 0x00000000000000000000 1 0 0x00014',
  '0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000000000 CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0',
  '0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000',
  '1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA 0x00000000000000000000 1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA',
  '0x00000000000000000000 1 0 0x00009 0x00000000000000000000 CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA',
  '0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory',
  'discovery 0 0x0000AA 0x00000000000000000000 1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000000000',
  'CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000',
  'start memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA 0x00000000000000000000 1 0 0x00014 0x00000000000000000000',
  'CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000000000 CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009',
  '0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 1 0',
  '0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA 0x00000000000000000000 1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000',
  '1 0 0x00009 0x00000000000000000000 CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000',
  '1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA',
  '0x00000000000000000000 1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000000000 CPUO launch',
  'EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start',
  'memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA 0x00000000000000000000 1 0 0x00014',
  '0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000000000 CPUO launch EFIB 0x0000AA',
  '0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000',
  'start memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA 0x00000000000000000000',
  '1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000000000',
  'CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA',
  '0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 1 0',
  // Duplicando as linhas para ter 60 linhas totais (10 segundos de animação)
  '0x00000001 0 0x00014 0x00000000000000000000 CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO',
  'starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA',
  '0x00000000000000000000 1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009',
  '0x00000000000000000000 CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA',
  '0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA',
  '0x00000000000000000000 1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009',
  '0x00000000000000000000 CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA',
  '0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA 0x00000000000000000000 1 0 0x00014',
  '0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000000000 CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0',
  '0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000',
  '1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA 0x00000000000000000000 1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA',
  '0x00000000000000000000 1 0 0x00009 0x00000000000000000000 CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA',
  '0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory',
  'discovery 0 0x0000AA 0x00000000000000000000 1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000000000',
  'CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000',
  'start memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA 0x00000000000000000000 1 0 0x00014 0x00000000000000000000',
  'CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000000000 CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009',
  '0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 1 0',
  '0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA 0x00000000000000000000 1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000',
  '1 0 0x00009 0x00000000000000000000 CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000',
  '1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA',
  '0x00000000000000000000 1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000000000 CPUO launch',
  'EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start',
  'memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA 0x00000000000000000000 1 0 0x00014',
  '0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000000000 CPUO launch EFIB 0x0000AA',
  '0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000',
  'start memory discovery0 0x0000AA 0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery 0 0x0000AA 0x00000000000000000000',
  '1 0 0x00014 0x00000000000000000000 CPUO starting cell relocation0 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000000000',
  'CPUO launch EFIB 0x0000AA 0x00000000000000000000 1 0 0x00009 0x00000000000000E03D CPUO starting EFIB 0x0000AA',
  '0x00000000000000000000 1 0 0x0000AA 0x00000000000000000000 start memory discovery0 0x0000AA 0x00000000000000000000 1 0',
];

// Componente para animação de pontos de loading (. -> .. -> ...)
const LoadingDots = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '.';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
};

// Componente para escrever todas as linhas de forma contínua
const ContinuousTyping = ({ lines, onComplete }: { lines: string[]; onComplete?: () => void }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      // Digitação completa, chamar callback
      if (onComplete) {
        onComplete();
      }
      return;
    }

    const currentLine = lines[currentLineIndex];

    if (currentCharIndex <= currentLine.length) {
      const timer = setTimeout(() => {
        const newDisplayedLines = [...displayedLines];
        newDisplayedLines[currentLineIndex] = currentLine.slice(0, currentCharIndex);
        setDisplayedLines(newDisplayedLines);
        setCurrentCharIndex(currentCharIndex + 1);
      }, 9);

      return () => clearTimeout(timer);
    } else {
      // Linha completa, avançar para próxima
      setCurrentLineIndex(currentLineIndex + 1);
      setCurrentCharIndex(0);
    }
  }, [currentLineIndex, currentCharIndex, lines, onComplete]);

  return (
    <>
      {displayedLines.map((line, index) => (
        <BootLine key={index}>{line}</BootLine>
      ))}
    </>
  );
};

export const PipBoy = () => {
  const [activeTab, setActiveTab] = useState<PipBoyTab>('stat');
  const [bootStage, setBootStage] = useState<BootStage>('off');
  const [userInteracted, setUserInteracted] = useState(true); // Já inicia como true
  const [isChannelSwitching, setIsChannelSwitching] = useState(false);
  const bootAudioRef = useRef<HTMLAudioElement | null>(null);
  const idleAudioRef = useRef<HTMLAudioElement | null>(null);
  const idleAudioRef2 = useRef<HTMLAudioElement | null>(null);

  // Gerar dados do boot uma vez no mount
  const [bootData] = useState(() => {
    const device = detectDevice();
    const ram = getRAMByDevice(device);
    const bytes = getRandomBytes();
    const finalLine = getBootFinalLine();

    return {
      device,
      ram,
      bytes,
      finalLine
    };
  });

  // Array de linhas do boot para digitação contínua
  const bootLines = [
    "****************** PIP-OS(R) V7.1.0.8 ******************",
    "",
    "COPYRIGHT 2075 ROBCO(R)",
    "LOADER V1.1",
    `EXEC VERSION 41.10 [${bootData.device} MODE]`,
    `${bootData.ram} RAM SYSTEM`,
    `${bootData.bytes} BYTES FREE`,
    "",
    "CHECKING PERIPHERAL DEVICES...",
    "GEIGER COUNTER................OK",
    "RADIO TRANSMITTER.............OK",
    "V.A.T.S. TARGETING SYSTEM.....OK",
    "FLASHLIGHT MODULE.............OK",
    "STEALTH BOY DETECTOR..........OK",
    "RADIATION SENSOR..............OK",
    "COMPASS CALIBRATION...........OK",
    "",
    "NO HOLOTAPE FOUND",
    `LOAD ROM(1): REPO ${REPO_VERSION}`,
    "LOADING INTERFACE MODULES...",
    "",
    bootData.finalLine
  ];

  // Callback para quando a digitação do boot terminar
  const handleBootTypingComplete = () => {
    // Parar o áudio bootPipboy quando a digitação terminar
    if (bootAudioRef.current) {
      bootAudioRef.current.pause();
      bootAudioRef.current.currentTime = 0;
    }

    // Após 1 segundo de freeze, fazer transição para loadingUI
    setTimeout(() => {
      // Tocar som de loading UI
      const loadingAudio = new Audio('/assets/sounds/loadingUIPipboy.mp3');
      loadingAudio.volume = 0.7;
      loadingAudio.play().catch(err => console.log('Audio play failed:', err));

      // Transição para loadingUI
      setBootStage('loadingUI');

      // Quando o áudio de loading terminar, tocar o áudio de transição (adiantado em 2s)
      loadingAudio.onended = () => {
        const transitionAudio = new Audio('/assets/sounds/transitiontoUIPipboy.mp3');
        transitionAudio.volume = 0.7;
        transitionAudio.play().catch(err => console.log('Audio play failed:', err));

        // Transitar para ready após 2s (aumentando duração total do loadingUI em 2s)
        setTimeout(() => {
          setBootStage('ready');
        }, 2000);
      };
    }, 1000);
  };

  // Sequência de boot: só inicia após interação do usuário
  useEffect(() => {
    if (!userInteracted) return;

    // Stage 1: Tela desligada
    const timer1 = setTimeout(() => {
      setBootStage('powering');
      // Tocar som de ligar TV quando as linhas verdes começam
      const lightUpAudio = new Audio('/assets/sounds/lightupPipboy.mp3');
      lightUpAudio.volume = 0.7;
      lightUpAudio.play().catch(err => console.log('Audio play failed:', err));
    }, 1500);

    // Stage 2: Efeito CRT ligando
    const timer2 = setTimeout(() => {
      setBootStage('scrolling');
      // Tocar o som coldstart 0.85s após o texto começar a scrollar
      setTimeout(() => {
        const audio = new Audio('/assets/sounds/coldstartPipboy.mp3');
        audio.volume = 0.7;
        audio.play().catch(err => console.log('Audio play failed:', err));
      }, 850);
    }, 3500);

    // Stage 3: Primeira scrolling (10 segundos para sincronizar com o áudio)
    const timer3 = setTimeout(() => setBootStage('cursor'), 13500);

    // Stage 4: Cursor piscando (2 segundos)
    const timer4 = setTimeout(() => {
      setBootStage('booting');
      // Tocar o som bootPipboy durante a animação de boot
      const audio = new Audio('/assets/sounds/bootPipboy.mp3');
      audio.volume = 0.7;
      bootAudioRef.current = audio;
      audio.play().catch(err => console.log('Audio play failed:', err));
    }, 15500);

    // Stage 5: Boot text - a transição para ready agora é gerenciada pelo callback handleBootTypingComplete

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [userInteracted]);

  const handleStartClick = () => {
    setUserInteracted(true);
  };

  // Som de idle quando a UI estiver pronta (com crossfade para loop seamless)
  useEffect(() => {
    if (bootStage === 'ready') {
      // Criar duas instâncias do áudio para alternar
      const idleAudio1 = new Audio('/assets/sounds/idlesoundPipboy.mp3');
      const idleAudio2 = new Audio('/assets/sounds/idlesoundPipboy.mp3');

      idleAudio1.volume = 0.15;
      idleAudio2.volume = 0.15;

      idleAudioRef.current = idleAudio1;
      idleAudioRef2.current = idleAudio2;

      let currentPlayer = 1; // 1 ou 2
      let timeoutId: NodeJS.Timeout;

      // Função para agendar o próximo play
      const scheduleNextPlay = () => {
        // Agendar o próximo áudio para começar aos 9.5s (500ms antes do fim)
        timeoutId = setTimeout(() => {
          if (currentPlayer === 1 && idleAudioRef2.current) {
            // Tocar o player 2
            idleAudioRef2.current.currentTime = 0;
            idleAudioRef2.current.play().catch(err => console.log('Idle audio 2 play failed:', err));
            currentPlayer = 2;
          } else if (currentPlayer === 2 && idleAudioRef.current) {
            // Tocar o player 1
            idleAudioRef.current.currentTime = 0;
            idleAudioRef.current.play().catch(err => console.log('Idle audio 1 play failed:', err));
            currentPlayer = 1;
          }
          scheduleNextPlay();
        }, 9500); // 9.5 segundos
      };

      // Iniciar o primeiro áudio
      idleAudio1.play().catch(err => console.log('Idle audio play failed:', err));
      scheduleNextPlay();

      return () => {
        clearTimeout(timeoutId);
        if (idleAudioRef.current) {
          idleAudioRef.current.pause();
          idleAudioRef.current.currentTime = 0;
          idleAudioRef.current = null;
        }
        if (idleAudioRef2.current) {
          idleAudioRef2.current.pause();
          idleAudioRef2.current.currentTime = 0;
          idleAudioRef2.current = null;
        }
      };
    }
  }, [bootStage]);

  // Handler para trocar de tab com animação de "troca de canal"
  const handleTabChange = (newTab: PipBoyTab) => {
    if (newTab !== activeTab) {
      setIsChannelSwitching(true);
      setTimeout(() => {
        setActiveTab(newTab);
        setTimeout(() => {
          setIsChannelSwitching(false);
        }, 250);
      }, 250);
    }
  };

  const isBooting = bootStage !== 'ready';

  return (
    <PipBoyContainer>
      {/* Overlay de interação inicial */}
      {!userInteracted && (
        <StartOverlay
          onClick={handleStartClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <StartButton
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <StartText>CLICK TO START</StartText>
            <StartSubtext>Audio requires interaction</StartSubtext>
          </StartButton>
        </StartOverlay>
      )}

      <AnimatePresence mode="wait">
        {isBooting ? (
          <TVBezel
            key="boot"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 0.75, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <ScreenOutline>
              <ScreenInset>
                <MonitorBezel>
                  <CRTEffect showScanlines={false} />
                  <AnimatePresence mode="wait">
                    {bootStage === 'off' && (
                      <OffScreen
                        key="off"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}

                    {bootStage === 'powering' && (
                      <CRTPowerOn key="powering">
                        <CRTLineUp
                          initial={{ top: '50%' }}
                          animate={{ top: '0%' }}
                          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                        <CRTLineDown
                          initial={{ top: '50%' }}
                          animate={{ top: '100%' }}
                          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </CRTPowerOn>
                    )}

                    {bootStage === 'scrolling' && (
                      <ScrollingScreen
                        key="scrolling"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ScrollingTextContainer
                          initial={{ y: '100%' }}
                          animate={{ y: '-100%' }}
                          transition={{ duration: 10, ease: 'linear' }}
                        >
                          {SCROLL_BOOT_TEXTS.map((text, index) => (
                            <ScrollLine key={index}>{text}</ScrollLine>
                          ))}
                        </ScrollingTextContainer>
                      </ScrollingScreen>
                    )}

                    {bootStage === 'cursor' && (
                      <CursorScreen
                        key="cursor"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <BlinkingCursor
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          █
                        </BlinkingCursor>
                      </CursorScreen>
                    )}

                    {bootStage === 'booting' && (
                      <BootScreen
                        key="booting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ y: '-100%' }}
                        transition={{ duration: 0.4 }}
                      >
                        <BootTextContainer>
                          <ContinuousTyping lines={bootLines} onComplete={handleBootTypingComplete} />
                        </BootTextContainer>
                      </BootScreen>
                    )}

                    {bootStage === 'loadingUI' && (
                      <LoadingUIScreen
                        key="loadingUI"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <VaultBoyGif
                          src="/assets/images/vault-boy/greetings.gif"
                          alt="Vault Boy"
                        />
                        <LoadingText>
                          Initiating<LoadingDots />
                        </LoadingText>
                      </LoadingUIScreen>
                    )}
                  </AnimatePresence>
                </MonitorBezel>
              </ScreenInset>
            </ScreenOutline>
          </TVBezel>
        ) : (
          <TVBezel
            key="pipboy"
            initial={{ scale: 0.75 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <ScreenOutline>
              <ScreenInset>
                <MonitorBezel>
                  <CRTEffect />
                  <PipBoyFrame
                    initial={{ opacity: 0, y: '-120%' }}
                    animate={{
                      opacity: 1,
                      y: ['120%', '15%', '0%']
                    }}
                    transition={{
                      opacity: { duration: 0.3, delay: 0.2 },
                      y: {
                        duration: 1.3,
                        delay: 0.2,
                        times: [0, 0.6, 1],
                        ease: [0.34, 1.56, 0.64, 1]
                      }
                    }}
                  >
                    <TopNav activeTab={activeTab} onTabChange={handleTabChange} />

                    <MainContent
                      as={motion.div}
                      animate={{
                        filter: isChannelSwitching ? 'blur(8px)' : 'blur(0px)',
                        opacity: isChannelSwitching ? 0.5 : 1
                      }}
                      transition={{
                        duration: 0.25,
                        ease: 'easeInOut'
                      }}
                    >
                      <TabContent activeTab={activeTab} />
                    </MainContent>

                    <PipBoyFooter />
                  </PipBoyFrame>
                </MonitorBezel>
              </ScreenInset>
            </ScreenOutline>
          </TVBezel>
        )}
      </AnimatePresence>
    </PipBoyContainer>
  );
};

const OffScreen = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: #000000;
  border-radius: 2px;
  position: relative;

  /* Textura sutil de vidro CRT desligado */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(20, 20, 25, 0.3) 2px,
        rgba(20, 20, 25, 0.3) 4px
      );
    opacity: 0.15;
  }

  /* Reflexo muito sutil */
  &::after {
    content: '';
    position: absolute;
    top: 20%;
    left: 30%;
    width: 40%;
    height: 30%;
    background: radial-gradient(ellipse at center, rgba(40, 50, 45, 0.04) 0%, transparent 50%);
    filter: blur(30px);
  }
`;

const CRTPowerOn = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: #000000;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
`;

const CRTLineUp = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 3px;
  background: linear-gradient(90deg,
    transparent 0%,
    ${PIPBOY_COLORS.bright} 20%,
    #ffffff 50%,
    ${PIPBOY_COLORS.bright} 80%,
    transparent 100%
  );
  box-shadow:
    0 0 20px ${PIPBOY_COLORS.bright},
    0 0 40px ${PIPBOY_COLORS.primary};
  z-index: 2;

  /* Área coberta com glow verde fosforescente */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 100vh;
    background: radial-gradient(ellipse at center,
      rgba(18, 255, 21, 0.15) 0%,
      rgba(10, 26, 12, 0.3) 20%,
      rgba(4, 10, 5, 0.5) 40%,
      #000000 70%
    );
  }
`;

const CRTLineDown = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 3px;
  background: linear-gradient(90deg,
    transparent 0%,
    ${PIPBOY_COLORS.bright} 20%,
    #ffffff 50%,
    ${PIPBOY_COLORS.bright} 80%,
    transparent 100%
  );
  box-shadow:
    0 0 20px ${PIPBOY_COLORS.bright},
    0 0 40px ${PIPBOY_COLORS.primary};
  z-index: 2;

  /* Área coberta com glow verde fosforescente */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    background: radial-gradient(ellipse at center,
      rgba(18, 255, 21, 0.15) 0%,
      rgba(10, 26, 12, 0.3) 20%,
      rgba(4, 10, 5, 0.5) 40%,
      #000000 70%
    );
  }
`;

const ScrollingScreen = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: #000000;
  border-radius: 2px;
  position: relative;
  overflow: hidden;

  /* Brilho fosforescente verde sutil */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at center, rgba(18, 255, 21, 0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
`;

const ScrollingTextContainer = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  font-size: 14px;
  line-height: 1.4;
  color: ${PIPBOY_COLORS.primary};
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};
  padding: 0 20px 100% 20px;
  white-space: nowrap;
  overflow: visible;

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 0 15px 100% 15px;
  }

  @media (max-width: 480px) {
    font-size: 10px;
    padding: 0 10px 100% 10px;
  }
`;

const ScrollLine = styled.div`
  opacity: 0.9;
`;

const BootScreen = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: ${PIPBOY_COLORS.primary};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  background: #000000;
  border-radius: 2px;
  padding: 40px 30px;
  position: relative;
  overflow: hidden;

  /* Brilho fosforescente verde sutil */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at center, rgba(18, 255, 21, 0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  /* Garantir que o texto fique acima do brilho */
  & > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
  }

  @media (max-width: 480px) {
    padding: 20px 15px;
  }
`;

const BootTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 100%;
  text-align: center;
  padding: 0 10px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 8px;
    padding: 0 5px;
  }
`;

const BootLine = styled(motion.div)`
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.5px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-width: 100%;

  /* Primeira linha (título) com fonte significativamente maior */
  &:first-child {
    font-size: 26px;
    font-weight: bold;
    letter-spacing: 1px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    letter-spacing: 0.3px;

    &:first-child {
      font-size: 22px;
    }
  }

  @media (max-width: 480px) {
    font-size: 12px;
    letter-spacing: 0.2px;

    &:first-child {
      font-size: 18px;
    }
  }
`;

const StartOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: pointer;
  backdrop-filter: blur(10px);
`;

const StartButton = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 40px 60px;
  background: rgba(18, 255, 21, 0.1);
  border: 3px solid ${PIPBOY_COLORS.primary};
  border-radius: 8px;
  box-shadow:
    0 0 20px rgba(18, 255, 21, 0.3),
    inset 0 0 30px rgba(18, 255, 21, 0.1);
  cursor: pointer;
  user-select: none;

  @media (max-width: 768px) {
    padding: 30px 50px;
  }

  @media (max-width: 480px) {
    padding: 25px 40px;
  }
`;

const StartText = styled.div`
  font-size: 32px;
  font-weight: bold;
  color: ${PIPBOY_COLORS.bright};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: ${PIPBOY_TEXT_GLOW.intense};
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      text-shadow: ${PIPBOY_TEXT_GLOW.intense};
    }
    50% {
      opacity: 0.7;
      text-shadow: ${PIPBOY_TEXT_GLOW.standard};
    }
  }

  @media (max-width: 768px) {
    font-size: 28px;
  }

  @media (max-width: 480px) {
    font-size: 24px;
    letter-spacing: 2px;
  }
`;

const StartSubtext = styled.div`
  font-size: 14px;
  color: ${PIPBOY_COLORS.primary};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.7;
  text-shadow: ${PIPBOY_TEXT_GLOW.subtle};

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const CursorScreen = styled(motion.div)`
  width: 100%;
  height: 100%;
  background: #000000;
  border-radius: 2px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 40px 30px;

  /* Brilho fosforescente verde sutil */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at center, rgba(18, 255, 21, 0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }
`;

const BlinkingCursor = styled(motion.div)`
  font-size: 24px;
  color: ${PIPBOY_COLORS.bright};
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  position: relative;
  z-index: 1;
`;

const LoadingUIScreen = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  background: #000000;
  z-index: 10;
`;

const VaultBoyGif = styled.img`
  width: 200px;
  height: auto;
  image-rendering: pixelated;
  filter: drop-shadow(0 0 10px ${PIPBOY_COLORS.primary});
`;

const LoadingText = styled.div`
  font-size: 20px;
  font-family: ${PIPBOY_TYPOGRAPHY.fontFamily};
  color: ${PIPBOY_COLORS.primary};
  text-shadow: ${PIPBOY_TEXT_GLOW.standard};
  text-transform: uppercase;
  letter-spacing: 2px;
`;
