// Pip-Boy Theme - Cores e estilos baseados no Fallout 4
export const theme = {
  colors: {
    // Cores principais do Pip-Boy (verde fosforescente)
    primary: '#1abc54',
    primaryDark: '#0e8a3f',
    primaryLight: '#2dd46a',

    // Cores de fundo
    background: '#0a2f1a',
    backgroundDark: '#051509',
    backgroundLight: '#0f3d20',

    // Cores de texto
    text: '#1abc54',
    textDim: '#127a3d',
    textBright: '#3fff7f',

    // Cores de status
    warning: '#ffa500',
    danger: '#ff4444',
    success: '#00ff00',

    // Cores de overlay
    overlay: 'rgba(10, 47, 26, 0.95)',
    scanline: 'rgba(26, 188, 84, 0.1)',
  },

  fonts: {
    primary: '"Monofonto", "Courier New", monospace',
    heading: '"Share Tech Mono", monospace',
  },

  shadows: {
    glow: '0 0 10px rgba(26, 188, 84, 0.5)',
    glowStrong: '0 0 20px rgba(26, 188, 84, 0.8)',
    inner: 'inset 0 0 15px rgba(0, 0, 0, 0.5)',
  },

  borders: {
    default: '2px solid #1abc54',
    thick: '3px solid #1abc54',
    thin: '1px solid #1abc54',
  },

  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
};

export type Theme = typeof theme;
