"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@iconify/react";
import { getErrorMessage } from "@/lib/utils";

interface BackupEntry {
  id: string;
  license_key: string;
  label: string | null;
  entities: string;
  size_bytes: number;
  record_count: number;
  is_synced: boolean;
  created_at: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [actionLoading, setActionLoading] = useState("");
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [backupsLoading, setBackupsLoading] = useState(false);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  // School Tag
  const [schoolTag, setSchoolTag] = useState("");
  const [tagSaving, setTagSaving] = useState(false);
  const [tagMessage, setTagMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [tagCopied, setTagCopied] = useState(false);

  useEffect(() => {
    if (user?.school_tag) {
      setSchoolTag(user.school_tag);
    }
  }, [user]);

  const sub = user?.subscription;
  const isActive = sub?.status === "active";
  const expiresAt =
    sub?.expires_at
      ? new Date(sub.expires_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

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

  useEffect(() => {
    fetchBackups();
  }, [fetchBackups]);

  const router = useRouter();

  async function handleSubscribe(plan: string) {
    router.push(`/checkout?plan=${plan}&yearly=${isYearly}`);
  }

  async function handleRestoreBackup(id: string) {
    if (!confirm("This will overwrite your current dashboard data (Students, Exams, Questions) with the data from this backup. Continue?")) return;
    setRestoringId(id);
    try {
      const res = await fetch(`/api/backups/${id}/restore`, { method: "POST" });
      if (res.ok) {
        alert("Success! Dashboard has been synced with the backup data.");
        window.location.reload();
      } else {
        throw res;
      }
    } catch (err) {
      const errMsg = await getErrorMessage(err, "Failed to restore backup.");
      alert(`Error: ${errMsg}`);
    } finally {
      setRestoringId(null);
    }
  }

  async function handleDownloadBackup(id: string, label: string | null) {
    setDownloadingId(id);
    try {
      const res = await fetch(`/api/backups/${id}`);
      if (res.ok) {
        const result = await res.json();
        const blob = new Blob([result.backup.data], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${label || "backup"}-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // silent
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div>
        <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
          Settings
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Manage your school profile, subscription, and cloud backups.
        </p>
      </div>

      {/* School Profile */}
      <Card className="bg-zinc-900 border-white/10 rounded-xl p-0 overflow-hidden">
        <CardHeader className="p-6 pb-4 flex flex-row items-center gap-3">
          <div className="p-2.5 rounded-md bg-white/5 border border-white/5 text-blue-400">
            <Icon icon="ri:building-2-line" className="w-5 h-5" />
          </div>
          <CardTitle className="font-headline font-bold text-lg text-white">School Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">
                Institution Name
              </label>
              <div className="flex items-center gap-3 bg-zinc-950 rounded-xl px-4 py-3 border border-white/10">
                <Icon icon="ri:building-2-line" className="w-4 h-4 text-zinc-600 shrink-0" />
                <span className="text-sm text-white font-medium">{user?.school_name}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">
                Contact Person
              </label>
              <div className="flex items-center gap-3 bg-zinc-950 rounded-xl px-4 py-3 border border-white/10">
                <Icon icon="ri:user-line" className="w-4 h-4 text-zinc-600 shrink-0" />
                <span className="text-sm text-white font-medium">{user?.contact_name}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">
                Email Address
              </label>
              <div className="flex items-center gap-3 bg-zinc-950 rounded-xl px-4 py-3 border border-white/10">
                <Icon icon="ri:send-plane-line" className="w-4 h-4 text-zinc-600 shrink-0" />
                <span className="text-sm text-white font-medium">{user?.email}</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">
                Phone
              </label>
              <div className="flex items-center gap-3 bg-zinc-950 rounded-xl px-4 py-3 border border-white/10">
                <Icon icon="ri:phone-line" className="w-4 h-4 text-zinc-600 shrink-0" />
                <span className="text-sm text-zinc-500 font-medium">Not provided</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* School Tag for Teacher Portal */}
      <Card className="bg-zinc-900 border-white/10 rounded-xl p-0 overflow-hidden">
        <CardHeader className="p-6 pb-4 flex flex-row items-start gap-3">
          <div className="p-2.5 rounded-md bg-white/5 border border-white/5 text-blue-400 shrink-0">
            <Icon icon="ri:price-tag-3-line" className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="font-headline font-bold text-lg text-white">Teacher Portal Access</CardTitle>
            <CardDescription className="text-zinc-500 text-xs mt-0.5">Set a unique school tag so your teachers can log in remotely</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 mt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="text"
                value={schoolTag}
                onChange={(e) => {
                  setSchoolTag(e.target.value);
                  setTagMessage(null);
                }}
                placeholder="e.g. SwiftLearn-High-School"
                className="bg-zinc-950 border-white/10 rounded-xl h-11 text-white font-medium"
              />
            </div>
            <Button
              onClick={async () => {
                setTagSaving(true);
                setTagMessage(null);
                try {
                  const res = await fetch("/api/school-tag", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ school_tag: schoolTag }),
                  });
                  if (!res.ok) {
                    throw res;
                  }
                  const data = await res.json();
                  setSchoolTag(data.school_tag);
                  setTagMessage({ type: "success", text: `Saved! Teachers use "${data.school_tag}" to log in.` });
                } catch (err) {
                  const errMsg = await getErrorMessage(err, "Network error");
                  setTagMessage({ type: "error", text: errMsg });
                } finally {
                  setTagSaving(false);
                }
              }}
              disabled={tagSaving}
              className="h-11 bg-blue-600 hover:bg-blue-500 text-white font-bold"
            >
              {tagSaving ? "Saving..." : "Save Tag"}
            </Button>
            {schoolTag && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(schoolTag);
                  setTagCopied(true);
                  setTimeout(() => setTagCopied(false), 2000);
                }}
                className="h-11 w-11 bg-white/5 hover:bg-white/10 text-zinc-400"
                title="Copy tag"
              >
                {tagCopied ? <Icon icon="ri:checkbox-circle-line" className="w-4 h-4 text-emerald-400" /> : <Icon icon="ri:file-copy-line" className="w-4 h-4" />}
              </Button>
            )}
          </div>

          {tagMessage && (
            <p className={`mt-3 text-xs font-bold ${
              tagMessage.type === "success" ? "text-emerald-400" : "text-rose-400"
            }`}>
              {tagMessage.text}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Subscription & Billing */}
      <Card className="bg-zinc-900 border-white/10 rounded-xl p-0 overflow-hidden">
        <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <div className="p-2.5 rounded-md bg-white/5 border border-white/5 text-emerald-400">
              <Icon icon="ri:bank-card-line" className="w-5 h-5" />
            </div>
            <CardTitle className="font-headline font-bold text-lg text-white">Subscription & Billing</CardTitle>
          </div>
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
            <div className="space-y-6 mt-4">
              <div className="bg-zinc-950 rounded-xl p-5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Icon icon="ri:shield-line" className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-bold text-white capitalize">
                      {sub?.plan.replace("_yearly", " Yearly")} Plan
                    </p>
                    {expiresAt && (
                      <p className="text-xs text-zinc-500 font-medium">
                        Expires {expiresAt}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="link"
                  onClick={() => setShowPlans(!showPlans)}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 p-0 h-auto"
                >
                  {showPlans ? "Hide plans" : "Change plan"}
                </Button>
              </div>
              
              {(showPlans || !isActive) && (
                <div className="pt-8 border-t border-white/5 animate-fade-in-up">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                    <p className="text-zinc-400 text-sm font-medium">
                      {isActive ? "Switch to a different plan:" : "Choose a plan to unlock all features and cloud storage."}
                    </p>
                    {/* Toggle Switch */}
                    <div className="flex items-center gap-4 shrink-0 bg-zinc-950 px-4 py-2 rounded-full border border-white/10">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${!isYearly ? "text-white" : "text-zinc-600"}`}>Monthly</span>
                      <Switch 
                        checked={isYearly} 
                        onCheckedChange={setIsYearly}
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${isYearly ? "text-white" : "text-zinc-600"}`}>Yearly</span>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-black text-[9px]">SAVE 25%</Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                      { id: "free", name: "Free", price: 0, students: "15" },
                      { id: "starter", name: "Starter", price: 1500, students: "100" },
                      { id: "school", name: "School", price: 3000, students: "500", popular: true },
                      { id: "enterprise", name: "Enterprise", price: 5000, students: "Unlimited" },
                    ].map((p) => {
                      const planId = isYearly ? `${p.id}_yearly` : p.id;
                      const isCurrent = sub?.plan === planId;
                      const displayPrice = isYearly ? Math.round(p.price * 0.75) : p.price;

                      return (
                        <div 
                          key={p.id}
                          className={`bg-zinc-900 rounded-xl p-6 border transition-all flex flex-col relative overflow-hidden ${
                            isCurrent ? "border-blue-500/30 bg-blue-600/5" : "border-white/10 hover:border-white/20"
                          }`}
                        >
                          {p.popular && (
                            <span className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-lg">
                              Popular
                            </span>
                          )}
                          <h3 className="font-headline font-bold text-lg text-white mb-1">{p.name}</h3>
                          <p className="text-xs text-zinc-500 font-medium mb-4 flex-grow">{p.students} Students</p>
                          <p className="text-2xl font-headline font-black text-white tracking-tighter mb-1">
                            ₦{displayPrice.toLocaleString()}
                            <span className="text-xs font-medium text-zinc-600 tracking-normal ml-1">/mo</span>
                          </p>
                          <div className="text-[10px] text-blue-400 h-3 mt-1 font-bold">
                            {isYearly && p.price > 0 && `₦${(displayPrice * 12).toLocaleString()} / yr`}
                          </div>
                          <Button
                            onClick={() => handleSubscribe(p.id)}
                            disabled={actionLoading === "subscribe" || isCurrent}
                            variant={isCurrent ? "outline" : "default"}
                            className={`mt-4 w-full h-10 text-xs font-black uppercase tracking-widest ${
                              isCurrent 
                                ? "bg-emerald-400/5 text-emerald-400 border-emerald-500/20 hover:bg-emerald-400/5"
                                : "bg-white/5 hover:bg-white/10 text-white border-white/5"
                            }`}
                          >
                            {isCurrent ? "Current" : actionLoading === "subscribe" ? "..." : "Switch"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
                <p className="text-zinc-400 text-sm font-medium">
                  Choose a plan to unlock all features and cloud storage.
                </p>
                {/* Toggle Switch */}
                <div className="flex items-center gap-4 shrink-0 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${!isYearly ? "text-white" : "text-zinc-600"}`}>Monthly</span>
                  <Switch 
                    checked={isYearly} 
                    onCheckedChange={setIsYearly}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${isYearly ? "text-white" : "text-zinc-600"}`}>Yearly</span>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-black text-[9px]">SAVE 25%</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { id: "free", name: "Free", price: 0, students: "15" },
                  { id: "starter", name: "Starter", price: 1500, students: "100" },
                  { id: "school", name: "School", price: 3000, students: "500", popular: true },
                  { id: "enterprise", name: "Enterprise", price: 5000, students: "Unlimited" },
                ].map((p) => {
                  const displayPrice = isYearly ? Math.round(p.price * 0.75) : p.price;
                  return (
                    <div 
                      key={p.id}
                      className="bg-zinc-900 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col relative overflow-hidden"
                    >
                      {p.popular && (
                        <span className="absolute top-0 right-0 bg-blue-600 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-lg">
                          Popular
                        </span>
                      )}
                      <h3 className="font-headline font-bold text-lg text-white mb-1">{p.name}</h3>
                      <p className="text-xs text-zinc-500 font-medium mb-4 flex-grow">{p.students} Students</p>
                      <p className="text-2xl font-headline font-black text-white tracking-tighter mb-1">
                        ₦{displayPrice.toLocaleString()}
                        <span className="text-xs font-medium text-zinc-600 tracking-normal ml-1">/mo</span>
                      </p>
                      <div className="text-[10px] text-blue-400 h-3 mt-1 font-bold">
                        {isYearly && p.price > 0 && `₦${(displayPrice * 12).toLocaleString()} billed annually`}
                      </div>
                      <Button
                        onClick={() => handleSubscribe(p.id)}
                        disabled={actionLoading === "subscribe"}
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest h-11"
                      >
                        {actionLoading === "subscribe" ? "..." : "Subscribe"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-white/5 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Icon icon="ri:history-line" className="w-4 h-4 text-zinc-500" />
              <span className="text-xs text-zinc-500 font-medium">
                Generated multiple RRRs or need to verify a manual payment?
              </span>
            </div>
            <Button asChild variant="link" className="text-xs font-bold text-blue-400 hover:text-blue-300 p-0 h-auto cursor-pointer">
              <Link href="/dashboard/settings/transactions" className="flex items-center gap-1">
                View RRR & Transaction History <Icon icon="ri:arrow-right-line" className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cloud Backups */}
      <Card className="bg-zinc-900 border-white/10 rounded-xl p-0 overflow-hidden">
        <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-3">
            <div className="p-2.5 rounded-md bg-white/5 border border-white/5 text-blue-400">
              <Icon icon="ri:cloud-line" className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="font-headline font-bold text-lg text-white">Cloud Backups</CardTitle>
              <CardDescription className="text-zinc-500 text-xs mt-0.5">Secure cloud backups of your exam data</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchBackups}
            disabled={backupsLoading}
            className="text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <Icon icon="ri:refresh-line" className={`w-4 h-4 ${backupsLoading ? "animate-spin" : ""}`} />
          </Button>
        </CardHeader>

        <CardContent className="p-6 pt-0 mt-4">
          {backupsLoading && backups.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="ri:refresh-line" className="w-8 h-8 text-blue-500/30 animate-spin mx-auto mb-3" />
              <p className="text-zinc-500 text-sm font-medium">Loading backups...</p>
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
              <Icon icon="ri:cloud-line" className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
              <p className="text-white font-bold">No backups yet</p>
              <p className="text-zinc-500 text-sm mt-1 max-w-[240px] mx-auto">
                Backups created from your CBT application will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 bg-zinc-950 rounded-xl border border-white/10 gap-4 group hover:bg-zinc-900 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1.5">
                      <p className="text-sm font-bold text-white truncate">
                        {b.label || "Untitled Backup"}
                      </p>
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-none font-bold text-[9px] px-2 py-0.5">
                        {formatBytes(b.size_bytes)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <span>
                        {new Date(b.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-zinc-700">•</span>
                      <span>{b.record_count} records</span>
                      <span className="text-zinc-700">•</span>
                      <span className="text-blue-500/60">
                        {b.entities.split(',').length} modules
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full lg:w-auto">
                    {b.is_synced ? (
                      <div className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/5 border border-emerald-500/10">
                        <Icon icon="ri:checkbox-circle-line" className="w-3.5 h-3.5" />
                        Synced
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleRestoreBackup(b.id)}
                        disabled={restoringId === b.id}
                        className="flex-1 lg:flex-none h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white"
                      >
                        <Icon icon="ri:refresh-line" className={`w-3.5 h-3.5 mr-2 ${restoringId === b.id ? "animate-spin" : ""}`} />
                        {restoringId === b.id ? "Syncing..." : "Sync Dashboard"}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadBackup(b.id, b.label)}
                      disabled={downloadingId === b.id}
                      className="h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/5"
                    >
                      <Icon icon="ri:download-2-line" className="w-4 h-4" />
                    </Button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
