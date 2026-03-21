"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Target,
} from "lucide-react";

interface DashboardStats {
  students: number;
  exams: number;
  devices: number;
  questions: number;
  avgScore: number;
}

interface ScoreTrendItem {
  title: string;
  score: number | null;
  date: string;
}

interface Student {
  id: string;
  name: string;
  class_name: string;
  avg_score: number;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  avg_score: number | null;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scoreTrend, setScoreTrend] = useState<ScoreTrendItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, studentsRes, examsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/students"),
        fetch("/api/exams"),
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data.stats);
        setScoreTrend(data.scoreTrend || []);
      }
      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(data.students || []);
      }
      if (examsRes.ok) {
        const data = await examsRes.json();
        setExams(data.exams || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derive analytics from real data
  const topStudents = [...students]
    .filter((s) => s.avg_score > 0)
    .sort((a, b) => b.avg_score - a.avg_score)
    .slice(0, 5);

  // Subject performance from completed exams
  const subjectScores: Record<string, { total: number; count: number }> = {};
  exams.forEach((e) => {
    if (e.avg_score !== null) {
      if (!subjectScores[e.subject]) subjectScores[e.subject] = { total: 0, count: 0 };
      subjectScores[e.subject].total += e.avg_score;
      subjectScores[e.subject].count += 1;
    }
  });
  const subjectPerformance = Object.entries(subjectScores).map(([subject, data]) => ({
    subject,
    score: Math.round(data.total / data.count),
  }));

  const barColors = [
    "bg-indigo-500", "bg-violet-500", "bg-blue-500",
    "bg-cyan-500", "bg-emerald-500", "bg-amber-500",
  ];

  const maxTrend = scoreTrend.length > 0
    ? Math.max(...scoreTrend.map((s) => s.score || 0))
    : 100;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[50vh]">
        <p className="text-on-surface-variant text-sm">Loading analytics...</p>
      </div>
    );
  }

  const isEmpty = !stats || (stats.students === 0 && stats.exams === 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-on-surface">
          Performance Analytics
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Deep insights into student and institutional performance.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-5 border border-outline-variant/10">
          <BarChart3 className="w-5 h-5 text-primary mb-3" />
          <p className="text-2xl font-headline font-extrabold">
            {stats ? `${stats.avgScore}%` : "—"}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-outline-variant font-medium">School Average</p>
        </div>
        <div className="glass-card rounded-xl p-5 border border-outline-variant/10">
          <TrendingUp className="w-5 h-5 text-emerald-400 mb-3" />
          <p className="text-2xl font-headline font-extrabold text-emerald-400">
            {scoreTrend.length > 1
              ? `${scoreTrend[scoreTrend.length - 1].score && scoreTrend[0].score
                  ? (Number(scoreTrend[scoreTrend.length - 1].score) - Number(scoreTrend[0].score) > 0 ? "+" : "")
                    + (Number(scoreTrend[scoreTrend.length - 1].score) - Number(scoreTrend[0].score)).toFixed(1) + "%"
                  : "—"}`
              : "—"}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-outline-variant font-medium">Score Trend</p>
        </div>
        <div className="glass-card rounded-xl p-5 border border-outline-variant/10">
          <BookOpen className="w-5 h-5 text-violet-400 mb-3" />
          <p className="text-2xl font-headline font-extrabold">{stats?.exams || 0}</p>
          <p className="text-[10px] uppercase tracking-widest text-outline-variant font-medium">Tests administered</p>
        </div>
        <div className="glass-card rounded-xl p-5 border border-outline-variant/10">
          <Users className="w-5 h-5 text-amber-400 mb-3" />
          <p className="text-2xl font-headline font-extrabold">{stats?.students || 0}</p>
          <p className="text-[10px] uppercase tracking-widest text-outline-variant font-medium">Students assessed</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="glass-card rounded-xl border border-outline-variant/10 p-12 text-center">
          <BarChart3 className="w-16 h-16 text-outline-variant/20 mx-auto mb-4" />
          <p className="text-on-surface-variant font-medium text-lg">No data yet</p>
          <p className="text-outline-variant text-sm mt-2 max-w-md mx-auto">
            Add students and create exams with scores to start seeing performance analytics here.
          </p>
        </div>
      ) : (
        <>
          {/* Two Column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Performance */}
            <div className="glass-card rounded-xl border border-outline-variant/10 p-6">
              <h2 className="font-headline font-bold text-lg mb-5">Subject Performance</h2>
              {subjectPerformance.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No completed exams with scores yet.</p>
              ) : (
                <div className="space-y-4">
                  {subjectPerformance.map((sp, i) => (
                    <div key={sp.subject}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-on-surface">{sp.subject}</span>
                        <span className="text-sm font-bold text-on-surface">{sp.score}%</span>
                      </div>
                      <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColors[i % barColors.length]} transition-all duration-700`}
                          style={{ width: `${sp.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Score Trend */}
            <div className="glass-card rounded-xl border border-outline-variant/10 p-6">
              <h2 className="font-headline font-bold text-lg mb-5">Exam Score Trend</h2>
              {scoreTrend.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No exam score data yet.</p>
              ) : (
                <div className="flex items-end gap-3 h-48">
                  {scoreTrend.map((w, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      <span className="text-xs font-bold text-on-surface mb-2">
                        {w.score ? `${Math.round(w.score)}%` : "—"}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-md transition-all duration-500 min-h-[8px]"
                        style={{ height: `${((w.score || 0) / maxTrend) * 80}%` }}
                      />
                      <span className="text-[9px] text-outline-variant mt-2 font-medium truncate w-full text-center">
                        {w.title.slice(0, 6)}..
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Leaderboard */}
            <div className="lg:col-span-3 glass-card rounded-xl border border-outline-variant/10 p-6">
              <div className="flex items-center gap-3 mb-5">
                <Award className="w-5 h-5 text-amber-400" />
                <h2 className="font-headline font-bold text-lg">Top Students</h2>
              </div>
              {topStudents.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No student scores yet.</p>
              ) : (
                <div className="space-y-3">
                  {topStudents.map((s, i) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-4 py-2 border-b border-outline-variant/5 last:border-0"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${
                          i === 0
                            ? "bg-amber-400/20 text-amber-400"
                            : i === 1
                            ? "bg-slate-300/20 text-slate-300"
                            : i === 2
                            ? "bg-orange-400/20 text-orange-400"
                            : "bg-surface-container-high text-outline-variant"
                        }`}
                      >
                        #{i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-on-surface">{s.name}</p>
                        <p className="text-[11px] text-outline-variant">{s.class_name}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{s.avg_score}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Class Distribution */}
            <div className="lg:col-span-2 glass-card rounded-xl border border-outline-variant/10 p-6">
              <div className="flex items-center gap-3 mb-5">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="font-headline font-bold text-lg">Class Distribution</h2>
              </div>
              {students.length === 0 ? (
                <p className="text-on-surface-variant text-sm">No students yet.</p>
              ) : (
                <div className="space-y-3">
                  {Array.from(
                    students.reduce((acc, s) => {
                      acc.set(s.class_name, (acc.get(s.class_name) || 0) + 1);
                      return acc;
                    }, new Map<string, number>())
                  )
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([className, count]) => (
                      <div key={className} className="flex items-center justify-between py-2 border-b border-outline-variant/5 last:border-0">
                        <span className="text-sm text-on-surface font-medium">{className}</span>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                          {count} students
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
