"use client";

import { useState } from "react";
import { 
  Flame, Sparkles, CheckCircle2, AlertTriangle, FileCode, UploadCloud, 
  ArrowRight, ShieldCheck, Check, RefreshCw, Eye
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

export default function FreelancerAIAssistantPage() {
  const [selectedProject, setSelectedProject] = useState("React Dashboard for College Project");
  const [analyzing, setAnalyzing] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState(`import React, { useState } from 'react';

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState({ revenue: 28500, active: 3 });
  
  return (
    <div className="p-6 bg-slate-900 text-white rounded-2xl">
      <h2 className="text-xl font-bold">Project Metrics</h2>
      <p>Total Revenue: ₹{metrics.revenue}</p>
    </div>
  );
}`);

  const [auditResult, setAuditResult] = useState({
    complianceScore: 98,
    readiness: "Ready for Client Release",
    testsPassed: 18,
    totalTests: 18,
    findings: [
      { type: "PASS", text: "Code conforms to TypeScript strict typing guidelines" },
      { type: "PASS", text: "No sensitive environment credentials or secrets exposed" },
      { type: "PASS", text: "Meets client criteria: Dark mode & responsive dashboard layout" },
      { type: "INFO", text: "Auto-generated test suite coverage: 94%" }
    ]
  });

  const handleRunAudit = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAuditResult({
        complianceScore: 99,
        readiness: "Ready for Client Release",
        testsPassed: 19,
        totalTests: 19,
        findings: [
          { type: "PASS", text: "Code conforms to Next.js 16 App Router best practices" },
          { type: "PASS", text: "Zero security vulnerabilities detected" },
          { type: "PASS", text: "Client contractual deliverable requirements 100% satisfied" },
          { type: "INFO", text: "Auto-generated test suite coverage: 96%" }
        ]
      });
    }, 900);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <AppSidebar activePage="ai" />

      <main className="flex-1 p-8 max-w-[1400px]">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase tracking-wider">
                Freelancer Portal
              </span>
              <span className="text-xs text-slate-400 font-medium">Autonomous Pre-Audit</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              AI Milestone Assistant <Flame className="w-7 h-7 text-amber-500" />
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Pre-screen your deliverables against client criteria to guarantee fast, dispute-free PayPal release.</p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Code / Deliverable Inspector (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Deliverable Inspector</h2>
                  <p className="text-xs text-slate-400">Select active milestone and inspect code or text before submission</p>
                </div>
                <select 
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>React Dashboard for College Project</option>
                  <option>FastAPI REST Microservice & Postgres</option>
                  <option>10-Page Technical Whitepaper on AI Agents</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Source Code or Markdown Submission</span>
                  <span className="text-[11px] text-slate-400 font-normal">React / TypeScript / Python / Markdown</span>
                </label>
                <textarea
                  rows={10}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full font-mono text-xs p-4 bg-slate-900 text-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500 border border-slate-800 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Runs locally in sandbox; never leaks IP</span>
                </div>

                <button
                  type="button"
                  onClick={handleRunAudit}
                  disabled={analyzing}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Running AI Inspection...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Run Autonomous Audit
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Audit Findings */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3">AI Verification Report</h3>
              <div className="space-y-2.5">
                {auditResult.findings.map((f, i) => (
                  <div 
                    key={i} 
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs"
                  >
                    {f.type === "PASS" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                    )}
                    <span className="text-slate-700 font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Release Score Card (1 Col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Confidence Score</span>
              <div className="text-5xl font-black text-emerald-600 my-2">{auditResult.complianceScore}%</div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-4">
                {auditResult.readiness}
              </span>

              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                When you submit with a 95%+ audit score, the client's automated verification agent releases the PayPal escrow without manual delay.
              </p>

              <button
                type="button"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Submit Milestone Deliverable &rarr;
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
              <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">Escrow Release Policy</h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                1. Freelancer runs AI pre-check<br/>
                2. Deliverable passes milestone criteria<br/>
                3. PayPal order captures & credits immediately
              </p>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Zero fees on PayPal sandbox releases
              </span>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
