import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashSync } from "bcryptjs";
import { createSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json();

    if (!email || !otp || !password) {
      return NextResponse.json(
        { error: "Email, OTP, and new password are required" },
        { status: 400 },
      );
    }

    const verification = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp,
        type: "RESET_PASSWORD",
      },
    });

    if (!verification) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (verification.expires < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    const hashedPassword = hashSync(password, 10);

    // Update user password and ensure verified
    const user = await prisma.user.update({
      where: { email },
      data: { 
        password: hashedPassword,
        email_verified: true
      },
    });

    // Delete token
    await prisma.verificationToken.delete({
      where: { id: verification.id },
    });

    // Automatically log them in after reset
    const token = await createSessionToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
