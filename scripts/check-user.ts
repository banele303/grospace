import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: {
      email: 'alexsouthflow@gmail.com'
    },
    include: {
      vendors: true
    }
  });

  console.log('User data:', JSON.stringify(user, null, 2));
  
  if (user?.vendors && user.vendors.length > 0) {
    console.log('\nVendor data:', JSON.stringify(user.vendors, null, 2));
  } else {
    console.log('\nNo vendor data found for this user');
  }
}

main()
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
