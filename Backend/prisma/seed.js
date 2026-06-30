require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with all 15 products (with exact IDs)...');

  const products = [
    {
      id: 'hero_combo', name: '20 Sachets Combo', slug: '20-sachets-combo', category: 'Hero', flavorType: 'Mixed', desc: 'Our flagship curated gift box containing all 4 core flavours (20 Sachets).', shortDesc: 'First Order Offer Available', image: '/assets/combo-pack.jpeg', price: 429, discountPrice: 349, stock: 100, orderNumber: 0, featured: true
    },
    {
      id: 'choc_10', name: 'Chocolate 10 Sachets', slug: 'chocolate-10-sachets', category: '10 Sachets', flavorType: 'Chocolate', desc: 'Rich cocoa infused black tea in convenient sachets.', shortDesc: 'Rich & Bold', image: '/images/New folder/choclate 10 sachets.png', price: 299, discountPrice: 199, stock: 100, orderNumber: 1, featured: true
    },
    {
      id: 'van_10', name: 'Vanilla 10 Sachets', slug: 'vanilla-10-sachets', category: '10 Sachets', flavorType: 'Vanilla', desc: 'Madagascar vanilla beans blended with premium black tea.', shortDesc: 'Smooth & Warm', image: '/images/New folder/vanila 10 sachets.png', price: 299, discountPrice: 199, stock: 100, orderNumber: 2, featured: true
    },
    {
      id: 'rose_10', name: 'Rose 10 Sachets', slug: 'rose-10-sachets', category: '10 Sachets', flavorType: 'Rose', desc: 'Organic rose petals for a delicate floral aroma.', shortDesc: 'Floral & Delicate', image: '/images/New folder/rose10 sachets.png', price: 299, discountPrice: 219, stock: 100, orderNumber: 3, featured: true
    },
    {
      id: 'butt_10', name: 'Butterscotch 10 Sachets', slug: 'butterscotch-10-sachets', category: '10 Sachets', flavorType: 'Butterscotch', desc: 'Toasted sugar and caramel notes in a soothing blend.', shortDesc: 'Sweet & Indulgent', image: '/images/New folder/butterscotch 10 sachets.png', price: 299, discountPrice: 219, stock: 100, orderNumber: 4, featured: true
    },
    {
      id: 'combo_10', name: '10 Sachets Combo', slug: '10-sachets-combo', category: '10 Sachets', flavorType: 'Mixed', desc: 'Experience all 4 signature flavours in one perfect gift box.', shortDesc: 'Best Value Collection', image: '/images/New folder/10 satches combo.png', price: 899, discountPrice: 799, stock: 50, orderNumber: 5, featured: true
    },
    {
      id: 'choc_100', name: 'Chocolate 100gm', slug: 'chocolate-100gm', category: '100gm Packs', flavorType: 'Chocolate', desc: 'Rich cocoa infused loose leaf black tea.', shortDesc: 'Rich & Bold', image: '/images/New folder/choclate 100 gm.png', price: 219, discountPrice: 149, stock: 100, orderNumber: 6, featured: true
    },
    {
      id: 'van_100', name: 'Vanilla 100gm', slug: 'vanilla-100gm', category: '100gm Packs', flavorType: 'Vanilla', desc: 'Madagascar vanilla beans with loose leaf black tea.', shortDesc: 'Smooth & Warm', image: '/images/New folder/vanila100 gm.png', price: 249, discountPrice: 149, stock: 100, orderNumber: 7, featured: true
    },
    {
      id: 'rose_100', name: 'Rose 100gm', slug: 'rose-100gm', category: '100gm Packs', flavorType: 'Rose', desc: 'Organic rose petals in loose leaf premium black tea.', shortDesc: 'Floral & Delicate', image: '/images/New folder/rose 100 gm.png', price: 299, discountPrice: 179, stock: 100, orderNumber: 8, featured: true
    },
    {
      id: 'butt_100', name: 'Butterscotch 100gm', slug: 'butterscotch-100gm', category: '100gm Packs', flavorType: 'Butterscotch', desc: 'Toasted sugar and caramel notes in loose leaf format.', shortDesc: 'Sweet & Indulgent', image: '/images/New folder/butterscotch 100 gm.png', price: 299, discountPrice: 179, stock: 100, orderNumber: 9, featured: true
    },
    {
      id: 'combo_100', name: '100gm Combo', slug: '100gm-combo', category: '100gm Packs', flavorType: 'Mixed', desc: 'The complete artisan collection for everyday brewing.', shortDesc: 'Most Popular', image: '/images/New folder/100 gm combo.png', price: 699, discountPrice: 499, stock: 50, orderNumber: 10, featured: true
    },
    {
      id: 'choc_jar', name: 'Chocolate Jar', slug: 'chocolate-jar', category: 'Premium Jars', flavorType: 'Chocolate', desc: 'Rich cocoa infused black tea in a premium glass jar.', shortDesc: 'Rich & Bold', image: '/images/New folder/choclate jar.png', price: 849, discountPrice: 649, stock: 100, orderNumber: 11, featured: true
    },
    {
      id: 'van_jar', name: 'Vanilla Jar', slug: 'vanilla-jar', category: 'Premium Jars', flavorType: 'Vanilla', desc: 'Madagascar vanilla beans in a premium glass jar.', shortDesc: 'Smooth & Warm', image: '/images/New folder/vanila jar.png', price: 849, discountPrice: 649, stock: 100, orderNumber: 12, featured: true
    },
    {
      id: 'rose_jar', name: 'Rose Jar', slug: 'rose-jar', category: 'Premium Jars', flavorType: 'Rose', desc: 'Organic rose petals in a premium glass jar.', shortDesc: 'Floral & Delicate', image: '/images/New folder/rose jar.png', price: 899, discountPrice: 699, stock: 100, orderNumber: 13, featured: true
    },
    {
      id: 'butt_jar', name: 'Butterscotch Jar', slug: 'butterscotch-jar', category: 'Premium Jars', flavorType: 'Butterscotch', desc: 'Toasted sugar and caramel notes in a premium glass jar.', shortDesc: 'Sweet & Indulgent', image: '/images/New folder/buttercoth jar.png', price: 899, discountPrice: 699, stock: 100, orderNumber: 14, featured: true
    },
    {
      id: 'combo_jar', name: 'Jar Combo', slug: 'jar-combo', category: 'Premium Jars', flavorType: 'Mixed', desc: 'The ultimate reserve collection crafted for true tea lovers.', shortDesc: 'Gift Collection', image: '/images/New folder/jar combo.png', price: 3499, discountPrice: 1999, stock: 25, orderNumber: 15, featured: true
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
