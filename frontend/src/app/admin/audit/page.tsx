"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Activity, Terminal, ShieldAlert, CheckCircle2, 
  ExternalLink, Search, Download, Filter, Key
} from "lucide-react";

export default function AdminAuditPage() {
  const [filterType, setFilterType] = useState("all");

  const auditEvents = [
    {
      id: "LOG-9921",
      timestamp: "10-11-2026 05:22:18 UTC",
      actor: "PAYPAL_WEBHOOK_DAEMON",
      action: "ESCROW_VAULT_FUNDED",
      details: "Received PAYMENT.CAPTURE.COMPLETED for Order 228122496A7888123 (Amount: ₹3,500 INR). Escrow state set to LOCKED_IN_ESCROW.",
      hash: "0x8fa4c3b2110e59a...",
      level: "SUCCESS"
    },
    {
      id: "LOG-9920",
      timestamp: "10-11-2026 04:45:02 UTC",
      actor: "GEMINI_1_5_PRO_ENGINE",
      action: "DELIVERABLE_AUDITED",
      details: "Automated analysis of contract CCN-101. 100% compliance test passed. Verdict: AUTOMATIC_RELEASE_RECOMMENDED.",
      hash: "0x3bc19ef2a04874c...",
      level: "SUCCESS"
    },
    {
      id: "LOG-9919",
      timestamp: "09-11-2026 21:12:44 UTC",
      actor: "CLIENT: Sarah Johnson",
      action: "DISPUTE_RAISED",
      details: "Dispute opened on contract CCN-103. Reason: Accuracy benchmark failed to reach specified 85% requirement. Escrow frozen.",
      hash: "0xee718a209b114d5...",
      level: "WARN"
    },
    {
      id: "LOG-9918",
      timestamp: "09-11-2026 14:02:11 UTC",
      actor: "ADMIN: PayPilot Governance",
      action: "ARBITRATION_SESSION_INIT",
      details: "Admin initiated dual-signature evidence inspection for dispute CCN-103.",
      hash: "0x77c4821a00f2e81...",
      level: "INFO"
    },
    {
      id: "LOG-9917",
      timestamp: "08-11-2026 18:30:29 UTC",
      actor: "PAYPAL_DISBURSEMENT_GATEWAY",
      action: "PAYOUT_COMPLETED",
      details: "Disbursed ₹5,000 INR to Arjun Menon for contract CCN-102. Transaction status: COMPLETED.",
      hash: "0x110fb823a9d7211...",
      level: "SUCCESS"
    },
    {
      id: "LOG-9916",
      timestamp: "07-11-2026 10:14:55 UTC",
      actor: "SYSTEM_AUTH_GUARD",
      action: "DEMO_LOGIN_SUCCEEDED",
      details: "Quick authenticated admin demo session initiated from IP 127.0.0.1.",
      hash: "0x54d22187b99c001...",
      level: "INFO"
    }
  ];

  const filteredLogs = auditEvents.filter(e => {
    if (filterType === "warn") return e.level === "WARN";
    if (filterType === "success") return e.level === "SUCCESS";
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <AdminSidebar activeTab="audit" />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-8 py-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Immutable Ledger
              </span>
              <span className="text-xs font-semibold text-slate-500">SHA-256 Chained Hash Verification</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">System Security & Audit Trail</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs flex items-center gap-2">
              <Key className="w-3.5 h-3.5 text-blue-600" />
              Root Node: 0x8fa4...59a
            </span>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl">
          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFilterType("all")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === "all" ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                All Events ({auditEvents.length})
              </button>
              <button 
                onClick={() => setFilterType("warn")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === "warn" ? "bg-amber-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                Warnings & Disputes
              </button>
              <button 
                onClick={() => setFilterType("success")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterType === "success" ? "bg-emerald-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                Financial & Settled
              </button>
            </div>
          </div>

          {/* Terminal Box */}
          <div className="bg-[#0B132B] text-slate-200 rounded-2xl p-6 border border-slate-800 shadow-xl font-mono text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] font-bold text-slate-400 ml-2">/var/log/paypilot/audit_consensus.log</span>
              </div>
              <span className="text-[11px] text-cyan-400 font-bold">STREAM LIVE • SYNCED</span>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-2">
              {filteredLogs.map(log => (
                <div key={log.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-blue-500/40 transition-colors space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">[{log.timestamp}]</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        log.level === "SUCCESS" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                        log.level === "WARN" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                        "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-slate-400">by <span className="text-white font-bold">{log.actor}</span></span>
                    </div>
                    <span className="text-slate-500 font-mono text-[10px]">{log.hash}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed pl-2 border-l-2 border-slate-700">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
