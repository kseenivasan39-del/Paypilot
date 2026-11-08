"use client";

import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, Search, Send, Paperclip, MoreVertical, 
  CheckCheck, Phone, Video, ShieldCheck, Flame, Info,
  Sparkles, Check, CheckCircle2, Clock, UploadCloud,
  FileCode, FileText, ExternalLink, Calendar, X, Bot,
  ChevronRight, ArrowRight, Shield, Download, AlertCircle,
  Mic, MicOff, VideoOff, PhoneCall, PhoneOff, UserCheck
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

interface Message {
  id: number;
  sender: "client" | "freelancer";
  text: string;
  time: string;
  attachment?: {
    type: "code" | "file" | "milestone";
    title: string;
    detail: string;
    url?: string;
  };
}

interface Conversation {
  id: string;
  clientName: string;
  clientRole: string;
  avatar: string;
  isOnline: boolean;
  projectTitle: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  escrowAmount: number;
  escrowId: string;
  status: "ACTIVE" | "VERIFYING" | "DELIVERED";
  milestoneTitle: string;
  milestoneProgress: number;
  dueDate: string;
  criteria: string[];
}

export default function FreelancerMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "C-1",
      clientName: "Sarah Johnson",
      clientRole: "Technical Project Lead",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      isOnline: true,
      projectTitle: "React Dashboard for College Project",
      lastMessage: "The responsive charts and dark mode are looking fantastic! Let's do Milestone 2 verification.",
      time: "10m ago",
      unread: true,
      escrowAmount: 3500,
      escrowId: "PP-ESC-94821",
      status: "ACTIVE",
      milestoneTitle: "Milestone 2: Responsive Charts & Dark Mode",
      milestoneProgress: 75,
      dueDate: "Aug 12, 2026",
      criteria: [
        "Dynamic dark mode theme switch with Tailwind CSS",
        "Recharts responsive container without overflow",
        "85%+ unit test coverage for dashboard widgets"
      ]
    },
    {
      id: "C-2",
      clientName: "FinTech Research Group",
      clientRole: "Quantitative Research Lead",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isOnline: false,
      projectTitle: "10-Page Technical Whitepaper on AI Agents",
      lastMessage: "We received the PDF draft. Running automated compliance audit now.",
      time: "2h ago",
      unread: false,
      escrowAmount: 2000,
      escrowId: "PP-ESC-83712",
      status: "VERIFYING",
      milestoneTitle: "Deliverable 1: 10-Page Whitepaper Draft",
      milestoneProgress: 100,
      dueDate: "Aug 10, 2026",
      criteria: [
        "10 pages formatted in IEEE vector PDF style",
        "KaTeX LaTeX escrow mathematical formula validation",
        "Zero plagiarism compliance with AI verification"
      ]
    },
    {
      id: "C-3",
      clientName: "TechCorp Labs",
      clientRole: "Senior Backend Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      isOnline: true,
      projectTitle: "FastAPI REST Microservice & Postgres Setup",
      lastMessage: "Can we add two more query filters to the transactions endpoint?",
      time: "1d ago",
      unread: false,
      escrowAmount: 5000,
      escrowId: "PP-ESC-67194",
      status: "ACTIVE",
      milestoneTitle: "Milestone 1: Database Models & Schema Migrations",
      milestoneProgress: 30,
      dueDate: "Aug 18, 2026",
      criteria: [
        "FastAPI SQLAlchemy async session management",
        "Alembic auto-generated database migrations",
        "Docker compose container with healthchecks"
      ]
    }
  ]);

  const [activeConvId, setActiveConvId] = useState<string>("C-1");
  const [chatFilter, setChatFilter] = useState<"ALL" | "ACTIVE" | "VERIFYING">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const [messageHistories, setMessageHistories] = useState<Record<string, Message[]>>({
    "C-1": [
      { id: 1, sender: "client", text: "Hey Rahul! Could you send the latest git commit or code snippet for the responsive charts?", time: "10:15 AM" },
      { id: 2, sender: "freelancer", text: "Sure thing Sarah! I just pushed the responsive grid and KaTeX math renderer to main.", time: "10:18 AM" },
      { 
        id: 3, 
        sender: "freelancer", 
        text: "Here is the verified pull request for Milestone 2:", 
        time: "10:20 AM",
        attachment: {
          type: "code",
          title: "PR #14: responsive-charts-and-darkmode",
          detail: "Branch main • 12 commits • +480 / -32 lines • Passes 14 tests",
          url: "https://github.com/paypilot/demo/pull/14"
        }
      },
      { id: 4, sender: "client", text: "The responsive charts and dark mode are looking fantastic! Let's do Milestone 2 verification.", time: "10:22 AM" }
    ],
    "C-2": [
      { id: 101, sender: "client", text: "Hi Rahul, how is the LaTeX whitepaper progress coming along?", time: "Yesterday" },
      { id: 102, sender: "freelancer", text: "Just compiled the final 10-page draft with mathematical escrow formulas. Uploaded here for your review!", time: "2h ago",
        attachment: {
          type: "file",
          title: "Autonomous_Arbitration_Whitepaper_v2.pdf",
          detail: "PDF Document • 4.2 MB • IEEE Standard Layout",
          url: "#"
        }
      },
      { id: 103, sender: "client", text: "We received the PDF draft. Running automated compliance audit now.", time: "2h ago" }
    ],
    "C-3": [
      { id: 201, sender: "client", text: "Can we add two more query filters to the transactions endpoint?", time: "1d ago" },
      { id: 202, sender: "freelancer", text: "Definitely, I can include filters for startDate/endDate and escrowStatus in today's commit.", time: "1d ago" }
    ]
  });

  const [inputText, setInputText] = useState("");
  const [isContractDrawerOpen, setIsContractDrawerOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isScheduleCallOpen, setIsScheduleCallOpen] = useState(false);
  const [isLiveCallActive, setIsLiveCallActive] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Call duration counter
  useEffect(() => {
    let timer: any;
    if (isLiveCallActive) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isLiveCallActive]);

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeMessages = messageHistories[activeConv.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: "freelancer",
      text: text.trim(),
      time: "Just now"
    };

    setMessageHistories((prev) => ({
      ...prev,
      [activeConv.id]: [...(prev[activeConv.id] || []), newMsg]
    }));

    if (!textToSend) setInputText("");
  };

  const handleAiDraftResponse = () => {
    setIsAiDrafting(true);
    setTimeout(() => {
      setIsAiDrafting(false);
      setInputText("Thank you! I've confirmed all milestone acceptance criteria. The codebase is tested and ready for automated PayPilot AI verification whenever you're ready.");
      setToastMsg("AI drafted a professional client update!");
      setTimeout(() => setToastMsg(null), 3000);
    }, 700);
  };

  const handleQuickPrompt = (promptText: string) => {
    handleSend(promptText);
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesFilter = 
      chatFilter === "ALL" || 
      (chatFilter === "ACTIVE" && c.status === "ACTIVE") ||
      (chatFilter === "VERIFYING" && c.status === "VERIFYING");
    const matchesQuery = 
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans h-screen overflow-hidden text-slate-800">
      <AppSidebar activePage="messages" />

      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wider border border-blue-100">
              Freelancer Portal
            </span>
            <span className="text-sm font-extrabold text-slate-900">Direct Client Messages & Escrow Collab</span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Messaging Layout */}
        <div className="flex-1 flex min-h-0 relative">
          
          {/* Left Chat List Column */}
          <div className="w-[380px] bg-white border-r border-slate-200 flex flex-col shrink-0">
            
            {/* Search Input */}
            <div className="p-4 pb-2 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search clients or projects..."
                  className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 mt-3 pt-1">
                {[
                  { id: "ALL", label: "All" },
                  { id: "ACTIVE", label: "Active Escrow" },
                  { id: "VERIFYING", label: "Verifying" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setChatFilter(t.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      chatFilter === t.id 
                        ? "bg-slate-900 text-white shadow-xs" 
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.map((c) => {
                const isSelected = activeConv.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveConvId(c.id)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors cursor-pointer relative ${
                      isSelected ? "bg-blue-50/70" : "hover:bg-slate-50"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                    )}

                    <div className="relative shrink-0">
                      <img src={c.avatar} alt={c.clientName} className="w-11 h-11 rounded-full object-cover border border-slate-200" />
                      {c.isOnline ? (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" title="Active now" />
                      ) : (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-300 border-2 border-white rounded-full" title="Offline" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{c.clientName}</h4>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">{c.time}</span>
                      </div>
                      <p className="text-[11px] font-semibold text-blue-600 truncate">{c.projectTitle}</p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMessage}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                          ₹{c.escrowAmount.toLocaleString()} Escrow
                        </span>
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                          c.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Active Chat Workspace */}
          <div className="flex-1 flex flex-col bg-slate-50/50 min-w-0">
            
            {/* Chat Top Header with Escrow & Quick Milestone Actions */}
            <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img src={activeConv.avatar} alt={activeConv.clientName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  {activeConv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{activeConv.clientName}</h3>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {activeConv.isOnline ? "Online" : "Away"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate font-medium">{activeConv.projectTitle}</p>
                </div>
              </div>

              {/* Action Buttons in Chat Header */}
              <div className="flex items-center gap-2.5 shrink-0">
                
                {/* Escrow Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Escrow: ₹{activeConv.escrowAmount.toLocaleString()} Locked</span>
                </div>

                {/* Submit Milestone Work Direct Button */}
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Submit Deliverable</span>
                </button>

                {/* Live Call Button (Instant Audio/Video Sync) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLiveCallActive(true);
                    setIsMicMuted(false);
                    setIsVideoMuted(false);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Start Live Call with Client"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Client</span>
                </button>

                {/* Schedule Call */}
                <button
                  type="button"
                  onClick={() => setIsScheduleCallOpen(true)}
                  className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors cursor-pointer"
                  title="Schedule Milestone Sync Call"
                >
                  <Video className="w-4 h-4 text-slate-600" />
                </button>

                {/* View Contract Scope Drawer Toggle */}
                <button
                  type="button"
                  onClick={() => setIsContractDrawerOpen(true)}
                  className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors cursor-pointer"
                  title="View Contract Scope & Criteria"
                >
                  <Info className="w-4 h-4 text-slate-600" />
                </button>

              </div>
            </div>

            {/* Message History Feed */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              
              {/* Encrypted Notice Banner */}
              <div className="flex items-center justify-center my-2">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 bg-white border border-slate-200/80 px-3 py-1 rounded-full shadow-xs">
                  <Shield className="w-3 h-3 text-blue-500" />
                  <span>End-to-end conversation logged with PayPal Smart Contract ID: {activeConv.escrowId}</span>
                </div>
              </div>

              {activeMessages.map((m) => (
                <div 
                  key={m.id}
                  className={`flex ${m.sender === "freelancer" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-lg p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    m.sender === "freelancer"
                      ? "bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-500/20"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-sm"
                  }`}>
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Rich Attachment Snippet */}
                    {m.attachment && (
                      <div className={`p-3 rounded-xl border mt-2 ${
                        m.sender === "freelancer"
                          ? "bg-blue-700/60 border-blue-400/40 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}>
                        <div className="flex items-center justify-between font-bold text-xs mb-1">
                          <span className="flex items-center gap-1.5">
                            {m.attachment.type === "code" ? <FileCode className="w-4 h-4 text-cyan-300" /> : <FileText className="w-4 h-4 text-amber-400" />}
                            {m.attachment.title}
                          </span>
                          {m.attachment.url && (
                            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                          )}
                        </div>
                        <p className={`text-[11px] ${m.sender === "freelancer" ? "text-blue-100" : "text-slate-500"}`}>
                          {m.attachment.detail}
                        </p>
                      </div>
                    )}

                    <span className={`block text-[10px] mt-1 ${
                      m.sender === "freelancer" ? "text-blue-200 text-right" : "text-slate-400"
                    }`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Smart Quick Reply Pills */}
            <div className="px-6 py-2 bg-white/80 border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Prompts:</span>
              
              <button
                type="button"
                onClick={() => handleQuickPrompt("I just pushed the latest commit to main with responsive tests passed!")}
                className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                ⚡ Pushed Latest Commit
              </button>

              <button
                type="button"
                onClick={() => handleQuickPrompt(`Milestone progress update: ${activeConv.milestoneProgress}% completed. Dark mode and components ready!`)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                📊 Share Milestone Status
              </button>

              <button
                type="button"
                onClick={() => handleQuickPrompt("The deliverables are complete and tested. Let's trigger the PayPilot AI automated milestone verification!")}
                className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 transition-colors shrink-0 cursor-pointer"
              >
                🚀 Ready for AI Verification
              </button>

              <button
                type="button"
                onClick={handleAiDraftResponse}
                className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 shrink-0 ml-auto cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>{isAiDrafting ? "Drafting..." : "Ask AI to Draft"}</span>
              </button>
            </div>

            {/* Input Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                title="Attach code snippet or file"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input 
                type="text"
                placeholder="Type your message, milestone update, or share git pull request..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </form>

          </div>

        </div>

        {/* Modal: Submit Milestone Deliverable from Chat */}
        {isSubmitModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                  {activeConv.escrowId}
                </span>
                <span className="text-xs text-slate-400 font-medium">Deliverable Submission</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mb-1">
                Submit Milestone to {activeConv.clientName}
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Milestone: <strong className="text-slate-800">{activeConv.milestoneTitle}</strong> (₹{activeConv.escrowAmount.toLocaleString()} Escrow)
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">GitHub PR or File Link</label>
                  <input
                    type="url"
                    defaultValue="https://github.com/paypilot/demo/pull/14"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Submission Notes</label>
                  <textarea
                    rows={3}
                    defaultValue="Implemented responsive components with dark mode toggles and full unit test coverage as agreed in milestone criteria."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Instant AI Verification Ready</strong>
                    Submitting will deliver this work to the chat feed and automatically run PayPilot AI criteria evaluation.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSend("🚀 I have submitted the deliverable for " + activeConv.milestoneTitle + ". Check out the verified pull request: https://github.com/paypilot/demo/pull/14");
                      setIsSubmitModalOpen(false);
                      setToastMsg("Milestone deliverable submitted to client!");
                      setTimeout(() => setToastMsg(null), 3500);
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Post Deliverable
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Schedule Sync Call */}
        {isScheduleCallOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
              <button
                type="button"
                onClick={() => setIsScheduleCallOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Video className="w-5 h-5" />
              </div>

              <h2 className="text-lg font-black text-slate-900 mb-1">
                Schedule Milestone Sync
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Invite {activeConv.clientName} to a quick 15-min walkthrough call.
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
                  <div className="font-bold text-slate-800">Suggested Time Slot:</div>
                  <div className="text-slate-600">Tomorrow at 11:30 AM IST (15 mins)</div>
                  <div className="text-[11px] text-blue-600 font-mono">Google Meet Link will be auto-generated</div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsScheduleCallOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleSend("📅 I've proposed a quick 15-minute sync for tomorrow at 11:30 AM IST to review the Milestone 2 demo. Here is our Google Meet room: https://meet.google.com/xyz-demo-sync");
                      setIsScheduleCallOpen(false);
                      setToastMsg("Calendar invitation sent in chat!");
                      setTimeout(() => setToastMsg(null), 3500);
                    }}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" /> Send Call Invitation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Side Drawer: Contract Scope & Criteria */}
        {isContractDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 p-6 flex flex-col justify-between animate-in slide-in-from-right duration-200">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {activeConv.escrowId}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">Contract Scope</h3>
                  </div>
                  <button
                    onClick={() => setIsContractDrawerOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Milestone</p>
                    <p className="text-sm font-bold text-slate-900">{activeConv.milestoneTitle}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-500">Milestone Due:</span>
                      <strong className="text-slate-800">{activeConv.dueDate}</strong>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-slate-500">Secured Escrow:</span>
                      <strong className="text-emerald-700 font-black">₹{activeConv.escrowAmount.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Milestone Acceptance Criteria
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {activeConv.criteria.map((cr, idx) => (
                        <li key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
                          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{cr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-slate-700 flex items-start gap-2.5">
                    <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-blue-900 block font-bold">PayPal Smart Escrow Locked</strong>
                      Client deposit is fully authorized and held by PayPal. Funds will release to your wallet immediately when acceptance criteria are met.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsContractDrawerOpen(false)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Audio / Video Call Overlay */}
        {isLiveCallActive && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
              
              {/* Call Status Badge */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Encrypted Live Call • {formatCallTime(callDuration)}</span>
              </div>

              {/* Avatar & Pulse Ring */}
              <div className="relative mb-5">
                <div className="w-28 h-28 rounded-full border-4 border-blue-500/40 p-1 flex items-center justify-center animate-pulse">
                  <img
                    src={activeConv.avatar}
                    alt={activeConv.clientName}
                    className="w-full h-full rounded-full object-cover shadow-xl"
                  />
                </div>
                <span className="absolute bottom-1 right-2 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  ✓
                </span>
              </div>

              <h3 className="text-xl font-black text-white">{activeConv.clientName}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">{activeConv.clientRole}</p>
              <p className="text-xs text-blue-400 font-semibold mt-0.5">{activeConv.projectTitle}</p>

              {/* Real-time escrow assurance during call */}
              <div className="mt-4 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Milestone 2 Escrow: <strong>₹{activeConv.escrowAmount.toLocaleString()} Locked</strong></span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-slate-800 w-full">
                
                {/* Mic toggle */}
                <button
                  type="button"
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    isMicMuted 
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" 
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  }`}
                  title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
                >
                  {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Video camera toggle */}
                <button
                  type="button"
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    isVideoMuted 
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" 
                      : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                  }`}
                  title={isVideoMuted ? "Turn On Camera" : "Turn Off Camera"}
                >
                  {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>

                {/* End Call Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsLiveCallActive(false);
                    handleSend(`📞 Call with ${activeConv.clientName} ended (${formatCallTime(callDuration)}). Milestone action items noted.`);
                    setToastMsg(`Call ended • Duration: ${formatCallTime(callDuration)}`);
                    setTimeout(() => setToastMsg(null), 3500);
                  }}
                  className="px-6 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>End Call</span>
                </button>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
