# CSV Parser Implementation Guide

## Parser Functions for Each CSV Type

### Weapon Parsers

**meleeWeapon(row)**
```typescript
{
  name: row.name,
  weaponType: mapWeaponType(row), // MELEE or UNARMED
  skill: mapSkill(row.skill),     // MELEE_WEAPONS or UNARMED
  damage: row.damage,              // "3CD", "4CD+2"
  damageEffects: parseArray(row.damageEffects), // ["Piercing 1", "Stun"]
  damageType: 'PHYSICAL',
  fireRate: null,
  range: null,
  ammoType: null,
  qualities: parseArray(row.qualities), // ["Two-Handed", "Parry"]
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  availableModSlots: {},
  corebookPage: parseInt(row.corebookPage || null)
}
```

**rangedWeapon(row)**
```typescript
{
  name: row.name,
  weaponType: mapWeaponType(row), // SMALL_GUN, ENERGY_WEAPON, BIG_GUN
  skill: mapSkill(row.skill),
  damage: row.damage,
  damageEffects: parseArray(row.damageEffects),
  damageType: mapDamageType(row.damageType), // PHYSICAL, ENERGY
  fireRate: parseInt(row.fireRate),
  range: mapRange(row.range), // CLOSE, MEDIUM, LONG
  ammoType: row.ammoType || null,
  qualities: parseArray(row.qualities),
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  availableModSlots: parseJSON(row.availableModSlots || '{}'),
  corebookPage: parseInt(row.corebookPage || null)
}
```

**throwable(row)**
```typescript
{
  name: row.name,
  weaponType: row.isExplosive ? 'EXPLOSIVE' : 'THROWING',
  skill: row.isExplosive ? 'EXPLOSIVES' : 'THROWING',
  damage: row.damage,
  damageEffects: parseArray(row.damageEffects),
  damageType: mapDamageType(row.damageType),
  fireRate: null,
  range: mapRange(row.range),
  ammoType: null,
  qualities: parseArray(row.qualities), // ["Blast", "Thrown (M)", "Mine"]
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  availableModSlots: {},
  corebookPage: parseInt(row.corebookPage || null)
}
```

### Armor Parsers

**armor(row)**
```typescript
{
  name: row.name,
  armorType: mapArmorType(row.type), // LEATHER, METAL, COMBAT, SYNTH, MARINE
  location: mapBodyLocation(row.location), // HEAD, TORSO, etc
  physicalDR: parseInt(row.physicalDR),
  energyDR: parseInt(row.energyDR),
  radiationDR: parseInt(row.radiationDR),
  maxHP: null,
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  allowsMaterialMod: row.allowsMaterialMod !== 'false',
  allowsUtilityMod: row.allowsUtilityMod !== 'false',
  corebookPage: parseInt(row.corebookPage || null)
}
```

**clothing(row)**
```typescript
{
  name: row.name,
  armorType: 'CLOTHING',
  location: mapBodyLocation(row.location),
  physicalDR: parseInt(row.physicalDR || 0),
  energyDR: parseInt(row.energyDR || 0),
  radiationDR: parseInt(row.radiationDR || 0),
  maxHP: null,
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  allowsMaterialMod: true,
  allowsUtilityMod: false,
  corebookPage: parseInt(row.corebookPage || null)
}
```

**dogArmor(row)**
```typescript
{
  name: row.name,
  armorType: 'DOG_ARMOR',
  location: 'TORSO', // Dogs only have torso armor
  physicalDR: parseInt(row.physicalDR),
  energyDR: parseInt(row.energyDR),
  radiationDR: parseInt(row.radiationDR),
  maxHP: null,
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  allowsMaterialMod: false,
  allowsUtilityMod: false,
  corebookPage: parseInt(row.corebookPage || null)
}
```

**powerArmor(row)**
```typescript
{
  name: row.name,
  armorType: 'POWER_ARMOR',
  location: mapBodyLocation(row.location),
  physicalDR: parseInt(row.physicalDR),
  energyDR: parseInt(row.energyDR),
  radiationDR: parseInt(row.radiationDR),
  maxHP: parseInt(row.maxHP), // Power armor has HP
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  allowsMaterialMod: false,
  allowsUtilityMod: false,
  corebookPage: parseInt(row.corebookPage || null)
}
```

**robotArmor(row)**
```typescript
{
  name: row.name,
  armorType: 'ROBOT_ARMOR',
  location: mapRobotLocation(row.location), // OPTICS, MAIN_BODY, ARM_1, etc
  physicalDR: parseInt(row.physicalDR),
  energyDR: parseInt(row.energyDR),
  radiationDR: parseInt(row.radiationDR),
  maxHP: parseInt(row.maxHP || null),
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  allowsMaterialMod: false,
  allowsUtilityMod: false,
  corebookPage: parseInt(row.corebookPage || null)
}
```

### Consumable Parsers

**beverage(row)**
```typescript
{
  name: row.name,
  category: 'BEVERAGE',
  hpHealed: parseInt(row.hpHealed || 0),
  effects: parseArray(row.effects),
  radiationDice: row.radiationDice || null,
  addictionRating: parseInt(row.addictionRating || null),
  duration: null,
  isAlcoholic: row.isAlcoholic === 'true' || row.effects?.includes('Alcoholic'),
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  corebookPage: parseInt(row.corebookPage || null)
}
```

**food(row)**
```typescript
{
  name: row.name,
  category: 'FOOD',
  hpHealed: parseInt(row.hpHealed || 0),
  effects: parseArray(row.effects),
  radiationDice: row.radiationDice || null,
  addictionRating: null,
  duration: null,
  isAlcoholic: false,
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  corebookPage: parseInt(row.corebookPage || null)
}
```

**chem(row)**
```typescript
{
  name: row.name,
  category: 'CHEM',
  hpHealed: parseInt(row.hpHealed || 0),
  effects: parseArray(row.effects),
  radiationDice: null,
  addictionRating: parseInt(row.addictionRating || null),
  duration: parseInt(row.duration || null), // in turns
  isAlcoholic: false,
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  corebookPage: parseInt(row.corebookPage || null)
}
```

### Mod Parsers

**weaponMod(row)**
```typescript
{
  name: row.name,
  modType: 'WEAPON_MOD',
  modSlot: row.modSlot, // "receiver", "barrel", "grip", "sight", "magazine"
  applicableTo: parseArray(row.applicableTo), // ["10mm Pistol", "Combat Rifle"]
  effects: parseArray(row.effects),
  drModifiers: null,
  damageBonus: row.damageBonus || null,
  requirements: parseArray(row.requirements), // ["Gun Nut 1", "Science! 2"]
  weight: parseFloat(row.weight || 0),
  weightModifier: parseFloat(row.weightModifier || 0),
  cost: parseInt(row.cost),
  corebookPage: parseInt(row.corebookPage || null)
}
```

**armorMod(row)**
```typescript
{
  name: row.name,
  modType: 'ARMOR_MOD',
  modSlot: row.modSlot, // "material" or "utility"
  applicableTo: parseArray(row.applicableTo), // ["ALL_LOCATIONS", "TORSO", "ARMS"]
  effects: parseArray(row.effects),
  drModifiers: parseJSON(row.drModifiers), // {physical: 1, energy: 1}
  damageBonus: row.damageBonus || null,
  requirements: parseArray(row.requirements),
  weight: parseFloat(row.weight || 0),
  weightModifier: parseFloat(row.weightModifier || 0),
  cost: parseInt(row.cost),
  corebookPage: parseInt(row.corebookPage || null)
}
```

**clothingMod(row)**
```typescript
{
  name: row.name,
  modType: 'CLOTHING_MOD',
  modSlot: row.modSlot || 'lining',
  applicableTo: parseArray(row.applicableTo),
  effects: parseArray(row.effects),
  drModifiers: parseJSON(row.drModifiers || null),
  damageBonus: null,
  requirements: parseArray(row.requirements),
  weight: parseFloat(row.weight || 0),
  weightModifier: parseFloat(row.weightModifier || 0),
  cost: parseInt(row.cost),
  corebookPage: parseInt(row.corebookPage || null)
}
```

**powerArmorMod(row)**
```typescript
{
  name: row.name,
  modType: 'POWER_ARMOR_MOD',
  modSlot: row.modSlot, // "utility" or specific slots
  applicableTo: parseArray(row.applicableTo),
  effects: parseArray(row.effects),
  drModifiers: parseJSON(row.drModifiers || null),
  damageBonus: null,
  requirements: parseArray(row.requirements),
  weight: parseFloat(row.weight || 0),
  weightModifier: parseFloat(row.weightModifier || 0),
  cost: parseInt(row.cost),
  corebookPage: parseInt(row.corebookPage || null)
}
```

**powerArmorPlating(row)**
```typescript
{
  name: row.name,
  modType: 'POWER_ARMOR_MOD',
  modSlot: 'material',
  applicableTo: parseArray(row.applicableTo),
  effects: parseArray(row.effects),
  drModifiers: parseJSON(row.drModifiers), // Main feature of plating
  damageBonus: null,
  requirements: parseArray(row.requirements),
  weight: parseFloat(row.weight || 0),
  weightModifier: parseFloat(row.weightModifier || 0),
  cost: parseInt(row.cost),
  corebookPage: parseInt(row.corebookPage || null)
}
```

**robotModule(row)**
```typescript
{
  name: row.name,
  modType: 'ROBOT_MOD',
  modSlot: row.modSlot || 'internal',
  applicableTo: ['ROBOTS'],
  effects: parseArray(row.effects),
  drModifiers: parseJSON(row.drModifiers || null),
  damageBonus: row.damageBonus || null,
  requirements: parseArray(row.requirements),
  weight: parseFloat(row.weight || 0),
  weightModifier: parseFloat(row.weightModifier || 0),
  cost: parseInt(row.cost),
  corebookPage: parseInt(row.corebookPage || null)
}
```

### Other Parsers

**ammo(row)**
```typescript
{
  name: row.name,
  ammoType: row.ammoType, // "10mm", ".308", "Fusion Cell", "5.56mm"
  damageBonus: row.damageBonus, // "+2CD", "+3CD"
  baseQuantity: parseInt(row.baseQuantity || 6),
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  corebookPage: parseInt(row.corebookPage || null)
}
```

**syringerAmmo(row)**
```typescript
{
  name: row.name,
  ammoType: 'Syringer',
  damageBonus: row.damageBonus || '0CD',
  baseQuantity: parseInt(row.baseQuantity || 1),
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  corebookPage: parseInt(row.corebookPage || null)
}
```

**magazine(row)**
```typescript
{
  name: row.name,
  rollRange: row.rollRange, // "1", "2-3", "8", "17-19"
  hasIssues: row.hasIssues === 'true',
  perkGranted: row.perkGranted,
  perkDescription: row.perkDescription,
  corebookPage: parseInt(row.corebookPage || null)
}
```

**magazineIssue(row)**
```typescript
{
  magazineId: await findMagazineId(row.magazineName),
  issueNumber: parseInt(row.issueNumber),
  perkName: row.perkName,
  perkEffect: row.perkEffect
}

async function findMagazineId(name: string): Promise<string> {
  const magazine = await prisma.magazineMaster.findUnique({
    where: { name }
  });
  return magazine.id;
}
```

**perk(row)**
```typescript
{
  name: row.name,
  ranks: parseInt(row.ranks || 1),
  requirements: parseJSON(row.requirements), // {level: 1, strength: 7, perks: ["Strong Back"]}
  condition: row.condition,
  benefit: row.benefit,
  mechanicalEffects: parseJSON(row.mechanicalEffects || null),
  corebookPage: parseInt(row.corebookPage || null)
}
```

**tool(row)**
```typescript
{
  name: row.name,
  category: row.category, // "Crafting", "Lockpicking", "Medical", etc
  effect: row.effect,
  weight: parseFloat(row.weight),
  cost: parseInt(row.cost),
  rarity: parseInt(row.rarity || 0),
  corebookPage: parseInt(row.corebookPage || null)
}
```

---

## Helper Functions

### Mappers

```typescript
function mapWeaponType(row: any): WeaponType {
  const type = row.weaponType?.toUpperCase() || row.type?.toUpperCase();
  
  // Small guns
  if (type?.includes('PISTOL') || type?.includes('RIFLE') || type?.includes('SHOTGUN')) {
    return 'SMALL_GUN';
  }
  
  // Energy weapons
  if (type?.includes('LASER') || type?.includes('PLASMA') || type?.includes('ENERGY')) {
    return 'ENERGY_WEAPON';
  }
  
  // Big guns
  if (type?.includes('MINIGUN') || type?.includes('LAUNCHER') || type?.includes('GATLING')) {
    return 'BIG_GUN';
  }
  
  // Explosives
  if (type?.includes('GRENADE') || type?.includes('MINE') || type?.includes('EXPLOSIVE')) {
    return 'EXPLOSIVE';
  }
  
  // Throwing
  if (type?.includes('THROWING') || type?.includes('THROWN')) {
    return 'THROWING';
  }
  
  // Melee
  if (type?.includes('MELEE')) {
    return 'MELEE';
  }
  
  // Unarmed
  if (type?.includes('UNARMED')) {
    return 'UNARMED';
  }
  
  // Default fallback
  return 'MELEE';
}

function mapSkill(skillName: string): Skill {
  const normalized = skillName?.toUpperCase().replace(/\s+/g, '_');
  
  const mapping: Record<string, Skill> = {
    'SMALL_GUNS': 'SMALL_GUNS',
    'ENERGY_WEAPONS': 'ENERGY_WEAPONS',
    'BIG_GUNS': 'BIG_GUNS',
    'MELEE_WEAPONS': 'MELEE_WEAPONS',
    'MELEE': 'MELEE_WEAPONS',
    'UNARMED': 'UNARMED',
    'THROWING': 'THROWING',
    'EXPLOSIVES': 'EXPLOSIVES'
  };
  
  return mapping[normalized] || 'MELEE_WEAPONS';
}

function mapDamageType(type: string): DamageType {
  const normalized = type?.toUpperCase();
  
  if (normalized?.includes('ENERGY') || normalized?.includes('LASER') || normalized?.includes('PLASMA')) {
    return 'ENERGY';
  }
  if (normalized?.includes('RADIATION') || normalized?.includes('RAD')) {
    return 'RADIATION';
  }
  if (normalized?.includes('POISON')) {
    return 'POISON';
  }
  return 'PHYSICAL';
}

function mapRange(range: string): WeaponRange | null {
  if (!range) return null;
  
  const normalized = range.toUpperCase();
  
  if (normalized.includes('CLOSE') || normalized === 'C') {
    return 'CLOSE';
  }
  if (normalized.includes('MEDIUM') || normalized === 'M') {
    return 'MEDIUM';
  }
  if (normalized.includes('LONG') || normalized === 'L') {
    return 'LONG';
  }
  
  return null;
}

function mapBodyLocation(location: string): BodyLocationEnum {
  const normalized = location?.toUpperCase().replace(/\s+/g, '_');
  
  const mapping: Record<string, BodyLocationEnum> = {
    'HEAD': 'HEAD',
    'LEFT_ARM': 'LEFT_ARM',
    'RIGHT_ARM': 'RIGHT_ARM',
    'TORSO': 'TORSO',
    'LEFT_LEG': 'LEFT_LEG',
    'RIGHT_LEG': 'RIGHT_LEG',
    'OPTICS': 'OPTICS',
    'MAIN_BODY': 'MAIN_BODY',
    'ARM_1': 'ARM_1',
    'ARM_2': 'ARM_2',
    'ARM_3': 'ARM_3',
    'THRUSTER': 'THRUSTER'
  };
  
  return mapping[normalized] || 'TORSO';
}

function mapArmorType(type: string): ArmorType {
  const normalized = type?.toUpperCase();
  
  if (normalized?.includes('LEATHER')) return 'LEATHER';
  if (normalized?.includes('METAL')) return 'METAL';
  if (normalized?.includes('COMBAT')) return 'COMBAT';
  if (normalized?.includes('SYNTH')) return 'SYNTH';
  if (normalized?.includes('MARINE')) return 'MARINE';
  if (normalized?.includes('POWER')) return 'POWER_ARMOR';
  if (normalized?.includes('CLOTHING')) return 'CLOTHING';
  if (normalized?.includes('DOG')) return 'DOG_ARMOR';
  if (normalized?.includes('ROBOT')) return 'ROBOT_ARMOR';
  
  return 'CLOTHING';
}
```

### Parsers

```typescript
function parseArray(value: string | string[]): string[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  
  // Handle comma-separated strings
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }
  
  return [];
}

function parseJSON(value: string | object | null): any {
  if (!value) return null;
  if (typeof value === 'object') return value;
  
  try {
    return JSON.parse(value);
  } catch (e) {
    console.warn('Failed to parse JSON:', value);
    return null;
  }
}
```

---

## Import Order

Import CSVs in this order to respect dependencies:

1. **Independent tables** (no dependencies):
   - weapon_master
   - armor_master
   - consumable_master
   - mod_master
   - ammo_master
   - tool_master
   - perk_master

2. **Dependent tables**:
   - magazine_master (first)
   - magazine_issue_master (after magazines, needs magazineId FK)

---

## Error Handling

```typescript
async function importCSVSafely(filepath: string, parser: Function, model: string) {
  const rows = parseCSV(filepath);
  let successCount = 0;
  let errorCount = 0;
  
  for (const row of rows) {
    try {
      const data = parser(row);
      
      await prisma[model].upsert({
        where: { name: data.name },
        update: {},
        create: data
      });
      
      successCount++;
    } catch (error) {
      console.error(`Error importing ${row.name}:`, error);
      errorCount++;
    }
  }
  
  console.log(`${model}: ${successCount} imported, ${errorCount} errors`);
}
```
