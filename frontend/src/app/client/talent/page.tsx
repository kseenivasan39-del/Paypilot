"use client";

import { useState } from "react";
import { 
  Users, Search, Filter, Star, Sparkles, CheckCircle2, ShieldCheck, 
  MapPin, Clock, DollarSign, ArrowRight, MessageSquare, Send, Check,
  Briefcase, ChevronDown, ExternalLink, X, FileText
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import TaxInvoiceModal, { InvoiceData } from "@/components/TaxInvoiceModal";

interface FreelancerProfile {
  id: number;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  reviewsCount: number;
  hourlyRateINR: number;
  location: string;
  matchScore: number;
  completedJobs: number;
  availability: "AVAILABLE" | "BUSY" | "WEEKENDS";
  verifiedPayPal: boolean;
  skills: string[];
  bio: string;
  featuredWork: string;
}

const FREELANCERS_DATA: FreelancerProfile[] = [
  {
    id: 1,
    name: "Rahul Kumar",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    title: "Full-Stack Engineer & AI Verification Specialist",
    rating: 4.9,
    reviewsCount: 14,
    hourlyRateINR: 1500,
    location: "Bengaluru, India",
    matchScore: 98,
    completedJobs: 12,
    availability: "AVAILABLE",
    verifiedPayPal: true,
    skills: ["React 19", "Next.js", "Python FastAPI", "PayPal SDK", "TypeScript", "Tailwind CSS"],
    bio: "Passionate about building fast, clean full-stack web applications with bulletproof automated test coverage and seamless PayPal escrow integrations.",
    featuredWork: "College Analytics Dashboard & Multi-Vendor E-Commerce with PayPal Escrow"
  },
  {
    id: 2,
    name: "Arjun Menon",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    title: "Senior Technical Writer & Renewable Energy Researcher",
    rating: 4.8,
    reviewsCount: 19,
    hourlyRateINR: 1200,
    location: "Kochi, India",
    matchScore: 94,
    completedJobs: 24,
    availability: "AVAILABLE",
    verifiedPayPal: true,
    skills: ["Technical Writing", "Research", "LaTeX", "Data Analysis", "Python", "Academic Reports"],
    bio: "Author of over 20+ peer-reviewed technical whitepapers and college project dossiers. Rigorous citations, zero AI hallucinations, and fast turnarounds.",
    featuredWork: "10-Page Grid-Tied Solar Power Plant Feasibility Report"
  },
  {
    id: 3,
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "UI/UX Designer & Design Systems Lead",
    rating: 5.0,
    reviewsCount: 28,
    hourlyRateINR: 1800,
    location: "Mumbai, India",
    matchScore: 91,
    completedJobs: 31,
    availability: "BUSY",
    verifiedPayPal: true,
    skills: ["Figma", "UI/UX Design", "Tailwind CSS", "Prototyping", "Design Systems", "Webflow"],
    bio: "Award-winning designer crafting high-converting, accessible user interfaces. Specialized in SaaS dashboards, fintech platforms, and mobile apps.",
    featuredWork: "PayPilot Dark/Light Glassmorphism Design System"
  },
  {
    id: 4,
    name: "Devon Vance",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    title: "FinTech Backend Architect & Cloud Engineer",
    rating: 4.9,
    reviewsCount: 11,
    hourlyRateINR: 2200,
    location: "San Francisco, USA",
    matchScore: 89,
    completedJobs: 9,
    availability: "AVAILABLE",
    verifiedPayPal: true,
    skills: ["PostgreSQL", "Docker", "Node.js", "PayPal REST API", "FastAPI", "Kubernetes"],
    bio: "Architecting zero-downtime payment pipelines and idempotent webhook handlers for mission-critical e-commerce and SaaS platforms.",
    featuredWork: "Autonomous Escrow Release Webhook Orchestrator"
  },
  {
    id: 5,
    name: "Ananya Iyer",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    title: "AI & Machine Learning Engineer (LLMs / RAG)",
    rating: 4.9,
    reviewsCount: 17,
    hourlyRateINR: 2500,
    location: "Hyderabad, India",
    matchScore: 96,
    completedJobs: 15,
    availability: "AVAILABLE",
    verifiedPayPal: true,
    skills: ["Gemini 1.5", "LangChain", "Vector DBs", "Python", "FastAPI", "Prompt Engineering"],
    bio: "Specializing in autonomous agent orchestration, RAG pipelines, and automated multi-modal code review systems for enterprise compliance.",
    featuredWork: "Autonomous Milestone Deliverable Verification Engine"
  }
];

export default function ClientFreelancerDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("All");
  const [maxHourlyRate, setMaxHourlyRate] = useState<number>(3000);
  const [minRating, setMinRating] = useState<number>(4.5);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"match" | "rate_asc" | "rate_desc" | "rating">("match");

  // Invite modal state
  const [inviteModalFreelancer, setInviteModalFreelancer] = useState<FreelancerProfile | null>(null);
  const [selectedProjectToInvite, setSelectedProjectToInvite] = useState("React Dashboard for College Project");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // One-click Tax invoice preview modal
  const [taxInvoiceOpen, setTaxInvoiceOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);

  const allSkills = [
    "All", "React 19", "Next.js", "Python FastAPI", "Technical Writing", 
    "UI/UX Design", "PayPal SDK", "Gemini 1.5", "TypeScript"
  ];

  // Filtering
  const filteredFreelancers = FREELANCERS_DATA.filter((f) => {
    const matchesSearch = 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSkill = selectedSkill === "All" || f.skills.includes(selectedSkill);
    const matchesRate = f.hourlyRateINR <= maxHourlyRate;
    const matchesRating = f.rating >= minRating;
    const matchesAvailability = !onlyAvailable || f.availability === "AVAILABLE";

    return matchesSearch && matchesSkill && matchesRate && matchesRating && matchesAvailability;
  }).sort((a, b) => {
    if (sortBy === "match") return b.matchScore - a.matchScore;
    if (sortBy === "rate_asc") return a.hourlyRateINR - b.hourlyRateINR;
    if (sortBy === "rate_desc") return b.hourlyRateINR - a.hourlyRateINR;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const handleOpenInvite = (freelancer: FreelancerProfile) => {
    setInviteModalFreelancer(freelancer);
    setInviteMessage(`Hi ${freelancer.name.split(" ")[0]}, we loved your profile and would like to invite you to collaborate on "${selectedProjectToInvite}". Let us know if you are open to reviewing the milestone scope!`);
    setInviteSuccess(false);
  };

  const handleSendInvite = () => {
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteModalFreelancer(null);
      setInviteSuccess(false);
    }, 1500);
  };

  const handleGenerateSampleInvoice = (freelancer: FreelancerProfile) => {
    const invoice: InvoiceData = {
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: "28S123456R7880123",
      captureId: "CAP-99120412",
      date: "Nov 8, 2026",
      dueDate: "Immediate",
      clientName: "Sarah Johnson",
      clientCompany: "TechCorp Labs & Studios",
      clientEmail: "client@paypilot.demo",
      clientAddress: "Silicon Valley Innovation Center, CA, USA",
      freelancerName: freelancer.name,
      freelancerTitle: freelancer.title,
      freelancerEmail: `${freelancer.name.toLowerCase().replace(" ", ".")}@paypilot.demo`,
      freelancerAddress: freelancer.location,
      projectTitle: "React Dashboard for College Project",
      milestoneTitle: "Milestone 1: Dynamic Data & PayPal Escrow Capture Engine",
      amount: 3500,
      currency: "INR",
      platformFee: 0,
      taxAmount: 630,
      taxRatePercent: 18,
      netTotal: 4130,
      paymentMethod: "PayPal Smart Escrow Vault",
      status: "PAID",
      aiVerificationScore: freelancer.matchScore,
      notes: "Pre-verified via autonomous Google Gemini 1.5 code inspector."
    };
    setCurrentInvoice(invoice);
    setTaxInvoiceOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* Sidebar */}
      <AppSidebar activePage="find-projects" />

      {/* Main Content */}
      <main className="flex-1 p-8 max-w-[1600px] flex flex-col">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Client Portal • Talent Discovery
              </span>
              <span className="text-xs text-slate-400 font-medium">AI Semantic Vetting</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Find & Hire Freelancers
              <span className="text-sm font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
                {filteredFreelancers.length} available
              </span>
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              Browse top-rated developers, designers, and researchers vetted with verified PayPal escrow track records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleGenerateSampleInvoice(FREELANCERS_DATA[0])}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Generate Tax Invoice (PDF)</span>
            </button>
            <Link
              href="/projects/new"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              <span>+ Post New Project</span>
            </Link>
            <NotificationBell />
            <UserProfileMenu fallbackName="Sarah Johnson" fallbackRole="Client" />
          </div>
        </header>

        {/* Content Layout with Left Filter Sidebar and Right Talent Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR: FILTERS */}
          <aside className="w-full lg:w-72 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm shrink-0 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Filter Talent</span>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSkill("All");
                  setMaxHourlyRate(3000);
                  setMinRating(4.5);
                  setOnlyAvailable(false);
                }}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Keywords or Name</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. React, Python, Rahul..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Skills Taxonomy */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Primary Skill</label>
              <div className="flex flex-wrap gap-1.5">
                {allSkills.map((sk) => (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => setSelectedSkill(sk)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      selectedSkill === sk
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {sk}
                  </button>
                ))}
              </div>
            </div>

            {/* Hourly Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">Max Hourly Rate</label>
                <span className="font-mono font-bold text-blue-600">₹{maxHourlyRate}/hr</span>
              </div>
              <input
                type="range"
                min="1000"
                max="3000"
                step="100"
                value={maxHourlyRate}
                onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>₹1,000/hr</span>
                <span>₹3,000/hr</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Minimum Rating</label>
              <div className="grid grid-cols-3 gap-2">
                {[4.5, 4.8, 4.9].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMinRating(val)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                      minRating === val
                        ? "border-amber-400 bg-amber-50 text-amber-900 font-extrabold shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{val}+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Available Now Only</span>
                  <span className="text-[10px] text-slate-400 block">Ready to start today</span>
                </div>
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Escrow Guarantee Badge */}
            <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>PayPal Escrow Protected</span>
              </div>
              <p className="text-[11px] text-blue-700/80 leading-relaxed font-medium">
                Funds are held in PayPal sandbox escrow and released only upon your milestone approval or AI audit sign-off.
              </p>
            </div>
          </aside>

          {/* RIGHT COLUMN: TALENT LISTINGS */}
          <div className="flex-1 w-full space-y-4">
            
            {/* Sorting & Stats Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium">
                <span>Showing <strong>{filteredFreelancers.length}</strong> verified specialists</span>
                {selectedSkill !== "All" && (
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold text-[11px]">
                    Filtered by: {selectedSkill}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Sort by:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {[
                    { id: "match", label: "AI Match" },
                    { id: "rating", label: "Top Rated" },
                    { id: "rate_asc", label: "Price: Low to High" },
                    { id: "rate_desc", label: "Price: High to Low" }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSortBy(s.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        sortBy === s.id
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Freelancers Cards */}
            {filteredFreelancers.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No matching freelancers found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your filters or resetting the maximum hourly rate to discover more available talent.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFreelancers.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
                      
                      {/* Left: Avatar & Bio */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="relative shrink-0">
                          <img
                            src={freelancer.avatar}
                            alt={freelancer.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                          />
                          {freelancer.availability === "AVAILABLE" && (
                            <span 
                              className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" 
                              title="Available for immediate hire"
                            />
                          )}
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                              {freelancer.name}
                            </h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              <Sparkles className="w-3 h-3 text-blue-500" />
                              {freelancer.matchScore}% Match
                            </span>
                            {freelancer.verifiedPayPal && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Verified PayPal Seller
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-semibold text-slate-700">
                            {freelancer.title}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-0.5">
                            <div className="flex items-center gap-1 text-slate-800 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{freelancer.rating}</span>
                              <span className="text-slate-400 font-normal">({freelancer.reviewsCount} reviews)</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{freelancer.location}</span>
                            </div>
                            <span>•</span>
                            <div>
                              <span>{freelancer.completedJobs} contracts completed</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed pt-1 line-clamp-2">
                            {freelancer.bio}
                          </p>

                          {/* Featured Project */}
                          <div className="text-[11px] text-slate-500 pt-1">
                            <span className="font-bold text-slate-700">Verified Case Study: </span>
                            <span className="italic">{freelancer.featuredWork}</span>
                          </div>

                          {/* Skill Tags */}
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {freelancer.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold transition-colors"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Rate & Action Buttons */}
                      <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-3 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-right">
                          <span className="text-2xl font-black text-slate-900 tracking-tight">
                            ₹{freelancer.hourlyRateINR}
                          </span>
                          <span className="text-xs text-slate-500 font-medium block">/ hour (est.)</span>
                        </div>

                        <div className="flex items-center sm:flex-col gap-2 w-full sm:w-40">
                          <button
                            type="button"
                            onClick={() => handleOpenInvite(freelancer)}
                            className="flex-1 sm:w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Invite to Project</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleGenerateSampleInvoice(freelancer)}
                            className="py-2 px-3 sm:w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Tax Invoice Preview</span>
                          </button>

                          <Link
                            href="/messages"
                            className="py-1.5 px-3 sm:w-full text-center text-slate-500 hover:text-blue-600 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Chat</span>
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Modal: Invite to Project */}
        {inviteModalFreelancer && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setInviteModalFreelancer(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <img
                  src={inviteModalFreelancer.avatar}
                  alt={inviteModalFreelancer.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Invite {inviteModalFreelancer.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {inviteModalFreelancer.title} • ₹{inviteModalFreelancer.hourlyRateINR}/hr
                  </p>
                </div>
              </div>

              {inviteSuccess ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Invitation Sent Successfully!</h4>
                  <p className="text-xs text-slate-500">
                    {inviteModalFreelancer.name} has been notified and can review your milestone specs.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Select Project</label>
                    <select
                      value={selectedProjectToInvite}
                      onChange={(e) => setSelectedProjectToInvite(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="React Dashboard for College Project">React Dashboard for College Project (₹8,500)</option>
                      <option value="10-Page Solar Power Report">10-Page Solar Power Report (₹5,000)</option>
                      <option value="E-Commerce PayPal Checkout Flow">E-Commerce PayPal Checkout Flow (₹12,000)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Invitation Message</label>
                    <textarea
                      rows={4}
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-800 font-medium">
                    🛡️ Inviting a freelancer creates a private draft contract. No PayPal funds are locked until you formally approve milestones.
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setInviteModalFreelancer(null)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSendInvite}
                      className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Project Invite</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Global PDF Tax Invoice Modal */}
        <TaxInvoiceModal
          isOpen={taxInvoiceOpen}
          invoice={currentInvoice}
          onClose={() => setTaxInvoiceOpen(false)}
        />

      </main>
    </div>
  );
}
