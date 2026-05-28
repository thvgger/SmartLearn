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

    const questions = await prisma.question.findMany({
      where: { user_id: user.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        tests: exams.map((ex) => ({
          id: ex.id,
          title: ex.title,
          description: ex.subject,
          duration_minutes: parseInt(ex.duration.replace(/\D/g, "")) || 60,
          passing_score: 50, // default placeholder
          is_active: ex.status !== "completed",
          created_at: ex.created_at,
        })),
        questions: questions.map((q) => ({
          id: q.id,
          test_id: q.subject, // Map relation appropriately downwards
          question_text: q.text,
          options: JSON.parse(q.options || "[]"),
          correct_answer: q.answer,
          topic: q.topic,
          created_at: q.created_at,
        })),
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
