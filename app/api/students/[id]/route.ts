import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET — Get a single student
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
    const student = await prisma.student.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error("Student fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT — Update a student
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
    const existing = await prisma.student.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const body = await req.json();
    const student = await prisma.student.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        email: body.email ?? existing.email,
        class_name: body.class_name ?? existing.class_name,
        avg_score: body.avg_score ?? existing.avg_score,
      },
    });

    return NextResponse.json({ student });
  } catch (error) {
    console.error("Student update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — Remove a student
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
    const existing = await prisma.student.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await prisma.student.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Student delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
