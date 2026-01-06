# Database Migration - Executive Summary

## Current State
5 tables: users, characters, items, parties, character_parties

## Target State
40+ tables organized in 3 layers:
- Master data (weapons, armor, consumables, mods, perks, ammo, magazines, tools)
- Character components (attributes, skills, perks, body locations, derived stats, active effects)
- Game management (campaigns, sessions, NPCs, inventory)

## Key Changes

### KEEP
- users (no changes)

### RENAME
- parties → campaigns (remove code, maxPlayers fields)
- character_parties → campaign_members

### REFACTOR
- characters: split SPECIAL into character_attributes
- characters: create 17 character_skills entries
- characters: create 6 body_locations entries
- characters: create derived_stats entry

### DELETE
- items (replace with inventory_items + master tables)

### NEW
- 8 master tables (weapon_master, armor_master, consumable_master, mod_master, perk_master, ammo_master, magazine_master, tool_master)
- 1 master sub-table (magazine_issue_master)
- 5 character component tables
- 3 game management tables (session, session_state, npc)
- 1 inventory table (inventory_items)

## Migration Flow

1. Backup existing data
2. Apply new schema (prisma db push)
3. Migrate users (copy as-is)
4. Migrate campaigns (rename from parties)
5. Migrate campaign_members (rename from character_parties)
6. Migrate characters (split into 5 component tables)
7. Convert items → inventory_items + create master entries
8. Import 24 CSV files into master tables

## CSV Import
24 files in backend/assets:
- 4 weapon files (melee, ranged, throwables, mods)
- 9 armor files (armor, clothing, dog, power armor × 3, robot, mods × 2)
- 3 consumable files (beverages, food, chems)
- 2 ammo files (ammunition, syringer)
- 3 mod files (robot modules counted separately)
- 3 other files (magazines × 2, perks, tools)
- 1 reference file (tagskill - skip)

## Critical Tables

### Master Tables (Read-Only)
Source of truth for all equipment/items from Corebook

### Character System
- character_attributes: S.P.E.C.I.A.L. stats
- character_skills: 17 skills with ranks and tags
- body_locations: 6 locations with independent HP/DR
- derived_stats: cached calculations (defense, initiative, HP, carry weight)
- character_perks: acquired perks with history
- active_effects: temporary buffs/debuffs

### Inventory
inventory_items: instances of master items with mods, condition, equipped status

## Validation After Migration

- Users count unchanged
- Campaigns count = old parties count
- Characters count unchanged
- Each character has:
  - 1 character_attributes entry
  - 17 character_skills entries
  - 6 body_locations entries
  - 1 derived_stats entry
- Master tables populated from CSVs:
  - ~50+ weapons
  - ~100+ armor pieces
  - ~50+ consumables
  - ~100+ mods
  - ~60+ perks
  - ~30+ ammo types
  - ~20+ magazines
  - ~10+ tools

## Post-Migration Tasks

1. Update all application queries to use new structure
2. Implement derived stats calculation logic
3. Implement combat damage calculation
4. Implement inventory management
5. Test character creation flow
6. Test session management
7. Test NPC creation

## Files Reference

- DB_MIGRATION_SPEC.md: Complete technical specification
- CSV_PARSER_GUIDE.md: Parser implementations for each CSV type
- schema.prisma: Full Prisma schema (use DB_MIGRATION_SPEC.md models)

## Key Formulas

**Derived Stats:**
```
defense = 1
initiative = PER + AGI + type_bonus
meleeDamage = STR >= 11 ? 3 : STR >= 9 ? 2 : STR >= 7 ? 1 : 0
maxHP = END + LCK + Level + type_bonus
carryWeightMax = STR * 10 + 150
```

**Body Locations (Humans):**
```
HEAD: diceRange "1-2", maxHP 5
TORSO: diceRange "3-8", maxHP 10
LEFT_ARM: diceRange "9-11", maxHP 5
RIGHT_ARM: diceRange "12-14", maxHP 5
LEFT_LEG: diceRange "15-17", maxHP 5
RIGHT_LEG: diceRange "18-20", maxHP 5
```

## Execution Order

1. Read DB_MIGRATION_SPEC.md fully
2. Backup current database
3. Update schema.prisma with all models from spec
4. Run prisma db push --force-reset
5. Run prisma generate
6. Execute data migration logic (users → campaigns → campaign_members → characters)
7. Read CSV_PARSER_GUIDE.md
8. Create parser functions
9. Import all 24 CSVs in order
10. Validate counts and relationships
11. Test key functionalities
