import os

page_content = '''import Link from "next/link";
import { CheckCircle2, Zap, ShieldCheck, Settings, Check, Minus, Building2, User } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#05030f] text-white font-sans overflow-x-hidden relative selection:bg-blue-500/30">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[1200px] overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1e3a8a]/30 blur-[150px] rounded-full"></div>
        <div className="absolute top-[30%] right-[-10%] w-[50%] h-[60%] bg-[#3b0764]/20 blur-[150px] rounded-full"></div>
        {/* Subtle wireframe wave on the left */}
        <div className="absolute top-[10%] left-[-20%] w-[50%] h-[80%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cGF0aCBkPSJNMCAyMDBRMTAwIDEwMCAyMDAgMjAwVDQwMCAyMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSg1OSwgMTMwLCAyNDYsIDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] bg-repeat-y opacity-30"></div>
      </div>

      {/* Navigation */}
      <header className="relative z-20 flex justify-between items-center py-6 px-10 max-w-[1400px] mx-auto">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2 shadow-lg shadow-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">PayPilot</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium text-slate-300">
          <Link href="/how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="/for-clients" className="hover:text-white transition-colors">For Clients</Link>
          <Link href="/for-freelancers" className="hover:text-white transition-colors">For Freelancers</Link>
          <Link href="/pricing" className="text-white border-b-2 border-blue-500 pb-1">Pricing</Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/dashboard/client" className="text-[15px] font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 border border-slate-700/50 rounded-xl">
            Sign In
          </Link>
          <Link href="/projects/new" className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-2 rounded-xl text-[15px] font-bold shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero & Pricing Cards Section */}
      <section className="relative z-20 px-10 py-16 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-12 min-h-[700px]">
        
        {/* Left Content */}
        <div className="flex-[0.8] w-full mt-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-700/50 bg-slate-800/30 text-[11px] font-medium text-slate-400 mb-8">
            <span className="text-blue-400">Simple</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>Transparent</span>
            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
            <span>No Hidden Fees</span>
          </div>

          <h1 className="text-[3.8rem] leading-[1.05] font-extrabold text-white tracking-tight mb-6">
            Fair Pricing<br />
            for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Everyone.</span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed mb-12 max-w-md">
            Whether you are a client or a freelancer, PayPilot keeps pricing simple with transparent fees and secure PayPal payments.
          </p>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#2e1065] border border-purple-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-[13px] text-slate-300 font-medium leading-tight">No<br />subscription fees</div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#064e3b] border border-teal-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
              </div>
              <div className="text-[13px] text-slate-300 font-medium leading-tight">Secure PayPal<br />transactions</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#1e3a8a] border border-blue-500/20 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-[13px] text-slate-300 font-medium leading-tight">Transparent<br />and fair pricing</div>
            </div>
          </div>
        </div>

        {/* Right Content - Pricing Cards */}
        <div className="flex-[1.2] w-full relative">
          
          {/* Annotation */}
          <div className="absolute top-[-30px] left-[-20px] z-30 transform -rotate-12 hidden md:block">
            <div className="font-['Caveat',cursive] text-xl text-blue-300 w-32 leading-tight">
              Choose a plan that works for you
            </div>
            <svg className="w-8 h-8 text-blue-500 opacity-80 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>

          {/* Toggle */}
          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-1 bg-slate-900/50 border border-slate-700/50 rounded-full p-1">
              <button className="px-5 py-1.5 rounded-full bg-blue-600 text-white text-[12px] font-bold">Monthly</button>
              <button className="px-5 py-1.5 rounded-full text-slate-400 text-[12px] font-medium hover:text-white flex items-center gap-2">
                Annual <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 relative z-10">
            
            {/* Free Plan */}
            <div className="bg-[#0B1121]/90 border border-slate-800 rounded-2xl p-6 flex flex-col backdrop-blur-xl">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 mb-4">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Free</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed min-h-[40px]">Get started with essential features at no cost.</p>
              
              <div className="my-6">
                <span className="text-3xl font-extrabold text-white">₹0</span>
                <span className="text-sm text-slate-500"> / month</span>
              </div>

              <div className="space-y-3 flex-1 mb-8">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Create up to 3 projects</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Find and apply to projects</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Basic AI matching</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Secure PayPal payments</span>
                </div>
                <div className="flex items-start gap-2 opacity-40">
                  <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5"><Minus className="w-3 h-3 text-slate-400" /></div>
                  <span className="text-[12px] text-slate-400">Priority support</span>
                </div>
                <div className="flex items-start gap-2 opacity-40">
                  <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5"><Minus className="w-3 h-3 text-slate-400" /></div>
                  <span className="text-[12px] text-slate-400">Advanced analytics</span>
                </div>
                <div className="flex items-start gap-2 opacity-40">
                  <div className="w-4 h-4 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5"><Minus className="w-3 h-3 text-slate-400" /></div>
                  <span className="text-[12px] text-slate-400">Custom profile badge</span>
                </div>
              </div>

              <Link href="/dashboard/client" className="w-full py-2.5 rounded-lg border border-slate-700 text-white text-[13px] font-bold text-center hover:bg-slate-800 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#0B1121] border-2 border-blue-600 rounded-2xl p-6 flex flex-col relative shadow-[0_0_40px_rgba(37,99,235,0.2)] transform md:-translate-y-4">
              <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">Most Popular</div>
              
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white mb-4 shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7 12 22 2 7"/></svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed min-h-[40px]">Unlock more opportunities and advanced features.</p>
              
              <div className="my-6">
                <span className="text-3xl font-extrabold text-white">₹499</span>
                <span className="text-sm text-slate-500"> / month</span>
              </div>

              <div className="space-y-3 flex-1 mb-8">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Unlimited projects</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Advanced AI matching</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Priority in search results</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Detailed analytics</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Custom profile badge</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Priority support</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Early access to new features</span>
                </div>
              </div>

              <Link href="/dashboard/client" className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[13px] font-bold text-center hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                Get Started
              </Link>
            </div>

            {/* Business Plan */}
            <div className="bg-[#0B1121]/90 border border-slate-800 rounded-2xl p-6 flex flex-col backdrop-blur-xl">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Business</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed min-h-[40px]">For agencies and power users with larger needs.</p>
              
              <div className="my-6">
                <span className="text-3xl font-extrabold text-white">₹1,999</span>
                <span className="text-sm text-slate-500"> / month</span>
              </div>

              <div className="space-y-3 flex-1 mb-8">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Everything in Pro</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Team accounts (up to 5 members)</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Advanced project management</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Dedicated account manager</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">API access</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Custom integrations</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-white" /></div>
                  <span className="text-[12px] text-slate-300">Priority support (24/7)</span>
                </div>
              </div>

              <Link href="/dashboard/client" className="w-full py-2.5 rounded-lg border border-slate-700 text-white text-[13px] font-bold text-center hover:bg-slate-800 transition-colors">
                Get Started
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Powered by PayPal Banner */}
      <section className="relative z-20 px-10 py-10 max-w-[1400px] mx-auto">
        <div className="bg-[#0B1120] border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-10">
          
          <div className="flex items-center gap-6 md:w-1/3">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
              <span className="font-bold text-3xl text-[#003087] italic tracking-tighter pr-1">P</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-[16px] mb-1">Powered by PayPal</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">All payments are processed securely through PayPal with full buyer and seller protection.</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0c4a6e]/50 border border-blue-500/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-[12px]">Secure Payments</h4>
                <p className="text-[10px] text-slate-400">Your money is safe with PayPal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#3b0764]/50 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-[12px]">No Hidden Fees</h4>
                <p className="text-[10px] text-slate-400">Transparent and clear pricing</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1e3a8a]/50 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-[12px]">Trusted Platform</h4>
                <p className="text-[10px] text-slate-400">Used by clients and freelancers worldwide</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Compare Plans Table */}
      <section className="relative z-20 px-10 py-16 max-w-[1400px] mx-auto mb-10">
        <h2 className="text-[1.8rem] font-bold text-white mb-2">Compare Plans</h2>
        <p className="text-[13px] text-slate-400 mb-10">See what's included in each plan and find the right one for you.</p>

        <div className="overflow-x-auto">
          <div className="min-w-[800px] bg-[#0B1120] border border-slate-800 rounded-2xl overflow-hidden">
            
            {/* Table Header */}
            <div className="grid grid-cols-4 bg-[#0F172A] border-b border-slate-800">
              <div className="p-4 text-[13px] font-medium text-slate-400">Features</div>
              <div className="p-4 text-[13px] font-bold text-white text-center">Free</div>
              <div className="p-4 text-[13px] font-bold text-blue-400 text-center border-x border-blue-600/30 bg-blue-900/10">Pro</div>
              <div className="p-4 text-[13px] font-bold text-white text-center">Business</div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-4 border-b border-slate-800/50">
              <div className="p-4 text-[13px] text-slate-300">Create Projects</div>
              <div className="p-4 text-[13px] text-slate-400 text-center">Up to 3</div>
              <div className="p-4 text-[13px] text-white text-center border-x border-blue-600/30 bg-blue-900/5">Unlimited</div>
              <div className="p-4 text-[13px] text-slate-400 text-center">Unlimited</div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-4 border-b border-slate-800/50">
              <div className="p-4 text-[13px] text-slate-300">Apply to Projects</div>
              <div className="p-4 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="p-4 flex items-center justify-center border-x border-blue-600/30 bg-blue-900/5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="p-4 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
            </div>
            
            {/* Row 3 */}
            <div className="grid grid-cols-4 border-b border-slate-800/50">
              <div className="p-4 text-[13px] text-slate-300">AI Project Matching</div>
              <div className="p-4 text-[13px] text-slate-400 text-center">Basic</div>
              <div className="p-4 text-[13px] text-white text-center border-x border-blue-600/30 bg-blue-900/5">Advanced</div>
              <div className="p-4 text-[13px] text-slate-400 text-center">Advanced</div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-4 border-b border-slate-800/50">
              <div className="p-4 text-[13px] text-slate-300">PayPal Integration</div>
              <div className="p-4 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="p-4 flex items-center justify-center border-x border-blue-600/30 bg-blue-900/5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="p-4 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-4 border-b border-slate-800/50">
              <div className="p-4 text-[13px] text-slate-300">Priority Support</div>
              <div className="p-4 flex items-center justify-center"><Minus className="w-4 h-4 text-slate-600" /></div>
              <div className="p-4 flex items-center justify-center border-x border-blue-600/30 bg-blue-900/5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
              <div className="p-4 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> (24/7)</div>
            </div>
            
            {/* Row 6 */}
            <div className="grid grid-cols-4">
              <div className="p-4 text-[13px] text-slate-300">Team Accounts</div>
              <div className="p-4 flex items-center justify-center"><Minus className="w-4 h-4 text-slate-600" /></div>
              <div className="p-4 flex items-center justify-center border-x border-blue-600/30 bg-blue-900/5"><Minus className="w-4 h-4 text-slate-600" /></div>
              <div className="p-4 text-[13px] text-slate-400 text-center">Up to 5</div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
'''

os.makedirs('src/app/pricing', exist_ok=True)
with open('src/app/pricing/page.tsx', 'w', encoding='utf-8') as f:
    f.write(page_content)

print("Created src/app/pricing/page.tsx successfully!")
