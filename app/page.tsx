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
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/5 blur-[140px] rounded-full -z-10 pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-violet-500/[0.03] blur-[120px] rounded-full -z-10 pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto text-center animate-fade-in-up relative z-10">
            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300">
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
              <Button render={<Link href="/register" />} size="lg" className="h-14 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                Get Started Free
                <Icon icon="lucide:arrow-right" className="ml-2 w-5 h-5" />
              </Button>
              <Button render={<Link href="/features" />} variant="outline" size="lg" className="h-14 px-10 rounded-xl border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all">
                See how it works
              </Button>
            </div>
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
                <div className="text-4xl font-headline font-extrabold text-white mb-2 group-hover:text-indigo-400 transition-colors">{s.val}</div>
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
                { icon: "lucide:zap", title: "Automated Marking", desc: "Objective questions are graded immediately. Instant feedback for students, zero work for teachers." },
                { icon: "lucide:bar-chart-2", title: "Rich Analytics", desc: "Gain deep insights into class performance, subject trends, and individual student progress." },
                { icon: "lucide:bar-chart-2", title: "Report Generation", desc: "Generate professional broadsheets and individual result slips with a single click." },
                { icon: "lucide:dollar-sign", title: "Massive Savings", desc: "Eliminate the recurring costs of paper, ink, and manual labor for every examination cycle." },
                { icon: "lucide:shield-check", title: "Cheating Prevention", desc: "Advanced shuffling, lockdown features, and remote monitoring keep your exams high-integrity." },
                { icon: "lucide:graduation-cap", title: "CBT Ready", desc: "Prepare students for the digital future of JAMB, WAEC, and international standardized tests." }
              ].map((f, i) => (
                <Card key={i} className="bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all group overflow-hidden relative border-none ring-1 ring-white/5">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl -z-10 group-hover:bg-indigo-500/10 transition-all"></div>
                  <CardHeader className="p-8 pb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                      <Icon icon={f.icon} className="w-6 h-6" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <CardTitle className="text-xl font-headline font-bold text-white mb-4">{f.title}</CardTitle>
                    <CardDescription className="text-slate-400 text-sm leading-relaxed">{f.desc}</CardDescription>
                  </CardContent>
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
                  Swift Learn works on any device with a browser. Tablets, laptops, or old desktops in your lab—we handle it all.
                </p>
                
                <div className="space-y-6">
                  {[
                    "Works offline on local networks",
                    "Responsive design for all screen sizes",
                    "Ultra-lightweight on bandwidth",
                    "Automatic data sync when online"
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <Icon icon="lucide:check-circle" className="w-3 h-3 text-indigo-400" />
                      </div>
                      <span className="text-zinc-300 font-medium">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="absolute -inset-4 bg-indigo-500/20 blur-[80px] rounded-full opacity-30"></div>
                <Card className="bg-white/[0.01] backdrop-blur-xl border-white/5 p-2 rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    className="rounded-2xl w-full border border-white/5" 
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
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <Card className="relative bg-zinc-950/80 backdrop-blur-2xl rounded-[2.5rem] text-center border-white/5 overflow-hidden p-0 gap-0">
              <CardContent className="py-24 px-10 md:px-20">
                <CardHeader className="p-0 mb-12">
                  <CardTitle className="text-4xl md:text-6xl font-headline font-extrabold text-white mb-8 tracking-tight">Ready to transform your school?</CardTitle>
                  <CardDescription className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    Join hundreds of Nigerian schools making the switch to smart, secure, and stress-free digital testing.
                  </CardDescription>
                </CardHeader>
                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                  <Button render={<Link href="/register" />} size="lg" className="h-14 px-12 rounded-xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-all shadow-xl">
                    Start Your Journey
                  </Button>
                  <Button render={<Link href="/contact" />} variant="outline" size="lg" className="h-14 px-12 rounded-xl border-white/10 bg-white/5 text-white font-bold text-lg hover:bg-white/10 transition-all">
                    Book a Demo
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
