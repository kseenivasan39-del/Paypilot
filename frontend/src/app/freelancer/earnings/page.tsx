"use client";

import { useState, useRef, useEffect } from "react";
import { 
  DollarSign, Wallet, ArrowDownLeft, ShieldCheck, Download, 
  ExternalLink, CheckCircle2, Clock, AlertCircle, TrendingUp,
  Search, X, Check, FileText, ArrowRight, Printer, Sparkles,
  Lock, RefreshCw, ChevronDown, Building, Shield, ChevronRight
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

interface PayoutRecord {
  id: string;
  orderId: string;
  captureId: string;
  projectTitle: string;
  client: string;
  amount: number;
  currency: string;
  status: "PAID" | "IN_ESCROW" | "PROCESSING";
  date: string;
  payoutMethod: string;
  escrowReleaseExpected?: string;
  milestoneName: string;
}

export default function FreelancerEarningsPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "PAID" | "IN_ESCROW">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [availableBalance, setAvailableBalance] = useState(20000);
  const [heldInEscrow, setHeldInEscrow] = useState(8500);
  const [lifetimeEarnings, setLifetimeEarnings] = useState(28500);
  const [autoTransfer, setAutoTransfer] = useState(true);

  // Withdrawal modal state
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>("20000");
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Invoice modal state
  const [selectedInvoice, setSelectedInvoice] = useState<PayoutRecord | null>(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [payouts, setPayouts] = useState<PayoutRecord[]>([
    {
      id: "PAY-801",
      orderId: "28S123456R7880123",
      captureId: "CAP-99120412",
      projectTitle: "React Dashboard for College Project",
      client: "Sarah Johnson",
      amount: 3500,
      currency: "INR",
      status: "PAID",
      date: "Oct 6, 2026",
      payoutMethod: "PayPal Sandbox (rahul@paypilot.demo)",
      milestoneName: "Milestone 1: Project Setup & Tailwind Layout"
    },
    {
      id: "PAY-802",
      orderId: "14X998877A1234567",
      captureId: "ESC-88129401",
      projectTitle: "10-Page Technical Whitepaper on AI Agents",
      client: "FinTech Research Group",
      amount: 2000,
      currency: "INR",
      status: "IN_ESCROW",
      date: "Oct 8, 2026",
      payoutMethod: "PayPal Smart Escrow",
      escrowReleaseExpected: "Expected in 2 days (upon AI report sign-off)",
      milestoneName: "Deliverable 1: 10-Page Research Synthesis"
    },
    {
      id: "PAY-803",
      orderId: "99Z554433B4455667",
      captureId: "CAP-77341902",
      projectTitle: "Logo & Brand Kit Design for Startup",
      client: "Apex Digital",
      amount: 1500,
      currency: "INR",
      status: "PAID",
      date: "Sep 28, 2026",
      payoutMethod: "PayPal Sandbox (rahul@paypilot.demo)",
      milestoneName: "Milestone 1: Vector Assets & Typography Kit"
    },
    {
      id: "PAY-804",
      orderId: "77K112233C8899001",
      captureId: "ESC-55291033",
      projectTitle: "FastAPI REST Microservice & Postgres",
      client: "TechCorp Labs",
      amount: 5000,
      currency: "INR",
      status: "IN_ESCROW",
      date: "Oct 12, 2026",
      payoutMethod: "PayPal Smart Escrow",
      escrowReleaseExpected: "Expected in 10 days (upon Swagger tests)",
      milestoneName: "Milestone 1: Schema Migrations & JWT Auth"
    }
  ]);

  const filteredPayouts = payouts.filter((p) => {
    const matchesTab = activeTab === "ALL" || p.status === activeTab;
    const matchesQuery = 
      p.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const getTabCount = (tab: "ALL" | "PAID" | "IN_ESCROW") => {
    if (tab === "ALL") return payouts.length;
    return payouts.filter((p) => p.status === tab).length;
  };

  const handleWithdrawConfirm = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > availableBalance) {
      alert("Please enter a valid withdrawal amount within your available balance.");
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setAvailableBalance((prev) => prev - amt);
      
      const newRecord: PayoutRecord = {
        id: `PAY-${Math.floor(100 + Math.random() * 900)}`,
        orderId: `WDL-${Date.now().toString().slice(-8)}`,
        captureId: `CAP-${Math.floor(10000000 + Math.random() * 90000000)}`,
        projectTitle: "Instant Balance Withdrawal to PayPal",
        client: "PayPilot Automated Settlement",
        amount: amt,
        currency: "INR",
        status: "PAID",
        date: "Today, Just now",
        payoutMethod: "PayPal Sandbox (rahul@paypilot.demo)",
        milestoneName: "Direct Payout Transfer"
      };

      setPayouts((prev) => [newRecord, ...prev]);
      setIsWithdrawOpen(false);
      setToastMsg(`Successfully transferred ₹${amt.toLocaleString()} to your PayPal wallet!`);
      setTimeout(() => setToastMsg(null), 4000);
    }, 1200);
  };

  const handleExportCSV = () => {
    const headers = "Payout ID,Project,Client,Amount (INR),Status,Date,Order ID,Capture ID\n";
    const rows = payouts.map((p) => 
      `"${p.id}","${p.projectTitle}","${p.client}","${p.amount}","${p.status}","${p.date}","${p.orderId}","${p.captureId}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `paypilot-freelancer-payouts-${Date.now()}.csv`;
    a.click();
    setToastMsg("Exported CSV statement to downloads!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <AppSidebar activePage="earnings" />

      <main className="flex-1 p-8 max-w-[1400px]">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wider border border-blue-100">
                Freelancer Portal
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Finance, Invoices & Escrows</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Earnings & Payouts</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your instant PayPal payouts, active milestone releases, and tax-ready invoices.</p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Financial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card 1: Available Balance */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-6 shadow-xl shadow-blue-500/15 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Available Balance</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white">Ready to transfer</span>
              </div>
              <div className="text-4xl font-black mb-1 tracking-tight">₹{availableBalance.toLocaleString()}</div>
              <p className="text-xs text-blue-100/90 mb-6">Zero-fee instant withdrawal to connected PayPal sandbox account</p>
            </div>

            <button 
              type="button"
              onClick={() => {
                setWithdrawAmount(availableBalance.toString());
                setIsWithdrawOpen(true);
              }}
              className="w-full py-2.5 bg-white hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ArrowDownLeft className="w-4 h-4 text-blue-600" /> Withdraw via PayPal
            </button>
          </div>

          {/* Card 2: Held in PayPal Escrow */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Held in PayPal Escrow</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                  <Lock className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">₹{heldInEscrow.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mb-4">Secured by client deposits, releases automatically upon AI deliverable approval</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Next Release:</span>
                <span className="font-bold text-slate-800">₹2,000 in ~2 days</span>
              </div>
              <Link
                href="/freelancer/proposals"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between bg-blue-50/60 hover:bg-blue-50 px-3 py-2 rounded-xl transition-colors"
              >
                <span>Submit Deliverable to Release</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: Lifetime Earnings */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Lifetime Earnings</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">₹{lifetimeEarnings.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mb-4">From 12 successfully delivered freelance milestones & contracts</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 bg-emerald-50/70 border border-emerald-100 px-3 py-2 rounded-xl">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +12% increase vs last month
                </span>
                <span className="font-mono text-emerald-700 font-bold">100% on-time</span>
              </div>
            </div>
          </div>

        </div>

        {/* Connected PayPal Sandbox Account Banner */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-lg shrink-0">
              PP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Connected PayPal Payout Wallet</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified & Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                Account: <strong className="text-slate-800">rahul@paypilot.demo</strong> (Merchant Sandbox ID: <span className="text-slate-400">PAYPILOT_SBX_9918</span>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                checked={autoTransfer}
                onChange={(e) => setAutoTransfer(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              <span>Auto-transfer released milestones to PayPal</span>
            </label>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Download accounting statement"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
            </button>
          </div>
        </div>

        {/* Payout & Escrow History Table Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          
          {/* Table Header Controls */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Payout & Escrow History</h2>
              <p className="text-xs text-slate-400 mt-0.5">Automated settlement logs powered by PayPal REST Orders & Captures</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter records or ID..."
                  className="pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Status Tabs with Counters */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {(["ALL", "PAID", "IN_ESCROW"] as const).map((tab) => {
                  const count = getTabCount(tab);
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <span>{tab.replace("_", " ")}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                        isActive ? "bg-slate-100 font-extrabold text-slate-900" : "text-slate-400"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-6">Payout ID</th>
                  <th className="py-3 px-6">Project & Deliverable</th>
                  <th className="py-3 px-6">Destination</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                  <th className="py-3 px-6 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredPayouts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No payout records found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredPayouts.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-700">
                        {row.id}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setSelectedInvoice(row)}>
                          {row.projectTitle}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {row.milestoneName} • <span className="text-slate-600 font-medium">Client: {row.client}</span>
                        </p>
                        {row.escrowReleaseExpected && (
                          <p className="text-[10px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-500" /> {row.escrowReleaseExpected}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-mono text-[11px]">
                        {row.payoutMethod}
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        {row.date}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                          row.status === "PAID" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          row.status === "IN_ESCROW" 
                            ? "bg-blue-50 text-blue-700 border border-blue-200" 
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            row.status === "PAID" ? "bg-emerald-500" :
                            row.status === "IN_ESCROW" ? "bg-blue-500" : "bg-amber-500"
                          }`}></span>
                          {row.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-black text-slate-900 text-sm">
                        ₹{row.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedInvoice(row)}
                          className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Modal: Withdraw via PayPal */}
        {isWithdrawOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setIsWithdrawOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <ArrowDownLeft className="w-5 h-5" />
              </div>

              <h2 className="text-xl font-black text-slate-900 mb-1">
                Instant Transfer to PayPal
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                Funds are sent immediately to your verified sandbox wallet with $0 platform processing fee.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                    <span className="text-slate-700">Withdraw Amount (INR)</span>
                    <span className="text-slate-400">Available: ₹{availableBalance.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      max={availableBalance}
                      min={100}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-black text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-2 mt-2">
                    {[
                      { label: "₹3,000", val: 3000 },
                      { label: "₹5,000", val: 5000 },
                      { label: "₹10,000", val: 10000 },
                      { label: "Max (All)", val: availableBalance }
                    ].map((btn, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setWithdrawAmount(btn.val.toString())}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Destination</span>
                    <span className="font-mono font-bold text-slate-800">rahul@paypilot.demo</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>PayPilot Fee</span>
                    <span className="font-bold text-emerald-600">₹0 (Free Promo)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Arrival</span>
                    <span className="font-bold text-slate-800">Instant (&lt; 60 seconds)</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isWithdrawing}
                    onClick={handleWithdrawConfirm}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isWithdrawing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing Payout...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Transfer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Detailed Tax Invoice & Escrow Inspector */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {selectedInvoice.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Official Tax Settlement Receipt</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    PayPilot Milestone Payout
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-medium block">Date</span>
                  <span className="text-xs font-bold text-slate-800">{selectedInvoice.date}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contract Particulars</h4>
                  <p className="text-sm font-bold text-slate-900">{selectedInvoice.projectTitle}</p>
                  <p className="text-xs text-slate-600 mt-0.5">{selectedInvoice.milestoneName}</p>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex justify-between text-xs text-slate-600">
                    <span>Client: <strong className="text-slate-800">{selectedInvoice.client}</strong></span>
                    <span>Freelancer: <strong className="text-slate-800">Rahul Kumar</strong></span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Escrow & Settlement Ledger</h4>
                  <div className="flex justify-between text-slate-600">
                    <span>Milestone Gross Amount</span>
                    <span className="font-bold text-slate-900">₹{selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>PayPilot Escrow Protection Fee</span>
                    <span className="font-bold text-emerald-600">₹0.00 (0%)</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>PayPal Transaction Fee</span>
                    <span className="font-bold text-emerald-600">₹0.00 (Waived)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                    <span>Net Settled to Wallet</span>
                    <span className="text-blue-600">₹{selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] font-mono text-slate-500 bg-slate-100/60 p-3 rounded-xl">
                  <div>PayPal Order ID: <span className="text-slate-800 font-semibold">{selectedInvoice.orderId}</span></div>
                  <div>Capture Reference: <span className="text-slate-800 font-semibold">{selectedInvoice.captureId}</span></div>
                  <div>Settlement Status: <span className="text-emerald-700 font-bold uppercase">{selectedInvoice.status}</span></div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Receipt
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(null)}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
