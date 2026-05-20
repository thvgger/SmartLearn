"use client";

import { useState } from "react";
import Link from "next/link";
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

  async function handlePayment(planKey: string) {
    setLoadingPlan(planKey);
    try {
      const actualPlan = isYearly ? `${planKey}_yearly` : planKey;
      
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: actualPlan })
      });

      if (response.status === 401) {
        window.location.href = "/login?callback=/pricing";
        return;
      }

      const data = await response.json();
      if (!data.success) {
        alert(data.error || "Failed to initiate payment");
        setLoadingPlan(null);
        return;
      }

      const { remitaParams, reference, rrr } = data;

      const paymentEngine = window.RmPaymentEngine.init({
        key: process.env.NEXT_PUBLIC_REMITA_PUBLIC_KEY || "REVUVE9GR098NDY3OTE3OTd8YjU3M2IzYmI0OTU0YmNjYThhMGVkMjk0YThhNWRkYjI0OTZlNjA5MGRhZjI5ZTY5ZWY3YzU3YmI2M2Q1YjA5YTZlYzYyNjAyZWRlYjVjZDg2YmU1YjZlZTA2YzA4YmU1ZjkxYTQ0MTFkYjU1ZDBiZGE0Y2E5ZTEwOTBkYWY=", // Demo key
        processRrr: rrr ? false : true,
        transactionId: reference,
        firstName: remitaParams.firstName,
        lastName: remitaParams.lastName,
        email: remitaParams.email,
        amount: remitaParams.amount,
        customerId: remitaParams.email,
        narration: remitaParams.narration,
        extendedData: {
          customFields: [
            { name: "RRR", value: rrr || "" }
          ]
        },
        onSuccess: async function (response: any) {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              rrr: response.paymentReference || response.rrr,
              reference: reference
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            window.location.href = "/dashboard?payment=success";
          } else {
            alert("Payment verification failed: " + verifyData.message);
          }
        },
        onError: function () {
          alert("Payment failed or closed");
          setLoadingPlan(null);
        },
        onClose: function () {
          setLoadingPlan(null);
        }
      });

      paymentEngine.showPaymentWidget({
        ...remitaParams
      });

    } catch {
      alert("An unexpected error occurred");
      setLoadingPlan(null);
    }
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
          <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl flex flex-col h-full hover:bg-white/[0.03] transition-all duration-300 border-none ring-1 ring-white/5 p-0 gap-0">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="font-headline text-xl font-bold text-white mb-2">Free</CardTitle>
              <CardDescription className="text-zinc-500 text-sm h-10">Perfect for testing the platform with a single classroom.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="mb-8">
                <span className="font-headline text-4xl font-extrabold text-white tracking-tighter">₦0</span>
                <span className="text-zinc-600 text-sm">/mo</span>
              </div>
              <ul className="space-y-4 mb-2 flex-grow">
                {[
                  "15 Students",
                  "Manual Data Backups",
                  "Basic Exam Stats",
                  "Standard Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                    <Icon icon="lucide:check" className="text-indigo-400 w-4 h-4 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-8 pt-0 mt-auto">
              <Button render={<Link href="/register" />} variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white font-bold h-11">
                Start Free
              </Button>
            </CardFooter>
          </Card>

          {/* Plan: Starter */}
          <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl flex flex-col h-full hover:bg-white/[0.03] transition-all duration-300 border-none ring-1 ring-white/5 p-0 gap-0">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="font-headline text-xl font-bold text-white mb-2">Starter</CardTitle>
              <CardDescription className="text-zinc-500 text-sm h-10">Ideal for small private tutorials and coaching centers.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="mb-8">
                <span className="font-headline text-4xl font-extrabold text-white tracking-tighter">{isYearly ? "₦7,500" : "₦10,000"}</span>
                <span className="text-zinc-600 text-sm">/mo</span>
                {isYearly && <p className="text-[10px] text-indigo-400 mt-1 font-bold">₦90,000 billed annually</p>}
              </div>
              <ul className="space-y-4 mb-2 flex-grow">
                {[
                  "100 Students",
                  "Automated Cloud Sync",
                  "Question Bank (500 Qs)",
                  "Email Support"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                    <Icon icon="lucide:check" className="text-indigo-400 w-4 h-4 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-8 pt-0 mt-auto">
              <Button 
                onClick={() => handlePayment("starter")}
                disabled={loadingPlan === "starter"}
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5 text-white font-bold h-11"
              >
                {loadingPlan === "starter" ? <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" /> : "Choose Starter"}
              </Button>
            </CardFooter>
          </Card>

          {/* Plan: School (Popular) */}
          <div className="relative flex flex-col h-full lg:scale-110 z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
              <Badge className="bg-indigo-600 text-white font-black text-[9px] px-3 py-1 shadow-xl border-none">MOST POPULAR</Badge>
            </div>
            <Card className="bg-zinc-900/50 backdrop-blur-2xl border-indigo-500/30 rounded-2xl flex flex-col h-full shadow-2xl p-0 gap-0">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="font-headline text-xl font-bold text-white mb-2">School</CardTitle>
                <CardDescription className="text-zinc-500 text-sm h-10">Complete data management for standard secondary schools.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="mb-8">
                  <span className="font-headline text-4xl font-extrabold text-white tracking-tighter">{isYearly ? "₦15,000" : "₦20,000"}</span>
                  <span className="text-zinc-600 text-sm">/mo</span>
                  {isYearly && <p className="text-[10px] text-indigo-400 mt-1 font-bold">₦180,000 billed annually</p>}
                </div>
                <ul className="space-y-4 mb-2 flex-grow">
                  {[
                    "500 Students",
                    "Unlimited Question Bank",
                    "Real-time Results Sync",
                    "Priority Phone Support"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white">
                      <Icon icon="lucide:check" className="text-indigo-400 w-4 h-4 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-8 pt-0 mt-auto">
                <Button 
                  onClick={() => handlePayment("school")}
                  disabled={loadingPlan === "school"}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black h-12 shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02]"
                >
                  {loadingPlan === "school" ? <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" /> : "Get Started Now"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Plan: Enterprise */}
          <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl flex flex-col h-full hover:bg-white/[0.03] transition-all duration-300 border-none ring-1 ring-white/5 p-0 gap-0">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="font-headline text-xl font-bold text-white mb-2">Enterprise</CardTitle>
              <CardDescription className="text-zinc-500 text-sm h-10">For large institutions requiring full customization and scale.</CardDescription>        
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="mb-8">
                <span className="font-headline text-4xl font-extrabold text-white tracking-tighter">{isYearly ? "₦25,000" : "₦33,333"}</span>
                <span className="text-zinc-600 text-sm">/mo</span>
                {isYearly && <p className="text-[10px] text-indigo-400 mt-1 font-bold">₦300,000 billed annually</p>}
              </div>
              <ul className="space-y-4 mb-2 flex-grow">
                {[
                  "Unlimited Students",
                  "Dedicated Manager",
                  "Custom Data Retention",
                  "White-label Dashboard"
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                    <Icon icon="lucide:check" className="text-indigo-400 w-4 h-4 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="p-8 pt-0 mt-auto">
              <Button 
                onClick={() => handlePayment("enterprise")}
                disabled={loadingPlan === "enterprise"}
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5 text-white font-bold h-11"
              >
                {loadingPlan === "enterprise" ? <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" /> : "Choose Enterprise"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Detailed Features Comparison */}
      <section className="py-24 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline text-3xl font-extrabold mb-16 text-center text-white tracking-tight">Institutional Grade Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Large Feature */}
            <Card className="md:col-span-8 bg-white/[0.01] backdrop-blur-xl border-white/5 p-10 rounded-2xl flex flex-col justify-between overflow-hidden relative group">
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
            <Card className="md:col-span-4 bg-indigo-500/5 p-10 rounded-2xl border border-indigo-500/20 flex flex-col justify-center items-center text-center group">   
              <Icon icon="lucide:shield-check" className="text-indigo-400 w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="font-headline text-xl font-bold mb-2 text-white">Data Sovereignty</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Bank-grade encryption for all student records and institutional data.</p>
            </Card>

            {/* Another Feature */}
            <Card className="md:col-span-4 bg-white/[0.01] backdrop-blur-xl border-white/5 p-10 rounded-2xl group">
              <Icon icon="lucide:layout-dashboard" className="text-indigo-400 w-12 h-12 mb-6 group-hover:scale-110 transition-transform" />
              <h4 className="font-headline text-xl font-bold mb-2 text-white">Cloud-Sync Ecosystem</h4>
              <p className="text-zinc-500 text-sm leading-relaxed">Instant data synchronization between offline CBT devices and your central cloud dashboard.</p>
            </Card>

            {/* Another Large Feature */}
            <Card className="md:col-span-8 bg-white/[0.01] backdrop-blur-xl border-white/5 p-10 rounded-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent -z-10"></div>
              <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                <div className="flex-1">
                  <h4 className="font-headline text-2xl font-bold mb-4 text-white">Offline-CBT Integration</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed">Built for Nigeria&apos;s unique connectivity landscape. Securely back up test results, student profiles, and question banks from local school servers to the cloud dashboard.</p>
                </div>
                <div className="w-full md:w-1/3 aspect-video bg-zinc-900 rounded-xl border border-white/5 flex items-center justify-center group-hover:bg-zinc-800 transition-colors shadow-2xl">
                  <Icon icon="lucide:cloud-off" className="text-indigo-500/30 w-16 h-16" />
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
