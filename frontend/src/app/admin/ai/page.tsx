"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { 
  Cpu, CheckCircle2, AlertTriangle, Terminal, 
  ExternalLink, Search, RefreshCw, Zap, ShieldCheck
} from "lucide-react";

export default function AdminAILogsPage() {
  const [selectedLog, setSelectedLog] = useState<{
    id: string;
    model: string;
    task: string;
    score: number;
    latency: string;
    tokens: number;
    verdict: string;
    feedback: string;
    timestamp: string;
    breakdown: { label: string; score: number }[];
  } | null>(null);

  const logs = [
    {
      id: "AUD-GEM-901",
      model: "Gemini 1.5 Pro (002)",
      task: "Deliverable Audit • React Dashboard for College Project",
      score: 98,
      latency: "1,240 ms",
      tokens: 3840,
      verdict: "AUTOMATIC_RELEASE_RECOMMENDED",
      timestamp: "Nov 8, 2026 • 16:32 IST",
      feedback: "All milestone deliverables confirmed. TypeScript compiles without errors. Responsive design checks pass 100%. Tailwind classes optimized.",
      breakdown: [
        { label: "Code Completeness", score: 100 },
        { label: "Requirement Matching", score: 98 },
        { label: "Linting & Type Safety", score: 96 }
      ]
    },
    {
      id: "AUD-GEM-902",
      model: "Gemini 1.5 Flash",
      task: "Deliverable Audit • 10-Page Grid-Tied Solar Power Plant Report",
      score: 96,
      latency: "620 ms",
      tokens: 2150,
      verdict: "AUTOMATIC_RELEASE_RECOMMENDED",
      timestamp: "Nov 7, 2026 • 11:15 IST",
      feedback: "10 distinct sections validated. Solar irradiance math verified with standard IEC formulas. PDF formatted with professional typography and figures.",
      breakdown: [
        { label: "Document Length", score: 100 },
        { label: "Technical Accuracy", score: 95 },
        { label: "Formatting Standard", score: 94 }
      ]
    },
    {
      id: "AUD-GEM-903",
      model: "Gemini 1.5 Pro (002)",
      task: "Deliverable Audit • Autonomous Dispute Resolution Agent using Multi-Modal LLMs",
      score: 78,
      latency: "2,410 ms",
      tokens: 7290,
      verdict: "HUMAN_ARBITRATION_REQUIRED",
      timestamp: "Nov 6, 2026 • 20:45 IST",
      feedback: "Benchmarking script passed 39/50 test cases (78%). Client required minimum 85% accuracy. Code quality is high, but validation metric fell short of strict contract agreement.",
      breakdown: [
        { label: "Accuracy Benchmark", score: 72 },
        { label: "Code Quality", score: 90 },
        { label: "Documentation", score: 85 }
      ]
    },
    {
      id: "AUD-GEM-904",
      model: "Gemini 1.5 Flash",
      task: "Talent Matching • Technical Content Writer for AI Research",
      score: 99,
      latency: "410 ms",
      tokens: 1420,
      verdict: "MATCH_CONFIRMED",
      timestamp: "Nov 5, 2026 • 09:18 IST",
      feedback: "Candidate portfolio matches 4 required sub-domains: PyTorch, Multi-Agent systems, Prompt Engineering, and Developer Education.",
      breakdown: [
        { label: "Semantic Skill Fit", score: 100 },
        { label: "Past Performance", score: 98 },
        { label: "Rate Alignment", score: 100 }
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <AdminSidebar activeTab="ai" />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-8 py-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Cognitive Inference Engine
              </span>
              <span className="text-xs font-semibold text-slate-500">Gemini 1.5 Pro & Flash</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Gemini AI Verification & Audit Logs</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              API Latency: 420ms avg
            </span>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-7xl">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Total Verifications</span>
                <Cpu className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">38</p>
              <p className="text-xs text-blue-600 font-semibold mt-1">Autonomous deliverable checks</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Auto-Pass Rate</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">97.4%</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Passed on first inspection</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Avg Gemini Tokens</span>
                <Terminal className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">3,675</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Prompt + Deliverable context</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Model Confidence</span>
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">99.1%</p>
              <p className="text-xs text-cyan-600 font-semibold mt-1">Grounding score index</p>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Deliverable Inspection Trace Ledger</h3>
                <p className="text-xs text-slate-500 mt-0.5">Automated quality evaluation, code audits, and document validation</p>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">
                {logs.length} Traces Recorded
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                  <tr>
                    <th className="py-3.5 px-5">Trace ID & Model</th>
                    <th className="py-3.5 px-5">Audit Scope</th>
                    <th className="py-3.5 px-5">Score</th>
                    <th className="py-3.5 px-5">Latency & Usage</th>
                    <th className="py-3.5 px-5">AI Verdict</th>
                    <th className="py-3.5 px-5 text-right">Inspection Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-mono font-bold text-slate-900">{log.id}</span>
                        <span className="block text-[11px] font-semibold text-blue-600">{log.model}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-800">{log.task}</span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">{log.timestamp}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                          log.score >= 85 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {log.score}%
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-700">{log.latency}</span>
                        <span className="block text-[10px] text-slate-400">{log.tokens.toLocaleString()} tokens</span>
                      </td>
                      <td className="py-4 px-5">
                        {log.verdict === "AUTOMATIC_RELEASE_RECOMMENDED" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Auto Release Approved
                          </span>
                        )}
                        {log.verdict === "HUMAN_ARBITRATION_REQUIRED" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                            Disputed / Hold
                          </span>
                        )}
                        {log.verdict === "MATCH_CONFIRMED" && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-cyan-100 text-cyan-800 border border-cyan-200">
                            Talent Matched
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 shadow-xs transition-colors"
                        >
                          View Breakdown
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Breakdown Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedLog.id}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">Gemini Audit Report</h3>
                  <p className="text-xs text-slate-500">{selectedLog.task}</p>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Score Metric */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Overall Confidence</p>
                  <p className="text-3xl font-black text-slate-900 mt-0.5">{selectedLog.score}%</p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-slate-500 font-bold">Latency: <span className="text-slate-800">{selectedLog.latency}</span></p>
                  <p className="text-slate-500 font-bold">Engine: <span className="text-blue-600">{selectedLog.model}</span></p>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation Dimensions</p>
                {selectedLog.breakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="font-black text-slate-900">{item.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Feedback */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Autonomous Reasoning Trace</p>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono">
                  {selectedLog.feedback}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
