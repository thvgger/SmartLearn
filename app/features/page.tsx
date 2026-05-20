"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FeaturesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-background text-foreground font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />

      <main className="relative pt-32 pb-24 overflow-hidden">
        {/* Hero Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-r from-indigo-500 to-violet-500 opacity-15 blur-[120px] rounded-full -z-10"></div>
        
        {/* Hero Header */}
        <div className={`relative z-10 max-w-7xl mx-auto px-8 mb-20 ${mounted ? "animate-fade-in-up" : ""}`}>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-3xl leading-[1.1] text-white">
            Everything Your <span className="text-indigo-400">CBT Center Needs</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">
            A unified ecosystem designed for modern educational institutions. Swift Learn automates CBT data synchronization, backups, and result management so you can focus on academic excellence.
          </p>
        </div>

        {/* Features Bento Grid */}
        <div className={`relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-6 ${mounted ? "animate-fade-in-up" : ""}`}>
          {/* Automatic Marking */}
          <Card className="md:col-span-8 bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl overflow-hidden relative border-none ring-1 ring-white/5 p-0 gap-0 min-h-[400px] flex flex-col">
            <CardHeader className="p-8 pb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                <Icon icon="streamline:sparkles" className="text-indigo-400 w-6 h-6" />
              </div>
              <CardTitle className="font-headline text-2xl font-bold text-white mb-2">Automatic Marking</CardTitle>
              <CardDescription className="text-zinc-500 max-w-md text-base leading-relaxed">Eliminate grading fatigue with instant scoring for objective and structured questions. Real-time results available the moment students submit.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 mt-auto border-t border-white/5 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-8">
              <div className="space-y-3 w-full sm:w-auto">
                <div className="h-2 w-full sm:w-48 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                </div>
                <span className="text-[10px] font-bold text-indigo-400 tracking-widest block">100% ACCURACY RATING</span>
              </div>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPulJrLuHx68VlEl2cHp5HQF7prwX-0aVZ9fr3C1sZniyS949WddMwc6t23nMGACrhBg-EwTXweyfq3_QZdE015Q6cpE8A6rphB8slPDjAF8tF2zAWfbCWknhqHaJEmyRrfFGwd27Fp_nVebfWAba7oyYlzgClLruorEJHG-ZqCnUDTM50I-z9jLH1QdeDj_Xw0YRuZq-497VkV1g6v8MfWvsRKVWhVb_wLaXZI1w90zNviTnHy0Of9ANISPAxsO58-HU7XxaDGDf4" alt="Score Interface" className="w-48 h-24 object-cover rounded-xl shadow-2xl border border-white/5" />
            </CardContent>
          </Card>

          {/* Question Bank */}
          <Card className="md:col-span-4 bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-0 gap-0">
            <CardHeader className="p-8 pb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                <Icon icon="streamline:database-1" className="text-violet-400 w-6 h-6" />
              </div>
              <CardTitle className="font-headline text-2xl font-bold text-white mb-2">Question Bank</CardTitle>
              <CardDescription className="text-zinc-500 text-base leading-relaxed">Access thousands of curated questions or build your own institutional repository.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="flex flex-wrap gap-2 mt-4">
                {["MATHEMATICS", "ENGLISH", "PHYSICS", "ECONOMICS"].map((subject, i) => (
                  <Badge key={i} variant="secondary" className="bg-white/5 text-zinc-400 border-none font-bold text-[10px] px-3 py-1">
                    {subject}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exam Scheduling */}
          <Card className="md:col-span-4 bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-0 gap-0">
            <CardHeader className="p-8">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                <Icon icon="streamline:calendar-1" className="text-indigo-400 w-6 h-6" />
              </div>
              <CardTitle className="font-headline text-2xl font-bold text-white mb-4">Exam Scheduling</CardTitle>
              <CardDescription className="text-zinc-500 text-base leading-relaxed">Set it and forget it. Exams auto-begin and auto-close at your specified times, ensuring strict adherence to school schedules.</CardDescription>
            </CardHeader>
          </Card>

          {/* Performance Analytics */}
          <Card className="md:col-span-8 bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-0 gap-0 flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1">
              <CardHeader className="p-8 pb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <Icon icon="streamline:graph-bar-1" className="text-emerald-400 w-6 h-6" />
                </div>
                <CardTitle className="font-headline text-2xl font-bold text-white mb-2">Performance Analytics</CardTitle>
                <CardDescription className="text-zinc-500 text-base leading-relaxed">Gain deep insights into student and class performance with high-fidelity data visualization.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4 mt-4">
                  {[
                    "Class average & performance trends",
                    "Automated student rankings",
                    "Identification of weak topics"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                      <Icon icon="streamline:check-circle-1" className="text-indigo-400 w-5 h-5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </div>
            <div className="flex-1 bg-zinc-900 border-l border-white/5 min-h-[300px] relative">
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-transparent" />
            </div>
          </Card>

          {/* Secure Exam Environment */}
          <Card className="md:col-span-6 bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-0 gap-0">
            <CardHeader className="p-8 pb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
                <Icon icon="streamline:shield-1" className="text-rose-400 w-6 h-6" />
              </div>
              <CardTitle className="font-headline text-2xl font-bold text-white mb-2">Secure Exam Environment</CardTitle>
              <CardDescription className="text-zinc-500 text-base leading-relaxed">Prevent academic malpractice with enterprise-grade security features built directly into the exam engine.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <Icon icon="streamline:shuffle-1" className="text-indigo-400 w-5 h-5 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Random order</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <Icon icon="streamline:timer-1" className="text-indigo-400 w-5 h-5 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Time limits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Device Support */}
          <Card className="md:col-span-6 bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl border-none ring-1 ring-white/5 p-0 gap-0 flex items-center">
            <div className="flex-1">
              <CardHeader className="p-8 pb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                  <Icon icon="streamline:monitor-smartphone" className="text-indigo-400 w-6 h-6" />
                </div>
                <CardTitle className="font-headline text-2xl font-bold text-white mb-2">Multi-Device Support</CardTitle>
                <CardDescription className="text-zinc-500 text-base leading-relaxed">Whether students are using school tablets, laboratory desktops, or personal laptops, the experience remains premium and consistent.</CardDescription>
              </CardHeader>
            </div>
            <div className="hidden sm:block p-8 opacity-10">
              <Icon icon="streamline:layout-1" className="text-white w-24 h-24" />
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
