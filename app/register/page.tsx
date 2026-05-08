"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { User, Building2, Mail, Phone, MapPin, Lock, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_name: fullName,
          school_name: institution,
          email,
          phone,
          password
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create account");
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

      <main className="relative flex-grow flex items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-[560px] px-6 animate-fade-in-up">
          <div className="glass-card rounded-2xl p-8 md:p-12 shadow-2xl border border-white/5 backdrop-blur-2xl">
            
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300">Join the Future</span>
              </div>
              <h1 className="font-headline text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                Create your <br/> school account
              </h1>
              <p className="text-zinc-500 text-sm mt-2 font-medium">Join hundreds of institutions using Swift Learn.</p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 bg-error/10 border border-error/20 rounded-xl text-error text-xs font-bold">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all font-medium" 
                      placeholder="Principal Name" 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Institution</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all font-medium" 
                      placeholder="School Name" 
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Work Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all font-medium" 
                    placeholder="admin@institution.edu" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all font-medium" 
                      placeholder="+234..." 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Password</label>
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
              </div>
              
              <div className="pt-4">
                <button 
                  className="w-full bg-white text-black py-4 rounded-xl font-headline font-black text-sm tracking-tight hover:bg-zinc-200 active:scale-[0.98] transition-all shadow-xl disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2" 
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? "Creating account..." : "Start Your Free Trial"}</span>
                  {!loading && <ArrowRight className="w-4 h-4" strokeWidth={3} />}
                </button>
              </div>
            </form>
            
            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <p className="text-zinc-500 text-xs font-medium">
                Already registered? 
                <Link href="/login" className="text-white font-black ml-2 hover:underline">Sign in instead</Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center items-center gap-6 opacity-40 grayscale hover:opacity-100 transition-all">
            <div className="h-4 w-20 bg-white/20 rounded"></div>
            <div className="h-4 w-24 bg-white/20 rounded"></div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Data Protected</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full flex justify-between items-center px-8 py-8 bg-surface-container-lowest border-t border-white/5 z-10">
        <div className="font-bold text-[10px] uppercase tracking-[0.15em] text-zinc-600">
          &copy; {new Date().getFullYear()} Swift Learn.
        </div>
        <div className="flex gap-6">
          <Link className="font-bold text-[10px] uppercase tracking-[0.15em] text-zinc-600 hover:text-white transition-colors" href="/">Home</Link>
          <Link className="font-bold text-[10px] uppercase tracking-[0.15em] text-zinc-600 hover:text-white transition-colors" href="/contact">Support</Link>
        </div>
      </footer>
    </div>
  );
}
