"use client";

import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings, 
  ChevronLeft, CheckCircle2, ShieldCheck, Clock, AlertCircle, Loader2,
  FileText, Download, Printer
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import TaxInvoiceModal, { InvoiceData } from "@/components/TaxInvoiceModal";
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

  // Tax Invoice modal
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceData | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTransactions() {
      setLoading(true);
      try {
        if (typeof window !== "undefined" && !localStorage.getItem("paypilot_token")) {
          const role = typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("paypilot_user") || "{}").role || "client") : "client"; 
          if (role === "freelancer") { 
            await authApi.loginAsDemoFreelancer(); 
          } else { 
            await authApi.loginAsDemoClient(); 
          }
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

    return () => {
      isMounted = false;
    };
  }, []);

  const currentTx = selectedTx || {
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

  const handleOpenTaxInvoice = () => {
    const inv: InvoiceData = {
      invoiceNumber: `INV-2026-${currentTx.id}`,
      orderId: currentTx.paypal_order_id || "28S123456R7880123",
      captureId: currentTx.paypal_capture_id || "CAP-998877",
      date: formattedDate.split(",")[0] || "Oct 6, 2026",
      clientName: currentTx.client_name || "Sarah Johnson",
      clientCompany: "TechCorp Labs",
      clientEmail: "client@paypilot.demo",
      freelancerName: currentTx.freelancer_name || "Rahul Kumar",
      freelancerTitle: "Full Stack Engineer & Consultant",
      freelancerEmail: "freelancer@paypilot.demo",
      projectTitle: currentTx.project_title || "React Dashboard for College Project",
      milestoneTitle: "Milestone Deliverable Sign-off",
      amount: currentTx.amount,
      currency: currentTx.currency,
      platformFee: 0,
      taxAmount: Math.round(currentTx.amount * 0.18),
      taxRatePercent: 18,
      netTotal: currentTx.amount + Math.round(currentTx.amount * 0.18),
      paymentMethod: "PayPal Smart Escrow Capture",
      status: "PAID",
      aiVerificationScore: 96
    };
    setActiveInvoice(inv);
    setShowTaxModal(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <AppSidebar activePage="earnings" />

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-[1600px]">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between gap-2 text-sm text-slate-500 mb-8">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/client" className="hover:text-blue-600 transition-colors">Client Portal</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Transaction Records</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenTaxInvoice}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Download Official Tax Invoice (PDF)</span>
            </button>
          </div>
        </div>

        {/* Transactions List & Main Card */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          
          {/* History Sidebar */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Escrows</h3>
            {loading ? (
              <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Loading records...
              </div>
            ) : (
              transactions.map((tx) => (
                <div 
                  key={tx.id} 
                  onClick={() => setSelectedTx(tx)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    currentTx.id === tx.id 
                      ? "bg-blue-50/50 border-blue-500 shadow-sm" 
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-slate-900 text-sm">₹{tx.amount.toLocaleString()}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium truncate mb-2">{tx.project_title || "Project Milestone"}</p>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>PP-{tx.id}</span>
                    <span>{tx.paypal_order_id ? tx.paypal_order_id.slice(-8) : "28S12345"}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Transaction Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
            
            {/* Top Bar inside Card */}
            <div className="flex justify-between items-center pb-6 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900">Transaction Details</h1>
                {currentTx.is_simulated && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
                    Simulated Sandbox
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenTaxInvoice}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>1-Click Tax Invoice</span>
                </button>
                <Link href="/dashboard/client" className="flex items-center gap-1 text-slate-500 font-bold text-xs hover:text-slate-700 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Details Info */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30 space-y-4 text-sm">
                <div className="grid grid-cols-[140px_1fr] items-start">
                  <span className="text-slate-500 font-medium">Project</span>
                  <span className="text-slate-900 font-bold">{currentTx.project_title || "React Dashboard for College Project"}</span>
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
                  <span className="text-slate-900 font-black text-base text-blue-600">₹{currentTx.amount.toLocaleString()} {currentTx.currency}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-start">
                  <span className="text-slate-500 font-medium">Date</span>
                  <span className="text-slate-900 font-medium">{formattedDate}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-center">
                  <span className="text-slate-500 font-medium">Status</span>
                  <div className="w-fit px-3 py-1 bg-[#DCFCE7] text-[#166534] text-xs font-bold rounded-full">
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
                    <div className="px-3 py-0.5 bg-[#D1FAE5] text-[#047857] text-xs font-bold rounded-full">
                      LOW RISK
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Timeline */}
              <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/30">
                <h3 className="text-base font-bold text-slate-900 mb-6">Escrow Settlement Timeline</h3>
                
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[11px] before:w-px before:h-[85%] before:bg-slate-200 before:z-0 text-xs">
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-[0_0_0_2px_#3B82F6]">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-slate-900 font-medium">Payment Initiated</span>
                    </div>
                    <span className="text-slate-500">Verified</span>
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-slate-900 font-medium">PayPal Order Created</span>
                    </div>
                    <span className="text-slate-500">Sandbox</span>
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-slate-900 font-medium">Server-Side Payment Captured</span>
                    </div>
                    <span className="text-slate-500">Verified</span>
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-slate-900 font-medium">Ledger Recorded & Idempotent</span>
                    </div>
                    <span className="text-slate-500">{currentTx.status}</span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Global PDF Tax Invoice Modal */}
        <TaxInvoiceModal
          isOpen={showTaxModal}
          invoice={activeInvoice}
          onClose={() => setShowTaxModal(false)}
        />
      </main>
    </div>
  );
}
