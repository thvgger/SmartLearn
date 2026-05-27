import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use your verified domain. You can override this via the RESEND_FROM_EMAIL env variable.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "SwiftLearn <noreply@swiftlearn.ifeoluwaschools.com.ng>";
export async function sendOTP(email: string, otp: string, type: "REGISTER" | "RESET_PASSWORD") {
  const subject =
    type === "REGISTER"
      ? "Verify your SwiftLearn account"
      : "Reset your SwiftLearn password";

  const message =
    type === "REGISTER"
      ? `Welcome to SwiftLearn! Your verification code is: ${otp}. This code expires in 15 minutes.`
      : `You requested a password reset. Your verification code is: ${otp}. This code expires in 15 minutes.`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html: `
        <div style="font-family: sans-serif; max-w-xl; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4f46e5;">SwiftLearn</h2>
          <p>${
            type === "REGISTER"
              ? "Thanks for signing up! Please verify your email address."
              : "We received a request to reset your password."
          }</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; font-weight: bold;">Your Verification Code</p>
            <h1 style="margin: 10px 0 0; font-size: 32px; letter-spacing: 4px; color: #111827;">${otp}</h1>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code will expire in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      console.log(`\n\n=== DEV MODE: OTP FOR ${email} IS ${otp} ===\n\n`);
      return { success: false, error };
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`\n\n=== DEV MODE: OTP FOR ${email} IS ${otp} ===\n\n`);
    }

    return { success: true, data };
  } catch (err) {
    console.error("Exception sending email:", err);
    console.log(`\n\n=== DEV MODE: OTP FOR ${email} IS ${otp} ===\n\n`);
    return { success: false, error: err };
  }
}
