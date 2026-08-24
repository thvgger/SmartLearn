const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
async function processDeltaSync(sessionUserId, changes) {
  try {
    return await prisma.$transaction(async (tx) => {
      // Group changes
      const groups = {
        users: { INSERT: [], UPDATE: [], DELETE: [] },
        tests: { INSERT: [], UPDATE: [], DELETE: [] },
        questions: { INSERT: [], UPDATE: [], DELETE: [] },
        test_attempts: { INSERT: [], UPDATE: [], DELETE: [] }
      };
      
      for (const change of changes) {
        if (groups[change.table] && groups[change.table][change.action]) {
          groups[change.table][change.action].push(change);
        }
      }

      console.log('Groups lengths:', {
        users: groups.users.INSERT.length,
        tests: groups.tests.INSERT.length,
        questions: groups.questions.INSERT.length,
        test_attempts: groups.test_attempts.INSERT.length
      });

      // Process DELETES (Bulk)
      if (groups.users.DELETE.length) await tx.syncedUser.deleteMany({ where: { user_id: sessionUserId, local_id: { in: groups.users.DELETE.map(c => c.id) } } });
      if (groups.tests.DELETE.length) await tx.exam.deleteMany({ where: { user_id: sessionUserId, local_id: { in: groups.tests.DELETE.map(c => c.id) } } });
      if (groups.questions.DELETE.length) await tx.question.deleteMany({ where: { user_id: sessionUserId, local_id: { in: groups.questions.DELETE.map(c => c.id) } } });
      if (groups.test_attempts.DELETE.length) await tx.testAttempt.deleteMany({ where: { user_id: sessionUserId, local_id: { in: groups.test_attempts.DELETE.map(c => c.id) } } });

      // Process INSERTS (Bulk createMany)
      if (groups.users.INSERT.length) {
        await tx.syncedUser.createMany({
          skipDuplicates: true,
          data: groups.users.INSERT.filter(c => c.data?.role !== 'admin').map(c => ({
            user_id: sessionUserId, local_id: c.id,
            name: c.data.name || "Unknown", email: c.data.email || null,
            password: c.data.plain_password || c.data.password || null,
            role: c.data.role || "student", class_name: "Unassigned"
          }))
        });
        console.log('Inserted users');
      }
      if (groups.tests.INSERT.length) {
        await tx.exam.createMany({
          skipDuplicates: true,
          data: groups.tests.INSERT.map(c => ({
            user_id: sessionUserId, local_id: c.id,
            title: c.data.title || "Untitled", subject: c.data.description || "General",
            duration: c.data.duration_minutes ? `${c.data.duration_minutes}m` : "1h",
            status: c.data.is_active ? "scheduled" : "completed"
          }))
        });
        console.log('Inserted tests');
      }
      if (groups.questions.INSERT.length) {
        await tx.question.createMany({
          skipDuplicates: true,
          data: groups.questions.INSERT.map(c => {
            const opts = c.data ? [c.data.option_a, c.data.option_b, c.data.option_c, c.data.option_d].filter(Boolean) : [];
            return {
              user_id: sessionUserId, local_id: c.id, exam_id: c.data.test_id || 0,
              subject: "General", topic: "General", text: c.data.question_text || "Unknown",
              options: JSON.stringify(opts.length > 0 ? opts : []), answer: c.data.correct_answer || ""
            };
          })
        });
        console.log('Inserted questions');
      }
      if (groups.test_attempts.INSERT.length) {
        await tx.testAttempt.createMany({
          skipDuplicates: true,
          data: groups.test_attempts.INSERT.map(c => ({
            user_id: sessionUserId, local_id: c.id,
            student_id: c.data.user_id, exam_id: c.data.test_id, score: c.data.score
          }))
        });
        console.log('Inserted test_attempts');
      }
    }, {
      maxWait: 15000,
      timeout: 60000
    });
  } catch (error) {
    console.error("[Delta Sync] Critical error processing payload:", error);
  }
}

async function run() {
  const payload = JSON.parse(fs.readFileSync('payload.json', 'utf8'));
  const changes = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
  await processDeltaSync('cmq0q08ua0000ic0auitfx7vb', changes); // thvgger005
}

run().finally(() => prisma.$disconnect());
