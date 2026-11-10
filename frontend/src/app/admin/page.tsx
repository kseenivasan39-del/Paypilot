"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  ShieldCheck, AlertTriangle, Users, DollarSign, CheckCircle2, 
  ExternalLink, ArrowUpRight, Lock, RefreshCw, X, Check, Search, Filter,
  FileText, Activity, ShieldAlert, Cpu, Database, Eye, Terminal,
  Zap, ArrowRight, UserCheck, Key, Shield
} from "lucide-react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
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
  systemHealth: string;
  uptime: string;
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
  disputeReason?: string;
}

interface AuditLogItem {
  id: number;
  event: string;
  user: string;
  ip: string;
  time: string;
  status: "SUCCESS" | "WARNING" | "CRITICAL";
  details: string;
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 142,
    totalClients: 58,
    totalFreelancers: 84,
    activeContracts: 19,
    totalVolumeINR: 245000,
    escrowLockedINR: 42500,
    disputesActive: 1,
    aiVerificationsPassed: 38,
    systemHealth: "100% OPERATIONAL",
    uptime: "99.98%"
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
      date: "Nov 9, 2026",
      disputeReason: "Client states deliverable is missing IEEE formatted vector export."
    }
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([
    {
      id: 1,
      event: "PAYPAL_WEBHOOK_CAPTURE",
      user: "webhook.paypal.com",
      ip: "173.245.48.12",
      time: "2 mins ago",
      status: "SUCCESS",
      details: "Milestone capture verified for Order 28S123456R7880123 (₹3,500)"
    },
    {
      id: 2,
      event: "AI_VERIFICATION_COMPLETE",
      user: "Gemini 1.5 Flash Worker",
      ip: "internal-sandbox-01",
      time: "15 mins ago",
      status: "SUCCESS",
      details: "Audit completed with 98% compliance for Rahul Kumar PR #14"
    },
    {
      id: 3,
      event: "CONTRACT_DISPUTE_FILED",
      user: "client@paypilot.demo",
      ip: "106.51.24.119",
      time: "1 hour ago",
      status: "WARNING",
      details: "Dispute lodged on CON-103: Escrow ₹9,500 frozen pending arbitration"
    },
    {
      id: 4,
      event: "ADMIN_TOKEN_ISSUED",
      user: "admin@paypilot.demo",
      ip: "127.0.0.1",
      time: "Today at 10:45 AM",
      status: "SUCCESS",
      details: "Supervisor access authenticated with cryptographic JWT"
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

    const logEntry: AuditLogItem = {
      id: Date.now(),
      event: "ADMIN_ARBITRATION_VERDICT",
      user: "admin@paypilot.demo",
      ip: "127.0.0.1",
      time: "Just now",
      status: "SUCCESS",
      details: decision === "RELEASE_TO_FREELANCER" 
        ? `Verdict executed: Released ₹${selectedDispute.amount.toLocaleString()} to ${selectedDispute.freelancer}.`
        : `Verdict executed: Refunded ₹${selectedDispute.amount.toLocaleString()} to ${selectedDispute.client}.`
    };

    setAuditLogs((prev) => [logEntry, ...prev]);

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
    <div className="flex min-h-screen bg-[#070B14] text-slate-100 font-sans selection:bg-purple-600 selection:text-white">
      {/* Dedicated Admin Sidebar */}
      <AdminSidebar activeTab={currentTab} />

      {/* Main Admin Workspace */}
      <main className="flex-1 p-8 max-w-[1600px] flex flex-col">
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                PayPilot Governance Command Center
              </span>
              <span className="text-xs text-slate-500 font-mono">v2.4.0 • Cluster SG-1</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Protocol Supervisory Dashboard
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Live PayPal sandbox escrow surveillance, Gemini 1.5 deliverable auditing, and cryptographic arbitration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
            <NotificationBell />
            <UserProfileMenu fallbackName="PayPilot Admin" fallbackRole="Admin" />
          </div>
        </header>

        {/* Action Success Toast Banner */}
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-3 shadow-lg shadow-emerald-950/40 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* 4 Analytics Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Volume (GMV)</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">₹{stats.totalVolumeINR.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-400 font-bold mt-1 inline-block">↑ 24.8% vs last month</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Locked in Escrow</span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-purple-400">₹{stats.escrowLockedINR.toLocaleString()}</div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 inline-block">PayPal Sandbox Vault</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Disputes</span>
              <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-red-400">{stats.disputesActive}</div>
            <span className="text-[11px] text-red-400 font-bold mt-1 inline-block">Awaiting Arbitration</span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Verifications</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400">{stats.aiVerificationsPassed}</div>
            <span className="text-[11px] text-emerald-400 font-bold mt-1 inline-block">97.4% Passed First Check</span>
          </div>
        </div>

        {/* Tab 1: Escrow Contracts & Disputes */}
        <div className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl">
            <div className="p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-white">Live Escrow Contracts & Settlement Ledger</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Surveillance ledger of active, disputed, and released PayPal transactions.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold">
                  {contracts.length} active escrows
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-6">Contract ID & Scope</th>
                    <th className="py-3.5 px-4">Client</th>
                    <th className="py-3.5 px-4">Freelancer</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">PayPal Order</th>
                    <th className="py-3.5 px-4">AI Score</th>
                    <th className="py-3.5 px-4">Escrow State</th>
                    <th className="py-3.5 px-6 text-right">Arbitration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {contracts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-bold text-white block">{c.projectTitle}</span>
                        <span className="font-mono text-[10px] text-slate-500">{c.id} • {c.date}</span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-300">{c.client}</td>
                      <td className="py-4 px-4 font-semibold text-slate-300">{c.freelancer}</td>
                      <td className="py-4 px-4 font-black text-white">₹{c.amount.toLocaleString()}</td>
                      <td className="py-4 px-4 font-mono text-[11px] text-slate-400">{c.paypalOrderId}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          c.aiVerificationScore >= 90 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                            : "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                        }`}>
                          {c.aiVerificationScore}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          c.status === "RELEASED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : c.status === "DISPUTED"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                            : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {c.status === "DISPUTED" ? (
                          <button
                            type="button"
                            onClick={() => setSelectedDispute(c)}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 transition-all cursor-pointer"
                          >
                            Arbitrate Dispute
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-mono">Reconciled ✓</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tab 2: System Audit Trail Logs */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-black text-white">Cryptographic Security & Audit Logs</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Real-Time Event Stream</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {auditLogs.map((log) => (
                <div 
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === "SUCCESS" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {log.event}
                    </span>
                    <span className="text-slate-300 font-medium">{log.details}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-500 text-[11px] shrink-0">
                    <span>{log.user}</span>
                    <span>{log.ip}</span>
                    <span className="text-slate-400">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dispute Resolution Modal */}
        {selectedDispute && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-[#0B1121] text-white rounded-3xl max-w-lg w-full border border-slate-700 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3 text-red-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-base font-black text-white">Admin Escrow Arbitration</h3>
              </div>

              <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 text-xs mb-4">
                <div className="font-bold text-white text-sm">{selectedDispute.projectTitle}</div>
                <div className="flex justify-between text-slate-400">
                  <span>Locked Escrow:</span>
                  <strong className="text-cyan-400 font-mono">₹{selectedDispute.amount.toLocaleString()} INR</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Client:</span>
                  <span className="text-slate-200">{selectedDispute.client} (Requests refund)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Freelancer:</span>
                  <span className="text-slate-200">{selectedDispute.freelancer} (Submitted PR #42)</span>
                </div>
                {selectedDispute.disputeReason && (
                  <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-[11px]">
                    <strong>Client Note:</strong> {selectedDispute.disputeReason}
                  </div>
                )}
                <div className="pt-2 border-t border-slate-800 flex justify-between text-slate-400">
                  <span>Gemini 1.5 Verification:</span>
                  <span className="text-amber-400 font-bold">78% Match (Minor styling deviation)</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                As Protocol Administrator, choose the legally binding resolution. Releasing triggers the automated PayPal release webhook to the freelancer. Refunding returns the escrow to the client.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleResolveDispute("REFUND_TO_CLIENT")}
                  className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Refund to Client
                </button>
                <button
                  type="button"
                  onClick={() => handleResolveDispute("RELEASE_TO_FREELANCER")}
                  className="py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
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

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center text-xs">Loading Admin Command Center...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
