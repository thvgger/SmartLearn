"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Monitor,
  Plus,
  Copy,
  CheckCircle2,
  XCircle,
  Shield,
  Clock,
  RefreshCw,
  Trash2,
} from "lucide-react";

interface LicenseKey {
  id: string;
  key: string;
  device_name: string | null;
  is_active: boolean;
  last_verified: string | null;
  created_at: string;
}

export default function DevicesPage() {
  const [licenses, setLicenses] = useState<LicenseKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchLicenses = useCallback(async () => {
    try {
      const res = await fetch("/api/licenses");
      if (res.ok) {
        const data = await res.json();
        setLicenses(data.keys || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ device_name: `Device ${licenses.length + 1}` }),
      });
      if (res.ok) {
        await fetchLicenses();
      }
    } catch {
      // silent
    } finally {
      setGenerating(false);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this license key? The device will no longer be able to authenticate.")) return;
    try {
      const res = await fetch(`/api/licenses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLicenses((prev) => prev.filter((l) => l.id !== id));
      }
    } catch {
      // silent
    }
  }

  function handleCopy(key: string) {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const activeCount = licenses.filter((l) => l.is_active).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-on-surface">
            Devices & Licenses
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Manage your CBT application license keys and connected devices.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-primary-container text-on-primary-container px-5 py-2.5 rounded-lg font-headline font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary-container/20 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {generating ? "Generating..." : "Generate Key"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-2">
            <Monitor className="w-5 h-5 text-primary" />
            <span className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Total Devices</span>
          </div>
          <p className="text-2xl font-headline font-extrabold">{licenses.length}</p>
        </div>
        <div className="glass-card rounded-xl p-5 border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Active</span>
          </div>
          <p className="text-2xl font-headline font-extrabold text-emerald-400">{activeCount}</p>
        </div>
        <div className="glass-card rounded-xl p-5 border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5 text-rose-400" />
            <span className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Revoked</span>
          </div>
          <p className="text-2xl font-headline font-extrabold text-rose-400">{licenses.length - activeCount}</p>
        </div>
      </div>

      {/* License Table */}
      <div className="glass-card rounded-xl border border-outline-variant/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <h2 className="font-headline font-bold text-lg">License Keys</h2>
          <button
            onClick={fetchLicenses}
            className="text-outline-variant hover:text-on-surface transition-colors p-1"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-on-surface-variant text-sm">
            Loading devices...
          </div>
        ) : licenses.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 text-outline-variant/30 mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">No license keys yet</p>
            <p className="text-outline-variant text-sm mt-1">
              Generate a key to connect your first CBT device.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/5">
            {licenses.map((lic) => (
              <div
                key={lic.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 gap-3 hover:bg-surface-container-high/30 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className={`p-2 rounded-lg ${
                      lic.is_active
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface">
                      {lic.device_name || "Unnamed Device"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <code className="text-xs text-outline-variant font-mono truncate max-w-[200px]">
                        {lic.key}
                      </code>
                      <button
                        onClick={() => handleCopy(lic.key)}
                        className="text-outline-variant hover:text-primary transition-colors shrink-0"
                        title="Copy key"
                      >
                        {copiedKey === lic.key ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {lic.last_verified && (
                    <span className="flex items-center gap-1 text-[11px] text-outline-variant">
                      <Clock className="w-3 h-3" />
                      Last verified{" "}
                      {new Date(lic.last_verified).toLocaleDateString()}
                    </span>
                  )}
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full ${
                      lic.is_active
                        ? "text-emerald-400 bg-emerald-400/10"
                        : "text-rose-400 bg-rose-400/10"
                    }`}
                  >
                    {lic.is_active ? "Active" : "Revoked"}
                  </span>
                  {lic.is_active && (
                    <button
                      onClick={() => handleRevoke(lic.id)}
                      className="p-1.5 rounded-md text-outline-variant hover:text-error hover:bg-error/10 transition-colors"
                      title="Revoke this key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
