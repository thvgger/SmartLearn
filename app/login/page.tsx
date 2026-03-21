"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { Mail, Lock, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
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

      router.push("/dashboard"); // Successful login
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />

      {/* <!-- Main Content Canvas --> */}
      <main className="flex-grow flex items-center justify-center relative overflow-hidden pt-20">
        {/* <!-- Ambient Background Glows --> */}
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15)_0%,rgba(139,92,246,0.05)_50%,transparent_100%)] opacity-60"></div>
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15)_0%,rgba(139,92,246,0.05)_50%,transparent_100%)] opacity-40"></div>
        
        {/* <!-- Login Card --> */}
        <div className="relative z-10 w-full max-w-[440px] px-6 animate-fade-up">
          <div className="glass-card rounded-xl p-10 shadow-2xl border border-white/10 backdrop-blur-[40px]">
            <div className="mb-10 text-center">
              <span className="text-primary tracking-[0.2em] uppercase text-[0.6875rem] font-medium mb-3 block font-label">Institutional Portal</span>
              <h1 className="text-3xl font-headline font-extrabold tracking-tight text-white">Welcome back</h1>
              <p className="text-on-surface-variant/70 text-sm mt-2">Enter your credentials to access your dashboard</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && <div className="p-3 bg-error/10 border border-error/20 rounded-md text-error text-sm font-medium">{error}</div>}
              <div className="space-y-2">
                <label className="block text-[0.6875rem] uppercase tracking-widest text-on-surface-variant font-medium ml-1">Corporate Email</label>
                <div className="relative group">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant group-focus-within:text-primary transition-colors" />
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:outline-none focus:border-primary pl-8 pb-3 text-on-surface placeholder:text-outline-variant/50 transition-all font-body text-sm" 
                    placeholder="name@institution.edu" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="block text-[0.6875rem] uppercase tracking-widest text-on-surface-variant font-medium ml-1">Password</label>
                  <Link href="#" className="text-[0.6875rem] uppercase tracking-widest text-primary hover:text-secondary transition-colors font-semibold">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-outline-variant group-focus-within:text-primary transition-colors" />
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:outline-none focus:border-primary pl-8 pb-3 text-on-surface placeholder:text-outline-variant/50 transition-all font-body text-sm" 
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
                  className="w-full bg-primary-container text-on-primary-container py-4 rounded-lg font-headline font-bold text-sm tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(128,131,255,0.25)] hover:shadow-[0_15px_40px_rgba(128,131,255,0.45)] disabled:opacity-50 disabled:pointer-events-none" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
            
            <div className="mt-10 pt-8 border-t border-outline-variant/15 text-center">
              <p className="text-on-surface-variant/60 text-sm">
                Don't have an institutional account? 
                <Link href="/register" className="text-primary font-bold ml-1 hover:underline">Sign up</Link>
              </p>
            </div>
          </div>
          
          {/* <!-- Trust Footer --> */}
          <div className="mt-8 flex justify-between items-center opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
            <div className="flex gap-6 items-center">
              <div className="h-6 w-24 bg-on-surface-variant/20 rounded"></div>
              <div className="h-6 w-20 bg-on-surface-variant/20 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Bank-grade Security</span>
            </div>
          </div>
        </div>
      </main>

      {/* <!-- Minimal Footer for Auth Pages --> */}
      <footer className="w-full flex flex-col md:flex-row justify-between items-center px-8 py-10 bg-[#0e0e14] border-t border-[#464554]/15 z-10">
        <div className="text-[#e4e1ea]/40 font-body text-[0.6875rem] uppercase tracking-widest mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} Swift Learn. Elevating institutional excellence.
        </div>
        <div className="flex gap-8">
          <Link href="/" className="text-[#e4e1ea]/40 font-body text-[0.6875rem] uppercase tracking-widest hover:text-[#c0c1ff] transition-colors">Home</Link>
          <Link href="/contact" className="text-[#e4e1ea]/40 font-body text-[0.6875rem] uppercase tracking-widest hover:text-[#c0c1ff] transition-colors">Contact</Link>
          <Link href="#" className="hidden sm:inline-block text-[#e4e1ea]/40 font-body text-[0.6875rem] uppercase tracking-widest hover:text-[#c0c1ff] transition-colors">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
