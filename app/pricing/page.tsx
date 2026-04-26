\"use client\";

import { useState, useEffect } from \"react\";
import Link from \"next/link\";
import Navbar from \"../components/Navbar\";
import Footer from \"../components/Footer\";
import { Check, Shield, Gauge, CloudOff, Loader2 } from \"lucide-react\";
import Script from \"next/script\";

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
      
      const response = await fetch(\"/api/payment/initiate\", {
        method: \"POST\",
        headers: { \"Content-Type\": \"application/json\" },
        body: JSON.stringify({ plan: actualPlan })
      });

      if (response.status === 401) {
        window.location.href = \"/login?callback=/pricing\";
        return;
      }

      const data = await response.json();
      if (!data.success) {
        alert(data.error || \"Failed to initiate payment\");
        setLoadingPlan(null);
        return;
      }

      const { remitaParams, reference } = data;

      const paymentEngine = window.RmPaymentEngine.init({
        key: process.env.NEXT_PUBLIC_REMITA_PUBLIC_KEY || \"REVUVE9GR098NDY3OTE3OTd8YjU3M2IzYmI0OTU0YmNjYThhMGVkMjk0YThhNWRkYjI0OTZlNjA5MGRhZjI5ZTY5ZWY3YzU3YmI2M2Q1YjA5YTZlYzYyNjAyZWRlYjVjZDg2YmU1YjZlZTA2YzA4YmU1ZjkxYTQ0MTFkYjU1ZDBiZGE0Y2E5ZTEwOTBkYWY=\", // Demo key
        processRrr: true,
        transactionId: reference,
        extendedData: {
          customFields: [
            { name: \"RRR\", value: \"\" }
          ]
        },
        onSuccess: async function (response: any) {
          console.log(\"Payment Success\", response);
          // Verify on server
          const verifyRes = await fetch(\"/api/payment/verify\", {
            method: \"POST\",
            headers: { \"Content-Type\": \"application/json\" },
            body: JSON.stringify({
              rrr: response.paymentReference || response.rrr,
              reference: reference
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            window.location.href = \"/dashboard?payment=success\";
          } else {
            alert(\"Payment verification failed: \" + verifyData.message);
          }
        },
        onError: function (response: any) {
          console.error(\"Payment Error\", response);
          alert(\"Payment failed or closed\");
          setLoadingPlan(null);
        },
        onClose: function () {
          setLoadingPlan(null);
        }
      });

      paymentEngine.showPaymentWidget({
        ...remitaParams
      });

    } catch (error) {
      console.error(\"Payment handling error:\", error);
      alert(\"An unexpected error occurred\");
      setLoadingPlan(null);
    }
  }

  return (
    <div className=\"bg-surface text-on-background font-body selection:bg-primary/30 min-h-screen flex flex-col\">
      <Script 
        src=\"https://remitademo.net/remita/exapp/api/v1/send/api/echannelsvc/system/developer/api/v1/remita-pay-inline.bundle.js\"
        strategy=\"lazyOnload\"
      />
      <Navbar />
      <main className=\"pt-32 pb-24 px-6 max-w-7xl mx-auto relative overflow-hidden flex-grow\">
        {/* <!-- Background Soul Gradient --> */}
        <div className=\"absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-indigo-600/10 to-transparent blur-[120px] -z-10\"></div>

        <header className=\"text-center mb-16\">
          <span className=\"text-primary font-label tracking-[0.2em] uppercase text-[10px] font-bold mb-4 block\">Institutional Excellence</span>
          <h1 className=\"font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-background mb-6\">Simple, Transparent Pricing</h1>
          <p className=\"text-on-surface-variant max-w-2xl mx-auto text-lg leading-relaxed\">
            Empowering Nigerian schools with world-class digital tools. Select the plan that fits your institution\"s growth phase. 
          </p>
        </header>

        {/* <!-- Toggle Switch --> */}
        <div className=\"flex justify-center items-center gap-4 mb-20\">
          <span className={`text-sm font-medium ${!isYearly ? \"text-white\" : \"text-on-surface-variant\"}`}>Monthly</span>
          <div
            className=\"relative w-14 h-7 bg-surface-container rounded-full p-1 cursor-pointer transition-colors\"
            onClick={() => setIsYearly(!isYearly)}
          >
            <div className={`absolute top-1 w-5 h-5 bg-primary rounded-full transition-transform ${isYearly ? \"translate-x-7\" : \"translate-x-0\"}`}></div>
          </div>
          <span className={`text-sm font-medium ${isYearly ? \"text-white\" : \"text-on-surface-variant\"}`}>Yearly</span>
          <span className=\"bg-secondary-container text-on-secondary-container px-2 py-1 rounded text-[10px] font-bold tracking-tight\">SAVE 25%</span>
        </div>

        {/* <!-- Pricing Grid --> */}
        <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start animate-fade-up\">
          {/* <!-- Plan: Free --> */}
          <div className=\"glass-card p-8 rounded-xl border border-outline-variant/15 flex flex-col h-full hover:bg-white/5 transition-all duration-300\">
            <div className=\"mb-8\">
              <h3 className=\"font-headline text-xl font-bold text-white mb-2\">Free</h3>
              <p className=\"text-on-surface-variant text-sm h-10\">Perfect for testing the platform with a single classroom.</p>
            </div>
            <div className=\"mb-8\">
              <span className=\"font-headline text-4xl font-extrabold text-white tracking-tighter\">₦0</span>
              <span className=\"text-slate-500 text-sm\">/mo</span>
            </div>
            <ul className=\"space-y-4 mb-10 flex-grow\">
              <li className=\"flex items-start gap-3 text-sm text-on-surface-variant\">
                <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                15 Students
              </li>
              <li className=\"flex items-start gap-3 text-sm text-on-surface-variant\">
                <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                Manual Data Backups
              </li>
              <li className=\"flex items-start gap-3 text-sm text-on-surface-variant\">
                <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                Basic Exam Stats
              </li>
            </ul>
            <Link href=\"/register\" className=\"block w-full py-3 rounded-lg border border-outline-variant/30 text-white font-headline font-bold text-sm hover:bg-white/5 transition-all text-center\">
              Start Free
            </Link>
          </div>

          {/* <!-- Plan: Starter --> */}
          <div className=\"glass-card p-8 rounded-xl border border-outline-variant/15 flex flex-col h-full hover:bg-white/5 transition-all duration-300\">
            <div className=\"mb-8\">
              <h3 className=\"font-headline text-xl font-bold text-white mb-2\">Starter</h3>
              <p className=\"text-on-surface-variant text-sm h-10\">Ideal for small private tutorials and coaching centers.</p>
            </div>
            <div className=\"mb-8\">
              <span className=\"font-headline text-4xl font-extrabold text-white tracking-tighter\">{isYearly ? \"₦7,500\" : \"₦10,000\"}</span>
              <span className=\"text-slate-500 text-sm\">/mo</span>
              <div className=\"text-[10px] text-primary mt-1 font-bold h-4\">
                {isYearly && \"₦90,000 billed annually\"}
              </div>
            </div>
            <ul className=\"space-y-4 mb-10 flex-grow\">
              <li className=\"flex items-start gap-3 text-sm text-on-surface-variant\">
                <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                100 Students
              </li>
              <li className=\"flex items-start gap-3 text-sm text-on-surface-variant\">
                <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                Automated Cloud Sync
              </li>
              <li className=\"flex items-start gap-3 text-sm text-on-surface-variant\">
                <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                Question Bank (500 Qs)
              </li>
              <li className=\"flex items-start gap-3 text-sm text-on-surface-variant\">
                <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                Email Support
              </li>
            </ul>
            <button 
              onClick={() => handlePayment(\"starter\")}
              disabled={loadingPlan === \"starter\"}
              className=\"block w-full py-3 rounded-lg border border-outline-variant/30 text-white font-headline font-bold text-sm hover:bg-white/5 transition-all text-center flex items-center justify-center gap-2\"
            >
              {loadingPlan === \"starter\" && <Loader2 className=\"w-4 h-4 animate-spin\" />}
              Choose Starter
            </button>
          </div>

          {/* <!-- Plan: School (Popular) --> */}
          <div className=\"relative flex flex-col h-full\">
            <div className=\"absolute -top-4 left-1/2 -translate-x-1/2 z-10\">
              <span className=\"bg-primary text-on-primary font-label text-[10px] font-extrabold px-4 py-1.5 rounded-full shadow-lg\">MOST POPULAR</span>
            </div>
            <div className=\"bg-surface-container-high p-8 rounded-xl border border-primary/30 shadow-[0_0_20px_rgba(192,193,255,0.15)] flex flex-col h-full relative z-0 transform lg:scale-105 shadow-2xl\">
              <div className=\"mb-8\">
                <h3 className=\"font-headline text-xl font-bold text-white mb-2\">School</h3>
                <p className=\"text-on-surface-variant text-sm h-10\">Complete data management for standard secondary schools.</p>
              </div>
              <div className=\"mb-8\">
                <span className=\"font-headline text-4xl font-extrabold text-white tracking-tighter\">{isYearly ? \"₦15,000\" : \"₦20,000\"}</span>
                <span className=\"text-slate-500 text-sm\">/mo</span>
                <div className=\"text-[10px] text-primary mt-1 font-bold h-4\">
                  {isYearly && \"₦180,000 billed annually\"}
                </div>
              </div>
              <ul className=\"space-y-4 mb-10 flex-grow\">
                <li className=\"flex items-start gap-3 text-sm text-white\">
                  <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                  500 Students
                </li>
                <li className=\"flex items-start gap-3 text-sm text-white\">
                  <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                  Unlimited Question Bank
                </li>
                <li className=\"flex items-start gap-3 text-sm text-white\">
                  <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                  Real-time Results Sync
                </li>
                <li className=\"flex items-start gap-3 text-sm text-white\">
                  <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                  Priority Phone Support
                </li>
              </ul>
              <button 
                onClick={() => handlePayment(\"school\")}
                disabled={loadingPlan === \"school\"}
                className=\"block w-full py-4 rounded-lg bg-primary-container text-on-primary-container font-headline font-bold text-sm hover:scale-[1.02] transition-transform shadow-xl text-center flex items-center justify-center gap-2\"
              >
                {loadingPlan === \"school\" && <Loader2 className=\"w-4 h-4 animate-spin\" />}
                Get Started Now
              </button>
            </div>
          </div>

          {/* <!-- Plan: Enterprise --> */}
          <div className=\"glass-card p-8 rounded-xl border border-outline-variant/15 flex flex-col h-full hover:bg-white/5 transition-all duration-300\">
            <div className=\"mb-8\">
              <h3 className=\"font-headline text-xl font-bold text-white mb-2\">Enterprise</h3>
              <p className=\"text-on-surface-variant text-sm h-10\">For large institutions requiring full customization and scale.</p>        
            </div>
            <div className=\"mb-8\">
              <span className=\"font-headline text-4xl font-extrabold text-white tracking-tighter\">{isYearly ? \"₦25,000\" : \"₦33,333\"}</span>
              <span className=\"text-slate-500 text-sm\">/mo</span>
              <div className=\"text-[10px] text-primary mt-1 font-bold h-4\">
                {isYearly && \"₦300,000 billed annually\"}
              </div>
            </div>
            <ul className=\"space-y-4 mb-10 flex-grow\">
              <li className=\"flex items-start gap-3 text-sm text-on-surface-variant\">
                <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                Unlimited Students
              </li>
              <li className=\"flex items-start gap-3 text-sm text-on-surface-variant\">
                <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                Dedicated Account Manager
              </li>
              <li className=\"flex items-start gap-3 text-sm text-on-surface-variant\">
                <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                Custom Data Retention
              </li>
              <li className=\"flex items-start gap-3 text-sm text-on-surface-variant\">
                <Check className=\"text-primary w-5 h-5 shrink-0\" strokeWidth={3} />
                White-label Dashboard
              </li>
            </ul>
            <button 
              onClick={() => handlePayment(\"enterprise\")}
              disabled={loadingPlan === \"enterprise\"}
              className=\"block w-full py-3 rounded-lg border border-outline-variant/30 text-white font-headline font-bold text-sm hover:bg-white/5 transition-all text-center flex items-center justify-center gap-2\"
            >
              {loadingPlan === \"enterprise\" && <Loader2 className=\"w-4 h-4 animate-spin\" />}
              Choose Enterprise
            </button>
          </div>
        </div>
      </main>

      {/* <!-- Detailed Features Comparison (Asymmetric Bento) --> */}
      <section className=\"py-24 px-6 bg-surface-container-lowest\">
        <div className=\"max-w-7xl mx-auto animate-fade-up-1\">
          <h2 className=\"font-headline text-3xl font-bold mb-16 text-center\">Institutional Grade Capabilities</h2>
          <div className=\"grid grid-cols-1 md:grid-cols-12 gap-8\">
            {/* <!-- Large Feature --> */}
            <div className=\"md:col-span-8 glass-card p-10 rounded-xl border border-outline-variant/10 flex flex-col justify-between overflow-hidden relative\">
              <div className=\"relative z-10\">
                <h4 className=\"font-headline text-2xl font-bold mb-4\">Centralized CBT Ecosystem</h4>
                <p className=\"text-on-surface-variant max-w-md leading-relaxed\">SmartLearn integrates your offline CBT infrastructure with the cloud, providing a unified dashboard for backups, question banks, and performance tracking.</p>
              </div>
              <div className=\"mt-12 flex gap-4 overflow-hidden -mr-10\">
                <div className=\"w-48 h-32 bg-surface-container-highest rounded border border-outline-variant/20 shrink-0 p-4\">
                  <div className=\"w-full h-1 bg-primary mb-2\"></div>
                  <div className=\"w-1/2 h-1 bg-outline-variant mb-2\"></div>
                  <div className=\"w-3/4 h-1 bg-outline-variant\"></div>
                </div>
                <div className=\"w-48 h-32 bg-surface-container rounded border border-outline-variant/20 shrink-0 p-4\">
                  <div className=\"w-1/3 h-1 bg-secondary mb-2\"></div>
                  <div className=\"w-2/3 h-1 bg-outline-variant mb-2\"></div>
                </div>
              </div>
            </div>

            {/* <!-- Small Feature --> */}
            <div className=\"md:col-span-4 bg-primary-container/10 p-10 rounded-xl border border-primary/20 flex flex-col justify-center\">   
              <Shield className=\"text-primary w-10 h-10 mb-6\" fill=\"currentColor\" strokeWidth={1} />
              <h4 className=\"font-headline text-xl font-bold mb-2\">Data Sovereignty</h4>
              <p className=\"text-on-surface-variant text-sm\">Bank-grade encryption for all student records and financial data.</p>
            </div>

            {/* <!-- Another Feature --> */}
            <div className=\"md:col-span-4 glass-card p-10 rounded-xl border border-outline-variant/10\">
              <Gauge className=\"text-primary w-10 h-10 mb-6\" />
              <h4 className=\"font-headline text-xl font-bold mb-2\">Cloud-Sync Ecosystem</h4>
              <p className=\"text-on-surface-variant text-sm\">Instant data synchronization between offline CBT devices and your central cloud dashboard.</p>
            </div>

            {/* <!-- Another Large Feature --> */}
            <div className=\"md:col-span-8 glass-card p-10 rounded-xl border border-outline-variant/10 bg-gradient-to-br from-indigo-500/5 to-transparent\">
              <div className=\"flex flex-col md:flex-row gap-8 items-center h-full\">
                <div className=\"flex-1\">
                  <h4 className=\"font-headline text-2xl font-bold mb-4\">Offline-CBT Integration</h4>
                  <p className=\"text-on-surface-variant text-sm leading-relaxed\">Built for Nigeria\"s unique connectivity landscape. Securely back up test results, student profiles, and question banks from local school servers to the cloud.</p>
                </div>
                <div className=\"w-full md:w-1/3 aspect-video bg-surface-container-low rounded border border-outline-variant/20 flex items-center justify-center\">
                  <CloudOff className=\"text-primary w-16 h-16 opacity-30\" />
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
