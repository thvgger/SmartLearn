import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashSync } from "bcryptjs";
import { sendOTP } from "@/lib/email";
import crypto from "crypto";

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
    } = await req.json();

    if (!email || !password || !school_name || !contact_name) {
      return NextResponse.json(
        {
          error: "Email, password, school name, and contact name are required",
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
        email_verified: false,
        subscription: {
          create: {
            plan: "free",
            status: "inactive",
          },
        },
      },
    });

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires,
        type: "REGISTER",
      },
    });

    // Send email
    await sendOTP(email, otp, "REGISTER");

    return NextResponse.json({
      message: "Verification email sent",
      email: user.email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
