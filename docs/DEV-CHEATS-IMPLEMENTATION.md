# 🎮 Implementação do Sistema de Cheats DEV - Pip-Boy

## ✅ IMPLEMENTAÇÃO COMPLETA!

### 📦 Backend - Endpoints Criados

Todos os endpoints foram criados em `backend/src/modules/characters/`:

#### 1. **Update SPECIAL** - `PUT /characters/:id/special`
```typescript
Body: {
  strength?: number (1-10),
  perception?: number (1-10),
  endurance?: number (1-10),
  charisma?: number (1-10),
  intelligence?: number (1-10),
  agility?: number (1-10),
  luck?: number (1-10)
}
```

#### 2. **Update Skill** - `PUT /characters/:id/skill`
```typescript
Body: {
  skill: "SMALL_GUNS" | "LOCKPICK" | etc.,
  rank: number (0-6)
}
```

#### 3. **Update Stats** - `PUT /characters/:id/stats`
```typescript
Body: {
  currentHP?: number,
  maxHP?: number,
  level?: number,
  xpCurrent?: number,
  defense?: number,
  initiative?: number,
  meleeDamage?: number
}
```

#### 4. **Apply Damage** - `POST /characters/:id/damage`
```typescript
Body: {
  damage: number,
  location?: "HEAD" | "TORSO" | "LEFT_ARM" | "RIGHT_ARM" | "LEFT_LEG" | "RIGHT_LEG"
}
```

#### 5. **Heal** - `POST /characters/:id/heal`
```typescript
Body: {
  amount: number,
  location?: "HEAD" | "TORSO" | etc.
}
```

#### 6. **Apply Radiation** - `POST /characters/:id/radiation`
```typescript
Body: {
  rads: number
}
```

#### 7. **Apply Poison** - `POST /characters/:id/poison`
```typescript
Body: {
  poisonLevel: number
}
```

#### 8. **Add Inventory Item** - `POST /characters/:id/inventory`
```typescript
Body: {
  itemId: string (UUID),
  itemType: "WEAPON" | "ARMOR" | "CONSUMABLE" | "AMMO" | "MOD" | "MAGAZINE" | "TOOL",
  quantity?: number (default: 1),
  isEquipped?: boolean (default: false)
}
```

#### 9. **Remove Inventory Item** - `DELETE /characters/:id/inventory/:inventoryItemId`

---

### 🎨 Frontend - Componentes Criados

#### 1. **CharacterSelector** (`CharacterSelector.tsx`)
- Modal que aparece quando você abre o Pip-Boy
- Lista todos os personagens do usuário logado
- Mostra nome, level, origin, HP, SPECIAL
- Ao selecionar, salva o ID no localStorage
- Botão "Cancel" para fechar sem selecionar

**Features:**
- Auto-carrega personagem salvo do localStorage
- Design Pip-Boy (verde fosforescente)
- Animações suaves com Framer Motion
- Feedback visual no hover

#### 2. **DevCheatsOverlay** (`DevCheatsOverlay.tsx`)
- Overlay que abre com **F12**
- Fecha com **ESC** ou clicando fora
- Interface completa com todos os controles

**Seções:**
1. **S.P.E.C.I.A.L.**
   - 7 inputs (Strength, Perception, etc.)
   - Range: 1-10
   - Botão "Update SPECIAL"

2. **Skills**
   - Dropdown para selecionar skill
   - Input para rank (0-6)
   - Botão "Update Skill"

3. **Stats (HP / XP / Level)**
   - Current HP, Max HP, Level, XP
   - Campos opcionais (deixe vazio para não alterar)
   - Botão "Update Stats"

4. **Damage / Heal**
   - Input de quantidade de dano
   - Input de quantidade de cura
   - Dropdown para selecionar body location (opcional)
   - Botões "Apply Damage" (vermelho) e "Heal" (verde)

5. **Radiation / Poison**
   - Input de RADs
   - Input de Poison Level
   - Botões "Apply Radiation" e "Apply Poison" (amarelos)

**Features:**
- Mensagens de sucesso/erro com animação
- Validação de inputs (min/max)
- Botões desabilitados se não houver personagem selecionado
- Design Pip-Boy com cores de warning (amarelo/laranja)
- Todos os controles com hover effects

#### 3. **PipBoyWithCharacter** (`PipBoyWithCharacter.tsx`)
- Wrapper que integra PipBoy + CharacterSelector + DevCheats
- Gerencia estado do personagem selecionado
- Intercepta tecla F12 para abrir menu de cheats
- Salva personagem selecionado no localStorage

---

### 🔧 Como Usar

#### Abrir o Pip-Boy
1. No main menu, clique em "PIP-BOY"
2. Modal de seleção de personagem aparece automaticamente
3. Selecione um personagem da lista
4. Pip-Boy carrega com os dados do personagem

#### Abrir Menu de Cheats
1. Pressione **F12** (de qualquer tela do Pip-Boy)
2. Overlay aparece com todos os controles
3. Modifique os valores desejados
4. Clique nos botões para aplicar
5. Mensagem de sucesso/erro aparece
6. Pressione **ESC** ou clique fora para fechar

#### Exemplos de Uso

**1. Aumentar Strength e Perception:**
- Abra cheats (F12)
- Na seção "S.P.E.C.I.A.L.", mude Strength para 10, Perception para 9
- Clique "Update SPECIAL"
- ✓ Success!

**2. Aumentar rank de Small Guns:**
- Abra cheats (F12)
- Na seção "Skills", selecione "SMALL GUNS"
- Mude Rank para 5
- Clique "Update Skill"
- ✓ Success!

**3. Simular dano na cabeça:**
- Abra cheats (F12)
- Na seção "Damage / Heal", coloque 15 em "Damage Amount"
- No dropdown "Body Location", selecione "HEAD"
- Clique "Apply Damage"
- ✓ Success! (HP da cabeça reduzido)

**4. Curar completamente:**
- Abra cheats (F12)
- Na seção "Damage / Heal", coloque 999 em "Heal Amount"
- Deixe "Body Location" em "General HP"
- Clique "Heal"
- ✓ Success! (HP restaurado ao máximo)

**5. Aplicar radiação:**
- Abra cheats (F12)
- Na seção "Radiation / Poison", coloque 50 em "Radiation (RADs)"
- Clique "Apply Radiation"
- ✓ Success!

---

### 📝 DTOs Criados

1. `UpdateSPECIALDto` - Validação para SPECIAL (1-10)
2. `UpdateSkillDto` - Validação para skills (rank 0-6)
3. `UpdateStatsDto` - Validação para HP, XP, Level, etc.
4. `ApplyDamageDto` - Validação para dano + location
5. `ApplyRadiationDto` - Validação para RADs
6. `ApplyPoisonDto` - Validação para poison level
7. `HealDto` - Validação para cura + location
8. `AddInventoryItemDto` - Validação para adicionar itens

---

### 🎯 Próximos Passos (Opcional)

1. **Adicionar aba "Inventory" no menu de cheats**
   - Listar itens disponíveis da encyclopedia
   - Botão "Add to Inventory" para cada item
   - Lista de itens no inventário com botão "Remove"

2. **Adicionar campo "radiationLevel" no schema DerivedStats**
   - Atualmente a radiação não persiste no banco
   - Seria bom ter um campo para trackear RADs acumulados

3. **Adicionar visual feedback no Pip-Boy**
   - Quando stats mudam via cheats, animar os valores
   - HP bar que atualiza em tempo real
   - SPECIAL que pisca quando modificado

4. **Adicionar histórico de cheats**
   - Log das ações realizadas
   - Botão "Undo" para reverter última ação

---

### 🧪 Como Testar

#### Via Interface (Recomendado)
1. Faça login ou use guest access
2. Crie um personagem via wizard
3. No main menu, clique "PIP-BOY"
4. Selecione seu personagem
5. Pressione **F12**
6. Teste todos os controles!

#### Via Swagger API (http://localhost:3000/api)
1. Obtenha um token via `/auth/guest` ou `/auth/login`
2. Crie um personagem via `/characters/wizard`
3. Copie o character ID
4. Teste os endpoints `/characters/:id/special`, `/characters/:id/skill`, etc.
5. Use "Try it out" no Swagger para testar cada endpoint

#### Via cURL (Linha de comando)
```bash
# 1. Get token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/guest | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

# 2. Create character
CHAR_ID=$(curl -s -X POST http://localhost:3000/characters/wizard \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"characterName":"Test","origin":"VAULT_DWELLER","special":{"strength":5,"perception":6,"endurance":5,"charisma":4,"intelligence":7,"agility":6,"luck":5},"tagSkills":["SMALL_GUNS"],"skillRanks":{"SMALL_GUNS":2},"level":1,"maxHP":10,"defense":1,"initiative":12,"meleeDamage":1}' | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

# 3. Update SPECIAL
curl -X PUT "http://localhost:3000/characters/$CHAR_ID/special" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"strength":10,"perception":9}'

# 4. Update Skill
curl -X PUT "http://localhost:3000/characters/$CHAR_ID/skill" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"skill":"SMALL_GUNS","rank":5}'

# 5. Apply Damage
curl -X POST "http://localhost:3000/characters/$CHAR_ID/damage" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"damage":5,"location":"HEAD"}'

# 6. Heal
curl -X POST "http://localhost:3000/characters/$CHAR_ID/heal" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":10}'
```

---

### 📚 Arquivos Modificados/Criados

**Backend:**
- `backend/src/modules/characters/characters.controller.ts` ✏️ (modificado)
- `backend/src/modules/characters/characters.service.ts` ✏️ (modificado)
- `backend/src/modules/characters/dto/update-special.dto.ts` ✨ (novo)
- `backend/src/modules/characters/dto/update-skill.dto.ts` ✨ (novo)
- `backend/src/modules/characters/dto/update-stats.dto.ts` ✨ (novo)
- `backend/src/modules/characters/dto/apply-damage.dto.ts` ✨ (novo)
- `backend/src/modules/characters/dto/add-inventory-item.dto.ts` ✨ (novo)

**Frontend:**
- `frontend/src/App.tsx` ✏️ (modificado)
- `frontend/src/components/PipBoy/CharacterSelector.tsx` ✨ (novo)
- `frontend/src/components/PipBoy/DevCheatsOverlay.tsx` ✨ (novo)
- `frontend/src/components/PipBoy/PipBoyWithCharacter.tsx` ✨ (novo)

---

### 🎉 Conclusão

**SISTEMA COMPLETO E FUNCIONAL!**

- ✅ Backend com 9 endpoints de cheats
- ✅ Seletor de personagem com UI Pip-Boy
- ✅ Menu de cheats completo com F12
- ✅ Todos os controles implementados:
  - SPECIAL (S, P, E, C, I, A, L)
  - Skills (17 skills com ranks)
  - Stats (HP, XP, Level)
  - Damage / Heal (geral ou por body location)
  - Radiation / Poison
- ✅ Validação de dados com DTOs
- ✅ Mensagens de sucesso/erro
- ✅ Design temático Pip-Boy
- ✅ Integrado com sistema de autenticação
- ✅ Persistência no localStorage

**Agora você pode:**
1. Selecionar personagens no Pip-Boy
2. Testar TODAS as APIs de modificação de personagem
3. Simular combate (dano/cura)
4. Ajustar atributos e skills
5. Aplicar efeitos (radiação/veneno)
6. Tudo com uma interface visual incrível!

**Pressione F12 no Pip-Boy e divirta-se testando! 🚀**
