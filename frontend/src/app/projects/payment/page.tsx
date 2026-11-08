"use client";

import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings, 
  User, Calendar, Clock, CheckCircle2, Sparkles, Loader2, AlertCircle, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { paymentsApi, aiApi, authApi } from "@/lib/api";

export default function ProjectPayment() {
  const router = useRouter();
  const [projectTitle, setProjectTitle] = useState("React Dashboard for College Project");
  const [freelancerName, setFreelancerName] = useState("Rahul Kumar");
  const [amount, setAmount] = useState(3500);
  const [deadline, setDeadline] = useState("Oct 10, 2026");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // AI Risk State
  const [riskScore, setRiskScore] = useState(8);
  const [riskLevel, setRiskLevel] = useState("LOW RISK");
  const [riskFactors, setRiskFactors] = useState<string[]>([
    "Freelancer profile established",
    "Project requirements clear",
    "Amount within expected range",
    "Deliverables defined",
    "No suspicious activity detected"
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (typeof window !== "undefined") {
      const storedFreelancer = sessionStorage.getItem("paypilot_selected_freelancer");
      const storedProj = sessionStorage.getItem("paypilot_confirmed_project");

      if (storedFreelancer) {
        try {
          const f = JSON.parse(storedFreelancer);
          if (f.name) setFreelancerName(f.name);
          if (f.starting_rate) setAmount(f.starting_rate);
        } catch (e) {
          console.error(e);
        }
      }

      if (storedProj) {
        try {
          const p = JSON.parse(storedProj);
          if (p.title) setProjectTitle(p.title);
          if (p.deadline) setDeadline(p.deadline);
          if (p.budget) {
            const parsedBudget = parseInt(p.budget.replace(/[^\d]/g, ""));
            if (parsedBudget) setAmount(parsedBudget);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    async function loadRiskAssessment() {
      setIsAiLoading(true);
      try {
        const risk = await aiApi.assessRisk({
          amount: amount,
          currency: "INR",
          client_id: 1,
          freelancer_id: 2,
        });

        if (isMounted) {
          if (risk.risk_score !== undefined) setRiskScore(risk.risk_score);
          if (risk.risk_level) setRiskLevel(risk.risk_level.toUpperCase() + " RISK");
          if (Array.isArray(risk.risk_factors) && risk.risk_factors.length > 0) {
            setRiskFactors(risk.risk_factors);
          }
        }
      } catch (err) {
        console.warn("Using default risk assessment data", err);
      } finally {
        if (isMounted) setIsAiLoading(false);
      }
    }

    loadRiskAssessment();
    return () => { isMounted = false; };
  }, [amount]);

  const handleCaptureSuccess = (transactionData: any) => {
    setSuccessMsg("Payment successfully processed and verified on server!");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("paypilot_last_transaction", JSON.stringify(transactionData));
    }
    setTimeout(() => {
      router.push("/transactions");
    }, 1200);
  };

  const handleDirectSandboxCapture = async () => {
    setIsProcessing(true);
    setErrorMsg("");
    try {
      if (typeof window !== "undefined" && !localStorage.getItem("paypilot_token")) {
        await authApi.loginAsDemoClient();
      }

      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      // Create Order
      const order = await paymentsApi.createOrder({
        amount: amount,
        currency: "USD",
        idempotency_key: idempotencyKey,
      });

      // Capture Order via server
      const captureResult = await paymentsApi.captureOrder(order.paypal_order_id);
      handleCaptureSuccess(captureResult);
    } catch (err: any) {
      console.error("Payment error:", err);
      setErrorMsg(err.response?.data?.detail || "Payment authorization failed. Please check PayPal credentials.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#0B1120] text-slate-300 flex flex-col h-screen sticky top-0 shrink-0">
        <Link href="/" className="p-6 flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">PayPilot</span>
        </Link>

        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard/client" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-900/20">
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/projects/new" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            <span className="font-medium">Create Project</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Folder className="w-5 h-5" />
            <span className="font-medium">My Projects</span>
          </Link>
          <Link href="/projects/matching" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Find Freelancers</span>
          </Link>
          <Link href="/transactions" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">Transactions</span>
          </Link>
          <Link href="/messages" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors relative">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Messages</span>
          </Link>
          <Link href="/ai" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Bot className="w-5 h-5" />
            <span className="font-medium">AI Assistant</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors mt-4">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 max-w-[1400px]">
        
        {/* Header */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {projectTitle}
            </h1>
            <span className="px-3 py-1 bg-[#FEF3C7] text-[#D97706] text-[13px] font-bold rounded-full">
              Awaiting Payment
            </span>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200">
            <button className="px-6 py-3 font-medium text-slate-500 hover:text-slate-700">Overview</button>
            <button className="px-6 py-3 font-medium text-slate-500 hover:text-slate-700">AI Analysis</button>
            <button className="px-6 py-3 font-medium text-slate-500 hover:text-slate-700">Freelancer</button>
            <button className="px-6 py-3 font-bold text-blue-600 border-b-2 border-blue-600">Payment</button>
            <button className="px-6 py-3 font-medium text-slate-500 hover:text-slate-700">Timeline</button>
            <button className="px-6 py-3 font-medium text-slate-500 hover:text-slate-700">Messages</button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Card 1: Project Details */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Project Details</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3 text-slate-500">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Client</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-pink-100 rounded-full overflow-hidden flex items-center justify-center">
                    <img src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=fbcfe8&color=9d174d" alt="Sarah" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-semibold text-slate-900">Sarah Johnson</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3 text-slate-500">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Freelancer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full overflow-hidden flex items-center justify-center">
                    <img src="https://ui-avatars.com/api/?name=Rahul+Kumar&background=dbeafe&color=1e40af" alt="Rahul" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-semibold text-slate-900">{freelancerName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-5 h-5 rounded border border-slate-400 flex items-center justify-center text-[10px] font-bold">₹</div>
                  <span className="font-medium">Amount</span>
                </div>
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <span className="text-blue-600 font-bold">₹</span> ₹{amount.toLocaleString()}
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3 text-slate-500">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Deadline</span>
                </div>
                <div className="flex items-center gap-2 text-slate-900 font-semibold">
                  <Calendar className="w-4 h-4 text-blue-600" /> {deadline}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Status</span>
                </div>
                <div className="px-3 py-1 bg-[#FEF3C7] text-[#D97706] text-xs font-bold rounded-full">
                  Payment Pending
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Payment Confirmation */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Confirmation</h2>
            <p className="text-slate-500 text-[14.5px] font-medium mb-6">
              You're about to pay for this project through PayPal Sandbox.
            </p>

            {/* PayPal Banner */}
            <div className="bg-[#F0F5FF] rounded-xl p-4 flex items-center justify-between mb-8 border border-blue-100">
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold text-[#003087] tracking-tight italic">PayPal</span>
              </div>
              <div className="border-l border-blue-200 pl-4 text-[#1E3A8A] text-sm font-semibold tracking-wide">
                Sandbox Mode
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium text-sm">Freelancer</span>
                <span className="text-slate-900 font-semibold text-sm text-right">{freelancerName}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium text-sm">Project</span>
                <span className="text-slate-900 font-semibold text-sm text-right max-w-[180px]">{projectTitle}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium text-sm">Amount</span>
                <span className="text-slate-900 font-semibold text-sm text-right">₹{amount.toLocaleString()} INR</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium text-sm">PayPal Environment</span>
                <span className="text-slate-900 font-semibold text-sm text-right">Sandbox</span>
              </div>
            </div>

            <div className="w-full mt-6 mb-4">
              <PayPalScriptProvider options={{ clientId: "test", currency: "USD", intent: "capture" }}>
                <PayPalButtons 
                  style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }} 
                  createOrder={async () => {
                    try {
                      if (!localStorage.getItem("paypilot_token")) {
                        await authApi.loginAsDemoClient();
                      }
                      const idemp = `pay_${Date.now()}_${Math.random().toString(36).substring(7)}`;
                      const res = await paymentsApi.createOrder({
                        amount: amount,
                        currency: "USD",
                        idempotency_key: idemp,
                      });
                      return res.paypal_order_id;
                    } catch (err: any) {
                      console.error("Order create error", err);
                      setErrorMsg(err.response?.data?.detail || "Order creation failed.");
                      throw err;
                    }
                  }}
                  onApprove={async (data) => {
                    try {
                      setIsProcessing(true);
                      const res = await paymentsApi.captureOrder(data.orderID);
                      handleCaptureSuccess(res);
                    } catch (err: any) {
                      setErrorMsg(err.response?.data?.detail || "Server payment capture failed.");
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                  onError={(err) => {
                    console.error("PayPal Error:", err);
                    setErrorMsg("PayPal checkout modal encountered an error.");
                  }}
                />
              </PayPalScriptProvider>
            </div>

            {/* Direct Sandbox Capture button for seamless testing */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDirectSandboxCapture}
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying & Capturing...</>
                ) : (
                  <><ShieldCheck className="w-4 h-4 text-emerald-400" /> One-Click Sandbox Capture & Verify</>
                )}
              </button>
            </div>

            <p className="text-center text-slate-400 text-xs font-medium mt-3">
              Server-side verified capture. Client secret is securely kept exclusively on the backend.
            </p>
          </div>

          {/* Card 3: PayPilot AI */}
          <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3B28CC] flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-[1.35rem] font-bold text-slate-900 tracking-tight">PayPilot AI</h2>
              </div>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                Advisory Only
              </span>
            </div>

            <div className="p-6">
              <div className="border border-slate-200 rounded-2xl p-6 bg-white relative">
                <h3 className="font-bold text-slate-900 mb-6 text-lg">Transaction Risk Assessment</h3>
                
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-slate-500 font-medium text-sm mb-1">Risk Score</div>
                    <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                      {riskScore} <span className="text-2xl text-slate-400 font-bold">/ 100</span>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 bg-[#D1FAE5] text-[#047857] font-bold text-sm rounded-full shadow-sm">
                    {riskLevel}
                  </div>
                </div>

                <div className="space-y-4">
                  {riskFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 font-medium text-[14.5px] leading-tight">{factor}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                  Notice: AI assessment is strictly advisory. AI cannot authorize disbursements or bypass human confirmation.
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
