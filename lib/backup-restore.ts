import { prisma } from "@/lib/db";

export async function rebuildDashboardData(sessionUserId: string, parsedData: any) {
  return await prisma.$transaction(async (tx: any) => {
    // 1. Clear existing cloud data
    await tx.syncedUser.deleteMany({ where: { user_id: sessionUserId } });
    await tx.exam.deleteMany({ where: { user_id: sessionUserId } });
    await tx.question.deleteMany({ where: { user_id: sessionUserId } });

    // Build lookup maps
    const classMap = new Map();
    if (Array.isArray(parsedData.classes)) {
      parsedData.classes.forEach((c: any) => {
        classMap.set(c.id, c.name);
      });
    }

    // 2. Insert users (from `users`)
    if (Array.isArray(parsedData.users) && parsedData.users.length > 0) {
      const usersToInsert = parsedData.users.filter((u: any) => u.role !== "admin");
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
      const questionData = parsedData.questions.map((q: any) => {
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
  });
}
