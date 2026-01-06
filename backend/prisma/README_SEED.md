# Fallout 2D20 Database Seed Script

This directory contains the database seeding infrastructure for importing Fallout 2D20 game data from CSV files into PostgreSQL.

## Quick Start

```bash
# Run the seed script
npm run seed
```

That's it! The script will import all 24 CSV files into your database.

## Files in This Directory

### Main Files
- **`seed.ts`** - Main TypeScript seed script
  - Parses 24 CSV files
  - Maps data to Prisma models
  - Handles dependencies and errors
  - Shows progress during import

- **`schema.prisma`** - Prisma schema definition
  - Defines all database tables
  - Specifies relationships
  - Contains enum definitions

### Documentation
- **`SEEDING_INSTRUCTIONS.md`** - Detailed usage instructions
  - Prerequisites
  - How to run
  - Troubleshooting
  - Expected output

- **`CSV_COLUMN_MAPPING.md`** - Column mapping reference
  - Shows CSV → Database field mappings
  - Documents all 24 CSV file structures
  - Special value handling rules

- **`CSV_PARSER_GUIDE.md`** - Original parser specification
  - Parser function designs
  - Mapping functions
  - Helper utilities

## What Gets Imported

### Game Items (24 CSV files total)

1. **Weapons** (3 files)
   - Melee weapons
   - Ranged weapons
   - Throwables

2. **Armor** (5 files)
   - Standard armor
   - Clothing
   - Dog armor
   - Power armor
   - Robot armor

3. **Consumables** (3 files)
   - Food
   - Beverages
   - Chems

4. **Modifications** (6 files)
   - Weapon mods
   - Armor mods
   - Clothing mods
   - Power armor mods
   - Power armor plating
   - Robot modules

5. **Ammunition** (2 files)
   - Standard ammunition
   - Syringer ammo

6. **Other** (5 files)
   - Tools
   - Perks
   - Magazines
   - Magazine issues
   - Tag skills (if present)

## Import Order & Dependencies

The script imports data in this specific order to handle foreign key dependencies:

```
1. Independent Tables (can import in any order)
   ├─ weapon_master
   ├─ armor_master
   ├─ consumable_master
   ├─ mod_master
   ├─ ammo_master
   ├─ tool_master
   └─ perk_master

2. Dependent Tables (must import in this order)
   ├─ magazine_master (first)
   └─ magazine_issue_master (requires magazine_master)
```

## Key Features

### Robust CSV Parsing
- Handles quoted fields with commas
- Supports multi-line fields
- Processes special characters correctly

### Smart Data Mapping
- Converts CSV columns to database fields
- Maps enum values automatically
- Handles missing/null values gracefully

### Error Handling
- Continues on individual row failures
- Reports errors without stopping
- Shows detailed error messages

### Progress Reporting
```
[Melee Weapons] Starting import...
[Melee Weapons] Complete: 45 imported, 0 errors

[Ranged Weapons] Starting import...
[Ranged Weapons] Complete: 87 imported, 2 errors
```

### Data Safety
- Uses `upsert` to prevent duplicates
- Clears old data before importing
- Validates required fields

## Common Use Cases

### First Time Setup
```bash
# 1. Apply migrations
npm run prisma:migrate

# 2. Seed database
npm run seed

# 3. Verify data
npm run prisma:studio
```

### Updating Game Data
```bash
# 1. Update CSV files
# 2. Re-run seed (clears old data automatically)
npm run seed
```

### Development/Testing
```bash
# Reset and reseed for clean state
npm run prisma:migrate -- --name reset
npm run seed
```

## Customization

### Modifying Parsers

To change how data is parsed, edit `seed.ts`:

```typescript
// Example: Add custom field mapping
function parseWeapon(row: any): any {
  return {
    name: row.GUN,
    // Add your custom field here
    customField: row.CUSTOM_CSV_COLUMN,
    // ... rest of fields
  };
}
```

### Adding New CSV Files

1. Add parser function in `seed.ts`
2. Add import call in `main()` function
3. Update documentation

### Changing Import Order

Modify the `main()` function in `seed.ts`:

```typescript
async function main() {
  // Add your imports here in desired order
  await importCSVSafely(filepath, parser, model, name);
}
```

## Troubleshooting

### "File not found" errors
- Check CSV files are in `backend/assets/` directory
- Verify exact file names (case-sensitive)

### Database connection errors
- Check `.env` file has correct `DATABASE_URL`
- Ensure PostgreSQL is running
- Verify database exists

### Import errors
- Check CSV file formatting
- Look for special characters
- Verify data types match schema

### Slow import
- Normal for large datasets
- Each file processes sequentially
- Magazine issues are slowest (requires lookups)

## Performance

Typical import times:
- Small files (< 50 rows): 1-2 seconds
- Medium files (50-200 rows): 3-5 seconds
- Large files (200+ rows): 5-10 seconds
- Magazine issues: 10-15 seconds (requires FK lookups)

**Total import time: ~2-3 minutes** for all 24 files

## Data Verification

After seeding, verify data using:

### Prisma Studio (Recommended)
```bash
npm run prisma:studio
```
- Visual interface
- Browse all tables
- Edit/delete records
- Filter and search

### SQL Queries
```bash
psql $DATABASE_URL
```

```sql
-- Count records by table
SELECT 'weapons' as table_name, COUNT(*) FROM weapon_master
UNION ALL
SELECT 'armor', COUNT(*) FROM armor_master
UNION ALL
SELECT 'consumables', COUNT(*) FROM consumable_master;

-- View sample data
SELECT * FROM weapon_master LIMIT 10;
```

## Support

For issues or questions:
1. Check `SEEDING_INSTRUCTIONS.md` for detailed help
2. Check `CSV_COLUMN_MAPPING.md` for field mappings
3. Review error messages in console output
4. Check CSV file formatting

## Version History

- **v1.0** - Initial seed script
  - Supports all 24 CSV files
  - Handles dependencies
  - Error reporting
  - Progress tracking
