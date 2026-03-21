"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { User, Building2, Mail, Phone, MapPin, Lock, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
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

      router.push("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <Navbar />

      {/* <!-- Main Content Canvas --> */}
      <main className="relative flex-grow flex items-center justify-center pt-28 pb-12 overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(128,131,255,0.08)_0%,rgba(13,13,25,1)_70%)]">
        {/* <!-- Background Ambient Glows --> */}
        <div className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full"></div>
        
        {/* <!-- Central Glassmorphic Card --> */}
        <div className="relative z-10 w-full max-w-xl px-6 animate-fade-up">
          <div className="glass-card backdrop-blur-xl p-8 md:p-12 rounded-xl shadow-[0_60px_60px_rgba(0,0,0,0.5)] border border-white/10 text-white">
            
            {/* <!-- Header --> */}
            <div className="mb-10">
              <span className="text-[0.6875rem] uppercase tracking-widest text-primary font-medium mb-2 block font-label">Institutional Excellence</span>
              <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Create your account
              </h1>
            </div>
            
            {/* <!-- Registration Form --> */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && <div className="p-3 bg-error/10 border border-error/20 rounded-md text-error text-sm font-medium">{error}</div>}
              {/* <!-- Full Name --> */}
              <div className="group">
                <label className="block text-[0.6875rem] uppercase tracking-widest text-outline-variant font-medium mb-2 group-focus-within:text-primary transition-colors">Full Name</label>
                <div className="relative flex items-center border-b border-outline-variant transition-all focus-within:border-primary pb-2">
                  <User className="text-outline-variant w-5 h-5 mr-3 group-focus-within:text-primary transition-colors" />
                  <input 
                    className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-white placeholder:text-outline-variant/50 font-body p-0" 
                    placeholder="John Doe" 
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* <!-- Institution Name --> */}
              <div className="group">
                <label className="block text-[0.6875rem] uppercase tracking-widest text-outline-variant font-medium mb-2 group-focus-within:text-primary transition-colors">Institution</label>
                <div className="relative flex items-center border-b border-outline-variant transition-all focus-within:border-primary pb-2">
                  <Building2 className="text-outline-variant w-5 h-5 mr-3 group-focus-within:text-primary transition-colors" />
                  <input 
                    className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-white placeholder:text-outline-variant/50 font-body p-0" 
                    placeholder="University of Lagos" 
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* <!-- Email Address --> */}
              <div className="group">
                <label className="block text-[0.6875rem] uppercase tracking-widest text-outline-variant font-medium mb-2 group-focus-within:text-primary transition-colors">Work Email</label>
                <div className="relative flex items-center border-b border-outline-variant transition-all focus-within:border-primary pb-2">
                  <Mail className="text-outline-variant w-5 h-5 mr-3 group-focus-within:text-primary transition-colors" />
                  <input 
                    className="bg-transparent border-none focus:ring-0 focus:outline-none w-full text-white placeholder:text-outline-variant/50 font-body p-0" 
                    placeholder="john@institution.edu" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* <!-- Phone Number --> */}
              <div className="group">
                <label className="block text-[0.6875rem] uppercase tracking-widest text-outline-variant font-medium mb-2 group-focus-within:text-primary transition-colors">Phone Number</label>
                <div className="relative flex items-center border-b border-outline-variant transition-all focus-within:border-primary pb-2">
                  <Phone className="text-outline-variant w-5 h-5 mr-3 group-focus-within:text-primary transition-colors" />
                  <input 
                    className="bg-transparent border-none focus:ring-0 w-full text-white placeholder:text-outline-variant/50 font-body p-0" 
                    placeholder="+234 000 000 0000" 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              
              {/* <!-- School Address --> */}
              <div className="group">
                <label className="block text-[0.6875rem] uppercase tracking-widest text-outline-variant font-medium mb-2 group-focus-within:text-primary transition-colors">School Address</label>
                <div className="relative flex items-center border-b border-outline-variant transition-all focus-within:border-primary pb-2">
                  <MapPin className="text-outline-variant w-5 h-5 mr-3 group-focus-within:text-primary transition-colors" />
                  <input 
                    className="bg-transparent border-none focus:ring-0 w-full text-white placeholder:text-outline-variant/50 font-body p-0" 
                    placeholder="123 University Road, Lagos" 
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              
              {/* <!-- Password --> */}
              <div className="group">
                <label className="block text-[0.6875rem] uppercase tracking-widest text-outline-variant font-medium mb-2 group-focus-within:text-primary transition-colors">Password</label>
                <div className="relative flex items-center border-b border-outline-variant transition-all focus-within:border-primary pb-2">
                  <Lock className="text-outline-variant w-5 h-5 mr-3 group-focus-within:text-primary transition-colors" />
                  <input 
                    className="bg-transparent border-none focus:ring-0 w-full text-white placeholder:text-outline-variant/50 font-body p-0" 
                    placeholder="••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {/* <!-- Submit Button --> */}
              <div className="pt-4">
                <button 
                  className="w-full disabled:opacity-50 disabled:pointer-events-none bg-primary-container text-on-primary-container font-headline font-bold tracking-tight py-4 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(128,131,255,0.25)] flex justify-center items-center gap-2" 
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? "Creating account..." : "Create Free Account"}</span>
                  {!loading && <ArrowRight className="w-4 h-4" strokeWidth={3} />}
                </button>
              </div>
            </form>
            
            {/* <!-- Footer Link --> */}
            <div className="mt-8 pt-8 border-t border-outline-variant/10 text-center">
              <p className="text-sm text-outline-variant font-body">
                Already have an institutional account? 
                <Link href="/login" className="text-primary font-semibold hover:underline decoration-primary/30 underline-offset-4 ml-1">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
          
          {/* <!-- Trust Badge --> */}
          <div className="mt-8 flex justify-center items-center gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <div className="h-6 w-24 bg-white/20 rounded"></div>
            <div className="h-6 w-32 bg-white/20 rounded"></div>
            <div className="h-6 w-20 bg-white/20 rounded"></div>
          </div>
        </div>
      </main>

      {/* <!-- Minimal Footer for Auth Pages --> */}
      <footer className="w-full flex justify-between items-center px-8 py-8 bg-[#0e0e14] border-t border-[#464554]/15 z-10">
        <div className="font-body text-[0.6875rem] uppercase tracking-widest text-[#e4e1ea]/40">
          &copy; {new Date().getFullYear()} Swift Learn.
        </div>
        <div className="flex gap-4 sm:gap-6">
          <Link className="font-body text-[0.6875rem] uppercase tracking-widest text-[#e4e1ea]/40 hover:text-[#c0c1ff] transition-opacity" href="/">Home</Link>
          <Link className="font-body text-[0.6875rem] uppercase tracking-widest text-[#e4e1ea]/40 hover:text-[#c0c1ff] transition-opacity" href="/contact">Support</Link>
        </div>
      </footer>
    </div>
  );
}
