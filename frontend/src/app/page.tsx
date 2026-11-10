import Link from "next/link";
import { ArrowRight, Sparkles, UserPlus, Users, FileText, CheckCircle, ShieldCheck, DollarSign, Star, Briefcase } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column - Text Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-sm text-sm font-medium text-slate-300">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Powered &bull; PayPal Secured</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
            Let AI handle the work.<br/>
            Let <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">PayPal</span> handle the payment.
          </h1>

          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            PayPilot connects clients and freelancers through an AI-powered marketplace that understands projects, finds the right talent, verifies deliverables, and powers secure payments through <span className="text-white font-semibold">PayPal</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/projects/new" className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-lg hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all group">
              Start a Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/freelancers" className="inline-flex justify-center items-center px-8 py-4 rounded-full border border-slate-600 text-white font-semibold text-lg hover:bg-slate-800 transition-colors">
              Explore Freelancers
            </Link>
          </div>
        </div>

        {/* Right Column - Visual/Workflow */}
        <div className="relative mt-12 lg:mt-0 flex justify-end">
          
          {/* Abstract Robot / UI mock (Simplified representation) */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 lg:opacity-100 pointer-events-none">
             <div className="w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[80px]"></div>
          </div>

          {/* Workflow Steps Node Map */}
          <div className="relative z-10 bg-slate-900/40 border border-slate-700/50 backdrop-blur-md p-6 rounded-3xl w-full max-w-md shadow-2xl">
            
            <div className="space-y-6 relative">
              {/* Connecting Line */}
              <div className="absolute left-[28px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-400 to-teal-400 opacity-30"></div>

              {/* Step 1 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50 shrink-0 z-10">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-white text-lg">Describe Project</h3>
                  <p className="text-slate-400 text-sm">Tell us what you need</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-14 h-14 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-900/50 shrink-0 z-10">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-white text-lg">AI Finds Talent</h3>
                  <p className="text-slate-400 text-sm">We analyse & match</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-900/50 shrink-0 z-10">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-white text-lg">Hire & Agree</h3>
                  <p className="text-slate-400 text-sm">Finalize details</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/50 shrink-0 z-10">
                  <span className="font-bold text-2xl text-white italic">P</span>
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-white text-lg">Pay with PayPal</h3>
                  <p className="text-slate-400 text-sm">Secure payment</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-900/50 shrink-0 z-10">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-white text-lg">AI Verifies Work</h3>
                  <p className="text-slate-400 text-sm">Quality & requirements</p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex items-start gap-4 relative">
                <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-900/50 shrink-0 z-10">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-white text-lg">Complete</h3>
                  <p className="text-slate-400 text-sm">Get work done</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Stats Bar */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-3xl p-6 md:p-8 flex flex-wrap lg:flex-nowrap items-center justify-between gap-8 shadow-2xl">
          
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">10K+</div>
              <div className="text-sm font-medium text-slate-500">Freelancers</div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-12 bg-slate-200"></div>

          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">25K+</div>
              <div className="text-sm font-medium text-slate-500">Projects Completed</div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-12 bg-slate-200"></div>

          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">$2M+</div>
              <div className="text-sm font-medium text-slate-500">Payments Processed</div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-12 bg-slate-200"></div>

          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">99%</div>
              <div className="text-sm font-medium text-slate-500">Satisfaction Rate</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
