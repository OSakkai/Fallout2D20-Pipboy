import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const healingItems = [
    'Stimpak',
    'Stimpak (Diluted)',
    'Super Stimpak',
    'Stimpak Diffuser',
    'RadAway',
    'RadAway (Diluted)',
    'Rad-X',
    'Rad-X (Diluted)',
    'Robot Repair Kit',
  ];

  console.log('Migrating healing items from CHEM to AID category...\n');

  for (const itemName of healingItems) {
    try {
      const result = await prisma.consumableMaster.updateMany({
        where: {
          name: itemName,
          category: 'CHEM',
        },
        data: {
          category: 'AID',
        },
      });

      if (result.count > 0) {
        console.log(`✓ Updated: ${itemName}`);
      } else {
        console.log(`⚠ Not found or already AID: ${itemName}`);
      }
    } catch (error) {
      console.error(`✗ Error updating ${itemName}:`, error);
    }
  }

  console.log('\nMigration complete!');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
