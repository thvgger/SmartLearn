import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

// Use your verified domain. You can override this via the RESEND_FROM_EMAIL env variable.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "SwiftLearn <noreply@smartlearn.ifeoluwaschools.com.ng>";
export async function sendOTP(email: string, otp: string, type: "REGISTER" | "RESET_PASSWORD", name: string = "User") {
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
        <div style="font-family: sans-serif; max-w-xl; margin: 0 auto; padding: 20px; color: #374151;">
          <h2 style="color: #4f46e5; margin-bottom: 20px;">SwiftLearn</h2>
          <p style="font-size: 15px; margin-bottom: 15px;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5;">${type === "REGISTER"
          ? "Thanks for signing up! Please verify your email address to activate your account."
          : "We received a request to reset the password for your account."
        }</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 13px; color: #6b7280; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Your Verification Code</p>
            <h1 style="margin: 10px 0 0; font-size: 32px; letter-spacing: 4px; color: #111827; font-family: monospace;">${otp}</h1>
          </div>
          <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin-top: 20px;">This code will expire in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
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

export interface ReceiptDetails {
  contactName: string;
  schoolName: string;
  plan: string;
  amount: number;
  reference: string;
  rrr: string;
  date: Date;
}

export async function sendPaymentReceipt(email: string, details: ReceiptDetails) {
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN"
  }).format(details.amount);

  const formattedDate = details.date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  const subject = `SwiftLearn Subscription Receipt - ${details.plan.replace("_", " ").toUpperCase()}`;

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-w-xl; margin: 0 auto; padding: 30px; background-color: #0c0a09; color: #e7e5e4; border: 1px solid #292524; border-radius: 20px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
          
          <!-- Brand Header -->
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #6366f1; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">SwiftLearn</h2>
            <p style="margin: 5px 0 0; color: #78716c; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em;">Payment Receipt</p>
          </div>

          <!-- Alert / Success Header -->
          <div style="background: linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.02) 100%); border: 1px solid rgba(16,185,129,0.2); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 25px;">
            <div style="width: 40px; height: 40px; background-color: rgba(16,185,129,0.1); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px; color: #10b981; font-size: 20px; font-weight: bold; line-height: 40px;">✓</div>
            <h3 style="margin: 0 0 5px; color: #ffffff; font-size: 16px; font-weight: bold;">Payment Approved</h3>
            <p style="margin: 0; font-size: 12px; color: #10b981; font-weight: bold; text-transform: uppercase;">Secured by Remita</p>
          </div>

          <!-- Message -->
          <p style="font-size: 14px; line-height: 1.6; color: #d6d3d1; margin-bottom: 20px;">
            Dear <strong>${details.contactName}</strong>,
          </p>
          <p style="font-size: 14px; line-height: 1.6; color: #a8a29e; margin-bottom: 25px;">
            Your transaction has been verified successfully. We are pleased to confirm that the premium subscription for <strong>${details.schoolName}</strong> is now fully active.
          </p>

          <!-- Receipt Details Block -->
          <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 8px 0; color: #78716c; font-weight: 500;">Plan Activated</td>
                <td style="padding: 8px 0; text-align: right; color: #78716c; font-weight: bold; text-transform: capitalize;">${details.plan.replace("_", " ")} Plan</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78716c; font-weight: 500;">Remita RRR</td>
                <td style="padding: 8px 0; text-align: right; color: #78716c; font-weight: bold; font-family: monospace;">${details.rrr}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78716c; font-weight: 500;">Transaction Ref</td>
                <td style="padding: 8px 0; text-align: right; color: #78716c; font-family: monospace;">${details.reference}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78716c; font-weight: 500;">Date & Time</td>
                <td style="padding: 8px 0; text-align: right; color: #78716c;">${formattedDate}</td>
              </tr>
              <tr style="border-top: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 15px 0 0; color: #78716c; font-weight: bold; font-size: 15px;">Total Paid</td>
                <td style="padding: 15px 0 0; text-align: right; color: #6366f1; font-weight: 800; font-size: 18px;">${formattedAmount}</td>
              </tr>
            </table>
          </div>
          

          <!-- Call to Action -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="https://smartlearn.ifeoluwaschools.com.ng/dashboard" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: bold; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(99,102,241,0.2);">
              Go to Dashboard
            </a>
          </div>

          <!-- Footer Notes -->
          <div style="border-top: 1px solid #1c1917; pt-20; text-align: center; font-size: 11px; color: #57534e; line-height: 1.5;">
            <p style="margin: 0 0 5px;">This is a system generated transaction receipt for your subscription to SwiftLearn.</p>
            <p style="margin: 0;">If you have any questions or did not authorize this, please contact support.</p>
          </div>

        </div>
      `
    });

    if (error) {
      console.error("Error sending receipt email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Exception sending receipt email:", err);
    return { success: false, error: err };
  }
}
