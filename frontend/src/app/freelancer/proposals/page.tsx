"use client";

import { useState, useRef, useEffect } from "react";
import { 
  FileText, Clock, CheckCircle2, AlertCircle, ArrowUpRight, 
  Search, Shield, DollarSign, MessageSquare, ChevronRight,
  ChevronDown, Check, Sparkles, UploadCloud, ExternalLink,
  Lock, Calendar, Eye, X, Send, Bot, FileCheck, Info,
  CheckCircle, ArrowRight, Zap, RefreshCw
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

interface ProposalItem {
  id: string;
  projectTitle: string;
  clientName: string;
  clientAvatar?: string;
  bidAmount: number;
  submittedDate: string;
  dueDate: string;
  daysRemaining: number;
  status: "ACCEPTED" | "UNDER_REVIEW" | "ACTIVE" | "DELIVERED";
  step: 1 | 2 | 3 | 4; // 1: Accepted, 2: In Progress, 3: Under Review, 4: Released
  progress: number;
  milestoneTitle: string;
  milestoneDesc: string;
  paypalEscrowStatus: "SECURED" | "PENDING_RELEASE" | "PAID";
  escrowId: string;
  autoReleaseEligible: boolean;
  deliverablesSummary: string[];
}

export default function FreelancerProposalsPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"recent" | "bid_high" | "due_soon">("due_soon");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Modal / Drawer state for "Submit Deliverable"
  const [submitModalItem, setSubmitModalItem] = useState<ProposalItem | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [deliverableNotes, setDeliverableNotes] = useState("");
  const [isAiPrechecking, setIsAiPrechecking] = useState(false);
  const [aiPrecheckResult, setAiPrecheckResult] = useState<{ score: number; verdict: string; details: string[] } | null>(null);

  // Modal for Contract Detail Inspector
  const [detailModalItem, setDetailModalItem] = useState<ProposalItem | null>(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const proposals: ProposalItem[] = [
    {
      id: "PROP-901",
      projectTitle: "React Dashboard for College Project",
      clientName: "Sarah Johnson",
      bidAmount: 3500,
      submittedDate: "Oct 6, 2026",
      dueDate: "Aug 12, 2026",
      daysRemaining: 4,
      status: "ACCEPTED",
      step: 2,
      progress: 75,
      milestoneTitle: "Milestone 2 of 3: Dark Mode & API Integration",
      milestoneDesc: "Implement dynamic theme toggles, Chart.js responsiveness, and Next.js route handlers.",
      paypalEscrowStatus: "SECURED",
      escrowId: "PP-ESC-94821",
      autoReleaseEligible: true,
      deliverablesSummary: [
        "Interactive dark mode components with tailwind variants",
        "Clean TypeScript API client for mock telemetry endpoints",
        "85%+ unit test coverage for dashboard widgets"
      ]
    },
    {
      id: "PROP-902",
      projectTitle: "10-Page Technical Whitepaper on AI Agents",
      clientName: "FinTech Research Group",
      bidAmount: 2000,
      submittedDate: "Oct 8, 2026",
      dueDate: "Aug 10, 2026",
      daysRemaining: 2,
      status: "UNDER_REVIEW",
      step: 3,
      progress: 100,
      milestoneTitle: "Deliverable 1 of 1: Complete 10-Page Whitepaper PDF",
      milestoneDesc: "Complete report PDF submitted for automated AI multi-factor verification.",
      paypalEscrowStatus: "PENDING_RELEASE",
      escrowId: "PP-ESC-83712",
      autoReleaseEligible: true,
      deliverablesSummary: [
        "Full 10-page research synthesis on autonomous transaction arbitration",
        "KaTeX LaTeX formula integration for escrow timeout algorithms",
        "High-res architecture schematics in vector PDF"
      ]
    },
    {
      id: "PROP-903",
      projectTitle: "FastAPI REST Microservice & Postgres Setup",
      clientName: "TechCorp Labs",
      bidAmount: 5000,
      submittedDate: "Oct 12, 2026",
      dueDate: "Aug 18, 2026",
      daysRemaining: 10,
      status: "ACTIVE",
      step: 2,
      progress: 30,
      milestoneTitle: "Milestone 1 of 2: Database Schema & Auth Endpoints",
      milestoneDesc: "Set up SQLAlchemy models, Alembic migrations, and JWT bearer token handlers.",
      paypalEscrowStatus: "SECURED",
      escrowId: "PP-ESC-67194",
      autoReleaseEligible: false,
      deliverablesSummary: [
        "Alembic auto-generated schema migrations for accounts and transactions",
        "FastAPI OpenAPI auto-documentation verified without schema errors",
        "Docker Compose stack ready for zero-config local run"
      ]
    },
    {
      id: "PROP-904",
      projectTitle: "Logo & Brand Kit Design for Startup",
      clientName: "Apex Digital",
      bidAmount: 1500,
      submittedDate: "Sep 28, 2026",
      dueDate: "Oct 2, 2026",
      daysRemaining: 0,
      status: "DELIVERED",
      step: 4,
      progress: 100,
      milestoneTitle: "Final Deliverable: Brand Guidelines & Assets",
      milestoneDesc: "Final SVG and Figma vector files verified and payout released to PayPal wallet.",
      paypalEscrowStatus: "PAID",
      escrowId: "PP-ESC-33109",
      autoReleaseEligible: true,
      deliverablesSummary: [
        "Exported vector logo variants (SVG, PDF, PNG with alpha transparency)",
        "Typography hierarchy and primary brand HEX/RGB palette",
        "Figma design system token export"
      ]
    }
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter & Search Logic
  const filteredProposals = proposals.filter((p) => {
    const matchesFilter = filter === "ALL" || p.status === filter;
    const matchesQuery = 
      p.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.escrowId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === "bid_high") return b.bidAmount - a.bidAmount;
    if (sortBy === "due_soon") return a.daysRemaining - b.daysRemaining;
    return 0; // default recent
  });

  const getStatusCount = (statusKey: string) => {
    if (statusKey === "ALL") return proposals.length;
    return proposals.filter((p) => p.status === statusKey).length;
  };

  const sortOptions = [
    { value: "due_soon", label: "Due Soonest" },
    { value: "bid_high", label: "Highest Bid (₹)" },
    { value: "recent", label: "Recently Submitted" }
  ];

  const handleSimulateAiPrecheck = () => {
    if (!repoUrl && !deliverableNotes) {
      alert("Please enter a deliverable link or submission notes.");
      return;
    }
    setIsAiPrechecking(true);
    setAiPrecheckResult(null);

    setTimeout(() => {
      setIsAiPrechecking(false);
      setAiPrecheckResult({
        score: 97,
        verdict: "Ready for Auto-Release",
        details: [
          "Verified responsive components on mobile & desktop viewports",
          "Passes TypeScript strict type check with zero errors",
          "Clean git commit history with descriptive messages"
        ]
      });
    }, 1200);
  };

  const handleConfirmSubmission = () => {
    if (!submitModalItem) return;
    setToastMsg(`Milestone deliverable for ${submitModalItem.id} submitted! Client & AI auditor notified.`);
    setSubmitModalItem(null);
    setRepoUrl("");
    setDeliverableNotes("");
    setAiPrecheckResult(null);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <AppSidebar activePage="my-projects" />

      <main className="flex-1 p-8 max-w-[1400px]">
        {/* Toast Notification */}
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
              <span className="text-xs text-slate-400 font-semibold">• Contracts, Escrows & Deliverables</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Proposals & Contracts</h1>
            <p className="text-slate-500 text-sm mt-0.5">Track your submitted bids, deliverable milestones, and PayPal escrow states in real time.</p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Modern 2026 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Bids</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">4</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>2 under active milestone review</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secured in Escrow</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                <Lock className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-blue-600">₹8,500</div>
            <p className="text-xs text-slate-400 font-medium mt-2 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Held safely in PayPal smart escrow</span>
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completion Rate</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-slate-900">100%</div>
            <p className="text-xs text-emerald-600 font-semibold mt-2">All deliverables approved on time</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Released</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-600">₹28,500</div>
            <p className="text-xs text-slate-400 font-medium mt-2">Credited to PayPal sandbox wallet</p>
          </div>
        </div>

        {/* Search, Filter Tabs & Custom Sort Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Live Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contract, client name, or PROP id..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Custom Sort Dropdown */}
            <div className="relative shrink-0" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition-colors"
              >
                <span className="text-slate-400 font-medium">Sort:</span>
                <span className="font-bold text-slate-900">
                  {sortOptions.find((o) => o.value === sortBy)?.label}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-30 animate-in fade-in zoom-in-95 duration-100">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value as any);
                        setIsSortOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                        sortBy === opt.value 
                          ? "bg-blue-50 text-blue-600 font-bold" 
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortBy === opt.value && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Filter Pills with Badge Counters */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {[
              { id: "ALL", label: "All Proposals" },
              { id: "ACCEPTED", label: "Accepted" },
              { id: "UNDER_REVIEW", label: "Under Review" },
              { id: "ACTIVE", label: "Active" },
              { id: "DELIVERED", label: "Delivered & Released" }
            ].map((tab) => {
              const count = getStatusCount(tab.id);
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20" 
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-200/80 text-slate-700"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Proposals List with Interactive Cards */}
        <div className="space-y-5">
          {filteredProposals.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm">
              <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No contracts matching your criteria</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Try clearing search terms or switching the proposal status tabs above.</p>
              <button
                type="button"
                onClick={() => { setFilter("ALL"); setSearchQuery(""); }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredProposals.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                {/* Status Bar Left Indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  item.status === "ACCEPTED" ? "bg-emerald-500" :
                  item.status === "UNDER_REVIEW" ? "bg-amber-500" :
                  item.status === "DELIVERED" ? "bg-blue-600" : "bg-slate-400"
                }`} />

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pl-2">
                  
                  {/* Left Column: Metadata, Title, Stepper, Milestone */}
                  <div className="flex-1 space-y-4">
                    
                    {/* Header line: ID, Status Badge, Due Countdown */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {item.id}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                        item.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        item.status === "UNDER_REVIEW" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        item.status === "DELIVERED" ? "bg-blue-50 text-blue-700 border border-blue-200" : 
                        "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === "ACCEPTED" ? "bg-emerald-500" :
                          item.status === "UNDER_REVIEW" ? "bg-amber-500 animate-pulse" :
                          item.status === "DELIVERED" ? "bg-blue-500" : "bg-slate-400"
                        }`}></span>
                        {item.status.replace("_", " ")}
                      </span>

                      {/* Due Countdown Pill */}
                      {item.daysRemaining > 0 ? (
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                          item.daysRemaining <= 3 
                            ? "bg-rose-50 text-rose-700 border border-rose-200" 
                            : "bg-slate-50 text-slate-600 border border-slate-200"
                        }`}>
                          <Clock className={`w-3 h-3 ${item.daysRemaining <= 3 ? "text-rose-600" : "text-slate-400"}`} />
                          {item.daysRemaining <= 3 ? `Urgent: Due in ${item.daysRemaining} days (${item.dueDate})` : `Due ${item.dueDate}`}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Completed on {item.dueDate}
                        </span>
                      )}

                      <span className="text-xs text-slate-400 font-medium ml-auto sm:ml-0">
                        Submitted {item.submittedDate}
                      </span>
                    </div>

                    {/* Project Title & Client Details */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setDetailModalItem(item)}>
                        {item.projectTitle}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                        <span>Client:</span>
                        <strong className="text-slate-800 font-semibold">{item.clientName}</strong>
                        <span className="text-slate-300">•</span>
                        <span className="font-mono text-[11px] text-slate-400">Escrow ID: {item.escrowId}</span>
                      </p>
                    </div>

                    {/* Milestone Progress Stepper */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                      
                      {/* Step Labels */}
                      <div className="grid grid-cols-4 gap-2 text-[11px] font-bold mb-2">
                        <div className={`flex items-center gap-1 ${item.step >= 1 ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${item.step >= 1 ? "text-emerald-600" : "text-slate-300"}`} />
                          <span>1. Bid Accepted</span>
                        </div>
                        <div className={`flex items-center gap-1 ${item.step >= 2 ? "text-blue-700 font-bold" : "text-slate-400"}`}>
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black ${item.step >= 2 ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}>2</div>
                          <span>2. In Progress</span>
                        </div>
                        <div className={`flex items-center gap-1 ${item.step >= 3 ? "text-amber-700 font-bold" : "text-slate-400"}`}>
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black ${item.step >= 3 ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-500"}`}>3</div>
                          <span>3. Verification</span>
                        </div>
                        <div className={`flex items-center gap-1 ${item.step >= 4 ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${item.step >= 4 ? "text-emerald-600" : "text-slate-300"}`} />
                          <span>4. Released</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden mb-2.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${
                            item.progress === 100 ? "bg-emerald-500" : "bg-blue-600"
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-700">
                        <span className="font-bold text-slate-800">{item.milestoneTitle}</span>
                        <span className="font-mono text-slate-500 text-[11px] font-semibold">{item.progress}% Completed</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{item.milestoneDesc}</p>
                    </div>

                    {/* Escrow Security & Auto-Release Status Tag */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-blue-50/70 border border-blue-100 px-3 py-1 rounded-lg">
                        <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>PayPal Escrow:</span>
                        <strong className="text-blue-900 font-bold">{item.paypalEscrowStatus}</strong>
                      </div>

                      {item.autoReleaseEligible ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>AI Auto-Release Eligible</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                          <Info className="w-3 h-3 text-slate-400" />
                          <span>Manual Client Sign-off</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setDetailModalItem(item)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Scope & Specs
                      </button>
                    </div>

                  </div>

                  {/* Right Column: Bid Amount & Primary Action Buttons */}
                  <div className="shrink-0 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Agreed Contract</span>
                      <span className="text-2xl font-black text-slate-900">₹{item.bidAmount.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 block font-medium">Guaranteed Escrow</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link 
                        href="/freelancer/messages"
                        className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> Message
                      </Link>

                      {item.status === "DELIVERED" ? (
                        <Link
                          href="/freelancer/earnings"
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 cursor-pointer"
                        >
                          <FileCheck className="w-3.5 h-3.5" /> View Receipt
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSubmitModalItem(item);
                            setRepoUrl("");
                            setDeliverableNotes("");
                            setAiPrecheckResult(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
                        >
                          <UploadCloud className="w-3.5 h-3.5" /> Submit Work
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: Submit Deliverable & Instant AI Pre-check */}
        {submitModalItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setSubmitModalItem(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                  {submitModalItem.id}
                </span>
                <span className="text-xs text-slate-400 font-medium">Deliverable Submission</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mb-1">
                Submit Milestone Work
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Target: <strong className="text-slate-700">{submitModalItem.milestoneTitle}</strong> for client <strong className="text-slate-700">{submitModalItem.clientName}</strong>.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    GitHub PR, Figma URL, or Google Drive Link
                  </label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/myteam/repo/pull/12 or https://figma.com/file/..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Implementation Notes & Test Evidence
                  </label>
                  <textarea
                    rows={3}
                    value={deliverableNotes}
                    onChange={(e) => setDeliverableNotes(e.target.value)}
                    placeholder="Explain completed criteria, dark mode screenshots, API responses, or attached test logs..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* AI Pre-Check Action Card */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/40 rounded-2xl border border-blue-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900">PayPilot AI Pre-Audit</span>
                    </div>
                    <button
                      type="button"
                      disabled={isAiPrechecking}
                      onClick={handleSimulateAiPrecheck}
                      className="px-3 py-1 bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {isAiPrechecking ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                          <span>Auditing Deliverable...</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-blue-600" />
                          <span>Run AI Pre-check</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Verify that your submission satisfies all client requirements before locking it in for client sign-off or instant PayPal capture.
                  </p>

                  {/* AI Results */}
                  {aiPrecheckResult && (
                    <div className="mt-2 p-3 bg-white rounded-xl border border-emerald-200 animate-in fade-in">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {aiPrecheckResult.verdict}
                        </span>
                        <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {aiPrecheckResult.score}% Criteria Met
                        </span>
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-600 pl-4 list-disc">
                        {aiPrecheckResult.details.map((d, idx) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmitModalItem(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSubmission}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit to Client & Escrow
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Contract & Scope Inspector */}
        {detailModalItem && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                  {detailModalItem.id}
                </span>
                <span className="text-xs text-slate-400 font-medium">Smart Contract Overview</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">
                {detailModalItem.projectTitle}
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Client: <strong className="text-slate-800">{detailModalItem.clientName}</strong> • Escrow: <strong className="text-blue-600">{detailModalItem.escrowId}</strong>
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Agreed Budget</span>
                    <span className="text-lg font-black text-slate-900">₹{detailModalItem.bidAmount.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Escrow State</span>
                    <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded inline-block mt-1">
                      {detailModalItem.paypalEscrowStatus}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Deadline</span>
                    <span className="text-xs font-bold text-slate-800 block mt-1">{detailModalItem.dueDate}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-blue-600" /> Required Deliverable Checklist
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {detailModalItem.deliverablesSummary.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <strong className="text-blue-900 font-bold block mb-0.5">PayPal Smart Escrow Guarantee</strong>
                    Funds for this milestone have been authorized and locked in escrow. Once deliverables are submitted and verified by PayPilot AI, capture is automatically executed without delayed payment terms.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDetailModalItem(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <Link
                    href="/freelancer/ai"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    Open AI Milestone Assistant <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
