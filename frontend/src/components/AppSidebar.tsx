"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Briefcase, FileText, DollarSign, MessageSquare, 
  Bot, Settings, Folder, Users, CreditCard, Flame, ArrowRight
} from "lucide-react";

interface AppSidebarProps {
  activePage: "dashboard" | "find-projects" | "my-projects" | "earnings" | "messages" | "ai" | "settings";
}

export default function AppSidebar({ activePage }: AppSidebarProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<"client" | "freelancer">("freelancer");

  useEffect(() => {
    // If the URL begins with /freelancer or is /dashboard/freelancer, force role to freelancer
    if (pathname.includes("/freelancer")) {
      setRole("freelancer");
      return;
    }

    try {
      const stored = localStorage.getItem("paypilot_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.role && user.role.toLowerCase() === "client") {
          setRole("client");
        } else {
          setRole("freelancer");
        }
      }
    } catch {
      // Default to freelancer
    }
  }, [pathname]);

  const isFreelancer = role === "freelancer";

  return (
    <aside className="w-[280px] bg-[#0B1120] text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand */}
      <Link href="/" className="p-6 flex items-center gap-3 mb-2 hover:opacity-90 transition-opacity">
        <div className="bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <span className="text-2xl font-bold text-white tracking-tight">PayPilot</span>
          <span className={`block text-[10px] font-bold tracking-wider uppercase ${isFreelancer ? "text-cyan-400" : "text-blue-400"}`}>
            {isFreelancer ? "Freelancer Portal" : "Client Portal"}
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {/* 1. Dashboard */}
        <Link 
          href={isFreelancer ? "/dashboard/freelancer" : "/dashboard/client"}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activePage === "dashboard"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
              : "hover:bg-slate-800/50 hover:text-white font-medium"
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        {isFreelancer ? (
          /* DEDICATED FREELANCER NAVIGATION PAGES */
          <>
            <Link 
              href="/freelancer/find-projects"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activePage === "find-projects"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
                  : "hover:bg-slate-800/50 hover:text-white font-medium"
              }`}
            >
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <span>Find Projects</span>
            </Link>

            <Link 
              href="/freelancer/proposals"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activePage === "my-projects"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
                  : "hover:bg-slate-800/50 hover:text-white font-medium"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span>My Proposals</span>
            </Link>

            <Link 
              href="/freelancer/earnings"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activePage === "earnings"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
                  : "hover:bg-slate-800/50 hover:text-white font-medium"
              }`}
            >
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Earnings & Payouts</span>
            </Link>

            <Link 
              href="/freelancer/messages"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                activePage === "messages"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
                  : "hover:bg-slate-800/50 hover:text-white font-medium"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            <Link 
              href="/freelancer/ai"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activePage === "ai"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
                  : "hover:bg-slate-800/50 hover:text-white font-medium"
              }`}
            >
              <Flame className="w-5 h-5 text-amber-400" />
              <span>AI Milestone Assistant</span>
            </Link>

            <Link 
              href="/freelancer/profile"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mt-4 ${
                activePage === "settings"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
                  : "hover:bg-slate-800/50 hover:text-white font-medium"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Profile & Skills</span>
            </Link>
          </>
        ) : (
          /* CLIENT NAVIGATION PAGES */
          <>
            <Link 
              href="/projects/new" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors text-blue-400 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              <span>Create Project</span>
            </Link>

            <Link 
              href="/transactions" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activePage === "my-projects"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
                  : "hover:bg-slate-800/50 hover:text-white font-medium"
              }`}
            >
              <Folder className="w-5 h-5" />
              <span>My Projects</span>
            </Link>

            <Link 
              href="/client/talent" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activePage === "find-projects"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
                  : "hover:bg-slate-800/50 hover:text-white font-medium"
              }`}
            >
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Find Freelancers</span>
            </Link>

            <Link 
              href="/transactions" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activePage === "earnings"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
                  : "hover:bg-slate-800/50 hover:text-white font-medium"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Transactions</span>
            </Link>

            <Link 
              href="/messages" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${
                activePage === "messages"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
                  : "hover:bg-slate-800/50 hover:text-white font-medium"
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            <Link 
              href="/ai" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activePage === "ai"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
                  : "hover:bg-slate-800/50 hover:text-white font-medium"
              }`}
            >
              <Bot className="w-5 h-5 text-blue-400" />
              <span>AI Assistant</span>
            </Link>

            <Link 
              href="/settings" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mt-4 ${
                activePage === "settings"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 font-bold"
                  : "hover:bg-slate-800/50 hover:text-white font-medium"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </>
        )}
      </nav>

      {/* Role Switcher in Sidebar footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 m-3 rounded-2xl">
        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1.5">Active Role</p>
        <Link 
          href={isFreelancer ? "/dashboard/client" : "/dashboard/freelancer"}
          className="flex items-center justify-between text-xs text-blue-400 hover:text-blue-300 font-semibold py-1 transition-colors"
        >
          <span>Switch to {isFreelancer ? "Client View" : "Freelancer View"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
