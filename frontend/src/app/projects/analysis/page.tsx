"use client";

import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings, 
  Bell, Calendar, ChevronDown, Check, X, BarChart2, ArrowRight,
  Sparkles, Info, Plus
} from "lucide-react";
import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import CalendarDeadlinesMenu from "@/components/CalendarDeadlinesMenu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { projectsApi, authApi } from "@/lib/api";

export default function AIAnalysisResults() {
  const router = useRouter();
  const [title, setTitle] = useState("10-Page Technical Report on Solar Power Plants");
  const [category, setCategory] = useState("Technical Writing");
  const [skills, setSkills] = useState<string[]>([
    "Technical Writing", "Research", "Renewable Energy", "Report Writing"
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [complexity, setComplexity] = useState("Medium");
  const [budget, setBudget] = useState("₹1,500 - ₹2,500");
  const [deadline, setDeadline] = useState("5 days");
  const [deliverables, setDeliverables] = useState<string[]>([
    "10-page technical report",
    "Research and data analysis",
    "Proper citations and references",
    "PDF and editable document"
  ]);
  const [isDemoFallback, setIsDemoFallback] = useState(false);
  const [modelUsed, setModelUsed] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("paypilot_last_analysis");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.category) setCategory(parsed.category);
          if (Array.isArray(parsed.required_skills) && parsed.required_skills.length > 0) {
            setSkills(parsed.required_skills);
          }
          if (parsed.estimated_complexity) setComplexity(parsed.estimated_complexity);
          if (parsed.suggested_budget_min && parsed.suggested_budget_max) {
            setBudget(`₹${parsed.suggested_budget_min.toLocaleString()} - ₹${parsed.suggested_budget_max.toLocaleString()}`);
          }
          if (parsed.estimated_duration) setDeadline(parsed.estimated_duration);
          if (Array.isArray(parsed.key_deliverables) && parsed.key_deliverables.length > 0) {
            setDeliverables(parsed.key_deliverables);
          }
          if (parsed.is_demo_fallback !== undefined) {
            setIsDemoFallback(parsed.is_demo_fallback);
          }
          if (parsed.model_used) {
            setModelUsed(parsed.model_used);
          }
        } catch (e) {
          console.error("Failed to parse stored analysis", e);
        }
      }
    }
  }, []);

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setIsAddingSkill(false);
    }
  };

  const handleConfirmAndFindFreelancers = async () => {
    setIsSubmitting(true);
    const confirmedData = {
      title,
      category,
      skills,
      experienceLevel,
      complexity,
      budget,
      deadline,
      deliverables,
      isDemoFallback,
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("paypilot_confirmed_project", JSON.stringify(confirmedData));
    }

    try {
      if (typeof window !== "undefined" && !localStorage.getItem("paypilot_token")) {
        await authApi.loginAsDemoClient();
      }
      // Save project to backend
      const rawBudget = parseInt(budget.replace(/[^\d]/g, "")) || 2000;
      await projectsApi.create({
        title,
        description: `Project in ${category}: ${title}. Deliverables: ${deliverables.join(", ")}`,
        category,
        budget: rawBudget,
        currency: "INR",
        deadline,
        required_skills: skills.join(", "),
        auto_analyze_ai: false
      });
    } catch (err) {
      console.warn("Could not save project to backend directly (continuing in UI flow)", err);
    } finally {
      setIsSubmitting(false);
      router.push("/projects/matching");
    }
  };

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
          <Link href="/dashboard/client" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-900/20">
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/projects/new" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            <span className="font-medium">Create Project</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Folder className="w-5 h-5" />
            <span className="font-medium">My Projects</span>
          </Link>
          <Link href="/projects/matching" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Find Freelancers</span>
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
          <Link href="/ai" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Bot className="w-5 h-5" />
            <span className="font-medium">AI Assistant</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors mt-4">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-[1400px]">
        
        {/* Header */}
        <header className="flex justify-end items-center mb-8">
          <div className="flex items-center gap-4">
            <NotificationBell className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors" />
            <Link href="/messages" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </Link>
            <CalendarDeadlinesMenu />
            <UserProfileMenu />
          </div>
        </header>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-10 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-slate-100 max-w-[1100px]">
          
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[2rem] font-bold text-slate-900 tracking-tight">AI Analysis Results</h1>
              {isDemoFallback ? (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Advisory Demo Fallback
                </span>
              ) : (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Generated (Advisory)
                </span>
              )}
            </div>
            <p className="text-slate-500 font-medium">Here's what our AI understood from your project description. You can adjust and refine any detail below.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* Project Title */}
            <div>
              <label className="block text-slate-900 font-bold mb-3">Project Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[15px] shadow-sm"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-slate-900 font-bold mb-3">Category</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 px-4 py-3.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[15px] shadow-sm bg-white cursor-pointer"
                >
                  <option>Technical Writing</option>
                  <option>Web Development</option>
                  <option>Graphic Design</option>
                  <option>Data Science</option>
                  <option>Mobile App</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-slate-900 font-bold mb-3">Required Skills</label>
              <div className="flex flex-wrap gap-2.5 items-center">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3.5 py-2 rounded-lg text-sm font-semibold border border-blue-100">
                    {skill} 
                    <X 
                      className="w-3.5 h-3.5 cursor-pointer hover:text-blue-800" 
                      onClick={() => removeSkill(skill)}
                    />
                  </div>
                ))}
                {isAddingSkill ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Skill name..."
                      className="px-3 py-1.5 border border-blue-300 rounded-lg text-xs text-slate-700 outline-none focus:ring-1 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddSkill();
                      }}
                      autoFocus
                    />
                    <button 
                      onClick={handleAddSkill}
                      className="px-2 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
                    >
                      Add
                    </button>
                    <button 
                      onClick={() => setIsAddingSkill(false)}
                      className="px-2 py-1.5 text-slate-400 text-xs hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAddingSkill(true)}
                    className="flex items-center gap-1.5 bg-slate-50 text-slate-500 px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                  >
                    + Add Skill
                  </button>
                )}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-slate-900 font-bold mb-3">Experience Level</label>
              <div className="relative">
                <select 
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 px-4 py-3.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[15px] shadow-sm bg-white cursor-pointer"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-8 mt-8">
            {/* Estimated Complexity */}
            <div>
              <label className="block text-slate-900 font-bold mb-3">Estimated Complexity</label>
              <div className="inline-flex items-center gap-2 bg-[#FFF8E6] text-[#D97706] px-4 py-2.5 rounded-xl font-bold shadow-sm border border-[#FDE68A]">
                <BarChart2 className="w-5 h-5" /> {complexity}
              </div>
            </div>

            {/* Suggested Budget */}
            <div>
              <label className="block text-slate-900 font-bold mb-3">Suggested Budget</label>
              <input 
                type="text" 
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[15px] shadow-sm font-medium"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-slate-900 font-bold mb-3">Deadline</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 pl-12 pr-4 py-3.5 text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-[15px] shadow-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <label className="block text-slate-900 font-bold mb-4">Deliverables</label>
            <div className="space-y-3.5">
              {deliverables.map((item, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                  <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-slate-700 font-medium group-hover:text-slate-900 text-[15px]">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-slate-100">
            <Link 
              href="/projects/new"
              className="px-6 py-3.5 rounded-xl border-2 border-blue-600 text-blue-600 font-bold text-[15px] hover:bg-blue-50 transition-colors"
            >
              Edit Prompt
            </Link>
            <button 
              onClick={handleConfirmAndFindFreelancers}
              disabled={isSubmitting}
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[15px] shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Finding Talent..." : "Confirm & Find Freelancers"} <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
