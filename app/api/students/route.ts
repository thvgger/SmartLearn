import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET — List all students for the current user
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classFilter = searchParams.get("class");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { user_id: session.userId };
    if (classFilter && classFilter !== "All") {
      where.class_name = classFilter;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const students = await prisma.student.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error("Students fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — Create a new student
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, class_name } = await req.json();

    if (!name || !class_name) {
      return NextResponse.json(
        { error: "Name and class are required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        user_id: session.userId,
        name,
        email: email || null,
        class_name,
      },
    });

    return NextResponse.json({ student }, { status: 201 });
  } catch (error) {
    console.error("Student create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
