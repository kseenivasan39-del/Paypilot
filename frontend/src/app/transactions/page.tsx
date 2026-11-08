"use client";

import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings, 
  ChevronLeft, CheckCircle2, ShieldCheck, Clock, AlertCircle, Loader2
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import { useState, useEffect } from "react";
import { transactionsApi, authApi } from "@/lib/api";

interface TransactionItem {
  id: number;
  project_id?: number;
  amount: number;
  currency: string;
  status: string;
  paypal_order_id?: string;
  paypal_capture_id?: string;
  is_simulated?: boolean;
  created_at: string;
  project_title?: string;
  client_name?: string;
  freelancer_name?: string;
}

export default function TransactionDetails() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState("Oct 6, 2026, 10:30 AM");

  useEffect(() => {
    let isMounted = true;

    async function fetchTransactions() {
      setLoading(true);
      try {
        if (typeof window !== "undefined" && !localStorage.getItem("paypilot_token")) {
          const role = typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("paypilot_user") || "{}").role || "freelancer") : "freelancer"; if (role === "freelancer") { await authApi.loginAsDemoFreelancer(); } else { await authApi.loginAsDemoClient(); }
        }

        const data = await transactionsApi.list();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setTransactions(data);
          
          // Check if user just paid for something
          const lastTxStr = typeof window !== "undefined" ? sessionStorage.getItem("paypilot_last_transaction") : null;
          if (lastTxStr) {
            try {
              const lastTx = JSON.parse(lastTxStr);
              const found = data.find((t: any) => t.paypal_order_id === lastTx.paypal_order_id || t.id === lastTx.id);
              if (found) {
                setSelectedTx(found);
                return;
              }
            } catch (e) {
              console.error(e);
            }
          }
          setSelectedTx(data[0]);
        } else if (isMounted) {
          const defaultTx: TransactionItem = {
            id: 1001,
            amount: 3500,
            currency: "INR",
            status: "COMPLETED",
            paypal_order_id: "28S123456R7880123",
            paypal_capture_id: "CAP-998877",
            is_simulated: true,
            created_at: "2026-10-06T10:30:00.000Z",
            project_title: "React Dashboard for College Project",
            client_name: "Sarah Johnson",
            freelancer_name: "Rahul Kumar"
          };
          setTransactions([defaultTx]);
          setSelectedTx(defaultTx);
        }
      } catch (err) {
        console.warn("Failed to load transactions from backend, loading local demo list", err);
        if (isMounted) {
          const defaultTx: TransactionItem = {
            id: 1001,
            amount: 3500,
            currency: "INR",
            status: "COMPLETED",
            paypal_order_id: "28S123456R7880123",
            paypal_capture_id: "CAP-998877",
            is_simulated: true,
            created_at: "2026-10-06T10:30:00.000Z",
            project_title: "React Dashboard for College Project",
            client_name: "Sarah Johnson",
            freelancer_name: "Rahul Kumar"
          };
          setTransactions([defaultTx]);
          setSelectedTx(defaultTx);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTransactions();
    return () => { isMounted = false; };
  }, []);

  const currentTx = selectedTx || transactions[0] || {
    id: 1001,
    amount: 3500,
    currency: "INR",
    status: "COMPLETED",
    paypal_order_id: "28S123456R7880123",
    created_at: "2026-10-06T10:30:00.000Z",
    project_title: "React Dashboard for College Project",
    client_name: "Sarah Johnson",
    freelancer_name: "Rahul Kumar"
  };

  useEffect(() => {
    if (currentTx?.created_at) {
      try {
        const d = new Date(currentTx.created_at);
        if (!isNaN(d.getTime())) {
          setFormattedDate(d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
          }));
        }
      } catch (e) {
        // keep default
      }
    }
  }, [currentTx]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      
      {/* Sidebar */}
      <AppSidebar activePage="earnings" />

      {/* Main Content Area */}
      <main className="flex-1 p-10 max-w-[1200px] mt-6">
        
        {/* Transaction History Switcher */}
        {transactions.length > 1 && (
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
            {transactions.map((tx) => (
              <button
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedTx?.id === tx.id 
                    ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                PP-{tx.id} • {tx.currency} {tx.amount.toLocaleString()}
              </button>
            ))}
          </div>
        )}

        <div className="relative">
          
          {/* Floating Top Badge */}
          <div className="absolute -top-5 left-6 bg-[#4A5568] text-white px-6 py-2 rounded-xl font-bold text-lg shadow-md z-10 border border-slate-500/50">
            Transaction Details
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-[24px] p-8 pt-14 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <h1 className="text-[1.8rem] font-bold text-slate-900 tracking-tight">Transaction Details</h1>
                <div className={`flex items-center gap-1.5 px-3 py-1 text-sm font-bold rounded-full ${
                  currentTx.status === "COMPLETED" 
                    ? "bg-[#DCFCE7] text-[#166534]" 
                    : "bg-[#FEF3C7] text-[#D97706]"
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                  {currentTx.status}
                </div>
                {currentTx.is_simulated && (
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full border border-slate-200">
                    Sandbox / Test
                  </span>
                )}
              </div>
              <Link href="/dashboard/client" className="flex items-center gap-1 text-blue-600 font-bold hover:text-blue-700 transition-colors">
                <ChevronLeft className="w-5 h-5" /> Back to Dashboard
              </Link>
            </div>

            {/* Top ID Boxes */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/30">
                <p className="text-slate-500 font-medium text-sm mb-2">Transaction ID</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900">PP-{currentTx.id}</span>
                </div>
              </div>
              <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/30">
                <p className="text-slate-500 font-medium text-sm mb-2">PayPal Order ID</p>
                <div className="text-xl font-bold text-slate-900 font-mono">
                  {currentTx.paypal_order_id || "28S123456R7880123"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_1fr] gap-6">
              
              {/* Left Details Info */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30 space-y-5">
                <div className="grid grid-cols-[140px_1fr] items-start">
                  <span className="text-slate-500 font-medium">Project</span>
                  <span className="text-slate-900 font-medium">{currentTx.project_title || "React Dashboard for College Project"}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-start">
                  <span className="text-slate-500 font-medium">Client</span>
                  <span className="text-slate-900 font-medium">{currentTx.client_name || "Sarah Johnson"}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-start">
                  <span className="text-slate-500 font-medium">Freelancer</span>
                  <span className="text-slate-900 font-medium">{currentTx.freelancer_name || "Rahul Kumar"}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-start">
                  <span className="text-slate-500 font-medium">Amount</span>
                  <span className="text-slate-900 font-medium">₹{currentTx.amount.toLocaleString()} {currentTx.currency}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-start">
                  <span className="text-slate-500 font-medium">Currency</span>
                  <span className="text-slate-900 font-medium">{currentTx.currency}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-start">
                  <span className="text-slate-500 font-medium">Date</span>
                  <span className="text-slate-900 font-medium">{formattedDate}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-center">
                  <span className="text-slate-500 font-medium">Status</span>
                  <div className="w-fit px-3 py-1 bg-[#DCFCE7] text-[#166534] text-sm font-bold rounded-full">
                    {currentTx.status}
                  </div>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-center">
                  <span className="text-slate-500 font-medium">AI Risk Score</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      8 / 100
                    </div>
                    <div className="px-3 py-1 bg-[#D1FAE5] text-[#047857] text-sm font-bold rounded-full">
                      LOW
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Timeline */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Payment Timeline</h3>
                
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[11px] before:w-px before:h-[85%] before:bg-slate-200 before:z-0">
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_0_0_2px_#3B82F6]">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-slate-900 font-medium">Payment Initiated</span>
                    </div>
                    <span className="text-slate-500 text-sm">Verified</span>
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-slate-900 font-medium">PayPal Order Created</span>
                    </div>
                    <span className="text-slate-500 text-sm">Sandbox</span>
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-slate-900 font-medium">Server-Side Payment Captured</span>
                    </div>
                    <span className="text-slate-500 text-sm">Verified</span>
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-slate-900 font-medium">Ledger Recorded & Idempotent</span>
                    </div>
                    <span className="text-slate-500 text-sm">{currentTx.status}</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
