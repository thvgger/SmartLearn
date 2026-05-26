import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 },
      );
    }

    const verification = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp,
        type: "REGISTER",
      },
    });

    if (!verification) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (verification.expires < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Mark user as verified
    const user = await prisma.user.update({
      where: { email },
      data: { email_verified: true },
    });

    // Delete token
    await prisma.verificationToken.delete({
      where: { id: verification.id },
    });

    // Create session
    const token = await createSessionToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
