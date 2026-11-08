"use client";

import { useState } from "react";
import { 
  Briefcase, Search, Filter, Flame, Clock, DollarSign, 
  CheckCircle2, X, ArrowRight, ShieldCheck, Check, Sparkles
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

interface ProjectItem {
  id: number;
  title: string;
  category: string;
  budget: number;
  deadlineDays: number;
  matchScore: number;
  clientName: string;
  clientVerified: boolean;
  skills: string[];
  description: string;
}

export default function FreelancerFindProjectsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(5000);
  const [coverNote, setCoverNote] = useState<string>("Hi! I have extensive experience in this exact stack. I can deliver high-quality, tested code within your required deadline.");
  const [submitting, setSubmitting] = useState(false);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const projects: ProjectItem[] = [
    {
      id: 201,
      title: "Full-Stack E-Commerce Store with PayPal Gateway",
      category: "Web Development",
      budget: 8500,
      deadlineDays: 7,
      matchScore: 98,
      clientName: "TechCorp Labs",
      clientVerified: true,
      skills: ["React", "Next.js", "Python FastAPI", "PayPal SDK"],
      description: "Looking for an expert developer to finalize custom checkout flow, configure webhook handling, and implement automated invoice downloads."
    },
    {
      id: 202,
      title: "Interactive AI Analytics & Revenue Dashboard",
      category: "Data & AI",
      budget: 6000,
      deadlineDays: 5,
      matchScore: 94,
      clientName: "Venture Analytics",
      clientVerified: true,
      skills: ["React", "Tailwind CSS", "Recharts", "TypeScript"],
      description: "Build an executive analytics panel with charts, responsive mobile view, and exportable CSV reports."
    },
    {
      id: 203,
      title: "Technical Whitepaper on Autonomous Payment Agents",
      category: "Content & Research",
      budget: 3500,
      deadlineDays: 4,
      matchScore: 92,
      clientName: "FinTech Research Group",
      clientVerified: true,
      skills: ["Technical Writing", "Fintech", "LaTeX", "Research"],
      description: "Author a comprehensive 12-page research report evaluating smart escrow systems vs traditional payment gateways."
    },
    {
      id: 204,
      title: "FastAPI REST Backend with JWT Auth & Postgres",
      category: "Web Development",
      budget: 5000,
      deadlineDays: 4,
      matchScore: 96,
      clientName: "Sarah Johnson",
      clientVerified: true,
      skills: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL"],
      description: "Architect and implement clean scalable REST endpoints with rate limiting, Docker containerization, and unit tests."
    },
    {
      id: 205,
      title: "Mobile App UI Design in Figma for SaaS Tool",
      category: "Design",
      budget: 4200,
      deadlineDays: 6,
      matchScore: 88,
      clientName: "Pulse Media",
      clientVerified: false,
      skills: ["Figma", "UI/UX", "Design Systems"],
      description: "Complete design package for iOS and Android application with wireframes, prototype flows, and design tokens."
    }
  ];

  const categories = ["All", "Web Development", "Data & AI", "Content & Research", "Design"];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleApply = (project: ProjectItem) => {
    setSelectedProject(project);
    setBidAmount(project.budget);
  };

  const handleConfirmBid = () => {
    if (!selectedProject) return;
    setSubmitting(true);
    setTimeout(() => {
      setAppliedIds((prev) => [...prev, selectedProject.id]);
      setSubmitting(false);
      setToastMsg(`Proposal submitted for "${selectedProject.title}"!`);
      setSelectedProject(null);
      setTimeout(() => setToastMsg(null), 4000);
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <AppSidebar activePage="find-projects" />

      <main className="flex-1 p-8 max-w-[1400px]">
        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-6 right-8 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase tracking-wider">
                Freelancer Portal
              </span>
              <span className="text-xs text-slate-400 font-medium">Verified Client Jobs</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Find Projects</h1>
            <p className="text-slate-500 text-sm mt-0.5">Explore freelance contracts matched to your skillset with guaranteed PayPal escrow.</p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by project title, stack, or skills (e.g. React, Python, FastAPI)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Feed */}
        <div className="space-y-4">
          {filteredProjects.map((proj) => {
            const isApplied = appliedIds.includes(proj.id);
            return (
              <div 
                key={proj.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700">
                      {proj.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {proj.matchScore}% Match
                    </span>
                    {proj.clientVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Payment Verified
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1.5">{proj.title}</h3>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed max-w-3xl">{proj.description}</p>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {proj.skills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-5 text-xs text-slate-400 font-medium">
                    <span>Posted by <strong className="text-slate-700">{proj.clientName}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {proj.deadlineDays} days delivery
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block">Fixed Budget</span>
                    <span className="text-2xl font-black text-slate-900">₹{proj.budget.toLocaleString()}</span>
                  </div>

                  {isApplied ? (
                    <button
                      disabled
                      className="px-5 py-2.5 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Proposal Sent
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(proj)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Apply for Project <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Submit Proposal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Submit Bid</span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedProject.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cover Proposal / Deliverables</label>
                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Your payment is guaranteed by <strong>PayPal Escrow</strong>. Once client accepts your bid, funds are deposited into escrow before you start.</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmBid}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Submit Proposal"}
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
