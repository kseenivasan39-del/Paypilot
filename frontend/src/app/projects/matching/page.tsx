"use client";

import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings, 
  Bell, Calendar, CheckCircle2, Star, ArrowRight, Sparkles, Loader2, Info
} from "lucide-react";
import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import CalendarDeadlinesMenu from "@/components/CalendarDeadlinesMenu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { aiApi } from "@/lib/api";

interface FreelancerMatch {
  freelancer_id: number;
  name: string;
  title: string;
  match_score: number;
  hourly_rate?: number;
  starting_rate: number;
  skills: string[];
  projects_count: number;
  completion_rate: number;
  rating: number;
  reviews_count: number;
  match_reasons: string[];
  gradient_border?: string;
  avatar_bg?: string;
}

export default function FreelancerMatching() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDemoFallback, setIsDemoFallback] = useState(false);
  const [matches, setMatches] = useState<FreelancerMatch[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchMatches() {
      setLoading(true);
      try {
        let skills: string[] = ["Technical Writing", "Research"];
        let description = "Technical report writing";

        if (typeof window !== "undefined") {
          const storedProj = sessionStorage.getItem("paypilot_confirmed_project");
          if (storedProj) {
            const parsed = JSON.parse(storedProj);
            if (parsed.skills) skills = parsed.skills;
            if (parsed.description) description = parsed.description;
          }
        }

        const res = await aiApi.matchFreelancers({
          project_description: description,
          required_skills: skills,
        });

        if (isMounted) {
          setIsDemoFallback(res.is_demo_fallback || false);
          const rawList = res.matches || res.ranked_freelancers || [];
          if (Array.isArray(rawList) && rawList.length > 0) {
            const mapped = rawList.map((f: any, idx: number) => ({
              freelancer_id: f.freelancer_id || idx + 1,
              name: f.name || "Freelancer",
              title: f.title || "Specialist",
              match_score: Math.round(f.match_score || 90),
              starting_rate: f.hourly_rate ? f.hourly_rate * 5 : 2500,
              skills: f.skills || (f.key_strengths ? f.key_strengths : skills),
              projects_count: f.completed_projects || f.projects_completed || (120 - idx * 25),
              completion_rate: f.completion_rate ? Math.round(f.completion_rate * 100) : 96,
              rating: f.rating || 4.8,
              reviews_count: f.reviews_count || (1000 - idx * 200),
              match_reasons: f.match_reasons || (f.match_reason ? [f.match_reason] : [
                "Strong technical portfolio",
                "High client satisfaction rate",
                "Available within timeline",
                "Relevant domain expertise"
              ]),
              gradient_border: idx === 0 
                ? "from-blue-400 to-indigo-500" 
                : idx === 1 
                ? "from-pink-400 to-purple-500" 
                : "from-amber-400 to-orange-500",
              avatar_bg: idx === 0 ? "bg-blue-100 text-blue-600" : idx === 1 ? "bg-purple-100 text-purple-600" : "bg-amber-100 text-amber-600"
            }));
            setMatches(mapped);
          } else {
            // If backend returned empty list, use default curated talent list
            setMatches([
              {
                freelancer_id: 1,
                name: "Rahul Kumar",
                title: "Full Stack Developer & Technical Writer",
                match_score: 96,
                starting_rate: 3000,
                skills: ["React", "Node.js", "Python", "Technical Writing"],
                projects_count: 127,
                completion_rate: 98,
                rating: 4.8,
                reviews_count: 1127,
                match_reasons: [
                  "Strong technical writing portfolio",
                  "Relevant domain experience",
                  "High client satisfaction rate",
                  "Available within your timeline"
                ],
                gradient_border: "from-blue-400 to-indigo-500",
                avatar_bg: "bg-blue-100 text-blue-600"
              },
              {
                freelancer_id: 2,
                name: "Sneha Rao",
                title: "Technical Writer & Documentation Specialist",
                match_score: 92,
                starting_rate: 2000,
                skills: ["Technical Writing", "Research", "Renewable Energy"],
                projects_count: 89,
                completion_rate: 96,
                rating: 4.8,
                reviews_count: 680,
                match_reasons: [
                  "Expert in technical reports",
                  "Experience in renewable energy",
                  "High quality work samples",
                  "Available immediately"
                ],
                gradient_border: "from-pink-400 to-purple-500",
                avatar_bg: "bg-purple-100 text-purple-600"
              },
              {
                freelancer_id: 3,
                name: "Priya Sharma",
                title: "Senior Content Strategist & Researcher",
                match_score: 84,
                starting_rate: 1800,
                skills: ["Content Writing", "Research", "SEO"],
                projects_count: 156,
                completion_rate: 94,
                rating: 4.7,
                reviews_count: 1156,
                match_reasons: [
                  "Strong research skills",
                  "Great client reviews",
                  "Competitive pricing",
                  "Available within timeline"
                ],
                gradient_border: "from-amber-400 to-orange-500",
                avatar_bg: "bg-amber-100 text-amber-600"
              }
            ]);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch AI matches from backend, using default fallback list", err);
        if (isMounted) {
          setIsDemoFallback(true);
          setMatches([
            {
              freelancer_id: 1,
              name: "Rahul Kumar",
              title: "Full Stack Developer & Technical Writer",
              match_score: 96,
              starting_rate: 3000,
              skills: ["React", "Node.js", "Python", "Technical Writing"],
              projects_count: 127,
              completion_rate: 98,
              rating: 4.8,
              reviews_count: 1127,
              match_reasons: [
                "Strong technical writing portfolio",
                "Relevant domain experience",
                "High client satisfaction rate",
                "Available within your timeline"
              ],
              gradient_border: "from-blue-400 to-indigo-500",
              avatar_bg: "bg-blue-100 text-blue-600"
            },
            {
              freelancer_id: 2,
              name: "Sneha Rao",
              title: "Technical Writer & Documentation Specialist",
              match_score: 92,
              starting_rate: 2000,
              skills: ["Technical Writing", "Research", "Renewable Energy"],
              projects_count: 89,
              completion_rate: 96,
              rating: 4.8,
              reviews_count: 680,
              match_reasons: [
                "Expert in technical reports",
                "Experience in renewable energy",
                "High quality work samples",
                "Available immediately"
              ],
              gradient_border: "from-pink-400 to-purple-500",
              avatar_bg: "bg-purple-100 text-purple-600"
            },
            {
              freelancer_id: 3,
              name: "Priya Sharma",
              title: "Senior Content Strategist & Researcher",
              match_score: 84,
              starting_rate: 1800,
              skills: ["Content Writing", "Research", "SEO"],
              projects_count: 156,
              completion_rate: 94,
              rating: 4.7,
              reviews_count: 1156,
              match_reasons: [
                "Strong research skills",
                "Great client reviews",
                "Competitive pricing",
                "Available within timeline"
              ],
              gradient_border: "from-amber-400 to-orange-500",
              avatar_bg: "bg-amber-100 text-amber-600"
            }
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchMatches();
    return () => { isMounted = false; };
  }, []);

  const handleHireAndPay = (freelancer: FreelancerMatch) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("paypilot_selected_freelancer", JSON.stringify(freelancer));
    }
    router.push("/projects/payment");
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
          <Link href="/dashboard/client" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
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
          <Link href="#" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-900/20 transition-colors">
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

        {/* Sidebar Bottom CTA */}
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-5 relative overflow-hidden shadow-xl shadow-black/50 text-left">
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-blue-500/30 blur-xl rounded-full"></div>
            <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 bg-purple-500/30 blur-xl rounded-full"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <Bot className="w-12 h-12 text-cyan-400 mb-3 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] mx-auto" />
              <p className="text-[15px] font-bold text-white mb-5 leading-snug">
                Let AI find the right talent for you.
              </p>
              <Link href="/projects/new" className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white text-sm font-bold py-2.5 rounded-xl shadow-lg shadow-blue-900/50 transition-all flex justify-center items-center gap-1">
                Try AI Matching &rarr;
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-[1300px]">
        
        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[2.2rem] font-bold text-slate-900 tracking-tight">
                AI Freelancer Matching
              </h1>
              {isDemoFallback ? (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Advisory Demo Mode
                </span>
              ) : (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Explainable AI Ranking (Advisory)
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-800">Top Freelancer Matches</h2>
            <p className="text-slate-500 font-medium mt-1">Here are the best freelancers for your project, ranked with explainable recommendations.</p>
          </div>
          <div className="flex items-center gap-4 pt-1">
            <NotificationBell className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors" />
            <Link href="/messages" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </Link>
            <CalendarDeadlinesMenu />
            <UserProfileMenu />
          </div>
        </header>

        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-lg font-bold text-slate-800">Analyzing candidate profiles and ranking matches...</p>
            <p className="text-sm text-slate-500 mt-1">Evaluating domain experience, reviews, and portfolio relevance.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((freelancer) => (
              <div key={freelancer.freelancer_id} className="bg-white rounded-[24px] shadow-sm border border-slate-100 flex relative overflow-hidden transition-all hover:shadow-md">
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${freelancer.gradient_border || "from-blue-400 to-indigo-500"}`}></div>
                
                <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-[2fr_1.5fr_auto] gap-10 items-center pl-10">
                  
                  {/* Profile Info */}
                  <div className="flex gap-6 items-start">
                    <div className={`w-24 h-24 rounded-full ${freelancer.avatar_bg || "bg-blue-100 text-blue-600"} shrink-0 border-4 border-slate-50 shadow-sm flex items-center justify-center overflow-hidden relative`}>
                      <Users className="w-10 h-10 relative z-10" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-slate-900">{freelancer.name}</h3>
                        <span className="px-3 py-1 bg-[#D1FAE5] text-[#047857] text-xs font-bold rounded-full">
                          {freelancer.match_score}% AI Match
                        </span>
                      </div>
                      <p className="text-slate-500 font-medium mb-3">{freelancer.title}</p>
                      
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 mb-4">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-700">{freelancer.rating}</span>
                        <span>({freelancer.reviews_count.toLocaleString()} reviews)</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {freelancer.skills.map((s, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-12">
                        <div>
                          <div className="text-xl font-extrabold text-slate-900">{freelancer.projects_count}</div>
                          <div className="text-xs font-medium text-slate-500">Projects</div>
                        </div>
                        <div>
                          <div className="text-xl font-extrabold text-slate-900">{freelancer.completion_rate}%</div>
                          <div className="text-xs font-medium text-slate-500">Completion</div>
                        </div>
                        <div>
                          <div className="text-xl font-extrabold text-slate-900">₹{(freelancer.starting_rate || 2500).toLocaleString()}</div>
                          <div className="text-xs font-medium text-slate-500">Starting Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="border-l border-slate-100 pl-10">
                    <h4 className="font-bold text-slate-900 mb-4">Why this match?</h4>
                    <div className="space-y-3">
                      {freelancer.match_reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <span className="text-[15px] font-medium text-slate-600">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col justify-center items-end pr-4">
                    <button 
                      onClick={() => handleHireAndPay(freelancer)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer shadow-md shadow-blue-600/20"
                    >
                      Hire & Pay <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
