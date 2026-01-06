# Exemplos de Uso - Fallout 2d20 Database

## 🎮 Fluxos Completos de Uso

### **1. Criar Personagem**

```typescript
async function createCharacter(
  userId: string,
  campaignId: string,
  data: CharacterCreationData
) {
  // 1. Criar personagem base
  const character = await prisma.character.create({
    data: {
      userId,
      campaignId,
      name: data.name,
      origin: data.origin,
      level: 1,
      xpEarned: 0,
      xpToNext: 100
    }
  });
  
  // 2. Criar atributos S.P.E.C.I.A.L.
  await prisma.characterAttributes.create({
    data: {
      characterId: character.id,
      strength: data.attributes.strength,
      perception: data.attributes.perception,
      endurance: data.attributes.endurance,
      charisma: data.attributes.charisma,
      intelligence: data.attributes.intelligence,
      agility: data.attributes.agility,
      luck: data.attributes.luck
    }
  });
  
  // 3. Criar skills (17 skills)
  const skills = ALL_SKILLS.map(skill => ({
    characterId: character.id,
    skill: skill,
    rank: data.taggedSkills.includes(skill) ? 2 : 0,
    isTagged: data.taggedSkills.includes(skill)
  }));
  
  await prisma.characterSkill.createMany({
    data: skills
  });
  
  // 4. Adicionar primeiro perk
  await prisma.characterPerk.create({
    data: {
      characterId: character.id,
      perkId: data.firstPerkId,
      rank: 1,
      acquiredAtLevel: 1
    }
  });
  
  // 5. Calcular e criar derived stats
  const derivedStats = calculateInitialDerivedStats(character, data.attributes);
  await prisma.derivedStats.create({
    data: {
      characterId: character.id,
      ...derivedStats
    }
  });
  
  // 6. Criar body locations (6 para humanos)
  const locations = [
    { location: 'HEAD', diceRange: '1-2', maxHP: 5 },
    { location: 'TORSO', diceRange: '3-8', maxHP: 10 },
    { location: 'LEFT_ARM', diceRange: '9-11', maxHP: 5 },
    { location: 'RIGHT_ARM', diceRange: '12-14', maxHP: 5 },
    { location: 'LEFT_LEG', diceRange: '15-17', maxHP: 5 },
    { location: 'RIGHT_LEG', diceRange: '18-20', maxHP: 5 }
  ];
  
  await prisma.bodyLocation.createMany({
    data: locations.map(loc => ({
      characterId: character.id,
      ...loc,
      currentHP: loc.maxHP,
      physicalDR: 0,
      energyDR: 0,
      radiationDR: 0
    }))
  });
  
  // 7. Adicionar equipamento inicial baseado na origin
  await addStartingEquipment(character.id, data.origin, data.taggedSkills);
  
  return character;
}
```

---

### **2. Sistema de Combate - Ataque Completo**

```typescript
async function performAttack(
  attackerId: string,
  targetId: string,
  weaponItemId: string,
  targetLocationRoll: number,
  successLevel: number, // Número de sucessos no teste
  effectsRolled: number  // Effects rolados nos damage dice
) {
  // 1. Buscar atacante e arma
  const attacker = await prisma.character.findUnique({
    where: { id: attackerId },
    include: {
      attributes: true,
      derivedStats: true
    }
  });
  
  const weaponItem = await prisma.inventoryItem.findUnique({
    where: { id: weaponItemId },
    include: {
      // Precisamos juntar com WeaponMaster manualmente
    }
  });
  
  // 2. Buscar dados da arma no master
  const weapon = await prisma.weaponMaster.findUnique({
    where: { id: weaponItem.itemId }
  });
  
  // 3. Buscar mods aplicados
  const mods = await prisma.modMaster.findMany({
    where: {
      id: { in: weaponItem.appliedMods }
    }
  });
  
  // 4. Calcular dano base
  let baseDamage = parseDamageString(weapon.damage); // "3CD" = 3
  
  // Adicionar melee bonus se aplicável
  if (weapon.weaponType === 'MELEE' || weapon.weaponType === 'UNARMED') {
    baseDamage += attacker.derivedStats.meleeDamage;
  }
  
  // Adicionar mods
  mods.forEach(mod => {
    if (mod.damageBonus) {
      baseDamage += parseDamageString(mod.damageBonus);
    }
  });
  
  // 5. Determinar location atingida
  const targetLocation = determineHitLocation(targetLocationRoll);
  
  // 6. Buscar DR da location
  const location = await prisma.bodyLocation.findUnique({
    where: {
      characterId_location: {
        characterId: targetId,
        location: targetLocation
      }
    }
  });
  
  // 7. Selecionar DR apropriado
  let dr = 0;
  switch (weapon.damageType) {
    case 'PHYSICAL':
      dr = location.physicalDR;
      break;
    case 'ENERGY':
      dr = location.energyDR;
      break;
    case 'RADIATION':
      dr = location.radiationDR;
      break;
  }
  
  // 8. Aplicar Piercing
  weapon.damageEffects.forEach(effect => {
    if (effect.startsWith('Piercing')) {
      const piercingValue = parseInt(effect.split(' ')[1]);
      dr = Math.max(0, dr - piercingValue);
    }
  });
  
  // 9. Calcular damage final
  const finalDamage = Math.max(0, baseDamage - dr);
  
  // 10. Aplicar dano
  const newHP = Math.max(0, location.currentHP - finalDamage);
  
  await prisma.bodyLocation.update({
    where: { id: location.id },
    data: { currentHP: newHP }
  });
  
  // 11. Check critical hit
  const isCritical = finalDamage >= 5;
  
  // 12. Processar efeitos especiais
  const effects = [];
  
  if (isCritical) {
    effects.push('CRITICAL_HIT');
  }
  
  weapon.damageEffects.forEach(effect => {
    if (effect === 'Stun' && effectsRolled > 0) {
      // Aplicar Stun
      await prisma.activeEffect.create({
        data: {
          characterId: targetId,
          effectType: 'OTHER',
          name: 'Stunned',
          description: `Stunned for ${effectsRolled} rounds`,
          duration: effectsRolled
        }
      });
      effects.push('STUNNED');
    }
    
    if (effect === 'Persistent' && effectsRolled > 0) {
      // Aplicar Persistent Damage
      await prisma.activeEffect.create({
        data: {
          characterId: targetId,
          effectType: 'OTHER',
          name: 'Persistent Damage',
          description: `Takes ${effectsRolled}CD damage per turn`,
          duration: null // Até ser apagado
        }
      });
      effects.push('PERSISTENT_DAMAGE');
    }
  });
  
  // 13. Check injury (location HP = 0)
  if (newHP === 0) {
    await applyInjury(targetId, targetLocation);
    effects.push('INJURY');
  }
  
  return {
    baseDamage,
    finalDamage,
    drApplied: dr,
    isCritical,
    targetLocation,
    newHP,
    effects,
    log: `${attacker.name} deals ${finalDamage} ${weapon.damageType} damage to ${targetLocation}`
  };
}
```

---

### **3. Usar Chem**

```typescript
async function useChem(
  characterId: string,
  chemItemId: string
) {
  // 1. Buscar item no inventory
  const item = await prisma.inventoryItem.findUnique({
    where: { id: chemItemId }
  });
  
  if (item.quantity < 1) {
    throw new Error('No chem available');
  }
  
  // 2. Buscar dados do chem
  const chem = await prisma.consumableMaster.findUnique({
    where: { id: item.itemId }
  });
  
  if (chem.category !== 'CHEM') {
    throw new Error('Not a chem');
  }
  
  // 3. Consumir item
  if (item.quantity === 1) {
    await prisma.inventoryItem.delete({
      where: { id: chemItemId }
    });
  } else {
    await prisma.inventoryItem.update({
      where: { id: chemItemId },
      data: { quantity: { decrement: 1 } }
    });
  }
  
  // 4. Parsear efeitos do chem
  const attributeMods = {};
  const skillMods = {};
  
  chem.effects.forEach(effect => {
    // Ex: "Reroll 1d20 on STR tests" -> {strength: reroll}
    // Ex: "+2 to all damage resistances" -> drMods
    // Precisaria parser específico por efeito
  });
  
  // 5. Criar efeito ativo
  const activeEffect = await prisma.activeEffect.create({
    data: {
      characterId,
      effectType: 'CHEM',
      name: chem.name,
      description: chem.effects.join(', '),
      attributeMods,
      skillMods,
      duration: chem.duration,
      expiresAt: chem.duration ? addTurns(new Date(), chem.duration) : null,
      addictionRating: chem.addictionRating
    }
  });
  
  // 6. Recalcular stats
  await recalculateDerivedStats(characterId);
  
  // 7. Check addiction se necessário
  let addicted = false;
  if (chem.addictionRating && chem.addictionRating > 0) {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: {
        attributes: true,
        skills: true
      }
    });
    
    addicted = !rollAddictionCheck(character, chem.addictionRating);
    
    if (addicted) {
      // Criar efeito de addiction permanente
      await prisma.activeEffect.create({
        data: {
          characterId,
          effectType: 'OTHER',
          name: `${chem.name} Addiction`,
          description: 'Addicted - requires treatment',
          duration: null,
          attributeMods: { /* penalties */ }
        }
      });
    }
  }
  
  return {
    consumed: true,
    effect: activeEffect,
    addicted,
    message: `Used ${chem.name}. ${addicted ? 'ADDICTED!' : ''}`
  };
}
```

---

### **4. Equipar Item com Mods**

```typescript
async function equipItem(
  characterId: string,
  itemId: string,
  slot: string // "head", "torso", etc
) {
  // 1. Desequipar item atual no slot
  await prisma.inventoryItem.updateMany({
    where: {
      characterId,
      equippedSlot: slot
    },
    data: {
      isEquipped: false,
      equippedSlot: null
    }
  });
  
  // 2. Equipar novo item
  const item = await prisma.inventoryItem.update({
    where: { id: itemId },
    data: {
      isEquipped: true,
      equippedSlot: slot
    }
  });
  
  // 3. Se for armor, recalcular DR da location
  if (item.itemType === 'ARMOR') {
    const armor = await prisma.armorMaster.findUnique({
      where: { id: item.itemId }
    });
    
    const mods = await prisma.modMaster.findMany({
      where: { id: { in: item.appliedMods } }
    });
    
    // Calcular DR total
    let physicalDR = armor.physicalDR;
    let energyDR = armor.energyDR;
    let radiationDR = armor.radiationDR;
    
    mods.forEach(mod => {
      if (mod.drModifiers) {
        const drMods = mod.drModifiers as any;
        physicalDR += drMods.physical || 0;
        energyDR += drMods.energy || 0;
        radiationDR += drMods.radiation || 0;
      }
    });
    
    // Atualizar location
    const location = mapSlotToLocation(slot); // "head" -> "HEAD"
    
    await prisma.bodyLocation.updateMany({
      where: {
        characterId,
        location
      },
      data: {
        physicalDR,
        energyDR,
        radiationDR
      }
    });
  }
  
  // 4. Recalcular carry weight
  await updateCarryWeight(characterId);
  
  return { equipped: true, slot, item };
}
```

---

### **5. Level Up com Escolha**

```typescript
async function levelUpCharacter(
  characterId: string,
  choice: 'skill' | 'perk',
  skillToIncrease?: Skill,
  perkToAcquire?: string
) {
  const char = await prisma.character.findUnique({
    where: { id: characterId },
    include: {
      derivedStats: true,
      skills: true
    }
  });
  
  // 1. Verificar XP suficiente
  const requiredXP = calculateXPRequired(char.level + 1);
  if (char.xpEarned < requiredXP) {
    throw new Error('Insufficient XP');
  }
  
  const newLevel = char.level + 1;
  
  // 2. Aumentar level
  await prisma.character.update({
    where: { id: characterId },
    data: {
      level: newLevel,
      xpToNext: calculateXPRequired(newLevel + 1)
    }
  });
  
  // 3. +1 HP
  await prisma.derivedStats.update({
    where: { characterId },
    data: {
      maxHP: { increment: 1 },
      currentHP: { increment: 1 }
    }
  });
  
  // 4. Aplicar escolha do jogador
  if (choice === 'skill') {
    if (!skillToIncrease) {
      throw new Error('Must specify skill to increase');
    }
    
    const skill = char.skills.find(s => s.skill === skillToIncrease);
    
    if (skill.rank >= 6) {
      throw new Error('Skill already at max rank');
    }
    
    await prisma.characterSkill.update({
      where: { id: skill.id },
      data: { rank: { increment: 1 } }
    });
    
    return {
      leveledUp: true,
      newLevel,
      skillIncreased: skillToIncrease,
      newRank: skill.rank + 1
    };
    
  } else if (choice === 'perk') {
    if (!perkToAcquire) {
      throw new Error('Must specify perk to acquire');
    }
    
    const perk = await prisma.perkMaster.findUnique({
      where: { id: perkToAcquire }
    });
    
    // Validar requirements
    validatePerkRequirements(char, perk);
    
    // Adicionar perk
    await prisma.characterPerk.create({
      data: {
        characterId,
        perkId: perkToAcquire,
        rank: 1,
        acquiredAtLevel: newLevel
      }
    });
    
    return {
      leveledUp: true,
      newLevel,
      perkAcquired: perk.name
    };
  }
}
```

---

### **6. Iniciar Nova Sessão**

```typescript
async function startNewSession(
  campaignId: string,
  gmNotes?: string
) {
  // 1. Pegar última sessão para incrementar número
  const lastSession = await prisma.session.findFirst({
    where: { campaignId },
    orderBy: { sessionNumber: 'desc' }
  });
  
  const sessionNumber = (lastSession?.sessionNumber || 0) + 1;
  
  // 2. Criar sessão
  const session = await prisma.session.create({
    data: {
      campaignId,
      sessionNumber,
      notes: gmNotes
    }
  });
  
  // 3. Criar session states para todos os personagens da campanha
  const characters = await prisma.character.findMany({
    where: { campaignId },
    include: { derivedStats: true }
  });
  
  const sessionStates = characters.map(char => ({
    sessionId: session.id,
    characterId: char.id,
    currentAP: 0,
    currentLuck: char.derivedStats.maxLuckPoints
  }));
  
  await prisma.sessionState.createMany({
    data: sessionStates
  });
  
  // 4. Limpar efeitos temporários expirados
  await prisma.activeEffect.deleteMany({
    where: {
      expiresAt: { lte: new Date() }
    }
  });
  
  return {
    session,
    charactersInitialized: characters.length
  };
}
```

---

### **7. Adicionar XP e Auto Level Up**

```typescript
async function awardXP(
  characterId: string,
  xpAmount: number
) {
  const char = await prisma.character.findUnique({
    where: { id: characterId }
  });
  
  const newXP = char.xpEarned + xpAmount;
  
  await prisma.character.update({
    where: { id: characterId },
    data: { xpEarned: newXP }
  });
  
  // Check level up automático
  let levelsGained = 0;
  let currentLevel = char.level;
  let currentXP = newXP;
  
  while (currentXP >= calculateXPRequired(currentLevel + 1)) {
    currentLevel++;
    levelsGained++;
  }
  
  if (levelsGained > 0) {
    // Auto level up
    await prisma.character.update({
      where: { id: characterId },
      data: {
        level: currentLevel,
        xpToNext: calculateXPRequired(currentLevel + 1)
      }
    });
    
    // +HP por level
    await prisma.derivedStats.update({
      where: { characterId },
      data: {
        maxHP: { increment: levelsGained },
        currentHP: { increment: levelsGained }
      }
    });
    
    return {
      xpAwarded: xpAmount,
      newTotalXP: newXP,
      leveledUp: true,
      levelsGained,
      newLevel: currentLevel,
      pendingChoices: levelsGained // Jogador precisa escolher skill ou perk
    };
  }
  
  return {
    xpAwarded: xpAmount,
    newTotalXP: newXP,
    leveledUp: false
  };
}
```

---

## 📊 Queries Úteis

### **Get Character Sheet Completo**

```typescript
const characterSheet = await prisma.character.findUnique({
  where: { id: characterId },
  include: {
    attributes: true,
    skills: {
      orderBy: { skill: 'asc' }
    },
    derivedStats: true,
    bodyLocations: {
      orderBy: { location: 'asc' }
    },
    perks: {
      include: { perk: true },
      orderBy: { acquiredAtLevel: 'asc' }
    },
    inventory: {
      orderBy: { itemType: 'asc' }
    },
    activeEffects: {
      where: {
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    }
  }
});
```

### **Get Weapons do Personagem**

```typescript
const weapons = await prisma.inventoryItem.findMany({
  where: {
    characterId,
    itemType: {
      in: ['WEAPON_RANGED', 'WEAPON_MELEE']
    }
  }
});

// Para cada weapon, buscar dados no master
const weaponsWithData = await Promise.all(
  weapons.map(async (item) => {
    const master = await prisma.weaponMaster.findUnique({
      where: { id: item.itemId }
    });
    
    const mods = await prisma.modMaster.findMany({
      where: { id: { in: item.appliedMods } }
    });
    
    return {
      ...item,
      weapon: master,
      mods
    };
  })
);
```

### **Get Initiative Order**

```typescript
const characters = await prisma.character.findMany({
  where: { campaignId },
  include: {
    derivedStats: true
  },
  orderBy: {
    derivedStats: {
      initiative: 'desc'
    }
  }
});
```

---

## 🔧 Funções Utilitárias

```typescript
function parseDamageString(damage: string): number {
  // "3CD" -> 3
  // "4CD+2" -> 6
  const match = damage.match(/(\d+)CD(\+\d+)?/);
  const base = parseInt(match[1]);
  const bonus = match[2] ? parseInt(match[2]) : 0;
  return base + bonus;
}

function addTurns(date: Date, turns: number): Date {
  // Assumindo 1 turno = 6 segundos
  const seconds = turns * 6;
  return new Date(date.getTime() + seconds * 1000);
}

function mapSlotToLocation(slot: string): BodyLocationEnum {
  const map = {
    'head': BodyLocationEnum.HEAD,
    'torso': BodyLocationEnum.TORSO,
    'left_arm': BodyLocationEnum.LEFT_ARM,
    'right_arm': BodyLocationEnum.RIGHT_ARM,
    'left_leg': BodyLocationEnum.LEFT_LEG,
    'right_leg': BodyLocationEnum.RIGHT_LEG
  };
  return map[slot];
}
```
