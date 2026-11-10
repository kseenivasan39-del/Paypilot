"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  ShieldAlert, CheckCircle2, RefreshCw, AlertTriangle, 
  Search, ExternalLink, ArrowUpRight, Scale, Check, X,
  Clock, FileCheck, Lock
} from "lucide-react";

export default function AdminDisputesPage() {
  const [selectedDispute, setSelectedDispute] = useState<{
    id: string;
    client: string;
    freelancer: string;
    amount: string;
    reason: string;
    aiScore: string;
    aiFeedback: string;
    deliverable: string;
    status: string;
  } | null>(null);

  const [disputesList, setDisputesList] = useState([
    {
      id: "CCN-103",
      client: "Sarah Johnson",
      freelancer: "Ananya Iyer",
      amount: "₹9,500",
      reason: "Deliverable does not meet documented multi-modal benchmark accuracy (>85%). Current model reports 72%.",
      aiScore: "78%",
      aiFeedback: "Model evaluated against 50 test pairs. Latency acceptable (180ms), but multimodal embeddings drift on complex image prompts.",
      deliverable: "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi/ai_eval_final.zip",
      status: "AWAITING_ARBITRATION",
      createdAt: "Nov 9, 2026 • 14:22 IST"
    },
    {
      id: "CCN-098",
      client: "TechVista Labs",
      freelancer: "Vikram Rathore",
      amount: "₹14,000",
      reason: "Milestone 2 API integration missing Swagger docs and rate limiter implementation.",
      aiScore: "64%",
      aiFeedback: "FastAPI codebase validated. Rate limiter middleware absent in router tree. Test coverage at 52% (target was 80%).",
      deliverable: "github.com/techvista/auth-service/pull/14",
      status: "RESOLVED_REFUNDED",
      createdAt: "Nov 6, 2026 • 11:05 IST"
    },
    {
      id: "CCN-092",
      client: "GreenPulse Energy",
      freelancer: "Kavita Sen",
      amount: "₹6,800",
      reason: "Client claimed delayed delivery, freelancer claims client scope creep without contract amendment.",
      aiScore: "91%",
      aiFeedback: "Contract revision history parsed. Freelancer submitted v1 on time. Additional revisions were out of initial SOW specification.",
      deliverable: "drive.google.com/solar-yield-report-v2.pdf",
      status: "RESOLVED_RELEASED",
      createdAt: "Nov 4, 2026 • 19:40 IST"
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleArbitration = (action: "release" | "refund") => {
    if (!selectedDispute) return;
    const newStatus = action === "release" ? "RESOLVED_RELEASED" : "RESOLVED_REFUNDED";
    setDisputesList(prev => prev.map(d => d.id === selectedDispute.id ? { ...d, status: newStatus } : d));
    setActionSuccess(`Escrow funds ${action === "release" ? "released to " + selectedDispute.freelancer : "refunded to " + selectedDispute.client} successfully.`);
    setSelectedDispute(null);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const filteredDisputes = disputesList.filter(d => {
    if (filter === "active") return d.status === "AWAITING_ARBITRATION";
    if (filter === "resolved") return d.status.startsWith("RESOLVED");
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <AdminSidebar activeTab="disputes" />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-8 py-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                Arbitration Court
              </span>
              <span className="text-xs font-semibold text-slate-500">Dual-Sign Escrow Protection</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Dispute Arbitration Desk</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-600" />
              1 Dispute Pending Decision
            </span>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl">
          {actionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Dispute Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Active Disputes</span>
                <ShieldAlert className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">1</p>
              <p className="text-xs text-red-600 font-semibold mt-1">Requires human arbitration</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Funds Under Dispute</span>
                <Lock className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">₹9,500</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Held securely in PayPal vault</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Resolution Rate</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">96.8%</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Avg turnaround: 3.2 hours</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFilter("all")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === "all" ? "bg-blue-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                All Cases ({disputesList.length})
              </button>
              <button 
                onClick={() => setFilter("active")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === "active" ? "bg-red-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                Awaiting Arbitration (1)
              </button>
              <button 
                onClick={() => setFilter("resolved")} 
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === "resolved" ? "bg-emerald-600 text-white shadow-xs" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                Resolved ({disputesList.filter(d => d.status.startsWith("RESOLVED")).length})
              </button>
            </div>
          </div>

          {/* Disputes Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                  <tr>
                    <th className="py-3.5 px-5">Contract ID</th>
                    <th className="py-3.5 px-5">Parties Involved</th>
                    <th className="py-3.5 px-5">Escrow Amount</th>
                    <th className="py-3.5 px-5">AI Quality Score</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDisputes.map(dispute => (
                    <tr key={dispute.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-black text-slate-900">{dispute.id}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{dispute.createdAt}</span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800"><span className="text-slate-400 font-medium">Client:</span> {dispute.client}</p>
                          <p className="font-bold text-slate-800"><span className="text-slate-400 font-medium">Freelancer:</span> {dispute.freelancer}</p>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-black text-slate-900 text-sm">
                        {dispute.amount}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                          parseInt(dispute.aiScore) >= 85 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          parseInt(dispute.aiScore) >= 70 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                          "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                          {dispute.aiScore} Match
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        {dispute.status === "AWAITING_ARBITRATION" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700 border border-red-200">
                            Awaiting Arbitration
                          </span>
                        )}
                        {dispute.status === "RESOLVED_RELEASED" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Released to Freelancer
                          </span>
                        )}
                        {dispute.status === "RESOLVED_REFUNDED" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
                            Refunded to Client
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        {dispute.status === "AWAITING_ARBITRATION" ? (
                          <button
                            onClick={() => setSelectedDispute(dispute)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all"
                          >
                            Arbitrate Case
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedDispute(dispute)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                          >
                            Review Verdict
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal */}
        {selectedDispute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-xl w-full shadow-2xl animate-in zoom-in-95 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                    Dispute ID: {selectedDispute.id}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">Arbitration Case Assessment</h3>
                </div>
                <button 
                  onClick={() => setSelectedDispute(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Client:</span>
                  <span className="font-bold text-slate-900">{selectedDispute.client}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Freelancer:</span>
                  <span className="font-bold text-slate-900">{selectedDispute.freelancer}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-semibold">Escrow Value:</span>
                  <span className="font-black text-blue-600 text-sm">{selectedDispute.amount}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Dispute Claim</p>
                <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-100 text-xs text-red-900 leading-relaxed">
                  {selectedDispute.reason}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gemini 1.5 Code Audit</p>
                  <span className="text-xs font-black text-amber-600">AI Confidence: {selectedDispute.aiScore}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-slate-800 leading-relaxed">
                  {selectedDispute.aiFeedback}
                </div>
              </div>

              {selectedDispute.status === "AWAITING_ARBITRATION" ? (
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => handleArbitration("refund")}
                    className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refund Client ({selectedDispute.amount})
                  </button>
                  <button
                    onClick={() => handleArbitration("release")}
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Release to Freelancer
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={() => setSelectedDispute(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                  >
                    Close Verdict Window
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
