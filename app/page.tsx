"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="bg-background text-foreground font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-48 pb-32 px-6 overflow-hidden min-h-screen flex flex-col justify-center items-center">
          {/* Softened Background Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/5 blur-[140px] rounded-full -z-10 pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/[0.03] blur-[120px] rounded-full -z-10 pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto text-center animate-fade-in-up relative z-10">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
                The Future of School Assessments
              </span>
            </div>
             */}
            <h1 className="text-6xl md:text-8xl font-headline font-extrabold tracking-tight mb-8 leading-[1.05] text-gradient">
              Run Exams <br className="hidden md:block"/> Without the Stress
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
              Swift Learn is the all-in-one CBT platform designed for Nigerian schools. 
              Digitize your examination workflow, mark instantly, and save millions on printing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Button asChild size="lg" className="h-14 px-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Link href="/register">
                  Get Started Free
                  <Icon icon="ri:arrow-right-line" className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-xl border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all">
                <Link href="/features">See how it works</Link>
              </Button>
            </div>

            <p className="text-xs text-zinc-500 mt-6 flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider">
              <Icon icon="ri:windows-fill" className="w-4 h-4 text-blue-500" />
              Running offline exams?
              <Link href="/download" className="text-blue-400 hover:text-blue-300 hover:underline transition-all">
                Download Windows Offline Client
              </Link>
            </p>
          </div>
        </section>

        {/* Stats Section - Refined */}
        <section className="py-20 px-6 border-y border-white/5 bg-zinc-900/30 relative overflow-hidden">
          <div className="absolute inset-0 accent-glow opacity-30 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {[
              { val: "50,000+", lab: "Assessments Marked" },
              { val: "100%", lab: "Accurate Results" },
              { val: "0.5s", lab: "Instant Grading" },
              { val: "90%", lab: "Cost Reduction" }
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl font-headline font-extrabold text-white mb-2 group-hover:text-blue-400 transition-colors">{s.val}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{s.lab}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid - Cleaned up */}
        <section className="py-40 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-6 tracking-tight">Everything your school needs</h2>
              <p className="text-slate-400 text-lg">Powerful tools built specifically for the Nigerian education landscape.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: "ri:flashlight-line", title: "Automated Marking", desc: "Objective questions are graded immediately. Instant feedback for students, zero work for teachers." },
                { icon: "ri:bar-chart-2-line", title: "Rich Analytics", desc: "Gain deep insights into class performance, subject trends, and individual student progress." },
                { icon: "ri:file-list-3-line", title: "Report Generation", desc: "Generate professional broadsheets and individual result slips with a single click." },
                { icon: "ri:money-dollar-circle-line", title: "Massive Savings", desc: "Eliminate the recurring costs of paper, ink, and manual labor for every examination cycle." },
                { icon: "ri:shield-check-line", title: "Cheating Prevention", desc: "Advanced shuffling, lockdown features, and remote monitoring keep your exams high-integrity." },
                { icon: "ri:graduation-cap-line", title: "CBT Ready", desc: "Prepare students for the digital future of JAMB, WAEC, and international standardized tests." }
              ].map((f, i) => (
                <Card key={i} className="bg-zinc-900 border-white/10 hover:border-white/20 transition-all group overflow-hidden relative rounded-2xl p-8 flex flex-col h-full">
                  {/* Top Right Decorative Background */}
                  <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none overflow-hidden rounded-tr-2xl">
                    <div className="absolute top-[-20%] right-[-10%] w-full h-full bg-white/[0.02] rotate-12 rounded-3xl transition-transform group-hover:rotate-[15deg]" />
                    <div className="absolute top-[10%] right-[-20%] w-full h-full border border-white/5 rotate-12 rounded-3xl" />
                  </div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-6 relative z-10 transition-colors group-hover:bg-blue-500/10">
                    <Icon icon={f.icon} className="w-6 h-6" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 relative z-10">
                    {f.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-8 flex-grow relative z-10">
                    {f.desc}
                  </p>
                  
                  {/* Footer Link */}
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors relative z-10 mt-auto">
                    Learn more <Icon icon="ri:arrow-right-line" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Infrastructure Support */}
        <section className="py-40 px-6 bg-zinc-900/30 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2">
                <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-8 tracking-tight">Zero Hardware Barriers</h2>
                <p className="text-slate-400 text-lg mb-12 leading-relaxed">
                  Swift Learn works in any browser or through our dedicated offline Windows application. Host secure local assessments in your computer labs without constant internet access.
                </p>
                
                <div className="space-y-6">
                  {[
                    "Secure offline Windows desktop app",
                    "Cheating prevention & locked exam browser",
                    "Ultra-lightweight local networking",
                    "Automatic grades sync back to the cloud"
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Icon icon="ri:checkbox-circle-line" className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-zinc-300 font-medium">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="absolute -inset-4 bg-blue-500/20 blur-[80px] rounded-full opacity-30"></div>
                <Card className="bg-zinc-900 border-white/10 p-2 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    className="rounded-2xl w-full border border-white/10" 
                    alt="Digital Dashboard" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuACXQLAtgtsT1_5kdFAxFFBu258rAsjwU1fccD7jzRGORed1RCyI6Ldc8SgUd7iWCfQ35O8T9XtAywbS1DipmWy7qUYActG64Y_El9exz170e68qgb6o8KbQrpDLXPKDUGG4CAbLyy2dSj5TW9TMDclwI42KjuvMZGo9xtm0D4615lmELfPVJxHx0HRN2LWMywFHtLutQ-R2tRgHLRkUDG1dSXFmydKO3FNVfwAMtxjYCxo7Qos06UmGuXQwLYK8426nQvEraJqT8kH"
                  />
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-6">
          <div className="max-w-5xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-blue-500/20 rounded-[2.5rem] blur opacity-50 group-hover:opacity-75 transition duration-1000"></div>
            <Card className="relative bg-zinc-900 border-white/10 rounded-[2.5rem] text-center overflow-hidden">
              <CardContent className="py-24 px-10 md:px-20">
                <div className="mb-12">
                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Ready to transform your school?</h2>
                  <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    Join hundreds of Nigerian schools making the switch to smart, secure, and stress-free digital testing.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                  <Button asChild size="lg" className="h-14 px-12 rounded-xl bg-white text-zinc-900 font-bold text-lg hover:bg-zinc-200 transition-colors shadow-lg">
                    <Link href="/register">Start Your Journey</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-14 px-12 rounded-xl border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-colors">
                    <Link href="/contact">Book a Demo</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
