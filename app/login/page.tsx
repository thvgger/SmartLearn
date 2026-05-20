"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to log in");
      }

      await refreshUser();
      router.push("/dashboard");
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

      <main className="flex-grow flex items-center justify-center relative overflow-hidden pt-20">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-[460px] px-6 animate-fade-in-up">
          <Card className="bg-zinc-950/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/5 p-0 gap-0">
            <CardContent className="p-8 md:p-12">
              <div className="mb-10 text-center">
                <h1 className="text-3xl font-headline font-black tracking-tight text-white">Welcome back</h1>
                <p className="text-zinc-500 text-sm mt-2 font-medium">Securely access your institutional dashboard</p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Email Address</Label>
                  <div className="relative group">
                    <Icon icon="streamline:mail-send-envelope" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                    <Input 
                      className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus-visible:ring-indigo-500/50 transition-all font-medium" 
                      placeholder="admin@school.edu" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-end mb-1">
                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Password</Label>
                    <Link href="#" className="text-[10px] uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors font-black">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Icon icon="streamline:lock-1" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                    <Input 
                      className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus-visible:ring-indigo-500/50 transition-all font-medium" 
                      placeholder="••••••••" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full h-14 bg-white text-black font-black text-sm tracking-tight hover:bg-zinc-200 shadow-xl" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : "Sign In"}
                  </Button>
                </div>
              </form>
              
              <div className="mt-10 pt-8 border-t border-white/5 text-center">
                <p className="text-zinc-500 text-xs font-medium">
                  New to Swift Learn? 
                  <Link href="/register" className="text-white font-black ml-2 hover:underline transition-all">Create an account</Link>
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 flex justify-center items-center gap-4 py-4 px-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <Icon icon="streamline:shield-check-1" className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Secure AES-256 Encryption</span>
          </div>
        </div>
      </main>

      <footer className="w-full flex flex-col md:flex-row justify-between items-center px-8 py-10 bg-zinc-950 border-t border-white/5 z-10">
        <div className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.15em] mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Swift Learn &bull; Excellence in Education
        </div>
        <div className="flex gap-8">
          <Link href="/" className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.15em] hover:text-white transition-colors">Home</Link>
          <Link href="/contact" className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.15em] hover:text-white transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}
