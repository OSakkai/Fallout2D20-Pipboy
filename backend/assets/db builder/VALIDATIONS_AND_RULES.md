# Validações e Regras de Negócio - Fallout 2d20

## 🛡️ Validações de Character Creation

### **Atributos S.P.E.C.I.A.L.**

```typescript
function validateAttributes(attrs: CharacterAttributes, origin: Origin): boolean {
  // Range básico: 4-10
  const values = [
    attrs.strength, attrs.perception, attrs.endurance,
    attrs.charisma, attrs.intelligence, attrs.agility, attrs.luck
  ];
  
  if (values.some(v => v < 4 || v > 10)) {
    throw new Error('Attributes must be between 4-10');
  }
  
  // Soma total: 40 (7 × 5 base + 5 pontos para distribuir)
  const total = values.reduce((sum, v) => sum + v, 0);
  if (total !== 40) {
    throw new Error('Total attribute points must equal 40');
  }
  
  // Origins podem modificar max de certos attributes
  // Ex: Super Mutant pode ter STR até 12
  
  return true;
}
```

### **Skills**

```typescript
function validateSkills(skills: CharacterSkill[]): boolean {
  // Deve ter exatamente 3 tag skills
  const taggedSkills = skills.filter(s => s.isTagged);
  if (taggedSkills.length !== 3) {
    throw new Error('Must have exactly 3 tag skills');
  }
  
  // Tag skills começam em rank 2
  taggedSkills.forEach(s => {
    if (s.rank < 2) {
      throw new Error('Tag skills must start at rank 2');
    }
  });
  
  // Max rank = 6
  if (skills.some(s => s.rank > 6)) {
    throw new Error('Skill rank cannot exceed 6');
  }
  
  // Total de skill points gastos
  const totalPoints = skills.reduce((sum, s) => {
    return sum + (s.rank - (s.isTagged ? 2 : 0));
  }, 0);
  
  const availablePoints = 9 + character.attributes.intelligence;
  if (totalPoints > availablePoints) {
    throw new Error(`Cannot spend more than ${availablePoints} skill points`);
  }
  
  return true;
}
```

### **Perks**

```typescript
interface PerkRequirement {
  level?: number;
  attributes?: Record<string, number>;
  skills?: Record<string, number>;
  perks?: string[];
}

function validatePerkRequirements(
  character: Character,
  perk: PerkMaster
): boolean {
  const reqs: PerkRequirement = perk.requirements as PerkRequirement;
  
  // Level requirement
  if (reqs.level && character.level < reqs.level) {
    throw new Error(`Requires level ${reqs.level}`);
  }
  
  // Attribute requirements
  if (reqs.attributes) {
    Object.entries(reqs.attributes).forEach(([attr, min]) => {
      const value = character.attributes[attr];
      if (value < min) {
        throw new Error(`Requires ${attr} ${min}+`);
      }
    });
  }
  
  // Skill requirements
  if (reqs.skills) {
    Object.entries(reqs.skills).forEach(([skill, min]) => {
      const charSkill = character.skills.find(s => s.skill === skill);
      if (!charSkill || charSkill.rank < min) {
        throw new Error(`Requires ${skill} rank ${min}+`);
      }
    });
  }
  
  // Prerequisite perks
  if (reqs.perks) {
    const hasPerk = (perkName: string) =>
      character.perks.some(p => p.perk.name === perkName);
    
    if (!reqs.perks.every(hasPerk)) {
      throw new Error(`Missing prerequisite perks: ${reqs.perks.join(', ')}`);
    }
  }
  
  return true;
}
```

---

## 📊 Cálculos de Derived Stats

### **Defense**

```typescript
function calculateDefense(character: Character): number {
  let defense = 1; // Base
  
  // +2 para Notable, +4 para Major (em Initiative, não Defense)
  // Defense não muda por tipo
  
  // Perks podem adicionar
  // Ex: "Dodgy" perk adds defense
  
  return defense;
}
```

### **Initiative**

```typescript
function calculateInitiative(
  character: Character,
  activeEffects: ActiveEffect[]
): number {
  let init = character.attributes.perception + character.attributes.agility;
  
  // Type bonuses
  if (character.characterType === 'NOTABLE') {
    init += 2;
  } else if (character.characterType === 'MAJOR') {
    init += 4;
  }
  
  // Active effects
  activeEffects.forEach(effect => {
    if (effect.attributeMods) {
      const mods = effect.attributeMods as any;
      init += (mods.perception || 0) + (mods.agility || 0);
    }
  });
  
  return init;
}
```

### **Melee Damage Bonus**

```typescript
function calculateMeleeDamage(strength: number): number {
  if (strength >= 11) return 3;
  if (strength >= 9) return 2;
  if (strength >= 7) return 1;
  return 0;
}
```

### **Health Points**

```typescript
function calculateMaxHP(
  character: Character,
  activeEffects: ActiveEffect[]
): number {
  const attrs = character.attributes;
  let maxHP = attrs.endurance + attrs.luck + character.level;
  
  // Type bonuses for LCK
  if (character.characterType === 'NOTABLE') {
    maxHP += attrs.luck;
  } else if (character.characterType === 'MAJOR') {
    maxHP += attrs.luck * 2;
  }
  
  // Active effects (ex: Moonshine +2 Max HP)
  activeEffects.forEach(effect => {
    if (effect.name === 'Moonshine') {
      maxHP += 2;
    }
  });
  
  return maxHP;
}
```

### **Carry Weight**

```typescript
function calculateCarryWeight(strength: number): number {
  return strength * 10 + 150;
}

function getCurrentCarryWeight(inventoryItems: InventoryItem[]): number {
  return inventoryItems.reduce((total, item) => {
    // Peso do item base × quantidade
    const baseWeight = getItemWeight(item);
    
    // Adicionar peso dos mods
    const modWeight = item.appliedMods.reduce((sum, modId) => {
      const mod = getModById(modId);
      return sum + mod.weightModifier;
    }, 0);
    
    return total + (baseWeight + modWeight) * item.quantity;
  }, 0);
}
```

### **Luck Points**

```typescript
function calculateMaxLuckPoints(character: Character): number {
  const luck = character.attributes.luck;
  
  switch (character.characterType) {
    case 'NORMAL':
      return 0; // Normal characters don't have Luck Points
    case 'NOTABLE':
      return Math.ceil(luck / 2);
    case 'MAJOR':
      return luck;
  }
}
```

---

## ⚔️ Sistema de Combate

### **Target Number Calculation**

```typescript
function calculateTargetNumber(
  attribute: number,
  skillRank: number,
  activeEffects: ActiveEffect[]
): number {
  let tn = attribute + skillRank;
  
  // Aplicar modificadores de efeitos
  activeEffects.forEach(effect => {
    if (effect.skillMods) {
      const mods = effect.skillMods as any;
      // Adicionar modificador se aplicável
    }
    if (effect.attributeMods) {
      const mods = effect.attributeMods as any;
      // Adicionar modificador se aplicável
    }
  });
  
  return tn;
}
```

### **Damage Calculation**

```typescript
interface DamageResult {
  baseDamage: number;
  finalDamage: number;
  drApplied: number;
  isCritical: boolean;
  effects: string[];
}

function calculateDamage(
  weapon: WeaponMaster,
  weaponMods: ModMaster[],
  attackerStrength: number,
  targetLocation: BodyLocation,
  effectsRolled: number
): DamageResult {
  // 1. Parse base damage (ex: "3CD", "4CD+2")
  const baseDamage = parseDamage(weapon.damage);
  
  // 2. Adicionar melee bonus (se melee)
  let totalDamage = baseDamage;
  if (weapon.weaponType === 'MELEE' || weapon.weaponType === 'UNARMED') {
    totalDamage += calculateMeleeDamage(attackerStrength);
  }
  
  // 3. Aplicar mods
  weaponMods.forEach(mod => {
    if (mod.damageBonus) {
      totalDamage += parseDamage(mod.damageBonus);
    }
  });
  
  // 4. Determinar DR apropriado
  const dr = weapon.damageType === 'PHYSICAL' ? targetLocation.physicalDR :
             weapon.damageType === 'ENERGY' ? targetLocation.energyDR :
             targetLocation.radiationDR;
  
  // 5. Aplicar damage effects
  let effectiveDR = dr;
  weapon.damageEffects.forEach(effect => {
    if (effect.startsWith('Piercing')) {
      const piercingValue = parseInt(effect.split(' ')[1]);
      effectiveDR = Math.max(0, effectiveDR - piercingValue);
    }
  });
  
  // 6. Calcular damage final
  const finalDamage = Math.max(0, totalDamage - effectiveDR);
  
  // 7. Check critical hit
  const isCritical = finalDamage >= 5;
  
  // 8. Processar outros efeitos
  const effects: string[] = [];
  weapon.damageEffects.forEach(effect => {
    if (effect === 'Stun' && effectsRolled > 0) {
      effects.push('STUNNED');
    }
    if (effect === 'Persistent' && effectsRolled > 0) {
      effects.push('PERSISTENT_DAMAGE');
    }
    if (effect === 'Vicious' && isCritical) {
      effects.push('VICIOUS');
    }
  });
  
  return {
    baseDamage,
    finalDamage,
    drApplied: effectiveDR,
    isCritical,
    effects
  };
}
```

### **Hit Location Determination**

```typescript
function determineHitLocation(diceRoll: number): BodyLocationEnum {
  // Para humanos (d20):
  // 1-2: Head
  // 3-8: Torso
  // 9-11: Left Arm
  // 12-14: Right Arm
  // 15-17: Left Leg
  // 18-20: Right Leg
  
  if (diceRoll <= 2) return BodyLocationEnum.HEAD;
  if (diceRoll <= 8) return BodyLocationEnum.TORSO;
  if (diceRoll <= 11) return BodyLocationEnum.LEFT_ARM;
  if (diceRoll <= 14) return BodyLocationEnum.RIGHT_ARM;
  if (diceRoll <= 17) return BodyLocationEnum.LEFT_LEG;
  return BodyLocationEnum.RIGHT_LEG;
}
```

---

## 💊 Sistema de Chems e Addiction

### **Consumir Chem**

```typescript
async function consumeChem(
  characterId: string,
  chemId: string
): Promise<{ effect: ActiveEffect; addictionCheck: boolean }> {
  const chem = await prisma.consumableMaster.findUnique({
    where: { id: chemId }
  });
  
  if (chem.category !== 'CHEM') {
    throw new Error('Not a chem');
  }
  
  // Criar efeito ativo
  const effect = await prisma.activeEffect.create({
    data: {
      characterId,
      effectType: 'CHEM',
      name: chem.name,
      description: chem.effects.join(', '),
      attributeMods: parseChemAttributeMods(chem.effects),
      duration: chem.duration,
      expiresAt: chem.duration ? addTurns(new Date(), chem.duration) : null,
      addictionRating: chem.addictionRating
    }
  });
  
  // Recalcular stats
  await recalculateDerivedStats(characterId);
  
  // Addiction check necessário?
  const needsCheck = chem.addictionRating && chem.addictionRating > 0;
  
  return { effect, addictionCheck: needsCheck };
}
```

### **Addiction Check**

```typescript
function rollAddictionCheck(
  character: Character,
  addictionRating: number
): boolean {
  // END + Survival test vs difficulty = addiction rating
  const tn = character.attributes.endurance + 
             character.skills.find(s => s.skill === 'SURVIVAL')?.rank || 0;
  
  // Roll 2d20
  const successes = rollDice(2, tn);
  
  return successes >= addictionRating;
}
```

---

## 🎯 Level Up System

### **XP Requirements**

```typescript
function getXPRequiredForLevel(level: number): number {
  // Fórmula do Corebook: (Level × (Level - 1) / 2) × 100
  return (level * (level - 1) / 2) * 100;
}

// Level | XP Required
//   1   |     0
//   2   |   100
//   3   |   300
//   4   |   600
//   5   | 1,000
//   6   | 1,500
//  ...  |   ...
//  20   | 19,000
//  21   | 21,000
```

### **Level Up Process**

```typescript
async function levelUp(characterId: string) {
  const char = await prisma.character.findUnique({
    where: { id: characterId },
    include: { derivedStats: true }
  });
  
  const newLevel = char.level + 1;
  
  // 1. Aumentar level
  await prisma.character.update({
    where: { id: characterId },
    data: {
      level: newLevel,
      xpToNext: getXPRequiredForLevel(newLevel + 1)
    }
  });
  
  // 2. +1 HP
  await prisma.derivedStats.update({
    where: { characterId },
    data: {
      maxHP: { increment: 1 },
      currentHP: { increment: 1 }
    }
  });
  
  // 3. Jogador escolhe: +1 skill rank OU 1 perk
  // (implementar UI para escolha)
  
  return {
    newLevel,
    nextLevelXP: getXPRequiredForLevel(newLevel + 1),
    choices: {
      skillPoint: true,
      perkChoice: true
    }
  };
}
```

---

## 🔄 Recálculo de Stats (On-Demand)

```typescript
async function recalculateAllStats(characterId: string) {
  const char = await prisma.character.findUnique({
    where: { id: characterId },
    include: {
      attributes: true,
      skills: true,
      perks: { include: { perk: true } },
      activeEffects: true,
      bodyLocations: true,
      inventory: true
    }
  });
  
  // 1. Aplicar active effects aos atributos
  const modifiedAttrs = applyEffectsToAttributes(
    char.attributes,
    char.activeEffects
  );
  
  // 2. Recalcular derived stats
  const defense = calculateDefense(char);
  const initiative = calculateInitiative(char, char.activeEffects);
  const meleeDamage = calculateMeleeDamage(modifiedAttrs.strength);
  const maxHP = calculateMaxHP(char, char.activeEffects);
  const carryWeightMax = calculateCarryWeight(modifiedAttrs.strength);
  const carryWeightCurrent = getCurrentCarryWeight(char.inventory);
  const maxLuckPoints = calculateMaxLuckPoints(char);
  
  // 3. Atualizar no banco
  await prisma.derivedStats.update({
    where: { characterId },
    data: {
      defense,
      initiative,
      meleeDamage,
      maxHP,
      carryWeightMax,
      carryWeightCurrent,
      maxLuckPoints
    }
  });
  
  // 4. Recalcular DRs das locations (considerando armor equipado)
  for (const location of char.bodyLocations) {
    const equippedArmor = char.inventory.find(
      item => item.isEquipped && item.equippedSlot === location.location
    );
    
    if (equippedArmor) {
      const dr = calculateLocationDR(equippedArmor, location);
      await prisma.bodyLocation.update({
        where: { id: location.id },
        data: dr
      });
    }
  }
}
```

---

## 🛡️ Armor DR Calculation

```typescript
function calculateLocationDR(
  equippedArmor: InventoryItem,
  location: BodyLocation
): { physicalDR: number; energyDR: number; radiationDR: number } {
  // Pegar base armor
  const armor = getArmorMasterById(equippedArmor.itemId);
  
  let physicalDR = armor.physicalDR;
  let energyDR = armor.energyDR;
  let radiationDR = armor.radiationDR;
  
  // Aplicar mods
  equippedArmor.appliedMods.forEach(modId => {
    const mod = getModMasterById(modId);
    
    if (mod.drModifiers) {
      const mods = mod.drModifiers as any;
      physicalDR += mods.physical || 0;
      energyDR += mods.energy || 0;
      radiationDR += mods.radiation || 0;
    }
  });
  
  return { physicalDR, energyDR, radiationDR };
}
```

---

## ✅ Checklist de Validações

### **Character Creation**
- [ ] Atributos entre 4-10
- [ ] Soma de atributos = 40
- [ ] Exatamente 3 tag skills
- [ ] Tag skills começam em rank 2
- [ ] Skill points não exceder INT + 9
- [ ] Primeiro perk válido para level 1

### **Equipment**
- [ ] Peso não exceder carry weight
- [ ] Mods compatíveis com item
- [ ] Slots de mod respeitados
- [ ] Condition entre 0-100%

### **Combat**
- [ ] Damage mínimo = 0
- [ ] HP não pode ser negativo
- [ ] Critical hit = damage >= 5
- [ ] Hit location válido para tipo de criatura

### **Level Up**
- [ ] XP suficiente
- [ ] +1 HP automático
- [ ] Escolha de skill ou perk
- [ ] Perk requirements satisfeitos

### **Session State**
- [ ] AP e Luck não negativos
- [ ] Reset ao iniciar nova sessão
- [ ] Tracking correto por personagem
