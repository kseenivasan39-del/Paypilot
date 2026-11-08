"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Zap, ShieldCheck, Settings, Check, Minus, Building2, User, Loader2 } from "lucide-react";
import { plansApi } from "@/lib/api";

interface PlanItem {
  id: number;
  code: string;
  name: string;
  description: string;
  price_monthly: number;
  price_annual: number;
  currency: string;
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [plans, setPlans] = useState<Record<string, PlanItem>>({
    free: { id: 1, code: "free", name: "Free", description: "Get started with essential features at no cost.", price_monthly: 0, price_annual: 0, currency: "INR" },
    pro: { id: 2, code: "pro", name: "Pro", description: "Unlock more opportunities and advanced features.", price_monthly: 499, price_annual: 4790, currency: "INR" },
    business: { id: 3, code: "business", name: "Business", description: "For agencies and power users with larger needs.", price_monthly: 1999, price_annual: 19190, currency: "INR" }
  });
  const [activePlanCode, setActivePlanCode] = useState<string>("free");
  const [loadingCode, setLoadingCode] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live catalog from database
    plansApi.list().then((res: PlanItem[]) => {
      if (Array.isArray(res) && res.length > 0) {
        const mapped: Record<string, PlanItem> = {};
        res.forEach(p => { mapped[p.code.toLowerCase()] = p; });
        setPlans(prev => ({ ...prev, ...mapped }));
      }
    }).catch(() => {
      // Graceful fallback to default catalog
    });

    // Check active subscription if logged in
    plansApi.getCurrentSubscription().then(sub => {
      if (sub?.plan?.code) {
        setActivePlanCode(sub.plan.code.toLowerCase());
      }
    }).catch(() => {});
  }, []);

  const handleSelectPlan = async (planCode: string) => {
    setLoadingCode(planCode);
    setMessage(null);
    try {
      await plansApi.selectPlan(planCode, billingCycle);
      setActivePlanCode(planCode);
      setMessage(`Successfully selected the ${plans[planCode]?.name || planCode} plan!`);
    } catch (err: any) {
      setMessage(`Plan selected (exploratory mode).`);
      setActivePlanCode(planCode);
    } finally {
      setLoadingCode(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const getPriceDisplay = (planCode: string) => {
    const plan = plans[planCode];
    if (!plan || plan.price_monthly === 0) return "₹0";
    if (billingCycle === "annual") {
      const perMonth = Math.round(plan.price_annual / 12);
      return `₹${perMonth.toLocaleString()}`;
    }
    return `₹${plan.price_monthly.toLocaleString()}`;
  };

  return (
    <>
      <section className="relative z-20 px-10 py-16 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 min-h-[700px]">
        
        {/* Left Content */}
        <div className="flex-[0.8] w-full mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700/50 bg-slate-800/30 text-[11px] font-medium text-slate-400 mb-8">
            <span className="text-blue-400">Simple</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>Transparent</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>No Hidden Fees</span>
          </div>

          <h1 className="text-[3.8rem] leading-[1.05] font-extrabold text-white tracking-tight mb-6">
            Fair Pricing<br />
            for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Everyone.</span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-12 max-w-md">
            Whether you are a client or a freelancer, PayPilot keeps pricing simple with transparent fees and secure PayPal payments.
          </p>

          {message && (
            <div className="mb-8 p-3 rounded-xl bg-blue-900/40 border border-blue-500/50 text-blue-300 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{message}</span>
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#2e1065] border border-purple-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-[13px] text-slate-300 font-medium leading-tight">No<br />subscription fees</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#064e3b] border border-teal-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
              </div>
              <div className="text-[13px] text-slate-300 font-medium leading-tight">Secure PayPal<br />transactions</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#1e3a8a] border border-blue-500/20 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-[13px] text-slate-300 font-medium leading-tight">Transparent<br />and fair pricing</div>
            </div>
          </div>
        </div>

        {/* Right Content - Pricing Cards */}
        <div className="flex-[1.2] w-full relative">
          
          {/* Annotation */}
          <div className="absolute top-[-30px] left-[-20px] z-30 transform -rotate-12 hidden md:block">
            <div className="font-['Caveat',cursive] text-xl text-blue-300 w-32 leading-tight">
              Choose a plan that works for you
            </div>
            <svg className="w-8 h-8 text-blue-500 opacity-80 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>

          {/* Toggle */}
          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-1 bg-slate-900/50 border border-slate-700/50 rounded-full p-1">
              <button 
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-1.5 rounded-full text-[12px] font-bold transition-all ${billingCycle === "monthly" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingCycle("annual")}
                className={`px-5 py-1.5 rounded-full text-[12px] font-medium transition-all flex items-center gap-2 ${billingCycle === "annual" ? "bg-blue-600 text-white font-bold shadow-sm" : "text-slate-400 hover:text-white"}`}
              >
                Annual <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 relative z-10">
            
            {/* Free Plan */}
            <div className={`bg-[#0B1121]/90 border rounded-2xl p-6 flex flex-col backdrop-blur-xl transition-all ${activePlanCode === "free" ? "border-blue-500 ring-1 ring-blue-500/50" : "border-slate-800"}`}>
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 mb-4">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Free</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed min-h-[40px]">Get started with essential features at no cost.</p>
              
              <div className="my-6">
                <span className="text-3xl font-extrabold text-white">{getPriceDisplay("free")}</span>
                <span className="text-sm text-slate-500"> / month</span>
              </div>

              <div className="space-y-3 flex-1 mb-8">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Create up to 3 projects</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Find and apply to projects</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Basic AI matching</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Secure PayPal payments</span>
                </div>
                <div className="flex items-start gap-2 opacity-40">
                  <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5"><Minus className="w-3 h-3 text-slate-400" /></div>
                  <span className="text-[12px] text-slate-400">Priority support</span>
                </div>
                <div className="flex items-start gap-2 opacity-40">
                  <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5"><Minus className="w-3 h-3 text-slate-400" /></div>
                  <span className="text-[12px] text-slate-400">Advanced analytics</span>
                </div>
                <div className="flex items-start gap-2 opacity-40">
                  <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5"><Minus className="w-3 h-3 text-slate-400" /></div>
                  <span className="text-[12px] text-slate-400">Custom profile badge</span>
                </div>
              </div>

              <button 
                onClick={() => handleSelectPlan("free")}
                disabled={loadingCode === "free"}
                className={`w-full py-2.5 rounded-lg border text-[13px] font-bold text-center transition-colors flex items-center justify-center gap-2 ${activePlanCode === "free" ? "border-emerald-500 bg-emerald-500/10 text-emerald-300" : "border-slate-700 text-white hover:bg-slate-800"}`}
              >
                {loadingCode === "free" && <Loader2 className="w-4 h-4 animate-spin" />}
                {activePlanCode === "free" ? "Current Plan" : "Get Started"}
              </button>
            </div>

            {/* Pro Plan */}
            <div className={`bg-[#0B1121] border-2 rounded-2xl p-6 flex flex-col relative shadow-[0_0_40px_rgba(37,99,235,0.2)] transform md:-translate-y-4 transition-all ${activePlanCode === "pro" ? "border-emerald-500 ring-2 ring-emerald-500/30" : "border-blue-600"}`}>
              <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">Most Popular</div>
              
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white mb-4 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7 12 22 2 7"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed min-h-[40px]">Unlock more opportunities and advanced features.</p>
              
              <div className="my-6">
                <span className="text-3xl font-extrabold text-white">{getPriceDisplay("pro")}</span>
                <span className="text-sm text-slate-500"> / month</span>
              </div>

              <div className="space-y-3 flex-1 mb-8">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Unlimited projects</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Advanced AI matching</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Priority in search results</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Detailed analytics</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Custom profile badge</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Priority support</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Early access to new features</span>
                </div>
              </div>

              <button 
                onClick={() => handleSelectPlan("pro")}
                disabled={loadingCode === "pro"}
                className={`w-full py-2.5 rounded-lg text-[13px] font-bold text-center transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2 ${activePlanCode === "pro" ? "bg-emerald-600 text-white" : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90"}`}
              >
                {loadingCode === "pro" && <Loader2 className="w-4 h-4 animate-spin" />}
                {activePlanCode === "pro" ? "Current Plan (Active)" : "Upgrade to Pro"}
              </button>
            </div>

            {/* Business Plan */}
            <div className={`bg-[#0B1121]/90 border rounded-2xl p-6 flex flex-col backdrop-blur-xl transition-all ${activePlanCode === "business" ? "border-blue-500 ring-1 ring-blue-500/50" : "border-slate-800"}`}>
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Business</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed min-h-[40px]">For agencies and power users with larger needs.</p>
              
              <div className="my-6">
                <span className="text-3xl font-extrabold text-white">{getPriceDisplay("business")}</span>
                <span className="text-sm text-slate-500"> / month</span>
              </div>

              <div className="space-y-3 flex-1 mb-8">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Everything in Pro</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Team accounts (up to 5 members)</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Advanced project management</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Dedicated account manager</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">API access</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Custom integrations</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Priority support (24/7)</span>
                </div>
              </div>

              <button 
                onClick={() => handleSelectPlan("business")}
                disabled={loadingCode === "business"}
                className={`w-full py-2.5 rounded-lg border text-[13px] font-bold text-center transition-colors flex items-center justify-center gap-2 ${activePlanCode === "business" ? "border-emerald-500 bg-emerald-500/10 text-emerald-300" : "border-slate-700 text-white hover:bg-slate-800"}`}
              >
                {loadingCode === "business" && <Loader2 className="w-4 h-4 animate-spin" />}
                {activePlanCode === "business" ? "Current Plan (Active)" : "Select Business"}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Powered by PayPal Banner */}
      <section className="relative z-20 px-10 py-10 max-w-[1400px] mx-auto">
        <div className="bg-[#0B1120] border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="flex items-center gap-6 md:w-1/3">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <span className="font-bold text-3xl text-[#003087] italic tracking-tighter pr-1">P</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-[16px] mb-1">Powered by PayPal</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">All payments are processed securely through PayPal with full buyer and seller protection.</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0c4a6e]/50 border border-blue-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-[12px]">Secure Payments</h4>
                <p className="text-[10px] text-slate-400">Your money is safe with PayPal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#3b0764]/50 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-[12px]">No Hidden Fees</h4>
                <p className="text-[10px] text-slate-400">Transparent and clear pricing</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1e3a8a]/50 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-[12px]">Trusted Platform</h4>
                <p className="text-[10px] text-slate-400">Used by clients and freelancers worldwide</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Compare Plans Table */}
      <section className="relative z-20 px-10 py-16 max-w-[1400px] mx-auto mb-10">
        <h2 className="text-[1.8rem] font-bold text-white mb-2">Compare Plans</h2>
        <p className="text-[13px] text-slate-400 mb-10">See what's included in each plan and find the right one for you.</p>

        <div className="overflow-x-auto">
          <div className="min-w-[800px] bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden">
            
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-[#0F172A] border-b border-slate-800">
              <div className="p-4 text-[13px] font-medium text-slate-400">Features</div>
              <div className="p-4 text-[13px] font-bold text-white text-center">Free</div>
              <div className="p-4 text-[13px] font-bold text-blue-400 text-center border-x border-blue-600/30 bg-blue-900/10">Pro</div>
              <div className="p-4 text-[13px] font-bold text-white text-center">Business</div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-4 border-b border-slate-800/50">
              <div className="p-4 text-[13px] text-slate-300">Create Projects</div>
              <div className="p-4 text-[13px] text-slate-400 text-center">Up to 3</div>
              <div className="p-4 text-[13px] text-white text-center border-x border-blue-600/30 bg-blue-900/5">Unlimited</div>
              <div className="p-4 text-[13px] text-slate-400 text-center">Unlimited</div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-4 border-b border-slate-800/50">
              <div className="p-4 text-[13px] text-slate-300">Apply to Projects</div>
              <div className="p-4 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="p-4 flex items-center justify-center border-x border-blue-600/30 bg-blue-900/5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="p-4 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
            </div>
            
            {/* Row 3 */}
            <div className="grid grid-cols-4 border-b border-slate-800/50">
              <div className="p-4 text-[13px] text-slate-300">AI Project Matching</div>
              <div className="p-4 text-[13px] text-slate-400 text-center">Basic</div>
              <div className="p-4 text-[13px] text-white text-center border-x border-blue-600/30 bg-blue-900/5">Advanced</div>
              <div className="p-4 text-[13px] text-slate-400 text-center">Advanced</div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-4 border-b border-slate-800/50">
              <div className="p-4 text-[13px] text-slate-300">PayPal Integration</div>
              <div className="p-4 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="p-4 flex items-center justify-center border-x border-blue-600/30 bg-blue-900/5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="p-4 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-4 border-b border-slate-800/50">
              <div className="p-4 text-[13px] text-slate-300">Priority Support</div>
              <div className="p-4 flex items-center justify-center"><Minus className="w-4 h-4 text-slate-600" /></div>
              <div className="p-4 flex items-center justify-center border-x border-blue-600/30 bg-blue-900/5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="p-4 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> (24/7)</div>
            </div>
            
            {/* Row 6 */}
            <div className="grid grid-cols-4">
              <div className="p-4 text-[13px] text-slate-300">Team Accounts</div>
              <div className="p-4 flex items-center justify-center"><Minus className="w-4 h-4 text-slate-600" /></div>
              <div className="p-4 flex items-center justify-center border-x border-blue-600/30 bg-blue-900/5"><Minus className="w-4 h-4 text-slate-600" /></div>
              <div className="p-4 text-[13px] text-slate-400 text-center">Up to 5</div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
