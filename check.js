const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const licenses = await prisma.licenseKey.findMany({ include: { user: { include: { subscription: true } } } });
  console.dir(licenses, { depth: null });
}
run().finally(() => prisma.$disconnect());
