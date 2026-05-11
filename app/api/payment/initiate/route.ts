import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { initiateRemitaPayment, generateRRR } from "@/lib/remita";
import crypto from "crypto";

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

        let rrr = null;
        let remitaParams = await initiateRemitaPayment(remitaData);

        try {
            console.log("[Payment] Attempting server-side RRR generation...");
            const rrrResponse = await generateRRR(remitaData);
            console.log("[Payment] RRR Response:", rrrResponse);
            if (rrrResponse && rrrResponse.RRR) {
                rrr = rrrResponse.RRR;
            }
        } catch (rrrError) {
            console.error("[Payment] Server-side RRR generation failed, falling back to client-side:", rrrError);
        }

        return NextResponse.json({
            success: true,
            remitaParams,
            reference,
            rrr
        });

    } catch (error) {
        console.error("Payment initiation error:", error);
        return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
    }
}
