const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.product.findUnique({where: {slug: '20-sachets-combo'}})
  .then(p => console.log(p))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
