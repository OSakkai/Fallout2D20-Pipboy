// Paleta de cores EXATA do Pip-Boy Fallout 4
// Fonte: DEVGUIDE.md - Fallout4Prefs.ini RGB(18, 255, 21)

export const PIPBOY_COLORS = {
  // Cor primária autêntica do Fallout 4
  primary: '#12FF15',        // Verde fosforescente principal RGB(18, 255, 21)
  bright: '#00EE00',         // Verde brilhante para destaque
  background: '#000000',     // Fundo preto absoluto

  // Estados de interação
  hover: '#008E00',          // Hover - verde médio
  active: '#00EE00',         // Ativo/selecionado
  disabled: '#005F00',       // Desabilitado
  inactive: '#002F00',       // Inativo escuro

  // Barras de status
  bar: '#12FF15',
  barBg: '#003300',

  // Gradiente de fundo radial autêntico
  gradientCenter: '#11581e',
  gradientEdge: '#041607',

  // Esquemas alternativos (para futuro)
  amber: '#FFB641',          // Fallout New Vegas
  blue: '#2ECFFF',           // Nuka Cola Quantum

  // Cores de status
  success: '#12FF15',        // Success - verde padrão
  warning: '#FFB641',        // Warning - amber
  danger: '#FF4141',         // Danger - red
} as const;

export const PIPBOY_TEXT_GLOW = {
  // Glow fosforescente multicamadas - reduzido para conforto visual
  standard: `
    0 0 2px rgba(255, 255, 255, 0.5),
    0 0 5px #12FF15,
    0 0 10px #12FF15
  `,

  // Variação mais sutil
  subtle: `
    0 0 1px rgba(255, 255, 255, 0.3),
    0 0 4px #12FF15
  `,

  // Variação intensa
  intense: `
    0 0 3px rgba(255, 255, 255, 0.6),
    0 0 8px #12FF15,
    0 0 15px #12FF15,
    0 0 20px #12FF15
  `,
} as const;

export const PIPBOY_GRADIENTS = {
  // Gradiente radial de fundo principal
  background: `radial-gradient(#11581e, #041607)`,

  // Gradiente para barras
  bar: `linear-gradient(to right, #12FF15, #00EE00)`,
} as const;

export const PIPBOY_SCANLINES = {
  // Scanlines horizontais + chromatic aberration do DEVGUIDE
  crt: `
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))
  `,
  size: '100% 2px, 3px 100%',
} as const;

export const PIPBOY_ANIMATIONS = {
  flicker: `
    @keyframes flicker {
      0% { opacity: 0.97; }
      5% { opacity: 0.95; }
      10% { opacity: 0.99; }
      15% { opacity: 0.94; }
      20% { opacity: 1; }
    }
  `,
} as const;

// Configuração de CRTFilter.js (WebGL)
export const CRT_FILTER_CONFIG = {
  barrelDistortion: 0.001,
  chromaticAberration: 0.0005,
  scanlineIntensity: 0.6,
  glowBloom: 0.001,
  flicker: 0.01,
  staticNoise: 0.001,
} as const;

// Tipografia baseada no DEVGUIDE
export const PIPBOY_TYPOGRAPHY = {
  fontFamily: '"Monofonto", "VT323", "Inconsolata", "Courier New", monospace',

  // Tamanhos por seção (do DEVGUIDE)
  sizes: {
    header: '24-30px',          // Headers principais (STAT, INV)
    headerEm: '1.3em',
    tabs: '20-25px',            // Abas de navegação
    content: '14-18px',         // Conteúdo/listas
    contentVw: '1.6vw',
    values: '20-24px',          // Valores numéricos (HP, AP)
    valuesEm: '1.8em',
    footer: '12-14px',          // Rodapé/labels
  },

  // Propriedades comuns
  letterSpacing: {
    header: '6px',
    normal: '0.5px',
  },

  lineHeight: 1.2,
  fontWeight: 400,
  textTransform: 'uppercase' as const,
} as const;

// Dimensões autênticas do dispositivo (do DEVGUIDE CodePen)
export const PIPBOY_DIMENSIONS = {
  device: {
    width: '630px',
    height: '400px',
  },
  screenBorder: {
    width: '370px',
    height: '290px',
    borderRadius: '20px',
  },
  screenActive: {
    width: '300px',
    height: '235px',      // Aspect ratio ~1.28:1
  },
  responsive: {
    container: 'min(100vw, 800px)',
    aspectRatio: '4/3',
    fontSize: 'clamp(12px, 2vw, 16px)',
  },
} as const;

// Layout hierárquico (do DEVGUIDE)
export const PIPBOY_LAYOUT = {
  header: '10%',         // 5 abas principais + indicadores
  subNav: '6%',          // Botões de sub-seção
  content: '70%',        // Lista + preview/Vault Boy
  quickItems: '6%',      // Stimpak/Radaway
  footer: '8%',          // HP/Level/AP
} as const;

export type PipBoyColor = typeof PIPBOY_COLORS;
