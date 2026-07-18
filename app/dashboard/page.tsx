"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import StatsCard from "./components/StatsCard";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";

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
  const { user, refreshUser } = useAuth();
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [backupsLoading, setBackupsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [scoreTrend, setScoreTrend] = useState<ScoreTrendItem[]>([]);
  const [error, setError] = useState("");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  // Pay Later RRR support
  const [pendingTx, setPendingTx] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null);
  const [rrrCopied, setRrrCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("payment") === "success") {
        setShowPaymentSuccess(true);
        // Clean URL to prevent recurring modal on refresh
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  const fetchBackups = useCallback(async () => {
    setBackupsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/backups");
      if (!res.ok) {
        throw res;
      }
      const data = await res.json();
      setBackups(data.backups || []);
    } catch (err) {
      setError(await getErrorMessage(err, "Failed to load dashboard data."));
    } finally {
      setBackupsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) {
        throw res;
      }
      const data = await res.json();
      setStats(data.stats);
      setScoreTrend(data.scoreTrend || []);
    } catch (err) {
      setError(await getErrorMessage(err, "Failed to load dashboard statistics."));
    }
  }, []);

  const fetchPendingTx = useCallback(async () => {
    try {
      const res = await fetch("/api/payment/pending");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.transaction) {
          setPendingTx(data.transaction);
          return data.transaction;
        }
      }
    } catch (err) {
      console.error("Failed to load pending transaction:", err);
    }
    return null;
  }, []);

  const verifyTx = useCallback(async (tx: any, isBackground = false) => {
    if (!tx) return;
    if (!isBackground) {
      setVerifying(true);
      setVerifyMsg(null);
    }
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rrr: tx.rrr,
          reference: tx.reference
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowPaymentSuccess(true);
        setPendingTx(null);
        await refreshUser();
      } else {
        if (!isBackground) {
          setVerifyMsg(data.message || "Payment is still pending. Please check again after paying at the bank or via your app.");
        }
      }
    } catch (err) {
      console.error("Error verifying transaction:", err);
      if (!isBackground) {
        setVerifyMsg("A network error occurred while verifying your payment. Please try again.");
      }
    } finally {
      if (!isBackground) {
        setVerifying(false);
      }
    }
  }, [refreshUser]);

  useEffect(() => {
    async function loadDashboard() {
      fetchBackups();
      fetchStats();
      const tx = await fetchPendingTx();
      if (tx) {
        verifyTx(tx, true); // Run background verification check silently
      }
    }
    loadDashboard();
  }, [fetchBackups, fetchStats, fetchPendingTx, verifyTx]);

  const sub = user?.subscription;
  const isExpired = sub?.expires_at ? new Date(sub.expires_at).getTime() < Date.now() : false;
  const isActive = sub?.status === "active" && !isExpired;

  const maxTrend = scoreTrend.length > 0
    ? Math.max(...scoreTrend.map((s) => s.score || 0))
    : 100;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Welcome back, {user?.contact_name?.split(" ")[0]}
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Here&apos;s what&apos;s happening with {user?.school_name} today.
        </p>
      </div>

      {pendingTx && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/[0.15] to-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full pointer-events-none" />
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Icon icon="ri:bank-card-line" className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-grow">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                Pending Subscription Invoice
                <Badge className="bg-amber-500/20 text-amber-400 border-none font-bold text-[9px]">Pay Later RRR</Badge>
              </h3>
              <p className="text-zinc-400 text-sm mt-1 max-w-xl">
                You generated a payment reference for the <span className="text-amber-400 font-bold capitalize">{pendingTx.plan.replace("_yearly", " Yearly")}</span> plan (amounting to <span className="text-white font-extrabold">₦{pendingTx.amount.toLocaleString()}</span>). 
                You can pay at any bank branch or via your banking app using the RRR below:
              </p>
              
              {/* Copyable RRR Box */}
              <div className="flex items-center gap-3 bg-zinc-950/80 border border-white/5 rounded-xl px-4 py-2 mt-3 w-fit">
                <span className="font-headline font-black text-white tracking-widest text-base">
                  {pendingTx.rrr}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(pendingTx.rrr);
                    setRrrCopied(true);
                    setTimeout(() => setRrrCopied(false), 2000);
                  }}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-white/5"
                  title="Copy RRR"
                >
                  <Icon icon={rrrCopied ? "ri:check-line" : "ri:file-copy-line"} className={`w-3.5 h-3.5 ${rrrCopied ? "text-emerald-400" : ""}`} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">{rrrCopied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
              
              {verifyMsg && (
                <p className="text-rose-400 text-xs font-bold mt-3 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                  <Icon icon="ri:error-warning-line" className="w-3.5 h-3.5" />
                  {verifyMsg}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <Button
              onClick={() => verifyTx(pendingTx, false)}
              disabled={verifying}
              className="h-11 px-5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2"
            >
              {verifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Icon icon="ri:refresh-line" className="w-4 h-4" />
                  Check Status
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3 animate-fade-in-up">
          <Icon icon="ri:error-warning-fill" className="w-4 h-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <Button size="sm" variant="ghost" onClick={() => { fetchStats(); fetchBackups(); }} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-3 border-none cursor-pointer">
            Retry
          </Button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          icon="ri:user-line"
          label="Total Users"
          value={stats ? String(stats.students) : "—"}
        />
        <StatsCard
          icon="ri:file-text-line"
          label="Exams Created"
          value={stats ? String(stats.exams) : "—"}
        />
        <StatsCard
          icon="ri:bar-chart-2-line"
          label="Avg Score"
          value={stats ? `${stats.avgScore}%` : "—"}
          accent="text-blue-400"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Score Trend or Activity */}
        <Card className="lg:col-span-3 bg-zinc-900 border-white/10 rounded-lg p-0">
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <CardTitle className="font-semibold text-lg text-white">
              {scoreTrend.length > 0 ? "Score Trend" : "Recent Activity"}
            </CardTitle>
            <Badge variant="secondary" className="text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-800 border-transparent">
              {scoreTrend.length > 0 ? `${scoreTrend.length} exams` : "Live"}
            </Badge>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            {scoreTrend.length > 0 ? (
              <div className="flex items-end gap-3 h-48">
                {scoreTrend.map((s, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                      <Badge variant="secondary" className="text-[10px] bg-blue-500/20 text-blue-300 border-none">
                        {s.score ? `${Math.round(s.score)}%` : "—"}
                      </Badge>
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-500 rounded-t-md transition-all duration-500 min-h-[8px] hover:scale-x-110 shadow-lg shadow-blue-500/20"
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
                  <Icon icon="ri:pulse-line" className="w-6 h-6 text-zinc-600" />
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
          <Card className="bg-zinc-900 border-white/10 rounded-lg p-0">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
              <CardTitle className="font-semibold text-lg text-white">Subscription</CardTitle>
              <Badge variant="outline"
                className={
                  isActive
                    ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-medium"
                    : pendingTx
                      ? "border-amber-500/30 text-amber-400 bg-amber-500/10 font-medium"
                      : "border-zinc-500/30 text-zinc-400 bg-zinc-500/10 font-medium"
                }
              >
                {isActive ? "Active" : pendingTx ? "Pending Payment" : "Inactive"}
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
                  <Button asChild variant="outline" size="sm" className="w-full mt-4 border-white/10 hover:bg-white/5">
                    <Link href="/dashboard/settings">Manage Plan</Link>
                  </Button>
                </div>
              ) : pendingTx ? (
                <div className="space-y-4">
                  <p className="text-zinc-500 text-xs leading-relaxed">
                    You have a pending subscription transaction. You can copy the RRR to pay later, or verify the payment status below.
                  </p>
                  <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-medium">Pending Plan</span>
                      <span className="text-white font-bold capitalize">{pendingTx.plan.replace("_yearly", " Yearly")}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-medium">Amount Due</span>
                      <span className="text-white font-bold">₦{pendingTx.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-medium">RRR Reference</span>
                      <span className="text-amber-400 font-extrabold tracking-widest">{pendingTx.rrr}</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5 mt-4">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(pendingTx.rrr);
                        setRrrCopied(true);
                        setTimeout(() => setRrrCopied(false), 2000);
                      }}
                      variant="outline"
                      type="button"
                      className="flex-1 h-10 border-white/10 hover:bg-white/5 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      <Icon icon={rrrCopied ? "ri:check-line" : "ri:file-copy-line"} className={`w-3.5 h-3.5 mr-1.5 ${rrrCopied ? "text-emerald-400" : ""}`} />
                      {rrrCopied ? "Copied" : "Copy RRR"}
                    </Button>
                    <Button
                      onClick={() => verifyTx(pendingTx, false)}
                      disabled={verifying}
                      type="button"
                      className="flex-1 h-10 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-1.5"
                    >
                      {verifying ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <Icon icon="ri:checkbox-circle-line" className="w-3.5 h-3.5" />
                          Verify Payment
                        </>
                      )}
                    </Button>
                  </div>
                  {verifyMsg && (
                    <p className="text-rose-400 text-[10px] font-bold mt-2 flex items-start gap-1 leading-snug animate-in fade-in slide-in-from-top-1">
                      <Icon icon="ri:error-warning-line" className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{verifyMsg}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                    Activate a plan to unlock all CBT features and start running secure exams.
                  </p>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-500">
                    <Link href="/dashboard/settings">
                      Upgrade Now
                      <Icon icon="ri:arrow-right-line" className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              )}
                  </CardContent>
                  </Card>

                  {/* Quick Backups */}
                  <Card className="bg-zinc-900 border-white/10 rounded-lg p-0">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
              <CardTitle className="font-semibold text-lg text-white">Cloud Backups</CardTitle>
              <span className="text-xs font-medium text-zinc-500">
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
                        <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-white transition-colors">
                          {b.label || "Untitled Backup"}
                        </p>
                        <p className="text-xs text-zinc-500 font-medium mt-0.5">
                          {formatBytes(b.size_bytes)} • {b.record_count} records
                        </p>
                      </div>
                      <span className="text-xs font-medium text-zinc-500 shrink-0 ml-3">
                        {timeAgo(b.created_at)}
                      </span>
                    </div>
                  ))}
                  {backups.length > 3 && (
                    <Button asChild variant="link" size="sm" className="h-auto p-0 text-blue-400 hover:text-blue-300">
                      <Link href="/dashboard/settings">View all backups →</Link>
                    </Button>
                  )}
                  </div>              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/users" className="block h-full">
          <Card className="relative overflow-hidden bg-zinc-900 border-white/10 hover:border-white/20 transition-all group rounded-2xl p-6 flex flex-col items-start h-full">
            {/* Top Right Decorative Background */}
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none overflow-hidden rounded-tr-2xl">
              <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-blue-500/[0.03] rotate-12 rounded-3xl" />
              <div className="absolute top-[10%] right-[-20%] w-full h-full border border-white/5 rotate-12 rounded-3xl" />
              
              {/* Mini UI Graphic - Users */}
              <div className="absolute right-[10px] top-[20px] w-32 bg-zinc-800 border border-white/10 rounded-lg p-2.5 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:rotate-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex-shrink-0" />
                  <div className="space-y-1 w-full">
                    <div className="h-1.5 w-full bg-white/20 rounded-full" />
                    <div className="h-1.5 w-2/3 bg-white/10 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex-shrink-0" />
                  <div className="space-y-1 w-full">
                    <div className="h-1.5 w-5/6 bg-white/20 rounded-full" />
                    <div className="h-1.5 w-1/2 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-6 relative z-10 group-hover:bg-blue-500/10 transition-colors">
              <Icon icon="ri:user-line" className="w-6 h-6" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-white mb-2 relative z-10">
              Manage Users
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8 flex-grow relative z-10 max-w-[75%]">
              View students, monitor their performance, and manage role assignments in your institution.
            </p>

            {/* Footer Link */}
            <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors relative z-10 mt-auto">
              Manage now <Icon icon="ri:arrow-right-line" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Card>
        </Link>
        
        <Link href="/dashboard/exams" className="block h-full">
          <Card className="relative overflow-hidden bg-zinc-900 border-white/10 hover:border-white/20 transition-all group rounded-2xl p-6 flex flex-col items-start h-full">
            {/* Top Right Decorative Background */}
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none overflow-hidden rounded-tr-2xl">
              <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-emerald-500/[0.03] -rotate-12 rounded-3xl" />
              <div className="absolute top-[10%] right-[-20%] w-full h-full border border-white/5 -rotate-12 rounded-3xl" />
              
              {/* Mini UI Graphic - Exams */}
              <div className="absolute right-[15px] top-[25px] w-28 bg-zinc-800 border border-white/10 rounded-lg p-3 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:-rotate-2">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <Icon icon="ri:check-line" className="w-2 h-2 text-emerald-400" />
                    </div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-white/5 border border-white/10" />
                    <div className="h-1.5 w-4/5 bg-white/10 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-white/5 border border-white/10" />
                    <div className="h-1.5 w-5/6 bg-white/10 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 mb-6 relative z-10 group-hover:bg-emerald-500/10 transition-colors">
              <Icon icon="ri:file-list-3-line" className="w-6 h-6" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-white mb-2 relative z-10">
              Exams List
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8 flex-grow relative z-10 max-w-[75%]">
              Create new examination cycles, manage questions, and review automated results.
            </p>

            {/* Footer Link */}
            <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors relative z-10 mt-auto">
              View exams <Icon icon="ri:arrow-right-line" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Card>
        </Link>
      </div>

      {showPaymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="bg-zinc-900 border border-emerald-500/20 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)] animate-in fade-in zoom-in-95 duration-200">
            {/* Glow */}
            <div className="bg-emerald-500/10 p-8 text-center border-b border-white/5 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full"></div>
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400 relative z-10">
                <Icon icon="ri:checkbox-circle-fill" className="w-10 h-10 animate-bounce" />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight relative z-10">Payment Successful!</h2>
              <p className="text-emerald-400/80 text-[10px] font-bold uppercase tracking-widest mt-1.5 relative z-10 flex items-center justify-center gap-1">
                <span>Secured via Remita</span>
              </p>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-zinc-400 text-sm leading-relaxed text-center">
                Thank you! Your school subscription has been activated successfully and all premium CBT features have been unlocked.
              </p>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-500">Plan Activated</span>
                  <span className="text-white font-bold capitalize">{user?.subscription?.plan || "Starter"} Plan</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-500">Status</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
                {user?.subscription?.expires_at && (
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-500">Billing Renewal</span>
                    <span className="text-white font-bold">
                      {new Date(user.subscription.expires_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                )}
              </div>
              <Button onClick={() => setShowPaymentSuccess(false)} className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 mt-2 cursor-pointer">
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
