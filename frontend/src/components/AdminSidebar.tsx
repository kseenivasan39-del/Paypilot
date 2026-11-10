"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, ShieldAlert, Users, CreditCard, Activity, 
  Cpu, FileText, ArrowRight, Settings, Lock
} from "lucide-react";

interface AdminSidebarProps {
  activeTab?: string;
}

export default function AdminSidebar({ activeTab = "overview" }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { id: "overview", label: "Protocol Overview", icon: LayoutDashboard, href: "/admin" },
    { id: "disputes", label: "Dispute Arbitration", icon: ShieldAlert, href: "/admin?tab=disputes", badge: "1 Active" },
    { id: "escrow", label: "PayPal Escrow Vault", icon: Lock, href: "/admin?tab=escrow" },
    { id: "users", label: "User Management", icon: Users, href: "/admin?tab=users" },
    { id: "ai", label: "Gemini AI Verification Logs", icon: Cpu, href: "/admin?tab=ai" },
    { id: "audit", label: "System Audit Trail", icon: Activity, href: "/admin?tab=audit" }
  ];

  return (
    <aside className="w-[280px] bg-[#070B14] text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 select-none border-r border-slate-800">
      {/* Brand Header */}
      <Link href="/admin" className="p-6 flex items-center gap-3 mb-2 hover:opacity-90 transition-opacity">
        <div className="bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 rounded-xl p-2 shadow-lg shadow-purple-600/30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
            <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <span className="text-xl font-black text-white tracking-tight">PayPilot</span>
          <span className="block text-[10px] font-bold tracking-widest uppercase text-purple-400">
            Admin Governance
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Supervisory Controls
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-xs font-bold ${
                isActive
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-purple-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Switcher Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/40 m-3 rounded-2xl space-y-2">
        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Simulate Views</p>
        <Link 
          href="/dashboard/client"
          className="flex items-center justify-between text-xs text-blue-400 hover:text-blue-300 font-semibold py-1 transition-colors"
        >
          <span>Client Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link 
          href="/dashboard/freelancer"
          className="flex items-center justify-between text-xs text-cyan-400 hover:text-cyan-300 font-semibold py-1 transition-colors"
        >
          <span>Freelancer Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
