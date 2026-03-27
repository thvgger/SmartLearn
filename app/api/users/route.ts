import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET — List all users for the current dashboard account
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classFilter = searchParams.get("class");
    const roleFilter = searchParams.get("role");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = { user_id: session.userId };
    if (classFilter && classFilter !== "All") {
      where.class_name = classFilter;
    }
    if (roleFilter && roleFilter !== "All") {
      where.role = roleFilter;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.syncedUser.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Users fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST — Create a new user manually
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, class_name, role } = await req.json();

    if (!name || !role) {
      return NextResponse.json(
        { error: "Name and role are required" },
        { status: 400 }
      );
    }

    const user = await prisma.syncedUser.create({
      data: {
        user_id: session.userId,
        name,
        email: email || null,
        class_name: class_name || "Unassigned",
        role,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("User create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
