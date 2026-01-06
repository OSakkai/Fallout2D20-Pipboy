import styled from 'styled-components';
import { PIPBOY_SCANLINES } from '../../styles/pipboy-colors';

interface CRTOverlayProps {
  $showScanlines?: boolean;
}

const CRTOverlay = styled.div<CRTOverlayProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50;

  /* SCANLINES HORIZONTAIS - Reduzido 40% */
  background-image: ${props => props.$showScanlines ? `
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.09) 0px,
      rgba(0, 0, 0, 0.09) 1px,
      transparent 1px,
      transparent 2px
    )
  ` : 'none'};
  background-size: 100% 2px;
  animation: ${props => props.$showScanlines ? 'scanlineMove 8s linear infinite' : 'none'};

  /* CRT Horizontal Band Effect - Reduzido 40% */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: ${props => props.$showScanlines ?
      'linear-gradient(0deg, transparent 0%, rgba(255, 255, 255, 0.09) 50%, transparent 100%)' :
      'none'};
    background-size: 100% 200px;
    animation: ${props => props.$showScanlines ? 'crtBand 8s linear infinite' : 'none'};
    pointer-events: none;
  }

  /* Flicker effect - Reduzido 40% - SEMPRE ATIVO */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(18, 255, 21, 0.03);
    animation: flicker 0.12s infinite;
  }

  @keyframes scanlineMove {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 0 100%;
    }
  }

  @keyframes crtBand {
    0% {
      background-position: 0 -200px;
    }
    100% {
      background-position: 0 calc(100% + 200px);
    }
  }

  @keyframes flicker {
    0% { opacity: 0.94; }
    10% { opacity: 0.91; }
    20% { opacity: 0.97; }
    30% { opacity: 0.93; }
    40% { opacity: 0.95; }
    50% { opacity: 1; }
    60% { opacity: 0.92; }
    70% { opacity: 0.96; }
    80% { opacity: 0.93; }
    90% { opacity: 0.98; }
    100% { opacity: 0.94; }
  }
`;

const VignetteEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 49;
  /* Backlight inset - Reduzido 40% */
  box-shadow:
    inset 0 0 2.4rem rgba(18, 255, 21, 0.21),
    inset 0 0 90px rgba(0, 0, 0, 0.87);
  border-radius: 4px;
`;

const CRTCurvature = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 48;
  border-radius: 4px;
  overflow: hidden;
`;

interface CRTEffectProps {
  showScanlines?: boolean;
}

export const CRTEffect: React.FC<CRTEffectProps> = ({ showScanlines = true }) => {
  return (
    <>
      <CRTCurvature />
      <VignetteEffect />
      <CRTOverlay $showScanlines={showScanlines} />
    </>
  );
};
