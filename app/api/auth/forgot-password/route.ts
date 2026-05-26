import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOTP } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Don't leak whether user exists or not
      return NextResponse.json({ message: "If an account exists, a reset code was sent" });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Invalidate existing RESET_PASSWORD tokens
    await prisma.verificationToken.deleteMany({
      where: { identifier: email, type: "RESET_PASSWORD" },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires,
        type: "RESET_PASSWORD",
      },
    });

    // Send email
    await sendOTP(email, otp, "RESET_PASSWORD");

    return NextResponse.json({ message: "If an account exists, a reset code was sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
