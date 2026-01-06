# Fallout 2d20 Database Architecture

## 📋 Visão Geral

Schema otimizado para PostgreSQL + Prisma focando em:
- ✅ Multi-jogador com campanhas
- ✅ Gestão completa de personagens
- ✅ Sistema de combate com cálculos automáticos
- ✅ Tracking de efeitos temporários
- ✅ Inventory com mods e condition
- ✅ NPCs simplificados com inventory completo

---

## 🏗️ Arquitetura de 3 Camadas

### **1. MASTER DATA (Catálogos de Referência)**
Tabelas read-only populadas com dados do Corebook:
- `weapon_master` - Todas as armas (67 items)
- `armor_master` - Todas as armaduras (91 items)
- `consumable_master` - Food, beverages, chems, aid (132 items)
  - **AID**: Stimpak, Super Stimpak, Stimpak Diffuser, RadAway, Rad-X, Robot Repair Kit (e variações)
  - **CHEM**: Buffout, Jet, Mentats, Psycho, X-Cell, etc.
  - **FOOD**: Pre-war food, irradiated food, fresh food (75 items)
  - **BEVERAGE**: Nuka-Cola, água, bebidas alcoólicas (22 items)
- `mod_master` - Mods de weapon/armor/clothing/robot (136 items)
- `perk_master` - Todos os perks (94 items)
- `magazine_master` + `magazine_issue_master` - Magazines (20 magazines + 87 issues)
- `ammo_master` - Tipos de munição (29 items)
- `tool_master` - Ferramentas e utilitários (19 items)

**Total**: 675+ itens importados do Fallout 2D20 Corebook

### **2. INSTANCE DATA (Dados de Jogo)**
Dados dinâmicos das campanhas:
- `users`, `campaigns`, `sessions`
- `characters` + componentes (attributes, skills, perks, etc)
- `npcs` (simplified)
- `inventory_items` (instâncias com mods e condition)
- `active_effects` (buffs/debuffs temporários)
- `session_states` (AP e Luck por sessão)

### **3. COMPUTED DATA (Cached)**
Valores calculados armazenados para performance:
- `derived_stats` - Defense, Initiative, HP, Carry Weight, etc
- `body_locations` - HP e DR por location

---

## 🔗 Relacionamentos Principais

```
User (1) ─────→ (N) Campaign
                     │
                     ├─→ (N) Character
                     │        ├─→ (1) CharacterAttributes
                     │        ├─→ (N) CharacterSkill
                     │        ├─→ (1) DerivedStats
                     │        ├─→ (N) BodyLocation
                     │        ├─→ (N) CharacterPerk ──→ PerkMaster
                     │        ├─→ (N) InventoryItem ──→ Master Tables
                     │        └─→ (N) ActiveEffect
                     │
                     ├─→ (N) Npc
                     │        └─→ (N) InventoryItem
                     │
                     └─→ (N) Session
                              └─→ (N) SessionState ──→ Character
```

---

## 💾 Detalhamento das Tabelas

### **Characters (Player Characters)**

#### `characters`
- Dados básicos: nome, level, XP, origin
- Relaciona com User e Campaign
- Tipo: Normal/Notable/Major (afeta cálculos)

#### `character_attributes` (S.P.E.C.I.A.L.)
- 7 atributos: Strength, Perception, Endurance, Charisma, Intelligence, Agility, Luck
- Range: 4-10 (pode exceder com perks)
- 1:1 com Character

#### `character_skills`
- 17 skills do Fallout 2d20
- Rank: 0-6 (max)
- `isTagged`: determina critical success range
- N:1 com Character

#### `derived_stats` (CACHED - recalcular on-demand)
- **Defense** = 1 (base) + modifiers
- **Initiative** = PER + AGI + modifiers
- **Melee Damage** = +1CD (STR 7-8), +2CD (STR 9-10), +3CD (STR 11+)
- **Max HP** = END + LCK + Level
- **Carry Weight** = STR × 10 + 150
- **Max Luck Points** = LCK ÷ 2 (Notable), LCK (Major)

#### `body_locations`
- 6 locations para humanos: HEAD, LEFT_ARM, RIGHT_ARM, TORSO, LEFT_LEG, RIGHT_LEG
- 6 locations para robôs: OPTICS, ARM_1, ARM_2, ARM_3, MAIN_BODY, THRUSTER
- Cada location tem: maxHP, currentHP, physicalDR, energyDR, radiationDR
- **diceRange**: mapeia hit location dice (ex: "1-2" para HEAD)

#### `character_perks`
- Histórico completo de perks adquiridos
- `acquiredAtLevel`: tracking de quando foi pego
- Permite múltiplos ranks do mesmo perk
- FK para `perk_master` (catálogo)

#### `active_effects`
- Buffs/debuffs temporários
- **Types**: CHEM, INJURY, PERK, EQUIPMENT, ENVIRONMENTAL
- **Mods em JSON**:
  - `attributeMods`: {strength: +1, perception: -1}
  - `skillMods`: {smallGuns: +2}
  - `drMods`: {physical: +3, energy: +2}
- `duration`: turnos/rounds (null = permanente)
- `expiresAt`: timestamp para limpeza automática
- `addictionRating`: para chems

---

### **Inventory System**

#### `inventory_items`
Cada item é uma **instância única** com:
- `characterId` ou `npcId`: quem possui
- `itemType` + `itemId`: referência ao master data
- `quantity`: para stackable items
- `condition`: 0-100% (durabilidade)
- `isEquipped` + `equippedSlot`: tracking de equipamento ativo
- `appliedMods[]`: array de IDs dos mods aplicados

**Exemplo de query**:
```prisma
// Pegar arma equipada do personagem com todos os mods
const equippedWeapon = await prisma.inventoryItem.findFirst({
  where: {
    characterId: "char_123",
    itemType: "WEAPON_RANGED",
    isEquipped: true
  },
  include: {
    // Precisaria join manual para pegar WeaponMaster e ModMaster
  }
})
```

---

### **NPCs (Simplified)**

#### `npcs`
- Tabela flat com todos os stats inline
- Tipo: Normal/Notable/Major
- S.P.E.C.I.A.L. inline (7 campos)
- Derived stats inline (calculados no insert)
- **Skills em JSON**: `{smallGuns: 3, melee: 2, survival: 1}`
- DR simplificado (mesmo valor para todas locations)
- Inventory completo via `inventory_items`

**Regras de criação**:
- Normal: SPECIAL soma = 35 + Level/2, sem Luck Points
- Notable: SPECIAL soma = 42 + Level/2, Luck Points = LCK/2
- Major: SPECIAL soma = 49 + Level/2, Luck Points = LCK

---

### **Session Tracking**

#### `sessions`
- Tracking de sessões de jogo
- `sessionNumber`: auto-incrementa por campanha
- `notes`: anotações do GM

#### `session_states`
- **AP e Luck Points são por sessão**
- Cada personagem tem seu estado por sessão
- Reset automático ao criar nova sessão
- Permite histórico completo de uso

---

## 🎲 Sistema de Cálculo de Dano

### **Fluxo de Cálculo**

1. **Buscar arma** do inventory do atacante
2. **Pegar base damage** do `weapon_master`
3. **Aplicar mods** do `appliedMods[]`
4. **Adicionar melee bonus** (se melee weapon)
5. **Determinar hit location** (dice roll)
6. **Buscar DR** do `body_locations` do alvo
7. **Aplicar damage effects** (Piercing, Persistent, Stun)
8. **Calcular damage final** = base - DR
9. **Aplicar damage** ao HP da location
10. **Check critical hit** (5+ damage = crit)

### **Fórmula de Damage**

```
Base Damage (weapon) 
  + Melee Bonus (STR for melee)
  + Mods (weapon mods, perks, chems)
  - Location DR (physical/energy/rad)
  = Final Damage

If Final Damage >= 5: Critical Hit
If Location HP <= 0: Injury
```

---

## 📊 Queries Importantes

### **1. Recalcular Derived Stats**

```typescript
async function recalculateDerivedStats(characterId: string) {
  const char = await prisma.character.findUnique({
    where: { id: characterId },
    include: {
      attributes: true,
      bodyLocations: true,
      activeEffects: true
    }
  });
  
  const attrs = char.attributes;
  
  // Aplicar buffs/debuffs
  let modifiedSTR = attrs.strength;
  let modifiedAGI = attrs.agility;
  // ... aplicar activeEffects.attributeMods
  
  // Calcular
  const defense = 1; // base + modifiers
  const initiative = attrs.perception + modifiedAGI;
  const meleeDamage = modifiedSTR >= 11 ? 3 : modifiedSTR >= 9 ? 2 : modifiedSTR >= 7 ? 1 : 0;
  const maxHP = attrs.endurance + attrs.luck + char.level;
  const carryWeightMax = modifiedSTR * 10 + 150;
  
  await prisma.derivedStats.update({
    where: { characterId },
    data: {
      defense,
      initiative,
      meleeDamage,
      maxHP,
      carryWeightMax,
      maxLuckPoints: char.characterType === 'MAJOR' ? attrs.luck : Math.ceil(attrs.luck / 2)
    }
  });
}
```

### **2. Aplicar Dano a Location**

```typescript
async function applyDamage(
  characterId: string,
  location: BodyLocationEnum,
  damage: number,
  damageType: DamageType
) {
  const loc = await prisma.bodyLocation.findUnique({
    where: { characterId_location: { characterId, location } }
  });
  
  // Selecionar DR apropriado
  const dr = damageType === 'PHYSICAL' ? loc.physicalDR :
             damageType === 'ENERGY' ? loc.energyDR :
             loc.radiationDR;
  
  const finalDamage = Math.max(0, damage - dr);
  const newHP = Math.max(0, loc.currentHP - finalDamage);
  
  await prisma.bodyLocation.update({
    where: { id: loc.id },
    data: { currentHP: newHP }
  });
  
  // Check critical e injury
  if (finalDamage >= 5) {
    // CRITICAL HIT
  }
  
  if (newHP <= 0) {
    // INJURY - criar ActiveEffect
  }
  
  return { finalDamage, isCritical: finalDamage >= 5, newHP };
}
```

### **3. Adicionar Efeito de Chem**

```typescript
async function consumeChem(
  characterId: string,
  chemId: string
) {
  const chem = await prisma.consumableMaster.findUnique({
    where: { id: chemId }
  });
  
  // Criar efeito ativo
  await prisma.activeEffect.create({
    data: {
      characterId,
      effectType: 'CHEM',
      name: chem.name,
      attributeMods: parseChemEffects(chem.effects),
      duration: chem.duration,
      expiresAt: chem.duration ? addTurns(new Date(), chem.duration) : null,
      addictionRating: chem.addictionRating
    }
  });
  
  // Recalcular stats
  await recalculateDerivedStats(characterId);
}
```

### **4. Level Up Automático**

```typescript
async function checkLevelUp(characterId: string) {
  const char = await prisma.character.findUnique({
    where: { id: characterId }
  });
  
  const xpRequired = calculateXPRequired(char.level + 1);
  
  if (char.xpEarned >= xpRequired) {
    const newLevel = char.level + 1;
    
    await prisma.character.update({
      where: { id: characterId },
      data: {
        level: newLevel,
        xpToNext: calculateXPRequired(newLevel + 1)
      }
    });
    
    // Aumentar HP
    await prisma.derivedStats.update({
      where: { characterId },
      data: {
        maxHP: { increment: 1 },
        currentHP: { increment: 1 }
      }
    });
    
    return { leveledUp: true, newLevel };
  }
  
  return { leveledUp: false };
}

function calculateXPRequired(level: number): number {
  // Fórmula: (Level × (Level - 1) / 2) × 100
  return (level * (level - 1) / 2) * 100;
}
```

---

## 🔧 Triggers PostgreSQL Recomendados

```sql
-- Auto-atualizar carry weight quando inventory muda
CREATE OR REPLACE FUNCTION update_carry_weight()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE derived_stats
  SET carry_weight_current = (
    SELECT COALESCE(SUM(
      CASE 
        WHEN ii.item_type = 'WEAPON_RANGED' THEN wm.weight * ii.quantity
        WHEN ii.item_type = 'ARMOR' THEN am.weight * ii.quantity
        -- ... outros tipos
      END
    ), 0)
    FROM inventory_items ii
    LEFT JOIN weapon_master wm ON ii.item_type = 'WEAPON_RANGED' AND ii.item_id = wm.id::text
    LEFT JOIN armor_master am ON ii.item_type = 'ARMOR' AND ii.item_id = am.id::text
    WHERE ii.character_id = NEW.character_id
  )
  WHERE character_id = NEW.character_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_carry_weight
AFTER INSERT OR UPDATE OR DELETE ON inventory_items
FOR EACH ROW
EXECUTE FUNCTION update_carry_weight();
```

```sql
-- Limpar efeitos expirados automaticamente
CREATE OR REPLACE FUNCTION cleanup_expired_effects()
RETURNS void AS $$
BEGIN
  DELETE FROM active_effects
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Agendar limpeza periódica
-- (configurar via pg_cron ou chamar manualmente)
```

---

## 📈 Índices para Performance

Já incluídos no schema Prisma:
- `characters`: userId, campaignId
- `character_skills`: characterId, skill combo
- `body_locations`: characterId + location unique
- `inventory_items`: characterId, npcId, itemType
- `active_effects`: characterId, expiresAt
- Master tables: name unique, tipos para filtering

---

## 🎯 Status da Implementação

### ✅ Completo
1. **Master Tables Populadas** - 675+ itens do Corebook importados via CSV
2. **Seed Script** - Script de migração completo em `prisma/seed.ts`
3. **Encyclopedia API** - Módulo REST completo para consulta de master data
   - `/encyclopedia/weapons` - Lista armas com filtros
   - `/encyclopedia/armor` - Lista armaduras com filtros
   - `/encyclopedia/consumables` - Lista consumíveis por categoria
   - `/encyclopedia/mods` - Lista mods com filtros
   - `/encyclopedia/perks` - Lista perks
   - `/encyclopedia/ammo` - Lista munição
   - `/encyclopedia/magazines` - Lista revistas
   - `/encyclopedia/tools` - Lista ferramentas
   - `/encyclopedia/:type/:id` - Detalhes de item específico
4. **Frontend Encyclopedia** - Interface completa estilo Pip-Boy
   - Categorização intuitiva (weapons, armor, aid, food, beverages, chems, ammo, perks, magazines, mods, tools)
   - Sistema de busca com debouncing
   - Filtros por nome, tipo, raridade, peso, custo
   - Sistema de favoritos
   - Modal de detalhes por item
   - Responsivo e otimizado (80% x 85% viewport)

### 🚀 Próximos Passos

1. **Implementar funções de cálculo** em TypeScript/backend
2. **Adicionar validations** no Prisma (via @refine ou backend)
3. **Criar views PostgreSQL** para queries comuns
4. **Sistema de combate** - Integrar cálculos de dano com locations
5. **Character creation flow** - Interface completa de criação de personagem

---

## 📚 Referências

- Fallout 2d20 Corebook (páginas de referência por tabela)
- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL JSON Functions: https://www.postgresql.org/docs/current/functions-json.html
