import { PrismaClient, PerkType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Map CSV TYPE to PerkType enum
function mapPerkType(csvType: string): PerkType {
  const typeMap: Record<string, PerkType> = {
    'EFFECT': PerkType.EFFECT,
    'ABILITY': PerkType.ABILITY,
    'CRAFTING': PerkType.CRAFTING,
    'COMPANION': PerkType.COMPANION,
    'SKILLS': PerkType.SKILLS,
    'SKILL': PerkType.SKILLS, // Alternative spelling
    'BREACHER': PerkType.ABILITY, // BREACHER becomes ABILITY as per user request
  };

  const mapped = typeMap[csvType.toUpperCase()];
  if (!mapped) {
    console.warn(`⚠️  Unknown perk type: ${csvType}, defaulting to ABILITY`);
    return PerkType.ABILITY;
  }

  return mapped;
}

// Clean string values from CSV
function cleanString(value: string): string | null {
  if (!value || value === '–' || value === '-' || value.trim() === '') {
    return null;
  }
  return value.trim();
}

// Fix carryWeight to lowercase as per user request
function normalizeEffects(effects: string | null): string | null {
  if (!effects) return null;

  // Replace "CarryWeight" with "carryWeight"
  return effects.replace(/CarryWeight/g, 'carryWeight');
}

async function seedPerks() {
  console.log('🌱 Starting Perks seed...\n');

  // Read CSV file
  const csvPath = path.join(__dirname, '../../assets/FALLOUT 2D20 DATA - perks 2.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found at: ${csvPath}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');

  // Skip header
  const dataLines = lines.slice(1).filter(line => line.trim() !== '');

  console.log(`📊 Found ${dataLines.length} perks in CSV\n`);

  let created = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const line of dataLines) {
    try {
      // Parse CSV line (handling commas inside quotes)
      const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
      const columns = line.split(regex).map(col => {
        // Remove surrounding quotes if present
        col = col.trim();
        if (col.startsWith('"') && col.endsWith('"')) {
          col = col.slice(1, -1);
        }
        return col;
      });

      if (columns.length < 7) {
        console.warn(`⚠️  Skipping malformed line: ${line.substring(0, 50)}...`);
        skipped++;
        continue;
      }

      const [
        name,
        type,
        requirements,
        minLevel,
        restriction,
        effects,
        description
      ] = columns;

      // Validate required fields
      if (!name || !type || !description) {
        console.warn(`⚠️  Skipping perk with missing required fields: ${name || 'UNKNOWN'}`);
        skipped++;
        continue;
      }

      // Create perk
      await prisma.perkMaster.create({
        data: {
          name: name.trim(),
          type: mapPerkType(type),
          requirements: cleanString(requirements),
          minLevel: cleanString(minLevel),
          restriction: cleanString(restriction),
          effects: normalizeEffects(cleanString(effects)),
          description: description.trim(),
        },
      });

      created++;
      console.log(`✅ Created: ${name} (${type})`);

    } catch (error) {
      const errorMsg = `Failed to create perk from line: ${line.substring(0, 50)}... - ${error.message}`;
      errors.push(errorMsg);
      console.error(`❌ ${errorMsg}`);
      skipped++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`📊 Seed Summary:`);
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⚠️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors.length}`);
  console.log('='.repeat(50) + '\n');

  if (errors.length > 0) {
    console.log('❌ Errors encountered:');
    errors.forEach(err => console.log(`   - ${err}`));
  }
}

seedPerks()
  .catch((e) => {
    console.error('💥 Fatal error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
