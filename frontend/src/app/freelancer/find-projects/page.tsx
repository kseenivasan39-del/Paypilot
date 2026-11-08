"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { 
  Search, Filter, Flame, Clock, DollarSign, CheckCircle2, 
  X, ArrowRight, ShieldCheck, Sparkles, SlidersHorizontal, 
  TrendingUp, Star, Zap, Building2, ChevronDown, Check,
  BadgeCheck, Compass, Briefcase, Bookmark, Share2, Eye,
  ArrowUpDown, History, Tag, AlertCircle, ArrowUpRight
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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
      description: "Build a high-performance modern responsive dashboard showcasing real-time revenue velocity, simulated escrow releases, and interactive cohort breakdown tables.",
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
      description: "Design 24 pixel-perfect screens for our next-gen developer productivity suite with auto-layout tokens, accessibility guidelines, and interactive prototypes.",
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
  const popularKeywords = ["React 19", "FastAPI", "PayPal REST API", "Python", "Next.js", "Docker", "Figma"];

  // Click outside search container to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered live search suggestions
  const searchSuggestions = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    return projects.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.skills.some(s => s.toLowerCase().includes(query)) ||
      p.clientName.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [projects, search]);

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
        return a.id - b.id;
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
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Role-Aware Sidebar */}
      <AppSidebar activePage="find-projects" />

      {/* Main White Content Canvas */}
      <main className="flex-1 min-w-0 overflow-y-auto px-8 py-8 lg:px-12 relative bg-[#F8FAFC]">
        
        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-6 right-8 bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm">{toastMsg}</span>
          </div>
        )}

        {/* Clean Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Freelancer Portal
              </span>
              <span className="text-xs text-slate-500 font-medium">Verified Client Jobs &bull; PayPal Protected</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              Find Projects
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {filteredProjects.length} Available
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
              Explore contracts matched to your skills. All milestone payouts are held safely in PayPal Smart Escrow.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Clean White Interactive Search & Filter Deck */}
        <div className="mb-8 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          
          {/* Live Search Input with Predictive Dropdown */}
          <div className="relative mb-5" ref={searchContainerRef}>
            <div className={`relative flex items-center rounded-2xl border transition-all ${
              isSearchFocused 
                ? "border-blue-500 ring-4 ring-blue-100 shadow-md" 
                : "border-slate-200 hover:border-slate-300"
            } bg-slate-50/50`}>
              <Search className={`w-5 h-5 ml-4 transition-colors ${isSearchFocused ? "text-blue-600" : "text-slate-400"}`} />
              <input
                type="text"
                placeholder="Type to search projects, tech stack, or clients (e.g. React 19, FastAPI, PayPal)..."
                value={search}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => { setSearch(e.target.value); setIsSearchFocused(true); }}
                className="w-full bg-transparent px-4 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mr-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Autocomplete / Search Prediction Panel */}
            {isSearchFocused && search.trim() && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 z-30 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Matching Project Suggestions ({searchSuggestions.length})</span>
                  <span className="text-[10px] text-blue-600">Press Esc to close</span>
                </div>

                {searchSuggestions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No direct matches for &ldquo;{search}&rdquo;. You can still browse all listings below.
                  </div>
                ) : (
                  <div className="space-y-1 mt-1">
                    {searchSuggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSearch(item.title);
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-blue-50/60 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex-1 pr-4">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                              {item.category}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              By {item.clientName}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-slate-900">₹{item.budget.toLocaleString()}</span>
                          <span className="block text-[10px] font-bold text-emerald-600">{item.matchScore}% Match</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filter Controls Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setSelectedCategory(cat); setQuickPill(null); }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Quick Sorters & Min Budget */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="match">AI Match (High to Low)</option>
                  <option value="budget_high">Budget (High to Low)</option>
                  <option value="newest">Recently Posted</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-500">Min:</span>
                <select
                  value={minBudget}
                  onChange={(e) => setMinBudget(Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
                >
                  <option value="0">Any Budget</option>
                  <option value="3000">₹3,000+</option>
                  <option value="5000">₹5,000+</option>
                  <option value="8000">₹8,000+</option>
                </select>
              </div>
            </div>

          </div>

          {/* Quick Skill Hashtags */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Popular Tags:
            </span>
            {popularKeywords.map((tag) => {
              const isSelected = quickPill === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuickPill(isSelected ? null : tag)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-blue-100 text-blue-700 border border-blue-300 shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>

        </div>

        {/* Project Listings Feed */}
        <div className="space-y-4 pb-16">
          {filteredProjects.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
              <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 mb-1">No matching projects found</h3>
              <p className="text-xs text-slate-500 mb-4">Try clearing your search query or selecting a different category.</p>
              <button
                type="button"
                onClick={() => { setSearch(""); setSelectedCategory("All"); setMinBudget(0); setQuickPill(null); }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
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
                  className={`group relative p-7 rounded-3xl transition-all duration-200 bg-white border ${
                    proj.featured 
                      ? "border-blue-200 shadow-md shadow-blue-500/5 hover:border-blue-300" 
                      : "border-slate-200 hover:border-blue-200 hover:shadow-md"
                  }`}
                >
                  {/* Featured Ribbon */}
                  {proj.featured && (
                    <div className="absolute top-0 right-10 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-white" /> Featured Milestone
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Project Information */}
                    <div className="flex-1 min-w-0">
                      
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-2.5">
                        <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {proj.category}
                        </span>

                        <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                          {proj.matchScore}% Match
                        </span>

                        {proj.urgency === "Immediate" && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Urgent Hire
                          </span>
                        )}

                        <span className="text-xs text-slate-400 font-medium">
                          Posted {proj.postedTime} &bull; {proj.proposalsCount} proposals
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 tracking-tight">
                        {proj.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed max-w-3xl mb-4 line-clamp-2">
                        {proj.description}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {proj.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Client Trust Passport */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-100 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-bold text-slate-800">{proj.clientName}</span>
                          {proj.clientVerified && (
                            <BadgeCheck className="w-4 h-4 text-blue-600 fill-blue-50" />
                          )}
                        </div>

                        <span className="text-slate-300">&bull;</span>
                        <div className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{proj.clientRating}</span>
                        </div>

                        <span className="text-slate-300">&bull;</span>
                        <span>{proj.clientSpent} spent</span>

                        <span className="text-slate-300">&bull;</span>
                        <span>{proj.clientCountry}</span>

                        <span className="text-slate-300">&bull;</span>
                        <span className="flex items-center gap-1 text-slate-700 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {proj.deadlineDays} days delivery
                        </span>
                      </div>

                    </div>

                    {/* Action & Budget Block */}
                    <div className="shrink-0 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      
                      <div className="text-left lg:text-right">
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
                          Fixed Budget
                        </span>
                        <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
                          <span className="text-lg font-bold text-blue-600">₹</span>
                          {proj.budget.toLocaleString()}
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 justify-start lg:justify-end mt-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> PayPal Protected
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSave(proj.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            isSaved 
                              ? "bg-blue-50 border-blue-400 text-blue-600" 
                              : "bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                          }`}
                          title={isSaved ? "Saved to Bookmarks" : "Save Project"}
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-blue-600" : ""}`} />
                        </button>

                        {isApplied ? (
                          <button
                            disabled
                            className="px-6 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl flex items-center gap-2 cursor-not-allowed"
                          >
                            <Check className="w-4 h-4 text-emerald-600" /> Bid Submitted
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenBid(proj)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
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

        {/* Proposal Submission Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              
              <div className="flex justify-between items-start pb-5 border-b border-slate-100 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
                    Submit Proposal
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedProject.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">Client: <strong className="text-slate-800">{selectedProject.clientName}</strong> &bull; Match: <strong className="text-emerald-600">{selectedProject.matchScore}%</strong></p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Bid (₹ INR)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm">₹</span>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Budget: ₹{selectedProject.budget.toLocaleString()}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Delivery Time</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">days</span>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">Client target: {selectedProject.deadlineDays} days</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Cover Letter / Pitch</label>
                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all resize-none leading-relaxed"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-900 leading-snug">
                    <strong className="block mb-0.5 text-blue-950">PayPal Smart Escrow Protection</strong>
                    Upon offer acceptance, ₹{bidAmount.toLocaleString()} is locked into PayPal Smart Escrow. Funds are released immediately when milestone deliverables pass verification.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmBid}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Submit Proposal →"}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
