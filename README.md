# Fallout 2D20 Pip-Boy Interface

Interface autêntica do Pip-Boy 3000 Mk IV para o sistema de RPG de mesa Fallout 2D20.

## ⚠️ AVISO IMPORTANTE: BANCO DE DADOS EM REFORMA

**O banco de dados foi recentemente reformulado e resetado (Janeiro 2026).**

**Impactos:**
- ❌ Personagens antigos foram perdidos
- ❌ Tokens de autenticação antigos são inválidos
- ✅ **Sistema de Perks completamente reformulado** - 94 perks importados
- ✅ **Nova organização da aba STAT** - EFFECTS, SKILLS, GENERAL adicionados
- ✅ **Sistema de Facções implementado** - Reputações e facções do wasteland

**Para continuar:**
1. Limpe o localStorage do navegador: `localStorage.clear()`
2. Faça login novamente como **Guest** ou crie novo usuário
3. Crie um novo personagem
4. Explore as novas funcionalidades!

---

## 🚀 Quick Start

### Iniciar o Sistema

```bash
# Clone o repositório
git clone <repo-url>
cd Fallout2D20-Pipboy

# Inicie os containers
docker-compose up -d
```

### Acessar

- **Frontend (Pip-Boy):** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api

---

## 🆕 Novidades - v2.0.0 (Janeiro 2026)

### 🎯 Sistema de Perks Reformulado

**Completamente reescrito do zero!**

- ✅ **94 perks** importados do CSV oficial Fallout 2d20
- ✅ **5 tipos de perks:** EFFECT, ABILITY, CRAFTING, COMPANION, SKILLS
- ✅ **Parsing automático** de effects, requirements e restrictions
- ✅ **Cálculo dinâmico** de efeitos baseado em rank e atributos
- ✅ **7 novos endpoints** para gerenciamento de perks

**Endpoints principais:**
- `GET /perks` - Listar todos (filtros: type, name)
- `GET /perks/type/:type` - Por tipo (EFFECT, ABILITY, etc)
- `GET /perks/available/:characterId` - Perks disponíveis para personagem
- `GET /perks/character/:characterId/active-effects` - **Efeitos ativos (Pip-Boy)**

**Sintaxe de Effects:**
```
allparts(DR): +1x(PerkRank)       → +2 DR (rank 2)
maximumHP: +att(E)x(PerkRank)     → +15 HP (END 5, rank 3)
carryWeight: +25x(PerkRank)       → +50 lbs (rank 2)
allparts(PR): +2                   → +2 PR (fixo)
```

Documentação completa: [PERKS-SYSTEM-IMPLEMENTATION.md](PERKS-SYSTEM-IMPLEMENTATION.md)

### 📊 Nova Organização da Aba STAT

**Ordem atualizada das categorias:**

1. **STATUS** - Body locations e HP
2. **EFFECTS** ✨ *NOVO* - Buffs/debuffs ativos
3. **S.P.E.C.I.A.L** - Atributos (renomeado)
4. **SKILLS** ✨ *NOVO* - 17 skills com cálculos automáticos
5. **PERKS** - Perks do personagem
6. **GENERAL** ✨ *NOVO* - Reputações com facções

**EFFECTS:**
- Exibe todos os efeitos ativos (perks, chems, injuries, equipment)
- Cores: verde para positivos (+), vermelho para negativos (-)
- Layout dividido: nome à esquerda, modificadores à direita

**SKILLS:**
- Todas as 17 skills sempre visíveis
- Cálculo automático: **Total = SPECIAL + Rank**
- Tagged skills marcadas com ★
- Grid 2 colunas: lista à esquerda, detalhes à direita

**GENERAL:**
- Reputações com facções do wasteland
- 6 níveis de reputação com cores dinâmicas:
  - IDOLIZED (verde brilhante)
  - LIKED (verde)
  - ACCEPTED (verde claro)
  - NEUTRAL (amarelo)
  - SHUNNED (laranja)
  - VILIFIED (vermelho)
- Barra de progresso visual
- Sistema de pontos (-100 a +100)

### 🏢 Sistema de Facções

- Gerenciamento completo de facções
- Reputações por personagem
- Cálculo automático de níveis baseado em pontos
- 6 endpoints de gerenciamento

---

## 🎮 Features Implementadas

### Frontend (React + TypeScript + Vite)

- ✅ **ROBCO Terminal Interface**
  - LoginScreen com visual ROBCO Industries
  - Sistema de autenticação JWT (Login/Register/Guest)
  - DEV TOOLS menu com navegação e API testing

- ✅ **Sistema de Criação de Personagem**
  - Wizard de 5 steps com validação
  - 6 origens disponíveis (Vault Dweller, Ghoul, Super Mutant, etc)
  - Distribuição de S.P.E.C.I.A.L (10 pontos extras)
  - Seleção de 3 Tag Skills
  - Review final com stats derivadas

- ✅ **Pip-Boy Interface Completa**
  - 5 Tabs: STAT, INV, DATA, MAP, RADIO
  - Visual autêntico Fallout 4
  - Cor oficial: `#12FF15` (RGB 18, 255, 21)
  - Fonte: Monofonto (oficial Pip-Boy)
  - Efeitos CRT com scanlines

- ✅ **Aba STAT** (Atualizada!)
  - 6 categorias (3 novas!)
  - Integração com API
  - Cálculos automáticos
  - Efeitos visuais e cores dinâmicas

- ✅ **Aba INV** - Gerenciamento de Inventário
- ✅ **Aba DATA** - Quest log e notas
- ✅ **Aba MAP** - Mapa local
- ✅ **Aba RADIO** - Rádio wasteland

### Backend (NestJS + Prisma + PostgreSQL)

- ✅ **Autenticação JWT**
  - Register, Login, Guest Login
  - Roles: PLAYER, GM

- ✅ **Gerenciamento de Personagens**
  - CRUD completo
  - 6 origens diferentes
  - Stats derivadas automáticas
  - Body locations com DR individual

- ✅ **Sistema de Perks** ✨ *REFORMULADO*
  - 94 perks do Fallout 2d20
  - Parsing e cálculo automático
  - Filtros e buscas avançadas

- ✅ **Sistema de Facções** ✨ *NOVO*
  - Gerenciamento de facções
  - Reputações por personagem
  - Cálculo automático de níveis

- ✅ **Enciclopédia**
  - Weapons, Armor, Consumables
  - Perks, Ammo, Magazines, Tools
  - Filtros por tipo e rarity

- ✅ **Sistema de Inventário**
  - Items equipáveis
  - Mods aplicáveis
  - Controle de quantidade e condição

- ✅ **Sistema de Campanhas/Parties**
  - Criação de mesas
  - Convite por código
  - Gerenciamento de jogadores

---

## 📚 API Endpoints

### Autenticação
- `POST /auth/register` - Criar conta
- `POST /auth/login` - Login
- `POST /auth/guest-login` - Login como guest

### Personagens
- `GET /characters` - Listar
- `POST /characters` - Criar
- `GET /characters/:id` - Detalhes
- `PUT /characters/:id` - Atualizar
- `DELETE /characters/:id` - Deletar

### Perks ✨ *NOVO*
- `GET /perks` - Listar todos
- `GET /perks/:id` - Detalhes
- `GET /perks/search/by-name/:name` - Buscar por nome
- `GET /perks/type/:type` - Filtrar por tipo
- `GET /perks/available/:characterId` - Perks disponíveis
- `GET /perks/:id/effects/:rank` - Efeitos calculados
- `GET /perks/character/:characterId/active-effects` - Efeitos ativos

### Facções ✨ *NOVO*
- `GET /factions` - Listar facções
- `POST /factions` - Criar facção
- `GET /factions/reputations/character/:characterId` - Reputações
- `PUT /factions/reputations/character/:characterId` - Definir reputação
- `POST /factions/reputations/character/:characterId/adjust` - Ajustar pontos

### Enciclopédia
- `GET /encyclopedia/weapons` - Armas
- `GET /encyclopedia/armor` - Armaduras
- `GET /encyclopedia/perks` - Perks
- `GET /encyclopedia/consumables` - Consumíveis
- Mais...

**Documentação completa:** http://localhost:3000/api

---

## 🛠️ Tecnologias

### Frontend
- React 18
- TypeScript
- Vite
- Styled Components
- Framer Motion
- React Router
- Axios

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- Swagger/OpenAPI
- JWT Authentication
- Class Validator

### DevOps
- Docker & Docker Compose
- Multi-stage builds
- Hot reload em desenvolvimento

---

## 🐛 Troubleshooting

### Erro 401 (Unauthorized)

**Causa:** Token expirado ou banco resetado

**Solução:**
```javascript
// No console do navegador:
localStorage.clear()
// Depois faça login novamente
```

### Personagens não aparecem

**Causa:** Banco de dados vazio após reset

**Solução:**
1. Faça login novamente
2. Crie um novo personagem
3. Se necessário, execute seeds:
```bash
docker exec fallout2d20-pipboy-backend-1 npx ts-node src/scripts/seed-perks.ts
```

---

## 📖 Documentação Adicional

- [PERKS-SYSTEM-IMPLEMENTATION.md](PERKS-SYSTEM-IMPLEMENTATION.md) - Sistema de Perks completo
- [IMPLEMENTATION-PROGRESS.md](IMPLEMENTATION-PROGRESS.md) - Progresso da implementação
- [Swagger API](http://localhost:3000/api) - Documentação interativa

---

## 📝 Changelog

### v2.0.0 (Janeiro 2026) - CURRENT
- ✨ Sistema de Perks reformulado (94 perks)
- ✨ Nova aba EFFECTS na STAT
- ✨ Nova aba SKILLS com cálculos automáticos
- ✨ Nova aba GENERAL com reputações
- ✨ Sistema de Facções implementado
- 🔧 Parsing automático de perk effects
- 🔧 Validação de requirements e restrictions
- 📚 Documentação completa
- ⚠️ **BREAKING:** Banco de dados resetado

### v1.0.0
- 🎮 Interface Pip-Boy inicial
- 👤 Sistema de autenticação
- 📊 Gerenciamento de personagens
- 🎒 Sistema de inventário
- 📖 Enciclopédia de items

---

## 👥 Créditos

- **Sistema de RPG:** Fallout 2d20 by Modiphius Entertainment
- **Desenvolvimento:** Projeto de fã da comunidade
- **Design:** Inspirado no Pip-Boy dos jogos Fallout

---

## 📄 Licença

Este projeto é um fan project não-oficial de Fallout.

Fallout e Pip-Boy são marcas registradas da Bethesda Softworks LLC.

---

**Stay safe in the Wasteland! ☢️**
