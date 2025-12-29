import styled from 'styled-components';
import { PIPBOY_SCANLINES } from '../../styles/pipboy-colors';

const CRTOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50;

  /* Scanlines autênticas com chromatic aberration (DEVGUIDE) */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: ${PIPBOY_SCANLINES.crt};
    background-size: ${PIPBOY_SCANLINES.size};
    animation: scanline 8s linear infinite;
    opacity: 0.3;
  }

  /* Flicker effect autêntico (DEVGUIDE) */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(18, 255, 21, 0.01);
    animation: flicker 0.15s infinite;
  }

  @keyframes scanline {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(10px);
    }
  }

  /* Flicker autêntico do DEVGUIDE */
  @keyframes flicker {
    0% { opacity: 0.97; }
    5% { opacity: 0.95; }
    10% { opacity: 0.99; }
    15% { opacity: 0.94; }
    20% { opacity: 1; }
    100% { opacity: 0.97; }
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
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.8);
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

export const CRTEffect = () => {
  return (
    <>
      <CRTCurvature />
      <VignetteEffect />
      <CRTOverlay />
    </>
  );
};
