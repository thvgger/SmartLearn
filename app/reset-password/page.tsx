"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getErrorMessage } from "@/lib/utils";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const qEmail = searchParams.get("email");
    if (qEmail) setEmail(qEmail);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      if (!res.ok) {
        throw res;
      }
      
      await refreshUser();
      router.push("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(await getErrorMessage(err, "Failed to reset password. Please ensure your OTP is correct."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />

      <main className="relative flex-grow flex items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[900px] px-6 mx-auto">
          <div className="bg-zinc-900 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
            
            {/* Left Side - Illustration */}
            <div className="hidden md:flex md:w-5/12 bg-zinc-950 p-10 flex-col justify-center relative overflow-hidden border-r border-white/5">
              <div className="relative w-full aspect-square z-10 opacity-90">
                <Image src="/forgot-password-illustration.png" alt="Security" fill className="object-contain" />
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-7/12 p-8 md:p-12 relative flex flex-col justify-center">
              <div className="mb-8">
                <h1 className="font-headline text-3xl font-black tracking-tight text-white mb-2">Set New Password</h1>
                <p className="text-zinc-400 text-sm">Enter the code sent to your email and a new password.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3">
                  <Icon icon="ri:error-warning-fill" className="w-4 h-4" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 hidden">
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">6-Digit Code</Label>
                  <div className="relative group">
                    <Icon icon="ri:key-line" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-blue-400 transition-colors" />
                    <Input 
                      className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-center text-lg tracking-[0.3em] font-mono text-white focus-visible:ring-blue-500/50" 
                      placeholder="000000" 
                      maxLength={6}
                      type="text" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">New Password</Label>
                  <div className="relative group">
                    <Icon icon="ri:lock-line" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-blue-400 transition-colors" />
                    <Input 
                      className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-sm text-white focus-visible:ring-blue-500/50" 
                      placeholder="••••••••" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-black text-sm shadow-xl mt-4 border-none"
                >
                  {loading ? "Updating..." : "Update Password & Login"}
                </Button>
              </form>
              
              <div className="mt-8 text-center border-t border-white/5 pt-6">
                <Link href="/login" className="text-zinc-500 hover:text-white text-xs font-bold transition-colors">
                  Return to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
