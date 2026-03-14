import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "smartlearn-default-secret-change-me",
);

// License signing secret (separate from auth)
const LICENSE_SECRET = new TextEncoder().encode(
  process.env.LICENSE_SECRET ||
    "smartlearn-license-secret-change-in-production",
);

// ─── Auth JWT (for browser sessions) ───────────────────────────────────

export async function createSessionToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .sign(SECRET);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { userId: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

// ─── License JWT (for CBT app offline validation) ──────────────────────

export async function createLicenseToken(payload: {
  licenseKey: string;
  schoolName: string;
  plan: string;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1m") // Set to 1 min for testing offline functionality
    .sign(LICENSE_SECRET);
}

export async function verifyLicenseToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, LICENSE_SECRET);
    return payload as {
      licenseKey: string;
      schoolName: string;
      plan: string;
      exp: number;
    };
  } catch {
    return null;
  }
}
