"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FeaturesPage() {
  return (
    <div className="bg-background text-foreground font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />

      <main className="relative pt-32 pb-24 overflow-hidden">
        {/* Hero Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-r from-indigo-500 to-violet-500 opacity-15 blur-[120px] rounded-full -z-10"></div>
        
        {/* Hero Header */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 mb-20 animate-fade-in-up">
          <Badge variant="outline" className="text-indigo-400 font-bold tracking-[0.2em] uppercase text-[10px] mb-6 px-4 py-1.5 border-indigo-500/20 bg-indigo-500/5">
            PLATFORM OVERVIEW
          </Badge>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-3xl leading-[1.1] text-white">
            Everything Your <span className="text-indigo-400">CBT Center Needs</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">
            A unified ecosystem designed for modern educational institutions. Swift Learn automates CBT data synchronization, backups, and result management so you can focus on academic excellence.
          </p>
        </div>

        {/* Features Bento Grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in-up">
          {/* Automatic Marking */}
          <Card className="md:col-span-8 bg-zinc-900 border-white/10 hover:border-white/20 transition-all group rounded-2xl overflow-hidden relative p-0 flex flex-col min-h-[400px]">
            {/* Top Right Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden rounded-tr-2xl">
              <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-white/[0.02] rotate-12 rounded-3xl transition-transform group-hover:rotate-[15deg]" />
              <div className="absolute top-[10%] right-[-20%] w-full h-full border border-white/5 rotate-12 rounded-3xl" />
            </div>
            <CardHeader className="p-8 pb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                <Icon icon="ri:sparkling-line" className="text-indigo-400 w-6 h-6" strokeWidth={1.5} />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2 relative z-10">Automatic Marking</CardTitle>
              <CardDescription className="text-zinc-400 max-w-md text-sm leading-relaxed relative z-10">Eliminate grading fatigue with instant scoring for objective and structured questions. Real-time results available the moment students submit.</CardDescription>
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
          <Card className="md:col-span-4 bg-zinc-900 border-white/10 hover:border-white/20 transition-all group rounded-2xl overflow-hidden relative p-0">
            {/* Top Right Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden rounded-tr-2xl">
              <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-white/[0.02] rotate-12 rounded-3xl transition-transform group-hover:rotate-[15deg]" />
              <div className="absolute top-[10%] right-[-20%] w-full h-full border border-white/5 rotate-12 rounded-3xl" />
            </div>
            <CardHeader className="p-8 pb-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                <Icon icon="ri:database-2-line" className="text-violet-400 w-6 h-6" strokeWidth={1.5} />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2 relative z-10">Question Bank</CardTitle>
              <CardDescription className="text-zinc-400 text-sm leading-relaxed relative z-10">Access thousands of curated questions or build your own institutional repository.</CardDescription>
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
          <Card className="md:col-span-4 bg-zinc-900 border-white/10 hover:border-white/20 transition-all group rounded-2xl overflow-hidden relative p-0">
            {/* Top Right Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden rounded-tr-2xl">
              <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-white/[0.02] rotate-12 rounded-3xl transition-transform group-hover:rotate-[15deg]" />
              <div className="absolute top-[10%] right-[-20%] w-full h-full border border-white/5 rotate-12 rounded-3xl" />
            </div>
            <CardHeader className="p-8">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                <Icon icon="ri:calendar-line" className="text-indigo-400 w-6 h-6" strokeWidth={1.5} />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-4 relative z-10">Exam Scheduling</CardTitle>
              <CardDescription className="text-zinc-400 text-sm leading-relaxed relative z-10">Set it and forget it. Exams auto-begin and auto-close at your specified times, ensuring strict adherence to school schedules.</CardDescription>
            </CardHeader>
          </Card>

          {/* Performance Analytics */}
          <Card className="md:col-span-8 bg-zinc-900 border-white/10 hover:border-white/20 transition-all group rounded-2xl overflow-hidden relative p-0 flex flex-col md:flex-row">
            {/* Top Right Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden rounded-tr-2xl z-10">
              <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-white/[0.02] rotate-12 rounded-3xl transition-transform group-hover:rotate-[15deg]" />
              <div className="absolute top-[10%] right-[-20%] w-full h-full border border-white/5 rotate-12 rounded-3xl" />
            </div>
            <div className="flex-1">
              <CardHeader className="p-8 pb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                  <Icon icon="ri:bar-chart-2-line" className="text-emerald-400 w-6 h-6" strokeWidth={1.5} />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2 relative z-10">Performance Analytics</CardTitle>
                <CardDescription className="text-zinc-400 text-sm leading-relaxed relative z-10">Gain deep insights into student and class performance with high-fidelity data visualization.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <ul className="space-y-4 mt-4">
                  {[
                    "Class average & performance trends",
                    "Automated student rankings",
                    "Identification of weak topics"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-300 font-medium">
                      <Icon icon="ri:checkbox-circle-line" className="text-indigo-400 w-5 h-5" />
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
          <Card className="md:col-span-6 bg-zinc-900 border-white/10 hover:border-white/20 transition-all group rounded-2xl overflow-hidden relative p-0">
            {/* Top Right Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden rounded-tr-2xl">
              <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-white/[0.02] rotate-12 rounded-3xl transition-transform group-hover:rotate-[15deg]" />
              <div className="absolute top-[10%] right-[-20%] w-full h-full border border-white/5 rotate-12 rounded-3xl" />
            </div>
            <CardHeader className="p-8 pb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-6">
                <Icon icon="ri:shield-line" className="text-rose-400 w-6 h-6" strokeWidth={1.5} />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2 relative z-10">Secure Exam Environment</CardTitle>
              <CardDescription className="text-zinc-400 text-sm leading-relaxed relative z-10">Prevent academic malpractice with enterprise-grade security features built directly into the exam engine.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <Icon icon="ri:shuffle-line" className="text-indigo-400 w-5 h-5 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Random order</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <Icon icon="ri:timer-line" className="text-indigo-400 w-5 h-5 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Time limits</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Device Support */}
          <Card className="md:col-span-6 bg-zinc-900 border-white/10 hover:border-white/20 transition-all group rounded-2xl overflow-hidden relative p-0 flex items-center">
            {/* Top Right Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden rounded-tr-2xl z-10">
              <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-white/[0.02] rotate-12 rounded-3xl transition-transform group-hover:rotate-[15deg]" />
              <div className="absolute top-[10%] right-[-20%] w-full h-full border border-white/5 rotate-12 rounded-3xl" />
            </div>
            <div className="flex-1">
              <CardHeader className="p-8 pb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                  <Icon icon="ri:device-line" className="text-indigo-400 w-6 h-6" strokeWidth={1.5} />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2 relative z-10">Multi-Device Support</CardTitle>
                <CardDescription className="text-zinc-400 text-sm leading-relaxed relative z-10">Whether students are using school tablets, laboratory desktops, or personal laptops, the experience remains premium and consistent.</CardDescription>
              </CardHeader>
            </div>
            <div className="hidden sm:block p-8 opacity-10">
              <Icon icon="ri:layout-line" className="text-white w-24 h-24" strokeWidth={1} />
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
