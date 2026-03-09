"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterFormTemplate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";
  const [form, setForm] = useState({
    school_name: "",
    contact_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          school_name: form.school_name,
          contact_name: form.contact_name,
          phone: form.phone || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push(redirectUrl);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    {
      label: "School / Organization Name",
      key: "school_name",
      type: "text",
      placeholder: "e.g. Greenwood Academy",
      required: true,
    },
    {
      label: "Contact Person",
      key: "contact_name",
      type: "text",
      placeholder: "Full name",
      required: true,
    },
    {
      label: "Email Address",
      key: "email",
      type: "email",
      placeholder: "school@example.com",
      required: true,
    },
    {
      label: "Phone (optional)",
      key: "phone",
      type: "tel",
      placeholder: "+234 ...",
      required: false,
    },
    {
      label: "Password",
      key: "password",
      type: "password",
      placeholder: "At least 6 characters",
      required: true,
    },
    {
      label: "Confirm Password",
      key: "confirm_password",
      type: "password",
      placeholder: "Re-enter your password",
      required: true,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background:
          "radial-gradient(ellipse at top, rgba(99, 102, 241, 0.08), transparent 50%)",
      }}
    >
      <div
        className="glass-card animate-slide-up"
        style={{ width: "100%", maxWidth: "480px", padding: "40px" }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "24px",
            }}
          >
            🏫
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "4px",
            }}
          >
            Create your account
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
            Register your school to get started with SmartLearn CBT
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "20px",
              color: "var(--danger)",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((f) => (
            <div key={f.key} style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "var(--muted)",
                }}
              >
                {f.label}
              </label>
              <input
                type={f.type}
                className="input-field"
                placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => update(f.key, e.target.value)}
                required={f.required}
              />
            </div>
          ))}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: "100%", marginTop: "8px" }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "0.9rem",
            color: "var(--muted)",
          }}
        >
          Already have an account?{" "}
          <Link
            href={`/login${redirectUrl !== "/dashboard" ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
            style={{
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterFormTemplate />
    </Suspense>
  );
}
