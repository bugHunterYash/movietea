require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create products
  const products = [
    {
      name: 'Rose Atelier',
      slug: 'rose-atelier',
      price: 269,
      discountPrice: 219,
      stock: 120,
      orderNumber: 1,
      category: 'Loose Leaf',
      flavorType: 'Floral',
      desc: 'Premium black tea leaves infused with organic rose petals.',
      shortDesc: 'Delicate floral perfume in a cup.',
      image: '/assets/rose.jpeg',
      active: true,
      featured: true
    },
    {
      name: 'Cacao Reserve',
      slug: 'cacao-reserve',
      price: 269,
      discountPrice: 199,
      stock: 85,
      orderNumber: 2,
      category: 'Loose Leaf',
      flavorType: 'Decadent',
      desc: 'Decadent union of roasted cacao husks and single-origin black tea.',
      shortDesc: 'Rich, dark, and deeply comforting.',
      image: '/assets/chocolate.jpeg',
      active: true,
      featured: true
    },
    {
      name: 'Vanilla Orchid',
      slug: 'vanilla-orchid',
      price: 269,
      discountPrice: 199,
      stock: 95,
      orderNumber: 3,
      category: 'Loose Leaf',
      flavorType: 'Warm',
      desc: 'Organic black tea infused with premium Madagascar vanilla beans.',
      shortDesc: 'Silky smooth, warm orchid essence.',
      image: '/assets/vanilla.jpeg',
      active: true,
      featured: true
    },
    {
      name: 'Toasted Butterscotch',
      slug: 'toasted-butterscotch',
      price: 269,
      discountPrice: 219,
      stock: 64,
      orderNumber: 4,
      category: 'Loose Leaf',
      flavorType: 'Sweet',
      desc: 'Infuse sweet toasted sugar notes, rich buttery warmth, and caramel glaze.',
      shortDesc: 'Golden caramel and rich buttery warmth.',
      image: '/assets/butterscotch.jpeg',
      active: true,
      featured: true
    },
    {
      name: 'Assorted Atelier Combo Box',
      slug: 'assorted-atelier-combo',
      price: 429,
      discountPrice: 349,
      stock: 50,
      orderNumber: 5,
      category: 'Atelier Box',
      flavorType: 'Mixed',
      desc: 'Our flagship curated gift box containing all 4 core flavours. 20 sachets total.',
      shortDesc: 'Experience all 4 signature blends.',
      image: '/assets/combo-pack.jpeg',
      active: true,
      featured: true
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }

  console.log('Products seeded successfully!');

  // Create promo codes
  const promos = [
    {
      code: 'TEA50',
      discountAmount: 50,
      originalPrice: 349,
      discountedPrice: 299,
      validity: new Date('2026-12-31'),
      active: true
    },
    {
      code: 'WELCOME100',
      discountAmount: 100,
      originalPrice: 1899,
      discountedPrice: 1799,
      validity: new Date('2026-08-15'),
      active: true
    }
  ];

  for (const promo of promos) {
    await prisma.promoCode.upsert({
      where: { code: promo.code },
      update: promo,
      create: promo
    });
  }

  console.log('Promo codes seeded successfully!');
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
