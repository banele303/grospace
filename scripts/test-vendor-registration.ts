import { prisma } from "@/lib/db";

async function testVendorRegistration() {
  try {
    // Check if any vendors exist
    const vendors = await prisma.vendor.findMany({
      include: {
        user: true
      }
    });
    
    console.log('Total vendors in database:', vendors.length);
    
    if (vendors.length > 0) {
      console.log('Existing vendors:');
      vendors.forEach((vendor, index) => {
        console.log(`${index + 1}. ${vendor.name} (${vendor.email}) - User ID: ${vendor.userId} - Approved: ${vendor.approved}`);
      });
    } else {
      console.log('No vendors found in database');
    }
    
    // Check users with VENDOR role
    const vendorUsers = await prisma.user.findMany({
      where: {
        role: 'VENDOR'
      },
      include: {
        vendors: true
      }
    });
    
    console.log('\nUsers with VENDOR role:', vendorUsers.length);
    vendorUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - Has vendor profile: ${user.vendors.length > 0}`);
    });
    
  } catch (error) {
    console.error('Error testing vendor registration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testVendorRegistration();
