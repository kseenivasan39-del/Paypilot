"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, AlertTriangle, Users, DollarSign, CheckCircle2, 
  ExternalLink, ArrowUpRight, Lock, RefreshCw, X, Check, Search, Filter,
  FileText, Activity, ShieldAlert, Cpu
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

interface PlatformStats {
  totalUsers: number;
  totalClients: number;
  totalFreelancers: number;
  activeContracts: number;
  totalVolumeINR: number;
  escrowLockedINR: number;
  disputesActive: number;
  aiVerificationsPassed: number;
}

interface EscrowContract {
  id: string;
  projectTitle: string;
  client: string;
  freelancer: string;
  amount: number;
  currency: string;
  paypalOrderId: string;
  paypalCaptureId: string;
  status: "LOCKED_IN_ESCROW" | "RELEASED" | "DISPUTED";
  aiVerificationScore: number;
  date: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 142,
    totalClients: 58,
    totalFreelancers: 84,
    activeContracts: 19,
    totalVolumeINR: 245000,
    escrowLockedINR: 42500,
    disputesActive: 1,
    aiVerificationsPassed: 38
  });

  const [contracts, setContracts] = useState<EscrowContract[]>([
    {
      id: "CON-101",
      projectTitle: "React Dashboard for College Project",
      client: "Sarah Johnson",
      freelancer: "Rahul Kumar",
      amount: 3500,
      currency: "INR",
      paypalOrderId: "28S123456R7880123",
      paypalCaptureId: "CAP-998877",
      status: "LOCKED_IN_ESCROW",
      aiVerificationScore: 98,
      date: "Nov 8, 2026"
    },
    {
      id: "CON-102",
      projectTitle: "10-Page Grid-Tied Solar Power Plant Report",
      client: "Sarah Johnson",
      freelancer: "Arjun Menon",
      amount: 5000,
      currency: "INR",
      paypalOrderId: "19K987654R1122334",
      paypalCaptureId: "CAP-443322",
      status: "RELEASED",
      aiVerificationScore: 96,
      date: "Nov 7, 2026"
    },
    {
      id: "CON-103",
      projectTitle: "Autonomous Dispute Resolution Agent using Multi-Modal LLMs",
      client: "Sarah Johnson",
      freelancer: "Ananya Iyer",
      amount: 9500,
      currency: "INR",
      paypalOrderId: "55L443322R9988776",
      paypalCaptureId: "CAP-771122",
      status: "DISPUTED",
      aiVerificationScore: 78,
      date: "Nov 9, 2026"
    }
  ]);

  const [selectedDispute, setSelectedDispute] = useState<EscrowContract | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleResolveDispute = (decision: "RELEASE_TO_FREELANCER" | "REFUND_TO_CLIENT") => {
    if (!selectedDispute) return;

    setContracts((prev) =>
      prev.map((c) =>
        c.id === selectedDispute.id
          ? { ...c, status: decision === "RELEASE_TO_FREELANCER" ? "RELEASED" : "LOCKED_IN_ESCROW" }
          : c
      )
    );

    setStats((prev) => ({
      ...prev,
      disputesActive: Math.max(0, prev.disputesActive - 1)
    }));

    setActionSuccess(
      decision === "RELEASE_TO_FREELANCER"
        ? `Verdict executed: Released ₹${selectedDispute.amount.toLocaleString()} to ${selectedDispute.freelancer} via PayPal Webhook.`
        : `Verdict executed: Refunded ₹${selectedDispute.amount.toLocaleString()} back to ${selectedDispute.client}.`
    );

    setTimeout(() => {
      setSelectedDispute(null);
      setActionSuccess(null);
    }, 2500);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <AppSidebar activePage="dashboard" />

      <main className="flex-1 p-8 max-w-[1600px] flex flex-col">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                🛡️ Protocol Administrator
              </span>
              <span className="text-xs text-slate-400 font-medium">PayPal Sandbox Gateway & AI Arbitrator</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              PayPilot Admin Command Center
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Platform-wide escrow oversight, dispute arbitration, and real-time transaction surveillance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/client"
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Switch to Client View
            </Link>
            <Link
              href="/dashboard/freelancer"
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              Switch to Freelancer View
            </Link>
            <NotificationBell />
            <UserProfileMenu fallbackName="PayPilot Admin" fallbackRole="Admin" />
          </div>
        </header>

        {/* 4 Analytics Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Volume (GMV)</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">₹{stats.totalVolumeINR.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">↑ 24.8% vs last month</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Locked in Escrow</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-700">₹{stats.escrowLockedINR.toLocaleString()}</div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">Held in PayPal Sandbox Vault</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Disputes</span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-red-600">{stats.disputesActive}</div>
            <span className="text-[11px] text-red-500 font-bold mt-1 inline-block">Requires Admin AI Verdict</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Audits Passed</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700">{stats.aiVerificationsPassed}</div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">97.4% compliance rate</span>
          </div>
        </div>

        {/* Action Success Toast Banner */}
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-3 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Escrow Surveillance & Dispute Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Live Escrow Contracts & Disputes</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Surveillance ledger tracking cryptographic PayPal orders and AI milestone compliance.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-xl font-bold">
                {contracts.length} active records
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Contract & Milestone</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Freelancer</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">PayPal Order</th>
                  <th className="py-3.5 px-4">AI Score</th>
                  <th className="py-3.5 px-4">Escrow Status</th>
                  <th className="py-3.5 px-6 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900 block">{c.projectTitle}</span>
                      <span className="font-mono text-[10px] text-slate-400">{c.id} • {c.date}</span>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">{c.client}</td>
                    <td className="py-4 px-4 font-semibold text-slate-700">{c.freelancer}</td>
                    <td className="py-4 px-4 font-black text-slate-900">₹{c.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600">{c.paypalOrderId}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        c.aiVerificationScore >= 90 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {c.aiVerificationScore}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        c.status === "RELEASED"
                          ? "bg-emerald-100 text-emerald-800"
                          : c.status === "DISPUTED"
                          ? "bg-red-100 text-red-800 animate-pulse"
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {c.status === "DISPUTED" ? (
                        <button
                          type="button"
                          onClick={() => setSelectedDispute(c)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                        >
                          Arbitrate Dispute
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Reconciled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispute Resolution Modal */}
        {selectedDispute && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3 text-red-600">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">Admin Escrow Arbitration</h3>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs mb-4">
                <div className="font-bold text-slate-900 text-sm">{selectedDispute.projectTitle}</div>
                <div className="flex justify-between text-slate-600">
                  <span>Locked Amount:</span>
                  <strong className="text-slate-900 font-mono">₹{selectedDispute.amount.toLocaleString()} INR</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Client Claim:</span>
                  <span>{selectedDispute.client} (Requests refund)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Freelancer Submission:</span>
                  <span>{selectedDispute.freelancer} (Submitted PR #42)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-600">
                  <span>Gemini AI Audit Score:</span>
                  <span className="text-amber-700 font-bold">78% Match (Minor criteria deviation)</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                As the PayPilot Escrow Administrator, execute the binding cryptographic settlement. Releasing triggers an instantaneous PayPal transfer to the freelancer; refunding returns funds to the client.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleResolveDispute("REFUND_TO_CLIENT")}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Refund to Client
                </button>
                <button
                  type="button"
                  onClick={() => handleResolveDispute("RELEASE_TO_FREELANCER")}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Release to Freelancer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
