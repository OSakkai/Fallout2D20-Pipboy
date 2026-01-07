# Changelog

All notable changes to this project will be documented in this file.

## [0.4.0] - 2026-01-07

### Fixed
- **Origin Enum Mismatch**: Corrigido mapeamento inconsistente entre DTO e Prisma Schema
  - `WASTELANDER` → `SURVIVOR`
  - `BROTHERHOOD_INITIATE` → `BROTHERHOOD`
  - `ROBOT` → `MISTER_HANDY`
  - Afetou: `backend/src/modules/characters/dto/create-character.dto.ts`, `frontend/src/types/character.ts`, `frontend/src/data/origins.ts`

- **Character Loading 500 Error**: Corrigido erro ao buscar personagem
  - Removido include inválido de relações que não existem mais (weapon, armor, etc. em InventoryItem)
  - Simplificado para `inventory: true` em `characters.service.ts:findOne()`

### Added
- **Pip-Boy API Integration**: Removido todos dados hardcoded
  - Criado `CharacterContext` para state management global
  - Hook `useCharacter()` para acessar dados do personagem
  - Auto-load de personagem salvo em localStorage
  - Loading states e error handling

- **Perks System com Dados Reais**
  - Componente `PerksTabWithData.tsx` com integração API
  - Exibe perks de `character.perks` do banco
  - Mostra detalhes do PerkMaster (condition, benefit, ranks)
  - Exibe level em que perk foi adquirido
  - Estado vazio quando personagem não tem perks

- **Inventory System com Dados Reais**
  - Componente `InvTabWithData.tsx` com integração API
  - Exibe `character.inventory` real do banco
  - Organiza por categoria (weapons, apparel, aid, misc, ammo)
  - Mapeamento de ItemType para categorias do frontend
  - Indicador visual de itens equipados
  - Mostra quantidade, condição, slot
  - Preparado para expansão com encyclopedia

- **Dev Cheats Menu (F12)**
  - Overlay popup para testar APIs durante desenvolvimento
  - Componente `DevCheatsOverlay.tsx`
  - 9 seções de controle:
    - Modificar SPECIAL attributes
    - Atualizar Skills e ranks
    - Modificar HP, XP, Level, Defense, Initiative
    - Aplicar dano (geral e por body location)
    - Curar HP
    - Simular radiação
    - Aplicar veneno
    - Adicionar itens ao inventário
    - Remover itens
  - Auto-refresh do Pip-Boy após usar cheats

- **Character Selector**
  - Componente `CharacterSelector.tsx`
  - Modal para selecionar personagem no Pip-Boy
  - Lista todos personagens do usuário
  - Preview de SPECIAL, HP, Level, Origin
  - Auto-load ao abrir Pip-Boy

- **Backend Dev/Cheat Endpoints**
  - `PUT /characters/:id/special` - Modificar atributos S.P.E.C.I.A.L.
  - `PUT /characters/:id/skill` - Ajustar ranks de skills
  - `PUT /characters/:id/stats` - Modificar HP, XP, Level, etc.
  - `POST /characters/:id/damage` - Aplicar dano
  - `POST /characters/:id/heal` - Curar HP
  - `POST /characters/:id/radiation` - Aplicar radiação
  - `POST /characters/:id/poison` - Modificar poison DR
  - `POST /characters/:id/inventory` - Adicionar item
  - `DELETE /characters/:id/inventory/:itemId` - Remover item
  - Todos com validação via DTOs e documentação Swagger

### Changed
- **TabContent.tsx**: Alterado imports para usar versões com dados reais
  - `StatTab` → `StatTabWithData`
  - `InvTab` → `InvTabWithData`
  - `PerksTab` → `PerksTabWithData` (em StatTab)

- **PipBoyWithCharacter.tsx**: Wrapped com CharacterProvider
  - Integrado character selector
  - Integrado dev cheats menu
  - Auto-refresh após modificações

### Documentation
- Atualizado `README.md` com features v0.4.0
- Criado `DEV-CHEATS-IMPLEMENTATION.md` (referência técnica)
- Criado `PIPBOY-API-INTEGRATION.md` (guia de integração)
- Criado `FIXES-APPLIED.md` (relatório de correções)
- Removidos arquivos temporários: `test-apis.md`, `test-results.md`, `RESUMO_EXECUCAO.md`, `DEPLOY_STATUS.md`

---

## [0.3.0] - 2026-01-06

### Added
- Sistema de criação de personagem completo (5 steps)
- Sistema de gerenciamento de campanha para GMs
- NewGameMenu com separação Mestres/Jogadores
- Body Locations com HP individual e Damage Resistance
- Derived Stats (Defense, Initiative, Melee Damage)

### Changed
- Melhorias no sistema de autenticação
- Otimizações no Prisma schema

---

## [0.2.0] - 2026-01-05

### Added
- ROBCO Terminal Interface completa
- Sistema de autenticação JWT
- Pip-Boy 3000 Mk IV interface
- 5 tabs (STAT, INV, DATA, MAP, RADIO)
- Sistema de sons autêntico
- Efeitos CRT

---

## [0.1.0] - 2025-12-XX

### Added
- Estrutura inicial do projeto
- Docker Compose setup
- NestJS backend básico
- React frontend básico
