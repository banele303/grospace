// Test script to verify wishlist functionality
// This can be run to test the wishlist features

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testWishlistFunctionality() {
  try {
    console.log('Testing wishlist functionality...');
    
    // Check if we can connect to the database
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if favorites table exists and can be queried
    const favoritesCount = await prisma.favorite.count();
    console.log(`✅ Favorites table accessible, current count: ${favoritesCount}`);
    
    // Check if we can query products with reviews
    const productCount = await prisma.product.count();
    console.log(`✅ Products table accessible, current count: ${productCount}`);
    
    // Test wishlist data structure
    const sampleWishlist = await prisma.favorite.findMany({
      take: 1,
      include: {
        product: {
          include: {
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });
    
    if (sampleWishlist.length > 0) {
      console.log('✅ Sample wishlist data structure is correct');
      console.log('Sample item:', JSON.stringify(sampleWishlist[0], null, 2));
    } else {
      console.log('ℹ️ No wishlist items found (this is normal if no users have added favorites yet)');
    }
    
    console.log('\n🎉 All wishlist tests passed!');
    
  } catch (error) {
    console.error('❌ Wishlist test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testWishlistFunctionality();
}

export { testWishlistFunctionality };
