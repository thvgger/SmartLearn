import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// DELETE — Revoke a license key by ID
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
    const license = await prisma.licenseKey.findFirst({
      where: { id, user_id: session.userId },
    });

    if (!license) {
      return NextResponse.json({ error: "License key not found" }, { status: 404 });
    }

    await prisma.licenseKey.update({
      where: { id },
      data: { is_active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("License revoke error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
