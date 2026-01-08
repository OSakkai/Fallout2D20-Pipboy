# Pip-Boy Enhancements - Status de Implementação

## Solicitação do Usuário

Adicionar novas funcionalidades ao Pip-Boy:

### 1. **Nova Organização da Aba STAT**
Ordem das categorias:
1. STATUS (Body Locations) - já existe
2. EFFECTS (nova) - buffs/debuffs aplicados
3. S.P.E.C.I.A.L (renomear de "SPECIAL")
4. SKILLS (nova) - todas as 17 skills com cálculo automático
5. PERKS - já existe
6. GENERAL (nova) - reputações com facções

### 2. **Aba EFFECTS (Nova)**
- Layout: Lista simples dividida
- Lado esquerdo: Nome do efeito
- Lado direito: Modificadores (+2 HP, -3 AP, etc.)
- Separados por linhas horizontais
- Dados de: `character.activeEffects`

### 3. **Categoria SKILLS**
- Todas as 17 skills listadas em ordem alfabética
- Formato: coluna única à esquerda
- Lado direito superior: imagem/gif da skill
- Lado direito inferior: detalhes em texto
- Cálculo: **Total = SPECIAL + Ranks** (ex: "Small Guns: 7 (PER 5 + Rank 2)")
- Destacar tagged skills

### 4. **Categoria GENERAL**
- Listar facções encontradas pelo jogador
- Cada facção mostra:
  - Nome da facção
  - Nível de reputação (IDOLIZED, LIKED, ACCEPTED, NEUTRAL, SHUNNED, VILIFIED)
  - Pontos (-100 a +100)
  - Imagem representando a facção
- Dados de: `character.reputations`

---

## ✅ Progresso Backend

### Banco de Dados
- [x] ✅ Atualizado Prisma schema
  - Adicionadas tabelas `Faction` e `CharacterReputation`
  - Enum `ReputationLevel` com 6 níveis
  - Relação Character ↔ CharacterReputation ↔ Faction
  - Tabela `ActiveEffect` já existia

### Endpoints de Facções
- [x] ✅ `POST /factions` - Criar facção
- [x] ✅ `GET /factions` - Listar todas facções
- [x] ✅ `GET /factions/:id` - Buscar facção por ID
- [x] ✅ `GET /factions/reputations/character/:characterId` - Listar reputações do personagem
- [x] ✅ `PUT /factions/reputations/character/:characterId` - Definir reputação
- [x] ✅ `POST /factions/reputations/character/:characterId/adjust` - Ajustar reputação (+/- pontos)

### Módulos NestJS
- [x] ✅ Criado `FactionsModule`
- [x] ✅ Criado `FactionsService` com lógica de cálculo automático de níveis
- [x] ✅ Criado `FactionsController` com Swagger docs
- [x] ✅ Registrado em `AppModule`
- [x] ✅ Atualizado `CharactersService.findOne()` para incluir `activeEffects` e `reputations`

### DTOs
- [x] ✅ `CreateFactionDto`
- [x] ✅ `UpdateReputationDto`
- [x] ✅ `AdjustReputationDto`
- [x] ✅ Enum `ReputationLevel` exportado

---

## ⏳ Pendente Backend

### Migration
- [ ] ⚠️ Aplicar migration no banco
  - Executar `npx prisma migrate dev` ou `npx prisma db push`
  - Reiniciar backend para carregar novo Prisma Client
  - **IMPORTANTE**: Precisa ser feito para as tabelas existirem

### Seed de Facções (Opcional)
- [ ] Criar seed com facções do Fallout
  - Brotherhood of Steel
  - NCR (New California Republic)
  - Caesar's Legion
  - Railroad
  - Institute
  - Minutemen
  - Great Khans
  - etc.

---

## ⏳ Pendente Frontend

### CharacterContext
- [ ] Atualizar interfaces TypeScript
  - Adicionar `ActiveEffect[]` no tipo `Character`
  - Adicionar `CharacterReputation[]` no tipo `Character`
  - Criar interfaces para `Faction`, `ActiveEffect`, `CharacterReputation`

### Componentes Novos

#### 1. EffectsCategory.tsx
```typescript
// frontend/src/components/Tabs/Categories/EffectsCategory.tsx
interface ActiveEffect {
  id: string;
  name: string;
  effectType: 'CHEM' | 'INJURY' | 'PERK' | 'EQUIPMENT' | 'ENVIRONMENTAL' | 'OTHER';
  attributeMods?: Record<string, number>;  // { str: +2, per: -1 }
  skillMods?: Record<string, number>;      // { smallGuns: +10 }
  drMods?: Record<string, number>;         // { physical: +5 }
  duration?: number;
  expiresAt?: Date;
}

// Layout:
// - Lista simples com linhas horizontais
// - Esquerda: Nome do efeito
// - Direita: Modificadores formatados (+2 HP, -3 AP, +1 STR)
// - Estado vazio quando sem efeitos ativos
```

#### 2. SkillsCategory.tsx
```typescript
// frontend/src/components/Tabs/Categories/SkillsCategory.tsx
interface CharacterSkill {
  skill: string;        // 'SMALL_GUNS'
  rank: number;         // 0-6
  isTagged: boolean;
}

// Layout:
// - Grid 2 colunas
// - Esquerda: Lista de skills em ordem alfabética
//   - Nome da skill
//   - Total calculado: SPECIAL + Ranks
//   - Ex: "Small Guns: 7 (PER 5 + Rank 2)"
//   - Destacar se tagged (borda/ícone)
// - Direita superior: Imagem/GIF da skill
// - Direita inferior: Descrição da skill

// Cálculo SPECIAL por skill:
const SKILL_ATTRIBUTES = {
  ATHLETICS: 'strength',
  BIG_GUNS: 'strength',
  MELEE_WEAPONS: 'strength',
  THROWING: 'strength',
  UNARMED: 'strength',
  ENERGY_WEAPONS: 'perception',
  EXPLOSIVES: 'perception',
  LOCKPICK: 'perception',
  SMALL_GUNS: 'perception',
  SNEAK: 'agility',
  PILOT: 'agility',
  BARTER: 'charisma',
  SPEECH: 'charisma',
  MEDICINE: 'intelligence',
  REPAIR: 'intelligence',
  SCIENCE: 'intelligence',
  SURVIVAL: 'endurance',
};
```

#### 3. GeneralCategory.tsx
```typescript
// frontend/src/components/Tabs/Categories/GeneralCategory.tsx
interface CharacterReputation {
  id: string;
  level: 'IDOLIZED' | 'LIKED' | 'ACCEPTED' | 'NEUTRAL' | 'SHUNNED' | 'VILIFIED';
  points: number;  // -100 a +100
  faction: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

// Layout:
// - Grid 2 colunas
// - Esquerda: Lista de facções
//   - Nome da facção
//   - Nível de reputação (colorido: verde=LIKED, vermelho=VILIFIED, etc.)
//   - Pontos (ex: "60/100")
// - Direita:
//   - Imagem da facção selecionada
//   - Descrição/detalhes
// - Estado vazio quando sem reputações
```

### StatTabWithData.tsx - Reorganização
- [ ] Atualizar ordem dos sub-tabs:
  1. STATUS
  2. EFFECTS (novo)
  3. S.P.E.C.I.A.L (renomear)
  4. SKILLS (novo)
  5. PERKS
  6. GENERAL (novo)

- [ ] Importar novos componentes:
```typescript
import { EffectsCategory } from './Categories/EffectsCategory';
import { SkillsCategory } from './Categories/SkillsCategory';
import { GeneralCategory } from './Categories/GeneralCategory';
```

---

## 📋 Checklist de Implementação

### Backend
- [x] Schema Prisma atualizado
- [x] Módulo Factions criado
- [x] Endpoints implementados
- [x] Swagger documentado
- [ ] **Migration aplicada no DB**
- [ ] Backend reiniciado

### Frontend
- [ ] Interfaces TypeScript atualizadas
- [ ] EffectsCategory component
- [ ] SkillsCategory component
- [ ] GeneralCategory component
- [ ] StatTabWithData reorganizado
- [ ] CharacterContext atualizado

### Testing
- [ ] Criar facções via API
- [ ] Criar active effects via Dev Cheats
- [ ] Testar todas categorias no Pip-Boy
- [ ] Verificar cálculos de skills
- [ ] Verificar cores/níveis de reputação

---

## 🎯 Próximos Passos

1. **Aplicar Migration:**
   ```bash
   docker exec fallout2d20-pipboy-backend-1 npx prisma db push
   docker-compose restart backend
   ```

2. **Seed de Facções (opcional):**
   - Criar script seed com facções do Fallout
   - Popular imageUrl com caminhos de assets

3. **Implementar Componentes Frontend:**
   - Começar por EffectsCategory (mais simples)
   - Depois SkillsCategory (requer cálculos)
   - Por último GeneralCategory (depende de facções existirem)

4. **Atualizar Dev Cheats Menu:**
   - Adicionar seção para criar/editar effects
   - Adicionar seção para ajustar reputações

---

## 💡 Notas Importantes

- **Skills Calculation**: Backend deve retornar skills com rank, frontend calcula total (SPECIAL + Rank)
- **Reputation Colors**:
  - IDOLIZED: Verde brilhante
  - LIKED: Verde
  - ACCEPTED: Verde claro
  - NEUTRAL: Amarelo
  - SHUNNED: Laranja
  - VILIFIED: Vermelho
- **Tagged Skills**: Exibir ícone/borda especial
- **Active Effects**: Mostrar tempo restante se `expiresAt` presente
- **Empty States**: Todas categorias devem ter mensagem quando vazias
