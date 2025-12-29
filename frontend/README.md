# Pip-Boy 3000 Mk IV - Fallout 2d20 TTRPG

Interface web do Pip-Boy para o RPG de mesa Fallout 2d20, replicando fielmente a UI do Fallout 4.

## 🎯 Características

- ✅ **UI Idêntica ao Fallout 4**: Interface verde fosforescente com efeitos CRT autênticos
- ✅ **Animações Suaves**: Transições e efeitos visuais usando Framer Motion
- ✅ **Responsivo**: Funciona em desktop, tablet e mobile
- ✅ **Multiplayer em Tempo Real**: Conecte múltiplos jogadores via Firebase
- ✅ **Sistema de Som**: Preparado para efeitos sonoros do Pip-Boy

## 🚀 Primeiros Passos

### Instalação

```bash
cd pipboy-fallout
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:5173

### Build para Produção

```bash
npm run build
npm run preview
```

## 📁 Estrutura do Projeto

```
pipboy-fallout/
├── src/
│   ├── components/
│   │   ├── PipBoy/         # Componentes principais do Pip-Boy
│   │   │   ├── PipBoy.tsx
│   │   │   ├── PipBoyHeader.tsx
│   │   │   ├── PipBoyNav.tsx
│   │   │   └── TabContent.tsx
│   │   └── Effects/        # Efeitos visuais (CRT, scanlines)
│   │       └── CRTEffect.tsx
│   ├── hooks/              # Custom hooks (useSound, etc)
│   ├── services/           # Firebase e outros serviços
│   ├── styles/             # Temas e estilos globais
│   ├── types/              # TypeScript types
│   └── assets/
│       ├── sounds/         # Efeitos sonoros do Pip-Boy
│       ├── images/         # Imagens e ícones
│       └── fonts/          # Fontes customizadas
```

## 🎨 Temas e Cores

O projeto usa o esquema de cores verde fosforescente característico do Pip-Boy:

- **Primary**: `#1abc54` (verde Pip-Boy)
- **Background**: `#0a2f1a` / `#051509`
- **Text**: `#1abc54` com variações de brilho

## 🔧 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Realtime Database
3. Copie suas credenciais
4. Edite `src/services/firebase.ts` e substitua as credenciais:

```typescript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  databaseURL: "SUA_DATABASE_URL",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

## 🎵 Adicionando Sons

Para adicionar os efeitos sonoros do Pip-Boy:

1. Coloque arquivos `.mp3` em `src/assets/sounds/`
2. Nomeie conforme os tipos em `useSound.ts`:
   - `ui_click.mp3`
   - `ui_hover.mp3`
   - `tab_change.mp3`
   - `boot.mp3`
   - `error.mp3`
   - `success.mp3`

## 📱 Navegação

O Pip-Boy possui 5 abas principais:

- **STAT**: Status do personagem, atributos SPECIAL, perks
- **INV**: Inventário (armas, armaduras, itens)
- **DATA**: Quests, notas e informações
- **MAP**: Mapa do mundo e marcadores
- **RADIO**: Estações de rádio

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Framer Motion** - Animações
- **Styled Components** - Estilos CSS-in-JS
- **Firebase** - Backend em tempo real
- **React Router** - Navegação (futuro)

## 🎮 Próximos Passos

### Funcionalidades a Implementar:

1. **Sistema de Personagem**
   - Ficha completa de personagem
   - Sistema SPECIAL
   - Gerenciamento de perks

2. **Inventário**
   - Sistema de itens completo
   - Equipamento de armas/armadura
   - Gerenciamento de peso

3. **Quests**
   - Sistema de missões
   - Objetivos rastreáveis
   - Histórico de quests

4. **Multiplayer**
   - Criação de sessões
   - Sistema de host/jogador
   - Sincronização em tempo real

5. **Combate**
   - Rastreamento de HP/AP
   - Sistema de turnos
   - Dados de combate

## 📝 Licença

Este projeto é apenas para uso pessoal e educacional. Fallout é marca registrada da Bethesda Softworks.

## 🤝 Contribuindo

Como este é um projeto pessoal, não estamos aceitando contribuições no momento. Mas sinta-se livre para fazer fork e adaptar para suas necessidades!
