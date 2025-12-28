# Fallout 2D20 Pip-Boy Interface

Interface autêntica do Pip-Boy 3000 Mk IV para o sistema de RPG de mesa Fallout 2D20.

## 🎮 Features Implementadas

### Frontend (React + TypeScript + Vite)
- ✅ **Visual Autêntico Fallout 4**
  - Cor oficial: `#12FF15` (RGB 18, 255, 21)
  - Fonte: Monofonto (oficial Pip-Boy)
  - Efeitos CRT com scanlines e chromatic aberration
  - Gradiente radial de fundo autêntico
  - Overlay físico do Pip-Boy como decoração

- ✅ **Sistema de Sons**
  - 7 tipos de beeps/clicks gerados via Web Audio API
  - Sons de hover, click, select, tab change, boot, error, static

- ✅ **5 Tabs Completas**
  - **STAT**: SPECIAL, Status, Perks
  - **INV**: Weapons, Apparel, Aid, Misc
  - **DATA**: Quests, Notes, Stats
  - **MAP**: Local/World map com marcadores
  - **RADIO**: 3 estações com player de música

- ✅ **Sistema de Perks**
  - Grid visual com cards clicáveis
  - Integração com PNGs do Fallout 2d20
  - Sistema de unlock/locked
  - Painel de detalhes com requirements

### Backend (Em Desenvolvimento)
- 🔄 Firebase Realtime Database para multiplayer
- 🔄 Sistema de autenticação
- 🔄 Sincronização de personagens em tempo real

## 📁 Estrutura do Projeto

```
Fallout2D20-Pipboy/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── PipBoy/      # Componentes principais
│   │   │   ├── Tabs/        # Tabs (STAT, INV, DATA, MAP, RADIO)
│   │   │   └── Effects/     # Efeitos visuais (CRT)
│   │   ├── hooks/           # Custom hooks (useSound)
│   │   ├── styles/          # Sistema de cores e temas
│   │   ├── utils/           # Utilitários (soundGenerator)
│   │   └── types/           # TypeScript types
│   └── public/
│       └── assets/
│           ├── images/      # Vault Boy GIFs, Perks PNGs, Overlay
│           └── fonts/       # Monofonto
│
└── backend/           # Backend (Firebase/Node.js)
    └── (em desenvolvimento)
```

## 🚀 Como Usar

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O servidor será iniciado em `http://localhost:5173/`

### Build para Produção

```bash
npm run build
```

## 🎨 Tecnologias

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **Styled Components** - CSS-in-JS
- **Framer Motion** - Animações
- **Web Audio API** - Geração de sons

### Backend (Planejado)
- **Firebase** - Realtime Database
- **Node.js** - Runtime
- **Express** - API REST (opcional)

## 📝 Referências

- Sistema oficial: Fallout 2d20 RPG da Modiphius
- Visual baseado em: Fallout 4 (Bethesda)
- Assets: [Fallout Wiki](https://fallout.fandom.com/)

## 🤝 Contribuindo

Este projeto está em desenvolvimento ativo. Features planejadas:

- [ ] Sistema de combate
- [ ] Gerenciador de inventário completo
- [ ] Sistema de quests dinâmico
- [ ] Multiplayer com Firebase
- [ ] Importação/exportação de personagens
- [ ] Integração com dados do livro Fallout 2d20

## 📄 Licença

Este é um projeto fan-made, não oficial. Fallout é propriedade da Bethesda Softworks. O sistema Fallout 2d20 é propriedade da Modiphius Entertainment.

---

🤖 Desenvolvido com [Claude Code](https://claude.com/claude-code)
