"use client";

import { useState, useEffect } from "react";
import { 
  Home, Briefcase, FileText, DollarSign, CreditCard, MessageSquare, 
  User, Settings, Bell, Calendar, Wallet, Hourglass, CheckCircle2,
  Users, Flame, Clock, X, Check, LogOut, Send, AlertCircle, RefreshCw, ArrowRight,
  ShieldCheck, ArrowUpRight, Sparkles, TrendingUp
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

interface RecommendedProject {
  id: number;
  title: string;
  budget: number;
  deliveryDays: number;
  matchScore: number;
  category: string;
  urgent?: boolean;
}

export default function FreelancerDashboard() {
  const router = useRouter();

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
      title: "Full-Stack E-Commerce Store with Autonomous PayPal Escrow",
      budget: 8500,
      deliveryDays: 5,
      matchScore: 98,
      category: "Full Stack Development",
      urgent: true
    },
    {
      id: 102,
      title: "Technical Whitepaper on Autonomous Payment Agents",
      budget: 3500,
      deliveryDays: 3,
      matchScore: 92,
      category: "Content & Research"
    },
    {
      id: 103,
      title: "Automated Dispute Resolution Agent using Multi-Modal LLMs",
      budget: 9500,
      deliveryDays: 7,
      matchScore: 96,
      category: "Data & AI",
      urgent: true
    }
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("paypilot_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user?.role && user.role.toLowerCase() === "client") {
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
      if (res && res.user) {
        localStorage.setItem("paypilot_user", JSON.stringify(res.user));
        setCurrentUser(res.user);
        setRoleClashWarning(false);
        setSuccessToast("Switched to Freelancer account (Rahul Kumar)");
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } catch {
      const fallbackFreelancer = {
        id: 2,
        email: "rahul@paypilot.demo",
        full_name: "Rahul Kumar",
        role: "freelancer",
        hourly_rate: 1500,
        skills: ["React", "Python", "FastAPI", "Postgres", "Tailwind CSS"],
        created_at: new Date().toISOString()
      };
      localStorage.setItem("paypilot_user", JSON.stringify(fallbackFreelancer));
      setCurrentUser(fallbackFreelancer);
      setRoleClashWarning(false);
      setSuccessToast("Switched to Freelancer account (Rahul Kumar)");
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const handleApplyClick = (project: RecommendedProject) => {
    setSelectedProject(project);
    setBidAmount(project.budget);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setAppliedProjectIds((prev) => [...prev, selectedProject.id]);
      setSuccessToast(`Proposal submitted for "${selectedProject.title}" (₹${bidAmount.toLocaleString()})`);
      setSelectedProject(null);
      setTimeout(() => setSuccessToast(null), 4000);
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <AppSidebar activePage="dashboard" />

      <main className="flex-1 p-8 max-w-[1400px]">
        
        {/* Role Clash Warning Banner */}
        {roleClashWarning && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="font-bold text-sm block">Logged in as Client session</strong>
                <span className="text-xs text-amber-700">You are currently logged in with a Client profile. Switch to freelancer view to test proposals.</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSwitchToDemoFreelancer}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Sign in as Freelancer (Rahul)
              </button>
              <Link
                href="/dashboard/client"
                className="px-3 py-1.5 bg-white border border-amber-200 text-amber-800 rounded-xl text-xs font-bold hover:bg-amber-50 transition-colors"
              >
                Go to Client Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{successToast}</span>
          </div>
        )}

        {/* Polished Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wider border border-blue-100">
                Freelancer Portal
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Live Milestone Activity & AI Matches</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Welcome back, {currentUser.full_name?.split(" ")[0] || "Rahul"}! <span>👋</span>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Here is your real-time freelance overview, PayPal escrow reserves, and AI matches.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Subpage Navigation Shortcut Pills */}
            <Link
              href="/freelancer/find-projects"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5" /> Find Projects
            </Link>

            {/* Global Synchronized Notification Bell */}
            <NotificationBell />

            {/* Global User Profile Menu with Professional Male Avatar */}
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* Card 1: Total Earnings */}
          <Link href="/freelancer/earnings" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Earnings</span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <Wallet className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">₹28,500</div>
            <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% from last month</span>
            </p>
          </Link>

          {/* Card 2: Active Projects */}
          <Link href="/freelancer/proposals" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Active Contracts</span>
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                <Hourglass className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">3</div>
            <p className="text-xs font-semibold text-blue-600 mt-2">2 under active milestone review</p>
          </Link>

          {/* Card 3: Completed */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Completed</span>
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">12</div>
            <p className="text-xs font-medium text-slate-400 mt-2">100% on-time milestone delivery</p>
          </div>

          {/* Card 4: Client Rating */}
          <Link href="/freelancer/profile" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Client Rating</span>
              <span className="p-2 bg-amber-50 text-amber-500 rounded-xl">★</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">4.9 / 5.0</div>
            <p className="text-xs font-medium text-slate-400 mt-2">Based on 14 client reviews</p>
          </Link>

        </div>

        {/* Main Content Grid: Recommended Projects & Escrow Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recommended Projects (2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Recommended Projects for You</h3>
                <p className="text-xs text-slate-400 mt-0.5">Matched using Google Gemini skill vectorizer against your profile</p>
              </div>
              <Link 
                href="/freelancer/find-projects" 
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                Browse All Contracts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {projects.map((project) => {
                const isApplied = appliedProjectIds.includes(project.id);
                return (
                  <div 
                    key={project.id} 
                    className="p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {project.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-emerald-600" /> {project.matchScore}% Match
                        </span>
                        {project.urgent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                            ⚡ Fast Turnaround
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{project.title}</h4>

                      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {project.deliveryDays} days turnaround
                        </span>
                        <span>•</span>
                        <span className="text-slate-900 font-bold">₹{project.budget.toLocaleString()} Fixed Escrow</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isApplied ? (
                        <span className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl flex items-center gap-1.5">
                          <Check className="w-4 h-4" /> Proposal Sent
                        </span>
                      ) : (
                        <button
                          type="button"
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
            
            {/* Milestone Escrow Status Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-black text-slate-900">Milestone Escrow Status</h3>
              
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>In PayPal Escrow</span>
                    <span className="text-emerald-600 font-black text-sm">₹8,500</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Secured funds awaiting milestone deliverable approval</p>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[70%]"></div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>Available Payout</span>
                    <span className="text-blue-600 font-black text-sm">₹20,000</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Auto-transferred to your connected PayPal Sandbox account</p>
                </div>
              </div>

              <Link 
                href="/freelancer/earnings" 
                className="w-full block text-center py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Withdraw or View Detailed Invoices &rarr;
              </Link>
            </div>

            {/* AI Assistant Quick Jump Card */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-cyan-300 uppercase tracking-wider inline-block">
                PayPilot Autonomous AI
              </span>
              <h4 className="text-base font-bold">Autonomous Milestone Pre-Audit</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Test and screen your pull requests against client criteria before submitting to trigger instant escrow capture.
              </p>
              <Link 
                href="/freelancer/ai" 
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Open Milestone Assistant <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>

        {/* Modal: Quick Apply Proposal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                  Proposal Submission
                </span>
                <span className="text-xs text-slate-400 font-medium">Guaranteed PayPal Escrow</span>
              </div>

              <h3 className="text-lg font-black text-slate-900 mb-1">
                {selectedProject.title}
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Client Fixed Budget: <strong className="text-slate-800 font-mono">₹{selectedProject.budget.toLocaleString()}</strong> • Turnaround: {selectedProject.deliveryDays} days
              </p>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Bid Amount (₹ INR)</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-black text-slate-900 outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cover Note & Technical Approach</label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Smart Escrow Protection</strong>
                    If accepted, the client must deposit ₹{bidAmount.toLocaleString()} into escrow before work begins.
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Proposal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
