const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const user = await prisma.user.findFirst({ where: { email: 'thvgger005@gmail.com' } });
  const exams = await prisma.exam.findMany({ where: { user_id: user.id } });
  console.log('Exams found:', exams.length);
  const questions = await prisma.question.count({ where: { user_id: user.id } });
  console.log('Questions found:', questions);
}
run().finally(() => prisma.$disconnect());
