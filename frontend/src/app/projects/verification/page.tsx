"use client";

import { useState } from "react";
import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings, 
  CheckCircle2, FileCheck, ShieldCheck, Download, ArrowRight, X, AlertTriangle,
  Loader2, Check
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { aiApi } from "@/lib/api";

export default function DeliverableVerification() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"overview" | "analysis" | "freelancer" | "payment" | "verification">("verification");
  
  // Revisions Modal
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [revisionSent, setRevisionSent] = useState(false);

  // Approval Flow
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [releasedSuccess, setReleasedSuccess] = useState(false);

  const handleApproveAndRelease = async () => {
    setReleasing(true);
    // Simulate server-side milestone release / PayPal order capture
    setTimeout(() => {
      setReleasing(false);
      setReleasedSuccess(true);
      setTimeout(() => {
        router.push("/transactions");
      }, 1500);
    }, 1200);
  };

  const handleSendRevision = () => {
    if (!revisionNotes.trim()) return;
    setRevisionSent(true);
    setTimeout(() => {
      setShowRevisionModal(false);
      setRevisionSent(false);
      setRevisionNotes("");
    }, 1500);
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
          <Link href="/transactions" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-900/20">
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
      <main className="flex-1 p-10 max-w-[1200px]">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              React Dashboard for College Project
            </h1>
            <span className="px-3 py-1 bg-[#E0E7FF] text-[#4338CA] text-[13px] font-bold rounded-full">
              In Review
            </span>
          </div>

          <div className="flex border-b border-slate-200">
            <button 
              onClick={() => setActiveTab("overview")} 
              className={`px-6 py-3 font-medium transition-colors ${activeTab === "overview" ? "font-bold text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700"}`}
            >
              Overview
            </button>
            <Link 
              href="/projects/analysis"
              className="px-6 py-3 font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              AI Analysis
            </Link>
            <Link 
              href="/projects/matching"
              className="px-6 py-3 font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Freelancer
            </Link>
            <Link 
              href="/projects/payment"
              className="px-6 py-3 font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Payment
            </Link>
            <button 
              onClick={() => setActiveTab("verification")}
              className={`px-6 py-3 font-bold text-blue-600 border-b-2 border-blue-600`}
            >
              Verification
            </button>
          </div>
        </div>

        {/* Verification Card Wrapper */}
        <div className="relative mt-4">
          
          {/* Floating Top Badge */}
          <div className="absolute -top-5 left-6 bg-[#2B3B6F] text-white px-6 py-2.5 rounded-xl font-medium text-lg shadow-lg z-10 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            AI Deliverable Verification
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-[24px] p-10 pt-14 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100">
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">AI Verification Results</h2>
                <p className="text-slate-500 font-medium text-[15px]">Our AI has analyzed the submitted work against the project requirements.</p>
              </div>
              <button 
                onClick={() => alert("Downloading full deliverable bundle: React_Dashboard_v2.zip (14.2 MB)")}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                <Download className="w-4 h-4" /> Download Submitted Work
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              
              {/* Circular Chart Box */}
              <div className="border border-slate-100 rounded-2xl flex flex-col items-center justify-center py-12 bg-slate-50/50">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="42" 
                      fill="transparent" 
                      stroke="#E2E8F0" 
                      strokeWidth="10" 
                    />
                    <circle 
                      cx="50" cy="50" r="42" 
                      fill="transparent" 
                      stroke="#10B981" 
                      strokeWidth="10" 
                      strokeDasharray="264" 
                      strokeDashoffset="10.56" 
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <FileCheck className="w-8 h-8 text-emerald-500 mb-2" />
                    <span className="text-slate-500 text-sm font-medium">Verification Score</span>
                    <span className="text-4xl font-extrabold text-slate-900 mt-0.5">96%</span>
                  </div>
                </div>
              </div>

              {/* Stats List Box */}
              <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  
                  <div className="flex items-center justify-between border-b border-emerald-100/60 pb-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      <span className="text-slate-700 font-medium text-[15px]">Requirement Match</span>
                    </div>
                    <span className="text-emerald-700 font-bold text-base">96%</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-emerald-100/60 pb-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      <span className="text-slate-700 font-medium text-[15px]">Deliverables Complete</span>
                    </div>
                    <span className="text-emerald-700 font-bold text-base">100%</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-b border-emerald-100/60 pb-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      <span className="text-slate-700 font-medium text-[15px]">Content Quality</span>
                    </div>
                    <span className="text-emerald-700 font-bold text-base">91%</span>
                  </div>

                  <div className="flex items-center justify-between border-b border-emerald-100/60 pb-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      <span className="text-slate-700 font-medium text-[15px]">Technical Accuracy</span>
                    </div>
                    <span className="text-emerald-700 font-bold text-base">94%</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      <span className="text-slate-700 font-medium text-[15px]">Deadline Met</span>
                    </div>
                    <span className="text-emerald-700 font-bold text-base">100%</span>
                  </div>

                </div>
              </div>

            </div>

            {/* Approved Banner */}
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-5 flex items-center justify-between mb-6">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-emerald-700 bg-emerald-100/50 px-4 py-2 rounded-lg font-bold">
                  <ShieldCheck className="w-6 h-6 fill-emerald-600 text-white" /> 
                  APPROVED
                </div>
                <div className="w-px h-8 bg-emerald-200"></div>
                <p className="text-emerald-900 font-medium text-sm">
                  The submission meets all requirements. Payment can be released to the freelancer.
                </p>
              </div>
            </div>

            {/* Summary Box */}
            <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Submitted Work Summary</h3>
              <p className="text-slate-600 font-medium leading-relaxed text-sm">
                The freelancer has submitted the React dashboard application along with complete Tailwind CSS components, dark mode toggle, and responsive layouts. All automated lint tests passed with 0 errors.
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button 
                onClick={() => setShowRevisionModal(true)}
                className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors text-sm"
              >
                Request Revisions
              </button>

              <button 
                onClick={() => setShowApproveModal(true)}
                className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/30 transition-all text-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" /> Approve & Release Payment (₹3,500)
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Request Revisions</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Specify required adjustments for Rahul Kumar.</p>
              </div>
              <button onClick={() => setShowRevisionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {revisionSent ? (
              <div className="p-6 bg-emerald-50 rounded-2xl text-center text-emerald-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-base">Revision Request Sent!</h4>
                <p className="text-xs text-emerald-700 mt-1">Rahul Kumar has been notified via PayPilot Messages.</p>
              </div>
            ) : (
              <div>
                <textarea 
                  rows={4}
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  placeholder="e.g. Please improve color contrast on the sidebar and add sample chart data..."
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setShowRevisionModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSendRevision}
                    disabled={!revisionNotes.trim()}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md disabled:opacity-40"
                  >
                    Send to Freelancer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approve & Release Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center">
            {releasedSuccess ? (
              <div className="py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Payment Released!</h3>
                <p className="text-xs text-slate-500 mt-2">
                  ₹3,500 has been captured and transferred to Rahul Kumar's PayPal Sandbox account.
                </p>
                <p className="text-[11px] text-blue-600 font-semibold mt-4">Redirecting to Transactions...</p>
              </div>
            ) : (
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Confirm Payment Release</h3>
                <p className="text-xs text-slate-500 mt-2 mb-6">
                  You are releasing milestone payment of <strong className="text-slate-900">₹3,500 INR</strong> for <strong>React Dashboard for College Project</strong>. This action is final and executes PayPal sandbox settlement.
                </p>

                <div className="bg-slate-50 rounded-xl p-3 text-left text-xs text-slate-600 mb-6 space-y-1">
                  <div className="flex justify-between"><span>Freelancer:</span> <span className="font-bold text-slate-800">Rahul Kumar</span></div>
                  <div className="flex justify-between"><span>AI Audit Score:</span> <span className="font-bold text-emerald-600">96% Passed</span></div>
                  <div className="flex justify-between"><span>Payment Provider:</span> <span className="font-bold text-slate-800">PayPal REST API</span></div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowApproveModal(false)}
                    disabled={releasing}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleApproveAndRelease}
                    disabled={releasing}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    {releasing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Capturing...</span>
                      </>
                    ) : (
                      <span>Confirm Release</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
