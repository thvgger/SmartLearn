import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { rebuildDashboardData } from "@/lib/backup-restore";

// POST — Restore a backup's data to the dashboard representations
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const backup = await prisma.backup.findUnique({
      where: { id, user_id: session.userId },
    });

    if (!backup) {
      return NextResponse.json({ error: "Backup not found" }, { status: 404 });
    }

    let parsedData: any;
    try {
      parsedData = typeof backup.data === "string" ? JSON.parse(backup.data) : backup.data;
    } catch {
      return NextResponse.json({ error: "Invalid backup data" }, { status: 400 });
    }

    await rebuildDashboardData(session.userId, parsedData);

    // Mark all backups as unsynced, then mark this one as synced
    await prisma.backup.updateMany({
      where: { user_id: session.userId },
      data: { is_synced: false },
    });
    
    await prisma.backup.update({
      where: { id: backup.id },
      data: { is_synced: true },
    });

    return NextResponse.json({ success: true, message: "Backup successfully mirrored to dashboard" });
  } catch (error) {
    console.error("Backup restore error:", error);
    return NextResponse.json(
      { error: "Failed to restore backup to dashboard" },
      { status: 500 }
    );
  }
}
