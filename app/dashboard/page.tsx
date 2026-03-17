"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Subscription {
  plan: string;
  status: string;
  expires_at: string | null;
}

interface User {
  id: string;
  email: string;
  school_name: string;
  contact_name: string;
  subscription: Subscription | null;
}

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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  // Backups
  const [backups, setBackups] = useState<BackupEntry[]>([]);
  const [backupsLoading, setBackupsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

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
    if (user) fetchBackups();
  }, [user, fetchBackups]);

  async function handleSubscribe(plan: string) {
    setActionLoading("subscribe");
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.ok) {
        // Refresh user data
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const data = await meRes.json();
          setUser(data.user);
        }
      }
    } finally {
      setActionLoading("");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
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

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--muted)" }}>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const sub = user.subscription;
  const isActive = sub?.status === "active";
  const expiresAt =
    sub?.expires_at ?
      new Date(sub.expires_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.06), transparent 50%)",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          borderBottom: "1px solid var(--card-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            📚
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
            SmartLearn
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            {user.school_name}
          </span>
          <button
            className="btn-outline"
            onClick={handleLogout}
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
          >
            Sign out
          </button>
        </div>
      </header>

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* Welcome */}
        <div className="animate-fade-in" style={{ marginBottom: "40px" }}>
          <h1
            style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "8px" }}
          >
            Dashboard
          </h1>
          <p style={{ color: "var(--muted)" }}>
            Welcome back, {user.contact_name}. Manage your subscription and
            license keys below.
          </p>
        </div>

        {/* ─── Subscription Section ─── */}
        <section
          className="glass-card animate-slide-up"
          style={{ padding: "32px", marginBottom: "28px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>
              Subscription
            </h2>
            <span
              className={`badge ${isActive ? "badge-active" : "badge-inactive"}`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {isActive ?
            <div>
              <p style={{ color: "var(--muted)", marginBottom: "8px" }}>
                Plan:{" "}
                <span
                  style={{
                    color: "var(--foreground)",
                    fontWeight: 600,
                    textTransform: "capitalize",
                  }}
                >
                  {sub?.plan}
                </span>
              </p>
              {expiresAt && (
                <p style={{ color: "var(--muted)" }}>
                  Expires:{" "}
                  <span style={{ color: "var(--foreground)" }}>
                    {expiresAt}
                  </span>
                </p>
              )}
            </div>
          : <>
              <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
                Choose a plan to activate your CBT license. You need an active
                subscription to use the CBT application.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {/* Basic Plan */}
                <div
                  className="glass-card"
                  style={{
                    flex: 1,
                    minWidth: "220px",
                    padding: "24px",
                    textAlign: "center",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    Basic
                  </h3>
                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: "0.85rem",
                      marginBottom: "16px",
                    }}
                  >
                    1 month access
                  </p>
                  <p
                    style={{
                      fontSize: "2rem",
                      fontWeight: 700,
                      marginBottom: "16px",
                    }}
                  >
                    ₦5,000
                    <span
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--muted)",
                        fontWeight: 400,
                      }}
                    >
                      /mo
                    </span>
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => handleSubscribe("basic")}
                    disabled={actionLoading === "subscribe"}
                    style={{ width: "100%", fontSize: "0.9rem" }}
                  >
                    {actionLoading === "subscribe" ?
                      "Processing..."
                    : "Subscribe"}
                  </button>
                </div>

                {/* Premium Plan */}
                <div
                  className="glass-card animate-pulse-glow"
                  style={{
                    flex: 1,
                    minWidth: "220px",
                    padding: "24px",
                    textAlign: "center",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      marginBottom: "4px",
                    }}
                  >
                    Premium
                  </h3>
                  <p
                    style={{
                      color: "var(--muted)",
                      fontSize: "0.85rem",
                      marginBottom: "16px",
                    }}
                  >
                    1 year access
                  </p>
                  <p
                    style={{
                      fontSize: "2rem",
                      fontWeight: 700,
                      marginBottom: "16px",
                    }}
                  >
                    ₦40,000
                    <span
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--muted)",
                        fontWeight: 400,
                      }}
                    >
                      /yr
                    </span>
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => handleSubscribe("premium")}
                    disabled={actionLoading === "subscribe"}
                    style={{ width: "100%", fontSize: "0.9rem" }}
                  >
                    {actionLoading === "subscribe" ?
                      "Processing..."
                    : "Subscribe"}
                  </button>
                </div>
              </div>
            </>
          }
        </section>

        {/* ─── Cloud Backups Section ─── */}
        <section
          className="glass-card animate-slide-up"
          style={{ padding: "32px", marginBottom: "28px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2 style={{ fontSize: "1.2rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                ☁️ Cloud Backups
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "4px" }}>
                Backups uploaded from your CBT applications.
              </p>
            </div>
            <button
              className="btn-outline"
              onClick={fetchBackups}
              disabled={backupsLoading}
              style={{ padding: "8px 16px", fontSize: "0.85rem" }}
            >
              {backupsLoading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>

          {backupsLoading && backups.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--muted)", padding: "32px 0" }}>
              Loading backups...
            </p>
          ) : backups.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)" }}>
              <p style={{ fontSize: "2rem", marginBottom: "8px" }}>💾</p>
              <p style={{ fontWeight: 500 }}>No backups yet</p>
              <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                Backups created from your CBT application will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {backups.map((b) => (
                <div
                  key={b.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderRadius: "12px",
                    border: "1px solid var(--card-border)",
                    background: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                        {b.label || "Untitled Backup"}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background: "rgba(99, 102, 241, 0.1)",
                          color: "#6366f1",
                        }}
                      >
                        {formatBytes(b.size_bytes)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginTop: "6px",
                        fontSize: "0.8rem",
                        color: "var(--muted)",
                      }}
                    >
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
                      <span style={{ textTransform: "capitalize" }}>
                        {b.entities.replace(/,/g, ", ")}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", marginLeft: "16px" }}>
                    <button
                      className="btn-outline"
                      style={{ padding: "6px 12px", fontSize: "0.8rem" }}
                      disabled={downloadingId === b.id}
                      onClick={() => handleDownloadBackup(b.id, b.label)}
                    >
                      {downloadingId === b.id ? "⏳" : "⬇️"} Download
                    </button>
                    <button
                      className="btn-outline"
                      style={{
                        padding: "6px 12px",
                        fontSize: "0.8rem",
                        color: "#ef4444",
                        borderColor: "rgba(239, 68, 68, 0.3)",
                      }}
                      disabled={deletingId === b.id}
                      onClick={() => handleDeleteBackup(b.id)}
                    >
                      {deletingId === b.id ? "⏳" : "🗑️"} Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
