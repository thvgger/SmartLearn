import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const transaction = await prisma.transaction.findFirst({
            where: {
                user_id: session.userId,
                status: "pending",
                rrr: {
                    not: null
                }
            },
            orderBy: {
                created_at: "desc"
            }
        });

        return NextResponse.json({ success: true, transaction });
    } catch (error) {
        console.error("Fetch pending transaction error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
