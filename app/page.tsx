"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ArrowRight, Zap, TrendingUp, BarChart2, DollarSign, Shield, GraduationCap, Monitor, Laptop, Tablet, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-surface text-on-background font-body selection:bg-primary-container/30 min-h-screen flex flex-col">
      <Navbar />
      
      {/* <!-- Hero Section --> */}
      <section className="relative pt-40 pb-24 px-8 overflow-hidden min-h-[90vh] flex flex-col justify-center items-center text-center">
        {/* <!-- Background Soul Glow --> */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-secondary-container/5 blur-[100px] rounded-full -z-10"></div>
        
        <div className="max-w-4xl mx-auto">
          <span className="inline-block font-label text-[0.6875rem] uppercase tracking-[0.15em] text-primary mb-6 py-1 px-3 border border-outline-variant/20 rounded-full bg-surface-container-low">
            Computer Based Testing for Schools
          </span>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tighter mb-8 leading-[1.1] text-gradient">
            Run School Exams <br/> Faster &amp; Smarter
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed mb-10">
            Swift Learn replaces paper exams with a secure digital testing system. Teachers create exams, students write on any device, and the system marks instantly.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="bg-primary-container text-on-primary-container px-8 py-4 rounded-lg font-bold text-base hover:scale-105 transition-transform duration-200 flex items-center gap-2 shadow-xl shadow-primary-container/30"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/features"
              className="glass-card border border-outline-variant/30 text-on-surface px-8 py-4 rounded-lg font-bold text-base hover:bg-white/5 transition-all"
            >
              See Features
            </Link>
          </div>
        </div>
      </section>

      {/* <!-- Stats Strip --> */}
      <section className="py-12 px-8 bg-surface-container-lowest border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          <div>
            <div className="text-3xl font-headline font-extrabold text-white mb-1">500+</div>
            <div className="font-label text-xs uppercase tracking-wider text-slate-500">Students Tested</div>
          </div>
          <div>
            <div className="text-3xl font-headline font-extrabold text-white mb-1">99%</div>
            <div className="font-label text-xs uppercase tracking-wider text-slate-500">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-headline font-extrabold text-white mb-1">&lt; 1s</div>
            <div className="font-label text-xs uppercase tracking-wider text-slate-500">Marking Speed</div>
          </div>
          <div>
            <div className="text-3xl font-headline font-extrabold text-white mb-1">24/7</div>
            <div className="font-label text-xs uppercase tracking-wider text-slate-500">Offline Access</div>
          </div>
        </div>
      </section>

      {/* <!-- Benefits Grid --> */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center md:text-left max-w-2xl">
            <h2 className="text-3xl font-headline font-extrabold text-white mb-4">Empowering Institutional Excellence</h2>
            <p className="text-on-surface-variant">The tools you need to digitize your assessment workflow without the technical headache.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-8 rounded-xl border border-white/5 hover:border-primary/20 transition-all group">
              <Zap className="text-indigo-300 w-10 h-10 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="text-lg font-headline font-bold text-white mb-4">Instant Marking</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Objective questions are graded the micro-second the student submits. No more manual scripts.</p>
            </div>
            <div className="glass-card p-8 rounded-xl border border-white/5 hover:border-primary/20 transition-all group">
              <TrendingUp className="text-indigo-300 w-10 h-10 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="text-lg font-headline font-bold text-white mb-4">Instant Results</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Students get immediate feedback on their performance, reducing anxiety and improving learning outcomes.</p>
            </div>
            <div className="glass-card p-8 rounded-xl border border-white/5 hover:border-primary/20 transition-all group">
              <BarChart2 className="text-indigo-300 w-10 h-10 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="text-lg font-headline font-bold text-white mb-4">Performance Reports</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Generate detailed analytical reports for classes, subjects, or individual student progress trends.</p>
            </div>
            <div className="glass-card p-8 rounded-xl border border-white/5 hover:border-primary/20 transition-all group">
              <DollarSign className="text-indigo-300 w-10 h-10 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="text-lg font-headline font-bold text-white mb-4">Reduce Printing Costs</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Save millions on paper, ink, and logistics by moving your entire examination suite to digital clouds.</p>
            </div>
            <div className="glass-card p-8 rounded-xl border border-white/5 hover:border-primary/20 transition-all group">
              <Shield className="text-indigo-300 w-10 h-10 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="text-lg font-headline font-bold text-white mb-4">Secure Exams</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Advanced anti-cheat measures, random question shuffling, and lockdown browser features ensure integrity.</p>
            </div>
            <div className="glass-card p-8 rounded-xl border border-white/5 hover:border-primary/20 transition-all group">
              <GraduationCap className="text-indigo-300 w-10 h-10 mb-6 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <h3 className="text-lg font-headline font-bold text-white mb-4">Better Exam Prep</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">Familiarize students with the CBT format used by major examining bodies like JAMB and WAEC.</p>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- How It Works --> */}
      <section className="py-32 px-8 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-headline font-extrabold text-white mb-16 text-center">Seamless Workflow</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* <!-- Connector Line (Desktop Only) --> */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent -translate-y-12"></div>
            
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-headline font-bold text-xl mb-6 z-10 shadow-[0_0_20px_rgba(99,102,241,0.2)]">1</div>
              <h3 className="text-xl font-headline font-bold text-white mb-4">Create Exams Offline</h3>
              <p className="text-on-surface-variant text-sm">Upload questions using our intuitive Excel-based templates or online builder. No internet required for local hosting.</p>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-headline font-bold text-xl mb-6 z-10 shadow-[0_0_20px_rgba(99,102,241,0.2)]">2</div>
              <h3 className="text-xl font-headline font-bold text-white mb-4">Students Take Exams</h3>
              <p className="text-on-surface-variant text-sm">Students log in via any local network or internet-connected device. The system manages timing and sync automatically.</p>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-headline font-bold text-xl mb-6 z-10 shadow-[0_0_20px_rgba(99,102,241,0.2)]">3</div>
              <h3 className="text-xl font-headline font-bold text-white mb-4">Get Instant Results</h3>
              <p className="text-on-surface-variant text-sm">Review scores immediately. Export data directly to your school management system or print marksheets with one click.</p>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Device Support --> */}
      <section className="py-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-headline font-extrabold text-white mb-6">Works on Your <br/> Existing Infrastructure</h2>
            <p className="text-on-surface-variant mb-10 leading-relaxed">Swift Learn is designed for hardware flexibility. You don't need expensive high-end computers. Use what you already have in your school lab.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-xl surface-container-highest/20 border border-white/5">
                <Monitor className="text-indigo-300 w-5 h-5" />
                <span className="text-sm font-medium text-white">Desktop</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl surface-container-highest/20 border border-white/5">
                <Laptop className="text-indigo-300 w-5 h-5" />
                <span className="text-sm font-medium text-white">Laptop</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl surface-container-highest/20 border border-white/5">
                <Tablet className="text-indigo-300 w-5 h-5" />
                <span className="text-sm font-medium text-white">Tablet</span>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl surface-container-highest/20 border border-white/5">
                <Smartphone className="text-indigo-300 w-5 h-5" />
                <span className="text-sm font-medium text-white">Smartphone</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
            <div className="relative glass-card p-4 rounded-2xl border border-white/10 shadow-2xl">
              {/* Note: Placeholder image used from original stitch html */}
              <img className="rounded-xl w-full grayscale-[0.5] hover:grayscale-0 transition-all duration-500" alt="Modern digital exam dashboard on a laptop screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACXQLAtgtsT1_5kdFAxFFBu258rAsjwU1fccD7jzRGORed1RCyI6Ldc8SgUd7iWCfQ35O8T9XtAywbS1DipmWy7qUYActG64Y_El9exz170e68qgb6o8KbQrpDLXPKDUGG4CAbLyy2dSj5TW9TMDclwI42KjuvMZGo9xtm0D4615lmELfPVJxHx0HRN2LWMywFHtLutQ-R2tRgHLRkUDG1dSXFmydKO3FNVfwAMtxjYCxo7Qos06UmGuXQwLYK8426nQvEraJqT8kH"/>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Bottom CTA --> */}
      <section className="py-24 px-8 relative">
        <div className="max-w-5xl mx-auto glass-card p-12 md:p-20 rounded-[2rem] border border-white/10 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -z-10"></div>
          <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-white mb-8">Move from manual exams to a digital testing system</h2>
          <p className="text-on-surface-variant text-lg mb-12 max-w-2xl mx-auto">Join hundreds of forward-thinking Nigerian schools today. Fast setup, secure results, zero stress.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-primary-container text-on-primary-container px-10 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-primary-container/20">
              Create Free Account
            </Link>
            <Link href="/contact" className="text-white px-10 py-4 rounded-lg font-bold text-lg border border-outline-variant hover:bg-white/5 transition-colors">
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
