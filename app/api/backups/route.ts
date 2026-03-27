import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * SmartLearn Cloud Backup API
 *
 * Authentication: The CBT app sends its license_key in the request body.
 * We look up the license, verify it belongs to an active subscription,
 * and then scope all operations to that user.
 *
 * Dashboard users authenticate via their session cookie (getSession).
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

// ─── GET: List backups ──────────────────────────────────────────────────
// Called by both the CBT app (with ?license_key=xxx) and the dashboard (with session cookie)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const licenseKey = searchParams.get("license_key");

    let userId: string | null = null;

    if (licenseKey) {
      // CBT app auth
      const user = await getLicenseUser(licenseKey);
      if (!user) {
        return NextResponse.json(
          { error: "Invalid or inactive license" },
          { status: 403 }
        );
      }
      userId = user.id;
    } else {
      // Dashboard session auth
      const { getSession } = await import("@/lib/auth");
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      userId = session.userId;
    }

    const backups = await prisma.backup.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        license_key: true,
        label: true,
        entities: true,
        size_bytes: true,
        record_count: true,
        is_synced: true,
        created_at: true,
        // Exclude `data` from listings to keep responses small
      },
    });

    return NextResponse.json({ backups });
  } catch (error) {
    console.error("Backup list error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ─── POST: Create a new backup ──────────────────────────────────────────
// Called by the CBT app with the full payload
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { license_key, label, entities, data } = body;

    if (!license_key || !data || !entities) {
      return NextResponse.json(
        { error: "license_key, entities, and data are required" },
        { status: 400 }
      );
    }

    const user = await getLicenseUser(license_key);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid or inactive license" },
        { status: 403 }
      );
    }

    const jsonStr = typeof data === "string" ? data : JSON.stringify(data);
    const sizeBytes = Buffer.byteLength(jsonStr, "utf-8");

    // Count records
    let recordCount = 0;
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      for (const key of Object.keys(parsed)) {
        if (Array.isArray(parsed[key])) {
          recordCount += parsed[key].length;
        }
      }
    } catch {
      // If parsing fails, just leave count at 0
    }

    const backup = await prisma.backup.create({
      data: {
        user_id: user.id,
        license_key,
        label: label || null,
        entities: Array.isArray(entities) ? entities.join(",") : entities,
        data: jsonStr,
        size_bytes: sizeBytes,
        record_count: recordCount,
        is_synced: true, // Mark this new upload as the newly synced one
      },
    });

    // Mark previous backups as unsynced
    await prisma.backup.updateMany({
      where: { 
        user_id: user.id, 
        id: { not: backup.id } 
      },
      data: { is_synced: false },
    });

    // Auto-restore this backup so the dashboard is immediately populated
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;
    const { rebuildDashboardData } = await import("@/lib/backup-restore");
    await rebuildDashboardData(user.id, parsedData);

    return NextResponse.json({
      success: true,
      backup: {
        id: backup.id,
        label: backup.label,
        entities: backup.entities,
        size_bytes: backup.size_bytes,
        record_count: backup.record_count,
        created_at: backup.created_at,
        is_synced: backup.is_synced,
      },
    });
  } catch (error) {
    console.error("Backup create error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

