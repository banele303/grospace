/**
 * Test script to verify the Articles system is working
 * Run this with: npm run test-articles
 */

import { prisma } from '../lib/db';

async function testArticlesSystem() {
  console.log('🧪 Testing Articles System...\n');

  try {
    // 1. Check if Article model exists and can be queried
    console.log('1. Testing Article model...');
    const articleCount = await prisma.article.count();
    console.log(`✅ Found ${articleCount} articles in database\n`);

    // 2. Test creating an article (if admin user exists)
    console.log('2. Looking for admin users...');
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true, firstName: true, lastName: true, email: true }
    });
    
    if (adminUsers.length === 0) {
      console.log('⚠️  No admin users found. You need to set a user role to ADMIN first.');
      console.log('   Run this SQL command in your database:');
      console.log('   UPDATE "User" SET role = \'ADMIN\' WHERE email = \'your-email@example.com\';');
    } else {
      console.log(`✅ Found ${adminUsers.length} admin user(s):`);
      interface AdminUser {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      }

      adminUsers.forEach((admin: AdminUser) => {
        console.log(`   - ${admin.firstName} ${admin.lastName} (${admin.email})`);
      });
    }

    console.log('\n3. Testing article creation...');
    
    if (adminUsers.length > 0) {
      // Create a test article
      const testArticle = await prisma.article.create({
        data: {
          title: 'Test Article - Welcome to Our Blog',
          slug: 'test-article-welcome',
          content: `# Welcome to Our Blog

This is a test article to demonstrate the articles system is working correctly.

## Features

- ✅ Admin-only article creation
- ✅ Rich content support
- ✅ Tags and categories
- ✅ Featured images
- ✅ Draft/Published status
- ✅ SEO-friendly URLs

## Getting Started

You can now create and manage articles from the admin panel at /admin/articles.

---

*This is a test article created automatically.*`,
          excerpt: 'A test article demonstrating the new articles system functionality.',
          published: true,
          publishedAt: new Date(),
          authorId: adminUsers[0].id,
          tags: ['test', 'welcome', 'blog'],
          featuredImage: '/all.jpeg'
        },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      console.log(`✅ Created test article: "${testArticle.title}"`);
      console.log(`   - Author: ${testArticle.author.firstName} ${testArticle.author.lastName}`);
      console.log(`   - Slug: ${testArticle.slug}`);
      console.log(`   - Published: ${testArticle.published}`);
      console.log(`   - Tags: ${testArticle.tags.join(', ')}`);
      
      console.log('\n4. Testing article retrieval...');
      
      // Test retrieving published articles
      const publishedArticles = await prisma.article.findMany({
        where: { published: true },
        include: {
          author: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });
      
      console.log(`✅ Retrieved ${publishedArticles.length} published articles`);
      
      console.log('\n🎉 Articles system test completed successfully!');
      console.log('\n📝 Next steps:');
      console.log('   1. Visit /admin/articles to manage articles');
      console.log('   2. Visit /articles to view published articles');
      console.log(`   3. Visit /articles/${testArticle.slug} to view the test article`);
      
    } else {
      console.log('⚠️  Skipping article creation test - no admin users available');
    }

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testArticlesSystem();
}

export { testArticlesSystem };
