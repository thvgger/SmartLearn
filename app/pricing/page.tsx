"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Check, Shield, Gauge, CloudOff } from "lucide-react";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="bg-surface text-on-background font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative overflow-hidden flex-grow">
        {/* <!-- Background Soul Gradient --> */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-600/10 to-transparent blur-[120px] -z-10"></div>
        
        <header className="text-center mb-16">
          <span className="text-primary font-label tracking-[0.2em] uppercase text-[10px] font-bold mb-4 block">Institutional Excellence</span>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-background mb-6">Simple, Transparent Pricing</h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed">
            Empowering Nigerian schools with world-class digital tools. Select the plan that fits your institution's growth phase.
          </p>
        </header>

        {/* <!-- Toggle Switch --> */}
        <div className="flex justify-center items-center gap-4 mb-20">
          <span className={`text-sm font-medium ${!isYearly ? "text-white" : "text-on-surface-variant"}`}>Monthly</span>
          <div 
            className="relative w-14 h-7 bg-surface-container rounded-full p-1 cursor-pointer transition-colors"
            onClick={() => setIsYearly(!isYearly)}
          >
            <div className={`absolute top-1 w-5 h-5 bg-primary rounded-full transition-transform ${isYearly ? "translate-x-7" : "translate-x-0"}`}></div>
          </div>
          <span className={`text-sm font-medium ${isYearly ? "text-white" : "text-on-surface-variant"}`}>Yearly</span>
          <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded text-[10px] font-bold tracking-tight">SAVE 25%</span>
        </div>

        {/* <!-- Pricing Grid --> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start animate-fade-up">
          {/* <!-- Plan: Free --> */}
          <div className="glass-card p-8 rounded-xl border border-outline-variant/15 flex flex-col h-full hover:bg-white/5 transition-all duration-300">
            <div className="mb-8">
              <h3 className="font-headline text-xl font-bold text-white mb-2">Free</h3>
              <p className="text-on-surface-variant text-sm h-10">Test the platform and start your digital journey.</p>
            </div>
            <div className="mb-8">
              <span className="font-headline text-4xl font-extrabold text-white tracking-tighter">₦0</span>
              <span className="text-slate-500 text-sm">/mo</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                10 Students
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                Basic LMS features
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                Digital Attendance
              </li>
            </ul>
            <Link href="/login" className="block w-full py-3 rounded-lg border border-outline-variant/30 text-white font-headline font-bold text-sm hover:bg-white/5 transition-all text-center">
              Start Free
            </Link>
          </div>

          {/* <!-- Plan: Starter --> */}
          <div className="glass-card p-8 rounded-xl border border-outline-variant/15 flex flex-col h-full hover:bg-white/5 transition-all duration-300">
            <div className="mb-8">
              <h3 className="font-headline text-xl font-bold text-white mb-2">Starter</h3>
              <p className="text-on-surface-variant text-sm h-10">Ideal for small private tutorials and coaching centers.</p>
            </div>
            <div className="mb-8">
              <span className="font-headline text-4xl font-extrabold text-white tracking-tighter">{isYearly ? "₦7,500" : "₦10,000"}</span>
              <span className="text-slate-500 text-sm">/mo</span>
              <div className="text-[10px] text-primary mt-1 font-bold h-4">
                {isYearly && "₦90,000 billed annually"}
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                75 Students
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                Advanced Reporting
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                Assignment Portal
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                Parent Notifications
              </li>
            </ul>
            <Link href="/login" className="block w-full py-3 rounded-lg border border-outline-variant/30 text-white font-headline font-bold text-sm hover:bg-white/5 transition-all text-center">
              Choose Starter
            </Link>
          </div>

          {/* <!-- Plan: School (Popular) --> */}
          <div className="relative flex flex-col h-full">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-primary text-on-primary font-label text-[10px] font-extrabold px-4 py-1.5 rounded-full shadow-lg">MOST POPULAR</span>
            </div>
            <div className="bg-surface-container-high p-8 rounded-xl border border-primary/30 shadow-[0_0_20px_rgba(192,193,255,0.15)] flex flex-col h-full relative z-0 transform lg:scale-105 shadow-2xl">
              <div className="mb-8">
                <h3 className="font-headline text-xl font-bold text-white mb-2">School</h3>
                <p className="text-on-surface-variant text-sm h-10">A complete digital transformation for standard schools.</p>
              </div>
              <div className="mb-8">
                <span className="font-headline text-4xl font-extrabold text-white tracking-tighter">{isYearly ? "₦15,000" : "₦20,000"}</span>
                <span className="text-slate-500 text-sm">/mo</span>
                <div className="text-[10px] text-primary mt-1 font-bold h-4">
                  {isYearly && "₦180,000 billed annually"}
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                  200 Students
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                  Everything in Starter
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                  Online Exams &amp; CBT
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                  Result Management System
                </li>
                <li className="flex items-start gap-3 text-sm text-white">
                  <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                  Staff Payroll Module
                </li>
              </ul>
              <Link href="/login" className="block w-full py-4 rounded-lg bg-primary-container text-on-primary-container font-headline font-bold text-sm hover:scale-[1.02] transition-transform shadow-xl text-center">
                Get Started Now
              </Link>
            </div>
          </div>

          {/* <!-- Plan: Enterprise --> */}
          <div className="glass-card p-8 rounded-xl border border-outline-variant/15 flex flex-col h-full hover:bg-white/5 transition-all duration-300">
            <div className="mb-8">
              <h3 className="font-headline text-xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-on-surface-variant text-sm h-10">For large institutions requiring full customization and scale.</p>
            </div>
            <div className="mb-8">
              <span className="font-headline text-4xl font-extrabold text-white tracking-tighter">{isYearly ? "₦25,000" : "₦33,333"}</span>
              <span className="text-slate-500 text-sm">/mo</span>
              <div className="text-[10px] text-primary mt-1 font-bold h-4">
                {isYearly && "₦300,000 billed annually"}
              </div>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                Unlimited Students
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                Custom School Domain
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                Dedicated Support Manager
              </li>
              <li className="flex items-start gap-3 text-sm text-on-surface-variant">
                <Check className="text-primary w-5 h-5 shrink-0" strokeWidth={3} />
                API Access &amp; Integrations
              </li>
            </ul>
            <Link href="/contact" className="block w-full py-3 rounded-lg border border-outline-variant/30 text-white font-headline font-bold text-sm hover:bg-white/5 transition-all text-center">
              Contact Sales
            </Link>
          </div>
        </div>
      </main>

      {/* <!-- Detailed Features Comparison (Asymmetric Bento) --> */}
      <section className="py-24 px-6 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto animate-fade-up-1">
          <h2 className="font-headline text-3xl font-bold mb-16 text-center">Institutional Grade Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* <!-- Large Feature --> */}
            <div className="md:col-span-8 glass-card p-10 rounded-xl border border-outline-variant/10 flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="font-headline text-2xl font-bold mb-4">Centralized School Ecosystem</h4>
                <p className="text-on-surface-variant max-w-md leading-relaxed">Swift Learn integrates every aspect of school management from admissions to graduation into a single, high-performance dashboard.</p>
              </div>
              <div className="mt-12 flex gap-4 overflow-hidden -mr-10">
                <div className="w-48 h-32 bg-surface-container-highest rounded border border-outline-variant/20 shrink-0 p-4">
                  <div className="w-full h-1 bg-primary mb-2"></div>
                  <div className="w-1/2 h-1 bg-outline-variant mb-2"></div>
                  <div className="w-3/4 h-1 bg-outline-variant"></div>
                </div>
                <div className="w-48 h-32 bg-surface-container rounded border border-outline-variant/20 shrink-0 p-4">
                  <div className="w-1/3 h-1 bg-secondary mb-2"></div>
                  <div className="w-2/3 h-1 bg-outline-variant mb-2"></div>
                </div>
              </div>
            </div>

            {/* <!-- Small Feature --> */}
            <div className="md:col-span-4 bg-primary-container/10 p-10 rounded-xl border border-primary/20 flex flex-col justify-center">
              <Shield className="text-primary w-10 h-10 mb-6" fill="currentColor" strokeWidth={1} />
              <h4 className="font-headline text-xl font-bold mb-2">Data Sovereignty</h4>
              <p className="text-on-surface-variant text-sm">Bank-grade encryption for all student records and financial data.</p>
            </div>

            {/* <!-- Another Feature --> */}
            <div className="md:col-span-4 glass-card p-10 rounded-xl border border-outline-variant/10">
              <Gauge className="text-primary w-10 h-10 mb-6" />
              <h4 className="font-headline text-xl font-bold mb-2">Real-time Sync</h4>
              <p className="text-on-surface-variant text-sm">Instant updates across teacher apps and parent portals.</p>
            </div>

            {/* <!-- Another Large Feature --> */}
            <div className="md:col-span-8 glass-card p-10 rounded-xl border border-outline-variant/10 bg-gradient-to-br from-indigo-500/5 to-transparent">
              <div className="flex flex-col md:flex-row gap-8 items-center h-full">
                <div className="flex-1">
                  <h4 className="font-headline text-2xl font-bold mb-4">Offline-First Learning</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Built for Nigeria's unique landscape. Students can download course materials and assignments to study without a constant internet connection.</p>
                </div>
                <div className="w-full md:w-1/3 aspect-video bg-surface-container-low rounded border border-outline-variant/20 flex items-center justify-center">
                  <CloudOff className="text-primary w-16 h-16 opacity-30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
