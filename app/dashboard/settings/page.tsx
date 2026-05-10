"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import {
  Settings as SettingsIcon,
  CreditCard,
  Building2,
  CloudUpload,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Shield,
  Mail,
  Phone,
  User,
  Tag,
  Copy,
} from "lucide-react";

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

  async function handleSubscribe(plan: string) {
    setActionLoading("subscribe");
    try {
      const selectedPlan = isYearly ? `${plan}_yearly` : plan;
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || "Failed to initiate payment");
        return;
      }

      const { remitaParams, reference } = data;

      // @ts-ignore - RemitaPay is loaded from external script
      const paymentEngine = window.RmPaymentEngine.init({
        key: process.env.NEXT_PUBLIC_REMITA_PUBLIC_KEY || "REVUVE9GR098NDY3OTE3OTd8YjU3M2IzYmI0OTU0YmNjYThhMGVkMjk0YThhNWRkYjI0OTZlNjA5MGRhZjI5ZTY5ZWY3YzU3YmI2M2Q1YjA5YTZlYzYyNjAyZWRlYjVjZDg2YmU1YjZlZTA2YzA4YmU1ZjkxYTQ0MTFkYjU1ZDBiZGE0Y2E5ZTEwOTBkYWY=",
        processRrr: true,
        transactionId: reference,
        onSuccess: async function (response: any) {
          console.log('Payment Success:', response);
          // Verify on backend
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              rrr: response.paymentReference || response.rrr, 
              reference 
            }),
          });
          
          if (verifyRes.ok) {
            alert("Payment successful! Your subscription is now active.");
            window.location.reload();
          } else {
            const errorData = await verifyRes.json();
            alert("Payment verification failed: " + (errorData.message || "Unknown error"));
          }
        },
        onError: function (response: any) {
          console.error('Payment Error:', response);
          alert("Payment failed or closed.");
          setActionLoading("");
        },
        onClose: function () {
          console.log('Payment Closed');
          setActionLoading("");
        }
      });

      paymentEngine.showPaymentWidget({
        ...remitaParams
      });

    } catch (err) {
      console.error("Subscription error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setActionLoading("");
    }
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
        const data = await res.json();
        alert(`Error: ${data.error || "Failed to sync"}`);
      }
    } catch {
      alert("Error: Network failure while syncing.");
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-on-surface">
          Settings
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Manage your school profile, subscription, and cloud backups.
        </p>
      </div>

      {/* School Profile */}
      <div className="glass-card rounded-xl border border-outline-variant/10 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary-container/10 text-primary">
            <Building2 className="w-5 h-5" />
          </div>
          <h2 className="font-headline font-bold text-lg">School Profile</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-outline-variant font-bold mb-2">
              Institution Name
            </label>
            <div className="flex items-center gap-3 bg-surface-container-low rounded-lg px-4 py-3 border border-outline-variant/10">
              <Building2 className="w-4 h-4 text-outline-variant shrink-0" />
              <span className="text-sm text-on-surface">{user?.school_name}</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-outline-variant font-bold mb-2">
              Contact Person
            </label>
            <div className="flex items-center gap-3 bg-surface-container-low rounded-lg px-4 py-3 border border-outline-variant/10">
              <User className="w-4 h-4 text-outline-variant shrink-0" />
              <span className="text-sm text-on-surface">{user?.contact_name}</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-outline-variant font-bold mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3 bg-surface-container-low rounded-lg px-4 py-3 border border-outline-variant/10">
              <Mail className="w-4 h-4 text-outline-variant shrink-0" />
              <span className="text-sm text-on-surface">{user?.email}</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-outline-variant font-bold mb-2">
              Phone
            </label>
            <div className="flex items-center gap-3 bg-surface-container-low rounded-lg px-4 py-3 border border-outline-variant/10">
              <Phone className="w-4 h-4 text-outline-variant shrink-0" />
              <span className="text-sm text-on-surface-variant">Not provided</span>
            </div>
          </div>
        </div>
      </div>

      {/* School Tag for Teacher Portal */}
      <div className="glass-card rounded-xl border border-outline-variant/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary-container/10 text-primary">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg">Teacher Portal Access</h2>
            <p className="text-xs text-outline-variant">Set a unique school tag so your teachers can log in remotely</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={schoolTag}
              onChange={(e) => {
                setSchoolTag(e.target.value);
                setTagMessage(null);
              }}
              placeholder="e.g. springfield-high"
              className="w-full bg-surface-container-low border border-outline-variant/10 rounded-lg px-4 py-2.5 text-sm text-on-surface placeholder:text-outline-variant/50 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={async () => {
              setTagSaving(true);
              setTagMessage(null);
              try {
                const res = await fetch("/api/school-tag", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ school_tag: schoolTag }),
                });
                const data = await res.json();
                if (res.ok) {
                  setSchoolTag(data.school_tag);
                  setTagMessage({ type: "success", text: `Saved! Teachers use "${data.school_tag}" to log in.` });
                } else {
                  setTagMessage({ type: "error", text: data.error });
                }
              } catch {
                setTagMessage({ type: "error", text: "Network error" });
              } finally {
                setTagSaving(false);
              }
            }}
            disabled={tagSaving}
            className="px-5 py-2.5 bg-primary-container text-on-primary-container rounded-lg font-headline font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20 disabled:opacity-50"
          >
            {tagSaving ? "Saving..." : "Save Tag"}
          </button>
          {schoolTag && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(schoolTag);
                setTagCopied(true);
                setTimeout(() => setTagCopied(false), 2000);
              }}
              className="p-2.5 rounded-lg hover:bg-surface-container-high text-outline-variant hover:text-on-surface transition-colors"
              title="Copy tag"
            >
              {tagCopied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>

        {tagMessage && (
          <p className={`mt-3 text-xs font-medium ${
            tagMessage.type === "success" ? "text-emerald-400" : "text-error"
          }`}>
            {tagMessage.text}
          </p>
        )}
      </div>

      {/* Subscription & Billing */}
      <div className="glass-card rounded-xl border border-outline-variant/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-container/10 text-primary">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="font-headline font-bold text-lg">Subscription & Billing</h2>
          </div>
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
          <div className="space-y-6">
            <div className="bg-surface-container-low rounded-lg p-5 border border-outline-variant/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-on-surface capitalize">
                    {sub?.plan.replace("_yearly", " Yearly")} Plan
                  </p>
                  {expiresAt && (
                    <p className="text-xs text-outline-variant">
                      Expires {expiresAt}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowPlans(!showPlans)}
                className="text-xs font-bold text-primary hover:underline"
              >
                {showPlans ? "Hide plans" : "Change plan"}
              </button>
            </div>
            
            {(showPlans || !isActive) && (
              <div className="pt-4 border-t border-outline-variant/5 animate-fade-up">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <p className="text-on-surface-variant text-sm font-medium">
                    {isActive ? "Switch to a different plan:" : "Choose a plan to unlock all features and cloud storage."}
                  </p>
                  {/* <!-- Toggle Switch --> */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-bold uppercase tracking-wider ${!isYearly ? "text-on-surface" : "text-outline-variant"}`}>Monthly</span>
                    <div 
                      className="relative w-12 h-6 bg-surface-container rounded-full p-1 cursor-pointer transition-colors border border-outline-variant/10"
                      onClick={() => setIsYearly(!isYearly)}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-primary rounded-full transition-transform ${isYearly ? "translate-x-6" : "translate-x-0"}`}></div>
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isYearly ? "text-on-surface" : "text-outline-variant"}`}>Yearly</span>
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[9px] font-bold tracking-tight ml-1">SAVE 25%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { id: "free", name: "Free", price: 0, students: "15" },
                    { id: "starter", name: "Starter", price: 10000, students: "100" },
                    { id: "school", name: "School", price: 20000, students: "500", popular: true },
                    { id: "enterprise", name: "Enterprise", price: 33333, students: "Unlimited" },
                  ].map((p) => {
                    const planId = isYearly ? `${p.id}_yearly` : p.id;
                    const isCurrent = sub?.plan === planId;
                    const displayPrice = isYearly ? Math.round(p.price * 0.75) : p.price;

                    return (
                      <div 
                        key={p.id}
                        className={`bg-surface-container-low rounded-xl p-6 border transition-all flex flex-col relative overflow-hidden ${
                          isCurrent ? "border-primary bg-primary/5" : "border-outline-variant/10 hover:border-primary/20"
                        }`}
                      >
                        {p.popular && (
                          <span className="absolute top-0 right-0 bg-primary text-on-primary text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-bl-lg">
                            Popular
                          </span>
                        )}
                        <h3 className="font-headline font-bold text-lg mb-1">{p.name}</h3>
                        <p className="text-xs text-outline-variant mb-4 flex-grow">{p.students} Students</p>
                        <p className="text-3xl font-headline font-extrabold mb-1">
                          ₦{displayPrice.toLocaleString()}
                          <span className="text-sm font-normal text-outline-variant">/mo</span>
                        </p>
                        <div className="text-[10px] text-primary h-3 mt-1 font-bold">
                          {isYearly && p.price > 0 && `₦${(displayPrice * 12).toLocaleString()} billed annually`}
                        </div>
                        <button
                          onClick={() => handleSubscribe(p.id)}
                          disabled={actionLoading === "subscribe" || isCurrent}
                          className={`mt-4 w-full py-3 rounded-lg font-headline font-bold text-sm transition-all border disabled:opacity-50 ${
                            isCurrent 
                              ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20 cursor-default"
                              : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest border-outline-variant/10"
                          }`}
                        >
                          {isCurrent ? "Current Plan" : actionLoading === "subscribe" ? "Processing..." : "Switch Plan"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <p className="text-on-surface-variant text-sm">
                Choose a plan to unlock all features and cloud storage.
              </p>
              {/* <!-- Toggle Switch --> */}
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-bold uppercase tracking-wider ${!isYearly ? "text-on-surface" : "text-outline-variant"}`}>Monthly</span>
                <div 
                  className="relative w-12 h-6 bg-surface-container rounded-full p-1 cursor-pointer transition-colors border border-outline-variant/10"
                  onClick={() => setIsYearly(!isYearly)}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-primary rounded-full transition-transform ${isYearly ? "translate-x-6" : "translate-x-0"}`}></div>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${isYearly ? "text-on-surface" : "text-outline-variant"}`}>Yearly</span>
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[9px] font-bold tracking-tight ml-1">SAVE 25%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { id: "free", name: "Free", price: 0, students: "15" },
                { id: "starter", name: "Starter", price: 10000, students: "100" },
                { id: "school", name: "School", price: 20000, students: "500", popular: true },
                { id: "enterprise", name: "Enterprise", price: 33333, students: "Unlimited" },
              ].map((p) => {
                const displayPrice = isYearly ? Math.round(p.price * 0.75) : p.price;
                return (
                  <div 
                    key={p.id}
                    className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 text-center hover:border-primary/20 transition-all flex flex-col relative overflow-hidden"
                  >
                    {p.popular && (
                      <span className="absolute top-0 right-0 bg-primary text-on-primary text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-bl-lg">
                        Popular
                      </span>
                    )}
                    <h3 className="font-headline font-bold text-lg mb-1">{p.name}</h3>
                    <p className="text-xs text-outline-variant mb-4 flex-grow">{p.students} Students</p>
                    <p className="text-3xl font-headline font-extrabold mb-1">
                      ₦{displayPrice.toLocaleString()}
                      <span className="text-sm font-normal text-outline-variant">/mo</span>
                    </p>
                    <div className="text-[10px] text-primary h-3 mt-1 font-bold">
                      {isYearly && p.price > 0 && `₦${(displayPrice * 12).toLocaleString()} billed annually`}
                    </div>
                    <button
                      onClick={() => handleSubscribe(p.id)}
                      disabled={actionLoading === "subscribe"}
                      className="mt-4 w-full bg-surface-container-high text-on-surface py-3 rounded-lg font-headline font-bold text-sm hover:bg-surface-container-highest transition-colors border border-outline-variant/10 disabled:opacity-50"
                    >
                      {actionLoading === "subscribe" ? "Processing..." : "Subscribe"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Cloud Backups */}
      <div className="glass-card rounded-xl border border-outline-variant/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-container/10 text-primary">
              <CloudUpload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg">Cloud Backups</h2>
              <p className="text-xs text-outline-variant">
                Secure cloud backups of your exam data
              </p>
            </div>
          </div>
          <button
            onClick={fetchBackups}
            disabled={backupsLoading}
            className="p-2 rounded-lg hover:bg-surface-container-high text-outline-variant hover:text-on-surface transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${backupsLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {backupsLoading && backups.length === 0 ? (
          <p className="text-center text-on-surface-variant text-sm py-8">
            Loading backups...
          </p>
        ) : backups.length === 0 ? (
          <div className="text-center py-12">
            <CloudUpload className="w-12 h-12 text-outline-variant/30 mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">No backups yet</p>
            <p className="text-outline-variant text-sm mt-1">
              Backups created from your CBT application will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {backups.map((b) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/5 gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-on-surface">
                      {b.label || "Untitled Backup"}
                    </p>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {formatBytes(b.size_bytes)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-outline-variant">
                    <span>
                      {new Date(b.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>•</span>
                    <span>{b.record_count} records</span>
                    <span>•</span>
                    <span className="capitalize">
                      {b.entities.replace(/,/g, ", ")}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {b.is_synced ? (
                    <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-500 bg-emerald-400/10 border border-emerald-400/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Synced
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRestoreBackup(b.id)}
                      disabled={restoringId === b.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-indigo-400 bg-indigo-400/10 hover:bg-indigo-400/20 transition-colors border border-indigo-400/20 disabled:opacity-50"
                      title="Sync this backup data to your Dashboard"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${restoringId === b.id ? "animate-spin" : ""}`} />
                      {restoringId === b.id ? "Syncing..." : "Sync to Dashboard"}
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadBackup(b.id, b.label)}
                    disabled={downloadingId === b.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface bg-surface-container-high hover:bg-surface-container-highest transition-colors border border-outline-variant/10 disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
