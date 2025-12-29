import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: "Monofonto", "Courier New", monospace;
    background: #000;
    color: #1abc54;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Efeito CRT */
  @keyframes flicker {
    0% { opacity: 0.97; }
    50% { opacity: 1; }
    100% { opacity: 0.97; }
  }

  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }

  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #051509;
    border: 1px solid #1abc54;
  }

  ::-webkit-scrollbar-thumb {
    background: #1abc54;
    box-shadow: 0 0 10px #1abc54;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #2dd46a;
  }

  /* Seleção de texto */
  ::selection {
    background: #1abc54;
    color: #000;
  }

  /* Remover outline padrão e adicionar glow */
  button:focus,
  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    box-shadow: 0 0 10px rgba(26, 188, 84, 0.5);
  }
`;
