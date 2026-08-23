const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function wipe() {
  await prisma.syncedUser.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.question.deleteMany({});
  console.log('Wiped synced data');
}
wipe().finally(() => prisma.$disconnect());
