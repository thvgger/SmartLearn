import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { school_tag } = await req.json();

    if (!school_tag || school_tag.trim().length < 3) {
      return NextResponse.json(
        { error: "School tag must be at least 3 characters" },
        { status: 400 }
      );
    }

    // Sanitize: lowercase, no spaces, alphanumeric + hyphens only
    const sanitized = school_tag
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    if (sanitized.length < 3) {
      return NextResponse.json(
        { error: "School tag must contain at least 3 valid characters (letters, numbers, hyphens)" },
        { status: 400 }
      );
    }

    // Check uniqueness
    const existing = await prisma.user.findUnique({
      where: { school_tag: sanitized },
    });

    if (existing && existing.id !== session.userId) {
      return NextResponse.json(
        { error: "This school tag is already taken" },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { school_tag: sanitized },
    });

    return NextResponse.json({ success: true, school_tag: sanitized });
  } catch (error) {
    console.error("School tag update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
