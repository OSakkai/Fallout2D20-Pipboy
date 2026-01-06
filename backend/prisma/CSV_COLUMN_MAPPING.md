# CSV Column to Database Field Mapping

This document shows how CSV columns map to database fields for each table.

## Weapons

### Melee Weapons (`FALLOUT 2D20 DATA - melee weapons.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| MELEE WEAPON | name | String | |
| WEAPON TYPE | weaponType | Enum | MELEE or UNARMED |
| WEAPON TYPE | skill | Enum | MELEE_WEAPONS or UNARMED |
| DAMAGE RATING | damage | String | e.g., "3CD", "4CD+2" |
| DAMAGE EFFECTS | damageEffects | String[] | Comma-separated |
| QUALITIES | qualities | String[] | Comma-separated |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

### Ranged Weapons (`FALLOUT 2D20 DATA - ranged weapons.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| GUN | name | String | |
| WEAPON TYPE | weaponType | Enum | SMALL_GUN, ENERGY_WEAPON, BIG_GUN |
| WEAPON TYPE | skill | Enum | Derived from weapon type |
| DAMAGE RATING | damage | String | |
| DAMAGE EFFECTS | damageEffects | String[] | Comma-separated |
| DAMAGE TYPE | damageType | Enum | PHYSICAL, ENERGY, etc. |
| FIRE RATE | fireRate | Int | |
| RANGE | range | Enum | CLOSE, MEDIUM, LONG |
| AMMUNITION | ammoType | String | |
| QUALITIES | qualities | String[] | Comma-separated |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |
| RECEIVER, BARREL, etc. | availableModSlots | JSON | Multiple columns mapped to object |

### Throwables (`FALLOUT 2D20 DATA - throwables.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| THROWING WEAPON | name | String | |
| QUALITIES | weaponType | Enum | EXPLOSIVE if has "blast/mine", else THROWING |
| QUALITIES | skill | Enum | EXPLOSIVES if has "blast/mine", else THROWING |
| DAMAGE RATING | damage | String | |
| DAMAGE EFFECTS | damageEffects | String[] | Comma-separated |
| DAMAGE TYPE | damageType | Enum | |
| RANGE | range | Enum | |
| QUALITIES | qualities | String[] | Comma-separated |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

## Armor

### Standard Armor (`FALLOUT 2D20 DATA - armor.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| ITEM | name | String | |
| TYPE | armorType | Enum | LEATHER, METAL, COMBAT, etc. |
| LOCATIONS COVERED | location | Enum | HEAD, TORSO, LEFT_ARM, etc. |
| DR (PHYSICAL) | physicalDR | Int | |
| DR (ENERGY) | energyDR | Int | |
| DR (RADIATION) | radiationDR | Int | |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

### Clothing (`FALLOUT 2D20 DATA - clothing.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| ITEM | name | String | |
| - | armorType | Enum | Always CLOTHING |
| LOCATIONS COVERED | location | Enum | |
| DR (PHYSICAL) | physicalDR | Int | |
| DR (ENERGY) | energyDR | Int | |
| DR (RADIATION) | radiationDR | Int | |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

### Dog Armor (`FALLOUT 2D20 DATA - dog armor.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| ITEM | name | String | |
| - | armorType | Enum | Always DOG_ARMOR |
| - | location | Enum | Always TORSO |
| DR (PHYSICAL) | physicalDR | Int | |
| DR (ENERGY) | energyDR | Int | |
| DR (RADIATION) | radiationDR | Int | |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

### Power Armor (`FALLOUT 2D20 DATA - power armor.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| ITEM | name | String | |
| - | armorType | Enum | Always POWER_ARMOR |
| LOCATIONS COVERED | location | Enum | |
| DR (PHYSICAL) | physicalDR | Int | |
| DR (ENERGY) | energyDR | Int | |
| DR (RADIATION) | radiationDR | Int | |
| HP | maxHP | Int | |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

### Robot Armor (`FALLOUT 2D20 DATA - robot armor.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| ITEM | name | String | |
| - | armorType | Enum | Always ROBOT_ARMOR |
| LOCATIONS COVERED | location | Enum | OPTICS, MAIN_BODY, ARM_1, etc. |
| DR (PHYSICAL) | physicalDR | Int | |
| DR (ENERGY) | energyDR | Int | |
| DR (RADIATION) | radiationDR | Int | |
| HP | maxHP | Int | |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

## Consumables

### Food (`FALLOUT 2D20 DATA - food.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| ITEM | name | String | |
| - | category | Enum | Always FOOD |
| HP HEALED | hpHealed | Int | |
| OTHER EFFECTS | effects | String[] | Comma-separated |
| IRRADIATED? | radiationDice | String | "1CD", "2CD", etc. |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

### Beverages (`FALLOUT 2D20 DATA - beverages.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| ITEM | name | String | |
| - | category | Enum | Always BEVERAGE |
| HP HEALED | hpHealed | Int | |
| OTHER EFFECTS | effects | String[] | Comma-separated |
| OTHER EFFECTS | isAlcoholic | Boolean | True if contains "Alcoholic" |
| IRRADIATED? | radiationDice | String | |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

### Chems (`FALLOUT 2D20 DATA - chems.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| ITEM | name | String | |
| - | category | Enum | Always CHEM |
| EFFECTS | effects | String[] | Comma-separated |
| ADDICTIVE? | addictionRating | Int | |
| DURATION | duration | Int | Null if "Instant" |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

## Mods

### Weapon Mods (`FALLOUT 2D20 DATA - weapons mods.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| NAME PREFIX / MOD | name | String | Prefer NAME PREFIX |
| - | modType | Enum | Always WEAPON_MOD |
| SECTION | modSlot | String | receiver, barrel, grip, etc. |
| WEAPON TYPE | applicableTo | String[] | Weapon types this applies to |
| EFFECTS | effects | String[] | Comma-separated |
| PERKS | requirements | String[] | Comma-separated |
| WEIGHT | weight | Float | |
| COST | cost | Int | |

### Armor Mods (`FALLOUT 2D20 DATA - armor mods.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| MOD | name | String | |
| - | modType | Enum | Always ARMOR_MOD |
| - | modSlot | String | Always "utility" |
| ARMOR TYPE | applicableTo | String[] | Armor types this applies to |
| EFFECTS | effects | String[] | Comma-separated |
| PERKS | requirements | String[] | Comma-separated |
| WEIGHT | weight | Float | |
| COST | cost | Int | |

### Clothing Mods (`FALLOUT 2D20 DATA - clothing mods.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| MOD | name | String | |
| - | modType | Enum | Always CLOTHING_MOD |
| - | modSlot | String | Always "lining" |
| EFFECTS | effects | String[] | Comma-separated |
| PERKS | requirements | String[] | Comma-separated |
| WEIGHT | weight | Float | |
| COST | cost | Int | |

### Power Armor Mods (`FALLOUT 2D20 DATA - power armor mods.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| MOD | name | String | |
| - | modType | Enum | Always POWER_ARMOR_MOD |
| - | modSlot | String | Always "utility" |
| ARMOR TYPE | applicableTo | String[] | |
| EFFECTS | effects | String[] | Comma-separated |
| PERKS | requirements | String[] | Comma-separated |
| WEIGHT | weight | Float | |
| COST | cost | Int | |

### Power Armor Plating (`FALLOUT 2D20 DATA - power armor plating.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| MATERIAL | name | String | |
| - | modType | Enum | Always POWER_ARMOR_MOD |
| - | modSlot | String | Always "material" |
| EFFECTS | effects | String[] | Comma-separated |
| PERKS | requirements | String[] | Comma-separated |
| WEIGHT | weight | Float | |
| COST | cost | Int | |

### Robot Modules (`FALLOUT 2D20 DATA - robot modules.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| MODULE | name | String | |
| - | modType | Enum | Always ROBOT_MOD |
| - | modSlot | String | Always "internal" |
| - | applicableTo | String[] | Always ["ROBOTS"] |
| EFFECTS | effects | String[] | Comma-separated |
| PERKS | requirements | String[] | Comma-separated |
| WEIGHT | weight | Float | |
| COST | cost | Int | |

## Ammunition

### Standard Ammo (`FALLOUT 2D20 DATA - ammunition.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| AMMUNITION TYPE | name | String | |
| AMMUNITION TYPE | ammoType | String | Same as name |
| - | damageBonus | String | Always "0CD" for standard |
| QUANTITY FOUND | baseQuantity | Int | Parsed from "6+3CD" format |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

### Syringer Ammo (`FALLOUT 2D20 DATA - syringer ammo.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| NAME | name | String | |
| - | ammoType | String | Always "Syringer" |
| DAMAGE BONUS | damageBonus | String | |
| QUANTITY FOUND | baseQuantity | Int | |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

## Other

### Perks (`FALLOUT 2D20 DATA - perks.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| PERK | name | String | |
| RANKS | ranks | Int | |
| REQUIREMENTS | requirements.attributes | String | In JSON |
| MINIMUM LEVEL | requirements.level | Int | In JSON |
| RESTRICTION | requirements.restriction | String | In JSON |
| DESCRIPTION | benefit | String | |

### Magazines (`FALLOUT 2D20 DATA - magazines.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| PUBLICATION | name | String | |
| D20 ROLL | rollRange | String | "1", "2-3", etc. |
| ISSUES? | hasIssues | Boolean | True if not "0" |
| PERK | perkDescription | String | |

### Magazine Issues (`FALLOUT 2D20 DATA - magazines issues.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| MAGAZINE | - | - | Used to find parent magazine |
| ISSUE | perkName | String | |
| EFFECT | perkEffect | String | |
| - | issueNumber | Int | Auto-incremented |

### Tools (`FALLOUT 2D20 DATA - tools.csv`)
| CSV Column | Database Field | Type | Notes |
|------------|----------------|------|-------|
| ITEM | name | String | |
| - | category | String | Always "General" |
| EFFECTS | effect | String | |
| WEIGHT | weight | Float | |
| COST | cost | Int | |
| RARITY | rarity | Int | |

## Special Value Handling

### Weight Values
- `<1` → `0.5`
- `–` or `-` → `0`
- Empty → `0`

### Null/Empty Indicators
- `–` (em dash)
- `-` (hyphen)
- Empty string
- All treated as null/default value

### Boolean Conversion
- `true` / `"true"` → `true`
- `0` / `"0"` / `false` → `false`
- Presence of keyword (e.g., "Alcoholic") → `true`

### Array Parsing
- Comma-separated values
- Trimmed of whitespace
- Empty values filtered out
