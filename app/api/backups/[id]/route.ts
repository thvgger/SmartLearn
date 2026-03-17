import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Individual backup operations: GET (download data), DELETE
 */

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
    sub.status !== "active" ||
    (sub.expires_at && new Date(sub.expires_at) < new Date())
  ) {
    return null;
  }

  return license.user;
}

async function resolveUserId(req: NextRequest): Promise<string | null> {
  const { searchParams } = new URL(req.url);
  const licenseKey = searchParams.get("license_key");

  if (licenseKey) {
    const user = await getLicenseUser(licenseKey);
    return user?.id ?? null;
  }

  const { getSession } = await import("@/lib/auth");
  const session = await getSession();
  return session?.userId ?? null;
}

// ─── GET: Download a single backup's data ───────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await resolveUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backup = await prisma.backup.findFirst({
      where: { id, user_id: userId },
    });

    if (!backup) {
      return NextResponse.json(
        { error: "Backup not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      backup: {
        id: backup.id,
        license_key: backup.license_key,
        label: backup.label,
        entities: backup.entities,
        size_bytes: backup.size_bytes,
        record_count: backup.record_count,
        created_at: backup.created_at,
        data: backup.data,
      },
    });
  } catch (error) {
    console.error("Backup fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── DELETE: Remove a backup ────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await resolveUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backup = await prisma.backup.findFirst({
      where: { id, user_id: userId },
    });

    if (!backup) {
      return NextResponse.json(
        { error: "Backup not found" },
        { status: 404 }
      );
    }

    await prisma.backup.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Backup delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
