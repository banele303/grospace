/**
 * Script to update existing users and vendors to have APPROVED status
 * This should be run once after the status migration
 */

import { prisma } from '../lib/db';

async function updateExistingUsersAndVendors() {
  console.log('🔄 Updating existing users and vendors to APPROVED status...\n');

  try {
    // Update all existing users to APPROVED status (except those already blocked/suspended)
    const updatedUsers = await prisma.user.updateMany({
      where: {
        accountStatus: 'PENDING',
        // Only update users who don't have a specific blocked/suspended status
        NOT: {
          OR: [
            { blockedAt: { not: null } },
            { isActive: false }
          ]
        }
      },
      data: {
        accountStatus: 'APPROVED'
      }
    });

    console.log(`✅ Updated ${updatedUsers.count} users to APPROVED status`);

    // Update all existing vendors to APPROVED status (except those already blocked/suspended)
    const updatedVendors = await prisma.vendor.updateMany({
      where: {
        vendorStatus: 'PENDING',
        // Only update vendors who don't have a specific blocked/suspended status
        NOT: {
          OR: [
            { blockedAt: { not: null } },
            { approved: false }
          ]
        }
      },
      data: {
        vendorStatus: 'APPROVED',
        approved: true
      }
    });

    console.log(`✅ Updated ${updatedVendors.count} vendors to APPROVED status`);

    // Show summary of current user statuses
    const userStatusCounts = await prisma.user.groupBy({
      by: ['accountStatus'],
      _count: {
        id: true
      }
    });

    console.log('\n📊 Current user status breakdown:');
    userStatusCounts.forEach((status: { accountStatus: string; _count: { id: number } }) => {
      console.log(`   ${status.accountStatus}: ${status._count.id} users`);
    });

    // Show summary of current vendor statuses
    const vendorStatusCounts = await prisma.vendor.groupBy({
      by: ['vendorStatus'],
      _count: {
        id: true
      }
    });

    console.log('\n📊 Current vendor status breakdown:');
    vendorStatusCounts.forEach((status: { vendorStatus: string; _count: { id: number } }) => {
      console.log(`   ${status.vendorStatus}: ${status._count.id} vendors`);
    });

    console.log('\n🎉 Status update completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Visit /admin/users to manage user statuses');
    console.log('   2. Visit /admin/vendors to manage vendor statuses');
    console.log('   3. New users will have PENDING status by default');
    console.log('   4. Blocked/suspended users cannot create products');

  } catch (error) {
    console.error('❌ Error updating user and vendor statuses:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateExistingUsersAndVendors();
}

export { updateExistingUsersAndVendors };
