"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { 
  Search, Flame, Clock, DollarSign, CheckCircle2, 
  X, ArrowRight, ShieldCheck, Sparkles, SlidersHorizontal, 
  Star, Building2, Bookmark, Check, BadgeCheck, Compass,
  TrendingUp, Zap, AlertCircle, Filter
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
  isUrgentFast?: boolean;
}

export default function FreelancerFindProjectsPage() {
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [minBudget, setMinBudget] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"match" | "budget_high" | "newest">("match");
  const [savedProjectIds, setSavedProjectIds] = useState<number[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(5000);
  const [deliveryDays, setDeliveryDays] = useState<number>(5);
  const [coverNote, setCoverNote] = useState<string>(
    "Hi! I specialize in full-stack web and Python FastAPI architectures with PayPal sandbox payment flows. I would love to deliver this on time for you."
  );
  const [submitting, setSubmitting] = useState(false);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [quickTag, setQuickTag] = useState<string | null>(null);
  const [fastRequiringOnly, setFastRequiringOnly] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const projects: ProjectItem[] = [
    {
      id: 201,
      title: "Full-Stack E-Commerce Store with PayPal Escrow",
      category: "Web Development",
      budget: 8500,
      deadlineDays: 7,
      matchScore: 99,
      clientName: "TechCorp Labs",
      clientRating: 4.95,
      clientSpent: "₹1,45,000+",
      clientCountry: "Bengaluru, IN",
      clientVerified: true,
      skills: ["React 19", "Next.js", "Python FastAPI", "PayPal REST API", "Docker"],
      description: "Finalize our custom checkout flow, configure webhook triggers on milestone captures, and connect PostgreSQL order history.",
      postedTime: "12m ago",
      proposalsCount: 3,
      featured: true,
      isUrgentFast: true
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
      skills: ["React", "TypeScript", "Tailwind CSS", "Recharts"],
      description: "Build a responsive analytics panel displaying real-time revenue velocity, simulated escrow releases, and interactive cohort breakdown tables.",
      postedTime: "45m ago",
      proposalsCount: 5,
      featured: true,
      isUrgentFast: false
    },
    {
      id: 203,
      title: "Technical Whitepaper on Autonomous Payment Agents",
      category: "Content & Research",
      budget: 3800,
      deadlineDays: 3,
      matchScore: 94,
      clientName: "FinTech Research Group",
      clientRating: 4.88,
      clientSpent: "₹54,000+",
      clientCountry: "London, UK",
      clientVerified: true,
      skills: ["Technical Writing", "Fintech", "LaTeX", "Escrow Architecture"],
      description: "Draft an authoritative 12-page research study exploring how autonomous evaluation engines streamline escrow releases with automated PayPal captures.",
      postedTime: "2h ago",
      proposalsCount: 2,
      isUrgentFast: true
    },
    {
      id: 204,
      title: "FastAPI REST Microservices with Rate Limiting & Postgres",
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
      description: "Implement clean REST endpoints featuring JWT tokens, SlowAPI rate-limiting headers, and Pytest test suites.",
      postedTime: "3h ago",
      proposalsCount: 4,
      isUrgentFast: false
    },
    {
      id: 205,
      title: "SaaS Mobile-First Design System & Figma Component Kit",
      category: "Design",
      budget: 4500,
      deadlineDays: 6,
      matchScore: 89,
      clientName: "Pulse Media Works",
      clientRating: 4.75,
      clientSpent: "₹38,000+",
      clientCountry: "Berlin, DE",
      clientVerified: false,
      skills: ["Figma", "UI/UX", "Design Systems"],
      description: "Design 24 clean screens for our developer productivity suite with auto-layout tokens, accessibility guidelines, and interactive prototypes.",
      postedTime: "5h ago",
      proposalsCount: 7,
      isUrgentFast: false
    },
    {
      id: 206,
      title: "Automated Dispute Resolution Agent using Multi-Modal LLMs",
      category: "FinTech",
      budget: 9500,
      deadlineDays: 2,
      matchScore: 98,
      clientName: "Global Trust Escrow",
      clientRating: 4.98,
      clientSpent: "₹2,10,000+",
      clientCountry: "Singapore, SG",
      clientVerified: true,
      skills: ["LangChain", "Python", "PayPal SDK", "Vector DB"],
      description: "Urgent turnaround: Implement a verification pipeline that inspects submitted GitHub code against milestone criteria to trigger PayPal capture calls.",
      postedTime: "6h ago",
      proposalsCount: 1,
      featured: true,
      isUrgentFast: true
    }
  ];

  const categories = ["All", "Web Development", "Data & AI", "FinTech", "Content & Research", "Design"];

  // Trending tags with real-time indicators
  const trendingTags = [
    { name: "React 19", count: "14 jobs", isHot: true },
    { name: "FastAPI", count: "9 jobs", isHot: true },
    { name: "PayPal REST API", count: "12 jobs", isHot: false },
    { name: "Python", count: "18 jobs", isHot: true },
    { name: "Next.js", count: "11 jobs", isHot: false },
    { name: "Figma", count: "7 jobs", isHot: false }
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchSuggestions = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    return projects.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.skills.some(s => s.toLowerCase().includes(query)) ||
      p.clientName.toLowerCase().includes(query)
    ).slice(0, 4);
  }, [projects, search]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
        const matchesTag = quickTag ? p.skills.includes(quickTag) : true;
        const matchesFast = fastRequiringOnly ? p.isUrgentFast : true;
        const query = search.toLowerCase().trim();
        const matchesSearch = !query || 
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.clientName.toLowerCase().includes(query) ||
          p.skills.some((s) => s.toLowerCase().includes(query));
        const matchesMinBudget = p.budget >= minBudget;

        return matchesCategory && matchesTag && matchesFast && matchesSearch && matchesMinBudget;
      })
      .sort((a, b) => {
        if (sortBy === "match") return b.matchScore - a.matchScore;
        if (sortBy === "budget_high") return b.budget - a.budget;
        return a.id - b.id;
      });
  }, [projects, selectedCategory, quickTag, fastRequiringOnly, search, minBudget, sortBy]);

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
      setTimeout(() => setToastMsg(null), 3500);
    }, 500);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <AppSidebar activePage="find-projects" />

      <main className="flex-1 min-w-0 px-8 py-8 lg:px-12">
        
        {/* Toast */}
        {toastMsg && (
          <div className="fixed top-6 right-8 bg-emerald-600 text-white font-semibold px-5 py-3 rounded-xl shadow-lg flex items-center gap-2.5 z-50 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm">{toastMsg}</span>
          </div>
        )}

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700">
                Freelancer Portal
              </span>
              <span className="text-xs text-slate-400 font-medium">Verified Client Jobs &bull; PayPal Protected</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              Find Projects
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {filteredProjects.length} open
              </span>
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Browse jobs matched to your verified skills. Milestone funds are held securely in PayPal escrow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Clean Search, Trending Tags & Fast Requirements Deck */}
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          
          {/* Main Search Bar */}
          <div className="relative mb-4" ref={searchContainerRef}>
            <div className={`relative flex items-center rounded-xl border transition-all ${
              isSearchFocused 
                ? "border-blue-500 ring-3 ring-blue-50" 
                : "border-slate-200 hover:border-slate-300"
            } bg-slate-50/60`}>
              <Search className={`w-4 h-4 ml-3.5 ${isSearchFocused ? "text-blue-600" : "text-slate-400"}`} />
              <input
                type="text"
                placeholder="Search by keywords, tech stack, or client (e.g. React 19, FastAPI, PayPal)..."
                value={search}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => { setSearch(e.target.value); setIsSearchFocused(true); }}
                className="w-full bg-transparent px-3 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Predictive Autocomplete Dropdown */}
            {isSearchFocused && search.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-30">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Suggestions ({searchSuggestions.length})
                </div>

                {searchSuggestions.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-500">
                    No matching projects found.
                  </div>
                ) : (
                  <div className="space-y-0.5 mt-1">
                    {searchSuggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSearch(item.title);
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="pr-3">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400">{item.clientName} &bull; {item.category}</span>
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

          {/* Categories, Fast Requirements Switch, and Sorters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-slate-100">
            
            {/* Category Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => { setSelectedCategory(cat); setQuickTag(null); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Fast Requirements Pill & Sorters */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* Fast Turnaround Urgent Filter Toggle */}
              <button
                type="button"
                onClick={() => setFastRequiringOnly(!fastRequiringOnly)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                  fastRequiringOnly
                    ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                    : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${fastRequiringOnly ? "fill-white" : "fill-amber-500 text-amber-500"}`} />
                <span>Fast Requirements (≤ 3-4 days)</span>
                {fastRequiringOnly && <X className="w-3 h-3 ml-0.5" />}
              </button>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="match">AI Match</option>
                  <option value="budget_high">Budget (High)</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <select
                  value={minBudget}
                  onChange={(e) => setMinBudget(Number(e.target.value))}
                  className="bg-transparent font-bold text-slate-700 outline-none cursor-pointer"
                >
                  <option value="0">Any Budget</option>
                  <option value="3000">₹3,000+</option>
                  <option value="5000">₹5,000+</option>
                  <option value="8000">₹8,000+</option>
                </select>
              </div>
            </div>

          </div>

          {/* Trending Tags Row */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 overflow-x-auto">
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-blue-600 uppercase tracking-wider shrink-0 bg-blue-50 px-2 py-0.5 rounded-md">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trending Tags:</span>
            </div>
            
            {trendingTags.map((tag) => {
              const isSelected = quickTag === tag.name;
              return (
                <button
                  key={tag.name}
                  type="button"
                  onClick={() => setQuickTag(isSelected ? null : tag.name)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 font-bold shadow-xs"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {tag.isHot && <Flame className={`w-3 h-3 ${isSelected ? "text-amber-200 fill-amber-200" : "text-amber-500 fill-amber-500"}`} />}
                  <span>#{tag.name}</span>
                  <span className={`text-[10px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>({tag.count})</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Project Feed */}
        <div className="space-y-4 pb-16">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800">No matching projects found</h3>
              <p className="text-xs text-slate-400 mb-3">Try adjusting your search query, trending tags, or fast requirement filter.</p>
              <button
                type="button"
                onClick={() => { setSearch(""); setSelectedCategory("All"); setMinBudget(0); setQuickTag(null); setFastRequiringOnly(false); }}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors"
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
                  className={`bg-white rounded-2xl p-6 border transition-all ${
                    proj.isUrgentFast 
                      ? "border-amber-200/80 shadow-xs hover:border-amber-300"
                      : "border-slate-200 hover:border-blue-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    
                    {/* Left: Info */}
                    <div className="flex-1 min-w-0">
                      
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {proj.isUrgentFast && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-200">
                            <Zap className="w-3 h-3 fill-amber-600 text-amber-600" /> Fast Turnaround ({proj.deadlineDays}d)
                          </span>
                        )}

                        {proj.featured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-700 uppercase tracking-wider">
                            Featured
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {proj.category}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                          {proj.matchScore}% Match
                        </span>

                        <span className="text-xs text-slate-400">
                          {proj.postedTime} &bull; {proj.proposalsCount} proposals
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors mb-1.5">
                        {proj.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2 max-w-3xl">
                        {proj.description}
                      </p>

                      {/* Tech Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                        {proj.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Client Meta */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2.5 border-t border-slate-100">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700">{proj.clientName}</span>
                          {proj.clientVerified && (
                            <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                          )}
                        </div>

                        <span>&bull;</span>
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{proj.clientRating}</span>
                        </div>

                        <span>&bull;</span>
                        <span>{proj.clientSpent} spent</span>

                        <span>&bull;</span>
                        <span>{proj.clientCountry}</span>

                        <span>&bull;</span>
                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {proj.deadlineDays}d delivery
                        </span>
                      </div>

                    </div>

                    {/* Right: Pricing & Action */}
                    <div className="shrink-0 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Fixed Budget</span>
                        <div className="text-2xl font-black text-slate-900 tracking-tight">
                          ₹{proj.budget.toLocaleString()}
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 justify-start lg:justify-end">
                          <ShieldCheck className="w-3 h-3" /> PayPal Protected
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSave(proj.id)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isSaved 
                              ? "bg-blue-50 border-blue-300 text-blue-600" 
                              : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                          }`}
                          title="Save"
                        >
                          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-blue-600" : ""}`} />
                        </button>

                        {isApplied ? (
                          <button
                            disabled
                            className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4 text-emerald-600" /> Applied
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenBid(proj)}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            Apply for Project <ArrowRight className="w-3.5 h-3.5" />
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

        {/* Modal: Clean Proposal Submission */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl animate-in fade-in zoom-in-95 duration-100">
              
              <div className="flex justify-between items-start pb-4 border-b border-slate-100 mb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600 block mb-0.5">Submit Proposal</span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedProject.title}</h3>
                  <p className="text-xs text-slate-400">Client: {selectedProject.clientName} &bull; Match: {selectedProject.matchScore}%</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Bid (₹ INR)</label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Budget: ₹{selectedProject.budget.toLocaleString()}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Time (days)</label>
                    <input
                      type="number"
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Target: {selectedProject.deadlineDays} days</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Proposal Note</label>
                  <textarea
                    rows={3}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-blue-500 focus:bg-white resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>₹{bidAmount.toLocaleString()} is locked into <strong>PayPal Smart Escrow</strong> before work begins.</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmBid}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
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
