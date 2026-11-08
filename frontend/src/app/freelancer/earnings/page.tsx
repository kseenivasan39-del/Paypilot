"use client";

import { useState } from "react";
import { 
  DollarSign, Wallet, ArrowDownLeft, ShieldCheck, Download, 
  ExternalLink, CheckCircle2, Clock, AlertCircle, TrendingUp
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

interface PayoutRecord {
  id: string;
  orderId: string;
  projectTitle: string;
  client: string;
  amount: number;
  currency: string;
  status: "PAID" | "IN_ESCROW" | "PROCESSING";
  date: string;
  payoutMethod: string;
}

export default function FreelancerEarningsPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "PAID" | "IN_ESCROW">("ALL");

  const payouts: PayoutRecord[] = [
    {
      id: "PAY-801",
      orderId: "28S123456R7880123",
      projectTitle: "React Dashboard for College Project",
      client: "Sarah Johnson",
      amount: 3500,
      currency: "INR",
      status: "PAID",
      date: "Oct 6, 2026",
      payoutMethod: "PayPal Sandbox (rahul@paypilot.demo)"
    },
    {
      id: "PAY-802",
      orderId: "14X998877A1234567",
      projectTitle: "10-Page Technical Whitepaper on AI Agents",
      client: "FinTech Research Group",
      amount: 2000,
      currency: "INR",
      status: "IN_ESCROW",
      date: "Oct 8, 2026",
      payoutMethod: "PayPal Smart Escrow"
    },
    {
      id: "PAY-803",
      orderId: "99Z554433B4455667",
      projectTitle: "Logo & Brand Kit Design for Startup",
      client: "Apex Digital",
      amount: 1500,
      currency: "INR",
      status: "PAID",
      date: "Sep 28, 2026",
      payoutMethod: "PayPal Sandbox (rahul@paypilot.demo)"
    },
    {
      id: "PAY-804",
      orderId: "77K112233C8899001",
      projectTitle: "FastAPI REST Microservice & Postgres",
      client: "TechCorp Labs",
      amount: 5000,
      currency: "INR",
      status: "IN_ESCROW",
      date: "Oct 12, 2026",
      payoutMethod: "PayPal Smart Escrow"
    }
  ];

  const filteredPayouts = payouts.filter((p) => {
    if (activeTab === "ALL") return true;
    return p.status === activeTab;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <AppSidebar activePage="earnings" />

      <main className="flex-1 p-8 max-w-[1400px]">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase tracking-wider">
                Freelancer Portal
              </span>
              <span className="text-xs text-slate-400 font-medium">Finance & Invoices</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Earnings & Payouts</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your PayPal payouts, milestone releases, and tax-ready invoices.</p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Financial Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl shadow-blue-500/10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200 block mb-2">Available Balance</span>
            <div className="text-3xl font-black mb-1">₹20,000</div>
            <p className="text-xs text-blue-100 mb-4">Instant withdrawal to connected PayPal sandbox account</p>
            <button 
              type="button"
              className="px-4 py-2 bg-white text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" /> Withdraw via PayPal
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Held in PayPal Escrow</span>
            <div className="text-3xl font-black text-slate-900 mb-1">₹8,500</div>
            <p className="text-xs text-slate-500 mb-4">Secured by client deposits, releases upon AI deliverable approval</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4" /> 100% Escrow Protected
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">Lifetime Earnings</span>
            <div className="text-3xl font-black text-slate-900 mb-1">₹28,500</div>
            <p className="text-xs text-slate-500 mb-4">From 12 successfully delivered freelance milestones</p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
              <TrendingUp className="w-4 h-4" /> +12% increase from last month
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Payout & Escrow History</h2>
              <p className="text-xs text-slate-400 mt-0.5">Automated settlement logs powered by PayPal REST Orders & Captures</p>
            </div>

            <div className="flex items-center gap-2">
              {(["ALL", "PAID", "IN_ESCROW"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Payout ID</th>
                  <th className="pb-3">Project & Client</th>
                  <th className="pb-3">Destination</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredPayouts.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 font-mono font-bold text-slate-700">{row.id}</td>
                    <td className="py-4">
                      <p className="font-bold text-slate-900">{row.projectTitle}</p>
                      <p className="text-[11px] text-slate-400">Client: {row.client}</p>
                    </td>
                    <td className="py-4 text-slate-600">{row.payoutMethod}</td>
                    <td className="py-4 text-slate-500">{row.date}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        row.status === "PAID" ? "bg-emerald-100 text-emerald-800" :
                        row.status === "IN_ESCROW" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {row.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 text-right font-black text-slate-900 text-sm">
                      ₹{row.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
