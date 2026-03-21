import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET — Get a single exam
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const exam = await prisma.exam.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({ exam });
  } catch (error) {
    console.error("Exam fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT — Update an exam
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.exam.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    const body = await req.json();
    const exam = await prisma.exam.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        subject: body.subject ?? existing.subject,
        question_count: body.question_count ?? existing.question_count,
        duration: body.duration ?? existing.duration,
        status: body.status ?? existing.status,
        scheduled_date: body.scheduled_date ? new Date(body.scheduled_date) : existing.scheduled_date,
        student_count: body.student_count ?? existing.student_count,
        avg_score: body.avg_score ?? existing.avg_score,
      },
    });

    return NextResponse.json({ exam });
  } catch (error) {
    console.error("Exam update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — Remove an exam
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.exam.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    await prisma.exam.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Exam delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
