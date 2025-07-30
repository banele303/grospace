import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    where: {
      email: 'alexsouthflow@gmail.com'
    },
    include: {
      vendor: true
    }
  });

  console.log('User data:', JSON.stringify(user, null, 2));
  
  if (user?.vendor) {
    console.log('\nVendor data:', JSON.stringify(user.vendor, null, 2));
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
