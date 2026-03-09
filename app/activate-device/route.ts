import { getSession, createLicenseToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callback");

  if (!callbackUrl) {
    return new Response("Missing callback URL", { status: 400 });
  }

  // 1. Check Authentication
  const session = await getSession();

  if (!session) {
    // Redirect to login, but ensure we come back here with the callback intact
    const returnPath = encodeURIComponent(
      `/activate-device?callback=${encodeURIComponent(callbackUrl)}`,
    );
    return NextResponse.redirect(
      new URL(`/login?redirect=${returnPath}`, req.url),
    );
  }

  // 2. Check Subscription & Generate License Key
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const { subscription } = user;

    if (
      !subscription ||
      subscription.status !== "active" ||
      (subscription.expires_at &&
        new Date(subscription.expires_at) < new Date())
    ) {
      // Missing or expired subscription. Redirect to dashboard to pay.
      // After paying, they would need to click the app button again, or we can build complex return state.
      // For simplicity, just redirect them to dashboard.
      return NextResponse.redirect(
        new URL(
          "/dashboard?error=subscription_required_for_activation",
          req.url,
        ),
      );
    }

    // 3. Generate a new license key automatically for this device request
    const raw = randomBytes(8).toString("hex").toUpperCase();
    const key = `SL-${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`;

    await prisma.licenseKey.create({
      data: {
        user_id: user.id,
        key: key,
        device_name: "Auto-Activated Device",
        last_verified: new Date(),
      },
    });

    // 4. Generate the JWT offline token directly
    const token = await createLicenseToken({
      licenseKey: key,
      schoolName: user.school_name,
      plan: subscription.plan,
    });

    // 5. Redirect back to the CBT app with the token
    const callbackTarget = new URL(callbackUrl);
    callbackTarget.searchParams.set("token", token);

    return NextResponse.redirect(callbackTarget.toString());
  } catch (error) {
    console.error("Auto-activation error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
