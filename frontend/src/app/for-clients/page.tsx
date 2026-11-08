import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Users, ListChecks, CreditCard, Sparkles, ShieldCheck, FileCheck2, ChevronRight, ChevronLeft, Quote } from "lucide-react";

export default function ForClientsPage() {
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
            <span>Trusted Freelancers</span>
          </div>

          <h1 className="text-[3.5rem] leading-[1.1] font-extrabold text-white tracking-tight mb-6">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">right talent.</span><br />
            Pay with confidence.
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg">
            Describe your project, let AI match you with skilled freelancers, and manage payments through <span className="font-bold text-white">PayPal</span>.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link href="/projects/new" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-8 py-4 rounded-xl font-bold text-[15px] flex items-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all">
              Start a Project <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/client/talent" className="border border-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold text-[15px] transition-colors">
              Explore Freelancers
            </Link>
          </div>

          <div className="flex items-center gap-6 text-[13px] font-medium text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified freelancers
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI powered matching
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Secure PayPal payments
            </div>
          </div>
        </div>

        {/* Right Content - App Mockup */}
        <div className="flex-1 w-full relative perspective-[1000px]">
          {/* Annotation */}
          <div className="absolute left-[-80px] bottom-[20%] z-30 transform -rotate-6">
            <svg className="w-16 h-16 text-blue-500 mb-2 transform scale-x-[-1] -rotate-45 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            <div className="font-['Caveat',cursive] text-2xl text-blue-300 w-48 leading-tight">
              AI finds the best talent for your project
            </div>
          </div>

          {/* Glass Window */}
          <div className="relative z-20 w-full rounded-2xl bg-[#0B1121]/90 border border-slate-700/50 shadow-[0_30px_100px_rgba(30,58,138,0.4)] backdrop-blur-xl overflow-hidden transform rotate-y-[-5deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-0">
            
            {/* Window Header */}
            <div className="h-10 bg-[#0F172A] border-b border-slate-800 flex items-center px-4 justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              </div>
              <div className="flex gap-2 text-slate-500">
                <div className="w-4 h-4 rounded border border-slate-600 flex items-center justify-center text-[10px]">+</div>
                <div className="w-4 h-4 rounded border border-slate-600 flex items-center justify-center text-[10px]">_</div>
              </div>
            </div>

            {/* Window Body */}
            <div className="p-4 flex gap-4 h-[420px]">
              
              {/* Fake Sidebar */}
              <div className="w-40 shrink-0 space-y-4">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z"/></svg>
                  </div>
                  <span className="font-bold text-sm text-white">PayPilot</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs py-1.5"><div className="w-3.5 h-3.5 border border-current rounded-sm"></div> Dashboard</div>
                <div className="flex items-center gap-2 text-slate-400 text-xs py-1.5"><div className="w-3.5 h-3.5 border border-current rounded-sm"></div> Create Project</div>
                <div className="flex items-center gap-2 text-blue-400 text-xs py-1.5 bg-blue-900/30 px-2 -mx-2 rounded-lg"><div className="w-3.5 h-3.5 border border-current rounded-sm"></div> Find Freelancers</div>
                <div className="flex items-center gap-2 text-slate-400 text-xs py-1.5"><div className="w-3.5 h-3.5 border border-current rounded-sm"></div> Transactions</div>
                <div className="flex items-center gap-2 text-slate-400 text-xs py-1.5"><div className="w-3.5 h-3.5 border border-current rounded-sm"></div> AI Assistant</div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="text-white font-bold text-[15px]">AI Matched Freelancers</h3>
                    <p className="text-[10px] text-slate-400">Based on your project requirements, here are the best matches.</p>
                  </div>
                  <span className="text-[10px] text-blue-400">View All</span>
                </div>

                {/* Match Card 1 */}
                <div className="bg-[#1E293B] rounded-xl p-3 flex gap-3 items-center border border-slate-700/50">
                  <img src="https://i.pravatar.cc/150?u=1" className="w-10 h-10 rounded-full" alt="" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-white">Rahul Kumar</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded font-bold">96% Match</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mb-1">Technical Writer • <span className="text-yellow-400">★ 4.8</span> (127)</div>
                    <div className="flex gap-1">
                      <span className="text-[9px] bg-[#0F172A] border border-slate-700 text-slate-300 px-1.5 rounded">Technical Writing</span>
                      <span className="text-[9px] bg-[#0F172A] border border-slate-700 text-slate-300 px-1.5 rounded">Research</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-bold text-white">₹3,000</div>
                    <div className="text-[9px] text-slate-400 mb-2">5 days</div>
                    <div className="bg-blue-600 text-white text-[9px] font-bold py-1 px-3 rounded-lg">View Profile</div>
                  </div>
                </div>

                {/* Match Card 2 */}
                <div className="bg-[#1E293B] rounded-xl p-3 flex gap-3 items-center border border-slate-700/50">
                  <img src="https://i.pravatar.cc/150?u=2" className="w-10 h-10 rounded-full" alt="" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-white">Sneha Rao</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded font-bold">92% Match</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mb-1">Content Writer • <span className="text-yellow-400">★ 4.7</span> (95)</div>
                    <div className="flex gap-1">
                      <span className="text-[9px] bg-[#0F172A] border border-slate-700 text-slate-300 px-1.5 rounded">Research</span>
                      <span className="text-[9px] bg-[#0F172A] border border-slate-700 text-slate-300 px-1.5 rounded">SEO</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[12px] font-bold text-white">₹2,000</div>
                    <div className="text-[9px] text-slate-400 mb-2">4 days</div>
                    <div className="bg-blue-600 text-white text-[9px] font-bold py-1 px-3 rounded-lg">View Profile</div>
                  </div>
                </div>

              </div>

              {/* Right Panel Summary */}
              <div className="w-44 bg-[#0F172A] rounded-xl p-4 border border-slate-800 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[12px] font-bold text-white">Project Summary</h4>
                  <span className="text-[10px] text-blue-400">Edit</span>
                </div>
                
                <div className="space-y-3 flex-1">
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5"><div className="w-3 h-3 border border-current rounded-sm"></div> Project Type</div>
                    <div className="text-[11px] text-slate-300">Technical Writing</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5"><div className="w-3 h-3 border border-current rounded-sm"></div> Description</div>
                    <div className="text-[11px] text-slate-300 line-clamp-2">10-page technical report on solar power plants</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5"><div className="w-3 h-3 border border-current rounded-sm"></div> Budget</div>
                    <div className="text-[11px] text-slate-300">₹2,000 - ₹3,500</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-0.5"><div className="w-3 h-3 border border-current rounded-sm"></div> Timeline</div>
                    <div className="text-[11px] text-slate-300">5 days</div>
                  </div>
                </div>

                <div className="w-full py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg text-center mt-auto">
                  Find More Matches &rarr;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works for clients */}
      <section className="relative z-20 px-10 py-16 max-w-[1400px] mx-auto border-t border-slate-800/50">
        <h2 className="text-[1.35rem] font-bold text-white mb-10 flex items-center gap-4">
          How it works for clients <div className="h-px bg-slate-800 flex-1 ml-4"></div>
        </h2>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between relative">
          
          {/* Step 1 */}
          <div className="flex items-start gap-4 flex-1">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-blue-500 shrink-0 z-10 relative">
                <FileText className="w-6 h-6" />
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white z-20">1</div>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white mb-1">Describe your project</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed">Tell us what you need in simple language. Our AI analyzes the requirements, budget and timeline.</p>
            </div>
          </div>

          <ChevronRight className="hidden md:block w-5 h-5 text-slate-700 shrink-0" />

          {/* Step 2 */}
          <div className="flex items-start gap-4 flex-1">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-cyan-500 shrink-0 z-10 relative">
                <Users className="w-6 h-6" />
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white z-20">2</div>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white mb-1">Compare AI matches</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed">Get a list of the best freelancers ranked by skills, experience and project fit.</p>
            </div>
          </div>

          <ChevronRight className="hidden md:block w-5 h-5 text-slate-700 shrink-0" />

          {/* Step 3 */}
          <div className="flex items-start gap-4 flex-1">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-indigo-500 shrink-0 z-10 relative">
                <ListChecks className="w-6 h-6" />
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white z-20">3</div>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white mb-1">Agree on milestones</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed">Discuss details, finalize the scope and set clear milestones.</p>
            </div>
          </div>

          <ChevronRight className="hidden md:block w-5 h-5 text-slate-700 shrink-0" />

          {/* Step 4 */}
          <div className="flex items-start gap-4 flex-1">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex items-center justify-center text-purple-500 shrink-0 z-10 relative">
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white z-20">4</div>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-white mb-1">Review work & pay</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed">Our AI verifies the deliverables and you release the payment through <span className="font-bold text-white">PayPal</span>.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-20 px-10 py-16 max-w-[1400px] mx-auto border-t border-slate-800/50">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-[1.8rem] font-bold text-white">Everything you need to hire smarter</h2>
          <p className="text-[13px] text-slate-400 max-w-sm text-right hidden md:block">
            Powerful tools to help you find talent, manage projects, and make secure payments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-[#0B1120] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-colors">
            <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-[15px] font-bold text-white mb-3">AI-Powered Talent Matching</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">Find the right freelancers based on skills, experience, budget and your project requirements.</p>
          </div>

          <div className="bg-[#0B1120] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-colors">
            <div className="w-12 h-12 bg-teal-900/30 rounded-xl flex items-center justify-center mb-6 text-teal-400">
              <ListChecks className="w-6 h-6" />
            </div>
            <h3 className="text-[15px] font-bold text-white mb-3">Clear Project Milestones</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">Break your project into milestones and track progress with complete transparency.</p>
          </div>

          <div className="bg-[#0B1120] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-colors">
            <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center mb-6 text-blue-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-[15px] font-bold text-white mb-3">PayPal Secured Payments</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">Make secure payments through PayPal with full transaction tracking and payment confirmation.</p>
          </div>

          <div className="bg-[#0B1120] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-colors">
            <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mb-6 text-purple-400">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-[15px] font-bold text-white mb-3">AI-Assisted Deliverable Review</h3>
            <p className="text-[12px] text-slate-400 leading-relaxed">Our AI checks submitted work against your requirements for quality and completeness.</p>
          </div>

        </div>
      </section>

      {/* Testimonial */}
      <section className="relative z-20 px-10 py-10 max-w-[1400px] mx-auto">
        <div className="bg-[#0B1120] border border-slate-800 rounded-3xl p-8 flex items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex gap-6 items-center">
            <img src="https://i.pravatar.cc/150?u=amit" className="w-20 h-20 rounded-full border-4 border-slate-800" alt="Amit Verma" />
            <div>
              <Quote className="w-6 h-6 text-blue-500 mb-2 opacity-50" />
              <p className="text-[15px] text-slate-300 leading-relaxed max-w-3xl mb-4">
                "PayPilot made it so easy to find a skilled freelancer for my project. The AI matching saved me a lot of time, and the PayPal payment process was smooth and secure. Highly recommend!"
              </p>
              <div>
                <span className="font-bold text-white text-[13px]">Amit Verma</span>
                <span className="text-slate-500 text-[11px] ml-2">Student - Chennai, India</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="flex gap-2 mr-4">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
            </div>
            <button className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </button>
            <button className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-20 px-10 py-10 max-w-[1400px] mx-auto mb-20">
        <div className="bg-gradient-to-r from-blue-900/40 via-blue-800/20 to-transparent border border-blue-800/30 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute bottom-0 left-[20%] w-[30%] h-[100%] bg-blue-600/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-white mb-2">Your next great project starts here.</h2>
            <p className="text-[14px] text-slate-400">Join thousands of clients who are already building with top freelancers on PayPilot.</p>
          </div>

          <Link href="/projects/new" className="relative z-10 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-8 py-4 rounded-xl font-bold text-[15px] flex items-center gap-2 shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all shrink-0">
            Create Your Project <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
