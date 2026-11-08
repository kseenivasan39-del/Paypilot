"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Flame, Sparkles, CheckCircle2, AlertTriangle, FileCode, UploadCloud, 
  ArrowRight, ShieldCheck, Check, RefreshCw, Eye, ChevronDown, 
  GitPullRequest, FileText, Download, Wand2, Shield, Lock, ExternalLink,
  Code2, CheckCheck, X, Copy, Printer
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

interface ProjectMilestone {
  id: string;
  projectTitle: string;
  clientName: string;
  milestoneTitle: string;
  escrowAmount: number;
  escrowId: string;
  dueDate: string;
  criteria: {
    title: string;
    requirement: string;
    status: "PASS" | "WARN" | "PENDING";
  }[];
  defaultSnippet: string;
  defaultPrUrl: string;
}

export default function FreelancerAIAssistantPage() {
  const projectMilestones: ProjectMilestone[] = [
    {
      id: "PROP-901",
      projectTitle: "React Dashboard for College Project",
      clientName: "Sarah Johnson",
      milestoneTitle: "Milestone 2: Dark Mode & Recharts Responsiveness",
      escrowAmount: 3500,
      escrowId: "PP-ESC-94821",
      dueDate: "Aug 12, 2026",
      defaultPrUrl: "https://github.com/paypilot/demo/pull/14",
      defaultSnippet: `import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function AnalyticsDashboard() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [metrics] = useState([
    { day: 'Mon', revenue: 4200 },
    { day: 'Tue', revenue: 6800 },
    { day: 'Wed', revenue: 9500 },
    { day: 'Thu', revenue: 14200 },
    { day: 'Fri', revenue: 28500 }
  ]);
  
  return (
    <div className={\`p-6 rounded-2xl transition-colors \${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border border-slate-200'}\`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Milestone 2 Analytics</h2>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white"
        >
          Toggle Theme ({theme})
        </button>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={metrics}>
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}`,
      criteria: [
        { title: "Dark & Light Mode Toggle", requirement: "Full dynamic Tailwind CSS variant toggle", status: "PASS" },
        { title: "Responsive Container", requirement: "Recharts responsive layout without canvas clipping", status: "PASS" },
        { title: "TypeScript Strictness", requirement: "Zero TypeScript implicit any warnings", status: "PASS" },
        { title: "Zero Secrets Exposed", requirement: "No API keys or sandbox passwords in codebase", status: "PASS" }
      ]
    },
    {
      id: "PROP-902",
      projectTitle: "10-Page Technical Whitepaper on AI Agents",
      clientName: "FinTech Research Group",
      milestoneTitle: "Deliverable 1: Complete 10-Page Whitepaper Draft",
      escrowAmount: 2000,
      escrowId: "PP-ESC-83712",
      dueDate: "Aug 10, 2026",
      defaultPrUrl: "https://drive.google.com/file/d/paypilot-whitepaper-v2",
      defaultSnippet: `# Autonomous Payment Agents & Algorithmic Escrow

## Abstract
This technical whitepaper formulates the mathematical boundaries of multi-party escrow timeout functions and automated arbitration.

$$\\tau_{escrow} = \\min(\\delta_{deadline}, \\lambda_{verification})$$

All transactions are anchored on PayPal REST capture hooks.`,
      criteria: [
        { title: "10-Page Scope", requirement: "Full technical treatise with literature citations", status: "PASS" },
        { title: "LaTeX Mathematical Proofs", requirement: "KaTeX/LaTeX format escrow algorithm", status: "PASS" },
        { title: "Zero Plagiarism", requirement: "Passes 100% original academic synthesis", status: "PASS" }
      ]
    },
    {
      id: "PROP-903",
      projectTitle: "FastAPI REST Microservice & Postgres",
      clientName: "TechCorp Labs",
      milestoneTitle: "Milestone 1: SQLAlchemy Models & Migration Scripts",
      escrowAmount: 5000,
      escrowId: "PP-ESC-67194",
      dueDate: "Aug 18, 2026",
      defaultPrUrl: "https://github.com/paypilot/fastapi-service/pull/3",
      defaultSnippet: `from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

app = FastAPI(title="PayPilot Escrow Microservice", version="1.0.0")

class EscrowCreate(BaseModel):
    client_id: str
    freelancer_id: str
    amount: float

@app.post("/api/v1/escrows/create", status_code=status.HTTP_201_CREATED)
async def create_escrow(payload: EscrowCreate):
    return {"status": "SECURED", "escrow_id": "PP-ESC-9941"}`,
      criteria: [
        { title: "Async Session Handlers", requirement: "SQLAlchemy asyncpg PostgreSQL pool", status: "PASS" },
        { title: "Alembic Migrations", requirement: "Autogenerated migration heads with rollback", status: "PASS" },
        { title: "OpenAPI Documentation", requirement: "Interactive Swagger UI schema compliance", status: "PASS" }
      ]
    }
  ];

  const [selectedMilestone, setSelectedMilestone] = useState<ProjectMilestone>(projectMilestones[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Input tabs: code | github | file
  const [inputTab, setInputTab] = useState<"code" | "github" | "file">("code");
  const [codeSnippet, setCodeSnippet] = useState(projectMilestones[0].defaultSnippet);
  const [githubUrl, setGithubUrl] = useState(projectMilestones[0].defaultPrUrl);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Audit state
  const [analyzing, setAnalyzing] = useState(false);
  const [auditScore, setAuditScore] = useState(99);
  const [readinessLabel, setReadinessLabel] = useState("Ready for Instant Release");
  const [auditFindings, setAuditFindings] = useState([
    { type: "PASS", text: "Code conforms to TypeScript strict typing guidelines" },
    { type: "PASS", text: "No sensitive environment credentials or sandbox secrets exposed" },
    { type: "PASS", text: "Meets client criteria: Dark mode variant & responsive chart containers" },
    { type: "PASS", text: "Autonomous test suite passed 19/19 checks with 96% coverage" }
  ]);

  // Modals & Feedback
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isAutoFixing, setIsAutoFixing] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectMilestone = (m: ProjectMilestone) => {
    setSelectedMilestone(m);
    setCodeSnippet(m.defaultSnippet);
    setGithubUrl(m.defaultPrUrl);
    setUploadedFileName(null);
    setIsDropdownOpen(false);
  };

  const handleRunAudit = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAuditScore(99);
      setReadinessLabel("Ready for Instant Release");
      setAuditFindings([
        { type: "PASS", text: `Verified all requirements for ${selectedMilestone.milestoneTitle}` },
        { type: "PASS", text: "Zero security vulnerabilities or memory leak patterns detected" },
        { type: "PASS", text: "Meets 100% of client contractual acceptance criteria" },
        { type: "PASS", text: "Instant PayPal capture authorization approved by PayPilot AI Auditor" }
      ]);
      setToastMsg("Autonomous audit passed with 99% score!");
      setTimeout(() => setToastMsg(null), 3000);
    }, 1100);
  };

  const handleAutoFix = () => {
    setIsAutoFixing(true);
    setTimeout(() => {
      setIsAutoFixing(false);
      setCodeSnippet((prev) => 
        prev.includes("useMemo") 
          ? prev 
          : prev.replace("export default function", "// Optimized with PayPilot AI memory memoization\nimport { useMemo } from 'react';\n\nexport default function")
      );
      setToastMsg("AI applied performance & strict typing auto-fixes!");
      setTimeout(() => setToastMsg(null), 3000);
    }, 800);
  };

  const handleConfirmDeliverableSubmission = () => {
    setIsSubmitModalOpen(false);
    setToastMsg(`Deliverable for ${selectedMilestone.id} submitted! Client & PayPal escrow notified.`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <AppSidebar activePage="ai" />

      <main className="flex-1 p-8 max-w-[1400px]">
        
        {/* Toast Feedback */}
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
              <span className="text-xs text-slate-400 font-semibold">• Autonomous Milestone Audit</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              AI Milestone Assistant <Flame className="w-7 h-7 text-amber-500" />
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Pre-screen code, PRs, and docs against client criteria to guarantee instant, dispute-free PayPal escrow releases.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Deliverable Inspector (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              
              {/* Header with Custom Project Dropdown */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-black text-slate-900">Deliverable Inspector</h2>
                  <p className="text-xs text-slate-400">Select active milestone and inspect deliverables before client sign-off</p>
                </div>

                {/* Custom Floating Project Selector (No ugly select) */}
                <div className="relative shrink-0" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 cursor-pointer transition-colors shadow-2xs"
                  >
                    <span className="truncate max-w-[220px]">{selectedMilestone.projectTitle}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                      <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        Active Contracts & Escrows
                      </div>
                      <div className="space-y-1 mt-1">
                        {projectMilestones.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleSelectMilestone(m)}
                            className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold flex items-start justify-between cursor-pointer transition-colors ${
                              selectedMilestone.id === m.id 
                                ? "bg-blue-50 text-blue-700 font-bold" 
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <p className="truncate font-bold text-slate-900">{m.projectTitle}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{m.milestoneTitle}</p>
                              <span className="text-[10px] text-emerald-600 font-bold">₹{m.escrowAmount.toLocaleString()} in Escrow</span>
                            </div>
                            {selectedMilestone.id === m.id && (
                              <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Multi-Mode Input Tabs (Code, GitHub, File) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setInputTab("code")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        inputTab === "code" 
                          ? "bg-white text-slate-900 shadow-xs" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" /> Code & Markdown
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputTab("github")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        inputTab === "github" 
                          ? "bg-white text-slate-900 shadow-xs" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <GitPullRequest className="w-3.5 h-3.5" /> GitHub PR Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputTab("file")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        inputTab === "file" 
                          ? "bg-white text-slate-900 shadow-xs" 
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> Upload File / PDF
                    </button>
                  </div>

                  {inputTab === "code" && (
                    <button
                      type="button"
                      onClick={handleAutoFix}
                      disabled={isAutoFixing}
                      className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      title="Auto-format & fix common errors with PayPilot AI"
                    >
                      <Wand2 className={`w-3.5 h-3.5 ${isAutoFixing ? "animate-spin" : ""}`} />
                      <span>{isAutoFixing ? "Fixing..." : "Auto-Fix Code"}</span>
                    </button>
                  )}
                </div>

                {/* Tab Content 1: Code Textarea */}
                {inputTab === "code" && (
                  <textarea
                    rows={12}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full font-mono text-xs p-4 bg-slate-900 text-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-slate-800 resize-none leading-relaxed shadow-inner"
                  />
                )}

                {/* Tab Content 2: GitHub PR URL */}
                {inputTab === "github" && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-800">
                      GitHub Pull Request or Branch URL
                    </label>
                    <div className="relative">
                      <GitPullRequest className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/organization/repo/pull/14"
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      PayPilot AI clones commit tree differences, runs unit test suites, and verifies git commit history.
                    </p>
                  </div>
                )}

                {/* Tab Content 3: File / PDF Upload */}
                {inputTab === "file" && (
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-slate-100/60 transition-colors text-center cursor-pointer space-y-2">
                    <UploadCloud className="w-8 h-8 text-blue-600 mx-auto" />
                    <h4 className="text-xs font-bold text-slate-800">Drag & drop deliverables here, or browse files</h4>
                    <p className="text-[11px] text-slate-400">Supports .pdf research reports, .fig design tokens, and .zip code bundles up to 50MB</p>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedFileName("Deliverable_Final_Report_v2.pdf");
                        setToastMsg("Attached Deliverable_Final_Report_v2.pdf!");
                        setTimeout(() => setToastMsg(null), 2500);
                      }}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      {uploadedFileName ? `Attached: ${uploadedFileName} (4.2 MB)` : "Select File from Computer"}
                    </button>
                  </div>
                )}

              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Runs in isolated local sandbox; zero client IP leaked</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRunAudit}
                    disabled={analyzing}
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {analyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Running Autonomous Inspection...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Run Autonomous Audit
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Contract Criteria Comparison Checklist */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Contractual Criteria Comparison</h3>
                  <p className="text-xs text-slate-400">Milestone acceptance specifications set by client {selectedMilestone.clientName}</p>
                </div>
                <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-xl">
                  {selectedMilestone.criteria.length}/{selectedMilestone.criteria.length} Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedMilestone.criteria.map((c, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {c.title}
                      </span>
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                        {c.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 pl-5">{c.requirement}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Verification Report Logs */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-slate-900">AI Verification Log</h3>
                <span className="text-xs font-mono text-slate-400">SHA-256: 7f83b165...9482</span>
              </div>
              <div className="space-y-2.5">
                {auditFindings.map((f, i) => (
                  <div 
                    key={i} 
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar: Release Score Card (1 Col) */}
          <div className="space-y-6">
            
            {/* Confidence Score Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Confidence Score</span>
              <div className="text-6xl font-black text-emerald-600 my-2 tracking-tight">{auditScore}%</div>
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-4 border border-emerald-100">
                {readinessLabel}
              </span>

              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                When you submit with a 95%+ audit score, the client's automated verification agent releases the PayPal escrow without manual delay.
              </p>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Submit Milestone Deliverable &rarr;
                </button>

                <button
                  type="button"
                  onClick={() => setIsCertificateOpen(true)}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" /> Export AI Audit Certificate
                </button>
              </div>
            </div>

            {/* Escrow Release Policy Card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">PayPal Smart Escrow</span>
                <span className="text-xs font-mono font-bold bg-white/10 px-2 py-0.5 rounded">₹{selectedMilestone.escrowAmount.toLocaleString()}</span>
              </div>
              
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                  <span>Freelancer passes autonomous pre-check with &ge; 95%</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                  <span>All contractual acceptance checklist criteria satisfied</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                  <span>PayPal captures escrow & credits instantly to wallet</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Escrow ID: {selectedMilestone.escrowId}
                </span>
                <span className="text-slate-400">Zero platform fee</span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal: Submit Milestone Deliverable Confirmation */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                  {selectedMilestone.id}
                </span>
                <span className="text-xs text-slate-400 font-medium">Final Deliverable Submission</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">
                Lock In Verified Deliverable
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Milestone: <strong className="text-slate-800">{selectedMilestone.milestoneTitle}</strong> for client <strong className="text-slate-800">{selectedMilestone.clientName}</strong>.
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AI Pre-Check Score: {auditScore}%
                    </span>
                    <span className="text-emerald-800">₹{selectedMilestone.escrowAmount.toLocaleString()} Escrow</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    This submission satisfies 100% of the client's criteria. Automated escrow capture will trigger upon submission.
                  </p>
                </div>

                <div className="text-xs text-slate-600 space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between">
                    <span>Deliverable Format:</span>
                    <strong className="text-slate-800 font-mono uppercase">{inputTab} submission</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>PayPal Escrow Reference:</span>
                    <strong className="text-slate-800 font-mono">{selectedMilestone.escrowId}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDeliverableSubmission}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Confirm & Transmit to Client
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Export Certified AI Audit Certificate (.PDF) */}
        {isCertificateOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setIsCertificateOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      CERT-{selectedMilestone.id}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Cryptographic Compliance Seal</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    PayPilot Milestone Verification Certificate
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Project:</span>
                    <strong className="text-slate-900">{selectedMilestone.projectTitle}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Milestone:</span>
                    <strong className="text-slate-900">{selectedMilestone.milestoneTitle}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Freelancer:</span>
                    <strong className="text-slate-900">Rahul Kumar</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Client:</span>
                    <strong className="text-slate-900">{selectedMilestone.clientName}</strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-slate-500">Verification Result:</span>
                    <strong className="text-emerald-700 font-bold">100% SPECIFICATIONS SATISFIED</strong>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">PayPal Escrow Auto-Release Authorized</strong>
                    This certificate is cryptographically recorded in the PayPal order ledger under escrow reference {selectedMilestone.escrowId}.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Certificate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCertificateOpen(false);
                      setToastMsg("Downloaded Certified AI Audit Certificate (.pdf)!");
                      setTimeout(() => setToastMsg(null), 3000);
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Save PDF
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
