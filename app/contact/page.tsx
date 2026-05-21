"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  return (
    <div className="bg-background text-foreground font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />

      <main className="relative pt-32 pb-24 overflow-hidden flex-grow">
        {/* Ambient Glow Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500 to-violet-500 opacity-15 blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500 to-violet-500 opacity-15 blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-8 animate-fade-in-up">
          {/* Header Section */}
          <div className="mb-20">
            {/* <Badge variant="outline" className="text-indigo-400 font-bold tracking-[0.2em] uppercase text-[10px] mb-6 px-4 py-1.5 border-indigo-500/20 bg-indigo-500/5">
              GET SUPPORT
            </Badge> */}
            <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed">
              Have questions about institutional licensing or technical integration? Our dedicated team is here to support Nigerian educators 24/7.
            </p>
          </div>

          {/* Support Channels Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
            {/* WhatsApp Card */}
            <Card className="bg-zinc-900 border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all p-0">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8">
                  <Icon icon="ri:message-3-line" className="text-indigo-400 w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-headline font-bold text-white mb-2">WhatsApp</CardTitle>
                <CardDescription className="text-zinc-500 text-sm mb-8 leading-relaxed">Chat with our team for immediate assistance with onboarding.</CardDescription>
                <Link href="#" className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:gap-3 transition-all text-sm uppercase tracking-widest">
                  Chat now <Icon icon="ri:arrow-right-line" className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card className="bg-zinc-900 border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all p-0 opacity-80">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8">
                  <Icon icon="ri:send-plane-line" className="text-indigo-400 w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-headline font-bold text-white mb-2">Email</CardTitle>
                <CardDescription className="text-zinc-500 text-sm mb-8 leading-relaxed">Detailed inquiries regarding billing and partnerships.</CardDescription>
                <Badge variant="secondary" className="bg-white/5 text-zinc-400 border-none font-bold text-[10px] px-3 py-1">COMING SOON</Badge>
              </CardContent>
            </Card>

            {/* Phone Card */}
            <Card className="bg-zinc-900 border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all p-0 opacity-80">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-8">
                  <Icon icon="ri:phone-line" className="text-indigo-400 w-6 h-6" />
                </div>
                <CardTitle className="text-xl font-headline font-bold text-white mb-2">Phone</CardTitle>
                <CardDescription className="text-zinc-500 text-sm mb-8 leading-relaxed">Direct line for urgent technical support calls.</CardDescription>
                <Badge variant="secondary" className="bg-white/5 text-zinc-400 border-none font-bold text-[10px] px-3 py-1">COMING SOON</Badge>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-headline font-extrabold text-white mb-4 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-zinc-500">Find quick answers to common questions about Swift Learn.</p>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  q: "Do you need internet?", 
                  a: "Swift Learn is designed for the Nigerian landscape. While initial syncing requires data, our core learning modules are optimized for low-bandwidth environments and offer extensive offline caching capabilities.",
                  open: true
                },
                { 
                  q: "How do I upgrade?", 
                  a: "Institutional administrators can upgrade plans directly from the &quot;Billing&quot; section of the dashboard. For bulk secondary school licenses, please contact our partnership team via the WhatsApp channel above."
                },
                { 
                  q: "Can students use phones?", 
                  a: "Yes, our platform is fully responsive and available as a progressive web app. We recommend modern Android devices with at least 2GB of RAM for the smoothest experience with our interactive lab modules."
                },
                { 
                  q: "Is curriculum aligned?", 
                  a: "Absolutely. All Swift Learn content is mapped directly to the NERDC national curriculum for JSS1 through SS3, ensuring your students are prepared for WAEC and JAMB examinations."
                },
                { 
                  q: "How secure is student data?", 
                  a: "Security is our baseline. We use bank-grade encryption for all institutional data and strictly adhere to Nigerian Data Protection Regulations (NDPR) to ensure student privacy is never compromised."
                }
              ].map((faq, i) => (
                <details key={i} className="group bg-white/[0.01] backdrop-blur-xl border-white/5 rounded-xl overflow-hidden ring-1 ring-white/5" open={faq.open}>
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-white/5 transition-colors list-none [&::-webkit-details-marker]:hidden">
                    <span className="font-headline font-bold text-white">{faq.q}</span>
                    <Icon icon="ri:arrow-down-s-line" className="text-indigo-400 w-5 h-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
