# Database Seeding Instructions

This document explains how to seed your Fallout 2D20 PostgreSQL database with data from the CSV files.

## Prerequisites

1. PostgreSQL database running and accessible
2. `.env` file configured with correct `DATABASE_URL`
3. Prisma migrations applied (`npm run prisma:migrate`)
4. All 24 CSV files present in `backend/assets/` directory

## CSV Files Required

The seed script expects the following CSV files in the `backend/assets/` directory:

### Weapons (3 files)
- `FALLOUT 2D20 DATA - melee weapons.csv`
- `FALLOUT 2D20 DATA - ranged weapons.csv`
- `FALLOUT 2D20 DATA - throwables.csv`

### Armor (5 files)
- `FALLOUT 2D20 DATA - armor.csv`
- `FALLOUT 2D20 DATA - clothing.csv`
- `FALLOUT 2D20 DATA - dog armor.csv`
- `FALLOUT 2D20 DATA - power armor.csv`
- `FALLOUT 2D20 DATA - robot armor.csv`

### Consumables (3 files)
- `FALLOUT 2D20 DATA - food.csv`
- `FALLOUT 2D20 DATA - beverages.csv`
- `FALLOUT 2D20 DATA - chems.csv`

### Mods (6 files)
- `FALLOUT 2D20 DATA - weapons mods.csv`
- `FALLOUT 2D20 DATA - armor mods.csv`
- `FALLOUT 2D20 DATA - clothing mods.csv`
- `FALLOUT 2D20 DATA - power armor mods.csv`
- `FALLOUT 2D20 DATA - power armor plating.csv`
- `FALLOUT 2D20 DATA - robot modules.csv`

### Ammunition (2 files)
- `FALLOUT 2D20 DATA - ammunition.csv`
- `FALLOUT 2D20 DATA - syringer ammo.csv`

### Other (5 files)
- `FALLOUT 2D20 DATA - tools.csv`
- `FALLOUT 2D20 DATA - perks.csv`
- `FALLOUT 2D20 DATA - magazines.csv`
- `FALLOUT 2D20 DATA - magazines issues.csv`

**Total: 24 CSV files**

## Running the Seed Script

### Option 1: Using npm script (Recommended)

```bash
npm run seed
```

### Option 2: Using ts-node directly

```bash
npx ts-node prisma/seed.ts
```

### Option 3: Using Prisma's built-in seeding

Add this to your `package.json`:

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

Then run:

```bash
npx prisma db seed
```

## What the Script Does

1. **Clears existing data** - Removes all existing master data to prevent duplicates
2. **Imports in dependency order**:
   - Independent tables first (weapons, armor, consumables, mods, ammo, tools, perks)
   - Magazines (independent)
   - Magazine issues (depends on magazines)
3. **Shows progress** - Displays import status for each CSV file
4. **Handles errors gracefully** - Continues importing even if some rows fail
5. **Reports results** - Shows count of successful imports and errors for each file

## Expected Output

```
================================================================================
FALLOUT 2D20 DATABASE SEEDER
================================================================================

Clearing existing data...
Existing data cleared.

[Melee Weapons] Starting import...
[Melee Weapons] Complete: 45 imported, 0 errors

[Ranged Weapons] Starting import...
[Ranged Weapons] Complete: 87 imported, 0 errors

...

[Magazine Issues] Starting import...
[Magazine Issues] Complete: 156 imported, 0 errors

================================================================================
DATABASE SEEDING COMPLETE!
================================================================================
```

## Troubleshooting

### Database Connection Errors

- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify database exists

### CSV File Not Found

- Ensure all CSV files are in `backend/assets/` directory
- Check file names match exactly (case-sensitive on Linux/Mac)

### Parsing Errors

- Check CSV files for malformed data
- Ensure CSV headers match expected format
- Look for special characters or encoding issues

### Unique Constraint Violations

- The script uses `upsert` to prevent duplicates
- If you see these errors, check for duplicate names in CSV files

### Type Mismatch Errors

- Verify numeric fields contain valid numbers
- Check that enum values match Prisma schema definitions

## Data Validation

After seeding, verify the data:

```bash
npm run prisma:studio
```

This opens Prisma Studio where you can browse and verify the imported data.

## Re-seeding

To re-seed the database:

1. The script automatically clears existing data
2. Simply run `npm run seed` again
3. All data will be fresh from the CSV files

## Custom Modifications

To modify the seed script:

1. Edit `prisma/seed.ts`
2. Update parser functions for specific CSV structures
3. Modify mapping functions for enum conversions
4. Adjust error handling as needed

## Notes

- The script skips rows with empty names
- Null values are handled gracefully
- Weight values `<1` are converted to `0.5`
- Missing numeric values default to `0` or `null` as appropriate
- Array fields (like effects, qualities) are parsed from comma-separated strings
