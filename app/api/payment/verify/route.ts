import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyRemitaPayment } from "@/lib/remita";
import { sendPaymentReceipt } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const { rrr, reference } = body;

        if (!rrr || !reference) {
            console.error("[Payment Verify] Missing params:", { rrr, reference });
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        console.log("[Payment Verify] Verifying:", { rrr, reference });

        // Check if transaction exists and include user details for emailing
        const transaction = await prisma.transaction.findUnique({
            where: { reference },
            include: { user: true }
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

        // The inline widget is initialized with `transactionId: reference`, so Remita expects `reference` for the modern API query
        console.log(`[Payment Verify] Attempting verification with Reference: ${reference}`);
        let verificationData = await verifyRemitaPayment(reference);
        console.log("[Payment Verify] Remita verification response (Reference):", JSON.stringify(verificationData, null, 2));
        
        // If reference verification failed, try with RRR as a fallback
        const needsFallback = !verificationData.status || 
                              verificationData.status === "34" || 
                              verificationData.status === "99" || 
                              verificationData.status === "025";
                              
        if (needsFallback && rrr && rrr !== reference) {
            console.log("[Payment Verify] Reference verification failed. Trying RRR fallback...");
            verificationData = await verifyRemitaPayment(rrr);
            console.log("[Payment Verify] RRR fallback response:", JSON.stringify(verificationData, null, 2));
        }
        
        // Remita success code is "00" or "01" for success in modern API
        const isSuccess = verificationData.status === "00" || verificationData.status === "01";

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

            // Send beautifully styled receipt to the school admin
            if (transaction.user) {
                try {
                    await sendPaymentReceipt(transaction.user.email, {
                        contactName: transaction.user.contact_name,
                        schoolName: transaction.user.school_name,
                        plan: transaction.plan,
                        amount: transaction.amount,
                        reference: transaction.reference,
                        rrr: rrr || "N/A",
                        date: now
                    });
                    console.log("[Payment Verify] Receipt emailed successfully to:", transaction.user.email);
                } catch (emailErr) {
                    console.error("[Payment Verify] Failed to send receipt email:", emailErr);
                }
            }

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
