import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SignJWT } from "jose";

// Using the same JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "smartlearn-secret-key-12345";
const key = new TextEncoder().encode(JWT_SECRET);

export async function POST(req: NextRequest) {
  try {
    const { license_key } = await req.json();

    if (!license_key) {
      return NextResponse.json({ error: "license_key is required" }, { status: 400 });
    }

    // Authenticate the CBT app using the license key
    const license = await prisma.licenseKey.findUnique({
      where: { key: license_key },
      include: { user: { include: { subscription: true } } },
    });

    if (!license || !license.is_active) {
      return NextResponse.json({ error: "Invalid or inactive license" }, { status: 403 });
    }

    const sub = license.user.subscription;
    if (
      !sub ||
      (sub.status !== "active" && sub.plan !== "free") ||
      (sub.expires_at && new Date(sub.expires_at) < new Date())
    ) {
      return NextResponse.json({ error: "Subscription expired" }, { status: 403 });
    }

    const schoolId = license.user.id;

    // Generate PowerSync token
    const token = await new SignJWT({
      // The `sub` claim identifies the user/device to PowerSync
      sub: schoolId,
      // Pass the schoolId so we can use it in sync_rules.yaml parameters
      school_id: schoolId,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT", kid: "smartlearn-key-1" })
      .setIssuedAt()
      .setIssuer("smartlearn-api")
      .setAudience("powersync")
      .setExpirationTime("24h") // PowerSync tokens are usually short-lived and refreshed automatically
      .sign(key);

    return NextResponse.json({
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      schoolId: schoolId,
    });
  } catch (error) {
    console.error("PowerSync Token Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "PowerSync Token Endpoint is live. Use POST with a valid license_key to generate a token." 
  });
}
