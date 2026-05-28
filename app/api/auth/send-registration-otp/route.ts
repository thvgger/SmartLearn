import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOTP } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json().catch(() => ({}));

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    // Invalidate existing REGISTER tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email, type: "REGISTER" },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires,
        type: "REGISTER",
      },
    });

    // Send email with user's full name if provided
    await sendOTP(email, otp, "REGISTER", name || "User");

    return NextResponse.json({
      message: "Verification email sent",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
