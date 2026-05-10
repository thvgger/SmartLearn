import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import Script from "next/script";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swift Learn - Computer Based Testing Platform for Schools",
  description:
    "Swift Learn helps schools run exams faster, reduce marking work, and produce accurate results. Replace paper exams with a secure digital testing system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Script
          src={(process.env.NEXT_PUBLIC_REMITA_ENV?.replace(/^['"]|['"]$/g, "")) === 'production' 
            ? "https://remita.net/payment/v1/remita-pay-inline.bundle.js"
            : "https://remitademo.net/payment/v1/remita-pay-inline.bundle.js"
          }
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
