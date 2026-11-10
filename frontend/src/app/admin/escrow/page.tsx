"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { 
  Lock, CheckCircle2, ShieldCheck, ArrowUpRight, 
  RefreshCw, DollarSign, ExternalLink, AlertCircle,
  FileText, Download, PlusCircle, Search, Filter, 
  Send, Radio, Globe, Terminal, X, Check, Landmark, Zap
} from "lucide-react";

interface EscrowRecord {
  id: string;
  client: string;
  freelancer: string;
  paypalOrderId: string;
  amount: number;
  status: "LOCKED_IN_ESCROW" | "RELEASED" | "DISPUTED";
  project: string;
  date: string;
  fee: number;
}

interface WebhookLog {
  id: string;
  event: string;
  orderId: string;
  timestamp: string;
  status: number;
  payload: string;
}

export default function AdminEscrowPage() {
  const [synced, setSynced] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [currencyMode, setCurrencyMode] = useState<"INR" | "USD">("INR");
  const inrToUsdRate = 83.4;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "LOCKED_IN_ESCROW" | "RELEASED" | "DISPUTED">("ALL");

  // Webhook Drawer state
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookLog | null>(null);
  const [showTreasuryModal, setShowTreasuryModal] = useState(false);
  const [treasuryAmount, setTreasuryAmount] = useState(7350);

  const [escrows, setEscrows] = useState<EscrowRecord[]>([
    {
      id: "CCN-101",
      client: "Sarah Johnson",
      freelancer: "Rahul Kumar",
      paypalOrderId: "228122496A7888123",
      amount: 3500,
      status: "LOCKED_IN_ESCROW",
      project: "React Dashboard for College Project",
      date: "Nov 8, 2026",
      fee: 105
    },
    {
      id: "CCN-102",
      client: "Sarah Johnson",
      freelancer: "Arjun Menon",
      paypalOrderId: "19K087894H1122334",
      amount: 5000,
      status: "RELEASED",
      project: "10-Page Grid-Tied Solar Power Plant Report",
      date: "Nov 7, 2026",
      fee: 150
    },
    {
      id: "CCN-103",
      client: "Sarah Johnson",
      freelancer: "Ananya Iyer",
      paypalOrderId: "55L443322D9008776",
      amount: 9500,
      status: "DISPUTED",
      project: "Autonomous Dispute Resolution Agent using Multi-Modal LLMs",
      date: "Nov 6, 2026",
      fee: 285
    },
    {
      id: "CCN-099",
      client: "David Lee",
      freelancer: "Pooja Sharma",
      paypalOrderId: "88X991122B4455667",
      amount: 24500,
      status: "LOCKED_IN_ESCROW",
      project: "Full-Stack Next.js FinTech MVP",
      date: "Nov 5, 2026",
      fee: 735
    }
  ]);

  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([
    {
      id: "WH-9081",
      event: "PAYMENT.CAPTURE.COMPLETED",
      orderId: "228122496A7888123",
      timestamp: "Nov 8 • 16:32 IST",
      status: 200,
      payload: JSON.stringify({
        id: "WH-9081",
        event_type: "PAYMENT.CAPTURE.COMPLETED",
        resource: {
          id: "228122496A7888123",
          amount: { value: "3500.00", currency_code: "INR" },
          status: "COMPLETED",
          seller_protection: { status: "ELIGIBLE" }
        }
      }, null, 2)
    },
    {
      id: "WH-9080",
      event: "CHECKOUT.ORDER.APPROVED",
      orderId: "19K087894H1122334",
      timestamp: "Nov 7 • 11:20 IST",
      status: 200,
      payload: JSON.stringify({
        id: "WH-9080",
        event_type: "CHECKOUT.ORDER.APPROVED",
        resource: {
          id: "19K087894H1122334",
          intent: "CAPTURE",
          status: "APPROVED"
        }
      }, null, 2)
    },
    {
      id: "WH-9079",
      event: "CUSTOMER.DISPUTE.CREATED",
      orderId: "55L443322D9008776",
      timestamp: "Nov 6 • 19:45 IST",
      status: 200,
      payload: JSON.stringify({
        id: "WH-9079",
        event_type: "CUSTOMER.DISPUTE.CREATED",
        resource: {
          dispute_id: "PP-D-881920",
          dispute_amount: { value: "9500.00", currency_code: "INR" },
          reason: "UNACCEPTABLE_QUALITY"
        }
      }, null, 2)
    }
  ]);

  // Derived figures
  const totalVaultBalance = escrows
    .filter(e => e.status === "LOCKED_IN_ESCROW")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalReleased = escrows
    .filter(e => e.status === "RELEASED")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalFees = escrows.reduce((acc, curr) => acc + curr.fee, 0);

  const formatCurrency = (inrVal: number) => {
    if (currencyMode === "USD") {
      const usdVal = (inrVal / inrToUsdRate).toFixed(2);
      return `$${Number(usdVal).toLocaleString()}`;
    }
    return `₹${inrVal.toLocaleString()}`;
  };

  // Feature 6: Simulate PayPal Capture Injector
  const handleSimulatePaymentCapture = () => {
    const mockId = `CCN-${Math.floor(104 + Math.random() * 895)}`;
    const mockAmounts = [6500, 11000, 17500, 22000];
    const pickedAmount = mockAmounts[Math.floor(Math.random() * mockAmounts.length)];
    const mockOrderId = `${Math.floor(10 + Math.random() * 89)}K${Math.floor(100000 + Math.random() * 900000)}B`;

    const newRecord: EscrowRecord = {
      id: mockId,
      client: "Sarah Johnson",
      freelancer: "Vikram Rathore",
      paypalOrderId: mockOrderId,
      amount: pickedAmount,
      status: "LOCKED_IN_ESCROW",
      project: "Mobile Banking React Native & PayPal SDK",
      date: "Just now",
      fee: Math.round(pickedAmount * 0.03)
    };

    const newWebhook: WebhookLog = {
      id: `WH-${Math.floor(9090 + Math.random() * 900)}`,
      event: "PAYMENT.CAPTURE.COMPLETED",
      orderId: mockOrderId,
      timestamp: "Just now",
      status: 200,
      payload: JSON.stringify({
        event_type: "PAYMENT.CAPTURE.COMPLETED",
        order_id: mockOrderId,
        amount: { value: `${pickedAmount}.00`, currency_code: "INR" },
        status: "COMPLETED"
      }, null, 2)
    };

    setEscrows(prev => [newRecord, ...prev]);
    setWebhookLogs(prev => [newWebhook, ...prev]);
    setActionSuccess(`PayPal Sandbox Order ${mockOrderId} (₹${pickedAmount.toLocaleString()} INR) captured and locked into vault.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Feature 2: Force Manual Escrow Release / Refund
  const handleForceAction = (recordId: string, action: "RELEASE" | "REFUND") => {
    setEscrows(prev => prev.map(e => {
      if (e.id === recordId) {
        return {
          ...e,
          status: action === "RELEASE" ? "RELEASED" : "LOCKED_IN_ESCROW"
        };
      }
      return e;
    }));

    setActionSuccess(
      action === "RELEASE" 
        ? `Manual Override Executed: Funds for ${recordId} released directly to freelancer via PayPal Sandbox API.`
        : `Manual Override Executed: Funds for ${recordId} refunded to client.`
    );
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Feature 3: Platform Fee Sweep to Treasury
  const handleSweepTreasury = () => {
    setShowTreasuryModal(false);
    setActionSuccess(`Treasury Sweep Complete: Disbursed ₹${treasuryAmount.toLocaleString()} INR (3% protocol fee) to PayPilot Corporate Operating Account.`);
    setTreasuryAmount(0);
    setTimeout(() => setActionSuccess(null), 4500);
  };

  // Feature 5: CSV Export
  const handleExportCSV = () => {
    const headers = ["Contract ID", "Project", "Client", "Freelancer", "PayPal Order ID", "Principal (INR)", "Platform Fee 3% (INR)", "Custody State", "Date"];
    const rows = escrows.map(e => [
      e.id,
      `"${e.project.replace(/"/g, '""')}"`,
      `"${e.client}"`,
      `"${e.freelancer}"`,
      e.paypalOrderId,
      e.amount,
      e.fee,
      e.status,
      `"${e.date}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `paypilot_escrow_vault_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionSuccess("Escrow vault ledger downloaded as CSV spreadsheet.");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Filtered escrows
  const filteredEscrows = escrows.filter(e => {
    const matchesSearch = 
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.freelancer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.paypalOrderId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <AdminSidebar activeTab="escrow" />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* TOP UTILITY BAR: Profile & Notifications in extreme top-right */}
        <div className="px-8 pt-4 pb-2 border-b border-slate-100 flex items-center justify-end gap-3 bg-white">
          <NotificationBell />
          <UserProfileMenu fallbackName="PayPilot Admin" fallbackRole="Admin" />
        </div>

        {/* Header */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                PayPal Sandbox Vault
              </span>
              <span className="text-xs font-semibold text-slate-500">Live Webhook Relay Active</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">PayPal Escrow Vault & Liquidity</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Currency Mode Switcher */}
            <div className="bg-slate-100 p-0.5 rounded-xl flex text-xs font-bold text-slate-600">
              <button
                onClick={() => setCurrencyMode("INR")}
                className={`px-3 py-1.5 rounded-lg transition-all ${currencyMode === "INR" ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"}`}
              >
                INR (₹)
              </button>
              <button
                onClick={() => setCurrencyMode("USD")}
                className={`px-3 py-1.5 rounded-lg transition-all ${currencyMode === "USD" ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"}`}
              >
                USD ($)
              </button>
            </div>

            {/* Feature 6: Inject Mock Payment Capture */}
            <button 
              onClick={handleSimulatePaymentCapture}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Simulate PayPal Capture</span>
            </button>

            {/* Feature 5: CSV Export */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export CSV</span>
            </button>

            {/* Re-sync Button */}
            <button 
              onClick={() => {
                setSynced(false);
                setTimeout(() => setSynced(true), 800);
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${!synced ? "animate-spin text-blue-600" : ""}`} />
              <span>Re-sync Vault</span>
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl">
          {actionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Total Vault Balance</span>
                <Lock className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">{formatCurrency(totalVaultBalance)}</p>
              <p className="text-xs text-blue-600 font-semibold mt-1">
                {escrows.filter(e => e.status === "LOCKED_IN_ESCROW").length} contracts currently held
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Protocol Fee Cut (3%)</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">{formatCurrency(treasuryAmount)}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-emerald-600 font-semibold">Accrued commissions</span>
                {treasuryAmount > 0 && (
                  <button
                    onClick={() => setShowTreasuryModal(true)}
                    className="text-[10px] font-black uppercase text-blue-600 hover:text-blue-700 underline"
                  >
                    Sweep
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Released Escrows</span>
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">{formatCurrency(totalReleased)}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Lifetime disbursed to talent</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Webhook Health</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">99.98%</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">PAYMENT.CAPTURE.COMPLETED</p>
            </div>
          </div>

          {/* Feature 1: Live Webhook Relay & Inspector Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Live PayPal Sandbox Webhook Relay</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-xs text-slate-400 font-mono">Listener: /api/webhooks/paypal</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {webhookLogs.map(wh => (
                <div 
                  key={wh.id}
                  onClick={() => setSelectedWebhook(wh)}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-400 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{wh.status} OK</span>
                    <span className="text-slate-400 font-mono">{wh.timestamp}</span>
                  </div>
                  <p className="text-xs font-mono font-bold text-slate-800 truncate">{wh.event}</p>
                  <p className="text-[11px] font-mono text-slate-500">Order: {wh.orderId}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ledger Table with Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Escrow Capture & Settlement Ledger</h3>
                <p className="text-xs text-slate-500 mt-0.5">Dual-sign authorizations and cryptographic proof of custody</p>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by ID, project, or PayPal order..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
                  />
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${statusFilter === "ALL" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    All ({escrows.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("LOCKED_IN_ESCROW")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${statusFilter === "LOCKED_IN_ESCROW" ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    Locked
                  </button>
                  <button
                    onClick={() => setStatusFilter("RELEASED")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${statusFilter === "RELEASED" ? "bg-white text-emerald-700 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    Released
                  </button>
                  <button
                    onClick={() => setStatusFilter("DISPUTED")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${statusFilter === "DISPUTED" ? "bg-white text-red-600 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    Disputed
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                  <tr>
                    <th className="py-3.5 px-5">Contract & Project</th>
                    <th className="py-3.5 px-5">PayPal Order ID</th>
                    <th className="py-3.5 px-5">Principal Amount</th>
                    <th className="py-3.5 px-5">Platform Fee</th>
                    <th className="py-3.5 px-5">Custody State</th>
                    <th className="py-3.5 px-5">Date Captured</th>
                    <th className="py-3.5 px-5 text-right">Admin Override</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEscrows.map(escrow => (
                    <tr key={escrow.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-black text-slate-900">{escrow.id}</span>
                        <span className="block text-slate-600 font-medium truncate max-w-xs">{escrow.project}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                          {escrow.paypalOrderId}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-black text-slate-900 text-sm">
                        {formatCurrency(escrow.amount)}
                      </td>
                      <td className="py-4 px-5 font-semibold text-emerald-600">
                        {formatCurrency(escrow.fee)} (3%)
                      </td>
                      <td className="py-4 px-5">
                        {escrow.status === "LOCKED_IN_ESCROW" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 border border-blue-200">
                            Locked in Escrow
                          </span>
                        )}
                        {escrow.status === "RELEASED" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Released to Freelancer
                          </span>
                        )}
                        {escrow.status === "DISPUTED" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200">
                            Frozen (Disputed)
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-slate-500 font-semibold">
                        {escrow.date}
                      </td>
                      <td className="py-4 px-5 text-right">
                        {escrow.status === "LOCKED_IN_ESCROW" ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleForceAction(escrow.id, "RELEASE")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition-all cursor-pointer"
                            >
                              Force Release
                            </button>
                            <button
                              onClick={() => handleForceAction(escrow.id, "REFUND")}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-all cursor-pointer"
                            >
                              Refund
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Immutable ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Feature 1: Raw Webhook Inspector Modal */}
        {selectedWebhook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 text-white border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-start font-sans">
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    HTTP 200 OK • PAYPAL_WEBHOOK
                  </span>
                  <h3 className="text-base font-black text-white mt-2">{selectedWebhook.event}</h3>
                </div>
                <button
                  onClick={() => setSelectedWebhook(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-black/60 p-4 rounded-xl border border-slate-800 text-[11px] text-emerald-400 overflow-x-auto max-h-72">
                <pre>{selectedWebhook.payload}</pre>
              </div>

              <div className="pt-2 flex justify-end font-sans">
                <button
                  onClick={() => setSelectedWebhook(null)}
                  className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feature 3: Treasury Sweep Modal */}
        {showTreasuryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 space-y-4">
              <div className="flex items-center gap-3 text-blue-600">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Platform Treasury Sweep</h3>
                  <p className="text-xs text-slate-500">Corporate Profit Disbursement</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                You are sweeping <strong className="text-slate-900">₹{treasuryAmount.toLocaleString()} INR</strong> in accrued 3% commission fees from the PayPal sandbox escrow pool into your registered company operating bank account.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Destination:</span>
                  <span className="font-bold text-slate-800">HDFC Bank • Account ending in 4102</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Routing Speed:</span>
                  <span className="font-bold text-emerald-600">Instant RTGS / IMPS</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setShowTreasuryModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSweepTreasury}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  Confirm Sweep
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
