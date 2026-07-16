// This is a seed file to populate the database with initial data
// Run with: pnpm db:seed

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Phones, laptops, tablets, and more',
        icon: '📱',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing, shoes, and accessories',
        icon: '👕',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home-garden' },
      update: {},
      create: {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Furniture, decor, and gardening',
        icon: '🏠',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports-outdoors' },
      update: {},
      create: {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sports equipment and outdoor gear',
        icon: '⚽',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'books-media' },
      update: {},
      create: {
        name: 'Books & Media',
        slug: 'books-media',
        description: 'Books, DVDs, and digital media',
        icon: '📚',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  console.log('🌱 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
