"use client";

import { useState, useMemo } from "react";
import { 
  Search, SlidersHorizontal, ArrowRight, ShieldCheck, Star, 
  Clock, DollarSign, CheckCircle2, Bookmark, Flame, Zap,
  X, Check, ChevronDown, Building2, ExternalLink, Filter, Sparkles
} from "lucide-react";
import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";

interface PublicJob {
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
  isUrgentFast?: boolean;
}

export default function PublicBrowseProjectsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [minBudget, setMinBudget] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"match" | "budget_high" | "newest">("match");
  const [fastRequiringOnly, setFastRequiringOnly] = useState(false);
  const [quickTag, setQuickTag] = useState<string | null>(null);

  // Filter sidebar state
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [verifiedClientsOnly, setVerifiedClientsOnly] = useState<boolean>(true);

  // Apply modal
  const [selectedJob, setSelectedJob] = useState<PublicJob | null>(null);

  const jobs: PublicJob[] = [
    {
      id: 1,
      title: "Full-Stack E-Commerce Store with Autonomous PayPal Escrow",
      category: "Web Development",
      budget: 8500,
      deadlineDays: 7,
      matchScore: 98,
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
      isUrgentFast: true
    },
    {
      id: 2,
      title: "Automated Dispute Resolution Agent using Multi-Modal LLMs",
      category: "FinTech",
      budget: 9500,
      deadlineDays: 8,
      matchScore: 96,
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
      isUrgentFast: true
    },
    {
      id: 3,
      title: "Interactive AI Analytics & Revenue Dashboard",
      category: "Data & AI",
      budget: 6000,
      deadlineDays: 6,
      matchScore: 94,
      clientName: "Venture Analytics",
      clientRating: 4.88,
      clientSpent: "₹85,000+",
      clientCountry: "Mumbai, IN",
      clientVerified: true,
      skills: ["React 19", "Tailwind CSS", "Recharts", "TypeScript"],
      description: "Build an executive analytics panel with charts, responsive mobile view, and exportable CSV reports for our Q3 marketing cohort tests.",
      postedTime: "1d ago",
      proposalsCount: 7,
      featured: false,
      isUrgentFast: false
    },
    {
      id: 4,
      title: "Technical Whitepaper on Autonomous Payment Agents",
      category: "Content & Research",
      budget: 3500,
      deadlineDays: 3,
      matchScore: 92,
      clientName: "FinTech Research Group",
      clientRating: 4.92,
      clientSpent: "₹65,000+",
      clientCountry: "San Francisco, US",
      clientVerified: true,
      skills: ["Technical Writing", "KaTeX", "LaTeX", "Whitepaper", "Escrow"],
      description: "Author a comprehensive 10-page research report evaluating smart escrow systems vs traditional payment gateways with LaTeX mathematical models.",
      postedTime: "2d ago",
      proposalsCount: 4,
      featured: false,
      isUrgentFast: true
    },
    {
      id: 5,
      title: "FastAPI REST Microservice & Postgres Schema Migrations",
      category: "Web Development",
      budget: 5000,
      deadlineDays: 5,
      matchScore: 90,
      clientName: "Apex Cloud Services",
      clientRating: 4.8,
      clientSpent: "₹45,000+",
      clientCountry: "Hyderabad, IN",
      clientVerified: true,
      skills: ["Python", "FastAPI", "PostgreSQL", "Alembic", "SQLAlchemy"],
      description: "Set up async database models, JWT token rotation middleware, and auto-generated OpenAPI documentation for our multi-tenant SaaS backend.",
      postedTime: "2d ago",
      proposalsCount: 5,
      featured: false,
      isUrgentFast: false
    },
    {
      id: 6,
      title: "Brand Identity, Vector Logo & Design System for Startup",
      category: "Design",
      budget: 2500,
      deadlineDays: 4,
      matchScore: 88,
      clientName: "Nova Spark Digital",
      clientRating: 4.75,
      clientSpent: "₹30,000+",
      clientCountry: "London, UK",
      clientVerified: false,
      skills: ["Figma", "UI/UX", "Brand Identity", "Vector Graphics"],
      description: "Create complete brand guidelines, responsive logo variants, typography tokens, and social media presentation banners in Figma.",
      postedTime: "3d ago",
      proposalsCount: 8,
      featured: false,
      isUrgentFast: false
    }
  ];

  const categories = ["All", "Web Development", "Data & AI", "FinTech", "Content & Research", "Design"];

  const trendingTags = [
    { name: "React 19", count: "14 jobs" },
    { name: "FastAPI", count: "9 jobs" },
    { name: "PayPal REST API", count: "12 jobs" },
    { name: "Python", count: "18 jobs" },
    { name: "Next.js", count: "11 jobs" },
    { name: "Figma", count: "7 jobs" }
  ];

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchCat = selectedCategory === "All" || j.category === selectedCategory;
      const matchSearch = 
        !search ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.description.toLowerCase().includes(search.toLowerCase()) ||
        j.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
        j.clientName.toLowerCase().includes(search.toLowerCase());
      const matchBudget = j.budget >= minBudget;
      const matchTag = !quickTag || j.skills.includes(quickTag);
      const matchFast = !fastRequiringOnly || j.deadlineDays <= 4;
      const matchVerified = !verifiedClientsOnly || j.clientVerified;

      return matchCat && matchSearch && matchBudget && matchTag && matchFast && matchVerified;
    }).sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "budget_high") return b.budget - a.budget;
      return a.id - b.id;
    });
  }, [jobs, selectedCategory, search, minBudget, quickTag, fastRequiringOnly, verifiedClientsOnly, sortBy]);

  return (
    <div className="min-h-screen bg-[#070C1A] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Public Navbar */}
      <LandingNavbar />

      {/* Hero Header */}
      <section className="relative px-8 pt-8 pb-12 max-w-[1400px] mx-auto border-b border-slate-800/80">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Client Contracts • Guaranteed PayPal Smart Escrow</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Explore Available Projects
            </h1>
            <p className="text-sm md:text-base text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Discover client contracts with secured milestone escrows. Filter by stack, budget, or turnaround time to find work that fits your schedule.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/login?mode=register&role=freelancer"
              className="px-6 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <span>Join as Freelancer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl font-bold text-xs transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="mt-8 relative max-w-3xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by keywords, tech stack, or client (e.g. React 19, FastAPI, PayPal)..."
            className="w-full pl-12 pr-10 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm font-medium text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-xl"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Trending Tags Row */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Trending:
          </span>
          {trendingTags.map((t) => (
            <button
              key={t.name}
              onClick={() => setQuickTag(quickTag === t.name ? null : t.name)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                quickTag === t.name 
                  ? "bg-blue-600 text-white" 
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60"
              }`}
            >
              #{t.name} <span className="text-slate-400 text-[10px]">({t.count})</span>
            </button>
          ))}
          {quickTag && (
            <button onClick={() => setQuickTag(null)} className="text-rose-400 font-semibold hover:underline ml-2">
              Clear tag
            </button>
          )}
        </div>
      </section>

      {/* Main Two-Column Layout (Left: Filters, Right: Job Feed) */}
      <div className="max-w-[1400px] mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Detailed Filter Engine */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-[#0D152A] border border-slate-800 rounded-3xl p-6 sticky top-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-400" /> Filter Opportunities
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setMinBudget(0);
                  setSearch("");
                  setQuickTag(null);
                  setFastRequiringOnly(false);
                  setVerifiedClientsOnly(true);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Category</label>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      selectedCategory === cat 
                        ? "bg-blue-600 text-white font-bold" 
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Filter */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-300 uppercase tracking-wider">Minimum Budget</label>
                <span className="font-mono text-emerald-400 font-bold">
                  {minBudget === 0 ? "Any Budget" : `₹${minBudget.toLocaleString()}+`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="8000"
                step="1000"
                value={minBudget}
                onChange={(e) => setMinBudget(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Any</span>
                <span>₹3,000</span>
                <span>₹5,000</span>
                <span>₹8,000+</span>
              </div>
            </div>

            {/* Turnaround / Fast Urgent */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Turnaround Time</label>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-xl hover:bg-slate-800/50 transition-colors">
                <input
                  type="checkbox"
                  checked={fastRequiringOnly}
                  onChange={(e) => setFastRequiringOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Fast Turnaround (&le; 4 days)
                </span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-xl hover:bg-slate-800/50 transition-colors">
                <input
                  type="checkbox"
                  checked={verifiedClientsOnly}
                  onChange={(e) => setVerifiedClientsOnly(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PayPal Escrow Verified Clients
                </span>
              </label>
            </div>

            {/* Escrow Guarantee Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/60 to-indigo-950/60 border border-blue-900/40 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-cyan-400">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>100% Guaranteed Escrow</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Clients must authorize and fund PayPal escrow before project milestones kick off. Get paid on-time upon deliverable review.
              </p>
            </div>

          </div>
        </aside>

        {/* Right Main Feed: Project Opportunity Cards */}
        <main className="lg:col-span-3 space-y-5">
          
          {/* Header Controls: Count & Sorter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-sm font-bold text-white">
                Showing <strong className="text-blue-400">{filteredJobs.length}</strong> available projects
              </span>
              {(selectedCategory !== "All" || minBudget > 0 || quickTag) && (
                <span className="text-xs text-slate-400 ml-2">with active filters</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Sort by:</span>
              {(["match", "budget_high", "newest"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    sortBy === s 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                      : "bg-[#0D152A] text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {s === "match" ? "AI Match" : s === "budget_high" ? "Highest Budget" : "Newest"}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <div className="bg-[#0D152A] rounded-3xl p-12 text-center border border-slate-800">
              <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No contracts matching your filters</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Try clearing selected tags or lowering minimum budget.</p>
              <button
                type="button"
                onClick={() => { setSelectedCategory("All"); setMinBudget(0); setSearch(""); setQuickTag(null); }}
                className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div 
                key={job.id}
                className="bg-[#0D152A] hover:bg-[#101A33] border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 transition-all duration-200 shadow-xl relative overflow-hidden group"
              >
                {/* Ribbon Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {job.isUrgentFast && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-amber-400" /> Fast Turnaround ({job.deadlineDays}d)
                    </span>
                  )}

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                    {job.category}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {job.matchScore}% Match
                  </span>

                  <span className="text-[11px] text-slate-500 font-medium ml-auto">
                    Posted {job.postedTime} • {job.proposalsCount} proposals
                  </span>
                </div>

                {/* Job Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
                  {job.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-2">
                  {job.description}
                </p>

                {/* Skill Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-5">
                  {job.skills.map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer Line: Client Info & Fixed Budget + CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="text-white font-bold flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" /> {job.clientName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {job.clientRating}
                    </span>
                    <span>•</span>
                    <span>{job.clientSpent} spent</span>
                    <span>•</span>
                    <span>{job.clientCountry}</span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Fixed Budget</span>
                      <span className="text-xl font-black text-white">₹{job.budget.toLocaleString()}</span>
                    </div>

                    <Link
                      href={`/login?mode=register&role=freelancer&ref=job_${job.id}`}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Apply for Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))
          )}

        </main>
      </div>

    </div>
  );
}
