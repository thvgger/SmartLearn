import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET — Aggregated dashboard stats
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;

    const [studentCount, examCount, deviceCount, questionCount, avgScoreResult] =
      await Promise.all([
        prisma.syncedUser.count({ where: { user_id: userId } }),
        prisma.exam.count({ where: { user_id: userId } }),
        prisma.licenseKey.count({ where: { user_id: userId, is_active: true } }),
        prisma.question.count({ where: { user_id: userId } }),
        prisma.exam.aggregate({
          where: { user_id: userId, avg_score: { not: null } },
          _avg: { avg_score: true },
        }),
      ]);

    // Get class distribution
    const classCounts = await prisma.syncedUser.groupBy({
      by: ["class_name"],
      where: { user_id: userId },
      _count: { id: true },
    });

    // Get recent exams with scores for trend
    const recentExams = await prisma.exam.findMany({
      where: { user_id: userId, status: "completed", avg_score: { not: null } },
      orderBy: { created_at: "desc" },
      take: 8,
      select: { title: true, avg_score: true, created_at: true },
    });

    return NextResponse.json({
      stats: {
        students: studentCount,
        exams: examCount,
        devices: deviceCount,
        questions: questionCount,
        avgScore: avgScoreResult._avg.avg_score
          ? Math.round(avgScoreResult._avg.avg_score * 10) / 10
          : 0,
      },
      classes: classCounts.map((c) => ({
        name: c.class_name,
        count: c._count.id,
      })),
      scoreTrend: recentExams.reverse().map((e) => ({
        title: e.title,
        score: e.avg_score,
        date: e.created_at,
      })),
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
