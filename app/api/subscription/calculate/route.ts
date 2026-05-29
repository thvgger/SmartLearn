import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { calculatePlanSwitch } from "@/lib/billing";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const plan = searchParams.get("plan");

        if (!plan) {
            return NextResponse.json({ error: "Missing plan" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            include: { subscription: true }
        });

        if (!user || !user.subscription) {
            return NextResponse.json({ error: "User or subscription not found" }, { status: 404 });
        }

        const currentPlan = user.subscription.plan;
        const currentStatus = user.subscription.status;
        let expiresAt = user.subscription.expires_at;

        // If the subscription is expired or inactive, we don't apply credit.
        if (currentStatus !== "active" || (expiresAt && new Date(expiresAt) < new Date())) {
            expiresAt = null;
        }

        const calc = calculatePlanSwitch(currentPlan, expiresAt, plan);

        return NextResponse.json({
            success: true,
            ...calc
        });

    } catch (error) {
        console.error("Calculate subscription error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
