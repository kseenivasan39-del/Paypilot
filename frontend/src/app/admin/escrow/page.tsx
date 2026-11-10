"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Lock, CheckCircle2, ShieldCheck, ArrowUpRight, 
  RefreshCw, DollarSign, ExternalLink, AlertCircle,
  FileText, Download
} from "lucide-react";

export default function AdminEscrowPage() {
  const [vaultBalance, setVaultBalance] = useState("₹42,500");
  const [synced, setSynced] = useState(true);

  const escrows = [
    {
      id: "CCN-101",
      client: "Sarah Johnson",
      freelancer: "Rahul Kumar",
      paypalOrderId: "228122496A7888123",
      amount: "₹3,500",
      status: "LOCKED_IN_ESCROW",
      project: "React Dashboard for College Project",
      date: "Nov 8, 2026",
      fee: "₹105 (3%)"
    },
    {
      id: "CCN-102",
      client: "Sarah Johnson",
      freelancer: "Arjun Menon",
      paypalOrderId: "19K087894H1122334",
      amount: "₹5,000",
      status: "RELEASED",
      project: "10-Page Grid-Tied Solar Power Plant Report",
      date: "Nov 7, 2026",
      fee: "₹150 (3%)"
    },
    {
      id: "CCN-103",
      client: "Sarah Johnson",
      freelancer: "Ananya Iyer",
      paypalOrderId: "55L443322D9008776",
      amount: "₹9,500",
      status: "DISPUTED",
      project: "Autonomous Dispute Resolution Agent using Multi-Modal LLMs",
      date: "Nov 6, 2026",
      fee: "₹285 (3%)"
    },
    {
      id: "CCN-099",
      client: "David Lee",
      freelancer: "Pooja Sharma",
      paypalOrderId: "88X991122B4455667",
      amount: "₹24,500",
      status: "LOCKED_IN_ESCROW",
      project: "Full-Stack Next.js FinTech MVP",
      date: "Nov 5, 2026",
      fee: "₹735 (3%)"
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <AdminSidebar activeTab="escrow" />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-8 py-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                PayPal Sandbox Vault
              </span>
              <span className="text-xs font-semibold text-slate-500">Live Webhook Relay Active</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">PayPal Escrow Vault & Liquidity</h1>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setSynced(false);
                setTimeout(() => setSynced(true), 800);
              }}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${!synced ? "animate-spin text-blue-600" : ""}`} />
              Re-sync PayPal Vault
            </button>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Total Vault Balance</span>
                <Lock className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">{vaultBalance}</p>
              <p className="text-xs text-blue-600 font-semibold mt-1">2 contracts currently held</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Protocol Fee Cut (3%)</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">₹7,350</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Accrued this month</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Released Escrows</span>
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">₹202,500</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Total lifetime payouts</p>
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

          {/* Ledger Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Escrow Capture & Settlement Ledger</h3>
                <p className="text-xs text-slate-500 mt-0.5">Dual-sign authorizations and cryptographic proof of custody</p>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">
                {escrows.length} Total Records
              </span>
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
                    <th className="py-3.5 px-5 text-right">Date Captured</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {escrows.map(escrow => (
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
                        {escrow.amount}
                      </td>
                      <td className="py-4 px-5 font-semibold text-emerald-600">
                        {escrow.fee}
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
                      <td className="py-4 px-5 text-right text-slate-500 font-semibold">
                        {escrow.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
