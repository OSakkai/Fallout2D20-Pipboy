# Claude Code - Execution Guide

## Read in This Order

### 1. MIGRATION_SUMMARY.md
**Purpose**: Quick overview of entire migration
**Time**: 2 minutes
**Contains**: 
- Current vs target state
- Key changes summary
- Execution checklist
- Critical formulas

### 2. DB_MIGRATION_SPEC.md
**Purpose**: Complete technical specification
**Time**: 10 minutes
**Contains**:
- Current schema analysis
- Full target schema (40+ Prisma models)
- Migration logic for each table
- CSV file mappings
- Implementation checklist

### 3. CSV_PARSER_GUIDE.md
**Purpose**: Parser implementation for each CSV
**Time**: 5 minutes
**Contains**:
- Parser function for each of 24 CSV types
- Helper functions (mappers, parsers)
- Import order
- Error handling

### 4. DATABASE_ARCHITECTURE.md
**Purpose**: Deep dive into schema design
**Reference as needed**
**Contains**:
- 3-layer architecture explanation
- Relationship diagrams
- Query examples
- Trigger recommendations

### 5. VALIDATIONS_AND_RULES.md
**Purpose**: Business logic and rules
**Reference as needed**
**Contains**:
- Character creation validation
- Derived stats formulas
- Combat calculations
- Level up logic

### 6. USAGE_EXAMPLES.md
**Purpose**: Real-world usage patterns
**Reference as needed**
**Contains**:
- Complete flow examples
- Prisma queries
- TypeScript implementations

## Execution Steps

### Phase 1: Preparation (5 min)
1. Read MIGRATION_SUMMARY.md
2. Read DB_MIGRATION_SPEC.md sections 1-2 (current + target schema)
3. Verify 24 CSV files exist in backend/assets

### Phase 2: Schema Update (2 min)
1. Copy all Prisma models from DB_MIGRATION_SPEC.md
2. Update schema.prisma
3. Run: `npx prisma db push --force-reset`
4. Run: `npx prisma generate`

### Phase 3: Data Migration (10 min)
1. Create backup queries (DB_MIGRATION_SPEC.md step 1)
2. Implement migration logic (DB_MIGRATION_SPEC.md step 3)
3. Execute migrations in order:
   - users (copy)
   - campaigns (rename parties)
   - campaign_members (rename character_parties)
   - characters (split into 5 components)
   - inventory_items (convert from items)

### Phase 4: CSV Import (15 min)
1. Read CSV_PARSER_GUIDE.md
2. Implement parser functions
3. Implement helper functions (mappers, parseArray, parseJSON)
4. Create import script with error handling
5. Import all 24 CSVs in dependency order:
   - Independent tables first (weapons, armor, consumables, mods, ammo, perks, tools)
   - Dependent tables last (magazine_issue_master needs magazine_master)

### Phase 5: Validation (5 min)
1. Count records in each table
2. Verify relationships
3. Test character creation
4. Test inventory queries
5. Check master table counts

## Key Files in Package

**For Migration:**
- MIGRATION_SUMMARY.md - Start here
- DB_MIGRATION_SPEC.md - Complete spec
- CSV_PARSER_GUIDE.md - CSV import logic

**For Reference:**
- DATABASE_ARCHITECTURE.md - Schema design details
- VALIDATIONS_AND_RULES.md - Business rules
- USAGE_EXAMPLES.md - Query examples

**For Setup:**
- schema.prisma - Backup of complete schema
- README.md - Overview and features
- QUICK_START.md - 5-minute setup guide

## CSV Files Location
All CSVs are in: `backend/assets/`

Files (24 total):
```
FALLOUT 2D20 DATA - ammunition.csv
FALLOUT 2D20 DATA - armor mods.csv
FALLOUT 2D20 DATA - armor.csv
FALLOUT 2D20 DATA - beverages.csv
FALLOUT 2D20 DATA - chems.csv
FALLOUT 2D20 DATA - clothing mods.csv
FALLOUT 2D20 DATA - clothing.csv
FALLOUT 2D20 DATA - dog armor.csv
FALLOUT 2D20 DATA - food.csv
FALLOUT 2D20 DATA - magazines issues.csv
FALLOUT 2D20 DATA - magazines.csv
FALLOUT 2D20 DATA - melee weapons.csv
FALLOUT 2D20 DATA - perks.csv
FALLOUT 2D20 DATA - power armor mods.csv
FALLOUT 2D20 DATA - power armor plating.csv
FALLOUT 2D20 DATA - power armor.csv
FALLOUT 2D20 DATA - ranged weapons.csv
FALLOUT 2D20 DATA - robot armor.csv
FALLOUT 2D20 DATA - robot modules.csv
FALLOUT 2D20 DATA - syringer ammo.csv
FALLOUT 2D20 DATA - tagskill.csv (SKIP - reference only)
FALLOUT 2D20 DATA - throwables.csv
FALLOUT 2D20 DATA - tools.csv
FALLOUT 2D20 DATA - weapons mods.csv
```

## Success Criteria

Database migration successful when:
- [ ] 40+ tables created
- [ ] 0 users lost
- [ ] 0 campaigns lost (renamed from parties)
- [ ] 0 characters lost
- [ ] Each character has 5 component tables populated
- [ ] 500+ master items imported from CSVs
- [ ] All relationships working
- [ ] Character creation works
- [ ] Combat calculations work
- [ ] Inventory management works

## Common Issues

**Issue**: Prisma enum mismatch
**Solution**: Check exact enum values in DB_MIGRATION_SPEC.md

**Issue**: CSV parsing errors
**Solution**: Check CSV_PARSER_GUIDE.md for correct column mapping

**Issue**: Foreign key violations
**Solution**: Import CSVs in correct order (independent tables first)

**Issue**: Missing data after migration
**Solution**: Check backup tables, verify migration logic ran

## Need Help?

Refer to specific files:
- Schema questions → DATABASE_ARCHITECTURE.md
- Business logic → VALIDATIONS_AND_RULES.md
- Query examples → USAGE_EXAMPLES.md
- CSV format → CSV_PARSER_GUIDE.md
