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

    // Check if an account with this email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Rate limit: check if a token was sent recently (last 60s)
    const lastToken = await prisma.verificationToken.findFirst({
      where: { identifier: email, type: "REGISTER" },
      orderBy: { expires: "desc" },
    });

    if (lastToken) {
      const now = Date.now();
      const expiresAt = lastToken.expires.getTime();
      // Tokens are valid for 15 mins. If it expires in > 14 mins, it was sent < 60s ago.
      if (expiresAt - now > 14 * 60 * 1000) {
        return NextResponse.json(
          { error: "Please wait a minute before requesting another code" },
          { status: 429 }
        );
      }
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
