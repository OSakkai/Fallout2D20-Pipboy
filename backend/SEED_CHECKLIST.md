# Database Seeding - Quick Start Checklist

Follow this checklist to successfully seed your database.

## Prerequisites Checklist

- [ ] PostgreSQL installed and running
- [ ] Node.js and npm installed
- [ ] Backend dependencies installed (`npm install`)
- [ ] `.env` file exists with `DATABASE_URL` configured
- [ ] All 24 CSV files present in `backend/assets/` directory

## CSV Files Checklist (24 files)

Verify all these files exist in `backend/assets/`:

### Weapons (3 files)
- [ ] `FALLOUT 2D20 DATA - melee weapons.csv`
- [ ] `FALLOUT 2D20 DATA - ranged weapons.csv`
- [ ] `FALLOUT 2D20 DATA - throwables.csv`

### Armor (5 files)
- [ ] `FALLOUT 2D20 DATA - armor.csv`
- [ ] `FALLOUT 2D20 DATA - clothing.csv`
- [ ] `FALLOUT 2D20 DATA - dog armor.csv`
- [ ] `FALLOUT 2D20 DATA - power armor.csv`
- [ ] `FALLOUT 2D20 DATA - robot armor.csv`

### Consumables (3 files)
- [ ] `FALLOUT 2D20 DATA - food.csv`
- [ ] `FALLOUT 2D20 DATA - beverages.csv`
- [ ] `FALLOUT 2D20 DATA - chems.csv`

### Mods (6 files)
- [ ] `FALLOUT 2D20 DATA - weapons mods.csv`
- [ ] `FALLOUT 2D20 DATA - armor mods.csv`
- [ ] `FALLOUT 2D20 DATA - clothing mods.csv`
- [ ] `FALLOUT 2D20 DATA - power armor mods.csv`
- [ ] `FALLOUT 2D20 DATA - power armor plating.csv`
- [ ] `FALLOUT 2D20 DATA - robot modules.csv`

### Ammunition (2 files)
- [ ] `FALLOUT 2D20 DATA - ammunition.csv`
- [ ] `FALLOUT 2D20 DATA - syringer ammo.csv`

### Other (5 files)
- [ ] `FALLOUT 2D20 DATA - tools.csv`
- [ ] `FALLOUT 2D20 DATA - perks.csv`
- [ ] `FALLOUT 2D20 DATA - magazines.csv`
- [ ] `FALLOUT 2D20 DATA - magazines issues.csv`
- [ ] `FALLOUT 2D20 DATA - tagskill.csv` (optional)

**Total: 24 CSV files required**

## Setup Steps

### Step 1: Verify Database Connection
```bash
# Test your database connection
npx prisma db pull
```
- [ ] Database connection successful

### Step 2: Apply Migrations
```bash
# Apply all migrations
npm run prisma:migrate
```
- [ ] Migrations applied successfully
- [ ] All tables created

### Step 3: Generate Prisma Client
```bash
# Generate Prisma Client
npm run prisma:generate
```
- [ ] Prisma Client generated

### Step 4: Run Seed Script
```bash
# Run the seed
npm run seed
```
- [ ] Seed started
- [ ] No file not found errors
- [ ] All imports completed
- [ ] Success message displayed

### Step 5: Verify Data
```bash
# Open Prisma Studio to browse data
npm run prisma:studio
```
- [ ] Prisma Studio opened
- [ ] Data visible in tables
- [ ] Counts look correct

## Expected Results

After successful seeding, you should see approximately:

- [ ] Weapons: 150-170 items
- [ ] Armor: 95-135 items
- [ ] Consumables: 90-120 items
- [ ] Mods: 155-210 items
- [ ] Ammunition: 25-35 types
- [ ] Tools: 20-30 items
- [ ] Perks: 80-100 perks
- [ ] Magazines: 10-15 magazines
- [ ] Magazine Issues: 100-150 issues

**Total Records: 700-1000+ items**

## Quick Verification Queries

Run these in Prisma Studio or psql to verify:

```sql
-- Count all master data
SELECT 'weapons' as table, COUNT(*) as count FROM weapon_master
UNION ALL
SELECT 'armor', COUNT(*) FROM armor_master
UNION ALL
SELECT 'consumables', COUNT(*) FROM consumable_master
UNION ALL
SELECT 'mods', COUNT(*) FROM mod_master
UNION ALL
SELECT 'ammo', COUNT(*) FROM ammo_master
UNION ALL
SELECT 'tools', COUNT(*) FROM tool_master
UNION ALL
SELECT 'perks', COUNT(*) FROM perk_master
UNION ALL
SELECT 'magazines', COUNT(*) FROM magazine_master
UNION ALL
SELECT 'issues', COUNT(*) FROM magazine_issue_master;
```

- [ ] All tables have data
- [ ] Counts match expectations

## Troubleshooting

If you encounter issues:

### Database Connection Failed
- [ ] Check PostgreSQL is running
- [ ] Verify `.env` DATABASE_URL is correct
- [ ] Test connection with `psql $DATABASE_URL`

### File Not Found Errors
- [ ] Verify CSV files in `backend/assets/` directory
- [ ] Check file names match exactly (case-sensitive)
- [ ] Ensure no extra spaces in filenames

### Import Errors
- [ ] Check console for specific error message
- [ ] Verify CSV file formatting
- [ ] Look for special characters or encoding issues
- [ ] Check the row mentioned in error

### Duplicate Key Errors
- [ ] Run seed again (it clears old data first)
- [ ] Check CSV files for duplicate names

### Type Errors
- [ ] Verify numeric fields have valid numbers
- [ ] Check enum values match schema
- [ ] Review CSV_COLUMN_MAPPING.md

## Re-running the Seed

To re-seed (clears old data automatically):
```bash
npm run seed
```
- [ ] Old data cleared
- [ ] New data imported
- [ ] Success message shown

## Next Steps After Successful Seed

- [ ] Test API endpoints with seeded data
- [ ] Verify frontend can fetch data
- [ ] Check search/filter functionality
- [ ] Test data relationships
- [ ] Review any data quality issues
- [ ] Make note of any needed CSV corrections

## Documentation Reference

- **Quick Start:** `SEED_SCRIPT_SUMMARY.md`
- **Detailed Instructions:** `prisma/SEEDING_INSTRUCTIONS.md`
- **Column Mappings:** `prisma/CSV_COLUMN_MAPPING.md`
- **General Info:** `prisma/README_SEED.md`

## Success Criteria

You'll know seeding was successful when:
- [ ] No errors in console
- [ ] All files show "Complete: X imported, 0 errors"
- [ ] Prisma Studio shows data in all tables
- [ ] API endpoints return data
- [ ] Frontend displays items correctly

## Got Issues?

1. Check console output for specific errors
2. Review documentation files
3. Verify CSV file structure
4. Check database schema matches CSV data
5. Look at failed row data in CSV

---

## Quick Command Reference

```bash
# Install dependencies
npm install

# Apply migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Run seed
npm run seed

# Open Prisma Studio
npm run prisma:studio

# Reset and reseed
npm run prisma:migrate -- --name reset
npm run seed
```

---

**You're ready to seed! Just run:**
```bash
npm run seed
```

Good luck! The seed should complete in 2-3 minutes.
