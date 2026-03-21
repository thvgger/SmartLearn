"use client";

import { useState, useEffect, useCallback } from "react";
import { useDashboardUser } from "../layout";
import {
  Settings as SettingsIcon,
  CreditCard,
  Building2,
  CloudUpload,
  Download,
  Trash2,
  RefreshCw,
  Shield,
  Mail,
  Phone,
  User,
} from "lucide-react";

interface BackupEntry {
  id: string;
  license_key: string;
  label: string | null;
  entities: string;
  size_bytes: number;
  record_count: number;
  created_at: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function SettingsPage() {
  const user = useDashboardUser();
  const [actionLoading, setActionLoading] = useState("");
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [backupsLoading, setBackupsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } finally {
      setActionLoading("");
    }
  }

  async function handleDeleteBackup(id: string) {
    if (!confirm("Are you sure you want to delete this backup?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/backups/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBackups((prev) => prev.filter((b) => b.id !== id));
      }
    } catch {
      // silent
    } finally {
      setDeletingId(null);
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
          <div className="bg-surface-container-low rounded-lg p-5 border border-outline-variant/5">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-on-surface capitalize">
                  {sub?.plan} Plan
                </p>
                {expiresAt && (
                  <p className="text-xs text-outline-variant">
                    Expires {expiresAt}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-outline-variant">
              Your subscription is active. You have full access to all CBT features.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-on-surface-variant text-sm mb-6">
              Choose a plan to activate your CBT license and unlock all features.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Basic Plan */}
              <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 text-center hover:border-primary/20 transition-all">
                <h3 className="font-headline font-bold text-lg mb-1">Basic</h3>
                <p className="text-xs text-outline-variant mb-4">1 month access</p>
                <p className="text-3xl font-headline font-extrabold mb-1">
                  ₦5,000
                  <span className="text-sm font-normal text-outline-variant">/mo</span>
                </p>
                <button
                  onClick={() => handleSubscribe("basic")}
                  disabled={actionLoading === "subscribe"}
                  className="mt-4 w-full bg-surface-container-high text-on-surface py-3 rounded-lg font-headline font-bold text-sm hover:bg-surface-container-highest transition-colors border border-outline-variant/10 disabled:opacity-50"
                >
                  {actionLoading === "subscribe" ? "Processing..." : "Subscribe"}
                </button>
              </div>

              {/* Premium Plan */}
              <div className="bg-surface-container-low rounded-xl p-6 border border-primary/30 text-center relative overflow-hidden hover:border-primary/50 transition-all">
                <span className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-lg">
                  Best Value
                </span>
                <h3 className="font-headline font-bold text-lg mb-1">Premium</h3>
                <p className="text-xs text-outline-variant mb-4">1 year access</p>
                <p className="text-3xl font-headline font-extrabold mb-1">
                  ₦40,000
                  <span className="text-sm font-normal text-outline-variant">/yr</span>
                </p>
                <button
                  onClick={() => handleSubscribe("premium")}
                  disabled={actionLoading === "subscribe"}
                  className="mt-4 w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-headline font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20 disabled:opacity-50"
                >
                  {actionLoading === "subscribe" ? "Processing..." : "Subscribe"}
                </button>
              </div>
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
                Backups synced from your CBT devices
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
                  <button
                    onClick={() => handleDownloadBackup(b.id, b.label)}
                    disabled={downloadingId === b.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface bg-surface-container-high hover:bg-surface-container-highest transition-colors border border-outline-variant/10 disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloadingId === b.id ? "..." : "Download"}
                  </button>
                  <button
                    onClick={() => handleDeleteBackup(b.id)}
                    disabled={deletingId === b.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-error hover:bg-error/10 transition-colors border border-error/20 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {deletingId === b.id ? "..." : "Delete"}
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
