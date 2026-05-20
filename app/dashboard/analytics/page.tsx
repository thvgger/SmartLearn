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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[50vh] text-zinc-500">
        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest">Calculating analytics...</p>
      </div>
    );
  }

  const isEmpty = !stats || (stats.students === 0 && stats.exams === 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
          Performance Analytics
        </h1>
        <p className="text-zinc-500 text-sm mt-1 font-medium">
          Deep insights into student and institutional performance.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BarChart3, label: "School Average", value: stats ? `${stats.avgScore}%` : "—", color: "text-indigo-400" },
          { icon: TrendingUp, label: "Score Trend", value: scoreTrend.length > 1 ? `${scoreTrend[scoreTrend.length - 1].score && scoreTrend[0].score ? (Number(scoreTrend[scoreTrend.length - 1].score) - Number(scoreTrend[0].score) > 0 ? "+" : "") + (Number(scoreTrend[scoreTrend.length - 1].score) - Number(scoreTrend[0].score)).toFixed(1) + "%" : "—"}` : "—", color: "text-emerald-400" },
          { icon: BookOpen, label: "Tests administered", value: stats?.exams || 0, color: "text-violet-400" },
          { icon: Users, label: "Students assessed", value: stats?.students || 0, color: "text-amber-400" },
        ].map((s, i) => (
          <Card key={i} className="bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-5 gap-0">
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <p className="text-2xl font-headline font-black text-white">{s.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {isEmpty ? (
        <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-white/5">
          <BarChart3 className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
          <p className="text-white font-bold text-lg">No data yet</p>
          <p className="text-zinc-500 text-sm mt-2 max-w-md mx-auto">
            Add students and create exams with scores to start seeing performance analytics here.
          </p>
        </Card>
      ) : (
        <>
          {/* Two Column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject Performance */}
            <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-0 gap-0 overflow-hidden">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="font-headline font-bold text-lg text-white">Subject Performance</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 mt-4">
                {subjectPerformance.length === 0 ? (
                  <p className="text-zinc-600 text-sm font-medium">No completed exams with scores yet.</p>
                ) : (
                  <div className="space-y-6">
                    {subjectPerformance.map((sp, i) => (
                      <div key={sp.subject}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">{sp.subject}</span>
                          <span className="text-sm font-black text-white">{sp.score}%</span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${barColors[i % barColors.length]} shadow-[0_0_10px_rgba(99,102,241,0.2)] transition-all duration-1000 ease-out`}
                            style={{ width: `${sp.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Score Trend */}
            <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-0 gap-0 overflow-hidden">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="font-headline font-bold text-lg text-white">Exam Score Trend</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 mt-4">
                {scoreTrend.length === 0 ? (
                  <p className="text-zinc-600 text-sm font-medium">No exam score data yet.</p>
                ) : (
                  <div className="flex items-end gap-3 h-48">
                    {scoreTrend.map((w, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                          <Badge className="bg-indigo-600 text-white border-none text-[9px] font-black px-1.5 py-0.5">
                            {w.score ? `${Math.round(w.score)}%` : "—"}
                          </Badge>
                        </div>
                        <div
                          className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-md transition-all duration-500 min-h-[8px] group-hover:scale-x-110 shadow-lg shadow-indigo-500/20"
                          style={{ height: `${((w.score || 0) / maxTrend) * 70}%` }}
                        />
                        <span className="text-[9px] text-zinc-500 mt-3 font-bold truncate w-full text-center uppercase tracking-tighter">
                          {w.title.slice(0, 6)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Leaderboard */}
            <Card className="lg:col-span-3 bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-0 gap-0 overflow-hidden">
              <CardHeader className="p-6 pb-4 flex flex-row items-center gap-3">
                <Award className="w-5 h-5 text-amber-400" />
                <CardTitle className="font-headline font-bold text-lg text-white">Top Students</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 mt-2">
                {topStudents.length === 0 ? (
                  <p className="text-zinc-600 text-sm font-medium">No student scores yet.</p>
                ) : (
                  <div className="space-y-2">
                    {topStudents.map((s, i) => (
                      <div
                        key={s.id}
                        className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-white/5 transition-all group"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${
                            i === 0 ? "bg-amber-400 text-amber-950 shadow-lg shadow-amber-400/20" : 
                            i === 1 ? "bg-slate-300 text-slate-900 shadow-lg shadow-slate-300/20" : 
                            i === 2 ? "bg-orange-400 text-orange-950 shadow-lg shadow-orange-400/20" : 
                            "bg-white/5 text-zinc-500"
                          }`}
                        >
                          #{i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{s.name}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{s.class_name}</p>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-black">
                          {Math.round(s.avg_score)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Class Distribution */}
            <Card className="lg:col-span-2 bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-0 gap-0 overflow-hidden">
              <CardHeader className="p-6 pb-4 flex flex-row items-center gap-3">
                <Target className="w-5 h-5 text-indigo-400" />
                <CardTitle className="font-headline font-bold text-lg text-white">Class Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 mt-2">
                {students.length === 0 ? (
                  <p className="text-zinc-600 text-sm font-medium">No students yet.</p>
                ) : (
                  <div className="space-y-2">
                    {Array.from(
                      students.reduce((acc, s) => {
                        acc.set(s.class_name, (acc.get(s.class_name) || 0) + 1);
                        return acc;
                      }, new Map<string, number>())
                    )
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([className, count]) => (
                        <div key={className} className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5">
                          <span className="text-xs font-black uppercase tracking-widest text-zinc-300">{className}</span>
                          <Badge variant="secondary" className="bg-indigo-600 text-white border-none font-black text-[10px]">
                            {count} students
                          </Badge>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
