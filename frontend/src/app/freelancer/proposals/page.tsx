"use client";

import { useState } from "react";
import { 
  FileText, Clock, CheckCircle2, AlertCircle, ArrowUpRight, 
  Search, Shield, DollarSign, MessageSquare, ChevronRight
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

interface ProposalItem {
  id: string;
  projectTitle: string;
  clientName: string;
  bidAmount: number;
  submittedDate: string;
  status: "ACTIVE" | "UNDER_REVIEW" | "ACCEPTED" | "DELIVERED";
  progress: number;
  milestoneDesc: string;
  paypalEscrowStatus: "SECURED" | "PENDING_RELEASE" | "PAID";
}

export default function FreelancerProposalsPage() {
  const [filter, setFilter] = useState<string>("ALL");

  const proposals: ProposalItem[] = [
    {
      id: "PROP-901",
      projectTitle: "React Dashboard for College Project",
      clientName: "Sarah Johnson",
      bidAmount: 3500,
      submittedDate: "Oct 6, 2026",
      status: "ACCEPTED",
      progress: 75,
      milestoneDesc: "Milestone 2: Dark mode components & API integration",
      paypalEscrowStatus: "SECURED"
    },
    {
      id: "PROP-902",
      projectTitle: "10-Page Technical Whitepaper on AI Agents",
      clientName: "FinTech Research Group",
      bidAmount: 2000,
      submittedDate: "Oct 8, 2026",
      status: "UNDER_REVIEW",
      progress: 100,
      milestoneDesc: "Deliverable 1: Complete report PDF submitted for AI verification",
      paypalEscrowStatus: "PENDING_RELEASE"
    },
    {
      id: "PROP-903",
      projectTitle: "FastAPI REST Microservice & Postgres Setup",
      clientName: "TechCorp Labs",
      bidAmount: 5000,
      submittedDate: "Oct 12, 2026",
      status: "ACTIVE",
      progress: 30,
      milestoneDesc: "Milestone 1: Database models & schema migrations",
      paypalEscrowStatus: "SECURED"
    },
    {
      id: "PROP-904",
      projectTitle: "Logo & Brand Kit Design for Startup",
      clientName: "Apex Digital",
      bidAmount: 1500,
      submittedDate: "Sep 28, 2026",
      status: "DELIVERED",
      progress: 100,
      milestoneDesc: "Final SVG and Figma vector files delivered & payout released",
      paypalEscrowStatus: "PAID"
    }
  ];

  const filteredProposals = proposals.filter((p) => {
    if (filter === "ALL") return true;
    return p.status === filter;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <AppSidebar activePage="my-projects" />

      <main className="flex-1 p-8 max-w-[1400px]">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase tracking-wider">
                Freelancer Portal
              </span>
              <span className="text-xs text-slate-400 font-medium">Contracts & Bids</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Proposals & Contracts</h1>
            <p className="text-slate-500 text-sm mt-0.5">Track your submitted bids, active milestone progress, and PayPal escrow states.</p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Active Bids</span>
            <div className="text-3xl font-black text-slate-900">4</div>
            <p className="text-xs text-emerald-600 font-semibold mt-2">2 under active milestone review</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Secured in Escrow</span>
            <div className="text-3xl font-black text-blue-600">₹8,500</div>
            <p className="text-xs text-slate-400 font-medium mt-2">Held safely in PayPal sandbox</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Completion Rate</span>
            <div className="text-3xl font-black text-slate-900">100%</div>
            <p className="text-xs text-slate-400 font-medium mt-2">All deliverables approved on time</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Total Released</span>
            <div className="text-3xl font-black text-emerald-600">₹28,500</div>
            <p className="text-xs text-slate-400 font-medium mt-2">Credited to PayPal balance</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {["ALL", "ACCEPTED", "UNDER_REVIEW", "ACTIVE", "DELIVERED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === tab 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono font-bold text-slate-400">{item.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === "ACCEPTED" ? "bg-emerald-100 text-emerald-800" :
                    item.status === "UNDER_REVIEW" ? "bg-amber-100 text-amber-800" :
                    item.status === "DELIVERED" ? "bg-blue-100 text-blue-800" : "bg-slate-100 text-slate-700"
                  }`}>
                    {item.status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Submitted {item.submittedDate}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{item.projectTitle}</h3>
                <p className="text-xs text-slate-600 font-medium mb-3">Client: <strong className="text-slate-800">{item.clientName}</strong></p>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 max-w-2xl mb-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                    <span>{item.milestoneDesc}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.progress === 100 ? "bg-emerald-500" : "bg-blue-600"
                      }`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>PayPal Escrow: <strong className="text-slate-800">{item.paypalEscrowStatus}</strong></span>
                </div>
              </div>

              <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                <div className="text-left md:text-right">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Bid Amount</span>
                  <span className="text-2xl font-black text-slate-900">₹{item.bidAmount.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link 
                    href="/freelancer/messages"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Message Client
                  </Link>
                  <Link 
                    href="/freelancer/ai"
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                  >
                    AI Verification <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
