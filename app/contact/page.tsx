"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MessageCircle, ArrowRight, Mail, Phone, ChevronDown } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <Navbar />

      <main className="relative pt-32 pb-24 overflow-hidden flex-grow">
        {/* <!-- Ambient Glow Background --> */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500 to-violet-500 opacity-15 blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500 to-violet-500 opacity-15 blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-8 animate-fade-up">
          {/* <!-- Header Section --> */}
          <div className="mb-20">
            <span className="text-primary text-[0.6875rem] font-label uppercase tracking-[0.05em] mb-4 block">Get Support</span>
            <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
              Have questions about institutional licensing or technical integration? Our dedicated team is here to support Nigerian educators 24/7.
            </p>
          </div>

          {/* <!-- Support Channels Bento --> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
            {/* <!-- WhatsApp Card --> */}
            <div className="glass-card p-8 rounded-xl group hover:scale-[1.02] transition-all duration-300 border border-outline-variant/15">
              <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center mb-8 border border-primary/20">
                <MessageCircle className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold text-white mb-2">WhatsApp</h3>
              <p className="text-on-surface-variant text-sm mb-8">Chat with our team for immediate assistance with onboarding.</p>
              <Link href="#" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
                Chat now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* <!-- Email Card --> */}
            <div className="glass-card p-8 rounded-xl group hover:scale-[1.02] transition-all duration-300 border border-outline-variant/15">
              <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center mb-8 border border-primary/20">
                <Mail className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold text-white mb-2">Email</h3>
              <p className="text-on-surface-variant text-sm mb-8">Detailed inquiries regarding billing and partnerships.</p>
              <span className="text-slate-400 text-[0.6875rem] font-label uppercase tracking-[0.05em] bg-surface-container-highest px-2 py-1 rounded">Coming soon</span>
            </div>

            {/* <!-- Phone Card --> */}
            <div className="glass-card p-8 rounded-xl group hover:scale-[1.02] transition-all duration-300 border border-outline-variant/15">
              <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center mb-8 border border-primary/20">
                <Phone className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-headline font-bold text-white mb-2">Phone</h3>
              <p className="text-on-surface-variant text-sm mb-8">Direct line for urgent technical support calls.</p>
              <span className="text-slate-400 text-[0.6875rem] font-label uppercase tracking-[0.05em] bg-surface-container-highest px-2 py-1 rounded">Coming soon</span>
            </div>
          </div>

          {/* <!-- FAQ Section --> */}
          <div className="max-w-3xl mx-auto animate-fade-up-1">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-headline font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-on-surface-variant">Find quick answers to common questions about Swift Learn.</p>
            </div>
            
            <div className="space-y-4">
              {/* <!-- Question 1 --> */}
              <details className="group glass-card rounded-xl overflow-hidden border border-outline-variant/15" open>
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-white/5 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-headline font-bold text-white">Do you need internet?</span>
                  <ChevronDown className="text-primary w-5 h-5 transition-transform group-open:rotate-180" strokeWidth={2.5} />
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed border-t border-white/5 pt-4">
                  Swift Learn is designed for the Nigerian landscape. While initial syncing requires data, our core learning modules are optimized for low-bandwidth environments and offer extensive offline caching capabilities.
                </div>
              </details>

              {/* <!-- Question 2 --> */}
              <details className="group glass-card rounded-xl overflow-hidden border border-outline-variant/15">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-white/5 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-headline font-bold text-white">How do I upgrade?</span>
                  <ChevronDown className="text-primary w-5 h-5 transition-transform group-open:rotate-180" strokeWidth={2.5} />
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed border-t border-white/5 pt-4">
                  Institutional administrators can upgrade plans directly from the "Billing" section of the dashboard. For bulk secondary school licenses, please contact our partnership team via the WhatsApp channel above.
                </div>
              </details>

              {/* <!-- Question 3 --> */}
              <details className="group glass-card rounded-xl overflow-hidden border border-outline-variant/15">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-white/5 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-headline font-bold text-white">Can students use phones?</span>
                  <ChevronDown className="text-primary w-5 h-5 transition-transform group-open:rotate-180" strokeWidth={2.5} />
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed border-t border-white/5 pt-4">
                  Yes, our platform is fully responsive and available as a progressive web app. We recommend modern Android devices with at least 2GB of RAM for the smoothest experience with our interactive lab modules.
                </div>
              </details>

              {/* <!-- Question 4 --> */}
              <details className="group glass-card rounded-xl overflow-hidden border border-outline-variant/15">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-white/5 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-headline font-bold text-white">Is curriculum aligned?</span>
                  <ChevronDown className="text-primary w-5 h-5 transition-transform group-open:rotate-180" strokeWidth={2.5} />
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed border-t border-white/5 pt-4">
                  Absolutely. All Swift Learn content is mapped directly to the NERDC national curriculum for JSS1 through SS3, ensuring your students are prepared for WAEC and JAMB examinations.
                </div>
              </details>

              {/* <!-- Question 5 --> */}
              <details className="group glass-card rounded-xl overflow-hidden border border-outline-variant/15">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-white/5 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-headline font-bold text-white">How secure is student data?</span>
                  <ChevronDown className="text-primary w-5 h-5 transition-transform group-open:rotate-180" strokeWidth={2.5} />
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed border-t border-white/5 pt-4">
                  Security is our baseline. We use bank-grade encryption for all institutional data and strictly adhere to Nigerian Data Protection Regulations (NDPR) to ensure student privacy is never compromised.
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
