import Link from "next/link";
import { ArrowRight, CheckCircle2, Target, ShieldCheck, BarChart2, Clock, Zap, Shield, ChevronDown, FileText } from "lucide-react";

export default function ForFreelancersPage() {
  return (
    <>
      <section className="relative z-20 px-10 py-16 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 min-h-[750px]">
        {/* Left Content */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700/50 bg-slate-800/30 text-[11px] font-medium text-slate-400 mb-8">
            <span className="text-blue-400">AI Powered</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>PayPal Secured</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>Trusted by Clients</span>
          </div>

          <h1 className="text-[3.5rem] leading-[1.1] font-extrabold text-white tracking-tight mb-6">
            Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">better projects.</span><br />
            Get paid <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">securely.</span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg">
            Join PayPilot as a freelancer, get matched with the right clients using AI, work on exciting projects, and receive secure payments through <span className="font-bold text-white">PayPal</span>.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link href="/dashboard/freelancer" className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-[15px] flex items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all">
              Create Freelancer Profile <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard/freelancer" className="border border-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-[15px] transition-colors">
              Browse Projects
            </Link>
          </div>

          <div className="flex items-center gap-6 text-[13px] font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified clients
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI project matching
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secure PayPal payments
            </div>
          </div>
        </div>

        {/* Right Content - App Mockup */}
        <div className="flex-1 w-full relative perspective-[1000px] mt-12 lg:mt-0">
          
          {/* Annotations */}
          <div className="absolute left-[-60px] top-[40%] z-30 transform -rotate-12">
            <div className="font-['Caveat',cursive] text-xl text-blue-300 w-24 text-center leading-tight mb-1">
              More relevant projects
            </div>
            <svg className="w-10 h-10 text-blue-500 mx-auto opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path></svg>
          </div>
          
          <div className="absolute right-[-40px] bottom-[20%] z-30 transform rotate-6">
            <svg className="w-10 h-10 text-blue-500 mx-auto opacity-80 mb-1 transform rotate-180 scale-x-[-1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="m19 12-7 7-7-7"></path></svg>
            <div className="font-['Caveat',cursive] text-xl text-blue-300 w-28 text-center leading-tight">
              Secure and timely payments
            </div>
          </div>

          {/* Glass Window */}
          <div className="relative z-20 w-full rounded-2xl bg-[#0B1121]/90 border border-blue-500/30 shadow-[0_0_80px_rgba(30,58,138,0.5)] backdrop-blur-xl overflow-hidden transform rotate-y-[5deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-0 mb-6">
            
            {/* Window Header */}
            <div className="h-8 flex items-center px-4 justify-end gap-2 bg-[#0F172A]/50 border-b border-slate-800">
               <div className="w-3 h-3 text-slate-500 text-[10px] font-bold">_</div>
               <div className="w-3 h-3 text-slate-500 text-[10px] font-bold">□</div>
               <div className="w-3 h-3 text-slate-500 text-[10px] font-bold">×</div>
            </div>

            {/* Window Body */}
            <div className="p-4 flex gap-4 h-[420px]">
              
              {/* Fake Sidebar */}
              <div className="w-32 shrink-0 space-y-3 pt-2">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-3 h-3 text-white transform -rotate-90" viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z"/></svg>
                  </div>
                  <span className="font-bold text-xs text-white">PayPilot</span>
                </div>
                <div className="flex items-center gap-2 text-white text-[10px] py-1.5 bg-blue-600 rounded-lg px-2"><div className="w-3 h-3 border border-current rounded-sm"></div> Dashboard</div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] py-1.5 px-2"><div className="w-3 h-3 border border-current rounded-sm"></div> My Proposals</div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] py-1.5 px-2"><div className="w-3 h-3 border border-current rounded-sm"></div> Active Projects</div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] py-1.5 px-2"><div className="w-3 h-3 border border-current rounded-sm"></div> Earnings</div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] py-1.5 px-2"><div className="w-3 h-3 border border-current rounded-sm"></div> Messages</div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] py-1.5 px-2"><div className="w-3 h-3 border border-current rounded-sm"></div> AI Assistant</div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] py-1.5 px-2"><div className="w-3 h-3 border border-current rounded-sm"></div> Profile</div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] py-1.5 px-2"><div className="w-3 h-3 border border-current rounded-sm"></div> Settings</div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col gap-4 bg-white rounded-xl p-5 overflow-hidden">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-slate-900 font-extrabold text-[18px]">Welcome back, Rahul!</h3>
                    <p className="text-[10px] font-medium text-slate-500">Find new opportunities and grow your freelance career.</p>
                  </div>
                  <div className="bg-blue-600 text-white text-[9px] font-bold py-1.5 px-3 rounded flex items-center gap-1">Browse Projects &rarr;</div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-[14px] font-bold text-slate-900">₹28,500</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-slate-500">Total Earnings</span>
                      <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1 py-0.5 rounded font-bold">+12%</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="text-[14px] font-bold text-slate-900 mb-1">5</div>
                    <div className="text-[9px] text-slate-500">Active Projects</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="text-[14px] font-bold text-slate-900 mb-1">12</div>
                    <div className="text-[9px] text-slate-500">Completed</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="text-[14px] font-bold text-slate-900 mb-1 flex items-center gap-1"><span className="text-yellow-400">★</span> 4.8</div>
                    <div className="text-[9px] text-slate-500">Client Rating</div>
                  </div>
                </div>

                <div className="flex gap-4 h-full min-h-0">
                  {/* Recommended Projects */}
                  <div className="flex-[3] border border-slate-200 rounded-lg p-3 flex flex-col h-full min-h-0">
                    <div className="flex justify-between items-center mb-3 shrink-0">
                      <h4 className="text-[11px] font-bold text-slate-900">Recommended Projects for You</h4>
                      <span className="text-[9px] font-bold text-blue-600">View All</span>
                    </div>
                    
                    <div className="space-y-2 overflow-hidden flex-1">
                      <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100"><div className="w-4 h-4 border border-blue-400 rounded-full"></div></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-slate-900 truncate">React Dashboard Development</div>
                          <div className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded inline-block mt-0.5">Web Development</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end gap-2 mb-0.5">
                            <div className="text-[10px] font-bold text-slate-900">₹15,000</div>
                            <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded font-bold">96% Match</span>
                          </div>
                          <div className="text-[8px] text-slate-400">2-3 weeks</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100"><BarChart2 className="w-4 h-4 text-blue-500" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-slate-900 truncate">Data Analysis and Visualization</div>
                          <div className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded inline-block mt-0.5">Data Analysis</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end gap-2 mb-0.5">
                            <div className="text-[10px] font-bold text-slate-900">₹8,000</div>
                            <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded font-bold">92% Match</span>
                          </div>
                          <div className="text-[8px] text-slate-400">1-2 weeks</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100"><FileText className="w-4 h-4 text-blue-500" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-slate-900 truncate">Technical Report Writing</div>
                          <div className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded inline-block mt-0.5">Technical Writing</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end gap-2 mb-0.5">
                            <div className="text-[10px] font-bold text-slate-900">₹5,000</div>
                            <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1 py-0.5 rounded font-bold">88% Match</span>
                          </div>
                          <div className="text-[8px] text-slate-400">5 days</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Earnings Overview */}
                  <div className="flex-[2] border border-slate-200 rounded-lg p-3 flex flex-col h-full min-h-0">
                    <div className="flex justify-between items-center mb-4 shrink-0">
                      <h4 className="text-[11px] font-bold text-slate-900">Earnings Overview</h4>
                      <div className="border border-slate-200 rounded px-1.5 py-0.5 text-[8px] text-slate-500 flex items-center gap-1">Last 6 months <ChevronDown className="w-2 h-2" /></div>
                    </div>
                    {/* Fake Chart */}
                    <div className="flex-1 flex items-end justify-between px-1 gap-1">
                      <div className="w-full flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-400 rounded-t-sm" style={{height: '30%'}}></div>
                        <div className="text-[7px] text-slate-400">Apr</div>
                      </div>
                      <div className="w-full flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-400 rounded-t-sm" style={{height: '50%'}}></div>
                        <div className="text-[7px] text-slate-400">May</div>
                      </div>
                      <div className="w-full flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-400 rounded-t-sm" style={{height: '40%'}}></div>
                        <div className="text-[7px] text-slate-400">Jun</div>
                      </div>
                      <div className="w-full flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-400 rounded-t-sm" style={{height: '70%'}}></div>
                        <div className="text-[7px] text-slate-400">Jul</div>
                      </div>
                      <div className="w-full flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-400 rounded-t-sm" style={{height: '50%'}}></div>
                        <div className="text-[7px] text-slate-400">Aug</div>
                      </div>
                      <div className="w-full flex flex-col items-center gap-1">
                        <div className="w-full bg-blue-500 rounded-t-sm" style={{height: '90%'}}></div>
                        <div className="text-[7px] text-slate-400">Sep</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
          {/* Floating Callout Boxes Under Window */}
          <div className="flex gap-3 justify-center z-30 relative px-4">
            <div className="bg-[#0B1121] border border-slate-700 rounded-xl p-3 flex items-center gap-3 shadow-xl">
              <div className="w-8 h-8 rounded-lg bg-[#3b0764] flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-[10px] font-medium text-slate-300 leading-tight w-24">AI finds the right projects based on your skills</div>
            </div>
            
            <div className="bg-[#0B1121] border border-slate-700 rounded-xl p-3 flex items-center gap-3 shadow-xl">
              <div className="w-8 h-8 rounded-lg bg-[#0c4a6e] flex items-center justify-center shrink-0">
                <span className="font-bold text-[14px] text-blue-400 italic tracking-tighter pr-0.5">P</span>
              </div>
              <div className="text-[10px] font-medium text-slate-300 leading-tight w-24">Get paid securely through PayPal</div>
            </div>
            
            <div className="bg-[#0B1121] border border-slate-700 rounded-xl p-3 flex items-center gap-3 shadow-xl">
              <div className="w-8 h-8 rounded-lg bg-[#064e3b] flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-[10px] font-medium text-slate-300 leading-tight w-24">Focus on your work we handle the payments</div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-20 px-10 py-16 max-w-[1400px] mx-auto border-t border-slate-800/50">
        <h2 className="text-[1.35rem] font-bold text-white mb-8">Why freelancers choose PayPilot</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#0B1120] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-colors flex flex-col justify-between">
            <div className="w-12 h-12 bg-indigo-900/40 rounded-xl flex items-center justify-center mb-6 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-white mb-2">AI Project Matching</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Get matched with projects that fit your skills, experience and interests.</p>
            </div>
          </div>

          <div className="bg-[#0B1120] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-colors flex flex-col justify-between">
            <div className="w-12 h-12 bg-teal-900/40 rounded-xl flex items-center justify-center mb-6 text-teal-400 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-white mb-2">Secure Payments</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Receive payments through PayPal with full transaction protection.</p>
            </div>
          </div>

          <div className="bg-[#0B1120] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-colors flex flex-col justify-between">
            <div className="w-12 h-12 bg-purple-900/40 rounded-xl flex items-center justify-center mb-6 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-white mb-2">Build Your Reputation</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Grow your profile with verified projects and client reviews.</p>
            </div>
          </div>

          <div className="bg-[#0B1120] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-colors flex flex-col justify-between">
            <div className="w-12 h-12 bg-blue-900/40 rounded-xl flex items-center justify-center mb-6 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-white mb-2">Flexible Opportunities</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">Choose projects that fit your schedule and work from anywhere.</p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-20 px-10 py-10 max-w-[1400px] mx-auto mb-20">
        <div className="bg-[#0A1024] border border-blue-900/30 rounded-3xl p-10 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[30%] h-[100%] bg-purple-600/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="flex -space-x-4 bg-slate-900/50 p-2 rounded-full border border-slate-800 items-center shrink-0">
              <img className="w-12 h-12 rounded-full border-2 border-[#0A1024] object-cover" src="https://i.pravatar.cc/150?img=11" alt="" />
              <img className="w-12 h-12 rounded-full border-2 border-[#0A1024] object-cover" src="https://i.pravatar.cc/150?img=5" alt="" />
              <img className="w-12 h-12 rounded-full border-2 border-[#0A1024] object-cover" src="https://i.pravatar.cc/150?img=12" alt="" />
              <div className="w-12 h-12 rounded-full border-2 border-[#0A1024] bg-slate-800 flex items-center justify-center text-[11px] font-bold text-white">5K+</div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Join thousands of freelancers already growing with PayPilot.</h2>
              <p className="text-[13px] text-slate-400">Find meaningful projects. Get paid securely. Build your freelance career.</p>
            </div>
          </div>

          <Link href="/dashboard/freelancer" className="relative z-10 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-[15px] flex items-center gap-2 shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all shrink-0">
            Get Started as a Freelancer <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
