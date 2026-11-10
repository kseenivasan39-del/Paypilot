"use client";

import { useState } from "react";
import { 
  Users, Search, Filter, Star, Sparkles, CheckCircle2, ShieldCheck, 
  MapPin, Clock, DollarSign, ArrowRight, MessageSquare, Send, Check,
  Briefcase, ChevronDown, ExternalLink, X, FileText
} from "lucide-react";
import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";
import TaxInvoiceModal, { InvoiceData } from "@/components/TaxInvoiceModal";

interface PublicFreelancer {
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
  availability: "AVAILABLE" | "BUSY";
  verifiedPayPal: boolean;
  skills: string[];
  bio: string;
  featuredWork: string;
}

const PUBLIC_FREELANCERS: PublicFreelancer[] = [
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
    name: "Sneha Rao",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    title: "Content Strategist & Senior Technical Writer",
    rating: 4.7,
    reviewsCount: 25,
    hourlyRateINR: 1200,
    location: "Mumbai, India",
    matchScore: 92,
    completedJobs: 34,
    availability: "AVAILABLE",
    verifiedPayPal: true,
    skills: ["Technical Writing", "Research", "SEO", "LaTeX", "Whitepapers", "Case Studies"],
    bio: "Creating clear, mathematically rigorous technical documentation, research whitepapers, and college engineering reports with automated verification.",
    featuredWork: "10-Page Grid-Tied Solar Power Plant Feasibility Report"
  },
  {
    id: 3,
    name: "Arjun Menon",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    title: "Renewable Energy Researcher & LaTeX Specialist",
    rating: 4.8,
    reviewsCount: 19,
    hourlyRateINR: 1400,
    location: "Kochi, India",
    matchScore: 94,
    completedJobs: 21,
    availability: "AVAILABLE",
    verifiedPayPal: true,
    skills: ["LaTeX", "Data Analysis", "Python", "Technical Writing", "Academic Reports"],
    bio: "Author of over 20+ peer-reviewed technical dossiers. Expert in KaTeX mathematical formulations and zero-plagiarism AI verification.",
    featuredWork: "Autonomous Solar Array Feasibility Dossier"
  },
  {
    id: 4,
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    title: "UI/UX Designer & Product Designer",
    rating: 5.0,
    reviewsCount: 28,
    hourlyRateINR: 1800,
    location: "Pune, India",
    matchScore: 91,
    completedJobs: 31,
    availability: "BUSY",
    verifiedPayPal: true,
    skills: ["Figma", "UI/UX Design", "Tailwind CSS", "Prototyping", "Design Systems"],
    bio: "Award-winning designer crafting modern, dark & light glassmorphic user interfaces for SaaS and fintech startups.",
    featuredWork: "PayPilot Dark/Light Glassmorphism Design System"
  },
  {
    id: 5,
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
    bio: "Architecting zero-downtime payment pipelines and idempotent webhook handlers for mission-critical e-commerce platforms.",
    featuredWork: "Autonomous Escrow Release Webhook Orchestrator"
  }
];

export default function PublicFreelancersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("All");
  const [maxHourlyRate, setMaxHourlyRate] = useState<number>(3000);
  const [minRating, setMinRating] = useState<number>(4.5);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"match" | "rate_asc" | "rate_desc" | "rating">("match");

  // Sample Tax Invoice Modal
  const [taxInvoiceOpen, setTaxInvoiceOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);

  const allSkills = [
    "All", "React 19", "Next.js", "Python FastAPI", "Technical Writing", 
    "UI/UX Design", "PayPal SDK", "LaTeX", "TypeScript"
  ];

  const filteredFreelancers = PUBLIC_FREELANCERS.filter((f) => {
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

  const handleOpenSampleInvoice = (f: PublicFreelancer) => {
    const invoice: InvoiceData = {
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: "28S123456R7880123",
      captureId: "CAP-99120412",
      date: "Nov 10, 2026",
      clientName: "Sarah Jenkins",
      clientCompany: "TechCorp Labs",
      clientEmail: "client@paypilot.demo",
      freelancerName: f.name,
      freelancerTitle: f.title,
      freelancerEmail: `${f.name.toLowerCase().replace(" ", ".")}@paypilot.demo`,
      projectTitle: "React Dashboard for College Project",
      milestoneTitle: "Milestone Deliverable Sign-off",
      amount: 3500,
      currency: "INR",
      platformFee: 0,
      taxAmount: 630,
      taxRatePercent: 18,
      netTotal: 4130,
      paymentMethod: "PayPal Smart Escrow Vault",
      status: "PAID",
      aiVerificationScore: f.matchScore
    };
    setCurrentInvoice(invoice);
    setTaxInvoiceOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Public Landing Navbar */}
      <LandingNavbar />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-12 py-10">
        
        {/* Hero Banner Header */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Semantic Matching • PayPal Escrow Protected</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Explore Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Freelancers</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base mt-2 max-w-2xl">
              Browse verified developers, writers, and designers ready to start on your project with autonomous AI milestone verification.
            </p>
          </div>

          <div className="flex items-center gap-3 self-center md:self-end">
            <Link
              href="/projects/new"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <span>+ Post a Project</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 2-Column Layout: Left Filters + Right Talent Cards */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT FILTER SIDEBAR */}
          <aside className="w-full lg:w-72 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shrink-0 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Filter className="w-4 h-4 text-cyan-400" />
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
                className="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Search by Name or Stack</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Rahul, React, Python..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Skills Pills */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Primary Skill</label>
              <div className="flex flex-wrap gap-1.5">
                {allSkills.map((sk) => (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => setSelectedSkill(sk)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      selectedSkill === sk
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white"
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
                <label className="font-bold text-slate-300">Max Hourly Rate</label>
                <span className="font-mono font-bold text-cyan-400">₹{maxHourlyRate}/hr</span>
              </div>
              <input
                type="range"
                min="1000"
                max="3000"
                step="100"
                value={maxHourlyRate}
                onChange={(e) => setMaxHourlyRate(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                <span>₹1,000/hr</span>
                <span>₹3,000/hr</span>
              </div>
            </div>

            {/* Minimum Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Minimum Rating</label>
              <div className="grid grid-cols-3 gap-2">
                {[4.5, 4.8, 4.9].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setMinRating(val)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                      minRating === val
                        ? "border-amber-400/50 bg-amber-500/10 text-amber-300 shadow-sm"
                        : "border-slate-800 bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{val}+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">Available Now</span>
                  <span className="text-[10px] text-slate-400 block">Ready to start today</span>
                </div>
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Escrow Guarantee Box */}
            <div className="p-3.5 bg-blue-950/40 rounded-2xl border border-blue-800/50 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-blue-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>PayPal Escrow Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Client milestone funds remain locked in PayPal escrow until AI checks deliverables or you confirm sign-off.
              </p>
            </div>
          </aside>

          {/* RIGHT TALENT LISTINGS */}
          <div className="flex-1 w-full space-y-4">
            
            {/* Top Bar Sort */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="text-slate-400">
                Showing <strong className="text-white">{filteredFreelancers.length}</strong> verified specialists
                {selectedSkill !== "All" && (
                  <span className="ml-2 bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {selectedSkill}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Sort by:</span>
                <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
                  {[
                    { id: "match", label: "AI Match" },
                    { id: "rating", label: "Top Rated" },
                    { id: "rate_asc", label: "Rate: Low to High" }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSortBy(s.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        sortBy === s.id
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Talent Cards */}
            {filteredFreelancers.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No freelancers found</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Try widening your rate filter or selecting "All" skills to discover more available specialists.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFreelancers.map((f) => (
                  <div
                    key={f.id}
                    className="bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 transition-all hover:shadow-xl hover:shadow-blue-900/10 group"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-5">
                      
                      {/* Left: Avatar & Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="relative shrink-0">
                          <img
                            src={f.avatar}
                            alt={f.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
                          />
                          {f.availability === "AVAILABLE" && (
                            <span 
                              className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" 
                              title="Available immediately"
                            />
                          )}
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-black text-white group-hover:text-cyan-400 transition-colors">
                              {f.name}
                            </h3>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                              <Sparkles className="w-3 h-3 text-cyan-400" />
                              {f.matchScore}% Match
                            </span>
                            {f.verifiedPayPal && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Verified PayPal Seller
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-semibold text-slate-300">
                            {f.title}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium pt-0.5">
                            <div className="flex items-center gap-1 text-slate-200 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{f.rating}</span>
                              <span className="text-slate-500 font-normal">({f.reviewsCount} reviews)</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-500" />
                              <span>{f.location}</span>
                            </div>
                            <span>•</span>
                            <span>{f.completedJobs} projects completed</span>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed pt-1 line-clamp-2">
                            {f.bio}
                          </p>

                          {/* Featured Case Study */}
                          <div className="text-[11px] text-slate-400 pt-1">
                            <span className="font-bold text-slate-300">Verified Case Study: </span>
                            <span className="italic text-cyan-300">{f.featuredWork}</span>
                          </div>

                          {/* Skills */}
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {f.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded-lg text-[10px] font-bold"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Rate & Action Buttons */}
                      <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-3 shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        <div className="text-right">
                          <span className="text-2xl font-black text-white tracking-tight">
                            ₹{f.hourlyRateINR}
                          </span>
                          <span className="text-xs text-slate-400 block">/ hour (est.)</span>
                        </div>

                        <div className="flex items-center sm:flex-col gap-2 w-full sm:w-40">
                          <Link
                            href="/projects/new"
                            className="flex-1 sm:w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Hire / Invite</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenSampleInvoice(f)}
                            className="py-2 px-3 sm:w-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Sample Invoice</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

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
