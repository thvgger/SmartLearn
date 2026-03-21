"use client";

import { useEffect, useState, useCallback } from "react";
import { useDashboardUser } from "./layout";
import StatsCard from "./components/StatsCard";
import {
  Users,
  FileText,
  Monitor,
  TrendingUp,
  Activity,
  Clock,
  CloudUpload,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

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
  const user = useDashboardUser();
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
        <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-on-surface">
          Welcome back, {user?.contact_name?.split(" ")[0]}
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Here&apos;s what&apos;s happening with {user?.school_name} today.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={Users}
          label="Total Students"
          value={stats ? String(stats.students) : "—"}
        />
        <StatsCard
          icon={FileText}
          label="Exams Created"
          value={stats ? String(stats.exams) : "—"}
        />
        <StatsCard
          icon={Monitor}
          label="Active Devices"
          value={stats ? String(stats.devices) : "—"}
          accent="text-emerald-400"
        />
        <StatsCard
          icon={TrendingUp}
          label="Avg Score"
          value={stats ? `${stats.avgScore}%` : "—"}
          accent="text-violet-400"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Score Trend or Activity */}
        <div className="lg:col-span-3 glass-card rounded-xl border border-outline-variant/10 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-headline font-bold text-lg">
              {scoreTrend.length > 0 ? "Score Trend" : "Recent Activity"}
            </h2>
            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
              {scoreTrend.length > 0 ? `${scoreTrend.length} exams` : "Live"}
            </span>
          </div>

          {scoreTrend.length > 0 ? (
            <div className="flex items-end gap-3 h-48">
              {scoreTrend.map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <span className="text-xs font-bold text-on-surface mb-2">
                    {s.score ? `${Math.round(s.score)}%` : "—"}
                  </span>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-md transition-all duration-500 min-h-[8px]"
                    style={{ height: `${((s.score || 0) / maxTrend) * 80}%` }}
                  />
                  <span className="text-[9px] text-outline-variant mt-2 font-medium truncate w-full text-center">
                    {s.title.slice(0, 8)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                { icon: Activity, text: "No exam data yet. Create your first exam to see score trends.", color: "text-outline-variant" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-4 py-2">
                    <div className={`p-2 rounded-lg bg-surface-container-high ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="flex-1 text-sm text-on-surface-variant">{item.text}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Subscription Status */}
          <div className="glass-card rounded-xl border border-outline-variant/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline font-bold text-lg">Subscription</h2>
              <span
                className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
                  isActive
                    ? "text-emerald-400 bg-emerald-400/10"
                    : "text-amber-400 bg-amber-400/10"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            {isActive ? (
              <div className="space-y-2">
                <p className="text-on-surface-variant text-sm">
                  Plan:{" "}
                  <span className="text-on-surface font-semibold capitalize">
                    {sub?.plan}
                  </span>
                </p>
                {sub?.expires_at && (
                  <p className="text-on-surface-variant text-sm">
                    Expires:{" "}
                    <span className="text-on-surface">
                      {new Date(sub.expires_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-on-surface-variant text-sm mb-4">
                  Activate a plan to unlock all CBT features.
                </p>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                >
                  <span>Manage subscription</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Quick Backups */}
          <div className="glass-card rounded-xl border border-outline-variant/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline font-bold text-lg">Cloud Backups</h2>
              <span className="text-xs text-outline-variant">
                {backupsLoading ? "Loading..." : `${backups.length} total`}
              </span>
            </div>
            {backups.length === 0 ? (
              <p className="text-on-surface-variant text-sm">
                No backups yet. Synced backups from your CBT devices will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {backups.slice(0, 3).map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between py-2 border-b border-outline-variant/5 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-on-surface truncate">
                        {b.label || "Untitled Backup"}
                      </p>
                      <p className="text-[11px] text-outline-variant">
                        {formatBytes(b.size_bytes)} • {b.record_count} records
                      </p>
                    </div>
                    <span className="text-[11px] text-outline-variant shrink-0 ml-3">
                      {timeAgo(b.created_at)}
                    </span>
                  </div>
                ))}
                {backups.length > 3 && (
                  <Link
                    href="/dashboard/settings"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    View all backups →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/exams"
          className="glass-card rounded-xl border border-outline-variant/10 p-5 hover:border-primary/30 transition-all group flex items-center gap-4"
        >
          <div className="p-3 rounded-lg bg-primary-container/10 text-primary group-hover:bg-primary-container/20 transition-colors">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="font-headline font-bold text-sm text-on-surface">
              Create Exam
            </p>
            <p className="text-[11px] text-outline-variant">
              Build a new test from scratch
            </p>
          </div>
        </Link>
        <Link
          href="/dashboard/students"
          className="glass-card rounded-xl border border-outline-variant/10 p-5 hover:border-primary/30 transition-all group flex items-center gap-4"
        >
          <div className="p-3 rounded-lg bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/15 transition-colors">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="font-headline font-bold text-sm text-on-surface">
              Manage Students
            </p>
            <p className="text-[11px] text-outline-variant">
              Add, edit, or import students
            </p>
          </div>
        </Link>
        <Link
          href="/dashboard/devices"
          className="glass-card rounded-xl border border-outline-variant/10 p-5 hover:border-primary/30 transition-all group flex items-center gap-4"
        >
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/15 transition-colors">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <p className="font-headline font-bold text-sm text-on-surface">
              Add Device
            </p>
            <p className="text-[11px] text-outline-variant">
              Generate a license key
            </p>
          </div>
        </Link>
      </div>

      {/* Stats summary */}
      {stats && stats.questions > 0 && (
        <div className="glass-card rounded-xl border border-outline-variant/10 p-5 flex items-center gap-4">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface">
              <span className="font-bold">{stats.questions}</span> questions in your Question Bank
            </p>
            <p className="text-[11px] text-outline-variant">
              Across all subjects. <Link href="/dashboard/exams" className="text-primary font-bold hover:underline">Manage →</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
