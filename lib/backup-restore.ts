import { prisma } from "@/lib/db";

async function processDeltaSync(sessionUserId: string, changes: any[]) {
  try {
    return await prisma.$transaction(async (tx: any) => {
      for (const change of changes) {
        const { table, id, action, data } = change;
        
        if (table === 'users' && data?.role !== 'admin') {
          if (action === 'DELETE') {
            await tx.syncedUser.deleteMany({ where: { user_id: sessionUserId, local_id: id } });
          } else {
            await tx.syncedUser.upsert({
              where: { user_id_local_id: { user_id: sessionUserId, local_id: id } },
              update: {
                name: data.name || "Unknown User",
                email: data.email || null,
                password: data.plain_password || data.password || null,
                role: data.role || "student",
                class_name: "Unassigned", // Can map class later if needed
              },
              create: {
                user_id: sessionUserId,
                local_id: id,
                name: data.name || "Unknown User",
                email: data.email || null,
                password: data.plain_password || data.password || null,
                role: data.role || "student",
                class_name: "Unassigned",
              }
            });
          }
        }
        
        if (table === 'tests') {
          if (action === 'DELETE') {
            await tx.exam.deleteMany({ where: { user_id: sessionUserId, local_id: id } });
          } else {
            await tx.exam.upsert({
              where: { user_id_local_id: { user_id: sessionUserId, local_id: id } },
              update: {
                title: data.title || "Untitled Exam",
                subject: data.description || "General",
                duration: data.duration_minutes ? `${data.duration_minutes}m` : "1h",
                status: data.is_active ? "scheduled" : "completed",
              },
              create: {
                user_id: sessionUserId,
                local_id: id,
                title: data.title || "Untitled Exam",
                subject: data.description || "General",
                duration: data.duration_minutes ? `${data.duration_minutes}m` : "1h",
                status: data.is_active ? "scheduled" : "completed",
              }
            });
          }
        }
        
        if (table === 'questions') {
          if (action === 'DELETE') {
            await tx.question.deleteMany({ where: { user_id: sessionUserId, local_id: id } });
          } else {
            const optionsArray = data ? [data.option_a, data.option_b, data.option_c, data.option_d].filter(Boolean) : [];
            await tx.question.upsert({
              where: { user_id_local_id: { user_id: sessionUserId, local_id: id } },
              update: {
                exam_id: data.test_id || 0,
                text: data.question_text || "Unknown Question",
                options: JSON.stringify(optionsArray.length > 0 ? optionsArray : []),
                answer: data.correct_answer || "",
              },
              create: {
                user_id: sessionUserId,
                local_id: id,
                exam_id: data.test_id || 0,
                subject: "General",
                topic: "General",
                text: data.question_text || "Unknown Question",
                options: JSON.stringify(optionsArray.length > 0 ? optionsArray : []),
                answer: data.correct_answer || "",
              }
            });
          }
        }
        
        if (table === 'test_attempts') {
          if (action === 'DELETE') {
            await tx.testAttempt.deleteMany({ where: { user_id: sessionUserId, local_id: id } });
          } else {
            await tx.testAttempt.upsert({
              where: { user_id_local_id: { user_id: sessionUserId, local_id: id } },
              update: {
                student_id: data.user_id,
                exam_id: data.test_id,
                score: data.score,
              },
              create: {
                user_id: sessionUserId,
                local_id: id,
                student_id: data.user_id,
                exam_id: data.test_id,
                score: data.score,
              }
            });
          }
        }
      }
      
      // Recalculate aggregates if test_attempts or tests were modified
      const hasAttemptsOrTests = changes.some(c => c.table === 'test_attempts' || c.table === 'tests' || c.table === 'questions');
      if (hasAttemptsOrTests) {
        const exams = await tx.exam.findMany({ where: { user_id: sessionUserId } });
        for (const exam of exams) {
          const agg = await tx.testAttempt.aggregate({
            where: { user_id: sessionUserId, exam_id: exam.local_id },
            _avg: { score: true },
          });
          // Group by student to get unique count
          const uniqueStudents = await tx.testAttempt.groupBy({
            by: ['student_id'],
            where: { user_id: sessionUserId, exam_id: exam.local_id },
          });
          const qCount = await tx.question.count({
             where: { user_id: sessionUserId, exam_id: exam.local_id }
          });
          
          await tx.exam.update({
            where: { id: exam.id },
            data: {
              student_count: uniqueStudents.length,
              avg_score: agg._avg.score || 0,
              question_count: qCount,
            }
          });
        }
      }
    });
  } catch (error) {
    console.error("[Delta Sync] Critical error processing payload:", error);
    throw new Error("Delta Sync Failed: " + (error as Error).message);
  }
}

export async function rebuildDashboardData(sessionUserId: string, parsedData: any) {
  if (parsedData.is_delta || Array.isArray(parsedData)) {
    const changes = Array.isArray(parsedData) ? parsedData : parsedData.data;
    const parsedChanges = typeof changes === 'string' ? JSON.parse(changes) : changes;
    return await processDeltaSync(sessionUserId, parsedChanges);
  }

  // Get user's plan to enforce limits
  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    include: { subscription: true }
  });

  const rawPlan = user?.subscription?.plan || "free";
  const plan = rawPlan.replace("_yearly", "");

  // Define limits
  const STUDENT_LIMITS: Record<string, number> = {
    free: 15,
    starter: 100,
    school: 500,
    enterprise: 1000000, // effective unlimited
  };

  const QUESTION_LIMITS: Record<string, number> = {
    free: 0,
    starter: 500,
    school: 1000000,
    enterprise: 1000000,
  };

  const studentLimit = STUDENT_LIMITS[plan] || 15;
  const questionLimit = QUESTION_LIMITS[plan] || 0;

  return await prisma.$transaction(async (tx: any) => {
    // 1. Clear existing cloud data only if the payload includes them and it's the first chunk
    if (parsedData.users) {
      await tx.syncedUser.deleteMany({ where: { user_id: sessionUserId } });
    }
    if (parsedData.tests) {
      await tx.exam.deleteMany({ where: { user_id: sessionUserId } });
    }
    if (parsedData.questions && (parsedData.chunk_index === undefined || parsedData.chunk_index === 0)) {
      await tx.question.deleteMany({ where: { user_id: sessionUserId } });
    }

    // Build lookup maps
    const classMap = new Map();
    if (Array.isArray(parsedData.classes)) {
      parsedData.classes.forEach((c: any) => {
        classMap.set(c.id, c.name);
      });
    }

    // 2. Insert users (from `users`)
    if (Array.isArray(parsedData.users) && parsedData.users.length > 0) {
      let usersToInsert = parsedData.users.filter((u: any) => u.role !== "admin");
      
      // ENFORCE STUDENT LIMIT
      if (usersToInsert.length > studentLimit) {
        usersToInsert = usersToInsert.slice(0, studentLimit);
      }

      if (usersToInsert.length > 0) {
        const userData = usersToInsert.map((s: any) => {
          // calculate avg score if test_attempts exists
          let avg_score = 0;
          if (Array.isArray(parsedData.test_attempts)) {
            const attempts = parsedData.test_attempts.filter((a: any) => a.user_id === s.id);
            if (attempts.length > 0) {
              const total = attempts.reduce((acc: number, val: any) => acc + (val.score || 0), 0);
              avg_score = total / attempts.length;
            }
          }
            return {
              user_id: sessionUserId,
              name: s.name || "Unknown User",
              email: s.email || null,
              password: s.plain_password || s.password || null,
              role: s.role || "student",
              class_name: classMap.get(s.class_id) || "Unassigned",
              avg_score: avg_score,
            };
        });
        await tx.syncedUser.createMany({ data: userData });
      }
    }

    // 3. Insert exams (from `tests`)
    if (Array.isArray(parsedData.tests) && parsedData.tests.length > 0) {
      const examData = parsedData.tests.map((t: any) => {
        // Calculate student count and avg score from attempts
        let studentCount = 0;
        let avgScore: number | null = null;
        
        if (Array.isArray(parsedData.test_attempts)) {
          const attempts = parsedData.test_attempts.filter((a: any) => a.test_id === t.id);
          if (attempts.length > 0) {
            const uniqueUsers = new Set(attempts.map((a: any) => a.user_id));
            studentCount = uniqueUsers.size;
            const totalScore = attempts.reduce((acc: number, val: any) => acc + (val.score || 0), 0);
            avgScore = totalScore / attempts.length;
          }
        }

        // Count questions
        let qCount = 0;
        if (Array.isArray(parsedData.questions)) {
          qCount = parsedData.questions.filter((q: any) => q.test_id === t.id).length;
        }

        return {
          user_id: sessionUserId,
          title: t.title || "Untitled Exam",
          subject: t.description || "General",
          question_count: qCount,
          duration: t.duration_minutes ? `${t.duration_minutes}m` : "1h",
          status: t.is_active ? "scheduled" : "completed",
          student_count: studentCount,
          avg_score: avgScore,
          scheduled_date: t.created_at ? new Date(t.created_at) : new Date(),
        };
      });
      await tx.exam.createMany({ data: examData });
    }

    // 4. Insert questions (from `questions`)
    if (Array.isArray(parsedData.questions) && parsedData.questions.length > 0) {
      let questionsToInsert = parsedData.questions;

      // ENFORCE QUESTION LIMIT
      if (questionsToInsert.length > questionLimit) {
        questionsToInsert = questionsToInsert.slice(0, questionLimit);
      }

      if (questionsToInsert.length > 0) {
        const questionData = questionsToInsert.map((q: any) => {
          // Try to get subject from test
          let testSubject = "General";
          if (Array.isArray(parsedData.tests)) {
            const parentTest = parsedData.tests.find((t: any) => t.id === q.test_id);
            if (parentTest && parentTest.title) {
              testSubject = parentTest.title.split(" ")[0]; // rough guess
            }
          }

          const optionsArray = [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean);
          
          return {
            user_id: sessionUserId,
            subject: testSubject,
            topic: "General",
            text: q.question_text || "Unknown Question",
            options: JSON.stringify(optionsArray.length > 0 ? optionsArray : []),
            answer: q.correct_answer || "",
          };
        });
        await tx.question.createMany({ data: questionData });
      }
    }
  });
}
