import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Authenticate the CBT application via license key
async function getLicenseUser(licenseKey: string) {
  const license = await prisma.licenseKey.findUnique({
    where: { key: licenseKey },
    include: {
      user: { include: { subscription: true } },
    },
  });

  if (!license || !license.is_active) return null;

  const sub = license.user.subscription;
  if (
    !sub ||
    (sub.status !== "active" && sub.plan !== "free") ||
    (sub.expires_at && new Date(sub.expires_at) < new Date())
  ) {
    return null;
  }

  return license.user;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const licenseKey = searchParams.get("license_key");

    if (!licenseKey) {
      return NextResponse.json({ error: "Missing license key" }, { status: 400 });
    }

    const user = await getLicenseUser(licenseKey);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or inactive license" },
        { status: 403 }
      );
    }

    // Fetch cloud-managed exams and questions that belong to this school
    // In our scenario, we consider all exams that are NOT completed as active and potentially updated
    // Alternatively, just pull all exams and questions since the size is generally manageable
    const exams = await prisma.exam.findMany({
      where: { user_id: user.id },
    });

    // Fetch teachers (SyncedUsers with role teacher) to manually map emails
    const teachers = await prisma.syncedUser.findMany({
      where: { user_id: user.id, role: "teacher" },
      select: { id: true, email: true }
    });
    const teacherMap = new Map(teachers.map(t => [t.id, t.email]));

    const questions = await prisma.question.findMany({
      where: { user_id: user.id },
    });
    return NextResponse.json({
      success: true,
      data: {
        tests: exams.map((ex) => ({
          cloud_id: ex.id,
          id: (ex as any).local_id || ex.id,
          teacher_email: ex.teacher_id ? teacherMap.get(ex.teacher_id) || "" : "",
          title: ex.title,
          description: ex.subject,
          duration_minutes: parseInt((ex.duration || "60").replace(/\D/g, "")) || 60,
          passing_score: 50, // default placeholder
          is_active: ex.status !== "completed",
          created_at: ex.created_at,
        })),
        questions: questions.map((q) => {
          const parentExam = exams.find((e) => (e as any).local_id === q.exam_id || e.id === q.topic);
          let parsedOpts = [];
          try {
            parsedOpts = JSON.parse(q.options || "[]");
          } catch (err) {
            parsedOpts = [];
          }
          
          return {
            cloud_id: q.id,
            id: (q as any).local_id || q.id,
            test_id: parentExam ? ((parentExam as any).local_id || parentExam.id) : q.topic,
            test_title: parentExam ? parentExam.title : q.topic,
            question_text: q.text,
            options: parsedOpts,
            correct_answer: q.answer,
            attachment_url: q.attachment_url,
            attachment_type: q.attachment_type,
            topic: q.topic,
            created_at: q.created_at,
          };
        }),
      },
    });
  } catch (error) {
    console.error("Sync down error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
