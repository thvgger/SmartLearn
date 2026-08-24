import { prisma } from "@/lib/db";

async function processDeltaSync(sessionUserId: string, changes: any[]) {
  try {
    return await prisma.$transaction(async (tx: any) => {
      // Group changes
      const groups: Record<string, Record<string, any[]>> = {
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

      // Process DELETES (Bulk)
      if (groups.users.DELETE.length) await tx.syncedUser.deleteMany({ where: { user_id: sessionUserId, local_id: { in: groups.users.DELETE.map(c => c.id) } } });
      if (groups.tests.DELETE.length) await tx.exam.deleteMany({ where: { user_id: sessionUserId, local_id: { in: groups.tests.DELETE.map(c => c.id) } } });
      if (groups.questions.DELETE.length) await tx.question.deleteMany({ where: { user_id: sessionUserId, local_id: { in: groups.questions.DELETE.map(c => c.id) } } });
      if (groups.test_attempts.DELETE.length) await tx.testAttempt.deleteMany({ where: { user_id: sessionUserId, local_id: { in: groups.test_attempts.DELETE.map(c => c.id) } } });
      
      const syncedUsers = await tx.syncedUser.findMany({ where: { user_id: sessionUserId } });
      const localToCuid = new Map(syncedUsers.map((u: any) => [u.local_id, u.id]));

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
      }
      if (groups.tests.INSERT.length) {
        await tx.exam.createMany({
          skipDuplicates: true,
          data: groups.tests.INSERT.map(c => ({
            user_id: sessionUserId, local_id: c.id,
            title: c.data.title || "Untitled", subject: c.data.description || "General",
            duration: c.data.duration_minutes ? `${c.data.duration_minutes}m` : "1h",
            status: c.data.is_active ? "scheduled" : "completed",
            passing_score: c.data.passing_score ?? 70,
            calculator_type: c.data.calculator_type ?? "none",
            randomize_questions: Boolean(c.data.randomize_questions),
            randomize_options: Boolean(c.data.randomize_options),
            teacher_id: c.data.created_by ? (localToCuid.get(c.data.created_by) || null) : null
          }))
        });
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
      }
      if (groups.test_attempts.INSERT.length) {
        await tx.testAttempt.createMany({
          skipDuplicates: true,
          data: groups.test_attempts.INSERT.map(c => ({
            user_id: sessionUserId, local_id: c.id,
            student_id: c.data.user_id, exam_id: c.data.test_id, score: c.data.score
          }))
        });
      }

      // Process UPDATES (Individual)
      for (const c of groups.users.UPDATE.filter(c => c.data?.role !== 'admin')) {
        await tx.syncedUser.updateMany({
          where: { user_id: sessionUserId, local_id: c.id },
          data: { name: c.data.name, email: c.data.email, password: c.data.plain_password || c.data.password, role: c.data.role }
        });
      }
      for (const c of groups.tests.UPDATE) {
        await tx.exam.updateMany({
          where: { user_id: sessionUserId, local_id: c.id },
          data: { 
            title: c.data.title, 
            subject: c.data.description, 
            duration: c.data.duration_minutes ? `${c.data.duration_minutes}m` : "1h", 
            status: c.data.is_active ? "scheduled" : "completed",
            passing_score: c.data.passing_score ?? 70,
            calculator_type: c.data.calculator_type ?? "none",
            randomize_questions: Boolean(c.data.randomize_questions),
            randomize_options: Boolean(c.data.randomize_options),
            teacher_id: c.data.created_by ? (localToCuid.get(c.data.created_by) || null) : null
          }
        });
      }
      for (const c of groups.questions.UPDATE) {
        const opts = c.data ? [c.data.option_a, c.data.option_b, c.data.option_c, c.data.option_d].filter(Boolean) : [];
        await tx.question.updateMany({
          where: { user_id: sessionUserId, local_id: c.id },
          data: { exam_id: c.data.test_id || 0, text: c.data.question_text, options: JSON.stringify(opts.length > 0 ? opts : []), answer: c.data.correct_answer || "" }
        });
      }
      for (const c of groups.test_attempts.UPDATE) {
        await tx.testAttempt.updateMany({
          where: { user_id: sessionUserId, local_id: c.id },
          data: { student_id: c.data.user_id, exam_id: c.data.test_id, score: c.data.score }
        });
      }
      
      // Recalculate aggregates if test_attempts or tests were modified
      const hasAttemptsOrTests = changes.some((c: any) => c.table === 'test_attempts' || c.table === 'tests' || c.table === 'questions');
      if (hasAttemptsOrTests) {
        const exams = await tx.exam.findMany({ where: { user_id: sessionUserId } });
        await Promise.all(exams.map(async (exam: any) => {
          const [agg, uniqueStudents, qCount] = await Promise.all([
            tx.testAttempt.aggregate({
              where: { user_id: sessionUserId, exam_id: exam.local_id },
              _avg: { score: true },
            }),
            tx.testAttempt.groupBy({
              by: ['student_id'],
              where: { user_id: sessionUserId, exam_id: exam.local_id },
            }),
            tx.question.count({
              where: { user_id: sessionUserId, exam_id: exam.local_id }
            })
          ]);
          
          await tx.exam.update({
            where: { id: exam.id },
            data: {
              student_count: uniqueStudents.length,
              avg_score: agg._avg.score || 0,
              question_count: qCount,
            }
          });
        }));
      }
    }, {
      maxWait: 15000,
      timeout: 120000, // Increase transaction timeout to 120 seconds to be extremely safe
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
          let testTitle = "General";
          if (Array.isArray(parsedData.tests)) {
            const parentTest = parsedData.tests.find((t: any) => t.id === q.test_id);
            if (parentTest && parentTest.title) {
              testSubject = parentTest.title.split(" ")[0]; // rough guess
              testTitle = parentTest.title;
            }
          }

          const optionsArray = [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean);
          
          return {
            user_id: sessionUserId,
            subject: testSubject,
            topic: testTitle,
            text: q.question_text || "Unknown Question",
            options: JSON.stringify(optionsArray.length > 0 ? optionsArray : []),
            answer: q.correct_answer || "",
          };
        });
        await tx.question.createMany({ data: questionData });
      }
    }
  }, {
    maxWait: 15000,
    timeout: 60000, // Increase transaction timeout to 60 seconds
  });
}

