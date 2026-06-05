"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { getErrorMessage } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  plan: string;
  reference: string;
  rrr: string;
  status: "pending" | "success" | "failed";
  payment_method: string | null;
  created_at: string;
  updated_at: string;
}

export default function TransactionsPage() {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "success" | "pending" | "failed">("all");

  // State for tracking copy status and verification status of individual transactions
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifyMessage, setVerifyMessage] = useState<{ id: string; type: "success" | "error" | "info"; text: string } | null>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/history");
      if (!res.ok) {
        throw res;
      }
      const data = await res.json();
      if (data.success) {
        setTransactions(data.transactions || []);
      } else {
        throw new Error(data.error || "Failed to load transactions.");
      }
    } catch (err) {
      const msg = await getErrorMessage(err, "Failed to load transactions.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCopy = (rrr: string, txId: string) => {
    navigator.clipboard.writeText(rrr);
    setCopiedId(txId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleVerify = async (tx: Transaction) => {
    setVerifyingId(tx.id);
    setVerifyMessage(null);
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rrr: tx.rrr,
          reference: tx.reference,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local list status to success
        setTransactions((prev) =>
          prev.map((t) => (t.id === tx.id ? { ...t, status: "success" } : t))
        );
        setShowPaymentSuccess(true);
        await refreshUser();
      } else {
        setVerifyMessage({
          id: tx.id,
          type: "info",
          text: data.message || "Payment is still pending. Verify again once payment is complete.",
        });
      }
    } catch (err) {
      console.error("Verification error:", err);
      setVerifyMessage({
        id: tx.id,
        type: "error",
        text: "Network verification error. Please try again.",
      });
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === "all") return true;
    return tx.status === activeTab;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in">
      {/* Header and Back Link */}
      <div className="space-y-4">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
        >
          <Icon icon="ri:arrow-left-line" className="w-4 h-4" />
          Back to Settings
        </Link>
        <div>
          <h1 className="font-headline text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Subscription & RRR History
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            View, copy, and check the status of all Remita Retrieval References (RRR) generated for your school.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <Card className="bg-zinc-900 border-white/10 rounded-2xl overflow-hidden p-0">
        <CardHeader className="p-6 pb-2 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-md bg-white/5 border border-white/5 text-indigo-400">
              <Icon icon="ri:history-line" className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="font-headline font-bold text-lg text-white">All Generated RRRs</CardTitle>
              <CardDescription className="text-zinc-500 text-xs mt-0.5">
                Check active, pending, or failed invoice statuses
              </CardDescription>
            </div>
          </div>

          {/* Glassmorphic Tabs */}
          <div className="flex items-center p-1 bg-zinc-950/80 border border-white/5 rounded-xl shrink-0 overflow-x-auto self-start md:self-center">
            {(["all", "success", "pending", "failed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setVerifyMessage(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center justify-between gap-3 mb-6 animate-fade-in-up">
              <div className="flex items-center gap-2">
                <Icon icon="ri:error-warning-fill" className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
              <Button size="sm" variant="ghost" onClick={fetchTransactions} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-3 border-none cursor-pointer">
                Retry
              </Button>
            </div>
          )}

          {loading ? (
            <div className="space-y-4 py-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-950 border border-white/5 rounded-xl p-5 animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2.5">
                    <div className="h-4 w-32 bg-white/10 rounded-full" />
                    <div className="h-3 w-48 bg-white/5 rounded-full" />
                  </div>
                  <div className="h-10 w-24 bg-white/10 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl">
              <Icon icon="ri:bank-card-line" className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
              <p className="text-white font-bold">No RRRs found</p>
              <p className="text-zinc-500 text-sm mt-1 max-w-[280px] mx-auto">
                {activeTab === "all"
                  ? "You haven't generated any subscription payment references yet."
                  : `You don't have any ${activeTab} RRRs at this time.`}
              </p>
              {activeTab === "all" && (
                <Button asChild className="mt-5 bg-indigo-600 hover:bg-indigo-500 h-10 px-5 text-xs font-bold rounded-xl">
                  <Link href="/dashboard/settings">Choose Plan</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((tx) => {
                const dateStr = new Date(tx.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                
                const isPending = tx.status === "pending";
                const isSuccess = tx.status === "success";
                const isFailed = tx.status === "failed";

                return (
                  <div
                    key={tx.id}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-zinc-950 rounded-xl border border-white/10 hover:border-white/20 transition-all gap-5"
                  >
                    {/* Invoice Metadata */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold text-white capitalize text-sm">
                          {tx.plan.replace("_yearly", " Yearly")} Plan
                        </span>
                        <Badge
                          variant="secondary"
                          className={
                            isSuccess
                              ? "bg-emerald-500/10 text-emerald-400 border-none font-bold text-[10px] px-2.5 py-0.5"
                              : isPending
                              ? "bg-amber-500/10 text-amber-400 border-none font-bold text-[10px] px-2.5 py-0.5"
                              : "bg-rose-500/10 text-rose-400 border-none font-bold text-[10px] px-2.5 py-0.5"
                          }
                        >
                          {isSuccess ? (
                            <span className="flex items-center gap-1">
                              <Icon icon="ri:checkbox-circle-line" className="w-3.5 h-3.5" />
                              Successful
                            </span>
                          ) : isPending ? (
                            <span className="flex items-center gap-1">
                              <Icon icon="ri:time-line" className="w-3.5 h-3.5" />
                              Pending Verification
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Icon icon="ri:close-circle-line" className="w-3.5 h-3.5" />
                              Failed
                            </span>
                          )}
                        </Badge>
                      </div>

                      <div className="text-zinc-500 text-xs font-semibold">
                        Generated on {dateStr}
                      </div>

                      {/* Display RRR and Copy Option */}
                      <div className="flex items-center gap-2 mt-2 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-lg w-fit">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">RRR:</span>
                        <span className="font-headline font-black text-white tracking-widest text-sm">
                          {tx.rrr}
                        </span>
                        <button
                          onClick={() => handleCopy(tx.rrr, tx.id)}
                          className="text-zinc-400 hover:text-white transition-colors shrink-0 ml-2"
                          title="Copy RRR"
                        >
                          <Icon
                            icon={copiedId === tx.id ? "ri:check-line" : "ri:file-copy-line"}
                            className={`w-3.5 h-3.5 ${copiedId === tx.id ? "text-emerald-400" : ""}`}
                          />
                        </button>
                      </div>

                      {verifyMessage && verifyMessage.id === tx.id && (
                        <p
                          className={`text-xs font-bold mt-2 flex items-start gap-1 leading-snug animate-fade-in ${
                            verifyMessage.type === "error"
                              ? "text-rose-400"
                              : verifyMessage.type === "info"
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          <Icon icon="ri:error-warning-line" className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{verifyMessage.text}</span>
                        </p>
                      )}
                    </div>

                    {/* Financial details & status verification check */}
                    <div className="flex flex-row md:flex-col items-end justify-between md:justify-center w-full md:w-auto shrink-0 gap-4">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">Amount</span>
                        <span className="font-headline font-black text-white text-lg">₦{tx.amount.toLocaleString()}</span>
                      </div>
                      
                      {isPending && (
                        <Button
                          onClick={() => handleVerify(tx)}
                          disabled={verifyingId === tx.id}
                          className="h-10 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5"
                        >
                          {verifyingId === tx.id ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Icon icon="ri:refresh-line" className="w-4 h-4" />
                              Check Status
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Modal (Matching overview page behavior) */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="bg-zinc-900 border border-emerald-500/20 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)] animate-in fade-in zoom-in-95 duration-200">
            {/* Glow */}
            <div className="bg-emerald-500/10 p-8 text-center border-b border-white/5 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full"></div>
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400 relative z-10">
                <Icon icon="ri:checkbox-circle-fill" className="w-10 h-10 animate-bounce" />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight relative z-10">Payment Successful!</h2>
              <p className="text-emerald-400/80 text-[10px] font-bold uppercase tracking-widest mt-1.5 relative z-10 flex items-center justify-center gap-1">
                <span>Secured via Remita</span>
              </p>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-zinc-400 text-sm leading-relaxed text-center">
                Thank you! Your school subscription has been activated successfully and all premium CBT features have been unlocked.
              </p>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-500">Plan Activated</span>
                  <span className="text-white font-bold capitalize">{user?.subscription?.plan || "Starter"} Plan</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-500">Status</span>
                  <span className="text-emerald-400 font-bold">Active</span>
                </div>
                {user?.subscription?.expires_at && (
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-500">Billing Renewal</span>
                    <span className="text-white font-bold">
                      {new Date(user.subscription.expires_at).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                )}
              </div>
              <Button onClick={() => setShowPaymentSuccess(false)} className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 mt-2 cursor-pointer">
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
