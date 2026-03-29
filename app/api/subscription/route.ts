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
    const validPlans = [
      "free",
      "starter", "starter_yearly",
      "school",  "school_yearly",
      "enterprise", "enterprise_yearly",
      "basic", "basic_yearly",
      "premium", "premium_yearly",
    ];

    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: `Invalid plan: '${plan}'` },
        { status: 400 },
      );
    }

    // Yearly plans get 12 months, monthly plans get 1 month, free is indefinite
    const now = new Date();
    const expiresAt = new Date(now);
    if (plan === "free") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 10); // effectively unlimited
    } else if (plan.endsWith("_yearly")) {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
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
