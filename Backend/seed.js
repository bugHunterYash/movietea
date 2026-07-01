const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const count = await prisma.product.count();
  if (count === 0) {
    console.log('Database empty. Seeding initial products...');
    const products = [
      {
        name: 'Rose Tea',
        slug: 'rose-tea',
        price: 269,
        discountPrice: 219,
        stock: 100,
        orderNumber: 1,
        category: 'Premium Jars',
        flavorType: 'Floral',
        desc: 'Steeped in organic rose petals and hand-picked buds, this blend offers a soothing aroma and soft pink notes that linger elegantly.',
        shortDesc: 'Atelier Blend No. 01',
        image: '/assets/rose.jpeg',
        active: true,
        featured: true
      },
      {
        name: 'Chocolate Tea',
        slug: 'chocolate-tea',
        price: 269,
        discountPrice: 199,
        stock: 100,
        orderNumber: 2,
        category: 'Premium Jars',
        flavorType: 'Rich',
        desc: 'A decadent union of premium cocoa husks and single-origin black tea. Velvety smooth, dark chocolate aroma, and a warm body.',
        shortDesc: 'Atelier Blend No. 02',
        image: '/assets/chocolate.jpeg',
        active: true,
        featured: true
      },
      {
        name: 'Vanilla Tea',
        slug: 'vanilla-tea',
        price: 269,
        discountPrice: 199,
        stock: 100,
        orderNumber: 3,
        category: 'Premium Jars',
        flavorType: 'Sweet',
        desc: 'Infused with real Madagascar vanilla beans. Creamy, subtle sweetness, with a golden warmth that wraps you in pure comfort.',
        shortDesc: 'Atelier Blend No. 03',
        image: '/assets/vanilla.jpeg',
        active: true,
        featured: true
      },
      {
        name: 'Butterscotch Tea',
        slug: 'butterscotch-tea',
        price: 269,
        discountPrice: 219,
        stock: 100,
        orderNumber: 4,
        category: 'Premium Jars',
        flavorType: 'Caramel',
        desc: 'Indulge in sweet toasted sugar notes, rich butteriness, and a smooth caramel glaze that transforms every sip into pure luxury.',
        shortDesc: 'Atelier Blend No. 04',
        image: '/assets/butterscotch.jpeg',
        active: true,
        featured: true
      },
      {
        name: 'The Complete Atelier Collection (Combo Pack)',
        slug: 'combo-pack',
        price: 1076,
        discountPrice: 699,
        stock: 50,
        orderNumber: 5,
        category: 'Hero',
        flavorType: 'Combo',
        desc: 'Experience the entire MOVITEA collection. Includes all four premium blends: Rose, Chocolate, Vanilla, and Butterscotch. Save significantly when buying the complete set.',
        shortDesc: 'Complete Collection',
        image: '/assets/combo-pack.jpeg',
        active: true,
        featured: true
      }
    ];

    for (const p of products) {
      await prisma.product.create({ data: p });
    }
    console.log('Seeding complete.');
  }
}

module.exports = seed;
