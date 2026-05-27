"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

declare global {
  interface Window {
    RmPaymentEngine: any;
  }
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  function handlePayment(planKey: string) {
    setLoadingPlan(planKey);
    router.push(`/checkout?plan=${planKey}&yearly=${isYearly}`);
  }

  return (
    <div className="bg-background text-foreground font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative overflow-hidden flex-grow">
        {/* Ambient Background Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-600/10 to-transparent blur-[120px] -z-10"></div>

        <header className="text-center mb-16 animate-fade-in-up">
          {/* <Badge variant="outline" className="text-indigo-400 font-bold tracking-[0.2em] uppercase text-[10px] mb-6 px-4 py-1.5 border-indigo-500/20 bg-indigo-500/5">
            Institutional Excellence
          </Badge> */}
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6">Simple, Transparent Pricing</h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Empowering Nigerian schools with world-class digital tools. Select the plan that fits your institution&apos;s growth phase. 
          </p>
        </header>

        {/* Toggle Switch */}
        <div className="flex justify-center items-center gap-6 mb-20">
          <span className={`text-sm font-bold transition-colors ${!isYearly ? "text-white" : "text-zinc-500"}`}>Monthly</span>
          <Switch 
            checked={isYearly} 
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-indigo-600"
          />
          <span className={`text-sm font-bold transition-colors ${isYearly ? "text-white" : "text-zinc-500"}`}>Yearly</span>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black text-[10px]">SAVE 25%</Badge>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {/* Plan: Free */}
          <Card className="bg-zinc-900 border-white/10 rounded-3xl flex flex-col h-full hover:border-white/20 transition-all p-0 overflow-hidden">
            <div className="bg-zinc-800/80 p-8 pb-10 border-b border-white/5">
              <CardTitle className="font-headline text-xl font-bold text-white mb-4">Free</CardTitle>
              <div>
                <span className="font-headline text-5xl font-extrabold text-white tracking-tighter">₦0</span>
                <span className="text-zinc-400 text-sm font-medium"> / Month</span>
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col bg-zinc-900">
              <ul className="space-y-5 mb-8 flex-grow">
                {[
                  "15 Students",
                  "Manual Data Backups",
                  "Basic Exam Stats",
                  "Standard Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                    <div className="rounded-full p-0.5 border border-zinc-600 shrink-0">
                      <Icon icon="ri:check-line" className="text-zinc-400 w-3 h-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold h-12 rounded-full transition-all">
                <Link href="/register">Purchase Plan</Link>
              </Button>
            </div>
          </Card>

          {/* Plan: Starter */}
          <Card className="bg-zinc-900 border-white/10 rounded-3xl flex flex-col h-full hover:border-white/20 transition-all p-0 overflow-hidden">
            <div className="bg-zinc-800/80 p-8 pb-10 border-b border-white/5 relative">
              <CardTitle className="font-headline text-xl font-bold text-white mb-4">Starter</CardTitle>
              <div>
                <span className="font-headline text-5xl font-extrabold text-white tracking-tighter">{isYearly ? "₦1,250" : "₦1,500"}</span>
                <span className="text-zinc-400 text-sm font-medium"> / Month</span>
              </div>
              {isYearly && <p className="absolute bottom-3 left-8 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">₦15,000 billed annually</p>}
            </div>
            <div className="p-8 flex-grow flex flex-col bg-zinc-900">
              <ul className="space-y-5 mb-8 flex-grow">
                {[
                  "100 Students",
                  "Automated Cloud Sync",
                  "Question Bank (500 Qs)",
                  "Email Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                    <div className="rounded-full p-0.5 border border-zinc-600 shrink-0">
                      <Icon icon="ri:check-line" className="text-zinc-400 w-3 h-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handlePayment("starter")}
                disabled={loadingPlan === "starter"}
                variant="outline"
                className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold h-12 rounded-full transition-all"
              >
                {loadingPlan === "starter" ? <Icon icon="ri:loader-4-line" className="w-4 h-4 animate-spin" /> : "Purchase Plan"}
              </Button>
            </div>
          </Card>

          {/* Plan: School (Popular) */}
          <div className="relative flex flex-col h-full lg:scale-105 z-10">
            <Card className="bg-zinc-900 border-indigo-500/30 rounded-3xl flex flex-col h-full shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)] p-0 overflow-hidden">
              <div className="bg-indigo-600 p-8 pb-10 relative">
                <div className="flex items-center gap-3 mb-4">
                  <CardTitle className="font-headline text-xl font-bold text-white">School</CardTitle>
                  <Badge className="bg-white/20 text-white hover:bg-white/20 border-none rounded-full px-3 py-0.5 text-[10px] uppercase tracking-wider font-bold">Popular</Badge>
                </div>
                <div>
                  <span className="font-headline text-5xl font-extrabold text-white tracking-tighter">{isYearly ? "₦2,500" : "₦3,000"}</span>
                  <span className="text-indigo-200 text-sm font-medium"> / Month</span>
                </div>
                {isYearly && <p className="absolute bottom-3 left-8 text-[10px] text-indigo-200 font-bold uppercase tracking-widest">₦30,000 billed annually</p>}
              </div>
              <div className="p-8 flex-grow flex flex-col bg-zinc-900">
                <ul className="space-y-5 mb-8 flex-grow">
                  {[
                    "500 Students",
                    "Unlimited Question Bank",
                    "Real-time Results Sync",
                    "Priority Phone Support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                      <div className="rounded-full p-0.5 border border-indigo-500/50 bg-indigo-500/10 shrink-0">
                        <Icon icon="ri:check-line" className="text-indigo-400 w-3 h-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => handlePayment("school")}
                  disabled={loadingPlan === "school"}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 rounded-full shadow-lg shadow-indigo-600/20 transition-all"
                >
                  {loadingPlan === "school" ? <Icon icon="ri:loader-4-line" className="w-4 h-4 animate-spin" /> : "Purchase Plan"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Plan: Enterprise */}
          <Card className="bg-zinc-900 border-white/10 rounded-3xl flex flex-col h-full hover:border-white/20 transition-all p-0 overflow-hidden">
            <div className="bg-zinc-800/80 p-8 pb-10 border-b border-white/5 relative">
              <CardTitle className="font-headline text-xl font-bold text-white mb-4">Enterprise</CardTitle>
              <div>
                <span className="font-headline text-5xl font-extrabold text-white tracking-tighter">{isYearly ? "₦4,166" : "₦5,000"}</span>
                <span className="text-zinc-400 text-sm font-medium"> / Month</span>
              </div>
              {isYearly && <p className="absolute bottom-3 left-8 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">₦50,000 billed annually</p>}
            </div>
            <div className="p-8 flex-grow flex flex-col bg-zinc-900">
              <ul className="space-y-5 mb-8 flex-grow">
                {[
                  "Unlimited Students",
                  "Dedicated Manager",
                  "Custom Data Retention",
                  "White-label Dashboard"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                    <div className="rounded-full p-0.5 border border-zinc-600 shrink-0">
                      <Icon icon="ri:check-line" className="text-zinc-400 w-3 h-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <Button 
                onClick={() => handlePayment("enterprise")}
                disabled={loadingPlan === "enterprise"}
                variant="outline"
                className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold h-12 rounded-full transition-all"
              >
                {loadingPlan === "enterprise" ? <Icon icon="ri:loader-4-line" className="w-4 h-4 animate-spin" /> : "Purchase Plan"}
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Detailed Features Comparison */}
      <section className="py-24 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-3xl font-extrabold mb-16 text-center text-white tracking-tight">Institutional Grade Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Large Feature */}
            <Card className="md:col-span-8 bg-zinc-900 border-white/10 p-10 rounded-2xl flex flex-col justify-between overflow-hidden relative group hover:border-white/20 transition-all">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl -z-10 group-hover:bg-indigo-500/10 transition-all"></div>
              <div className="relative z-10">
                <h4 className="font-headline text-2xl font-bold mb-4 text-white">Centralized CBT Ecosystem</h4>
                <p className="text-zinc-500 max-w-md leading-relaxed">Swift Learn integrates your offline CBT infrastructure with the cloud, providing a unified dashboard for backups, question banks, and performance tracking.</p>
              </div>
              <div className="mt-12 flex gap-4 overflow-hidden -mr-10">
                <div className="w-48 h-32 bg-zinc-900 rounded-xl border border-white/5 shrink-0 p-4 shadow-2xl">
                  <div className="w-full h-1 bg-indigo-500 mb-2"></div>
                  <div className="w-1/2 h-1 bg-zinc-800 mb-2"></div>
                  <div className="w-3/4 h-1 bg-zinc-800"></div>
                </div>
                <div className="w-48 h-32 bg-zinc-900/50 rounded-xl border border-white/5 shrink-0 p-4">
                  <div className="w-1/3 h-1 bg-indigo-400 mb-2"></div>
                  <div className="w-2/3 h-1 bg-zinc-800 mb-2"></div>
                </div>
              </div>
            </Card>

            {/* Small Feature */}
            <Card className="md:col-span-4 bg-zinc-900 border-white/10 p-10 rounded-2xl flex flex-col justify-center items-center text-center group hover:border-white/20 transition-all">
              <Icon icon="ri:shield-line-check" className="text-indigo-400 w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="font-headline text-xl font-bold mb-2 text-white">Data Sovereignty</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Bank-grade encryption for all student records and institutional data.</p>
            </Card>

            {/* Another Feature */}
            <Card className="md:col-span-4 bg-zinc-900 border-white/10 p-10 rounded-2xl group hover:border-white/20 transition-all">
              <Icon icon="ri:dashboard-line" className="text-indigo-400 w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="font-headline text-xl font-bold mb-2 text-white">Cloud-Sync Ecosystem</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Instant data synchronization between offline CBT devices and your central cloud dashboard.</p>
            </Card>

            {/* Another Large Feature */}
            <Card className="md:col-span-8 bg-zinc-900 border-white/10 p-10 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent -z-10"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                <div className="flex-1">
                  <h4 className="font-headline text-2xl font-bold mb-4 text-white">Offline-CBT Integration</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">Built for Nigeria&apos;s unique connectivity landscape. Securely back up test results, student profiles, and question banks from local school servers to the cloud dashboard.</p>
                </div>
                <div className="w-full md:w-1/3 aspect-video bg-zinc-900 rounded-xl border border-white/5 flex items-center justify-center group-hover:bg-zinc-800 transition-colors shadow-2xl">
                  <Icon icon="ri:cloud-line-off" className="text-indigo-500/30 w-16 h-16" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
