import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET — List all exams for the current user
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { user_id: session.userId };
    if (status && status !== "all") {
      where.status = status;
    }
    if (search) {
      where.title = { contains: search, mode: "insensitive" };
    }

    const exams = await prisma.exam.findMany({
      where,
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ exams });
  } catch (error) {
    console.error("Exams fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — Create a new exam
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, subject, question_count, duration, status, scheduled_date, student_count } =
      await req.json();

    if (!title || !subject) {
      return NextResponse.json(
        { error: "Title and subject are required" },
        { status: 400 }
      );
    }

    const exam = await prisma.exam.create({
      data: {
        user_id: session.userId,
        title,
        subject,
        question_count: question_count || 0,
        duration: duration || "1h",
        status: status || "draft",
        scheduled_date: scheduled_date ? new Date(scheduled_date) : null,
        student_count: student_count || 0,
      },
    });

    return NextResponse.json({ exam }, { status: 201 });
  } catch (error) {
    console.error("Exam create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
