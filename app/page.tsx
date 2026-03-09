"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.1), transparent 50%)",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 40px",
        }}
        className={mounted ? "animate-fade-in" : ""}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            📚
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.2rem",
              letterSpacing: "-0.02em",
            }}
          >
            SmartLearn
          </span>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <Link href="/login" className="btn-outline">
            Sign in
          </Link>
          <Link href="/register" className="btn-primary">
            Get Started
          </Link>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "40px 20px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
        className={mounted ? "animate-slide-up" : ""}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 16px",
            background: "var(--primary-light)",
            color: "var(--primary)",
            borderRadius: "100px",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "24px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Computer Based Testing
        </div>

        <h1
          style={{
            fontSize: "4rem",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "24px",
            letterSpacing: "-0.04em",
            background: "linear-gradient(180deg, #ffffff, #a1a1aa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Manage your CBT Licenses
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--muted)",
            marginBottom: "40px",
            maxWidth: "600px",
            lineHeight: 1.6,
          }}
        >
          The central hub for schools. Subscribe and generate activation keys to
          unlock local offline CBT testing on your devices.
        </p>

        <div style={{ display: "flex", gap: "20px" }}>
          <Link
            href="/register"
            className="btn-primary"
            style={{ padding: "16px 32px", fontSize: "1.1rem" }}
          >
            Create School Account
          </Link>
          <Link
            href="/dashboard"
            className="btn-outline"
            style={{ padding: "16px 32px", fontSize: "1.1rem" }}
          >
            Go to Dashboard
          </Link>
        </div>
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "32px",
          color: "var(--muted)",
          fontSize: "0.9rem",
          borderTop: "1px solid var(--card-border)",
        }}
      >
        © {new Date().getFullYear()} SmartLearn CBT. All rights reserved.
      </footer>
    </div>
  );
}
