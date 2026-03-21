"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Sparkles, Database, Calendar, BarChart3, CheckCircle2, Shield, Shuffle, Timer, MonitorSmartphone, Layout } from "lucide-react";

export default function FeaturesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <Navbar />

      <main className="relative pt-32 pb-24 overflow-hidden">
        {/* <!-- Hero Decorative Glow --> */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-r from-indigo-500 to-violet-500 opacity-15 blur-[120px] rounded-full -z-10"></div>
        
        {/* <!-- Hero Header --> */}
        <div className={`relative z-10 max-w-7xl mx-auto px-8 mb-20 ${mounted ? "animate-fade-up" : ""}`}>
          <span className="font-label text-primary tracking-[0.2em] font-semibold mb-4 block">PLATFORM OVERVIEW</span>
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-3xl leading-[1.1]">
            Everything Your <span className="text-primary-container">School Needs</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            A unified ecosystem designed for premium Nigerian institutions. Swift Learn automates the heavy lifting so you can focus on academic excellence.
          </p>
        </div>

        {/* <!-- Features Bento Grid --> */}
        <div className={`relative z-10 max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-12 gap-6 ${mounted ? "animate-fade-up-1" : ""}`}>
          {/* <!-- Automatic Marking --> */}
          <div className="md:col-span-8 glass-card rounded-xl p-8 border border-outline-variant/10 flex flex-col justify-between min-h-[400px]">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center mb-6">
                <Sparkles className="text-primary w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="font-headline text-2xl font-bold mb-4">Automatic Marking</h3>
              <p className="text-on-surface-variant max-w-md">Eliminate grading fatigue with instant scoring for objective and structured questions. Real-time results available the moment students submit.</p>
            </div>
            <div className="mt-8 pt-8 border-t border-outline-variant/10 flex items-end justify-between">
              <div className="space-y-2">
                <div className="h-2 w-48 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-right from-indigo-500 to-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                </div>
                <span className="text-[10px] font-label text-primary tracking-widest block">100% ACCURACY RATING</span>
              </div>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPulJrLuHx68VlEl2cHp5HQF7prwX-0aVZ9fr3C1sZniyS949WddMwc6t23nMGACrhBg-EwTXweyfq3_QZdE015Q6cpE8A6rphB8slPDjAF8tF2zAWfbCWknhqHaJEmyRrfFGwd27Fp_nVebfWAba7oyYlzgClLruorEJHG-ZqCnUDTM50I-z9jLH1QdeDj_Xw0YRuZq-497VkV1g6v8MfWvsRKVWhVb_wLaXZI1w90zNviTnHy0Of9ANISPAxsO58-HU7XxaDGDf4" alt="Screenshot of automated test scoring interface" className="w-48 h-24 object-cover rounded shadow-2xl border border-white/5" />
            </div>
          </div>

          {/* <!-- Question Bank --> */}
          <div className="md:col-span-4 glass-card rounded-xl p-8 border border-outline-variant/10">
            <div className="w-12 h-12 rounded-lg bg-secondary-container/20 flex items-center justify-center mb-6">
              <Database className="text-secondary w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="font-headline text-2xl font-bold mb-4">Question Bank</h3>
            <p className="text-on-surface-variant mb-8">Access thousands of curated questions or build your own institutional repository.</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-surface-container-highest px-3 py-1 rounded text-[11px] font-semibold text-primary">MATHEMATICS</span>
              <span className="bg-surface-container-highest px-3 py-1 rounded text-[11px] font-semibold text-secondary">ENGLISH</span>
              <span className="bg-surface-container-highest px-3 py-1 rounded text-[11px] font-semibold text-on-surface">PHYSICS</span>
              <span className="bg-surface-container-highest px-3 py-1 rounded text-[11px] font-semibold text-on-surface">ECONOMICS</span>
            </div>
          </div>

          {/* <!-- Exam Scheduling --> */}
          <div className="md:col-span-4 glass-card rounded-xl p-8 border border-outline-variant/10">
            <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center mb-6">
              <Calendar className="text-primary w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="font-headline text-2xl font-bold mb-4">Exam Scheduling</h3>
            <p className="text-on-surface-variant">Set it and forget it. Exams auto-begin and auto-close at your specified times, ensuring strict adherence to school schedules.</p>
          </div>

          {/* <!-- Performance Analytics --> */}
          <div className="md:col-span-8 glass-card rounded-xl p-8 border border-outline-variant/10 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-lg bg-tertiary-container/20 flex items-center justify-center mb-6">
                <BarChart3 className="text-tertiary w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="font-headline text-2xl font-bold mb-4">Performance Analytics</h3>
              <p className="text-on-surface-variant mb-6">Gain deep insights into student and class performance with high-fidelity data visualization.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                  Class average &amp; performance trends
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                  Automated student rankings
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                  Identification of weak topics
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-surface-container-lowest rounded-lg p-0 md:p-6 border border-outline-variant/5 min-h-[200px]">
              <div className="w-full h-full rounded opacity-80 shadow-2xl bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center" />
            </div>
          </div>

          {/* <!-- Secure Exam Environment --> */}
          <div className="md:col-span-6 glass-card rounded-xl p-8 border border-outline-variant/10">
            <div className="w-12 h-12 rounded-lg bg-error-container/20 flex items-center justify-center mb-6">
              <Shield className="text-error w-6 h-6" />
            </div>
            <h3 className="font-headline text-2xl font-bold mb-4">Secure Exam Environment</h3>
            <p className="text-on-surface-variant mb-6">Prevent academic malpractice with enterprise-grade security features built directly into the exam engine.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container p-4 rounded-lg">
                <Shuffle className="text-primary w-5 h-5 mb-2" />
                <p className="text-xs font-bold uppercase tracking-tighter">Random order</p>
              </div>
              <div className="bg-surface-container p-4 rounded-lg">
                <Timer className="text-primary w-5 h-5 mb-2" />
                <p className="text-xs font-bold uppercase tracking-tighter">Time limits</p>
              </div>
            </div>
          </div>

          {/* <!-- Multi-Device Support --> */}
          <div className="md:col-span-6 glass-card rounded-xl p-8 border border-outline-variant/10 flex items-center gap-8">
            <div className="flex-1">
              <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center mb-6">
                <MonitorSmartphone className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-headline text-2xl font-bold mb-4">Multi-Device Support</h3>
              <p className="text-on-surface-variant text-sm">Whether students are using school tablets, laboratory desktops, or personal laptops, the experience remains premium and consistent.</p>
            </div>
            <div className="hidden sm:block opacity-30">
              <Layout className="text-slate-500 w-24 h-24" strokeWidth={1} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
