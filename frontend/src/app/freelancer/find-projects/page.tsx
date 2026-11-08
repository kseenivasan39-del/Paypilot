"use client";

import { useState, useMemo } from "react";
import { 
  Search, Filter, Flame, Clock, DollarSign, CheckCircle2, 
  X, ArrowRight, ShieldCheck, Sparkles, SlidersHorizontal, 
  TrendingUp, Star, Zap, Building2, ChevronDown, Check,
  BadgeCheck, Compass, Briefcase, Bookmark, Share2, Eye
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

interface ProjectItem {
  id: number;
  title: string;
  category: "Web Development" | "Data & AI" | "FinTech" | "Content & Research" | "Design";
  budget: number;
  deadlineDays: number;
  matchScore: number;
  clientName: string;
  clientRating: number;
  clientSpent: string;
  clientCountry: string;
  clientVerified: boolean;
  skills: string[];
  description: string;
  postedTime: string;
  proposalsCount: number;
  featured?: boolean;
  urgency?: "Immediate" | "Flexible" | "Standard";
}

export default function FreelancerFindProjectsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [minBudget, setMinBudget] = useState<number>(0);
  const [minMatch, setMinMatch] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"match" | "budget_high" | "newest">("match");
  const [savedProjectIds, setSavedProjectIds] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(5000);
  const [deliveryDays, setDeliveryDays] = useState<number>(5);
  const [coverNote, setCoverNote] = useState<string>(
    "Hi! I specialize in production-grade React/Next.js and Python FastAPI architectures with autonomous AI verification and PayPal REST payment flows. I would love to build this deliverable for you with 100% on-time milestone guarantee."
  );
  const [submitting, setSubmitting] = useState(false);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [quickPill, setQuickPill] = useState<string | null>(null);

  const projects: ProjectItem[] = [
    {
      id: 201,
      title: "Full-Stack E-Commerce Store with Autonomous PayPal Escrow",
      category: "Web Development",
      budget: 8500,
      deadlineDays: 7,
      matchScore: 99,
      clientName: "TechCorp Labs Global",
      clientRating: 4.95,
      clientSpent: "₹1,45,000+",
      clientCountry: "Bengaluru, IN",
      clientVerified: true,
      skills: ["React 19", "Next.js", "Python FastAPI", "PayPal REST API", "Docker"],
      description: "We require an experienced full-stack engineer to finalize our custom multi-currency checkout, setup automated webhook triggers on milestone captures, and connect PostgreSQL order history.",
      postedTime: "12m ago",
      proposalsCount: 3,
      featured: true,
      urgency: "Immediate"
    },
    {
      id: 202,
      title: "Interactive AI Analytics & Revenue Forecasting Dashboard",
      category: "Data & AI",
      budget: 6200,
      deadlineDays: 5,
      matchScore: 96,
      clientName: "Venture Dynamics AI",
      clientRating: 4.9,
      clientSpent: "₹92,000+",
      clientCountry: "San Francisco, US",
      clientVerified: true,
      skills: ["React", "TypeScript", "Tailwind CSS", "Recharts", "AI Vectorizer"],
      description: "Build a high-performance modern 2026 glassmorphic dashboard showcasing real-time revenue velocity, simulated escrow releases, and interactive cohort breakdown tables.",
      postedTime: "45m ago",
      proposalsCount: 5,
      featured: true,
      urgency: "Standard"
    },
    {
      id: 203,
      title: "Technical Whitepaper on Autonomous Payment Agents & Escrow",
      category: "Content & Research",
      budget: 3800,
      deadlineDays: 4,
      matchScore: 94,
      clientName: "FinTech Research Institute",
      clientRating: 4.88,
      clientSpent: "₹54,000+",
      clientCountry: "London, UK",
      clientVerified: true,
      skills: ["Technical Writing", "Fintech", "LaTeX KaTeX", "Escrow Architecture"],
      description: "Draft an authoritative 12-page research study exploring how autonomous multi-modal LLM evaluation engines replace legacy human escrow disputes with automated PayPal releases.",
      postedTime: "2h ago",
      proposalsCount: 2,
      urgency: "Flexible"
    },
    {
      id: 204,
      title: "Production FastAPI Microservices with Rate Limiting & Postgres",
      category: "Web Development",
      budget: 5500,
      deadlineDays: 4,
      matchScore: 97,
      clientName: "Sarah Johnson Labs",
      clientRating: 5.0,
      clientSpent: "₹78,000+",
      clientCountry: "Chennai, IN",
      clientVerified: true,
      skills: ["Python", "FastAPI", "SQLAlchemy", "PostgreSQL", "SlowAPI"],
      description: "Architect and containerize a set of hardened asynchronous REST endpoints featuring JWT token refresh, SlowAPI rate-limiting headers, and complete Pytest test suites.",
      postedTime: "3h ago",
      proposalsCount: 4,
      urgency: "Immediate"
    },
    {
      id: 205,
      title: "SaaS Mobile-First Design System & Figma Component Library",
      category: "Design",
      budget: 4500,
      deadlineDays: 6,
      matchScore: 89,
      clientName: "Pulse Media Works",
      clientRating: 4.75,
      clientSpent: "₹38,000+",
      clientCountry: "Berlin, DE",
      clientVerified: false,
      skills: ["Figma", "UI/UX", "Design Systems", "Dark Mode", "Micro-animations"],
      description: "Design 24 pixel-perfect screens for our next-gen developer productivity suite with dark mode variants, auto-layout tokens, and interactive hover prototypes.",
      postedTime: "5h ago",
      proposalsCount: 7,
      urgency: "Standard"
    },
    {
      id: 206,
      title: "Automated Dispute Resolution Agent using Multi-Modal LLMs",
      category: "FinTech",
      budget: 9500,
      deadlineDays: 8,
      matchScore: 98,
      clientName: "Global Trust Escrow",
      clientRating: 4.98,
      clientSpent: "₹2,10,000+",
      clientCountry: "Singapore, SG",
      clientVerified: true,
      skills: ["LangChain", "Gemini 2.5", "Python", "PayPal SDK", "Vector DB"],
      description: "Implement a verification worker pipeline that compares submitted GitHub commits and PDF reports against contractual milestone specifications to auto-trigger PayPal capture calls.",
      postedTime: "6h ago",
      proposalsCount: 1,
      featured: true,
      urgency: "Immediate"
    }
  ];

  const categories = ["All", "Web Development", "Data & AI", "FinTech", "Content & Research", "Design"];
  const popularKeywords = ["React 19", "FastAPI", "PayPal SDK", "Next.js", "AI Vectorizer", "PostgreSQL"];

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        const matchesKeyword = quickPill ? p.skills.includes(quickPill) : true;
        const query = search.toLowerCase().trim();
        const matchesSearch = !query || 
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.clientName.toLowerCase().includes(query) ||
          p.skills.some((s) => s.toLowerCase().includes(query));
        const matchesMinBudget = p.budget >= minBudget;
        const matchesMinMatch = p.matchScore >= minMatch;

        return matchesCategory && matchesKeyword && matchesSearch && matchesMinBudget && matchesMinMatch;
      })
      .sort((a, b) => {
        if (sortBy === "match") return b.matchScore - a.matchScore;
        if (sortBy === "budget_high") return b.budget - a.budget;
        return a.id - b.id; // newest first
      });
  }, [projects, selectedCategory, quickPill, search, minBudget, minMatch, sortBy]);

  const toggleSave = (id: number) => {
    setSavedProjectIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenBid = (proj: ProjectItem) => {
    setSelectedProject(proj);
    setBidAmount(proj.budget);
    setDeliveryDays(proj.deadlineDays);
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
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-[#070913] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Role-Aware Sidebar */}
      <AppSidebar activePage="find-projects" />

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-y-auto px-8 py-8 lg:px-12 relative">
        
        {/* Ambient Top Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-6 right-8 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-bounce border border-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-slate-950" />
            <span className="text-sm">{toastMsg}</span>
          </div>
        )}

        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-800/80 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                2026 AI Radar
              </span>
              <span className="text-xs text-slate-400 font-medium">Verified Client Jobs &bull; Instant PayPal Escrow</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              Find Projects
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                {filteredProjects.length} Opportunities
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Explore smart-contracted freelance milestones matched to your skill vectors with automated pre-audit verification.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* 2026 High-Tech Search & Command Bar */}
        <div className="relative z-10 mb-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-4">
            
            {/* Primary Search Input */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by tech stack, project title, or client (e.g. React 19, FastAPI, PayPal)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0B1021] border border-slate-700/80 focus:border-cyan-400 rounded-2xl pl-12 pr-10 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Sort Dropdown */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2 bg-[#0B1021] border border-slate-700/80 px-4 py-2.5 rounded-2xl">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-cyan-400 outline-none cursor-pointer"
                >
                  <option value="match" className="bg-slate-900 text-white">AI Match (High to Low)</option>
                  <option value="budget_high" className="bg-slate-900 text-white">Budget (High to Low)</option>
                  <option value="newest" className="bg-slate-900 text-white">Recently Posted</option>
                </select>
              </div>

              {/* Min Budget Filter */}
              <div className="flex items-center gap-2 bg-[#0B1021] border border-slate-700/80 px-4 py-2.5 rounded-2xl">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-400">Min:</span>
                <select
                  value={minBudget}
                  onChange={(e) => setMinBudget(Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-emerald-400 outline-none cursor-pointer"
                >
                  <option value="0" className="bg-slate-900 text-white">Any Budget</option>
                  <option value="3000" className="bg-slate-900 text-white">₹3,000+</option>
                  <option value="5000" className="bg-slate-900 text-white">₹5,000+</option>
                  <option value="8000" className="bg-slate-900 text-white">₹8,000+</option>
                </select>
              </div>
            </div>

          </div>

          {/* Category Chips & Quick Keyword Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/60">
            {/* Category Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setQuickPill(null); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">Tags:</span>
              {popularKeywords.map((tag) => {
                const isSelected = quickPill === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => setQuickPill(isSelected ? null : tag)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/60"
                        : "bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-700/40"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feed List */}
        <div className="space-y-4 relative z-10 pb-16">
          {filteredProjects.length === 0 ? (
            <div className="p-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800/80">
              <Compass className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No matching projects found</h3>
              <p className="text-xs text-slate-400 mb-4">Try clearing your filters or searching for different keywords.</p>
              <button
                type="button"
                onClick={() => { setSearch(""); setSelectedCategory("All"); setMinBudget(0); setQuickPill(null); }}
                className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredProjects.map((proj) => {
              const isApplied = appliedIds.includes(proj.id);
              const isSaved = savedProjectIds.includes(proj.id);

              return (
                <div
                  key={proj.id}
                  className={`group relative p-6 rounded-3xl transition-all duration-300 bg-gradient-to-b from-[#0F172A]/90 to-[#0A0F1D]/90 border ${
                    proj.featured 
                      ? "border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.1)]" 
                      : "border-slate-800 hover:border-slate-700 hover:shadow-2xl"
                  }`}
                >
                  {/* Featured Ribbon */}
                  {proj.featured && (
                    <div className="absolute top-0 right-10 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full shadow-lg flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-slate-950" /> Featured Milestone
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Left Meta & Content */}
                    <div className="flex-1 min-w-0">
                      
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2.5 mb-3">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {proj.category}
                        </span>

                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                          <Flame className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                          {proj.matchScore}% Match
                        </span>

                        {proj.urgency === "Immediate" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            Urgent Hire
                          </span>
                        )}

                        <span className="text-xs text-slate-500 font-medium">
                          Posted {proj.postedTime} &bull; {proj.proposalsCount} proposals
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-2 tracking-tight">
                        {proj.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mb-4 line-clamp-2">
                        {proj.description}
                      </p>

                      {/* Tech Stack Chips */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {proj.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Client Trust Passport */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-bold text-slate-200">{proj.clientName}</span>
                          {proj.clientVerified && (
                            <BadgeCheck className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                          )}
                        </div>

                        <span className="text-slate-600">&bull;</span>
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{proj.clientRating}</span>
                        </div>

                        <span className="text-slate-600">&bull;</span>
                        <span>{proj.clientSpent} spent</span>

                        <span className="text-slate-600">&bull;</span>
                        <span>{proj.clientCountry}</span>

                        <span className="text-slate-600">&bull;</span>
                        <span className="flex items-center gap-1 text-cyan-300">
                          <Clock className="w-3.5 h-3.5" /> {proj.deadlineDays} days delivery
                        </span>
                      </div>

                    </div>

                    {/* Right Action / Pricing Block */}
                    <div className="shrink-0 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                      
                      <div className="text-left lg:text-right">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
                          Milestone Budget
                        </span>
                        <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
                          <span className="text-lg font-bold text-cyan-400">₹</span>
                          {proj.budget.toLocaleString()}
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 justify-start lg:justify-end mt-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Escrow Backed
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSave(proj.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            isSaved 
                              ? "bg-cyan-500/20 border-cyan-400 text-cyan-300" 
                              : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                          }`}
                          title={isSaved ? "Saved to Bookmarks" : "Save Project"}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-cyan-300" : ""}`} />
                        </button>

                        {isApplied ? (
                          <button
                            disabled
                            className="px-6 py-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-xs rounded-xl flex items-center gap-2 cursor-not-allowed"
                          >
                            <Check className="w-4 h-4 text-emerald-400" /> Bid Submitted
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenBid(proj)}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                          >
                            Apply for Project <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 2026 Interactive Bid Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0B1021] border border-cyan-500/30 rounded-3xl max-w-xl w-full p-8 shadow-[0_0_60px_rgba(6,182,212,0.2)] animate-in fade-in zoom-in-95 duration-200">
              
              <div className="flex justify-between items-start pb-5 border-b border-slate-800 mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block mb-1">
                    Smart Proposal Submission
                  </span>
                  <h3 className="text-xl font-extrabold text-white">{selectedProject.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">Client: <strong className="text-white">{selectedProject.clientName}</strong> &bull; Match: <strong className="text-emerald-400">{selectedProject.matchScore}%</strong></p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Your Bid (₹ INR)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-white outline-none focus:border-cyan-400"
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">Budget: ₹{selectedProject.budget.toLocaleString()}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Delivery Time</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-cyan-400"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">days</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 block">Client target: {selectedProject.deadlineDays} days</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Proposal Pitch & Technical Approach</label>
                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-slate-200 outline-none focus:border-cyan-400 resize-none leading-relaxed"
                  />
                </div>

                {/* PayPal Escrow Guarantee Box */}
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-300 leading-snug">
                    <strong className="text-white block mb-0.5">Autonomous PayPal Escrow Protection</strong>
                    Upon offer acceptance, ₹{bidAmount.toLocaleString()} is deposited into PayPal Smart Escrow. Our AI Pre-Audit inspects your deliverable for instant release upon completion.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmBid}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Deploying Proposal..." : "Submit Proposal →"}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
