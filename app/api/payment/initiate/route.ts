import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { initiateRemitaPayment, generateRRR } from "@/lib/remita";
import crypto from "crypto";

const PRICES: Record<string, number> = {
    free: 0,
    free_yearly: 0,
    starter: 1500,
    starter_yearly: 15000,
    school: 3000,
    school_yearly: 30000,
    enterprise: 5000,
    enterprise_yearly: 50000
};

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

        const amount = PRICES[plan];
        const reference = `SL-${crypto.randomBytes(4).toString("hex").toUpperCase()}-${Date.now()}`;

        // Get user details
        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Create pending transaction
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
