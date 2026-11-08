"use client";

import { useState, useEffect } from "react";
import { 
  Home, Briefcase, FileText, DollarSign, CreditCard, MessageSquare, 
  User, Settings, Bell, Calendar, Wallet, Hourglass, CheckCircle2,
  Users, Flame, Clock, X, Check, LogOut, Send, AlertCircle, RefreshCw, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

interface RecommendedProject {
  id: number;
  title: string;
  budget: number;
  deliveryDays: number;
  matchScore: number;
  category: string;
  applied?: boolean;
}

export default function FreelancerDashboard() {
  const router = useRouter();

  // Header toggles
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Apply modal
  const [selectedProject, setSelectedProject] = useState<RecommendedProject | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(5000);
  const [coverLetter, setCoverLetter] = useState<string>("Hi! I have extensive experience building scalable solutions with clean architecture and modern frameworks. I'd love to help you deliver this on time.");
  const [submitting, setSubmitting] = useState(false);
  const [appliedProjectIds, setAppliedProjectIds] = useState<number[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // User state
  const [currentUser, setCurrentUser] = useState<any>({
    full_name: "Rahul Kumar",
    email: "rahul@paypilot.demo",
    role: "freelancer"
  });
  const [roleClashWarning, setRoleClashWarning] = useState<boolean>(false);

  // Recommended projects list
  const [projects] = useState<RecommendedProject[]>([
    {
      id: 101,
      title: "E-commerce Website Development",
      budget: 5000,
      deliveryDays: 5,
      matchScore: 97,
      category: "Full Stack Development"
    },
    {
      id: 102,
      title: "Technical Blog Writing on AI",
      budget: 2000,
      deliveryDays: 3,
      matchScore: 91,
      category: "Technical Content"
    },
    {
      id: 103,
      title: "Data Analysis & Visualization Dashboard",
      budget: 4500,
      deliveryDays: 7,
      matchScore: 89,
      category: "Python & BI"
    }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Project Match", time: "15 mins ago", unread: true, message: "A client posted an E-commerce Website Development project matching 97% of your skills." },
    { id: 2, title: "Milestone Payment Received", time: "3 hours ago", unread: true, message: "₹3,500 milestone release for React Dashboard has been credited to your PayPal Sandbox account." },
    { id: 3, title: "Verification Approved", time: "Yesterday", unread: false, message: "Your deliverable for technical writing was verified and approved by the client." }
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("paypilot_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.role && user.role.toLowerCase() === "client") {
          // A client is currently logged in! Flag role clash warning
          setRoleClashWarning(true);
        } else {
          setCurrentUser(user);
          setRoleClashWarning(false);
        }
      }
    } catch {
      // Default
    }
  }, []);

  const handleSwitchToDemoFreelancer = async () => {
    try {
      const res = await authApi.loginAsDemoFreelancer();
      if (res?.user) {
        setCurrentUser(res.user);
        setRoleClashWarning(false);
        setSuccessToast("Switched to Freelancer account (Rahul Kumar)");
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyClick = (project: RecommendedProject) => {
    setSelectedProject(project);
    setBidAmount(project.budget);
  };

  const handleConfirmApplication = () => {
    if (!selectedProject) return;
    setSubmitting(true);
    setTimeout(() => {
      setAppliedProjectIds((prev) => [...prev, selectedProject.id]);
      setSubmitting(false);
      setSuccessToast(`Application submitted successfully for "${selectedProject.title}"!`);
      setSelectedProject(null);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 600);
  };

  const handleSignOut = () => {
    authApi.logout();
    router.push("/login");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      
      {/* Sidebar - Freelancer Custom Navigation */}
      <aside className="w-[280px] bg-[#0B1120] text-slate-300 flex flex-col h-screen sticky top-0 shrink-0">
        <Link href="/" className="p-6 flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-bold text-white tracking-tight">PayPilot</span>
            <span className="block text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">Freelancer Portal</span>
          </div>
        </Link>

        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard/freelancer" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-900/20">
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/projects/matching" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <span className="font-medium">Find Projects</span>
          </Link>
          <Link href="/messages" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">My Proposals</span>
          </Link>
          <Link href="/transactions" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span className="font-medium">Earnings & Payouts</span>
          </Link>
          <Link href="/messages" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors relative">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Messages</span>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>
          <Link href="/ai" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Flame className="w-5 h-5 text-amber-400" />
            <span className="font-medium">AI Milestone Assistant</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors mt-4">
            <User className="w-5 h-5" />
            <span className="font-medium">Profile & Skills</span>
          </Link>
          <Link href="/settings/account" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        {/* Quick Role Switcher in Sidebar footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 m-3 rounded-2xl">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2">Switch View</p>
          <Link 
            href="/dashboard/client" 
            className="flex items-center justify-between text-xs text-blue-400 hover:text-blue-300 font-semibold py-1 transition-colors"
          >
            <span>Go to Client View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-[1400px]">
        
        {/* Role Clash Warning Banner if Client is logged in */}
        {roleClashWarning && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-bold">You are currently logged in with a Client account</p>
                <p className="text-[11px] text-amber-700">You are viewing the Freelancer dashboard in preview mode.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSwitchToDemoFreelancer}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Sign in as Freelancer (Rahul)
              </button>
              <Link
                href="/dashboard/client"
                className="px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 rounded-xl text-xs font-bold transition-colors"
              >
                Go to Client Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {successToast && (
          <div className="fixed top-6 right-8 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-semibold">{successToast}</span>
          </div>
        )}

        {/* Header */}
        <header className="flex justify-between items-end mb-8 relative">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
              Welcome back, {currentUser.full_name?.split(" ")[0] || "Rahul"}! <span className="text-3xl">👋</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Here's your freelance activity, AI project matches, and milestones.</p>
          </div>
          
          <div className="flex items-center gap-4 relative">
            
            {/* Notifications Button */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowCalendar(false);
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

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 text-sm">Notifications ({unreadCount})</span>
                    <button 
                      onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
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
                </div>
              )}
            </div>

            {/* Message Link */}
            <Link 
              href="/messages"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors relative"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </Link>

            {/* Calendar Button */}
            <div className="relative">
              <button 
                onClick={() => {
                  setShowCalendar(!showCalendar);
                  setShowNotifications(false);
                  setShowProfileMenu(false);
                }}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Deliverable Deadlines"
              >
                <Calendar className="w-5 h-5" />
              </button>

              {/* Deadlines Modal */}
              {showCalendar && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 text-sm">Upcoming Milestone Deadlines</span>
                    <button onClick={() => setShowCalendar(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">Due Aug 12, 2026</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">React Dashboard for College Project</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Deliverable 2: Responsive components & dark mode</p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                      <span className="text-[10px] font-bold text-purple-600 uppercase">Due Aug 18, 2026</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">API Integration & Webhooks</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Milestone 1: Endpoint documentation & testing</p>
                    </div>
                  </div>
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
                }}
                className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold border-2 border-white shadow-sm overflow-hidden flex items-center justify-center relative hover:opacity-90 transition-opacity cursor-pointer"
              >
                {currentUser.full_name?.split(" ").map((n: string) => n[0]).join("") || "RK"}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                  <div className="p-3 border-b border-slate-100">
                    <p className="font-bold text-slate-900 text-sm">{currentUser.full_name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">
                        {currentUser.role || "Freelancer"}
                      </span>
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">
                        Level 2 Seller
                      </span>
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleSwitchToDemoFreelancer();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer text-left"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Switch to Freelancer</span>
                    </button>
                    <Link 
                      href="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Edit Profile</span>
                    </Link>
                    <Link 
                      href="/settings/payments"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      <span>Payout Settings</span>
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left"
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
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Earnings</span>
              <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Wallet className="w-5 h-5" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">₹28,500</div>
            <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
              <span>↑ 12%</span>
              <span className="text-slate-400 font-normal">from last month</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Projects</span>
              <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Hourglass className="w-5 h-5" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">3</div>
            <p className="text-xs font-semibold text-blue-600 mt-2">2 milestones pending review</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Completed</span>
              <span className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <CheckCircle2 className="w-5 h-5" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">12</div>
            <p className="text-xs font-normal text-slate-400 mt-2">100% on-time delivery</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Client Rating</span>
              <span className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">★</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">4.9 / 5.0</div>
            <p className="text-xs font-normal text-slate-400 mt-2">Based on 14 reviews</p>
          </div>
        </div>

        {/* Main Grid: Recommended Projects & Earnings Overview */}
        <div className="grid grid-cols-3 gap-8">
          
          {/* Recommended Projects (2 Cols) */}
          <div className="col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recommended Projects for You</h3>
                <p className="text-xs text-slate-400 mt-0.5">Matched using PayPilot AI skill vectorizer</p>
              </div>
              <Link href="/projects/matching" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All Matches <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {projects.map((project) => {
                const isApplied = appliedProjectIds.includes(project.id);
                return (
                  <div 
                    key={project.id} 
                    className="p-5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all bg-slate-50/40 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                          {project.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                          <Flame className="w-3 h-3" /> {project.matchScore}% Match
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{project.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {project.deliveryDays} days delivery
                        </span>
                        <span>•</span>
                        <span className="text-slate-900 font-bold">₹{project.budget.toLocaleString()} Fixed Budget</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isApplied ? (
                        <button
                          disabled
                          className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Applied
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApplyClick(project)}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          Apply Now <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Earnings & Escrow Overview (1 Col) */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Milestone Escrow Status</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                    <span>In PayPal Escrow</span>
                    <span className="text-emerald-600">₹8,500</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Secured funds awaiting milestone deliverable approval</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[70%]"></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                    <span>Available Payout</span>
                    <span className="text-blue-600">₹20,000</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Auto-transferred to your connected PayPal Sandbox account</p>
                </div>
              </div>

              <Link 
                href="/transactions" 
                className="mt-5 w-full block text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                View Detailed Invoices & Payouts
              </Link>
            </div>

            {/* AI Assistant Promo Card */}
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-blue-200 uppercase tracking-wider mb-2 inline-block">
                  AI Auto-Verify
                </span>
                <h4 className="text-base font-bold mb-1">Boost Your Match Score</h4>
                <p className="text-xs text-blue-200 leading-relaxed mb-4">
                  PayPilot AI inspects code and reports against client criteria for automated milestone release.
                </p>
                <Link 
                  href="/projects/matching" 
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-blue-900 font-bold text-xs rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Explore AI Matching <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Modal: Submit Proposal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 uppercase">Submit Proposal</span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedProject.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Bid Amount (₹)</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Client budget: ₹{selectedProject.budget.toLocaleString()}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cover Note / Why You're a Fit</label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-2 text-xs text-blue-900">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Payments are escrowed in PayPal before work begins to guarantee your payout upon deliverable completion.</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmApplication}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Proposal"}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
