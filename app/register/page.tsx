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

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
    <div className="bg-background text-foreground font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />

      <main className="relative flex-grow flex items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-violet-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-[560px] px-6 animate-fade-in-up">
          <Card className="bg-zinc-950/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/5 p-0 gap-0">
            <CardContent className="p-8 md:p-12">
              <div className="mb-10 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4">
                  <Icon icon="lucide:sparkles" className="w-3 h-3 text-indigo-400" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300">Join the Future</span>
                </div>
                <h1 className="font-headline text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                  Create your <br className="hidden sm:block"/> school account
                </h1>
                <p className="text-zinc-500 text-sm mt-2 font-medium">Join hundreds of institutions using Swift Learn.</p>
              </div>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Full Name</Label>
                    <div className="relative group">
                      <Icon icon="lucide:user" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                      <Input 
                        className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus-visible:ring-indigo-500/50 transition-all font-medium" 
                        placeholder="Principal Name" 
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Institution</Label>
                    <div className="relative group">
                      <Icon icon="lucide:landmark" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                      <Input 
                        className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus-visible:ring-indigo-500/50 transition-all font-medium" 
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
                  <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Work Email</Label>
                  <div className="relative group">
                    <Icon icon="lucide:send" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                    <Input 
                      className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus-visible:ring-indigo-500/50 transition-all font-medium" 
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
                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Phone Number</Label>
                    <div className="relative group">
                      <Icon icon="lucide:phone" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                      <Input 
                        className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-sm text-white placeholder:text-zinc-700 focus-visible:ring-indigo-500/50 transition-all font-medium" 
                        placeholder="+234..." 
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Password</Label>
                    <div className="relative group">
                      <Icon icon="lucide:lock" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
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
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full h-14 bg-white text-black font-black text-sm tracking-tight hover:bg-zinc-200 shadow-xl" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Start Your Free Trial"}
                    {!loading && <Icon icon="lucide:arrow-right" className="ml-2 w-4 h-4" />}
                  </Button>
                </div>
              </form>
              
              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                <p className="text-zinc-500 text-xs font-medium">
                  Already registered? 
                  <Link href="/login" className="text-white font-black ml-2 hover:underline transition-all">Sign in instead</Link>
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 flex justify-center items-center gap-6 opacity-40 grayscale hover:opacity-100 transition-all">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:shield-check" className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Data Protected</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full flex justify-between items-center px-8 py-8 bg-zinc-950 border-t border-white/5 z-10">
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
