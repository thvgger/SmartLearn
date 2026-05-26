"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error("Failed to process request");
      }
      setSuccess(true);
      
      // Navigate to reset password page automatically after 2s
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />

      <main className="relative flex-grow flex items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none"></div>

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
                <Link href="/login" className="inline-flex items-center text-xs font-bold text-zinc-500 hover:text-white mb-6 transition-colors">
                  <Icon icon="ri:arrow-left-s-line" className="w-4 h-4 mr-1" />
                  Back to login
                </Link>
                <h1 className="font-headline text-3xl font-black tracking-tight text-white mb-2">Forgot Password?</h1>
                <p className="text-zinc-400 text-sm">Don't worry, we'll send you reset instructions.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3">
                  <Icon icon="ri:error-warning-fill" className="w-4 h-4" />
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-xs font-bold flex items-center gap-3">
                  <Icon icon="ri:checkbox-circle-fill" className="w-4 h-4" />
                  If an account exists, a reset code was sent! Redirecting...
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Email address</Label>
                  <div className="relative group">
                    <Icon icon="ri:mail-line" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                    <Input 
                      className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-sm text-white focus-visible:ring-indigo-500/50" 
                      placeholder="admin@institution.edu" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      disabled={loading || success}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading || success}
                  className="w-full h-12 bg-white text-black font-black text-sm hover:bg-zinc-200 shadow-xl mt-4"
                >
                  {loading ? "Sending..." : "Reset Password"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
