const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.findFirst({
    where: { slug: '20-sachets-combo' }
  });
  
  if (product) {
    await prisma.product.update({
      where: { id: product.id },
      data: { image: '/images/combo_new.png' }
    });
    console.log('Updated 20-sachets-combo image.');
  } else {
    console.log('Product not found.');
    const all = await prisma.product.findMany();
    console.log('Available slugs:', all.map(p => p.slug));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
