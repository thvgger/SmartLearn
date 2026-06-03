import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { initiateRemitaPayment, generateRRR } from "@/lib/remita";
import crypto from "crypto";
import { calculatePlanSwitch, PRICES } from "@/lib/billing";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            console.error("[Payment] Unauthorized attempt");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json().catch(() => ({}));
        const { plan } = body;

        if (!plan || PRICES[plan] === undefined) {
            console.error("[Payment] Invalid plan:", plan);
            return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
        }

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            include: { subscription: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const currentPlan = user.subscription?.plan || "free";
        const currentStatus = user.subscription?.status || "inactive";
        let expiresAt = user.subscription?.expires_at || null;

        if (currentStatus !== "active" || (expiresAt && new Date(expiresAt) < new Date())) {
            expiresAt = null;
        }

        const calc = calculatePlanSwitch(currentPlan, expiresAt, plan);
        const amount = calc.totalDue;
        const reference = `SL-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${Date.now()}`;

        if (amount === 0) {
            // Zero-dollar transaction (e.g. downgrading or switching to Free). Bypass Remita completely.
            await prisma.transaction.create({
                data: {
                    user_id: user.id,
                    amount: 0,
                    plan,
                    reference,
                    status: "success"
                }
            });

            // Update subscription with extra days if applicable
            const now = new Date();
            const newExpiresAt = new Date(now);
            if (calc.extraDays > 0) {
                newExpiresAt.setDate(newExpiresAt.getDate() + calc.extraDays);
            } else if (plan.endsWith("_yearly")) {
                newExpiresAt.setFullYear(newExpiresAt.getFullYear() + 1);
            } else {
                newExpiresAt.setMonth(newExpiresAt.getMonth() + 1);
            }

            await prisma.subscription.upsert({
                where: { user_id: user.id },
                update: {
                    plan: plan,
                    status: "active",
                    starts_at: now,
                    expires_at: newExpiresAt
                },
                create: {
                    user_id: user.id,
                    plan: plan,
                    status: "active",
                    starts_at: now,
                    expires_at: newExpiresAt
                }
            });

            return NextResponse.json({
                success: true,
                bypassed: true,
                reference
            });
        }

        // Non-zero amount: Proceed with Remita initiation
        await prisma.transaction.create({
            data: {
                user_id: user.id,
                amount,
                plan,
                reference,
                status: "pending"
            }
        });

        const remitaData = {
            orderId: reference,
            amount: amount,
            payerName: user.contact_name || user.school_name || "User",
            payerEmail: user.email,
            payerPhone: user.phone || "08000000000",
            description: `SmartLearn Subscription - ${plan}`
        };

        console.log("[Payment] Initiation Data:", remitaData);

        const remitaParams = await initiateRemitaPayment(remitaData);

        let rrr = null;
        try {
            const rrrResponse = await generateRRR(remitaData);
            if (rrrResponse && rrrResponse.statuscode === "025" && rrrResponse.RRR) {
                rrr = rrrResponse.RRR;
                console.log("[Payment] Successfully generated RRR:", rrr);
                // Update transaction with the generated RRR
                await prisma.transaction.update({
                    where: { reference },
                    data: { rrr }
                });
            } else {
                console.warn("[Payment] RRR generation failed or returned unexpected status:", rrrResponse);
            }
        } catch (rrrError) {
            console.error("[Payment] RRR generation error:", rrrError);
        }

        const finalResponse = {
            success: true,
            remitaParams,
            reference,
            rrr: rrr
        };
        console.log("[Payment] Returning response to frontend:", JSON.stringify(finalResponse, null, 2));
        return NextResponse.json(finalResponse);

    } catch (error) {
        console.error("Payment initiation error:", error);
        return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
    }
}
