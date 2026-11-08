"use client";

import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings, 
  Bell, ChevronDown, CheckCircle2, Loader2, Sparkles, ArrowRight
} from "lucide-react";
import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { aiApi, authApi } from "@/lib/api";

export default function NewProject() {
  const router = useRouter();
  const [description, setDescription] = useState("I need a 10-page technical report about solar power plants. My budget is ₹2,000 and I need it within 5 days.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    setStep(1);
    setErrorMsg("");

    if (typeof window !== "undefined") {
      sessionStorage.setItem("paypilot_project_desc", description);
    }

    try {
      if (typeof window !== "undefined" && !localStorage.getItem("paypilot_token")) {
        try {
          await authApi.loginAsDemoClient();
        } catch (authErr) {
          console.warn("Auto demo login error", authErr);
        }
      }

      const result = await aiApi.analyzeRequirements(description);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("paypilot_last_analysis", JSON.stringify(result));
      }
    } catch (err: any) {
      console.error("AI Analysis error, using fallback", err);
      const fallback = {
        title: "10-Page Technical Report on Solar Power Plants",
        category: "Technical Writing",
        suggested_budget_min: 1500,
        suggested_budget_max: 2500,
        estimated_duration: "5 days",
        estimated_complexity: "Medium",
        required_skills: ["Technical Writing", "Research", "Renewable Energy", "Report Writing"],
        key_deliverables: [
          "10-page technical report",
          "Research and data analysis",
          "Proper citations and references",
          "PDF and editable document"
        ],
        is_demo_fallback: true
      };
      if (typeof window !== "undefined") {
        sessionStorage.setItem("paypilot_last_analysis", JSON.stringify(fallback));
      }
    }
  };

  useEffect(() => {
    if (isAnalyzing && step > 0 && step <= 5) {
      const timer = setTimeout(() => {
        if (step === 5) {
          router.push("/projects/analysis");
        } else {
          setStep(s => s + 1);
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, step, router]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      
      {/* Sidebar - Copied from Client Dashboard for consistency */}
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
          <Link href="/dashboard/client" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20">
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
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-[2rem] font-extrabold text-slate-900 tracking-tight">
            Create a New Project
          </h1>
          <div className="flex items-center gap-4">
            <NotificationBell className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors" />
            <Link href="/messages" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </Link>
            <UserProfileMenu />
          </div>
        </header>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 -z-10"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-0.5 bg-blue-600 -z-10 transition-all duration-1000" style={{ width: step > 0 ? '50%' : '25%' }}></div>
            
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">1</div>
              <span className="text-sm font-bold text-blue-600">Describe</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${step > 0 ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>2</div>
              <span className={`text-sm font-medium transition-colors duration-500 ${step > 0 ? 'text-blue-600 font-bold' : 'text-slate-500'}`}>AI Analysis</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm">3</div>
              <span className="text-sm font-medium text-slate-500">Review</span>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm">4</div>
              <span className="text-sm font-medium text-slate-500">Find Talent</span>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm">5</div>
              <span className="text-sm font-medium text-slate-500">Publish</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-[1.2fr_1fr] gap-8 max-w-6xl mx-auto">
          
          {/* Left Box - Input Form */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 h-full flex flex-col">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">What do you need?</h2>
            <p className="text-slate-500 mt-2 mb-6">Describe your project in detail and let our AI analyze your requirements.</p>

            <div className="relative flex-1 flex flex-col mb-6">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isAnalyzing}
                className="w-full flex-1 min-h-[200px] rounded-xl border border-blue-200 bg-blue-50/30 p-5 text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-[15px] leading-relaxed font-medium disabled:opacity-50"
                placeholder="Describe your project..."
              ></textarea>
              <div className="absolute bottom-4 right-4 text-xs font-semibold text-slate-400">
                {description.length}/500
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm text-slate-500 font-medium mb-3">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                <button 
                  type="button"
                  onClick={() => setDescription("I need a responsive, modern website for my business with online catalog, contact form, and about page. Budget is ₹15,000 within 10 days.")}
                  className="px-4 py-2 rounded-lg bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 text-xs font-medium transition-colors border border-indigo-100 cursor-pointer"
                >
                  Website development for my business
                </button>
                <button 
                  type="button"
                  onClick={() => setDescription("I need a modern minimalist logo and brand guidelines for a tech startup. Budget is ₹5,000 within 3 days.")}
                  className="px-4 py-2 rounded-lg bg-blue-50/50 hover:bg-blue-50 text-blue-600 text-xs font-medium transition-colors border border-blue-100 cursor-pointer"
                >
                  Logo design for startup
                </button>
                <button 
                  type="button"
                  onClick={() => setDescription("I need Python data analysis and visualization dashboard on customer churn data. Budget is ₹8,000 within 7 days.")}
                  className="px-4 py-2 rounded-lg bg-indigo-50/50 hover:bg-indigo-50 text-indigo-600 text-xs font-medium transition-colors border border-indigo-100 cursor-pointer"
                >
                  Data analysis and visualization
                </button>
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full mt-auto bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {isAnalyzing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Requirements...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Analyze with AI <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>

          {/* Right Box - AI Status */}
          <div className="bg-slate-50/80 rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">PayPilot AI</h3>
                <p className="text-slate-500 text-sm font-medium">
                  {isAnalyzing ? "Analyzing your requirements..." : "Waiting for input..."}
                </p>
              </div>
            </div>

            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200 before:z-0 flex-1">
              
              <div className="absolute left-[15px] top-4 bottom-10 w-[2px] bg-slate-200 -z-10"></div>
              
              {/* Step 1 */}
              <div className={`flex items-start gap-5 relative z-10 transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-4 border-slate-50 ${step > 1 ? 'bg-emerald-500 shadow-sm' : step === 1 ? 'bg-blue-500' : 'bg-slate-300'}`}>
                  {step > 1 ? <CheckCircle2 className="w-5 h-5 text-white" /> : step === 1 ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <div>
                  <h4 className={`font-bold ${step >= 1 ? 'text-slate-900' : 'text-slate-500'}`}>Analyzing your requirements</h4>
                  <p className="text-slate-500 text-sm mt-0.5">Understanding project scope and goals...</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`flex items-start gap-5 relative z-10 transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-4 border-slate-50 ${step > 2 ? 'bg-emerald-500 shadow-sm' : step === 2 ? 'bg-blue-500' : 'bg-slate-300'}`}>
                  {step > 2 ? <CheckCircle2 className="w-5 h-5 text-white" /> : step === 2 ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <div>
                  <h4 className={`font-bold ${step >= 2 ? 'text-slate-900' : 'text-slate-500'}`}>Extracting key details</h4>
                  <p className="text-slate-500 text-sm mt-0.5">Budget, timeline, deliverables, and skills...</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`flex items-start gap-5 relative z-10 transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-4 border-slate-50 ${step > 3 ? 'bg-emerald-500 shadow-sm' : step === 3 ? 'bg-blue-500' : 'bg-slate-300'}`}>
                  {step > 3 ? <CheckCircle2 className="w-5 h-5 text-white" /> : step === 3 ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <div>
                  <h4 className={`font-bold ${step >= 3 ? 'text-slate-900' : 'text-slate-500'}`}>Identifying required skills</h4>
                  <p className="text-slate-500 text-sm mt-0.5">Matching with best talent categories...</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className={`flex items-start gap-5 relative z-10 transition-opacity duration-500 ${step >= 4 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-4 border-slate-50 ${step > 4 ? 'bg-emerald-500 shadow-sm' : step === 4 ? 'bg-blue-500' : 'bg-slate-300'}`}>
                  {step > 4 ? <CheckCircle2 className="w-5 h-5 text-white" /> : step === 4 ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <div>
                  <h4 className={`font-bold ${step >= 4 ? 'text-slate-900' : 'text-slate-500'}`}>Estimating complexity</h4>
                  <p className="text-slate-500 text-sm mt-0.5">Evaluating project requirements...</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className={`flex items-start gap-5 relative z-10 transition-opacity duration-500 ${step >= 5 ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-4 border-slate-50 ${step > 5 ? 'bg-emerald-500 shadow-sm' : step === 5 ? 'bg-blue-500' : 'bg-slate-300'}`}>
                  {step > 5 ? <CheckCircle2 className="w-5 h-5 text-white" /> : step === 5 ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <div>
                  <h4 className={`font-bold ${step >= 5 ? 'text-slate-900' : 'text-slate-500'}`}>Generating recommendations</h4>
                  <p className="text-slate-500 text-sm mt-0.5">Finding the best freelancers for you...</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
