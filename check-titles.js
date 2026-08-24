const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const user = await prisma.user.findFirst({ where: { email: 'thvgger005@gmail.com' } });
  const exams = await prisma.exam.findMany({ where: { user_id: user.id } });
  const nullTitles = exams.filter(e => !e.title);
  console.log('Null titles:', nullTitles.length);
}
run().finally(() => prisma.$disconnect());
