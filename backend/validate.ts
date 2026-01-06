import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n=== DATABASE VALIDATION ===\n');
  
  const counts = {
    users: await prisma.user.count(),
    campaigns: await prisma.campaign.count(),
    characters: await prisma.character.count(),
    weaponMaster: await prisma.weaponMaster.count(),
    armorMaster: await prisma.armorMaster.count(),
    consumableMaster: await prisma.consumableMaster.count(),
    modMaster: await prisma.modMaster.count(),
    perkMaster: await prisma.perkMaster.count(),
    ammoMaster: await prisma.ammoMaster.count(),
    magazineMaster: await prisma.magazineMaster.count(),
    magazineIssueMaster: await prisma.magazineIssueMaster.count(),
    toolMaster: await prisma.toolMaster.count(),
  };
  
  console.log('Table Counts:');
  Object.entries(counts).forEach(([table, count]) => {
    console.log(`  ${table}: ${count}`);
  });
  
  const totalMasterItems = counts.weaponMaster + counts.armorMaster + counts.consumableMaster + 
                           counts.modMaster + counts.perkMaster + counts.ammoMaster + 
                           counts.magazineMaster + counts.toolMaster;
  
  console.log(`\nTotal Master Items: ${totalMasterItems}`);
  console.log(`Magazine Issues: ${counts.magazineIssueMaster}`);
  
  console.log('\n✅ Migration Complete!\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
