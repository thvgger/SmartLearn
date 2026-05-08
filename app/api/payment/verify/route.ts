import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRemitaPayment } from "@/lib/remita";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { rrr, reference } = body;

        if (!rrr || !reference) {
            console.error("[Payment Verify] Missing params:", { rrr, reference });
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // Check if transaction exists
        const transaction = await prisma.transaction.findUnique({
            where: { reference }
        });

        if (!transaction) {
            console.error("[Payment Verify] Transaction not found:", reference);
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        if (transaction.status === "success") {
            return NextResponse.json({ success: true, message: "Already verified" });
        }

        const verificationData = await verifyRemitaPayment(rrr);
        console.log("[Payment Verify] Remita response:", verificationData);
        
        // Remita success code is usually "00" or "01"
        const isSuccess = verificationData.status === "00" || verificationData.status === "01";

        if (isSuccess) {
            // Update transaction
            const transaction = await prisma.transaction.update({
                where: { reference },
                data: {
                    status: "success",
                    rrr: rrr
                }
            });

            // Update user subscription
            const now = new Date();
            const expiresAt = new Date(now);
            if (transaction.plan.endsWith("_yearly")) {
                expiresAt.setFullYear(expiresAt.getFullYear() + 1);
            } else {
                expiresAt.setMonth(expiresAt.getMonth() + 1);
            }

            await prisma.subscription.upsert({
                where: { user_id: transaction.user_id },
                update: {
                    plan: transaction.plan,
                    status: "active",
                    starts_at: now,
                    expires_at: expiresAt
                },
                create: {
                    user_id: transaction.user_id,
                    plan: transaction.plan,
                    status: "active",
                    starts_at: now,
                    expires_at: expiresAt
                }
            });

            return NextResponse.json({
                success: true,
                message: "Payment verified and subscription updated"
            });
        } else {
            // Update transaction status to failed if explicitly failed
            await prisma.transaction.update({
                where: { reference },
                data: {
                    status: "failed",
                    rrr: rrr
                }
            });

            return NextResponse.json({
                success: false,
                message: verificationData.message || "Payment verification failed"
            });
        }

    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
