import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashSync } from "bcryptjs";
import { createSessionToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      password,
      school_name,
      contact_name,
      phone,
      role_title,
      school_size,
      country,
      referral,
      otp,
    } = await req.json();

    if (!email || !password || !school_name || !contact_name || !otp) {
      return NextResponse.json(
        {
          error: "Email, password, school name, contact name, and OTP are required",
        },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    // Verify the OTP
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

    // Create user with hashed password
    const hashedPassword = hashSync(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        school_name,
        contact_name,
        phone: phone || null,
        role_title: role_title || null,
        school_size: school_size || null,
        country: country || null,
        referral: referral || null,
        email_verified: true,
        subscription: {
          create: {
            plan: "free",
            status: "inactive",
          },
        },
      },
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

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
