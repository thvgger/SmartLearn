import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

const REMITA_MERCHANT_ID = process.env.REMITA_MERCHANT_ID || "";
const REMITA_API_KEY = process.env.REMITA_API_KEY || "";
const REMITA_SERVICE_TYPE_ID = process.env.REMITA_SERVICE_TYPE_ID || "";
const IS_PRODUCTION = process.env.NEXT_PUBLIC_REMITA_ENV === "production";
const REMITA_BASE_URL_V1 = IS_PRODUCTION ? "https://remita.net" : "https://demo.remita.net";

const PRICES: Record<string, number> = {
    free: 0,
    free_yearly: 0,
    starter: 10000,
    starter_yearly: 90000,
    school: 20000,
    school_yearly: 180000,
    enterprise: 33333,
    enterprise_yearly: 300000
};

export async function GET(req: NextRequest) {
    // This endpoint should be secured by a cron secret in production
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || "dev-cron-secret"}`) {
        // Allow in development, but warn
        if (process.env.NODE_ENV === "production") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // Find subscriptions expiring in the next 24 hours that are set to auto-renew
        const expiringSubscriptions = await prisma.subscription.findMany({
            where: {
                status: "active",
                auto_renew: true,
                expires_at: {
                    lte: tomorrow,
                    gt: now // Already expired ones might need separate handling or just retry them
                },
                remita_token: { not: null }
            },
            include: { user: true }
        });

        console.log(`[Auto-Debit] Found ${expiringSubscriptions.length} subscriptions to auto-renew.`);

        const results = [];

        for (const sub of expiringSubscriptions) {
            const amount = PRICES[sub.plan] || 0;
            if (amount === 0) continue; // Free plans don't need billing

            const reference = `RENEW-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${Date.now()}`;
            
            // Hash = merchantId + serviceTypeId + orderId + amount + apiKey
            const rawData = `${REMITA_MERCHANT_ID}${REMITA_SERVICE_TYPE_ID}${reference}${amount}${REMITA_API_KEY}`;
            const hash = crypto.createHash("sha512").update(rawData).digest("hex");

            const mandateId = sub.remita_mandate_id || sub.remita_token; // Use token if mandate ID is null

            const payload = {
                merchantId: REMITA_MERCHANT_ID,
                serviceTypeId: REMITA_SERVICE_TYPE_ID,
                mandateId: mandateId,
                amount: amount.toString(),
                orderId: reference,
                hash: hash
            };

            console.log(`[Auto-Debit] Charging ${sub.user.email} (Plan: ${sub.plan}, Amount: ${amount})`);

            try {
                // Create a pending transaction
                await prisma.transaction.create({
                    data: {
                        user_id: sub.user_id,
                        amount,
                        plan: sub.plan,
                        reference,
                        auto_renew: true,
                        status: "pending",
                        payment_method: "auto-debit"
                    }
                });

                // Call Remita Direct Debit
                const url = `${REMITA_BASE_URL_V1}/remita/exapp/api/v1/send/api/echannelsvc/custom/mandate/debit`;
                
                // For development/demo without real standing orders, we simulate success
                let isSuccess = false;
                
                if (process.env.NODE_ENV === "development" && !mandateId?.startsWith("REAL_")) {
                    console.log(`[Auto-Debit] Development mode: Simulating successful charge for ${sub.user.email}`);
                    isSuccess = true;
                } else {
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `remitaConsumerKey=${REMITA_MERCHANT_ID},remitaConsumerToken=${hash}`
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    const data = await response.json().catch(() => ({}));
                    // Typically status code 00 means successful debit
                    isSuccess = data.statuscode === "00";
                }

                if (isSuccess) {
                    // Update Transaction
                    await prisma.transaction.update({
                        where: { reference },
                        data: { status: "success" }
                    });

                    // Push expiry date forward
                    const newExpiresAt = new Date(sub.expires_at || now);
                    if (sub.plan.endsWith("_yearly")) {
                        newExpiresAt.setFullYear(newExpiresAt.getFullYear() + 1);
                    } else {
                        newExpiresAt.setMonth(newExpiresAt.getMonth() + 1);
                    }

                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: { expires_at: newExpiresAt }
                    });

                    results.push({ email: sub.user.email, status: "renewed", newExpiresAt });
                } else {
                    console.error(`[Auto-Debit] Charge failed for ${sub.user.email}`);
                    // Mark transaction as failed
                    await prisma.transaction.update({
                        where: { reference },
                        data: { status: "failed" }
                    });
                    
                    // Mark subscription auto_renew to false to prevent infinite loops (or add retry logic)
                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: { auto_renew: false }
                    });
                    
                    results.push({ email: sub.user.email, status: "failed" });
                }

            } catch (err) {
                console.error(`[Auto-Debit] Error processing renewal for ${sub.user.email}:`, err);
                results.push({ email: sub.user.email, status: "error" });
            }
        }

        return NextResponse.json({ success: true, processed: expiringSubscriptions.length, results });

    } catch (error) {
        console.error("[Auto-Debit] Cron job error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
