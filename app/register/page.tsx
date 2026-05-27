"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { Icon } from "@iconify/react";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { getErrorMessage } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleSelection, setRoleSelection] = useState("");

  // Form Data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    contact_name: "",
    role_title: "",
    phone: "",
    school_name: "",
    school_size: "",
    country: "",
    referral: "",
    otp: "",
  });

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    setError("");
    setStep((s) => Math.min(s + 1, 4));
  };
  
  const prevStep = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      // Send OTP first
      const res = await fetch("/api/auth/send-registration-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!res.ok) {
        throw res;
      }
      nextStep(); // Move to OTP step
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(await getErrorMessage(err, "Failed to send verification code"));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError("");
    setLoading(true);
    try {
      // Create user account now that OTP is provided
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw res;
      }

      await refreshUser();
      router.push("/dashboard");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(await getErrorMessage(err, "Invalid OTP or registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 3) handleRegister();
    else if (step === 4) handleVerifyOTP();
    else nextStep();
  };

  const variants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div className="bg-background text-foreground font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />

      <main className="relative flex-grow flex items-center justify-center pt-20 sm:pt-24 md:pt-32 pb-10 sm:pb-12 md:pb-20 overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-violet-500/10 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-[900px] px-4 sm:px-6 mx-auto">
          <div className="bg-zinc-900 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl">
            
            {/* Left Side - Illustration */}
            <div className="hidden md:flex md:w-5/12 bg-zinc-950 p-10 flex-col justify-between relative overflow-hidden border-r border-white/5">
              <div className="relative z-10">
                {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
                  <Icon icon="ri:sparkling-line" className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">Join the Future</span>
                </div> */}
                <h2 className="text-2xl font-black text-white leading-tight">Elevate your school's learning experience.</h2>
                <p className="text-zinc-500 text-sm mt-3 font-medium">Join hundreds of modern institutions using SmartLearn today.</p>
              </div>
              <div className="relative w-full aspect-square mt-8 z-10 opacity-90 hover:opacity-100 transition-opacity">
                <Image src="/register-illustration.png" alt="Education Illustration" fill className="object-contain drop-shadow-2xl" />
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-7/12 p-6 sm:p-8 md:p-12 relative">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h1 className="font-headline text-xl sm:text-2xl font-black tracking-tight text-white">
                  {step === 1 && "Account Details"}
                  {step === 2 && "Personal Info"}
                  {step === 3 && "School Profile"}
                  {step === 4 && "Verify Email"}
                </h1>
                <div className="flex gap-1.5 sm:gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all ${step >= i ? "bg-indigo-500" : "bg-white/10"}`} />
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-start gap-3">
                  <Icon icon="ri:error-warning-fill" className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="flex-1 leading-normal">{error}</span>
                </div>
              )}

              <form onSubmit={onSubmit} className="relative space-y-6">
                <AnimatePresence mode="wait">
                  {/* STEP 1: Account Details */}
                  {step === 1 && (
                    <motion.div key="step1" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Work Email</Label>
                        <div className="relative group">
                          <Icon icon="ri:send-plane-line" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                          <Input className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-sm text-white focus-visible:ring-indigo-500/50" placeholder="admin@institution.edu" type="email" inputMode="email" autoComplete="email" value={formData.email} onChange={(e) => updateForm("email", e.target.value)} required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Password</Label>
                        <div className="relative group">
                          <Icon icon="ri:lock-line" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                          <Input className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-sm text-white focus-visible:ring-indigo-500/50" placeholder="••••••••" type="password" autoComplete="new-password" value={formData.password} onChange={(e) => updateForm("password", e.target.value)} required />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Personal Info */}
                  {step === 2 && (
                    <motion.div key="step2" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Full Name</Label>
                        <div className="relative group">
                          <Icon icon="ri:user-line" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400" />
                          <Input className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-sm text-white" placeholder="John Doe" autoComplete="name" value={formData.contact_name} onChange={(e) => updateForm("contact_name", e.target.value)} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Role / Title</Label>
                          <div className="relative group flex flex-col">
                            <div className="relative">
                              <Icon icon="ri:briefcase-line" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 pointer-events-none" />
                              <select 
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 pl-11 pr-10 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none cursor-pointer" 
                                value={roleSelection} 
                                onChange={(e) => {
                                  setRoleSelection(e.target.value);
                                  if (e.target.value !== "Other") updateForm("role_title", e.target.value);
                                  else updateForm("role_title", "");
                                }}
                              >
                                <option value="" className="bg-zinc-900">Select role...</option>
                                <option value="Principal" className="bg-zinc-900">Principal</option>
                                <option value="Teacher" className="bg-zinc-900">Teacher</option>
                                <option value="IT Administrator" className="bg-zinc-900">IT Administrator</option>
                                <option value="Other" className="bg-zinc-900">Other</option>
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 flex items-center">
                                <Icon icon="ri:arrow-down-s-line" className="w-4 h-4" />
                              </div>
                            </div>
                            {roleSelection === "Other" && (
                              <Input 
                                className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 px-4 text-sm text-white mt-3 animate-fade-in-up" 
                                placeholder="Please specify..." 
                                value={formData.role_title} 
                                onChange={(e) => updateForm("role_title", e.target.value)} 
                              />
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Phone</Label>
                          <div className="relative group">
                            <style dangerouslySetInnerHTML={{__html: `
                              .phone-custom .PhoneInputInput { background: transparent; border: none; color: white; outline: none; margin-left: 8px; font-size: 0.875rem; }
                              .phone-custom .PhoneInputCountryIcon { margin-left: 4px; }
                              .phone-custom .PhoneInputCountrySelect { background: #18181b; color: white; }
                            `}} />
                            <PhoneInput 
                              international 
                              defaultCountry="NG" 
                              value={formData.phone} 
                              onChange={(val) => updateForm("phone", val || "")} 
                              autoComplete="tel"
                              className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2 px-4 text-sm text-white focus-within:ring-1 focus-within:ring-indigo-500/50 phone-custom min-h-[50px]" 
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: School Profile */}
                  {step === 3 && (
                    <motion.div key="step3" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Institution Name</Label>
                        <div className="relative group">
                          <Icon icon="ri:government-line" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400" />
                          <Input className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 pl-11 pr-4 text-sm text-white" placeholder="Global High School" autoComplete="organization" value={formData.school_name} onChange={(e) => updateForm("school_name", e.target.value)} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">School Size</Label>
                          <div className="relative">
                            <select className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3.5 pl-4 pr-10 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500/50 appearance-none cursor-pointer" value={formData.school_size} onChange={(e) => updateForm("school_size", e.target.value)}>
                              <option value="" className="bg-zinc-900">Select size...</option>
                              <option value="1-100" className="bg-zinc-900">1 - 100 students</option>
                              <option value="101-500" className="bg-zinc-900">101 - 500 students</option>
                              <option value="501-1000" className="bg-zinc-900">501 - 1000 students</option>
                              <option value="1000+" className="bg-zinc-900">1000+ students</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 flex items-center">
                              <Icon icon="ri:arrow-down-s-line" className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1">Country</Label>
                          <Input className="w-full bg-white/[0.03] border-white/5 rounded-xl py-6 px-4 text-sm text-white" placeholder="e.g. Nigeria" autoComplete="country-name" value={formData.country} onChange={(e) => updateForm("country", e.target.value)} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: OTP Verification */}
                  {step === 4 && (
                    <motion.div key="step4" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-6 text-center pt-4">
                      <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20">
                        <Icon icon="ri:mail-send-line" className="w-8 h-8 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">Check your email</h3>
                        <p className="text-zinc-400 text-sm mt-2">We sent a 6-digit code to <span className="text-white font-medium">{formData.email}</span>.</p>
                      </div>
                      <div className="max-w-[200px] mx-auto mt-6">
                        <Input className="w-full bg-white/[0.03] border-white/10 hover:border-white/20 rounded-xl py-6 text-center text-2xl tracking-[0.5em] font-mono text-white placeholder:opacity-0 focus-visible:ring-indigo-500/50" placeholder="123456" maxLength={6} inputMode="numeric" pattern="[0-9]*" autoComplete="one-time-code" value={formData.otp} onChange={(e) => updateForm("otp", e.target.value)} required />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-4 pt-8 border-t border-white/5 mt-8">
                  {step > 1 && step < 4 && (
                    <Button type="button" onClick={prevStep} variant="outline" className="h-12 px-6 bg-transparent border-white/10 text-white hover:bg-white/5">
                      Back
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 h-12 bg-white text-black font-black text-sm hover:bg-zinc-200 shadow-xl border-none cursor-pointer"
                  >
                    {loading ? "Processing..." : step === 3 ? "Create Account" : step === 4 ? "Verify & Login" : "Continue"}
                    {!loading && <Icon icon={step >= 3 ? "ri:check-line" : "ri:arrow-right-line"} className="ml-2 w-4 h-4" />}
                  </Button>
                </div>
              </form>

              {step === 1 && (
                <div className="mt-10 sm:mt-16 md:mt-20 text-center">
                  <p className="text-zinc-500 text-xs font-medium">
                    Already registered? 
                    <Link href="/login" className="text-white font-black ml-2 hover:underline transition-all">Sign in instead</Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
