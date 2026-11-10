"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { 
  Cpu, CheckCircle2, AlertTriangle, Terminal, 
  ExternalLink, Search, RefreshCw, Zap, ShieldCheck,
  PlusCircle, Download, Sliders, Filter, Sparkles, X, Check, Activity
} from "lucide-react";

interface AITraceLog {
  id: string;
  model: string;
  task: string;
  score: number;
  latency: string;
  tokens: number;
  verdict: "AUTOMATIC_RELEASE_RECOMMENDED" | "HUMAN_ARBITRATION_REQUIRED" | "MATCH_CONFIRMED";
  feedback: string;
  timestamp: string;
  breakdown: { label: string; score: number }[];
}

export default function AdminAILogsPage() {
  const [selectedLog, setSelectedLog] = useState<AITraceLog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("all");
  const [activeModel, setActiveModel] = useState<"Gemini 1.5 Pro" | "Gemini 1.5 Flash">("Gemini 1.5 Pro");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const [logs, setLogs] = useState<AITraceLog[]>([
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
  ]);

  // Feature 1: Trigger Instant Live Deliverable Audit
  const handleTriggerAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const mockId = `AUD-GEM-${Math.floor(905 + Math.random() * 890)}`;
      const mockScore = Math.floor(86 + Math.random() * 13);
      const isPass = mockScore >= 85;
      const latencyVal = activeModel === "Gemini 1.5 Flash" ? "480 ms" : "1,180 ms";

      const newTrace: AITraceLog = {
        id: mockId,
        model: `${activeModel} (${activeModel === "Gemini 1.5 Flash" ? "Live Flash" : "002"})`,
        task: "Deliverable Audit • Next.js FinTech Authentication Microservice",
        score: mockScore,
        latency: latencyVal,
        tokens: Math.floor(2500 + Math.random() * 3000),
        verdict: isPass ? "AUTOMATIC_RELEASE_RECOMMENDED" : "HUMAN_ARBITRATION_REQUIRED",
        feedback: "Automated test suite evaluated. AST tree analysis confirmed 0 vulnerabilities. Swagger OpenAPI schema parsed and authenticated against mock payloads.",
        timestamp: "Just now",
        breakdown: [
          { label: "API Specification", score: mockScore },
          { label: "Code Architecture", score: Math.min(100, mockScore + 2) },
          { label: "Security & Type Safety", score: Math.min(100, mockScore - 1) }
        ]
      };

      setLogs(prev => [newTrace, ...prev]);
      setIsAuditing(false);
      setActionSuccess(`Audit ${mockId} completed with ${mockScore}% confidence using ${activeModel}.`);
      setTimeout(() => setActionSuccess(null), 4000);
    }, 900);
  };

  // Feature 5: CSV Export
  const handleExportCSV = () => {
    const headers = ["Trace ID", "Model Engine", "Audit Scope", "Score (%)", "Latency", "Tokens", "AI Verdict", "Timestamp"];
    const rows = logs.map(l => [
      l.id,
      `"${l.model}"`,
      `"${l.task.replace(/"/g, '""')}"`,
      l.score,
      l.latency,
      l.tokens,
      l.verdict,
      `"${l.timestamp}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `paypilot_gemini_audit_traces_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionSuccess("Gemini AI audit telemetry exported as CSV spreadsheet.");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Filtered Logs
  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVerdict = 
      verdictFilter === "all" || 
      (verdictFilter === "approved" && l.verdict === "AUTOMATIC_RELEASE_RECOMMENDED") ||
      (verdictFilter === "hold" && l.verdict === "HUMAN_ARBITRATION_REQUIRED") ||
      (verdictFilter === "matched" && l.verdict === "MATCH_CONFIRMED");

    return matchesSearch && matchesVerdict;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <AdminSidebar activeTab="ai" />

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
                Cognitive Inference Engine
              </span>
              <span className="text-xs font-semibold text-slate-500">Gemini 1.5 Pro & Flash</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Gemini AI Verification & Audit Logs</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Feature 2: Model Switcher */}
            <div className="bg-slate-100 p-0.5 rounded-xl flex text-xs font-bold text-slate-600">
              <button
                onClick={() => setActiveModel("Gemini 1.5 Pro")}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeModel === "Gemini 1.5 Pro" ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"}`}
              >
                Gemini 1.5 Pro
              </button>
              <button
                onClick={() => setActiveModel("Gemini 1.5 Flash")}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeModel === "Gemini 1.5 Flash" ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"}`}
              >
                Gemini 1.5 Flash
              </button>
            </div>

            {/* Feature 1: Trigger Live Audit */}
            <button
              onClick={handleTriggerAudit}
              disabled={isAuditing}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-xs shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin" : ""}`} />
              <span>{isAuditing ? "Auditing Code..." : "Trigger Live Audit"}</span>
            </button>

            {/* Feature 5: Export CSV */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Traces</span>
            </button>

            <span className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              Avg Latency: 420ms
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

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Total Verifications</span>
                <Cpu className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">{logs.length + 34}</p>
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

          {/* Feature 4: Token Usage & Latency Sparkline Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-slate-900">API Response Latency & Token Velocity</h4>
                <p className="text-xs text-slate-500 mt-0.5">Real-time inference profiling across Google Cloud Vertex AI endpoints</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Flash Speed</span>
                <span className="font-extrabold text-emerald-600 font-mono">~410ms</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Pro Reasoning</span>
                <span className="font-extrabold text-blue-600 font-mono">~1,240ms</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Cost per Audit</span>
                <span className="font-extrabold text-slate-800 font-mono">~$0.002</span>
              </div>
            </div>
          </div>

          {/* Feature 3: Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by Trace ID, project, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
              <button 
                onClick={() => setVerdictFilter("all")} 
                className={`px-3 py-1.5 rounded-lg transition-all ${verdictFilter === "all" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"}`}
              >
                All Traces ({logs.length})
              </button>
              <button 
                onClick={() => setVerdictFilter("approved")} 
                className={`px-3 py-1.5 rounded-lg transition-all ${verdictFilter === "approved" ? "bg-white text-emerald-700 shadow-xs" : "hover:text-slate-900"}`}
              >
                Approved
              </button>
              <button 
                onClick={() => setVerdictFilter("hold")} 
                className={`px-3 py-1.5 rounded-lg transition-all ${verdictFilter === "hold" ? "bg-white text-amber-700 shadow-xs" : "hover:text-slate-900"}`}
              >
                Hold / Dispute
              </button>
              <button 
                onClick={() => setVerdictFilter("matched")} 
                className={`px-3 py-1.5 rounded-lg transition-all ${verdictFilter === "matched" ? "bg-white text-cyan-700 shadow-xs" : "hover:text-slate-900"}`}
              >
                Matched
              </button>
            </div>
          </div>

          {/* Feature 6: Fixed Overlapping Text Table with min-w-[950px] whitespace-nowrap */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap min-w-[950px]">
                <thead className="bg-slate-50/80 text-slate-500 font-extrabold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                  <tr>
                    <th className="py-4 px-6 min-w-[190px]">Trace ID & Model</th>
                    <th className="py-4 px-5 min-w-[280px]">Audit Scope</th>
                    <th className="py-4 px-5 min-w-[110px]">Score</th>
                    <th className="py-4 px-5 min-w-[150px]">Latency & Usage</th>
                    <th className="py-4 px-5 min-w-[180px]">AI Verdict</th>
                    <th className="py-4 px-6 text-right min-w-[140px]">Inspection Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-slate-900 block">{log.id}</span>
                        <span className="text-[11px] font-semibold text-blue-600">{log.model}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-800 block truncate max-w-xs">{log.task}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{log.timestamp}</span>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black inline-block ${
                          log.score >= 85 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                          "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {log.score}%
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-700 font-mono block">{log.latency}</span>
                        <span className="text-[10px] text-slate-400">{log.tokens.toLocaleString()} tokens</span>
                      </td>
                      <td className="py-4 px-5">
                        {log.verdict === "AUTOMATIC_RELEASE_RECOMMENDED" && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1.5 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Auto Release Approved
                          </span>
                        )}
                        {log.verdict === "HUMAN_ARBITRATION_REQUIRED" && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1.5 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                            Disputed / Hold
                          </span>
                        )}
                        {log.verdict === "MATCH_CONFIRMED" && (
                          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200 inline-flex items-center gap-1.5 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600"></span>
                            Talent Matched
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
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
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Score Metric */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Overall Confidence</p>
                  <p className="text-3xl font-black text-slate-900 mt-0.5">{selectedLog.score}%</p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-slate-500 font-bold">Latency: <span className="text-slate-800 font-mono">{selectedLog.latency}</span></p>
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
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
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
