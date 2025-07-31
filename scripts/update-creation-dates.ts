import { PrismaClient } from '@prisma/client';
import { subDays, addHours, addMinutes } from 'date-fns';

const prisma = new PrismaClient();

/**
 * Generate random date within the last 7 days
 */
function getRandomDateInLastWeek(): Date {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7); // 0-6 days ago
  const hoursAgo = Math.floor(Math.random() * 24); // 0-23 hours ago
  const minutesAgo = Math.floor(Math.random() * 60); // 0-59 minutes ago
  
  let date = subDays(now, daysAgo);
  date = addHours(date, -hoursAgo);
  date = addMinutes(date, -minutesAgo);
  
  return date;
}

/**
 * Update creation dates for various models to be spread across the last week
 */
async function updateCreationDates() {
  try {
    console.log('🕐 Starting to update creation dates...\n');

    // Update Users
    console.log('📱 Updating user creation dates...');
    const users = await prisma.user.findMany({
      select: { id: true }
    });
    
    let userUpdates = 0;
    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          createdAt: getRandomDateInLastWeek(),
          updatedAt: getRandomDateInLastWeek()
        }
      });
      userUpdates++;
    }
    console.log(`✅ Updated ${userUpdates} users\n`);

    // Update Vendors
    console.log('🏢 Updating vendor creation dates...');
    const vendors = await prisma.vendor.findMany({
      select: { id: true }
    });
    
    let vendorUpdates = 0;
    for (const vendor of vendors) {
      await prisma.vendor.update({
        where: { id: vendor.id },
        data: { 
          createdAt: getRandomDateInLastWeek(),
          updatedAt: getRandomDateInLastWeek()
        }
      });
      vendorUpdates++;
    }
    console.log(`✅ Updated ${vendorUpdates} vendors\n`);

    // Update Products
    console.log('📦 Updating product creation dates...');
    const products = await prisma.product.findMany({
      select: { id: true }
    });
    
    let productUpdates = 0;
    for (const product of products) {
      await prisma.product.update({
        where: { id: product.id },
        data: { 
          createdAt: getRandomDateInLastWeek(),
          updatedAt: getRandomDateInLastWeek()
        }
      });
      productUpdates++;
    }
    console.log(`✅ Updated ${productUpdates} products\n`);

    // Update Orders
    console.log('🛒 Updating order creation dates...');
    const orders = await prisma.order.findMany({
      select: { id: true }
    });
    
    let orderUpdates = 0;
    for (const order of orders) {
      const orderDate = getRandomDateInLastWeek();
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          createdAt: orderDate,
          updatedAt: orderDate
        }
      });
      orderUpdates++;
    }
    console.log(`✅ Updated ${orderUpdates} orders\n`);

    // Update Order Items
    console.log('📋 Updating order item creation dates...');
    const orderItems = await prisma.orderItem.findMany({
      include: { order: true }
    });
    
    let orderItemUpdates = 0;
    for (const orderItem of orderItems) {
      // Use the same date as the parent order, or slightly after
      const baseDate = orderItem.order.createdAt;
      const itemDate = addMinutes(baseDate, Math.floor(Math.random() * 30)); // 0-30 minutes after order
      
      await prisma.orderItem.update({
        where: { id: orderItem.id },
        data: { 
          createdAt: itemDate
          // OrderItem model doesn't have an updatedAt field
        }
      });
      orderItemUpdates++;
    }
    console.log(`✅ Updated ${orderItemUpdates} order items\n`);

    // Update Product Views
    console.log('👀 Updating product view creation dates...');
    const productViews = await prisma.productView.findMany({
      select: { id: true }
    });
    
    let viewUpdates = 0;
    for (const view of productViews) {
      await prisma.productView.update({
        where: { id: view.id },
        data: { 
          viewedAt: getRandomDateInLastWeek()
        }
      });
      viewUpdates++;
    }
    console.log(`✅ Updated ${viewUpdates} product views\n`);

    // Update Reviews
    console.log('⭐ Updating review creation dates...');
    const reviews = await prisma.review.findMany({
      select: { id: true }
    });
    
    let reviewUpdates = 0;
    for (const review of reviews) {
      await prisma.review.update({
        where: { id: review.id },
        data: { 
          createdAt: getRandomDateInLastWeek(),
          updatedAt: getRandomDateInLastWeek()
        }
      });
      reviewUpdates++;
    }
    console.log(`✅ Updated ${reviewUpdates} reviews\n`);

    console.log('🎉 All creation dates updated successfully!');
    console.log(`📊 Summary:
    - Users: ${userUpdates}
    - Vendors: ${vendorUpdates}
    - Products: ${productUpdates}
    - Orders: ${orderUpdates}
    - Order Items: ${orderItemUpdates}
    - Product Views: ${viewUpdates}
    - Reviews: ${reviewUpdates}
    `);

  } catch (error) {
    console.error('❌ Error updating creation dates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateCreationDates();
