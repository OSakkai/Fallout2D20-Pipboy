import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function parseCSV(filePath: string): any[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row: any = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    rows.push(row);
  }

  return rows;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseArray(value: string | string[]): string[] {
  if (Array.isArray(value)) return value;
  if (!value) return [];

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

function safeParseInt(value: any, defaultValue: number | null = 0): number | null {
  if (value === null || value === undefined || value === '') return defaultValue;

  // Handle special values like "–" or "-"
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '–' || trimmed === '-') return defaultValue;
  }

  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

function safeParseFloat(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') return defaultValue;

  // Handle special values like "<1" or "–"
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '–' || trimmed === '-') return defaultValue;
    if (trimmed.startsWith('<')) {
      const num = parseFloat(trimmed.substring(1));
      return isNaN(num) ? defaultValue : num * 0.5; // <1 becomes 0.5
    }
  }

  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// ============================================================================
// MAPPING FUNCTIONS
// ============================================================================

function mapWeaponType(row: any): string {
  const type = row.weaponType?.toUpperCase() || row.type?.toUpperCase() || '';

  if (type.includes('PISTOL') || type.includes('RIFLE') || type.includes('SHOTGUN')) {
    return 'SMALL_GUN';
  }
  if (type.includes('LASER') || type.includes('PLASMA') || type.includes('ENERGY')) {
    return 'ENERGY_WEAPON';
  }
  if (type.includes('MINIGUN') || type.includes('LAUNCHER') || type.includes('GATLING')) {
    return 'BIG_GUN';
  }
  if (type.includes('GRENADE') || type.includes('MINE') || type.includes('EXPLOSIVE')) {
    return 'EXPLOSIVE';
  }
  if (type.includes('THROWING') || type.includes('THROWN')) {
    return 'THROWING';
  }
  if (type.includes('MELEE')) {
    return 'MELEE';
  }
  if (type.includes('UNARMED')) {
    return 'UNARMED';
  }

  return 'MELEE';
}

function mapSkill(skillName: string): string {
  if (!skillName) return 'MELEE_WEAPONS';

  const normalized = skillName.toUpperCase().replace(/\s+/g, '_');

  const mapping: Record<string, string> = {
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

function mapDamageType(type: string): string {
  if (!type) return 'PHYSICAL';

  const normalized = type.toUpperCase();

  if (normalized.includes('ENERGY') || normalized.includes('LASER') || normalized.includes('PLASMA')) {
    return 'ENERGY';
  }
  if (normalized.includes('RADIATION') || normalized.includes('RAD')) {
    return 'RADIATION';
  }
  if (normalized.includes('POISON')) {
    return 'POISON';
  }
  return 'PHYSICAL';
}

function mapRange(range: string): string | null {
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

function mapBodyLocation(location: string): string {
  if (!location) return 'TORSO';

  const normalized = location.toUpperCase().replace(/\s+/g, '_');

  const mapping: Record<string, string> = {
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

function mapArmorType(type: string): string {
  if (!type) return 'CLOTHING';

  const normalized = type.toUpperCase();

  if (normalized.includes('LEATHER')) return 'LEATHER';
  if (normalized.includes('METAL')) return 'METAL';
  if (normalized.includes('COMBAT')) return 'COMBAT';
  if (normalized.includes('SYNTH')) return 'SYNTH';
  if (normalized.includes('MARINE')) return 'MARINE';
  if (normalized.includes('POWER')) return 'POWER_ARMOR';
  if (normalized.includes('CLOTHING')) return 'CLOTHING';
  if (normalized.includes('DOG')) return 'DOG_ARMOR';
  if (normalized.includes('ROBOT')) return 'ROBOT_ARMOR';

  return 'CLOTHING';
}

// ============================================================================
// PARSER FUNCTIONS
// ============================================================================

function parseMeleeWeapon(row: any): any {
  const weaponTypeStr = row['WEAPON TYPE'] || row.weaponType || '';
  return {
    name: row['MELEE WEAPON'] || row.name,
    weaponType: weaponTypeStr.toUpperCase().includes('UNARMED') ? 'UNARMED' : 'MELEE',
    skill: weaponTypeStr.toUpperCase().includes('UNARMED') ? 'UNARMED' : 'MELEE_WEAPONS',
    damage: row['DAMAGE RATING'] || row.damage || '0CD',
    damageEffects: parseArray(row['DAMAGE EFFECTS'] || row.damageEffects || ''),
    damageType: 'PHYSICAL',
    fireRate: null,
    range: null,
    ammoType: null,
    qualities: parseArray(row.QUALITIES || row.qualities || ''),
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    rarity: safeParseInt(row.RARITY || row.rarity, 0),
    availableModSlots: {},
    corebookPage: null
  };
}

function parseRangedWeapon(row: any): any {
  const weaponTypeStr = row['WEAPON TYPE'] || row.weaponType || '';

  // Build available mod slots from the CSV columns
  const availableModSlots: any = {};
  if (row.RECEIVER && row.RECEIVER !== '-') availableModSlots.receiver = true;
  if (row.CAPACITOR && row.CAPACITOR !== '-') availableModSlots.capacitor = true;
  if (row.BARREL && row.BARREL !== '-') availableModSlots.barrel = true;
  if (row.GRIP && row.GRIP !== '-') availableModSlots.grip = true;
  if (row.MAGAZINE && row.MAGAZINE !== '-') availableModSlots.magazine = true;
  if (row.SIGHTS && row.SIGHTS !== '-') availableModSlots.sights = true;
  if (row.MUZZLE && row.MUZZLE !== '-') availableModSlots.muzzle = true;
  if (row.STOCK && row.STOCK !== '-') availableModSlots.stock = true;
  if (row['PROPELLANT TANK'] && row['PROPELLANT TANK'] !== '-') availableModSlots.propellantTank = true;
  if (row.NOZZLE && row.NOZZLE !== '-') availableModSlots.nozzle = true;

  return {
    name: row.GUN || row.name,
    weaponType: mapWeaponType({ weaponType: weaponTypeStr }),
    skill: mapSkill(weaponTypeStr),
    damage: row['DAMAGE RATING'] || row.damage || '0CD',
    damageEffects: parseArray(row['DAMAGE EFFECTS'] || row.damageEffects || ''),
    damageType: mapDamageType(row['DAMAGE TYPE'] || row.damageType || 'PHYSICAL'),
    fireRate: safeParseInt(row['FIRE RATE'] || row.fireRate, null),
    range: mapRange(row.RANGE || row.range || ''),
    ammoType: row.AMMUNITION || row.ammoType || null,
    qualities: parseArray(row.QUALITIES || row.qualities || ''),
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    rarity: safeParseInt(row.RARITY || row.rarity, 0),
    availableModSlots: availableModSlots,
    corebookPage: null
  };
}

function parseThrowable(row: any): any {
  const weaponTypeStr = row['WEAPON TYPE'] || row.weaponType || '';
  const isExplosive = (row.QUALITIES || row.qualities || '').toLowerCase().includes('blast') ||
                      (row.QUALITIES || row.qualities || '').toLowerCase().includes('mine');

  return {
    name: row['THROWING WEAPON'] || row.name,
    weaponType: isExplosive ? 'EXPLOSIVE' : 'THROWING',
    skill: isExplosive ? 'EXPLOSIVES' : 'THROWING',
    damage: row['DAMAGE RATING'] || row.damage || '0CD',
    damageEffects: parseArray(row['DAMAGE EFFECTS'] || row.damageEffects || ''),
    damageType: mapDamageType(row['DAMAGE TYPE'] || row.damageType || 'PHYSICAL'),
    fireRate: null,
    range: mapRange(row.RANGE || row.range || ''),
    ammoType: null,
    qualities: parseArray(row.QUALITIES || row.qualities || ''),
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    rarity: safeParseInt(row.RARITY || row.rarity, 0),
    availableModSlots: {},
    corebookPage: null
  };
}

function parseArmor(row: any): any {
  const locationsStr = row['LOCATIONS COVERED'] || row.location || 'TORSO';
  const location = locationsStr.toLowerCase().includes('leg') ? 'LEFT_LEG' :
                   locationsStr.toLowerCase().includes('arm') ? 'LEFT_ARM' :
                   locationsStr.toLowerCase().includes('torso') ? 'TORSO' :
                   locationsStr.toLowerCase().includes('head') ? 'HEAD' : 'TORSO';

  return {
    name: row.ITEM || row.name,
    armorType: mapArmorType(row.TYPE || row.type || 'CLOTHING'),
    location: location,
    physicalDR: safeParseInt(row['DR (PHYSICAL)'] || row.physicalDR, 0),
    energyDR: safeParseInt(row['DR (ENERGY)'] || row.energyDR, 0),
    radiationDR: safeParseInt(row['DR (RADIATION)'] || row.radiationDR, 0),
    maxHP: null,
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    rarity: safeParseInt(row.RARITY || row.rarity, 0),
    allowsMaterialMod: true,
    allowsUtilityMod: true,
    corebookPage: null
  };
}

function parseClothing(row: any): any {
  const locationsStr = row['LOCATIONS COVERED'] || row.location || 'TORSO';
  const location = locationsStr.toLowerCase().includes('leg') ? 'LEFT_LEG' :
                   locationsStr.toLowerCase().includes('arm') ? 'LEFT_ARM' :
                   locationsStr.toLowerCase().includes('torso') ? 'TORSO' :
                   locationsStr.toLowerCase().includes('head') ? 'HEAD' : 'TORSO';

  return {
    name: row.ITEM || row.name,
    armorType: 'CLOTHING',
    location: location,
    physicalDR: safeParseInt(row['DR (PHYSICAL)'] || row.physicalDR, 0),
    energyDR: safeParseInt(row['DR (ENERGY)'] || row.energyDR, 0),
    radiationDR: safeParseInt(row['DR (RADIATION)'] || row.radiationDR, 0),
    maxHP: null,
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    rarity: safeParseInt(row.RARITY || row.rarity, 0),
    allowsMaterialMod: true,
    allowsUtilityMod: false,
    corebookPage: null
  };
}

function parseDogArmor(row: any): any {
  return {
    name: row.ITEM || row.name,
    armorType: 'DOG_ARMOR',
    location: 'TORSO',
    physicalDR: safeParseInt(row['DR (PHYSICAL)'] || row.physicalDR, 0),
    energyDR: safeParseInt(row['DR (ENERGY)'] || row.energyDR, 0),
    radiationDR: safeParseInt(row['DR (RADIATION)'] || row.radiationDR, 0),
    maxHP: null,
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    rarity: safeParseInt(row.RARITY || row.rarity, 0),
    allowsMaterialMod: false,
    allowsUtilityMod: false,
    corebookPage: null
  };
}

function parsePowerArmor(row: any): any {
  const locationsStr = row['LOCATIONS COVERED'] || row.location || 'TORSO';
  const location = locationsStr.toLowerCase().includes('leg') ? 'LEFT_LEG' :
                   locationsStr.toLowerCase().includes('arm') ? 'LEFT_ARM' :
                   locationsStr.toLowerCase().includes('torso') ? 'TORSO' :
                   locationsStr.toLowerCase().includes('head') ? 'HEAD' : 'TORSO';

  return {
    name: row.ITEM || row.name,
    armorType: 'POWER_ARMOR',
    location: location,
    physicalDR: safeParseInt(row['DR (PHYSICAL)'] || row.physicalDR, 0),
    energyDR: safeParseInt(row['DR (ENERGY)'] || row.energyDR, 0),
    radiationDR: safeParseInt(row['DR (RADIATION)'] || row.radiationDR, 0),
    maxHP: safeParseInt(row['HP'] || row.maxHP, null),
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    rarity: safeParseInt(row.RARITY || row.rarity, 0),
    allowsMaterialMod: false,
    allowsUtilityMod: false,
    corebookPage: null
  };
}

function parseRobotArmor(row: any): any {
  const locationsStr = row['LOCATIONS COVERED'] || row.location || 'MAIN_BODY';
  const location = mapBodyLocation(locationsStr);

  return {
    name: row.ITEM || row.name,
    armorType: 'ROBOT_ARMOR',
    location: location,
    physicalDR: safeParseInt(row['DR (PHYSICAL)'] || row.physicalDR, 0),
    energyDR: safeParseInt(row['DR (ENERGY)'] || row.energyDR, 0),
    radiationDR: safeParseInt(row['DR (RADIATION)'] || row.radiationDR, 0),
    maxHP: safeParseInt(row['HP'] || row.maxHP, null),
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    rarity: safeParseInt(row.RARITY || row.rarity, 0),
    allowsMaterialMod: false,
    allowsUtilityMod: false,
    corebookPage: null
  };
}

function parseBeverage(row: any): any {
  const otherEffects = row['OTHER EFFECTS'] || row.effects || '';
  const effects = parseArray(otherEffects);
  const irradiated = row['IRRADIATED?'] || row.radiationDice || '';

  return {
    name: row.ITEM || row.name,
    category: 'BEVERAGE',
    hpHealed: safeParseInt(row['HP HEALED'] || row.hpHealed, 0),
    effects: effects,
    radiationDice: irradiated && irradiated !== '–' && irradiated !== '-' ? irradiated : null,
    addictionRating: null,
    duration: null,
    isAlcoholic: otherEffects.toLowerCase().includes('alcohol'),
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    rarity: safeParseInt(row.RARITY || row.rarity, 0),
    corebookPage: null
  };
}

function parseFood(row: any): any {
  const irradiated = row['IRRADIATED?'] || row.radiationDice || '';

  return {
    name: row.ITEM || row.name,
    category: 'FOOD',
    hpHealed: safeParseInt(row['HP HEALED'] || row.hpHealed, 0),
    effects: parseArray(row['OTHER EFFECTS'] || row.effects || ''),
    radiationDice: irradiated && irradiated !== '–' && irradiated !== '-' ? irradiated : null,
    addictionRating: null,
    duration: null,
    isAlcoholic: false,
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    rarity: safeParseInt(row.RARITY || row.rarity, 0),
    corebookPage: null
  };
}

function parseChem(row: any): any {
  const addictive = row['ADDICTIVE?'] || row.addictionRating || '0';
  const durationStr = row.DURATION || row.duration || '';

  return {
    name: row.ITEM || row.name,
    category: 'CHEM',
    hpHealed: 0,
    effects: parseArray(row.EFFECTS || row.effects || ''),
    radiationDice: null,
    addictionRating: safeParseInt(addictive, null),
    duration: durationStr.toLowerCase().includes('instant') ? null : safeParseInt(durationStr, null),
    isAlcoholic: false,
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    rarity: safeParseInt(row.RARITY || row.rarity, 0),
    corebookPage: null
  };
}

function parseWeaponMod(row: any): any {
  const section = row.SECTION || '';
  const modSlot = section.toLowerCase().includes('receiver') ? 'receiver' :
                  section.toLowerCase().includes('barrel') ? 'barrel' :
                  section.toLowerCase().includes('grip') ? 'grip' :
                  section.toLowerCase().includes('sight') ? 'sights' :
                  section.toLowerCase().includes('magazine') ? 'magazine' :
                  section.toLowerCase().includes('muzzle') ? 'muzzle' :
                  section.toLowerCase().includes('stock') ? 'stock' :
                  section.toLowerCase().includes('capacitor') ? 'capacitor' :
                  section.toLowerCase().includes('nozzle') ? 'nozzle' :
                  section.toLowerCase().includes('tank') ? 'propellantTank' : 'general';

  const fullName = row['NAME PREFIX'] ? row['NAME PREFIX'] : row.MOD || row.name;

  return {
    name: fullName,
    modType: 'WEAPON_MOD',
    modSlot: modSlot,
    applicableTo: parseArray(row['WEAPON TYPE'] || ''),
    effects: parseArray(row.EFFECTS || row.effects || ''),
    drModifiers: null,
    damageBonus: null,
    requirements: parseArray(row.PERKS || row.requirements || ''),
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    weightModifier: safeParseFloat(row.WEIGHT || row.weightModifier, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    corebookPage: null
  };
}

function parseArmorMod(row: any): any {
  return {
    name: row.MOD || row.name,
    modType: 'ARMOR_MOD',
    modSlot: 'utility',
    applicableTo: parseArray(row['ARMOR TYPE'] || row.applicableTo || ''),
    effects: parseArray(row.EFFECTS || row.effects || ''),
    drModifiers: null,
    damageBonus: null,
    requirements: parseArray(row.PERKS || row.requirements || ''),
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    weightModifier: safeParseFloat(row.WEIGHT || row.weightModifier, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    corebookPage: null
  };
}

function parseClothingMod(row: any): any {
  return {
    name: row.MOD || row.name,
    modType: 'CLOTHING_MOD',
    modSlot: 'lining',
    applicableTo: [],
    effects: parseArray(row.EFFECTS || row.effects || ''),
    drModifiers: null,
    damageBonus: null,
    requirements: parseArray(row.PERKS || row.requirements || ''),
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    weightModifier: safeParseFloat(row.WEIGHT || row.weightModifier, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    corebookPage: null
  };
}

function parsePowerArmorMod(row: any): any {
  return {
    name: row.MOD || row.name,
    modType: 'POWER_ARMOR_MOD',
    modSlot: 'utility',
    applicableTo: parseArray(row['ARMOR TYPE'] || row.applicableTo || ''),
    effects: parseArray(row.EFFECTS || row.effects || ''),
    drModifiers: null,
    damageBonus: null,
    requirements: parseArray(row.PERKS || row.requirements || ''),
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    weightModifier: safeParseFloat(row.WEIGHT || row.weightModifier, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    corebookPage: null
  };
}

function parsePowerArmorPlating(row: any): any {
  return {
    name: row.MATERIAL || row.name,
    modType: 'POWER_ARMOR_MOD',
    modSlot: 'material',
    applicableTo: [],
    effects: parseArray(row.EFFECTS || row.effects || ''),
    drModifiers: {},
    damageBonus: null,
    requirements: parseArray(row.PERKS || row.requirements || ''),
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    weightModifier: safeParseFloat(row.WEIGHT || row.weightModifier, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    corebookPage: null
  };
}

function parseRobotModule(row: any): any {
  return {
    name: row.MODULE || row.name,
    modType: 'ROBOT_MOD',
    modSlot: 'internal',
    applicableTo: ['ROBOTS'],
    effects: parseArray(row.EFFECTS || row.effects || ''),
    drModifiers: null,
    damageBonus: null,
    requirements: parseArray(row.PERKS || row.requirements || ''),
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    weightModifier: safeParseFloat(row.WEIGHT || row.weightModifier, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    corebookPage: null
  };
}

function parseAmmo(row: any): any {
  const quantityStr = row['QUANTITY FOUND'] || row.baseQuantity || '6';

  // Parse format like "10+5CD" to get base quantity
  let baseQuantity = 6;
  if (typeof quantityStr === 'string') {
    const match = quantityStr.match(/^(\d+)/);
    if (match) {
      baseQuantity = parseInt(match[1]);
    }
  } else {
    baseQuantity = safeParseInt(quantityStr, 6) as number;
  }

  return {
    name: row['AMMUNITION TYPE'] || row.name,
    ammoType: row['AMMUNITION TYPE'] || row.ammoType || row.name,
    damageBonus: '0CD',
    baseQuantity: baseQuantity,
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0) as number,
    rarity: safeParseInt(row.RARITY || row.rarity, 0) as number,
    corebookPage: null
  };
}

function parseSyringerAmmo(row: any): any {
  return {
    name: row['AMMO NAME'] || row.name,
    ammoType: 'Syringer',
    damageBonus: '0CD',
    baseQuantity: 1,
    weight: 0,
    cost: safeParseInt(row.COST || row.cost, 0) as number,
    rarity: 2,
    corebookPage: null
  };
}

function parseMagazine(row: any): any {
  return {
    name: row.PUBLICATION || row.name,
    rollRange: row['D20 ROLL'] || row.rollRange || '1',
    hasIssues: (row['ISSUES?'] || row.hasIssues || '0') !== '0',
    perkGranted: '',
    perkDescription: row.PERK || row.perkDescription || '',
    corebookPage: null
  };
}

function parsePerk(row: any): any {
  const requirementsStr = row.REQUIREMENTS || '–';
  const minLevel = row['MINIMUM LEVEL'] || row.minLevel || '–';
  const restriction = row.RESTRICTION || row.restriction || '–';

  let requirements: any = {};

  if (minLevel !== '–' && minLevel !== '-') {
    requirements.level = safeParseInt(minLevel, 1);
  }

  if (requirementsStr !== '–' && requirementsStr !== '-') {
    requirements.attributes = requirementsStr;
  }

  if (restriction !== '–' && restriction !== '-') {
    requirements.restriction = restriction;
  }

  return {
    name: row.PERK || row.name,
    ranks: safeParseInt(row.RANKS || row.ranks, 1),
    requirements: requirements,
    condition: '',
    benefit: row.DESCRIPTION || row.benefit || '',
    mechanicalEffects: null,
    corebookPage: null
  };
}

function parseTool(row: any): any {
  return {
    name: row.ITEM || row.name,
    category: 'General',
    effect: row.EFFECTS || row.effect || '',
    weight: safeParseFloat(row.WEIGHT || row.weight, 0),
    cost: safeParseInt(row.COST || row.cost, 0),
    rarity: safeParseInt(row.RARITY || row.rarity, 0),
    corebookPage: null
  };
}

// ============================================================================
// IMPORT FUNCTIONS
// ============================================================================

async function importCSVSafely(
  filepath: string,
  parser: (row: any) => any,
  model: any,
  displayName: string
) {
  console.log(`\n[${displayName}] Starting import...`);

  if (!fs.existsSync(filepath)) {
    console.error(`[${displayName}] File not found: ${filepath}`);
    return;
  }

  const rows = parseCSV(filepath);
  let successCount = 0;
  let errorCount = 0;

  for (const row of rows) {
    try {
      const data = parser(row);

      if (!data.name || data.name.trim() === '') {
        continue;
      }

      await model.upsert({
        where: { name: data.name },
        update: {},
        create: data
      });

      successCount++;
    } catch (error: any) {
      console.error(`[${displayName}] Error importing ${row.NAME || row.name}:`, error.message);
      errorCount++;
    }
  }

  console.log(`[${displayName}] Complete: ${successCount} imported, ${errorCount} errors`);
}

async function importMagazineIssues(filepath: string) {
  console.log(`\n[Magazine Issues] Starting import...`);

  if (!fs.existsSync(filepath)) {
    console.error(`[Magazine Issues] File not found: ${filepath}`);
    return;
  }

  const rows = parseCSV(filepath);
  let successCount = 0;
  let errorCount = 0;

  for (const row of rows) {
    try {
      const magazineName = row.MAGAZINE || row.magazineName;
      const rollRange = row['D20 ROLL'] || row.rollRange || '1';
      const issue = row.ISSUE || row.issue || '';
      const effect = row.EFFECT || row.perkEffect || '';

      if (!magazineName || !issue) {
        continue;
      }

      // Find magazine by name
      const magazine = await prisma.magazineMaster.findUnique({
        where: { name: magazineName }
      });

      if (!magazine) {
        console.error(`[Magazine Issues] Magazine not found: ${magazineName}`);
        errorCount++;
        continue;
      }

      // Extract issue number from the issue name (e.g., "Attack of the Fishmen!" -> 1)
      // We'll use a simple incrementing counter based on the roll range
      const issueNumber = successCount + 1;

      await prisma.magazineIssueMaster.create({
        data: {
          magazineId: magazine.id,
          issueNumber: issueNumber,
          perkName: issue,
          perkEffect: effect
        }
      });

      successCount++;
    } catch (error: any) {
      console.error(`[Magazine Issues] Error importing issue:`, error.message);
      errorCount++;
    }
  }

  console.log(`[Magazine Issues] Complete: ${successCount} imported, ${errorCount} errors`);
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log('================================================================================');
  console.log('FALLOUT 2D20 DATABASE SEEDER');
  console.log('================================================================================');

  const assetsPath = path.join(__dirname, '..', 'assets');

  try {
    // Clear existing data (optional - comment out if you want to preserve data)
    console.log('\nClearing existing data...');
    await prisma.magazineIssueMaster.deleteMany({});
    await prisma.magazineMaster.deleteMany({});
    await prisma.weaponMaster.deleteMany({});
    await prisma.armorMaster.deleteMany({});
    await prisma.consumableMaster.deleteMany({});
    await prisma.modMaster.deleteMany({});
    await prisma.ammoMaster.deleteMany({});
    await prisma.toolMaster.deleteMany({});
    await prisma.perkMaster.deleteMany({});
    console.log('Existing data cleared.');

    // Import weapons
    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - melee weapons.csv'),
      parseMeleeWeapon,
      prisma.weaponMaster,
      'Melee Weapons'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - ranged weapons.csv'),
      parseRangedWeapon,
      prisma.weaponMaster,
      'Ranged Weapons'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - throwables.csv'),
      parseThrowable,
      prisma.weaponMaster,
      'Throwables'
    );

    // Import armor
    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - armor.csv'),
      parseArmor,
      prisma.armorMaster,
      'Armor'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - clothing.csv'),
      parseClothing,
      prisma.armorMaster,
      'Clothing'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - dog armor.csv'),
      parseDogArmor,
      prisma.armorMaster,
      'Dog Armor'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - power armor.csv'),
      parsePowerArmor,
      prisma.armorMaster,
      'Power Armor'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - robot armor.csv'),
      parseRobotArmor,
      prisma.armorMaster,
      'Robot Armor'
    );

    // Import consumables
    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - food.csv'),
      parseFood,
      prisma.consumableMaster,
      'Food'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - beverages.csv'),
      parseBeverage,
      prisma.consumableMaster,
      'Beverages'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - chems.csv'),
      parseChem,
      prisma.consumableMaster,
      'Chems'
    );

    // Import mods
    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - weapons mods.csv'),
      parseWeaponMod,
      prisma.modMaster,
      'Weapon Mods'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - armor mods.csv'),
      parseArmorMod,
      prisma.modMaster,
      'Armor Mods'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - clothing mods.csv'),
      parseClothingMod,
      prisma.modMaster,
      'Clothing Mods'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - power armor mods.csv'),
      parsePowerArmorMod,
      prisma.modMaster,
      'Power Armor Mods'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - power armor plating.csv'),
      parsePowerArmorPlating,
      prisma.modMaster,
      'Power Armor Plating'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - robot modules.csv'),
      parseRobotModule,
      prisma.modMaster,
      'Robot Modules'
    );

    // Import ammunition
    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - ammunition.csv'),
      parseAmmo,
      prisma.ammoMaster,
      'Ammunition'
    );

    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - syringer ammo.csv'),
      parseSyringerAmmo,
      prisma.ammoMaster,
      'Syringer Ammo'
    );

    // Import tools
    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - tools.csv'),
      parseTool,
      prisma.toolMaster,
      'Tools'
    );

    // Import perks
    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - perks.csv'),
      parsePerk,
      prisma.perkMaster,
      'Perks'
    );

    // Import magazines (must come before magazine issues)
    await importCSVSafely(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - magazines.csv'),
      parseMagazine,
      prisma.magazineMaster,
      'Magazines'
    );

    // Import magazine issues (depends on magazines)
    await importMagazineIssues(
      path.join(assetsPath, 'FALLOUT 2D20 DATA - magazines issues.csv')
    );

    console.log('\n================================================================================');
    console.log('DATABASE SEEDING COMPLETE!');
    console.log('================================================================================\n');

  } catch (error) {
    console.error('\n!!! FATAL ERROR !!!');
    console.error(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
