"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings, 
  Bell, ChevronDown, Search, Edit, Phone, Video, MoreVertical, 
  Paperclip, Smile, Mic, Send, FileText, Download, Sparkles, 
  ChevronRight, ArrowRight, CheckCheck, Briefcase, PhoneOff, MicOff,
  X, Check, CornerUpLeft, Pin, Star
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
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
  isDelivered?: boolean;
  isRead?: boolean;
  isPinned?: boolean;
  quotedMessage?: {
    id: string;
    sender: "client" | "freelancer";
    senderName: string;
    text: string;
  };
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
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
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
          time: "10:20 AM",
          isDelivered: true,
          isRead: true
        },
        {
          id: "m2",
          sender: "client",
          text: "Great! Can you also include a dark mode and make it responsive for mobile devices?",
          time: "10:22 AM",
          isDelivered: true,
          isRead: true
        },
        {
          id: "m3",
          sender: "freelancer",
          text: "Sure, I can include both dark mode and full responsiveness. The cost will remain the same (₹3,500) and delivery in 5 days.",
          time: "10:25 AM",
          isDelivered: true,
          isRead: true,
          isPinned: true
        },
        {
          id: "m4",
          sender: "freelancer",
          text: "Here is the milestone outline and design proposal.",
          time: "10:25 AM",
          isDelivered: true,
          isRead: true,
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
          time: "10:28 AM",
          isDelivered: true,
          isRead: true
        },
        {
          id: "m6",
          sender: "freelancer",
          text: "Perfect! I'm ready to get started.",
          time: "10:30 AM",
          isDelivered: true,
          isRead: true
        }
      ]
    },
    {
      id: "t2",
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
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
          time: "Yesterday",
          isDelivered: true,
          isRead: true
        },
        {
          id: "p2",
          sender: "client",
          text: "Thank you Priya! Checking the files now.",
          time: "Yesterday",
          isDelivered: true,
          isRead: true
        }
      ]
    },
    {
      id: "t3",
      name: "Arjun Menon",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
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
          time: "Oct 5",
          isDelivered: true,
          isRead: true
        },
        {
          id: "a2",
          sender: "client",
          text: "Sent! Let me know if you need anything else.",
          time: "Oct 5",
          isDelivered: true,
          isRead: true
        }
      ]
    },
    {
      id: "t4",
      name: "Support Team",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
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
          time: "Oct 2",
          isDelivered: true,
          isRead: true
        }
      ]
    }
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>("t1");
  const [filterTab, setFilterTab] = useState<"all" | "projects" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  
  // WhatsApp Features State
  const [isTyping, setIsTyping] = useState(false);
  const [replyingTo, setReplyingTo] = useState<MessageItem | null>(null);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  // Calling state
  const [callingState, setCallingState] = useState<"none" | "audio" | "video">("none");
  const [callStatus, setCallStatus] = useState<"ringing" | "connected" | "ended">("ringing");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // New Conversation Modal State
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [freelancerList, setFreelancerList] = useState<any[]>([]);
  const [loadingFreelancers, setLoadingFreelancers] = useState(false);

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
      avatar: f.user?.avatar_url || f.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
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
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isDelivered: true,
          isRead: true
        }
      ]
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newId);
    setShowNewChatModal(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread.messages, isTyping]);

  const togglePinMessage = (msgId: string) => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThreadId) return t;
        return {
          ...t,
          messages: t.messages.map((m) =>
            m.id === msgId ? { ...m, isPinned: !m.isPinned } : m
          )
        };
      })
    );
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: "client",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isDelivered: true,
      isRead: false,
      quotedMessage: replyingTo ? {
        id: replyingTo.id,
        sender: replyingTo.sender,
        senderName: replyingTo.sender === "client" ? "You" : activeThread.name,
        text: replyingTo.text
      } : undefined
    };

    setThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, messages: [...t.messages, newMsg] } : t))
    );

    setInputText("");
    setReplyingTo(null);

    // Trigger double-tick read after 600ms
    setTimeout(() => {
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== activeThreadId) return t;
          return {
            ...t,
            messages: t.messages.map((m) =>
              m.id === newMsg.id ? { ...m, isRead: true } : m
            )
          };
        })
      );
    }, 600);

    // Show WhatsApp Typing Indicator after 900ms
    setTimeout(() => {
      setIsTyping(true);
    }, 900);

    // Automated simulated response from freelancer after 2.4 seconds
    setTimeout(() => {
      setIsTyping(false);
      const autoReplyText = 
        activeThread.id === "t4"
          ? "Thank you for contacting PayPilot Support! An agent has recorded your note."
          : `Thanks for the update, Sarah! I've noted that down and will update the deliverable accordingly.`;

      const replyMsg: MessageItem = {
        id: `reply-${Date.now()}`,
        sender: "freelancer",
        text: autoReplyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isDelivered: true,
        isRead: true
      };

      setThreads((prev) =>
        prev.map((t) => (t.id === activeThreadId ? { ...t, messages: [...t.messages, replyMsg] } : t))
      );
    }, 2400);
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
    const freshReplies = [
      "I've verified the milestone scope. Looks ready to proceed!",
      "Could you push the latest commit so I can test locally?",
      "Payment of ₹3,500 has been secured in PayPal escrow."
    ];
    setThreads((prev) =>
      prev.map((t) => (t.id === activeThreadId ? { ...t, suggestedReplies: freshReplies } : t))
    );
  };

  // Filtering threads
  const filteredThreads = threads.filter((t) => {
    if (filterTab === "unread" && !t.unread) return false;
    if (filterTab === "projects" && t.id === "t4") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.projectTitle.toLowerCase().includes(q) ||
        t.messages.some((m) => m.text.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pinnedMessages = activeThread.messages.filter((m) => m.isPinned);

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased overflow-hidden">
      {/* Sidebar */}
      <AppSidebar activePage="messages" />

      {/* Main Messages Container */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-10">
          <div className="relative w-96">
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
            <UserProfileMenu fallbackName="Sarah Johnson" fallbackRole="Client" />
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
                        {thread.avatar ? (
                          <img src={thread.avatar} alt={thread.name} className="w-full h-full object-cover" />
                        ) : (
                          thread.name.split(" ").map((n) => n[0]).join("")
                        )}
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
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center overflow-hidden">
                    {activeThread.avatar ? (
                      <img src={activeThread.avatar} alt={activeThread.name} className="w-full h-full object-cover" />
                    ) : (
                      activeThread.name.split(" ").map((n) => n[0]).join("")
                    )}
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
              
              <div className="flex items-center gap-2">
                {/* Pinned Messages Pill Toggle */}
                {pinnedMessages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      showPinnedOnly
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                    title="View pinned messages"
                  >
                    <Pin className="w-3 h-3 text-amber-600 fill-amber-500" />
                    <span>{pinnedMessages.length} Pinned</span>
                  </button>
                )}

                <button 
                  onClick={() => startCall("audio")}
                  className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-blue-600 transition-colors cursor-pointer"
                  title="Audio Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => startCall("video")}
                  className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-blue-600 transition-colors cursor-pointer"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pinned Messages Drawer if Open */}
            {showPinnedOnly && (
              <div className="p-3 bg-amber-50/70 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2 truncate">
                  <Pin className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                  <span className="font-bold">Pinned: </span>
                  <span className="truncate italic">"{pinnedMessages[0]?.text}"</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPinnedOnly(false)}
                  className="text-amber-700 hover:text-amber-900 font-bold ml-2 shrink-0 cursor-pointer text-[11px]"
                >
                  Close
                </button>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              
              <div className="flex justify-center my-1">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">Today</span>
              </div>

              {activeThread.messages.map((msg) => {
                if (showPinnedOnly && !msg.isPinned) return null;

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
                    className={`flex gap-3 max-w-[80%] group ${isClient ? "self-end flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-auto mb-4 overflow-hidden ${isClient ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                      {isClient ? "SJ" : (
                        activeThread.avatar ? (
                          <img src={activeThread.avatar} alt={activeThread.name} className="w-full h-full object-cover" />
                        ) : activeThread.name.split(" ").map((n) => n[0]).join("")
                      )}
                    </div>

                    <div className={`flex flex-col ${isClient ? "items-end" : "items-start"} relative`}>
                      
                      {/* WhatsApp Hover Actions: Reply & Pin */}
                      <div className={`absolute top-0 -mt-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-sm z-10 ${isClient ? "right-0" : "left-0"}`}>
                        <button
                          type="button"
                          onClick={() => setReplyingTo(msg)}
                          className="p-1 hover:text-blue-600 text-slate-400 cursor-pointer"
                          title="Click to reply (WhatsApp quote)"
                        >
                          <CornerUpLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePinMessage(msg.id)}
                          className={`p-1 cursor-pointer ${msg.isPinned ? "text-amber-500" : "hover:text-amber-500 text-slate-400"}`}
                          title={msg.isPinned ? "Unpin message" : "Pin message"}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Main Bubble */}
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isClient ? "bg-blue-600 text-white rounded-br-none shadow-sm" : "bg-[#F1F5F9] text-slate-700 rounded-bl-none"}`}>
                        
                        {/* Nested Quoted WhatsApp Message */}
                        {msg.quotedMessage && (
                          <div className={`mb-2 p-2 rounded-xl text-xs border-l-4 ${isClient ? "bg-blue-700/60 border-cyan-300 text-blue-50" : "bg-slate-200/70 border-blue-600 text-slate-800"}`}>
                            <span className="font-bold block text-[10px] text-cyan-200">
                              {msg.quotedMessage.senderName}
                            </span>
                            <p className="truncate italic">{msg.quotedMessage.text}</p>
                          </div>
                        )}

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
                            className="text-blue-600 hover:text-blue-700 p-1 rounded-full hover:bg-blue-50 cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Timestamp & Double Blue Ticks */}
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-medium">
                        {msg.isPinned && (
                          <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                            <Pin className="w-2.5 h-2.5 fill-amber-500" /> Pinned
                          </span>
                        )}
                        <span>{msg.time}</span>
                        {isClient && (
                          <span title={msg.isRead ? "Read (Double blue tick)" : "Delivered"}>
                            <CheckCheck className={`w-3.5 h-3.5 ${msg.isRead ? "text-cyan-500 stroke-[2.5]" : "text-slate-400"}`} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* WhatsApp Live Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3 max-w-[80%] items-end animate-in fade-in">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 font-bold text-xs overflow-hidden">
                    {activeThread.avatar ? (
                      <img src={activeThread.avatar} alt={activeThread.name} className="w-full h-full object-cover" />
                    ) : (
                      activeThread.name.split(" ").map((n) => n[0]).join("")
                    )}
                  </div>
                  <div className="bg-[#F1F5F9] text-slate-500 px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-sm">
                    <span className="text-xs font-medium text-slate-600">{activeThread.name.split(" ")[0]} is typing</span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quoted Message Preview Bar before Sending */}
            {replyingTo && (
              <div className="px-6 py-2 bg-blue-50/80 border-t border-blue-200 flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 border-l-4 border-blue-600 pl-2 min-w-0">
                  <CornerUpLeft className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-blue-900 block text-[11px]">
                      Replying to {replyingTo.sender === "client" ? "Yourself" : activeThread.name}
                    </span>
                    <span className="text-slate-600 truncate block">{replyingTo.text}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

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
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
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
                  className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md disabled:opacity-40 cursor-pointer"
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
                  className="w-full bg-white hover:bg-indigo-50 text-indigo-600 font-bold text-xs py-2 rounded-xl border border-indigo-200 transition-colors shadow-sm flex justify-center items-center gap-1.5 cursor-pointer"
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
                    className="w-full bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
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
          <div className="bg-[#0B1120] text-white border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500/40 shadow-xl mx-auto flex items-center justify-center bg-slate-800">
                {activeThread.avatar ? (
                  <img src={activeThread.avatar} alt={activeThread.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold">{activeThread.name[0]}</span>
                )}
              </div>
              {callStatus === "ringing" && (
                <span className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping pointer-events-none opacity-40"></span>
              )}
            </div>

            <h3 className="text-xl font-black text-white">{activeThread.name}</h3>
            <p className="text-xs text-blue-400 font-semibold mt-1">
              {callingState === "video" ? "PayPilot Encrypted Video Call" : "PayPilot Encrypted Audio Call"}
            </p>

            <div className="my-5 py-2 px-4 rounded-xl bg-slate-800/60 inline-block text-xs font-mono font-bold text-slate-300">
              {callStatus === "ringing" ? (
                <span className="animate-pulse text-amber-400">Ringing...</span>
              ) : (
                <span className="text-emerald-400">
                  Connected • {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, "0")}
                </span>
              )}
            </div>

            {callStatus === "ringing" && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={answerCallSimulated}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Simulate Answer
                </button>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3.5 rounded-full transition-all cursor-pointer ${
                  isMuted ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                title={isMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={endCall}
                className="p-4 bg-red-600 hover:bg-red-500 text-white rounded-full transition-all shadow-lg shadow-red-600/30 cursor-pointer"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

              {callingState === "video" && (
                <button
                  type="button"
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  className={`p-3.5 rounded-full transition-all cursor-pointer ${
                    isCameraOff ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                  title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
                >
                  <Video className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Conversation Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowNewChatModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">Start New Conversation</h3>
            <p className="text-xs text-slate-500 mb-4">Select a verified freelancer to chat with.</p>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {loadingFreelancers ? (
                <p className="text-xs text-slate-400 py-4 text-center">Loading freelancers...</p>
              ) : freelancerList.length > 0 ? (
                freelancerList.map((f: any) => (
                  <div
                    key={f.id}
                    onClick={() => handleStartConversationWithFreelancer(f)}
                    className="p-3 rounded-2xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer flex items-center justify-between transition-all"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{f.user?.full_name || f.name || "Freelancer"}</h4>
                      <p className="text-[11px] text-slate-500">{f.title || "Specialist"}</p>
                    </div>
                    <span className="text-xs text-blue-600 font-bold">Chat &rarr;</span>
                  </div>
                ))
              ) : (
                <div 
                  onClick={() => handleStartConversationWithFreelancer({ name: "Rahul Kumar", title: "Full Stack Engineer" })}
                  className="p-3 rounded-2xl border border-slate-100 hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Rahul Kumar</h4>
                    <p className="text-[11px] text-slate-500">Full Stack Engineer & Consultant</p>
                  </div>
                  <span className="text-xs text-blue-600 font-bold">Chat &rarr;</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
