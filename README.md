# Fallout 2D20 Pip-Boy Interface

Interface autêntica do Pip-Boy 3000 Mk IV para o sistema de RPG de mesa Fallout 2D20.

## 🎮 Features Implementadas

### Frontend (React + TypeScript + Vite)
- ✅ **ROBCO Terminal Interface**
  - LoginScreen com visual autêntico ROBCO Industries
  - MainMenu com monitor frame e efeitos CRT
  - Sistema de autenticação JWT (Login/Register/Guest)
  - DEV TOOLS menu com page navigation e API testing
  - Transições suaves com Framer Motion
  - Beep sounds autênticos do Pip-Boy

- ✅ **Sistema de Criação de Personagem**
  - Wizard de 5 steps com validação
  - Step 1: Nome do personagem com preview Vault Boy
  - Step 2: Seleção de Origem (6 origens disponíveis)
    - Vault Dweller, Wastelander, Ghoul, Super Mutant, Brotherhood Initiate, Robot
    - Modificadores SPECIAL por origem
  - Step 3: Distribuição de atributos S.P.E.C.I.A.L. (10 pontos extras)
  - Step 4: Seleção de 3 Tag Skills (com sugestões baseadas em origem)
  - Step 5: Review final com stats derivadas (HP, Defense, Initiative, Melee Damage)
  - Animações suaves entre steps com Framer Motion
  - Sons de feedback para cada interação

- ✅ **Sistema de Gerenciamento de Campanha**
  - NewGameMenu: Separação clara entre Mestres e Jogadores
  - CampaignManager para Game Masters:
    - Criação de nova campanha (nome, descrição, máx. jogadores)
    - Gerenciamento de campanhas existentes
    - Interface preparada para Party Management
  - Fluxo separado: CREATE CHARACTER (jogadores) vs START CAMPAIGN (mestres)

- ✅ **Visual Autêntico Fallout 4**
  - Cor oficial: `#12FF15` (RGB 18, 255, 21)
  - Fonte: Monofonto (oficial Pip-Boy)
  - Efeitos CRT com scanlines e chromatic aberration
  - Gradiente radial de fundo autêntico
  - Overlay físico do Pip-Boy como decoração
  - Monitor frame com TV bezel e phosphorescent glow

- ✅ **Sistema de Sons**
  - 7 tipos de beeps/clicks gerados via Web Audio API
  - Sons de hover, click, select, tab change, boot, error, static
  - beepPipboy.mp3 para interações do terminal

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

### Backend (NestJS + TypeScript + PostgreSQL)
- ✅ **Arquitetura Modular NestJS**
  - Docker Compose com PostgreSQL
  - Prisma ORM com TypeScript type-safety
  - Estrutura preparada para escalabilidade

- ✅ **Sistema de Autenticação JWT**
  - Passport.js + JWT tokens
  - Roles: PLAYER e GM (Game Master)
  - Guards para rotas protegidas
  - Modo Guest para acesso sem cadastro
  - Username único para cada usuário

- ✅ **Módulos CRUD Completos**
  - Characters: SPECIAL stats, HP, level, XP
  - Items: Categorias (WEAPON, ARMOR, AID, MISC, AMMO)
  - Parties: Criação de sessões com código único
  - Relações User ↔ Character ↔ Items ↔ Parties

- ✅ **Swagger API Documentation**
  - Documentação interativa completa
  - Schemas de request/response
  - Autenticação Bearer JWT
  - Disponível em: `http://localhost:3000/api`

- ✅ **WebSocket Real-time (Socket.io)**
  - Eventos de combate preparados (damage, healing, movement)
  - Comunicação GM ↔ Players
  - Base para sincronização instantânea do Pip-Boy

## 📁 Estrutura do Projeto

```
Fallout2D20-Pipboy/
├── docker-compose.yml     # Orquestração de containers
│
├── frontend/              # React + Vite application
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/
│   │   │   ├── PipBoy/      # Componentes principais do Pip-Boy
│   │   │   ├── Tabs/        # Tabs (STAT, INV, DATA, MAP, RADIO)
│   │   │   ├── Terminal/    # Terminal screens (Login, MainMenu, etc.)
│   │   │   │   ├── CharacterCreation/  # Wizard de criação de personagem
│   │   │   │   │   ├── Step2BasicInfo.tsx
│   │   │   │   │   ├── Step3Origin.tsx
│   │   │   │   │   ├── Step4Special.tsx
│   │   │   │   │   ├── Step5Skills.tsx
│   │   │   │   │   └── Step6Review.tsx
│   │   │   │   ├── CharacterCreation.tsx  # Main wizard component
│   │   │   │   ├── NewGameMenu.tsx        # Menu NEW GAME
│   │   │   │   ├── CampaignManager.tsx    # Gerenciamento de campanhas
│   │   │   │   ├── MainMenu.tsx
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── Encyclopedia.tsx
│   │   │   └── Effects/     # Efeitos visuais (CRT)
│   │   ├── hooks/           # Custom hooks (usePipBoySound)
│   │   ├── data/            # Game data (origins, skills)
│   │   ├── styles/          # Sistema de cores e temas
│   │   ├── utils/           # Utilitários (soundGenerator)
│   │   └── types/           # TypeScript types (character, etc.)
│   └── public/
│       └── assets/
│           ├── images/      # Vault Boy GIFs, Perks PNGs, Overlay
│           ├── sounds/      # Audio files (boot, beep, idle, etc.)
│           └── fonts/       # Monofonto
│
└── backend/               # NestJS + PostgreSQL + Prisma
    ├── Dockerfile
    ├── prisma/
    │   └── schema.prisma    # Database models (User, Character, Item)
    └── src/
        ├── main.ts          # Application entry point
        ├── app.module.ts    # Root module
        ├── database/        # Prisma service & module
        └── modules/
            ├── auth/        # JWT authentication (Passport.js)
            ├── characters/  # Character CRUD (SPECIAL, HP, XP)
            ├── items/       # Inventory CRUD (by category)
            └── websocket/   # Socket.io gateway (real-time)
```

## 🚀 Como Usar

### Opção 1: Docker Compose (Recomendado)

Inicie todo o ambiente (frontend + backend + database) com um único comando:

```bash
docker-compose up
```

**URLs de Acesso:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/api`
- PostgreSQL: `localhost:5432`

### Opção 2: Desenvolvimento Local

#### Backend

```bash
cd backend
npm install

# Criar arquivo .env baseado no .env.example
cp .env.example .env

# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate dev --name init

# Iniciar servidor
npm run start:dev
```

Backend estará em:
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend estará em `http://localhost:5173`

### Build para Produção

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
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

### Backend
- **NestJS** - Framework Node.js modular e escalável
- **TypeScript** - Type safety completo
- **PostgreSQL** - Database relacional
- **Prisma ORM** - Type-safe database access
- **Passport.js + JWT** - Autenticação e autorização
- **Socket.io** - WebSocket para comunicação real-time
- **Docker** - Containerização

## 📝 Referências

- Sistema oficial: Fallout 2d20 RPG da Modiphius
- Visual baseado em: Fallout 4 (Bethesda)
- Assets: [Fallout Wiki](https://fallout.fandom.com/)

## 🤝 Contribuindo

Este projeto está em desenvolvimento ativo. Features planejadas:

**Próximas Implementações:**
- [x] ✅ Sistema de criação de personagem completo (5 steps)
- [x] ✅ Sistema de gerenciamento de campanha (GM)
- [x] ✅ NewGameMenu com separação Mestres/Jogadores
- [ ] Party Management Screen (adicionar/remover jogadores)
- [ ] Sistema de convites para campanhas
- [ ] Integração backend para personagens e campanhas
- [ ] Sistema de combate em tempo real com zonas
- [ ] Tela do Game Master (GM screen)
- [ ] Matchmaking com código de sala
- [ ] Guidebook interativo das regras 2d20
- [ ] Cálculos automáticos (dano, cura, movimento, testes)
- [ ] Sistema de crafting
- [ ] Importação/exportação de personagens
- [ ] Mapas de combate interativos criados pelo GM
- [ ] Interface responsiva para tablets e smartphones

## 📄 Licença

Este é um projeto fan-made, não oficial. Fallout é propriedade da Bethesda Softworks. O sistema Fallout 2d20 é propriedade da Modiphius Entertainment.

---

🤖 Desenvolvido com [Claude Code](https://claude.com/claude-code)
