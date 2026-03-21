import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET — List questions with optional subject filter + counts per subject
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const subject = searchParams.get("subject");
    const countsOnly = searchParams.get("counts");

    // If ?counts=true, return grouped counts by subject
    if (countsOnly === "true") {
      const counts = await prisma.question.groupBy({
        by: ["subject"],
        where: { user_id: session.userId },
        _count: { id: true },
      });

      const total = counts.reduce((sum, c) => sum + c._count.id, 0);

      return NextResponse.json({
        counts: counts.map((c) => ({
          subject: c.subject,
          count: c._count.id,
        })),
        total,
      });
    }

    // Otherwise, list questions
    const where: Record<string, unknown> = { user_id: session.userId };
    if (subject) {
      where.subject = subject;
    }

    const questions = await prisma.question.findMany({
      where,
      orderBy: { created_at: "desc" },
      take: 100,
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Questions fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — Create a new question
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, topic, text, options, answer } = await req.json();

    if (!subject || !topic || !text || !answer) {
      return NextResponse.json(
        { error: "Subject, topic, text, and answer are required" },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        user_id: session.userId,
        subject,
        topic,
        text,
        options: JSON.stringify(options || []),
        answer,
      },
    });

    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error("Question create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
