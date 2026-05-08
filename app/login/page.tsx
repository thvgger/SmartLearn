"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { Mail, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

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
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center relative overflow-hidden pt-20">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-[460px] px-6 animate-fade-in-up">
          <div className="glass-card rounded-2xl p-8 md:p-12 shadow-2xl border border-white/5 backdrop-blur-2xl">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300">Portal Access</span>
              </div>
              <h1 className="text-3xl font-headline font-black tracking-tight text-white">Welcome back</h1>
              <p className="text-zinc-500 text-sm mt-2 font-medium">Securely access your institutional dashboard</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-xs font-bold animate-shake">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all font-medium" 
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
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Password</label>
                  <Link href="#" className="text-[10px] uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors font-black">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all font-medium" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  className="w-full bg-white text-black py-4 rounded-xl font-headline font-black text-sm tracking-tight hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : "Sign In"}
                </button>
              </div>
            </form>
            
            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-zinc-500 text-xs font-medium">
                New to Swift Learn? 
                <Link href="/register" className="text-white font-black ml-2 hover:underline">Create an account</Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center items-center gap-4 py-4 px-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-black">Secure AES-256 Encryption</span>
          </div>
        </div>
      </main>

      <footer className="w-full flex flex-col md:flex-row justify-between items-center px-8 py-10 bg-surface-container-lowest border-t border-white/5 z-10">
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
