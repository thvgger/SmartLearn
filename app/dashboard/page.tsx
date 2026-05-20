"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import StatsCard from "./components/StatsCard";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BackupEntry {
  id: string;
  license_key: string;
  label: string | null;
  entities: string;
  size_bytes: number;
  record_count: number;
  created_at: string;
}

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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [backupsLoading, setBackupsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scoreTrend, setScoreTrend] = useState<ScoreTrendItem[]>([]);

  const fetchBackups = useCallback(async () => {
    setBackupsLoading(true);
    try {
      const res = await fetch("/api/backups");
      if (res.ok) {
        const data = await res.json();
        setBackups(data.backups || []);
      }
    } catch {
      // silent
    } finally {
      setBackupsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setScoreTrend(data.scoreTrend || []);
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchBackups();
    fetchStats();
  }, [fetchBackups, fetchStats]);

  const sub = user?.subscription;
  const isActive = sub?.status === "active";

  const maxTrend = scoreTrend.length > 0
    ? Math.max(...scoreTrend.map((s) => s.score || 0))
    : 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
          Welcome back, {user?.contact_name?.split(" ")[0]}
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Here&apos;s what&apos;s happening with {user?.school_name} today.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          icon="lucide:user"
          label="Total Users"
          value={stats ? String(stats.students) : "—"}
        />
        <StatsCard
          icon="lucide:file-text"
          label="Exams Created"
          value={stats ? String(stats.exams) : "—"}
        />
        <StatsCard
          icon="lucide:bar-chart-2"
          label="Avg Score"
          value={stats ? `${stats.avgScore}%` : "—"}
          accent="text-violet-400"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Score Trend or Activity */}
        <Card className="lg:col-span-3 bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-xl overflow-hidden relative border-none ring-1 ring-white/5 p-0 gap-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.02] blur-3xl -z-10"></div>
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <CardTitle className="font-headline font-bold text-lg text-white">
              {scoreTrend.length > 0 ? "Score Trend" : "Recent Activity"}
            </CardTitle>
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest border-indigo-500/30 text-indigo-400 font-bold bg-indigo-500/5">
              {scoreTrend.length > 0 ? `${scoreTrend.length} exams` : "Live"}
            </Badge>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            {scoreTrend.length > 0 ? (
              <div className="flex items-end gap-3 h-48">
                {scoreTrend.map((s, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                      <Badge variant="secondary" className="text-[10px] bg-indigo-500/20 text-indigo-300 border-none">
                        {s.score ? `${Math.round(s.score)}%` : "—"}
                      </Badge>
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-md transition-all duration-500 min-h-[8px] hover:scale-x-110 shadow-lg shadow-indigo-500/20"
                      style={{ height: `${((s.score || 0) / maxTrend) * 70}%` }}
                    />
                    <span className="text-[9px] text-zinc-500 mt-3 font-medium truncate w-full text-center">
                      {s.title.slice(0, 10)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Icon icon="lucide:activity" className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-zinc-500 text-sm max-w-[240px]">
                  No exam data yet. Create your first exam to see score trends.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription Status */}
          <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-xl border-none ring-1 ring-white/5 p-0 gap-0">
            <CardHeader className="flex flex-row items-center justify-between p-6">
              <CardTitle className="font-headline font-bold text-lg text-white">Subscription</CardTitle>
              <Badge 
                className={
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }
              >
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {isActive ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500 text-sm">Plan</span>
                    <span className="text-white font-bold capitalize">{sub?.plan}</span>
                  </div>
                  {sub?.expires_at && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 text-sm">Expires</span>
                      <span className="text-white font-medium text-sm">
                        {new Date(sub.expires_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full mt-4 border-white/10 hover:bg-white/5" render={<Link href="/dashboard/settings" />}>
                    Manage Plan
                  </Button>
                  </div>
                  ) : (
                  <div>
                  <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                    Activate a plan to unlock all CBT features and start running secure exams.
                  </p>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500" render={<Link href="/dashboard/settings" />}>
                    Upgrade Now
                    <Icon icon="lucide:arrow-right" className="ml-2 w-4 h-4" />
                  </Button>
                  </div>
                  )}
                  </CardContent>
                  </Card>

                  {/* Quick Backups */}
                  <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-xl border-none ring-1 ring-white/5 p-0 gap-0">
                  <CardHeader className="flex flex-row items-center justify-between p-6">
                  <CardTitle className="font-headline font-bold text-lg text-white">Cloud Backups</CardTitle>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  {backupsLoading ? "..." : `${backups.length} total`}
                  </span>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                  {backups.length === 0 ? (
                  <p className="text-zinc-500 text-sm leading-relaxed">
                  No backups yet. Synced backups from your CBT devices will appear here.
                  </p>
                  ) : (
                  <div className="space-y-4">
                  {backups.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between py-2 group cursor-default"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-zinc-300 truncate group-hover:text-white transition-colors">
                          {b.label || "Untitled Backup"}
                        </p>
                        <p className="text-[11px] text-zinc-600 font-medium">
                          {formatBytes(b.size_bytes)} • {b.record_count} records
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 shrink-0 ml-3 uppercase">
                        {timeAgo(b.created_at)}
                      </span>
                    </div>
                  ))}
                  {backups.length > 3 && (
                    <Button variant="link" size="sm" className="h-auto p-0 text-indigo-400 hover:text-indigo-300" render={<Link href="/dashboard/settings" />}>
                      View all backups →
                    </Button>
                  )}
                  </div>              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 hover:bg-white/[0.02] transition-all group border-none ring-1 ring-white/5 p-0 gap-0">
          <CardContent className="p-0">
            <Link href="/dashboard/users" className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-all group-hover:scale-110">
                <Icon icon="lucide:user" className="w-5 h-5" />
              </div>
              <div>
                <p className="font-headline font-bold text-sm text-white">
                  Manage Users
                </p>
                <p className="text-[11px] text-zinc-500 font-medium">
                  View students and their performance
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 hover:bg-white/[0.02] transition-all group border-none ring-1 ring-white/5 p-0 gap-0">
          <CardContent className="p-0">
            <Link href="/dashboard/exams" className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-all group-hover:scale-110">
                <Icon icon="lucide:file-text" className="w-5 h-5" />
              </div>
              <div>
                <p className="font-headline font-bold text-sm text-white">
                  Exams List
                </p>
                <p className="text-[11px] text-zinc-500 font-medium">
                  Create and manage your examination cycles
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
