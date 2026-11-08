"use client";

import { useState, useEffect } from "react";
import { 
  Home, Briefcase, FileText, DollarSign, CreditCard, MessageSquare, 
  User, Settings, Bell, Calendar, Wallet, Hourglass, CheckCircle2,
  Users, Flame, Clock, X, Check, LogOut, Send, AlertCircle
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
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // Default
    }
  }, []);

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
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#0B1120] text-slate-300 flex flex-col h-screen sticky top-0 shrink-0">
        <Link href="/" className="p-6 flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">PayPilot</span>
        </Link>

        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard/freelancer" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-900/20">
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/projects/new" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            <span className="font-medium">Create Project</span>
          </Link>
          <Link href="/projects/matching" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Briefcase className="w-5 h-5" />
            <span className="font-medium">Find Projects</span>
          </Link>
          <Link href="/transactions" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">My Projects</span>
          </Link>
          <Link href="/transactions" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">Earnings</span>
          </Link>
          <Link href="/transactions" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">Transactions</span>
          </Link>
          <Link href="/messages" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors relative">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Messages</span>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors mt-4">
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </Link>
          <Link href="/settings/account" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-[1400px]">
        
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
            <p className="text-slate-500 font-medium mt-1">Here's your freelance activity and matches.</p>
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
                className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold border-2 border-white shadow-sm overflow-hidden flex items-center justify-center relative hover:opacity-90 transition-opacity"
              >
                {currentUser.full_name?.split(" ").map((n: string) => n[0]).join("") || "RK"}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                  <div className="p-3 border-b border-slate-100">
                    <p className="font-bold text-slate-900 text-sm">{currentUser.full_name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded mt-1.5 uppercase">
                      {currentUser.role || "Freelancer"}
                    </span>
                  </div>
                  <div className="py-1">
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
              <h3 className="text-[1.75rem] font-bold text-blue-600 leading-none">₹18,750</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Total Earnings</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#eff6ff] flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h3 className="text-[1.75rem] font-bold text-blue-600 leading-none">4</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Active Projects</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center shrink-0">
              <Hourglass className="w-7 h-7 text-purple-500" />
            </div>
            <div>
              <h3 className="text-[1.75rem] font-bold text-purple-600 leading-none">₹5,200</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Pending Release</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-[1.75rem] font-bold text-emerald-600 leading-none">12</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">Completed</p>
            </div>
          </div>
        </div>

        {/* Recommended Projects */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[1.35rem] font-bold text-slate-900 tracking-tight">Recommended Projects</h2>
            <Link href="/projects/matching" className="text-blue-600 font-semibold text-sm hover:underline flex items-center gap-1">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-0">
            {projects.map((proj) => {
              const isApplied = appliedProjectIds.includes(proj.id);
              return (
                <div key={proj.id} className="flex items-center justify-between py-5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 text-slate-600 font-bold">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-[17px]">{proj.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-sm font-medium text-slate-500">
                        <span className="text-slate-900 font-bold">₹{proj.budget.toLocaleString()}</span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {proj.deliveryDays} days</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500">{proj.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100/60 text-emerald-700 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 fill-emerald-600" /> {proj.matchScore}% match
                    </span>
                    {isApplied ? (
                      <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm">
                        <Check className="w-4 h-4 text-emerald-600" /> Applied
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleApplyClick(proj)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[1.35rem] font-bold text-slate-900 tracking-tight">Recent Payments</h2>
            <Link href="/transactions" className="text-blue-600 font-semibold text-sm hover:underline">
              View All Transactions &rarr;
            </Link>
          </div>
          
          <table className="w-full text-sm text-left">
            <tbody className="divide-y divide-slate-100">
              <tr 
                onClick={() => router.push("/transactions")}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <td className="py-4 text-slate-500 font-mono text-xs w-32">PP-1001</td>
                <td className="py-4 font-medium text-slate-700">React Dashboard</td>
                <td className="py-4 font-bold text-slate-900 text-right w-32">₹3,500</td>
                <td className="py-4 text-right w-32">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-[11.5px] font-bold text-center min-w-[80px]">Completed</span>
                </td>
              </tr>
              <tr 
                onClick={() => router.push("/transactions")}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <td className="py-4 text-slate-500 font-mono text-xs w-32">PP-1002</td>
                <td className="py-4 font-medium text-slate-700">API Development</td>
                <td className="py-4 font-bold text-slate-900 text-right w-32">₹4,000</td>
                <td className="py-4 text-right w-32">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-[11.5px] font-bold text-center min-w-[80px]">Completed</span>
                </td>
              </tr>
              <tr 
                onClick={() => router.push("/transactions")}
                className="hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <td className="py-4 text-slate-500 font-mono text-xs w-32">PP-1003</td>
                <td className="py-4 font-medium text-slate-700">Technical Writing</td>
                <td className="py-4 font-bold text-slate-900 text-right w-32">₹2,500</td>
                <td className="py-4 text-right w-32">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100/80 text-amber-600 text-[11.5px] font-bold text-center min-w-[80px]">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>

      {/* Project Application Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Project Proposal</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedProject.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Proposed Bid (₹ INR)</label>
                <input 
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cover Note / Approach</label>
                <textarea 
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain why you are the best fit for this project..."
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-2.5 text-xs text-blue-800 font-medium">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Client funds will be held securely via PayPal Sandbox milestone escrow.</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setSelectedProject(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmApplication}
                disabled={submitting}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
