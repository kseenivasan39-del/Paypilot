"use client";

import { useState } from "react";
import { 
  User, Mail, Phone, MapPin, Briefcase, Award, 
  DollarSign, CheckCircle2, Star, ShieldCheck, Plus, X, Camera,
  Shield, CreditCard, Lock, Eye, ExternalLink, Globe, GitPullRequest,
  Sliders, ToggleLeft, ToggleRight, Sparkles, Check,
  Laptop, RefreshCw, UploadCloud, Link as LinkIcon, Share2
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  coverImage: string;
  projectUrl: string;
  githubUrl?: string;
  description: string;
}

export default function FreelancerProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "portfolio" | "payout" | "security">("profile");

  // Profile Information
  const [name, setName] = useState("Rahul Kumar");
  const [title, setTitle] = useState("Full Stack Developer & Technical Writer");
  const [hourlyRate, setHourlyRate] = useState(1500);
  const [location, setLocation] = useState("Bengaluru, India");
  const [email] = useState("rahul@paypilot.demo");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [bio, setBio] = useState("Specialized in building full-stack web applications with React, Next.js, and Python FastAPI. Passionate about writing clear technical documentation, multi-modal LLM workflows, and architecting autonomous escrow systems.");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80");

  // Work Preferences & Availability
  const [isAvailableNow, setIsAvailableNow] = useState(true);
  const [weeklyHours, setWeeklyHours] = useState(30);
  const [preferredContract, setPreferredContract] = useState<"both" | "milestone" | "hourly">("both");

  // Social & Developer Profiles
  const [githubProfile, setGithubProfile] = useState("https://github.com/rahulkumar-dev");
  const [linkedinProfile, setLinkedinProfile] = useState("https://linkedin.com/in/rahulkumar-tech");
  const [websiteUrl, setWebsiteUrl] = useState("https://rahulkumar.codes");

  // Skills
  const [skills, setSkills] = useState([
    "React 19", "Next.js", "Python", "FastAPI", "PostgreSQL", 
    "TypeScript", "Tailwind CSS", "PayPal REST API", "Technical Writing"
  ]);
  const [newSkill, setNewSkill] = useState("");

  // In-demand suggested skills to 1-click add
  const suggestedSkills = ["Docker", "GraphQL", "Redis", "LangChain", "Gemini 2.5 API"];

  // Portfolio Projects
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    {
      id: "port-1",
      title: "Real-time Fintech Analytics Dashboard",
      category: "Full Stack Development",
      coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      projectUrl: "https://demo.analytics.paypilot.dev",
      githubUrl: "https://github.com/paypilot/fintech-dashboard",
      description: "Interactive analytics engine with dark mode, WebSocket price feeds, and Recharts."
    },
    {
      id: "port-2",
      title: "Autonomous Milestone Escrow Microservice",
      category: "Backend & Systems",
      coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
      projectUrl: "https://api.escrow.paypilot.dev/docs",
      githubUrl: "https://github.com/paypilot/escrow-service",
      description: "Async FastAPI microservice managing PayPal order authorisations, webhooks, and dispute resolution."
    }
  ]);

  // Payout Settings
  const [paypalEmail, setPaypalEmail] = useState("rahul@paypilot.demo");
  const [currency, setCurrency] = useState("INR");
  const [autoWithdrawThreshold, setAutoWithdrawThreshold] = useState(5000);

  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Modals & Feedback
  const [isClientPreviewOpen, setIsClientPreviewOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjUrl, setNewProjUrl] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const handleAddSkill = (skillToAdd?: string) => {
    const val = (skillToAdd || newSkill).trim();
    if (val && !skills.includes(val)) {
      setSkills([...skills, val]);
      if (!skillToAdd) setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleCreatePortfolio = () => {
    if (!newProjTitle.trim()) return;
    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newProjTitle.trim(),
      category: "Web & API Engineering",
      coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      projectUrl: newProjUrl || "https://demo.paypilot.dev",
      description: newProjDesc || "Custom full-stack solution built with automated milestone delivery standards."
    };
    setPortfolio([newItem, ...portfolio]);
    setIsNewProjectModalOpen(false);
    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjUrl("");
    setSavedMsg("New project added to your portfolio showcase!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  const handleSaveAll = () => {
    setSavedMsg("All profile, preferences & payout settings saved successfully!");
    setTimeout(() => setSavedMsg(""), 3500);
  };

  const avatarOptions = [
    { url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80", label: "Executive Suit" },
    { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80", label: "Casual Studio" },
    { url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=250&auto=format&fit=crop&q=80", label: "Modern Tech" },
    { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&auto=format&fit=crop&q=80", label: "Classic Portrait" }
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-800">
      <AppSidebar activePage="settings" />

      <main className="flex-1 p-8 max-w-[1240px]">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wider border border-blue-100">
                Freelancer Portal
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Settings & Public Talent Card</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profile & Preferences</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your verified public identity, portfolio showcase, availability, and PayPal payout settings.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsClientPreviewOpen(true)}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-blue-600 border border-blue-200 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" /> View as Client
            </button>
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Saved Alert Banner */}
        {savedMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedMsg}</span>
          </div>
        )}

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { id: "profile", label: "Public Profile & Bio", icon: User },
            { id: "portfolio", label: "Portfolio Showcase", icon: Briefcase },
            { id: "payout", label: "Payout & Banking", icon: CreditCard },
            { id: "security", label: "Account & Security", icon: Shield }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Profile & Bio */}
        {activeTab === "profile" && (
          <div className="space-y-8 animate-in fade-in">
            
            {/* Header Hero Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img 
                      src={avatarUrl} 
                      alt="Rahul Kumar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-md"
                    />
                    <button 
                      type="button"
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
                      title="Change avatar"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-extrabold text-slate-900">{name}</h2>
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase border border-blue-100">
                        Level 2 Seller
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-500">{title}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {location}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="w-3.5 h-3.5 fill-amber-500" /> 4.9 (14 reviews)</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold"><ShieldCheck className="w-3.5 h-3.5" /> Verified PayPal Escrow Seller</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Base Hourly Rate</span>
                  <div className="text-3xl font-black text-slate-900">₹{hourlyRate}<span className="text-sm font-normal text-slate-400">/hr</span></div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Professional Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Hourly Rate (₹ INR)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">City & Country</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Professional Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-500 bg-slate-50/50 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Availability & Work Preferences Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-black text-slate-900 mb-1">Availability & Work Preferences</h3>
              <p className="text-xs text-slate-400 mb-6">Clients see your hire status and capacity when matching projects.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Availability Toggle */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Immediate Hire</span>
                    <span className="text-[11px] text-slate-400">Accepting new projects</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAvailableNow(!isAvailableNow)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      isAvailableNow ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isAvailableNow ? "translate-x-6" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                {/* Capacity Slider */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">Weekly Capacity</span>
                    <span className="font-mono font-bold text-blue-600">{weeklyHours} hrs/week</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Contract Preference */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <span className="text-xs font-bold text-slate-900 block">Contract Preference</span>
                  <div className="flex items-center gap-1.5">
                    {(["both", "milestone", "hourly"] as const).map((pref) => (
                      <button
                        key={pref}
                        type="button"
                        onClick={() => setPreferredContract(pref)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          preferredContract === pref 
                            ? "bg-slate-900 text-white" 
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {pref === "both" ? "All" : pref === "milestone" ? "Milestones" : "Hourly"}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Social & Developer Profiles */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-black text-slate-900 mb-1">Developer & Social Links</h3>
              <p className="text-xs text-slate-400 mb-6">Link your public profiles for verification and client credibility.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <GitPullRequest className="w-3.5 h-3.5 text-slate-700" /> GitHub URL
                  </label>
                  <input
                    type="url"
                    value={githubProfile}
                    onChange={(e) => setGithubProfile(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-blue-600" /> LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={linkedinProfile}
                    onChange={(e) => setLinkedinProfile(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" /> Portfolio Website
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Skills & Technical Vectorizer */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-black text-slate-900 mb-1">Skills & Technical Vectorizer</h3>
              <p className="text-xs text-slate-400 mb-6">Our Google Gemini matching engine indexes these tags against incoming client project requirements.</p>

              {/* Active Skills Tag Cloud */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {skills.map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-2 border border-blue-100"
                  >
                    <span>{skill}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Suggested Skills to 1-Click Add */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested:</span>
                {suggestedSkills.filter((s) => !skills.includes(s)).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSkill(s)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-slate-500" /> {s}
                  </button>
                ))}
              </div>

              {/* Add Custom Skill Bar */}
              <div className="flex items-center gap-3 max-w-md">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Next.js 16, GraphQL, Redis)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); }}}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill()}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Tag
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Portfolio Showcase */}
        {activeTab === "portfolio" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div>
                <h2 className="text-base font-black text-slate-900">Portfolio & Case Studies</h2>
                <p className="text-xs text-slate-400">Showcase past milestone implementations with screenshots and repository proofs.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(true)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Portfolio Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden relative">
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg uppercase">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                    <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                      {item.projectUrl && (
                        <a 
                          href={item.projectUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                        </a>
                      )}
                      {item.githubUrl && (
                        <a 
                          href={item.githubUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                        >
                          <GitPullRequest className="w-3.5 h-3.5" /> Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Payout & Banking */}
        {activeTab === "payout" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900">PayPal Payout Routing</h2>
                <p className="text-xs text-slate-400">Configure where your milestone escrow captures are deposited automatically.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Connected PayPal Sandbox Email</label>
                  <input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 bg-slate-50/50"
                  />
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sandbox Merchant Account Verified
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Settlement Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 bg-slate-50/50"
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - United States Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                  </select>
                </div>

                <div className="md:col-span-2 p-4 bg-blue-50/60 border border-blue-100 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-700">
                    <strong className="text-blue-900 font-bold block mb-0.5">Automated Escrow Protection Policy</strong>
                    All client milestone funds are securely authorized and held in PayPal Smart Escrow. Upon deliverable pre-audit passing with 95%+ confidence score, payments clear instantly to your account with 0% platform fee.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Account Security */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900">Security & Two-Factor Authentication</h2>
                <p className="text-xs text-slate-400">Protect your freelancer profile and payout wallet credentials.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
                    <p className="text-[11px] text-slate-500">Require an authenticator code when signing in or withdrawing payouts.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      twoFactorEnabled 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {twoFactorEnabled ? "2FA Enabled ✓" : "Enable 2FA"}
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Active Freelancer Session</h4>
                    <p className="text-[11px] text-slate-500">Signed in from Chrome on Windows (Bengaluru, India) • IP: 127.0.0.1</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Current Session</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Settings Bar */}
        <div className="flex justify-end pt-6">
          <button
            type="button"
            onClick={handleSaveAll}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            Save All Profile & Settings
          </button>
        </div>

        {/* Modal: Client View Preview */}
        {isClientPreviewOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setIsClientPreviewOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  Client Perspective Preview
                </span>
                <span className="text-xs text-slate-400">How clients see your proposal & talent profile</span>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={avatarUrl} alt={name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow" />
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{name}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{title}</p>
                    <div className="flex items-center gap-2 text-xs text-amber-500 font-bold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> 4.9 (14 reviews) • <span className="text-emerald-600">Verified Seller</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">₹{hourlyRate}<span className="text-xs font-normal text-slate-500">/hr</span></span>
                  <span className="block text-[11px] text-emerald-600 font-bold mt-0.5">● Ready for Immediate Hire</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">About the Freelancer</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{bio}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Verified Skill Vectorizer</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span key={s} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Showcased Projects</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {portfolio.map((p) => (
                      <div key={p.id} className="p-3 bg-white border border-slate-200 rounded-xl">
                        <p className="text-xs font-bold text-slate-900">{p.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{p.category}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsClientPreviewOpen(false)}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Avatar Photo Selector */}
        {isAvatarModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-black text-slate-900 mb-1">Select Professional Avatar</h3>
              <p className="text-xs text-slate-500 mb-4">Pick a high-resolution male portrait photo for your verified profile.</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {avatarOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(opt.url);
                      setIsAvatarModalOpen(false);
                      setSavedMsg("Profile photo updated!");
                      setTimeout(() => setSavedMsg(""), 2500);
                    }}
                    className={`p-2 rounded-2xl border text-center transition-all cursor-pointer ${
                      avatarUrl === opt.url 
                        ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20" 
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <img src={opt.url} alt={opt.label} className="w-20 h-20 rounded-full mx-auto object-cover mb-2 border border-slate-200" />
                    <span className="text-xs font-bold text-slate-800">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Portfolio Project */}
        {isNewProjectModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base font-black text-slate-900 mb-1">Add Portfolio Project</h3>
              <p className="text-xs text-slate-500 mb-4">Add a new verified milestone delivery or case study to your portfolio.</p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Project Title</label>
                  <input
                    type="text"
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    placeholder="e.g. Next.js Autonomous Marketplace"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Live Demo or Case Study URL</label>
                  <input
                    type="url"
                    value={newProjUrl}
                    onChange={(e) => setNewProjUrl(e.target.value)}
                    placeholder="https://myproject.dev"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brief Description</label>
                  <textarea
                    rows={3}
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    placeholder="Key architectural choices, technologies, and client deliverables..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewProjectModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreatePortfolio}
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold"
                  >
                    Save Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
