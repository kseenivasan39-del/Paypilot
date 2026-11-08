"use client";

import { useState, useEffect } from "react";
import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings, 
  Bell, Calendar, ChevronDown, Wallet, FileText, Clock, CheckCircle2, 
  Code2, PenTool, Sparkles, TrendingUp, ArrowUpRight, X, LogOut, Check,
  ExternalLink, UserCheck, Shield, RefreshCw, AlertCircle
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import { useRouter } from "next/navigation";
import { authApi, projectsApi, transactionsApi, notificationsApi } from "@/lib/api";

type Currency = "INR" | "USD" | "EUR";

interface CurrencyConfig {
  symbol: string;
  rate: number; // multiplier against INR base
}

const CURRENCIES: Record<Currency, CurrencyConfig> = {
  INR: { symbol: "₹", rate: 1 },
  USD: { symbol: "$", rate: 0.012 },
  EUR: { symbol: "€", rate: 0.011 }
};

interface FreelancerModalData {
  name: string;
  role: string;
  rating: number;
  reviews: number;
  matchScore: number;
  hourlyRateINR: number;
  skills: string[];
  bio: string;
  completedJobs: number;
}

export default function ClientDashboard() {
  const router = useRouter();

  // Currency State
  const [currency, setCurrency] = useState<Currency>("INR");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Top header dropdowns
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Freelancer profile modal
  const [selectedFreelancer, setSelectedFreelancer] = useState<FreelancerModalData | null>(null);

  // Dynamic user data
  const [roleClashWarning, setRoleClashWarning] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>({
    full_name: "Sarah Johnson",
    email: "client@paypilot.demo",
    role: "client"
  });

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Deliverable Ready for Review", time: "10 mins ago", unread: true, message: "Rahul Kumar submitted milestone 2 deliverables for React Dashboard." },
    { id: 2, title: "Milestone Payment Processed", time: "2 hours ago", unread: true, message: "PayPal sandbox payment of ₹3,500 successfully captured." },
    { id: 3, title: "AI Verification Passed", time: "Yesterday", unread: false, message: "Solar Power Report passed AI compliance audit (96% match score)." }
  ]);

  // Load user from storage or API on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("paypilot_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.role && user.role.toLowerCase() === "freelancer") {
          setRoleClashWarning(true);
        } else {
          setCurrentUser(user);
          setRoleClashWarning(false);
        }
      }
    } catch {
      // Keep default
    }
  }, []);

  const formatAmount = (baseInr: number) => {
    const config = CURRENCIES[currency];
    const converted = Math.round(baseInr * config.rate);
    return `${config.symbol}${converted.toLocaleString()}`;
  };

  const handleSwitchToDemoClient = async () => {
    try {
      const res = await authApi.loginAsDemoClient();
      if (res?.user) setCurrentUser(res.user);
    } catch (e) { console.error(e); }
  };

  const handleSignOut = () => {
    authApi.logout();
    router.push("/login");
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      
      {/* Sidebar */}
      <AppSidebar activePage="dashboard" />

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-[1600px]">
        {/* Role Clash Warning Banner if Freelancer is logged in */}
        {roleClashWarning && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">You are logged in as a Freelancer (Rahul)</p>
                <p className="text-[11px] text-amber-700">You are currently looking at the Client dashboard view.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/freelancer" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors">
                Go to Freelancer Dashboard &rarr;
              </Link>
              <button type="button" onClick={handleSwitchToDemoClient} className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 rounded-xl text-xs font-bold transition-colors cursor-pointer">
                Switch to Client (Sarah)
              </button>
            </div>
          </div>
        )}
        
        {/* Header */}
        <header className="flex justify-between items-end mb-8 relative">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
              Welcome back, {currentUser.full_name?.split(" ")[0] || "Sarah"}! <span className="text-3xl">👋</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Here's an overview of your projects and payments.</p>
          </div>

          <div className="flex items-center gap-4 relative">
            
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowCalendar(false);
                  setShowCurrencyDropdown(false);
                  setShowProfileMenu(false);
                }}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 relative hover:bg-slate-50 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 text-sm">Notifications ({unreadCount})</span>
                    <button 
                      onClick={handleMarkAllNotificationsRead}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-2.5 rounded-xl text-left transition-colors ${n.unread ? "bg-blue-50/70" : "hover:bg-slate-50"}`}>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                          <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-center">
                    <Link href="/settings/notifications" className="text-xs font-semibold text-slate-500 hover:text-blue-600">
                      Manage notification preferences &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Messages Icon */}
            <Link 
              href="/messages"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors relative"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </Link>

            {/* Calendar Icon */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowCalendar(!showCalendar);
                  setShowNotifications(false);
                  setShowCurrencyDropdown(false);
                  setShowProfileMenu(false);
                }}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Project Deadlines & Calendar"
              >
                <Calendar className="w-5 h-5" />
              </button>

              {/* Calendar Deadlines Modal */}
              {showCalendar && (
                <div className="absolute right-0 top-12 w-84 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-900 text-sm">Upcoming Deadlines</span>
                    </div>
                    <button onClick={() => setShowCalendar(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Aug 12, 2026</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">React Dashboard for College Project</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Milestone 2 Delivery by Rahul Kumar</p>
                    </div>
                    <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100">
                      <span className="text-[10px] font-bold text-orange-600 uppercase">Aug 8, 2026</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">10-Page Solar Power Report</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Final Review Submission by Arjun Menon</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Aug 5, 2026 (Completed)</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">Logo Design for Startup</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Priya Sharma — Delivered & Approved</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Currency Selector */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowCurrencyDropdown(!showCurrencyDropdown);
                  setShowNotifications(false);
                  setShowCalendar(false);
                  setShowProfileMenu(false);
                }}
                className="h-10 bg-white rounded-full flex items-center px-4 shadow-sm border border-slate-200 ml-2 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <span className="font-semibold text-slate-700 text-sm mr-2">{CURRENCIES[currency].symbol} {currency}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {showCurrencyDropdown && (
                <div className="absolute right-0 top-12 w-36 bg-white rounded-xl shadow-lg border border-slate-100 p-1.5 z-50">
                  {(["INR", "USD", "EUR"] as Currency[]).map((cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        setCurrency(cur);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${currency === cur ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <span>{CURRENCIES[cur].symbol} {cur}</span>
                      {currency === cur && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Avatar & Menu */}
            <div className="relative ml-2">
              <button 
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                  setShowCalendar(false);
                  setShowCurrencyDropdown(false);
                }}
                className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-slate-500 relative cursor-pointer hover:opacity-90 transition-opacity"
              >
                <Users className="w-5 h-5" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                  <div className="p-3 border-b border-slate-100">
                    <p className="font-bold text-slate-900 text-sm">{currentUser.full_name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded mt-1.5 uppercase">
                      {currentUser.role || "Client"}
                    </span>
                  </div>
                  <div className="py-1">
                    <button type="button" onClick={() => { setShowProfileMenu(false); handleSwitchToDemoClient(); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer text-left"><RefreshCw className="w-4 h-4" /><span>Switch to Client</span></button>
                    <Link 
                      href="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings & Profile</span>
                    </Link>
                    <Link 
                      href="/settings/account"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      <span>Account Preferences</span>
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
              <Wallet className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <h3 className="text-[1.75rem] font-bold text-blue-600 leading-none">{formatAmount(12450)}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 mb-2">Total Spent</p>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                <span>+12% from last month</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7 text-purple-500" />
            </div>
            <div>
              <h3 className="text-[1.75rem] font-bold text-purple-600 leading-none">3</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 mb-2">Active Projects</p>
              <div className="flex items-center gap-1 text-xs font-semibold text-purple-600">
                <ArrowUpRight className="w-3 h-3" />
                <span>2 new this week</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
              <Clock className="w-7 h-7 text-orange-500" />
            </div>
            <div>
              <h3 className="text-[1.75rem] font-bold text-orange-600 leading-none">2</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 mb-2">Awaiting Review</p>
              <div className="flex items-center gap-1 text-xs font-semibold text-orange-600">
                <ArrowUpRight className="w-3 h-3" />
                <span>1 due this week</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-[1.75rem] font-bold text-emerald-600 leading-none">8</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 mb-2">Completed</p>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                <span>+3 this month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-[1.5fr_1fr] gap-8">
          
          {/* Left Column: Recent Projects */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Projects</h2>
                <Link href="/transactions" className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1">
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-6">
                {/* Project 1 */}
                <Link 
                  href="/projects/payment"
                  className="flex items-center justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0 hover:bg-slate-50/50 p-2 rounded-2xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#6366f1] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <Code2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">React Dashboard for College Project</h3>
                      <p className="text-slate-500 text-sm font-medium mt-0.5">Web Development</p>
                      <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Aug 12, 2026</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 4 Proposals</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-2xl text-slate-900 mb-2">{formatAmount(3500)}</div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> In Progress
                    </span>
                  </div>
                </Link>

                {/* Project 2 */}
                <Link 
                  href="/projects/verification"
                  className="flex items-center justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0 hover:bg-slate-50/50 p-2 rounded-2xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#0ea5e9] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">10-Page Solar Power Report</h3>
                      <p className="text-slate-500 text-sm font-medium mt-0.5">Technical Writing</p>
                      <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Aug 8, 2026</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 6 Proposals</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-2xl text-slate-900 mb-2">{formatAmount(2000)}</div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Review Pending
                    </span>
                  </div>
                </Link>

                {/* Project 3 */}
                <Link 
                  href="/transactions"
                  className="flex items-center justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0 hover:bg-slate-50/50 p-2 rounded-2xl transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#06b6d4] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                      <PenTool className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">Logo Design for Startup</h3>
                      <p className="text-slate-500 text-sm font-medium mt-0.5">Graphic Design</p>
                      <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-slate-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Aug 5, 2026</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 3 Proposals</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-2xl text-slate-900 mb-2">{formatAmount(1500)}</div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Completed
                    </span>
                  </div>
                </Link>

              </div>
            </div>
          </div>

          {/* Right Column: AI Recommendations & Recent Transactions */}
          <div className="space-y-6">
            
            {/* AI Recommendations */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2">
                  <Sparkles className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                  <div>
                    <h2 className="text-[1.3rem] font-bold text-slate-900 tracking-tight">AI Recommendations</h2>
                    <p className="text-sm font-medium text-slate-500">Based on your past projects and verified skills</p>
                  </div>
                </div>
                <Link href="/projects/matching" className="text-blue-600 font-semibold text-sm hover:underline whitespace-nowrap mt-1">
                  View All &rarr;
                </Link>
              </div>

              <div className="space-y-4">
                {/* Freelancer 1 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 shrink-0 overflow-hidden flex items-center justify-center text-blue-600 font-bold">
                      RK
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Rahul Kumar</h4>
                      <p className="text-xs font-medium text-slate-500">Full Stack Developer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">98% match</span>
                    <button 
                      onClick={() => setSelectedFreelancer({
                        name: "Rahul Kumar",
                        role: "Full Stack Developer",
                        rating: 4.9,
                        reviews: 127,
                        matchScore: 98,
                        hourlyRateINR: 800,
                        skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
                        bio: "Senior full stack engineer specializing in production-ready Next.js apps, performant dashboards, and clean RESTful API integration.",
                        completedJobs: 42
                      })}
                      className="px-4 py-1.5 rounded-full border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>

                {/* Freelancer 2 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 shrink-0 overflow-hidden flex items-center justify-center text-purple-600 font-bold">
                      PS
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Priya Sharma</h4>
                      <p className="text-xs font-medium text-slate-500">UI/UX Designer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">95% match</span>
                    <button 
                      onClick={() => setSelectedFreelancer({
                        name: "Priya Sharma",
                        role: "UI/UX Designer",
                        rating: 4.8,
                        reviews: 89,
                        matchScore: 95,
                        hourlyRateINR: 650,
                        skills: ["Figma", "UI/UX Design", "Wireframing", "Tailwind CSS", "Design Systems"],
                        bio: "Experienced product designer crafting intuitive SaaS dashboards, accessible component libraries, and interactive design prototypes.",
                        completedJobs: 38
                      })}
                      className="px-4 py-1.5 rounded-full border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>

                {/* Freelancer 3 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100 shrink-0 overflow-hidden flex items-center justify-center text-amber-600 font-bold">
                      AM
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Arjun Menon</h4>
                      <p className="text-xs font-medium text-slate-500">Python Developer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">92% match</span>
                    <button 
                      onClick={() => setSelectedFreelancer({
                        name: "Arjun Menon",
                        role: "Python Developer & Technical Writer",
                        rating: 4.7,
                        reviews: 64,
                        matchScore: 92,
                        hourlyRateINR: 700,
                        skills: ["Python", "FastAPI", "Technical Writing", "Data Analysis", "PostgreSQL"],
                        bio: "Backend developer and technical writer with strong expertise in research papers, API engineering, and machine learning pipelines.",
                        completedJobs: 29
                      })}
                      className="px-4 py-1.5 rounded-full border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-100 p-1.5 rounded-lg">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-[1.3rem] font-bold text-slate-900 tracking-tight">Recent Transactions</h2>
                </div>
                <Link href="/transactions" className="text-blue-600 font-semibold text-sm hover:underline">
                  View All &rarr;
                </Link>
              </div>

              <table className="w-full text-sm text-left">
                <thead className="text-xs font-semibold text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium text-right">Amount</th>
                    <th className="pb-3 font-medium text-center">Status</th>
                    <th className="pb-3 font-medium text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr 
                    onClick={() => router.push("/transactions")}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-3 text-slate-500 font-mono text-xs">PP-1001</td>
                    <td className="py-3 font-semibold text-slate-900">React Dashboard</td>
                    <td className="py-3 font-bold text-slate-900 text-right">{formatAmount(3500)}</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[11px] font-bold">Completed</span>
                    </td>
                    <td className="py-3 text-slate-500 text-right text-xs">Aug 12, 2026</td>
                  </tr>
                  <tr 
                    onClick={() => router.push("/transactions")}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-3 text-slate-500 font-mono text-xs">PP-1002</td>
                    <td className="py-3 font-semibold text-slate-900">Solar Power Report</td>
                    <td className="py-3 font-bold text-slate-900 text-right">{formatAmount(2000)}</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[11px] font-bold">Approved</span>
                    </td>
                    <td className="py-3 text-slate-500 text-right text-xs">Aug 10, 2026</td>
                  </tr>
                  <tr 
                    onClick={() => router.push("/transactions")}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-3 text-slate-500 font-mono text-xs">PP-1003</td>
                    <td className="py-3 font-semibold text-slate-900">Logo Design</td>
                    <td className="py-3 font-bold text-slate-900 text-right">{formatAmount(1500)}</td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[11px] font-bold">Completed</span>
                    </td>
                    <td className="py-3 text-slate-500 text-right text-xs">Aug 5, 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </main>

      {/* Freelancer Profile Detail Modal */}
      {selectedFreelancer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xl">
                  {selectedFreelancer.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedFreelancer.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{selectedFreelancer.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFreelancer(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 py-3 border-y border-slate-100 text-xs font-semibold text-slate-600 mb-4">
              <span>★ {selectedFreelancer.rating} ({selectedFreelancer.reviews} reviews)</span>
              <span>•</span>
              <span className="text-emerald-600">{selectedFreelancer.completedJobs} projects completed</span>
              <span>•</span>
              <span className="text-blue-600 font-bold">{formatAmount(selectedFreelancer.hourlyRateINR)}/hr</span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {selectedFreelancer.bio}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verified Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedFreelancer.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Link 
                href="/messages"
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-center text-sm transition-colors"
                onClick={() => setSelectedFreelancer(null)}
              >
                Send Message
              </Link>
              <Link 
                href="/projects/new"
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center text-sm transition-colors shadow-lg shadow-blue-600/30"
                onClick={() => setSelectedFreelancer(null)}
              >
                Hire Freelancer &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
