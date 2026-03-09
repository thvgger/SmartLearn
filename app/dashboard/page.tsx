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

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

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
      </main>
    </div>
  );
}
