import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Dummy subscription endpoint
// In production, this would integrate with Stripe/Paystack
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await req.json();
    const validPlans = ["basic", "premium"];

    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'basic' or 'premium'" },
        { status: 400 },
      );
    }

    // Determine subscription duration based on plan (dummy)
    const now = new Date();
    const expiresAt = new Date(now);
    if (plan === "basic") {
      expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year
    }

    const subscription = await prisma.subscription.upsert({
      where: { user_id: session.userId },
      update: {
        plan,
        status: "active",
        starts_at: now,
        expires_at: expiresAt,
      },
      create: {
        user_id: session.userId,
        plan,
        status: "active",
        starts_at: now,
        expires_at: expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        starts_at: subscription.starts_at,
        expires_at: subscription.expires_at,
      },
    });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
