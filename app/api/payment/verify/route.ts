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

        console.log("[Payment Verify] Verifying:", { rrr, reference });

        // Check if transaction exists
        const transaction = await prisma.transaction.findUnique({
            where: { reference }
        });

        if (!transaction) {
            console.error("[Payment Verify] Transaction not found:", reference);
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }

        console.log("[Payment Verify] Found transaction in DB:", transaction);

        if (transaction.status === "success") {
            console.log("[Payment Verify] Transaction already successful.");
            return NextResponse.json({ success: true, message: "Already verified" });
        }

        // Modern API uses transactionId (reference) for verification
        const verificationData = await verifyRemitaPayment(reference);
        console.log("[Payment Verify] Remita raw verification response:", JSON.stringify(verificationData, null, 2));
        
        // Remita success code is "00" for success in modern API
        const isSuccess = verificationData.status === "00";

        if (isSuccess) {
            console.log("[Payment Verify] Verification SUCCESS!");
            // Update transaction
            await prisma.transaction.update({
                where: { reference },
                data: {
                    status: "success",
                    rrr: rrr // Store the RRR from the client response
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

            console.log("[Payment Verify] Updating subscription to expire at:", expiresAt);

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
            console.error("[Payment Verify] Verification FAILED:", verificationData.message);
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
