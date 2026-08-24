const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  await prisma.subscription.updateMany({
    data: {
      expires_at: new Date('2026-12-31T23:59:59Z')
    }
  });
  console.log('Subscriptions renewed to Dec 2026');
}
run().finally(() => prisma.$disconnect());
