import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createLicenseToken } from "@/lib/auth";

// This endpoint is called by the CBT app to verify a license key
// and receive a JWT token for offline validation.
export async function POST(req: NextRequest) {
  try {
    const { license_key } = await req.json();

    if (!license_key) {
      return NextResponse.json(
        { valid: false, error: "License key is required" },
        { status: 400 },
      );
    }

    // Find the license key
    const license = await prisma.licenseKey.findUnique({
      where: { key: license_key },
      include: {
        user: {
          include: { subscription: true },
        },
      },
    });

    if (!license || !license.is_active) {
      return NextResponse.json(
        { valid: false, error: "Invalid or deactivated license key" },
        { status: 404 },
      );
    }

    // Check subscription status
    const subscription = license.user.subscription;
    if (
      !subscription ||
      subscription.status !== "active" ||
      (subscription.expires_at &&
        new Date(subscription.expires_at) < new Date())
    ) {
      return NextResponse.json(
        {
          valid: false,
          error: "Subscription is not active or has expired. Please renew.",
        },
        { status: 403 },
      );
    }

    // Update last verified timestamp
    await prisma.licenseKey.update({
      where: { id: license.id },
      data: { last_verified: new Date() },
    });

    // Generate a signed JWT that the CBT app can use offline for 7 days
    const token = await createLicenseToken({
      licenseKey: license.key,
      schoolName: license.user.school_name,
      plan: subscription.plan,
    });

    return NextResponse.json({
      valid: true,
      token,
      school_name: license.user.school_name,
      plan: subscription.plan,
      expires_at: subscription.expires_at,
    });
  } catch (error) {
    console.error("License verification error:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
