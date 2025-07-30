// fix_vendor_user_relation.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Use a raw SQL query to find vendors with null userId
    const result = await prisma.$queryRaw`SELECT * FROM "Vendor" WHERE "userId" IS NULL`;
    
    console.log(`Found ${result.length} vendors with null userId`);

    if (result.length > 0) {
      console.log('Vendor details:');
      console.log(JSON.stringify(result, null, 2));

      // Option 1: Delete vendors with null userId using raw SQL
      console.log('\nTo fix these vendors, you can:');
      console.log('1. Delete them if they are test data by uncommenting the next section');
      console.log('2. Create users for each vendor and update their userId field');
      console.log('3. Modify your migration to make userId nullable initially');

      // Uncomment to delete vendors with null userId
      // const deleteResult = await prisma.$executeRaw`DELETE FROM "Vendor" WHERE "userId" IS NULL`;
      // console.log(`Deleted ${deleteResult} vendors with null userId`);
    } else {
      console.log('No vendors with null userId found. The issue might be elsewhere.');
    }
  } catch (error) {
    console.error('Error executing raw query:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
