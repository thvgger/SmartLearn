import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { randomBytes } from "crypto";

// GET  — List all license keys for the current user
// POST — Generate a new license key
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keys = await prisma.licenseKey.findMany({
      where: { user_id: session.userId },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json({ keys });
  } catch (error) {
    console.error("License fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const device_name = (body as { device_name?: string }).device_name || null;

    // Generate a unique license key like: SL-XXXX-XXXX-XXXX-XXXX
    const raw = randomBytes(8).toString("hex").toUpperCase();
    const key = `SL-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`;

    const license = await prisma.licenseKey.create({
      data: {
        user_id: session.userId,
        key,
        device_name,
      },
    });

    return NextResponse.json({ key: license });
  } catch (error) {
    console.error("License generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE — Deactivate a license key
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "License key ID is required" },
        { status: 400 },
      );
    }

    // Ensure the key belongs to this user
    const license = await prisma.licenseKey.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!license) {
      return NextResponse.json(
        { error: "License key not found" },
        { status: 404 },
      );
    }

    await prisma.licenseKey.update({
      where: { id },
      data: { is_active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("License delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
