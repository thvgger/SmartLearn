"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

declare global {
  interface Window {
    RmPaymentEngine: any;
  }
}

const PLANS: Record<string, { name: string; monthlyPrice: number; yearlyPrice: number; description: string }> = {
  starter: { name: "Starter", monthlyPrice: 1500, yearlyPrice: 13500, description: "Perfect for growing schools with up to 100 students." },
  school: { name: "School", monthlyPrice: 3000, yearlyPrice: 27000, description: "Our most popular plan for established schools with up to 500 students." },
  enterprise: { name: "Enterprise", monthlyPrice: 5000, yearlyPrice: 45000, description: "Custom solution for very large institutions." }
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const planKey = searchParams.get("plan") || "starter";
  const isYearly = searchParams.get("yearly") === "true";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [paymentData, setPaymentData] = useState<{
    rrr: string | null;
    reference: string;
    remitaParams: any;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const planDetails = PLANS[planKey] || PLANS["starter"];
  const actualPlan = isYearly ? `${planKey}_yearly` : planKey;
  const amount = isYearly ? planDetails.yearlyPrice : planDetails.monthlyPrice;
  const billingCycle = isYearly ? "Billed Annually" : "Billed Monthly";

  const [calcLoading, setCalcLoading] = useState(true);
  const [calcData, setCalcData] = useState<{
    subtotal: number;
    creditApplied: number;
    processingFee: number;
    totalDue: number;
    extraDays: number;
  } | null>(null);

  useEffect(() => {
    async function loadCalc() {
      try {
        const res = await fetch(`/api/subscription/calculate?plan=${actualPlan}`);
        if (res.status === 401) {
          window.location.href = `/login?callback=/checkout?plan=${planKey}&yearly=${isYearly}`;
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCalcData(data);
          }
        }
      } catch (err) {
        console.error("Failed to load calculation", err);
      } finally {
        setCalcLoading(false);
      }
    }
    loadCalc();
  }, [actualPlan, planKey, isYearly]);

  // Clear errors when leaving the page or remounting
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, []);



  async function handleConfirmPayment() {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: actualPlan })
      });

      if (response.status === 401) {
        window.location.href = `/login?callback=/checkout?plan=${planKey}&yearly=${isYearly}`;
        return;
      }

      const data = await response.json();
      if (!data.success) {
        setError(data.error || "Failed to initiate payment. Please try again.");
        setLoading(false);
        return;
      }

      if (data.bypassed) {
        setSuccess("Plan successfully updated! Redirecting to dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard?payment=success";
        }, 2000);
        return;
      }

      const { remitaParams, reference, rrr } = data;
      setPaymentData({ rrr, reference, remitaParams });
      setLoading(false);

    } catch (err) {
      setError("An unexpected network error occurred while contacting the payment server. Please try again.");
      setLoading(false);
    }
  }

  function handlePayOnline() {
    if (!paymentData) return;
    const { remitaParams, reference, rrr } = paymentData;
    
    setError(null);
    setSuccess(null);

    const paymentEngine = window.RmPaymentEngine.init({
        key: (process.env.NEXT_PUBLIC_REMITA_PUBLIC_KEY || "").replace(/^['"]|['"]$/g, "") || 
             (process.env.NEXT_PUBLIC_REMITA_ENV === "production" 
               ? "" 
               : "REVUVE9GR098NDY3OTE3OTd8YjU3M2IzYmI0OTU0YmNjYThhMGVkMjk0YThhNWRkYjI0OTZlNjA5MGRhZjI5ZTY5ZWY3YzU3YmI2M2Q1YjA5YTZlYzYyNjAyZWRlYjVjZDg2YmU1YjZlZTA2YzA4YmU1ZjkxYTQ0MTFkYjU1ZDBiZGE0Y2E5ZTEwOTBkYWY="),
        processRrr: rrr ? false : true,
        transactionId: reference,
        firstName: remitaParams.firstName,
        lastName: remitaParams.lastName,
        email: remitaParams.email,
        amount: remitaParams.amount,
        customerId: remitaParams.email,
        narration: remitaParams.narration,
        extendedData: {
          customFields: [
            { name: "RRR", value: rrr || "" }
          ]
        },
        onSuccess: async function (response: any) {
          setLoading(true);
          setSuccess("Payment authorized! Verifying your transaction securely...");
          
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                rrr: response.paymentReference || response.rrr,
                reference: reference
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              setSuccess("Payment verified successfully! Redirecting to your dashboard...");
              setTimeout(() => {
                window.location.href = "/dashboard?payment=success";
              }, 2000);
            } else {
              setError("Payment verification failed: " + verifyData.message);
              setSuccess(null);
              setLoading(false);
            }
          } catch (verifyErr) {
            setError("A network error occurred while verifying your payment. Please contact support if you were debited.");
            setSuccess(null);
            setLoading(false);
          }
        },
        onError: function () {
          setError("Payment transaction failed or was cancelled.");
          setSuccess(null);
          setLoading(false);
        },
        onClose: function () {
          setLoading(false);
          if (!error && !success) {
            setError("Payment widget was closed before completion.");
          }
        }
      });

      paymentEngine.showPaymentWidget({
        ...remitaParams
      });
  }

  async function handleVerifyPayment() {
    if (!paymentData) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rrr: paymentData.rrr,
          reference: paymentData.reference
        })
      });
      const verifyData = await verifyRes.json();
      
      if (verifyData.success) {
        setSuccess("Payment verified successfully! Redirecting to your dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard?payment=success";
        }, 2000);
      } else {
        setError("Payment verification failed: " + verifyData.message);
        setSuccess(null);
        setLoading(false);
      }
    } catch (verifyErr) {
      setError("A network error occurred while verifying your payment. Please contact support if you were debited.");
      setSuccess(null);
      setLoading(false);
    }
  }

  const handleCopyRRR = () => {
    if (paymentData?.rrr) {
      navigator.clipboard.writeText(paymentData.rrr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-background text-foreground font-body min-h-screen flex flex-col selection:bg-blue-500/30">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Ambient Background Gradient */}
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

        <div className="w-full max-w-2xl mx-auto z-10 animate-fade-in-up">
          <div className="mb-8 text-center">
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Complete your purchase</h1>
            <p className="text-zinc-400 text-sm md:text-base">Review your plan details before proceeding to payment.</p>
          </div>

          <Card className="bg-zinc-900 border-white/10 rounded-3xl overflow-hidden shadow-2xl p-0">
            <CardContent className="p-0">
              
              {/* Order Summary Header */}
              <div className="bg-zinc-800/50 p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Icon icon="ri:vip-crown-line" className="w-5 h-5" />
                    </div>
                    <h2 className="font-headline text-xl md:text-2xl font-bold text-white">{planDetails.name} Plan</h2>
                  </div>
                  <p className="text-zinc-400 text-sm">{planDetails.description}</p>
                </div>
                <div className="text-left md:text-right shrink-0">
                  <div className="font-headline text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    ₦{amount.toLocaleString()}
                  </div>
                  <div className="text-blue-400 font-bold text-xs uppercase tracking-widest mt-1">
                    {billingCycle}
                  </div>
                </div>
              </div>

              {/* Status Banners */}
              <div className="p-6 md:p-8 bg-zinc-900 flex flex-col gap-6">
                
                {error && (
                  <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
                    <Icon icon="ri:error-warning-fill" className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-red-400 font-bold text-sm mb-1">Payment Issue</h4>
                      <p className="text-red-400/80 text-xs leading-relaxed">{error}</p>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
                    <Icon icon="ri:checkbox-circle-fill" className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-emerald-400 font-bold text-sm mb-1">Success</h4>
                      <p className="text-emerald-400/80 text-xs leading-relaxed">{success}</p>
                    </div>
                  </div>
                )}

                {/* Plan Breakdown */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-medium">Subtotal</span>
                    <span className="text-white font-bold">₦{calcLoading ? "..." : (calcData?.subtotal || amount).toLocaleString()}</span>
                  </div>
                  {calcData && calcData.creditApplied > 0 && (
                    <div className="p-4 border-b border-white/5 flex justify-between items-center text-sm bg-blue-500/5">
                      <span className="text-blue-400 font-medium flex items-center gap-2">
                        Unused Time Credit
                        <Icon icon="ri:information-line" className="w-3.5 h-3.5 text-blue-400/70" />
                      </span>
                      <span className="text-blue-400 font-bold">- ₦{calcData.creditApplied.toLocaleString()}</span>
                    </div>
                  )}
                  {calcData && calcData.extraDays > 0 && (
                    <div className="p-4 border-b border-white/5 flex justify-between items-center text-sm bg-emerald-500/5">
                      <span className="text-emerald-400 font-medium flex items-center gap-2">
                        Rollover Days
                        <Icon icon="ri:information-line" className="w-3.5 h-3.5 text-emerald-400/70" />
                      </span>
                      <span className="text-emerald-400 font-bold">+{calcData.extraDays} Days</span>
                    </div>
                  )}
                  <div className="p-4 border-b border-white/5 flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-medium flex items-center gap-2">
                      Processing Fee (1.5%)
                      <Icon icon="ri:information-line" className="w-3.5 h-3.5 text-zinc-600" />
                    </span>
                    <span className="text-white font-bold">
                      {calcLoading ? "..." : (calcData?.processingFee ? `₦${calcData.processingFee.toLocaleString()}` : "₦0")}
                    </span>
                  </div>
                  <div className="p-4 bg-white/[0.02] flex justify-between items-center">
                    <span className="text-white font-bold">Total Due Today</span>
                    <span className="text-white font-extrabold text-lg">₦{calcLoading ? "..." : (calcData?.totalDue !== undefined ? calcData.totalDue : (amount + Math.min(Math.round(amount * 0.015), 2000))).toLocaleString()}</span>
                  </div>
                </div>

                 <div className="flex flex-col items-center justify-center gap-2 py-1">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                    <Icon icon="ri:lock-fill" className="w-3.5 h-3.5 text-zinc-600" />
                    Payments are 256-bit encrypted and secure.
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 uppercase tracking-widest font-black mt-2">
                    <span>Secured By</span>
                    <img 
                      src="https://cdn.brandfetch.io/idXGt7uGXJ/w/820/h/229/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1777908111401" 
                      alt="Remita" 
                      className="h-3.5 w-auto ml-1.5 opacity-80"
                    />
                  </div>
                </div>

                {/* Actions */}
                {!paymentData ? (
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <Button 
                      onClick={handleConfirmPayment}
                      disabled={loading || !!success}
                      className="w-full sm:flex-[2] h-auto min-h-14 py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : success ? (
                        <>
                          <Icon icon="ri:check-line" className="w-5 h-5" />
                          Authorized
                        </>
                      ) : (
                        <span className="flex items-center gap-2 flex-wrap justify-center text-center">
                          <span>Generate Invoice</span>
                          {((calcData?.totalDue !== undefined ? calcData.totalDue : (amount + Math.min(Math.round(amount * 0.015), 2000))) !== 0) && (
                            <span className="opacity-90">
                              & Pay ₦{(calcData?.totalDue !== undefined ? calcData.totalDue : (amount + Math.min(Math.round(amount * 0.015), 2000))).toLocaleString()}
                            </span>
                          )}
                          <Icon icon="ri:arrow-right-line" className="w-4 h-4 shrink-0" />
                        </span>
                      )}
                    </Button>
                    <Button 
                      onClick={() => router.back()}
                      variant="outline"
                      type="button"
                      disabled={loading || !!success}
                      className="w-full sm:flex-1 h-14 bg-transparent border-white/10 text-white hover:bg-white/5 font-bold rounded-xl transition-all order-2 sm:order-1"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-5 bg-blue-900/20 border border-blue-500/30 rounded-2xl flex flex-col items-center justify-center text-center gap-3 mb-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-500"></div>
                      <h3 className="text-blue-300 font-bold uppercase tracking-widest text-xs">Your Payment Reference (RRR)</h3>
                      <div className="flex items-center justify-center gap-3">
                        <span className="font-headline text-2xl md:text-4xl font-black text-white tracking-wider">
                          {paymentData.rrr || "N/A"}
                        </span>
                        {paymentData.rrr && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleCopyRRR}
                            className="text-blue-400 hover:text-white hover:bg-blue-500/20 shrink-0"
                            title="Copy RRR"
                          >
                            <Icon icon={copied ? "ri:check-line" : "ri:file-copy-line"} className="w-5 h-5" />
                          </Button>
                        )}
                      </div>
                      <p className="text-zinc-400 text-sm max-w-sm">
                        You can copy this RRR to pay later at any bank branch or via your banking app.
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <Button 
                        onClick={handlePayOnline}
                        disabled={loading || !!success}
                        className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Icon icon="ri:bank-card-line" className="w-5 h-5" />
                        Pay Now Online
                      </Button>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          onClick={handleVerifyPayment}
                          disabled={loading || !!success}
                          className="w-full sm:flex-1 h-12 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
                          ) : (
                            <Icon icon="ri:checkbox-circle-line" className="w-4 h-4" />
                          )}
                          I Have Paid
                        </Button>
                        
                        <Button 
                          onClick={() => router.push("/dashboard")}
                          disabled={loading || !!success}
                          className="w-full sm:flex-1 h-12 bg-transparent border-white/10 text-white hover:bg-white/5 font-bold rounded-xl transition-all"
                        >
                          Pay Later
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white gap-4">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-zinc-500 font-bold text-sm tracking-widest uppercase animate-pulse">Loading Checkout...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
