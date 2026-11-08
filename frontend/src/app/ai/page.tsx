"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings, 
  Bell, ChevronDown, Search, Plus, Sparkles, FileText, MoreHorizontal,
  Trash2, MessageCircle, ArrowRight, Code, Calendar, 
  Paperclip, Smile, Mic, Send, CheckCheck, ChevronRight, X, Loader2,
  ShieldCheck, AlertCircle, Check
} from "lucide-react";
import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { useRouter } from "next/navigation";
import { aiApi, authApi } from "@/lib/api";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
  freelancers?: any[];
  followUp?: string[];
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  time: string;
  category: "today" | "past";
  messages: ChatMessage[];
}

export default function AIAssistant() {
  const router = useRouter();

  // Active Conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      title: "React Dashboard Project",
      preview: "Find me a React developer for ...",
      time: "10:32 AM",
      category: "today",
      messages: [
        {
          id: "m1",
          sender: "user",
          text: "Find me a React developer for my college project. Budget below ₹4,000 and delivery within 7 days.",
          time: "10:32 AM"
        },
        {
          id: "m2",
          sender: "ai",
          text: "I've analyzed your request and found suitable freelancers. Here are the top matches:",
          time: "10:32 AM",
          freelancers: [
            {
              id: 2,
              name: "Rahul Kumar",
              rating: 4.9,
              reviews: 127,
              skills: ["React", "Next.js", "Tailwind"],
              match: 96,
              rate: "₹3,000",
              days: "6 days",
              avatar: "https://i.pravatar.cc/150?u=rahul"
            },
            {
              id: 3,
              name: "Priya Sharma",
              rating: 4.8,
              reviews: 89,
              skills: ["React", "UI/UX", "Figma"],
              match: 92,
              rate: "₹3,500",
              days: "5 days",
              avatar: "https://i.pravatar.cc/150?u=priya"
            },
            {
              id: 4,
              name: "Arjun Menon",
              rating: 4.7,
              reviews: 64,
              skills: ["React", "Node.js", "MongoDB"],
              match: 88,
              rate: "₹2,800",
              days: "7 days",
              avatar: "https://i.pravatar.cc/150?u=arjun"
            }
          ],
          followUp: [
            "Show more freelancers",
            "Compare their portfolios",
            "Help you create a project with these details",
            "Proceed with hiring and PayPal payment flow"
          ]
        }
      ]
    },
    {
      id: "conv-2",
      title: "Payment Question",
      preview: "How does milestone payment ...",
      time: "09:15 AM",
      category: "today",
      messages: [
        {
          id: "m3",
          sender: "user",
          text: "How does milestone payment work with PayPal sandbox?",
          time: "09:15 AM"
        },
        {
          id: "m4",
          sender: "ai",
          text: "Milestone payments are securely held until you review submitted work. When you approve the deliverable, our server executes PayPal capture to release the milestone funds. You can verify every order ID on the Transactions page.",
          time: "09:15 AM"
        }
      ]
    },
    {
      id: "conv-3",
      title: "Invoice Generation",
      preview: "Create an invoice for project ...",
      time: "08:10 AM",
      category: "today",
      messages: [
        {
          id: "m5",
          sender: "user",
          text: "How can I download a tax invoice for PP-1001?",
          time: "08:10 AM"
        },
        {
          id: "m6",
          sender: "ai",
          text: "You can open your Transactions page, select transaction PP-1001, and click 'Download PDF Receipt'. It includes the PayPal capture reference, GST/tax calculation, and project scope summary.",
          time: "08:10 AM"
        }
      ]
    }
  ]);

  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchConvQuery, setSearchConvQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string; mode: "chat" | "conversation" } | null>(null);
  const [currentContext, setCurrentContext] = useState({
    projectType: "Web Development",
    budget: "Below ₹4,000",
    timeline: "7 days",
    skills: ["React", "Next.js", "Tailwind"],
    description: "React developer for college dashboard project..."
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConvId) || conversations[0];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    // Update conversation state with user message
    setConversations((prev) =>
      prev.map((c) => (c.id === activeConvId ? { ...c, messages: [...c.messages, userMsg] } : c))
    );

    setInputText("");
    setLoading(true);

    try {
      const historyPayload = activeConversation.messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await aiApi.chat(text, historyPayload);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: res.response || "I've processed your query.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        freelancers: res.freelancers || undefined
      };

      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, messages: [...c.messages, aiMsg] } : c))
      );

      // Context updates if relevant
      if (text.toLowerCase().includes("budget") || text.toLowerCase().includes("react")) {
        setCurrentContext((prev) => ({
          ...prev,
          description: text.slice(0, 50) + "..."
        }));
      }
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: "I've processed your inquiry against our platform guidelines. PayPal Sandbox milestone payments and verified talent rankings are available. Let me know if you would like me to match specific freelancers or assist with contract creation.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, messages: [...c.messages, fallbackMsg] } : c))
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: "New Conversation",
      preview: "Start chatting with PayPilot AI...",
      time: "Just now",
      category: "today",
      messages: [
        {
          id: `welcome-${Date.now()}`,
          sender: "ai",
          text: "Hello! I am PayPilot AI. How can I assist you today with project scoping, talent matching, or PayPal milestone payments?",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newId);
  };

  const handleClearChat = () => {
    setDeleteTarget({
      id: activeConvId,
      title: activeConversation.title,
      mode: "chat"
    });
  };

  const handleDeleteConversation = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    setDeleteTarget({
      id: conv.id,
      title: conv.title,
      mode: "conversation"
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.mode === "chat") {
      setConversations((prev) =>
        prev.map((c) => (c.id === deleteTarget.id ? { ...c, messages: [], preview: "Chat cleared" } : c))
      );
    } else {
      setConversations((prev) => {
        const remaining = prev.filter((c) => c.id !== deleteTarget.id);
        if (remaining.length === 0) {
          const freshId = `conv-${Date.now()}`;
          setActiveConvId(freshId);
          return [
            {
              id: freshId,
              title: "New Conversation",
              preview: "Start chatting with PayPilot AI...",
              time: "Just now",
              category: "today",
              messages: [
                {
                  id: `welcome-${Date.now()}`,
                  sender: "ai",
                  text: "Hello! I am PayPilot AI. How can I assist you today?",
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
              ]
            }
          ];
        }
        if (activeConvId === deleteTarget.id) {
          setActiveConvId(remaining[0].id);
        }
        return remaining;
      });
    }

    setDeleteTarget(null);
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchConvQuery.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchConvQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans h-screen overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-[280px] bg-[#0B1120] text-slate-300 flex flex-col h-screen shrink-0">
        <Link href="/" className="p-6 flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity">
          <div className="bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">PayPilot</span>
        </Link>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <Link href="/dashboard/client" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Home className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/projects/new" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <Plus className="w-5 h-5" />
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
          <Link href="/messages" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Messages</span>
          </Link>
          <Link href="/ai" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-900/20">
            <Bot className="w-5 h-5" />
            <span className="font-medium">AI Assistant</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 hover:text-white rounded-xl transition-colors mt-4">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        {/* Sidebar CTA */}
        <div className="p-4 mt-auto">
          <div className="bg-[#111827] rounded-2xl p-5 relative overflow-hidden flex flex-col gap-4 shadow-xl border border-slate-800">
            <div className="absolute top-[-30px] right-[-30px] w-24 h-24 bg-blue-500/10 blur-xl rounded-full"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <p className="text-[12px] font-medium text-slate-300 leading-snug">
                Let AI handle the work.<br/>
                Let PayPal handle the payment.
              </p>
            </div>

            <Link href="/projects/new" className="w-full py-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 rounded-xl text-[13px] font-semibold transition-colors flex items-center justify-center gap-1 relative z-10">
              New Project &rarr;
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="relative w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search conversations or prompt suggestions..." 
              value={searchConvQuery}
              onChange={(e) => setSearchConvQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center gap-5">
            <NotificationBell />
            <UserProfileMenu />
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          
          {/* Advisory banner */}
          <div className="mb-4 bg-blue-50/80 border border-blue-100 rounded-xl px-4 py-2 flex items-center justify-between text-xs text-blue-900 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>AI recommendations and deliverable verification scores are strictly advisory. Contractual actions require user authorization.</span>
            </div>
            <span className="text-[11px] font-bold text-blue-600 uppercase">PayPal Sandbox Connected</span>
          </div>

          {/* Page Title & Action Buttons */}
          <div className="flex justify-between items-end mb-4 shrink-0">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">PayPilot AI Assistant</h1>
              <p className="text-slate-500 font-medium mt-0.5 text-xs">Your intelligent copilot for project requirements, freelancer matching, and PayPal milestone payments.</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleSendMessage("Analyze my project requirements and give me a recommended budget and deliverable list.")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Analyze Project
              </button>
              <button 
                onClick={() => handleSendMessage("Find me the top rated React and Python developers for our project.")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-blue-500" /> Find Freelancers
              </button>
              <button 
                onClick={() => handleSendMessage("How do milestone payments and PayPal sandbox escrow work?")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-500" /> Payment Help
              </button>
              <button 
                onClick={() => handleSendMessage("How do I generate an official PDF invoice for completed projects?")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" /> Generate Invoice
              </button>
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
            
            {/* Column 1: History Sidebar */}
            <div className="w-[280px] flex flex-col shrink-0 gap-4">
              <button 
                onClick={handleNewChat}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors flex justify-center items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" /> New Chat
              </button>

              <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-1">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-2 mt-1">Conversations</h4>
                {filteredConversations.map((conv) => {
                  const isActive = conv.id === activeConvId;
                  return (
                    <div 
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`group p-3 rounded-xl cursor-pointer transition-colors relative ${isActive ? "bg-blue-50 border border-blue-200" : "hover:bg-slate-50"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 font-bold text-slate-800 text-xs truncate pr-6">
                          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} /> 
                          <span className="truncate">{conv.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium group-hover:hidden">{conv.time}</span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteConversation(e, conv)}
                          className="hidden group-hover:flex items-center justify-center w-5 h-5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors shrink-0"
                          title="Delete conversation"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate ml-5.5">{conv.preview}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Chat Area */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col shadow-sm min-w-0">
              
              {/* Chat Header */}
              <div className="h-[60px] border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">PayPilot AI</h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleClearChat}
                  className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Chat
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeConversation.messages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <MessageSquare className="w-6 h-6 text-slate-400" />
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm mb-1">This chat is empty</h4>
                    <p className="text-xs text-slate-400 max-w-sm mb-4">
                      Messages have been cleared. Type a question below or choose a suggested topic to restart.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center max-w-md">
                      <button
                        onClick={() => handleSendMessage("Find me top freelancers for web development")}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                      >
                        Find Freelancers
                      </button>
                      <button
                        onClick={() => handleSendMessage("How do milestone payments work with PayPal sandbox?")}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-colors"
                      >
                        Milestone Help
                      </button>
                    </div>
                  </div>
                )}
                {activeConversation.messages.map((msg) => {
                  if (msg.sender === "user") {
                    return (
                      <div key={msg.id} className="flex justify-end">
                        <div className="flex gap-3 max-w-[85%] flex-row-reverse">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                            SJ
                          </div>
                          <div>
                            <div className="bg-blue-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-none text-[14px] font-medium leading-relaxed shadow-sm">
                              {msg.text}
                            </div>
                            <div className="flex justify-end items-center gap-1 mt-1">
                              <span className="text-[11px] text-slate-400 font-medium">{msg.time}</span>
                              <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={msg.id} className="flex gap-3 max-w-[88%]">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="w-full">
                        <div className="bg-[#F8FAFC] border border-slate-100 text-slate-700 px-5 py-4 rounded-2xl rounded-tl-none text-[14px] font-medium leading-relaxed shadow-sm">
                          {msg.text}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium mt-1 ml-1 block">{msg.time}</span>
                        
                        {/* Embedded Freelancer Widget if present */}
                        {msg.freelancers && msg.freelancers.length > 0 && (
                          <div className="mt-4 border border-blue-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                            <div className="px-5 py-3 border-b border-blue-50 flex justify-between items-center bg-blue-50/50">
                              <div className="flex items-center gap-2 font-bold text-blue-800 text-xs">
                                <Users className="w-4 h-4 text-blue-600" /> Top Freelancer Matches
                              </div>
                              <Link href="/projects/matching" className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                View Full Directory <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                            
                            <div className="divide-y divide-slate-100">
                              {msg.freelancers.map((f: any) => (
                                <div key={f.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center shrink-0">
                                      {f.name.split(" ").map((n: string) => n[0]).join("")}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-slate-900 text-sm">{f.name}</h4>
                                      <div className="flex items-center gap-1 text-xs font-bold text-orange-400 mt-0.5 mb-1">
                                        ★ {f.rating || 4.9} <span className="text-slate-400 font-medium">({f.reviews || 80} reviews)</span>
                                      </div>
                                      <div className="flex gap-1.5 flex-wrap">
                                        {f.skills?.slice(0, 3).map((s: string) => (
                                          <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">
                                            {s}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right flex flex-col items-end">
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded mb-1">
                                      {f.match || 95}% Match
                                    </span>
                                    <div className="font-bold text-slate-900 text-sm">{f.rate}</div>
                                    <Link 
                                      href="/projects/matching"
                                      className="text-xs font-bold text-blue-600 hover:underline mt-1"
                                    >
                                      Select &rarr;
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Follow up suggestions */}
                        {msg.followUp && (
                          <div className="mt-3 bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs text-slate-600">
                            <span className="font-bold text-slate-800 block mb-1">Suggested Next Actions:</span>
                            <ul className="list-disc pl-4 space-y-0.5">
                              {msg.followUp.map((fu, idx) => (
                                <li key={idx} className="cursor-pointer hover:text-blue-600" onClick={() => handleSendMessage(fu)}>
                                  {fu}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex gap-3 max-w-[80%] items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <Bot className="w-5 h-5 text-blue-600 animate-pulse" />
                    </div>
                    <div className="bg-[#F8FAFC] border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none text-xs text-slate-500 font-medium flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span>PayPilot AI is analyzing and generating response...</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-100">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-sm"
                >
                  <button 
                    type="button"
                    onClick={() => handleSendMessage("Can you analyze my attached project specification document?")}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                    title="Attach file"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask PayPilot AI about projects, skills, freelancers, or PayPal payments..." 
                    className="flex-1 bg-transparent text-sm text-slate-700 outline-none px-2 placeholder:text-slate-400"
                  />
                  <button 
                    type="submit"
                    disabled={!inputText.trim() || loading}
                    className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md disabled:opacity-40"
                  >
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </form>
              </div>

            </div>

            {/* Column 3: Context & Prompts */}
            <div className="w-[320px] flex flex-col shrink-0 gap-5 overflow-y-auto">
              
              {/* Feature Banner */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-900 text-sm">PayPilot AI</h4>
                    <p className="text-[11px] font-medium text-indigo-700">Capabilities</p>
                  </div>
                </div>
                
                <div className="space-y-2 relative z-10">
                  <div 
                    onClick={() => handleSendMessage("Analyze my project requirements and give me a detailed breakdown.")}
                    className="flex justify-between items-center bg-white/70 hover:bg-white p-2.5 rounded-xl transition-colors cursor-pointer border border-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center"><FileText className="w-3.5 h-3.5 text-blue-600" /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Project Analysis</p>
                        <p className="text-[10px] text-slate-500">Extract skills & budget</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  
                  <div 
                    onClick={() => handleSendMessage("Recommend top 3 verified freelancers for my requirements.")}
                    className="flex justify-between items-center bg-white/70 hover:bg-white p-2.5 rounded-xl transition-colors cursor-pointer border border-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center"><Users className="w-3.5 h-3.5 text-emerald-600" /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Find Freelancers</p>
                        <p className="text-[10px] text-slate-500">Skill-based match scores</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>

                  <div 
                    onClick={() => handleSendMessage("Explain how PayPal sandbox milestone releases work.")}
                    className="flex justify-between items-center bg-white/70 hover:bg-white p-2.5 rounded-xl transition-colors cursor-pointer border border-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center"><CreditCard className="w-3.5 h-3.5 text-purple-600" /></div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Payment Guidance</p>
                        <p className="text-[10px] text-slate-500">PayPal escrow & capture</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Current Context */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-slate-900 text-xs">Current Context</h3>
                  <button 
                    onClick={() => setCurrentContext({
                      projectType: "General Software",
                      budget: "Open",
                      timeline: "Flexible",
                      skills: ["Full Stack"],
                      description: "Custom project scoping..."
                    })}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Reset
                  </button>
                </div>
                
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                    <span className="font-medium text-slate-400">Type</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <Code className="w-3.5 h-3.5 text-blue-500" /> {currentContext.projectType}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                    <span className="font-medium text-slate-400">Budget</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <CreditCard className="w-3.5 h-3.5 text-blue-500" /> {currentContext.budget}
                    </div>
                  </div>

                  <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                    <span className="font-medium text-slate-400">Timeline</span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" /> {currentContext.timeline}
                    </div>
                  </div>

                  <div className="grid grid-cols-[80px_1fr] items-start gap-2">
                    <span className="font-medium text-slate-400 mt-0.5">Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {currentContext.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Prompts */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-slate-900 text-xs">Suggested Prompts</h3>
                </div>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => handleSendMessage("Find UI/UX designers for a mobile app with Figma and responsive design skills.")}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group flex justify-between items-center"
                  >
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-700">Find UI/UX designers for a mobile app</span>
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 shrink-0" />
                  </button>
                  <button 
                    onClick={() => handleSendMessage("Help me write a clear, structured project description for an e-commerce platform.")}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group flex justify-between items-center"
                  >
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-700">Help me create a project description</span>
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 shrink-0" />
                  </button>
                  <button 
                    onClick={() => handleSendMessage("Explain milestone payments and security guarantees with PayPal.")}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors group flex justify-between items-center"
                  >
                    <span className="text-xs font-semibold text-slate-600 group-hover:text-blue-700">Explain milestone payments</span>
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 shrink-0" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ChatGPT-style Custom Erase / Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] bg-[#212121] text-white rounded-2xl p-6 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-150 relative"
          >
            {/* Close 'X' button */}
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="absolute right-4 top-4 text-white/50 hover:text-white transition-colors p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-2 pr-6">
              {deleteTarget.mode === "chat" ? "Clear chat?" : "Delete chat?"}
            </h3>

            {/* Message Body */}
            <p className="text-sm text-neutral-300 leading-relaxed mb-6 font-normal">
              {deleteTarget.mode === "chat" ? (
                <>This will erase all messages in <span className="font-semibold text-white">{deleteTarget.title}</span>. This can&apos;t be undone.</>
              ) : (
                <>This will permanently delete <span className="font-semibold text-white">{deleteTarget.title}</span>. This can&apos;t be undone.</>
              )}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:bg-white/10 border border-white/20 transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#E5484D] hover:bg-[#D9383E] text-white transition-colors shadow-sm focus:outline-none"
              >
                {deleteTarget.mode === "chat" ? "Clear chat" : "Delete chat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
