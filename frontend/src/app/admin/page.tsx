"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  ShieldCheck, AlertTriangle, Users, DollarSign, CheckCircle2, 
  ExternalLink, ArrowUpRight, Lock, RefreshCw, X, Check, Search, Filter,
  FileText, Activity, ShieldAlert, Cpu, Database, Eye, Terminal,
  Zap, ArrowRight, UserCheck, Key, Shield, Download, Power, Sliders,
  PlusCircle, TrendingUp, HelpCircle
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

interface ChartPoint {
  day: string;
  gmv: number;
  escrow: number;
  contracts: number;
  x: number;
  yGmv: number;
  yEscrow: number;
}

function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  // Feature 1: Emergency Protocol Kill-Switch State
  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(false);
  const [showKillSwitchConfirm, setShowKillSwitchConfirm] = useState<boolean>(false);

  // Feature 5: Gemini AI Verification Threshold Slider
  const [aiThreshold, setAiThreshold] = useState<number>(85);

  // Feature 3: Global Filter & Search
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "LOCKED_IN_ESCROW" | "RELEASED" | "DISPUTED">("ALL");

  // Interactive Chart Hover State
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const [chartRange, setChartRange] = useState<"30D" | "14D" | "7D">("30D");

  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 142,
    totalClients: 58,
    totalFreelancers: 84,
    activeContracts: 19,
    totalVolumeINR: 263500,
    escrowLockedINR: 61000,
    disputesActive: 1,
    aiVerificationsPassed: 38
  });

  const chartData: ChartPoint[] = [
    { day: "Oct 12", gmv: 95000, escrow: 18000, contracts: 8, x: 20, yGmv: 105, yEscrow: 112 },
    { day: "Oct 17", gmv: 125000, escrow: 24000, contracts: 11, x: 100, yGmv: 90, yEscrow: 102 },
    { day: "Oct 22", gmv: 160000, escrow: 32000, contracts: 13, x: 180, yGmv: 74, yEscrow: 92 },
    { day: "Oct 27", gmv: 195000, escrow: 41000, contracts: 15, x: 260, yGmv: 58, yEscrow: 80 },
    { day: "Nov 01", gmv: 220000, escrow: 48000, contracts: 17, x: 340, yGmv: 45, yEscrow: 73 },
    { day: "Nov 06", gmv: 245000, escrow: 54000, contracts: 19, x: 420, yGmv: 30, yEscrow: 68 },
    { day: "Nov 10", gmv: stats.totalVolumeINR, escrow: stats.escrowLockedINR, contracts: 22, x: 480, yGmv: 16, yEscrow: 60 }
  ];

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

  // Mock contract injector
  const handleSimulateMockContract = () => {
    const mockId = `CON-${Math.floor(104 + Math.random() * 900)}`;
    const mockAmounts = [4200, 7500, 12000, 18500];
    const pickedAmount = mockAmounts[Math.floor(Math.random() * mockAmounts.length)];
    const mockTitles = [
      "Next.js E-Commerce Mobile App MVP",
      "FastAPI PayPal Webhook Microservice",
      "LangChain Agent Deliverable Evaluation",
      "Smart Contract Solidity Security Audit"
    ];
    const pickedTitle = mockTitles[Math.floor(Math.random() * mockTitles.length)];
    const mockFreelancers = ["Vikram Rathore", "Pooja Sharma", "Deepak Nair", "Kavita Sen"];
    const pickedFreelancer = mockFreelancers[Math.floor(Math.random() * mockFreelancers.length)];

    const newContract: EscrowContract = {
      id: mockId,
      projectTitle: pickedTitle,
      client: "Sarah Johnson",
      freelancer: pickedFreelancer,
      amount: pickedAmount,
      currency: "INR",
      paypalOrderId: `${Math.floor(10 + Math.random() * 89)}P${Math.floor(100000 + Math.random() * 900000)}B`,
      paypalCaptureId: `CAP-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "LOCKED_IN_ESCROW",
      aiVerificationScore: Math.floor(88 + Math.random() * 11),
      date: "Just now"
    };

    setContracts(prev => [newContract, ...prev]);
    setStats(prev => ({
      ...prev,
      totalVolumeINR: prev.totalVolumeINR + pickedAmount,
      escrowLockedINR: prev.escrowLockedINR + pickedAmount,
      activeContracts: prev.activeContracts + 1
    }));

    const logEntry: AuditLogItem = {
      id: Date.now(),
      event: "SANDBOX_SIMULATION_INJECTED",
      user: "admin@paypilot.demo",
      ip: "127.0.0.1",
      time: "Just now",
      status: "SUCCESS",
      details: `Simulated PayPal Order capture for ${mockId} (₹${pickedAmount.toLocaleString()}) funded into vault.`
    };
    setAuditLogs(prev => [logEntry, ...prev]);

    setActionSuccess(`Mock Contract ${mockId} (₹${pickedAmount.toLocaleString()} INR) successfully injected into PayPal Sandbox Escrow.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ["Contract ID", "Project Title", "Client", "Freelancer", "Amount (INR)", "PayPal Order ID", "AI Score (%)", "Escrow Status", "Platform Fee 3% (INR)", "GST 18% on Fee (INR)", "Date"];
    const rows = contracts.map(c => {
      const platformFee = Math.round(c.amount * 0.03);
      const gst = Math.round(platformFee * 0.18);
      return [
        c.id,
        `"${c.projectTitle.replace(/"/g, '""')}"`,
        `"${c.client}"`,
        `"${c.freelancer}"`,
        c.amount,
        c.paypalOrderId,
        c.aiVerificationScore,
        c.status,
        platformFee,
        gst,
        `"${c.date}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `paypilot_settlement_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionSuccess("Settlement ledger & GST tax reconciliation export downloaded successfully as CSV.");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Toggle Kill Switch
  const toggleKillSwitch = () => {
    const nextState = !killSwitchActive;
    setKillSwitchActive(nextState);
    setShowKillSwitchConfirm(false);

    const logEntry: AuditLogItem = {
      id: Date.now(),
      event: nextState ? "PROTOCOL_EMERGENCY_HALT" : "PROTOCOL_RESUMED",
      user: "admin@paypilot.demo",
      ip: "127.0.0.1",
      time: "Just now",
      status: nextState ? "CRITICAL" : "SUCCESS",
      details: nextState 
        ? "EMERGENCY HALT ACTIVATED: All automated PayPal releases and escrow disbursements are globally frozen."
        : "Emergency protocol lock lifted. Normal escrow disbursements restored."
    };
    setAuditLogs(prev => [logEntry, ...prev]);

    setActionSuccess(
      nextState 
        ? "⚠️ Emergency Protocol Kill-Switch ACTIVATED. All PayPal releases are frozen."
        : "✅ Protocol resumed. PayPal Escrow releases operational."
    );
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleResolveDispute = (decision: "RELEASE_TO_FREELANCER" | "REFUND_TO_CLIENT") => {
    if (!selectedDispute) return;

    if (killSwitchActive) {
      alert("Cannot execute releases: Emergency Protocol Kill-Switch is currently ACTIVE. Deactivate the kill-switch first.");
      return;
    }

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

  // Filtered Contracts
  const filteredContracts = contracts.filter((c) => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.freelancer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.paypalOrderId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      {/* LEFT SIDE: Deep Blue Navigation Sidebar */}
      <AdminSidebar activeTab={currentTab} />

      {/* RIGHT SIDE: Crisp White / Light Workspace */}
      <main className="flex-1 p-8 max-w-[1600px] flex flex-col bg-[#F8FAFC]">
        {/* TOP BAR: Dedicated Top-Right Utility Bar pinning the Admin Profile and Notifications to the absolute top-right corner */}
        <div className="flex items-center justify-end gap-3 pb-3 mb-2 border-b border-slate-100">
          <NotificationBell />
          <UserProfileMenu fallbackName="PayPilot Admin" fallbackRole="Admin" />
        </div>

        {/* Header with Title and Action Buttons */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                PayPilot Governance Command Center
              </span>
              <span className="text-xs text-slate-400 font-mono">v2.4.0 • Cluster SG-1</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Protocol Supervisory Dashboard
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              Live PayPal sandbox escrow surveillance, Gemini 1.5 deliverable auditing, and cryptographic arbitration.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowKillSwitchConfirm(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all shadow-xs ${
                killSwitchActive
                  ? "bg-red-600 text-white animate-pulse border border-red-700"
                  : "bg-white border border-slate-300 text-slate-700 hover:border-red-400 hover:text-red-600"
              }`}
            >
              <Power className={`w-3.5 h-3.5 ${killSwitchActive ? "text-white" : "text-red-500"}`} />
              <span>{killSwitchActive ? "EMERGENCY HALT" : "Emergency Kill-Switch"}</span>
            </button>

            <button
              onClick={handleSimulateMockContract}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs shadow-blue-500/20 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Inject Mock Escrow</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Ledger (CSV)</span>
            </button>
          </div>
        </header>

        {/* Kill Switch Alert Banner if Active */}
        {killSwitchActive && (
          <div className="mb-6 p-4 rounded-2xl bg-red-600 text-white text-xs font-bold flex items-center justify-between shadow-lg shadow-red-500/20 animate-in fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-200 shrink-0" />
              <div>
                <span className="block text-sm font-black">EMERGENCY PROTOCOL FREEZE ACTIVE</span>
                <span className="font-medium text-red-100">All automated releases, PayPal capture callbacks, and disbursements are paused globally.</span>
              </div>
            </div>
            <button
              onClick={toggleKillSwitch}
              className="px-4 py-1.5 bg-white text-red-700 font-black rounded-xl hover:bg-red-50 text-xs transition-colors shrink-0"
            >
              Deactivate Freeze
            </button>
          </div>
        )}

        {/* Action Success Toast Banner */}
        {actionSuccess && !killSwitchActive && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-3 shadow-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* 4 Analytics Metrics: White Cards with Crisp Borders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Volume (GMV)</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">₹{stats.totalVolumeINR.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">↑ 24.8% vs last month</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Locked in Escrow</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-indigo-700">₹{stats.escrowLockedINR.toLocaleString()}</div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">PayPal Sandbox Vault</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Disputes</span>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-red-600">{stats.disputesActive}</div>
            <span className="text-[11px] text-red-500 font-bold mt-1 inline-block">Awaiting Arbitration</span>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Verifications</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-700">{stats.aiVerificationsPassed}</div>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">97.4% Passed First Check</span>
          </div>
        </div>

        {/* Interactive Volume Chart & AI Threshold Tuner Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Feature 2: Interactive Escrow Volume Visualizer with Tooltips & Range Filter */}
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Escrow Volume & Liquidity Velocity
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hover over data points to inspect escrow values, contracts, and settlement velocity
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-100 p-0.5 rounded-xl flex text-[10px] font-bold text-slate-600">
                  <button 
                    onClick={() => setChartRange("7D")} 
                    className={`px-2 py-1 rounded-lg transition-all ${chartRange === "7D" ? "bg-white text-blue-600 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    7D
                  </button>
                  <button 
                    onClick={() => setChartRange("14D")} 
                    className={`px-2 py-1 rounded-lg transition-all ${chartRange === "14D" ? "bg-white text-blue-600 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    14D
                  </button>
                  <button 
                    onClick={() => setChartRange("30D")} 
                    className={`px-2 py-1 rounded-lg transition-all ${chartRange === "30D" ? "bg-white text-blue-600 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    30D
                  </button>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 text-xs font-black border border-blue-200">
                  Avg: 3.2 Days
                </span>
              </div>
            </div>

            {/* Interactive SVG Area Chart */}
            <div className="h-48 w-full relative pt-2 select-none">
              {/* Dynamic Interactive Tooltip Card */}
              {hoveredPoint && (
                <div 
                  className="absolute z-20 pointer-events-none bg-slate-900 text-white text-xs p-3 rounded-2xl shadow-xl border border-slate-700 transform -translate-x-1/2 -translate-y-full -top-1 transition-all duration-75"
                  style={{ left: `${(hoveredPoint.x / 500) * 100}%` }}
                >
                  <div className="font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-1">
                    {hoveredPoint.day} • {hoveredPoint.contracts} Contracts
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-300 font-semibold">Gross Volume:</span>
                    <span className="font-black text-blue-400">₹{hoveredPoint.gmv.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-300 font-semibold">Locked Escrow:</span>
                    <span className="font-black text-cyan-400">₹{hoveredPoint.escrow.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <svg 
                viewBox="0 0 500 120" 
                className="w-full h-full overflow-visible" 
                preserveAspectRatio="none"
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="escGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeWidth="1" />

                {/* Vertical hover guide bar */}
                {hoveredPoint && (
                  <line 
                    x1={hoveredPoint.x} 
                    y1="0" 
                    x2={hoveredPoint.x} 
                    y2="120" 
                    stroke="#3B82F6" 
                    strokeWidth="1.5" 
                    strokeDasharray="2 2" 
                  />
                )}

                {/* Volume Area */}
                <path
                  d="M 20 105 Q 80 95 100 90 T 180 74 T 260 58 T 340 45 T 420 30 T 480 16 L 480 120 L 20 120 Z"
                  fill="url(#volGrad)"
                />
                <path
                  d="M 20 105 Q 80 95 100 90 T 180 74 T 260 58 T 340 45 T 420 30 T 480 16"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3"
                />

                {/* Escrow Locked Line */}
                <path
                  d="M 20 112 Q 80 105 100 102 T 180 92 T 260 80 T 340 73 T 420 68 T 480 60 L 480 120 L 20 120 Z"
                  fill="url(#escGrad)"
                />
                <path
                  d="M 20 112 Q 80 105 100 102 T 180 92 T 260 80 T 340 73 T 420 68 T 480 60"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />

                {/* Interactive Clickable/Hoverable Data Points */}
                {chartData.map((pt, idx) => (
                  <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(pt)}>
                    {/* Invisible larger hit area */}
                    <circle cx={pt.x} cy={pt.yGmv} r="14" fill="transparent" />
                    
                    {/* Visual GMV Point */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.yGmv} 
                      r={hoveredPoint?.day === pt.day ? "6" : "3.5"} 
                      fill="#2563EB" 
                      stroke="#FFFFFF" 
                      strokeWidth="2"
                      className="transition-all duration-150"
                    />

                    {/* Visual Escrow Point */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.yEscrow} 
                      r={hoveredPoint?.day === pt.day ? "5" : "3"} 
                      fill="#06B6D4" 
                      stroke="#FFFFFF" 
                      strokeWidth="1.5"
                      className="transition-all duration-150"
                    />
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold border-t border-slate-100 pt-3 mt-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                  Gross Settled GMV (₹{stats.totalVolumeINR.toLocaleString()})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
                  Locked Escrow (₹{stats.escrowLockedINR.toLocaleString()})
                </span>
              </div>
              <span className="text-slate-400 font-mono">
                {hoveredPoint ? `Inspecting ${hoveredPoint.day}` : "Hover points for breakdown"}
              </span>
            </div>
          </div>

          {/* Gemini AI Threshold Controller */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  Gemini AI Quality Guard
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                  {aiThreshold}% Minimum
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 mt-1">Autonomous Release Threshold</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Deliverables meeting or exceeding this confidence score pass automatically. Scores below are flagged for human arbitration.
              </p>
            </div>

            <div className="my-4 space-y-3">
              <input
                type="range"
                min="70"
                max="98"
                step="1"
                value={aiThreshold}
                onChange={(e) => setAiThreshold(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span>70% (Permissive)</span>
                <span className="text-blue-600 font-extrabold">{aiThreshold}% (Current)</span>
                <span>98% (Strict)</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl text-[11px] text-blue-900 font-medium">
              Contracts below <strong>{aiThreshold}%</strong> will require dual administrator signatures before PayPal release.
            </div>
          </div>
        </div>

        {/* Escrow Contracts & Settlement Ledger with Search & Filter */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Live Escrow Contracts & Settlement Ledger</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Surveillance ledger of active, disputed, and released PayPal transactions.
                </p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by ID, client, or PayPal order..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-64"
                  />
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
                  <button
                    onClick={() => setStatusFilter("ALL")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${statusFilter === "ALL" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    All ({contracts.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("LOCKED_IN_ESCROW")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${statusFilter === "LOCKED_IN_ESCROW" ? "bg-white text-blue-700 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    Locked
                  </button>
                  <button
                    onClick={() => setStatusFilter("DISPUTED")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${statusFilter === "DISPUTED" ? "bg-white text-red-600 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    Disputed
                  </button>
                  <button
                    onClick={() => setStatusFilter("RELEASED")}
                    className={`px-2.5 py-1 rounded-lg transition-all ${statusFilter === "RELEASED" ? "bg-white text-emerald-700 shadow-xs" : "hover:text-slate-900"}`}
                  >
                    Released
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
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
                <tbody className="divide-y divide-slate-100">
                  {filteredContracts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                        No contracts match your search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredContracts.map((c) => (
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
                            c.aiVerificationScore >= aiThreshold 
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
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {c.status === "DISPUTED" ? (
                            <button
                              type="button"
                              onClick={() => setSelectedDispute(c)}
                              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-500/20 transition-all cursor-pointer"
                            >
                              Arbitrate Dispute
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-mono">Reconciled ✓</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tab 2: System Audit Trail Logs */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Cryptographic Security & Audit Logs</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Real-Time Event Stream</span>
            </div>

            <div className="space-y-3 font-mono text-xs max-h-80 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div 
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.status === "SUCCESS" 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                        : log.status === "CRITICAL"
                        ? "bg-red-600 text-white font-black"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                      {log.event}
                    </span>
                    <span className="text-slate-800 font-medium">{log.details}</span>
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

        {/* Emergency Kill Switch Modal Confirmation */}
        {showKillSwitchConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full border border-red-200 shadow-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {killSwitchActive ? "Deactivate Emergency Halt?" : "Activate Emergency Kill-Switch?"}
                  </h3>
                  <p className="text-xs text-slate-500">Requires Protocol Administrator Confirmation</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {killSwitchActive
                  ? "Deactivating the kill switch will unfreeze all pending PayPal webhooks, restore autonomous milestone verifications, and allow funds disbursement."
                  : "Activating the kill switch immediately halts all outgoing PayPal escrow payouts, freezes all active contracts, and puts arbitration into manual lockdown."
                }
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKillSwitchConfirm(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={toggleKillSwitch}
                  className={`flex-1 py-2.5 text-white font-black text-xs rounded-xl shadow-lg transition-all ${
                    killSwitchActive 
                      ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                      : "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                  }`}
                >
                  {killSwitchActive ? "Restore Protocol" : "CONFIRM EMERGENCY HALT"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dispute Resolution Modal */}
        {selectedDispute && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
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
                  <span>Locked Escrow:</span>
                  <strong className="text-blue-600 font-mono">₹{selectedDispute.amount.toLocaleString()} INR</strong>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Client:</span>
                  <span className="text-slate-800">{selectedDispute.client} (Requests refund)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Freelancer:</span>
                  <span className="text-slate-800">{selectedDispute.freelancer} (Submitted PR #42)</span>
                </div>
                {selectedDispute.disputeReason && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px]">
                    <strong>Client Note:</strong> {selectedDispute.disputeReason}
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between text-slate-600">
                  <span>Gemini 1.5 Verification:</span>
                  <span className="text-amber-700 font-bold">78% Match (Minor styling deviation)</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                As Protocol Administrator, choose the legally binding resolution. Releasing triggers the automated PayPal release webhook to the freelancer. Refunding returns the escrow to the client.
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
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex items-center justify-center text-xs">Loading Admin Command Center...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
