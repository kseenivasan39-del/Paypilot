"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings, 
  Bell, ChevronDown, Search, Edit, Phone, Video, MoreVertical, 
  Paperclip, Smile, Mic, Send, FileText, Download, Sparkles, 
  ChevronRight, ArrowRight, CheckCheck, Briefcase, PhoneOff, MicOff,
  X, Check
} from "lucide-react";
import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { useRouter } from "next/navigation";
import { profilesApi } from "@/lib/api";

interface MessageItem {
  id: string;
  sender: "client" | "freelancer";
  text: string;
  time: string;
  isCallLog?: boolean;
  callType?: "audio" | "video";
  callDuration?: string;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

interface Thread {
  id: string;
  name: string;
  avatar: string;
  projectTitle: string;
  unread: boolean;
  status: "Online" | "Offline" | "Away";
  budget: string;
  deadline: string;
  client: string;
  freelancer: string;
  summary: string;
  suggestedReplies: string[];
  messages: MessageItem[];
}

export default function Messages() {
  const router = useRouter();

  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "t1",
      name: "Rahul Kumar",
      avatar: "https://i.pravatar.cc/150?u=rahul",
      projectTitle: "React Dashboard for College Project",
      unread: true,
      status: "Online",
      budget: "₹3,500 INR",
      deadline: "Aug 12, 2026",
      client: "Sarah Johnson",
      freelancer: "Rahul Kumar",
      summary: "Rahul has agreed to include dark mode and mobile responsiveness. Budget remains ₹3,500 with 5 days delivery.",
      suggestedReplies: [
        "Sounds good, let's proceed.",
        "Can you share the staging link?",
        "What tech stack will you use?"
      ],
      messages: [
        {
          id: "m1",
          sender: "freelancer",
          text: "Hi Sarah! I've reviewed the project requirements. I can complete the React dashboard within 5 days as discussed.",
          time: "10:20 AM"
        },
        {
          id: "m2",
          sender: "client",
          text: "Great! Can you also include a dark mode and make it responsive for mobile devices?",
          time: "10:22 AM"
        },
        {
          id: "m3",
          sender: "freelancer",
          text: "Sure, I can include both dark mode and full responsiveness. The cost will remain the same (₹3,500) and delivery in 5 days.",
          time: "10:25 AM"
        },
        {
          id: "m4",
          sender: "freelancer",
          text: "Here is the milestone outline and design proposal.",
          time: "10:25 AM",
          attachment: {
            name: "Project_Proposal.pdf",
            size: "248 KB",
            type: "PDF"
          }
        },
        {
          id: "m5",
          sender: "client",
          text: "Looks good! Let's proceed. I'll create the payment through PayPal and share the contract.",
          time: "10:28 AM"
        },
        {
          id: "m6",
          sender: "freelancer",
          text: "Perfect! I'm ready to get started.",
          time: "10:30 AM"
        }
      ]
    },
    {
      id: "t2",
      name: "Priya Sharma",
      avatar: "https://i.pravatar.cc/150?u=priya",
      projectTitle: "Logo Design for Startup",
      unread: false,
      status: "Online",
      budget: "₹1,500 INR",
      deadline: "Aug 5, 2026",
      client: "Sarah Johnson",
      freelancer: "Priya Sharma",
      summary: "Priya submitted final SVG, PNG, and vector deliverables for the startup logo. Awaiting client confirmation.",
      suggestedReplies: [
        "The logo looks fantastic!",
        "Could we get a dark background variant?",
        "Thank you! Payment released."
      ],
      messages: [
        {
          id: "p1",
          sender: "freelancer",
          text: "Hi Sarah! I've uploaded the final SVG and high-resolution export files.",
          time: "Yesterday"
        },
        {
          id: "p2",
          sender: "client",
          text: "Thank you Priya! Checking the files now.",
          time: "Yesterday"
        }
      ]
    },
    {
      id: "t3",
      name: "Arjun Menon",
      avatar: "https://i.pravatar.cc/150?u=arjun",
      projectTitle: "10-Page Solar Power Report",
      unread: false,
      status: "Offline",
      budget: "₹2,000 INR",
      deadline: "Aug 8, 2026",
      client: "Sarah Johnson",
      freelancer: "Arjun Menon",
      summary: "Arjun completed initial draft of the 10-page technical paper. Submitted for AI deliverable compliance check.",
      suggestedReplies: [
        "Please check the citations in Section 3.",
        "The report looks comprehensive.",
        "Can you add an executive summary?"
      ],
      messages: [
        {
          id: "a1",
          sender: "freelancer",
          text: "Can you share the raw solar generation dataset so I can complete the chart models?",
          time: "Oct 5"
        },
        {
          id: "a2",
          sender: "client",
          text: "Sent! Let me know if you need anything else.",
          time: "Oct 5"
        }
      ]
    },
    {
      id: "t4",
      name: "Support Team",
      avatar: "https://i.pravatar.cc/150?u=support",
      projectTitle: "PayPilot Customer Support",
      unread: false,
      status: "Online",
      budget: "N/A",
      deadline: "24/7",
      client: "Sarah Johnson",
      freelancer: "PayPilot Support",
      summary: "Support inquiry regarding PayPal Sandbox testing accounts and milestone dispute resolution workflow.",
      suggestedReplies: [
        "Thank you for clarifying.",
        "How do I link another PayPal account?",
        "Where can I view active webhooks?"
      ],
      messages: [
        {
          id: "s1",
          sender: "freelancer",
          text: "Hello Sarah! Your inquiry regarding milestone payment authorizations on PayPal sandbox has been resolved.",
          time: "Oct 2"
        }
      ]
    }
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>("t1");
  const [filterTab, setFilterTab] = useState<"all" | "projects" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [callingState, setCallingState] = useState<"none" | "audio" | "video">("none");
  const [callStatus, setCallStatus] = useState<"ringing" | "connected" | "ended">("ringing");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // New Conversation Modal State
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [freelancerList, setFreelancerList] = useState<any[]>([]);
  const [loadingFreelancers, setLoadingFreelancers] = useState(false);
  const [freelancerSearch, setFreelancerSearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleOpenNewConversationModal = async () => {
    setShowNewChatModal(true);
    setLoadingFreelancers(true);
    try {
      const data = await profilesApi.list();
      setFreelancerList(Array.isArray(data) ? data : []);
    } catch {
      setFreelancerList([]);
    } finally {
      setLoadingFreelancers(false);
    }
  };

  const handleStartConversationWithFreelancer = (f: any) => {
    const existingThread = threads.find((t) => t.name.toLowerCase() === (f.user?.full_name || f.name || "").toLowerCase());
    if (existingThread) {
      setActiveThreadId(existingThread.id);
      setShowNewChatModal(false);
      return;
    }

    const newId = `t-${Date.now()}`;
    const newThread: Thread = {
      id: newId,
      name: f.user?.full_name || f.name || "Freelancer",
      avatar: f.user?.avatar_url || f.avatar || `https://i.pravatar.cc/150?u=${newId}`,
      projectTitle: f.title || "Custom Consultation",
      unread: false,
      status: "Online",
      budget: f.hourly_rate ? `${f.currency || "₹"}${f.hourly_rate}/hr` : "Negotiable",
      deadline: "Flexible",
      client: "Sarah Johnson",
      freelancer: f.user?.full_name || f.name || "Freelancer",
      summary: `Direct conversation started with ${f.user?.full_name || f.name}. Discuss project scopes and milestones.`,
      suggestedReplies: [
        "Hi! Are you available for a new project?",
        "Could you share your portfolio links?",
        "What are your rates and typical turnaround time?"
      ],
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: "freelancer",
          text: `Hi Sarah! Thanks for reaching out. How can I help with your project today?`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newId);
    setShowNewChatModal(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread.messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: "client",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, messages: [...t.messages, newMsg] } : t))
    );

    setInputText("");

    // Automated simulated response from freelancer after 1.2 seconds
    setTimeout(() => {
      const autoReplyText = 
        activeThread.id === "t4"
          ? "Thank you for contacting PayPilot Support! An agent has recorded your note."
          : `Thanks for the update, Sarah! I've noted that down and will update the deliverable accordingly.`;

      const replyMsg: MessageItem = {
        id: `reply-${Date.now()}`,
        sender: "freelancer",
        text: autoReplyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setThreads((prev) =>
        prev.map((t) => (t.id === activeThreadId ? { ...t, messages: [...t.messages, replyMsg] } : t))
      );
    }, 1200);
  };

  // Timer for active call duration
  useEffect(() => {
    let timer: any = null;
    if (callingState !== "none" && callStatus === "connected") {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callingState, callStatus]);

  const startCall = (type: "audio" | "video") => {
    setCallingState(type);
    setCallStatus("ringing");
    setCallDuration(0);
    setIsMuted(false);
    setIsCameraOff(false);
  };

  const endCall = () => {
    const mins = Math.floor(callDuration / 60);
    const secs = callDuration % 60;
    const durationStr = callStatus === "connected" 
      ? `${mins > 0 ? `${mins}m ` : ""}${secs}s` 
      : "Missed / Cancelled";

    const callMsg: MessageItem = {
      id: `call-${Date.now()}`,
      sender: "client",
      text: callStatus === "connected"
        ? `${callingState === "video" ? "Video call ended" : "Voice call ended"} (${durationStr})`
        : `${callingState === "video" ? "Outgoing video call" : "Outgoing voice call"} — No answer`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isCallLog: true,
      callType: callingState === "video" ? "video" : "audio",
      callDuration: durationStr
    };

    setThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, messages: [...t.messages, callMsg] } : t))
    );

    setCallingState("none");
    setCallStatus("ringing");
    setCallDuration(0);
  };

  const answerCallSimulated = () => {
    setCallStatus("connected");
  };

  const handleGenerateSmartReply = () => {
    const smart = `Thanks ${activeThread.name.split(" ")[0]}, let's move forward with this approach. I will monitor the milestone progress.`;
    setInputText(smart);
  };

  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectTitle.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterTab === "unread") return matchesSearch && t.unread;
    if (filterTab === "projects") return matchesSearch && t.id !== "t4";
    return matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans overflow-hidden h-screen">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#0B1120] text-slate-300 flex flex-col h-screen shrink-0">
        <Link href="/" className="p-6 flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2 flex items-center justify-center">
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
          <Link href="/transactions" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
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
          <Link href="/messages" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-900/20">
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

        {/* Updated CTA */}
        <div className="p-4 mt-auto">
          <div className="bg-[#111827] rounded-2xl p-5 relative overflow-hidden flex items-center gap-4 shadow-xl border border-slate-800">
            <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-blue-500/10 blur-xl rounded-full"></div>
            
            <div className="relative z-10 shrink-0">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-[12px] font-medium text-slate-300 leading-snug relative z-10">
              Let AI handle the work.<br/>
              Let PayPal handle the payment.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="relative w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search conversations, projects or people..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center gap-5">
            <NotificationBell />
            <UserProfileMenu />
          </div>
        </header>

        {/* 3-Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Column 1: Conversations List */}
          <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Messages</h2>
                <button 
                  onClick={handleOpenNewConversationModal}
                  className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                  title="New Conversation"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button 
                  onClick={() => setFilterTab("all")}
                  className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors ${filterTab === "all" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterTab("projects")}
                  className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors ${filterTab === "projects" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Projects
                </button>
                <button 
                  onClick={() => setFilterTab("unread")}
                  className={`flex-1 py-1 text-xs font-semibold rounded-md transition-colors ${filterTab === "unread" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Unread
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {filteredThreads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <div 
                    key={thread.id}
                    onClick={() => {
                      setActiveThreadId(thread.id);
                      setThreads((prev) =>
                        prev.map((t) => (t.id === thread.id ? { ...t, unread: false } : t))
                      );
                    }}
                    className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors relative ${isActive ? "bg-blue-50/40" : ""}`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}
                    <div className="flex gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600">
                        {thread.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h3 className="font-bold text-slate-900 truncate text-sm">{thread.name}</h3>
                          <span className="text-[10px] text-blue-600 font-semibold shrink-0">{lastMsg?.time || "Today"}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium truncate mb-1">{thread.projectTitle}</p>
                        <p className="text-xs text-slate-700 font-medium truncate">{lastMsg?.text || "No messages"}</p>
                      </div>
                      {thread.unread && (
                        <div className="flex items-center h-full pt-6 pr-1">
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Chat Window */}
          <div className="flex-1 flex flex-col bg-white">
            
            {/* Chat Header */}
            <div className="h-[68px] px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                    {activeThread.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  {activeThread.status === "Online" && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">
                    {activeThread.name}
                  </h2>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> {activeThread.status}
                  </div>
                </div>
                <div className="w-px h-6 bg-slate-200 mx-2"></div>
                <span className="text-xs font-semibold text-slate-500 truncate max-w-[280px]">{activeThread.projectTitle}</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => startCall("audio")}
                  className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-blue-600 transition-colors"
                  title="Audio Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => startCall("video")}
                  className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-blue-600 transition-colors"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              
              <div className="flex justify-center my-1">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">Today</span>
              </div>

              {activeThread.messages.map((msg) => {
                // Render call log event banner if message is a call
                if (msg.isCallLog) {
                  return (
                    <div key={msg.id} className="flex justify-center my-2">
                      <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/70 transition-colors border border-slate-200 text-slate-700 px-4 py-2 rounded-2xl text-xs font-semibold shadow-sm">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${msg.callDuration === "Missed / Cancelled" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                          {msg.callType === "video" ? <Video className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                        </div>
                        <span>{msg.text}</span>
                        <span className="text-[10px] text-slate-400 font-normal ml-1">{msg.time}</span>
                      </div>
                    </div>
                  );
                }

                const isClient = msg.sender === "client";
                return (
                  <div 
                    key={msg.id} 
                    className={`flex gap-3 max-w-[80%] ${isClient ? "self-end flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-auto mb-4 ${isClient ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                      {isClient ? "SJ" : activeThread.name.split(" ").map((n) => n[0]).join("")}
                    </div>

                    <div className={`flex flex-col ${isClient ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isClient ? "bg-blue-600 text-white rounded-br-none shadow-sm" : "bg-[#F1F5F9] text-slate-700 rounded-bl-none"}`}>
                        {msg.text}
                      </div>

                      {/* Attachment if present */}
                      {msg.attachment && (
                        <div className="mt-2 bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 w-[260px] shadow-sm hover:border-blue-300 transition-all cursor-pointer">
                          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-red-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{msg.attachment.name}</h4>
                            <p className="text-[10px] font-medium text-slate-500">{msg.attachment.size} • {msg.attachment.type}</p>
                          </div>
                          <button 
                            onClick={() => alert(`Downloading sample deliverable archive: ${msg.attachment?.name}`)}
                            className="text-blue-600 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-medium">
                        <span>{msg.time}</span>
                        {isClient && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-inner"
              >
                <button 
                  type="button"
                  onClick={() => alert("Upload file: Select PDF, ZIP archive or Figma link to share with freelancer.")}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message ${activeThread.name}...`} 
                  className="flex-1 bg-transparent text-sm text-slate-700 outline-none px-2 placeholder:text-slate-400"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </form>
            </div>

          </div>

          {/* Column 3: Context Panel */}
          <div className="w-[340px] bg-[#F8FAFC] border-l border-slate-200 overflow-y-auto shrink-0 p-5 space-y-6">
            
            {/* Project Details */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">Project Details</h3>
                <Link href="/projects/verification" className="text-blue-600 text-xs font-bold hover:underline">
                  View Project
                </Link>
              </div>
              
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs leading-snug">{activeThread.projectTitle}</h4>
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded mt-1 uppercase">
                      In Progress
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Budget</span>
                    <span className="font-bold text-slate-900">{activeThread.budget}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Deadline</span>
                    <span className="font-bold text-slate-900">{activeThread.deadline}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Client</span>
                    <span className="font-bold text-slate-900">{activeThread.client}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Freelancer</span>
                    <span className="font-bold text-slate-900">{activeThread.freelancer}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant Context */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">AI Assistant</h3>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-bold text-indigo-900 text-xs">Conversation Summary</span>
                </div>
                
                <p className="text-xs text-indigo-900/80 leading-relaxed mb-3 font-medium">
                  {activeThread.summary}
                </p>
                
                <button 
                  onClick={handleGenerateSmartReply}
                  className="w-full bg-white hover:bg-indigo-50 text-indigo-600 font-bold text-xs py-2 rounded-xl border border-indigo-200 transition-colors shadow-sm flex justify-center items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Suggest Smart Reply
                </button>
              </div>
            </div>

            {/* Suggested Replies */}
            <div>
              <h3 className="font-bold text-slate-900 mb-3 text-sm">Suggested Replies</h3>
              <div className="space-y-2">
                {activeThread.suggestedReplies.map((reply, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSendMessage(reply)}
                    className="w-full bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group"
                  >
                    <span className="text-xs font-medium text-slate-700 group-hover:text-blue-700">{reply}</span>
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Call Modal */}
      {callingState !== "none" && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0F172A] text-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-800 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            
            {/* Pulsing ring animation */}
            <div className="relative mb-5 inline-block">
              <div className={`w-24 h-24 rounded-full bg-blue-600 text-white font-bold text-3xl flex items-center justify-center mx-auto border-4 border-blue-400/30 ${callStatus === "ringing" ? "animate-pulse ring-8 ring-blue-500/20" : ""}`}>
                {activeThread.name.split(" ").map((n) => n[0]).join("")}
              </div>
              {callStatus === "connected" && (
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-[#0F172A] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-white">{activeThread.name}</h3>
            
            {/* Status indicator */}
            <div className="mt-1.5 flex items-center justify-center gap-2">
              {callStatus === "ringing" ? (
                <p className="text-xs text-blue-300 font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                  Ringing... (Simulating other party)
                </p>
              ) : (
                <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Connected • {Math.floor(callDuration / 60)}:{callDuration % 60 < 10 ? `0${callDuration % 60}` : callDuration % 60}
                </p>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-1">
              {callingState === "video" ? "PayPilot End-to-End Encrypted Video Call" : "PayPilot HD Voice Link"}
            </p>

            {/* Answer simulation banner when ringing */}
            {callStatus === "ringing" && (
              <div className="mt-6 bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-slate-300 font-medium">Remote user preview:</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold">Incoming Call</span>
                </div>
                <button
                  type="button"
                  onClick={answerCallSimulated}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/30"
                >
                  <Phone className="w-3.5 h-3.5" /> Accept Call as {activeThread.name.split(" ")[0]}
                </button>
              </div>
            )}

            {/* In-Call Controls */}
            <div className="flex justify-center items-center gap-4 mt-7">
              <button 
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? "bg-red-500 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-200"}`}
                title={isMuted ? "Unmute" : "Mute"}
              >
                <MicOff className="w-5 h-5" />
              </button>

              {callingState === "video" && (
                <button 
                  type="button"
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isCameraOff ? "bg-red-500 text-white" : "bg-slate-800 hover:bg-slate-700 text-slate-200"}`}
                  title={isCameraOff ? "Turn Video On" : "Turn Video Off"}
                >
                  <Video className="w-5 h-5" />
                </button>
              )}

              <button 
                type="button"
                onClick={endCall}
                className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-600/40 transition-colors"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Conversation Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">New Conversation</h3>
                  <p className="text-[11px] text-slate-500">Select a freelancer to start messaging</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewChatModal(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-slate-100 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={freelancerSearch}
                  onChange={(e) => setFreelancerSearch(e.target.value)}
                  placeholder="Search freelancers by name or skill..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Freelancer List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
              {loadingFreelancers ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Loading talent directory...
                </div>
              ) : freelancerList.filter((f) => {
                if (!freelancerSearch.trim()) return true;
                const q = freelancerSearch.toLowerCase();
                const name = (f.user?.full_name || f.name || "").toLowerCase();
                const skills = (f.skills || "").toLowerCase();
                const title = (f.title || "").toLowerCase();
                return name.includes(q) || skills.includes(q) || title.includes(q);
              }).length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No freelancers found matching &ldquo;{freelancerSearch}&rdquo;
                </div>
              ) : (
                freelancerList.filter((f) => {
                  if (!freelancerSearch.trim()) return true;
                  const q = freelancerSearch.toLowerCase();
                  const name = (f.user?.full_name || f.name || "").toLowerCase();
                  const skills = (f.skills || "").toLowerCase();
                  const title = (f.title || "").toLowerCase();
                  return name.includes(q) || skills.includes(q) || title.includes(q);
                }).map((f) => {
                  const name = f.user?.full_name || f.name || "Freelancer";
                  const avatar = f.user?.avatar_url || `https://i.pravatar.cc/150?u=${f.id || f.user_id}`;
                  return (
                    <div
                      key={f.id || f.user_id}
                      onClick={() => handleStartConversationWithFreelancer(f)}
                      className="p-3 flex items-center justify-between hover:bg-blue-50/60 rounded-xl cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={avatar} 
                          alt={name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs group-hover:text-blue-600 transition-colors">
                            {name}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                            {f.title || "Specialist"}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-amber-500 font-bold">
                              ★ {f.rating || 4.9}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {f.completed_projects_count || 12} jobs done
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900 block">
                          {f.hourly_rate ? `${f.currency || "₹"}${f.hourly_rate}/hr` : "Negotiable"}
                        </span>
                        <span className="text-[10px] font-bold text-blue-600 group-hover:underline">
                          Chat &rarr;
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Can&apos;t find someone?</span>
              <Link 
                href="/projects/matching" 
                onClick={() => setShowNewChatModal(false)}
                className="text-blue-600 hover:underline font-bold text-xs"
              >
                Browse Full Talent Directory &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
