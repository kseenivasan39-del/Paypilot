"use client";

import { useState } from "react";
import { 
  MessageSquare, Search, Send, Paperclip, MoreVertical, 
  CheckCheck, Phone, Video, ShieldCheck, Flame, Info
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

interface Conversation {
  id: string;
  clientName: string;
  avatar: string;
  projectTitle: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  escrowAmount: number;
}

export default function FreelancerMessagesPage() {
  const [conversations] = useState<Conversation[]>([
    {
      id: "C-1",
      clientName: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      projectTitle: "React Dashboard for College Project",
      lastMessage: "The responsive charts and dark mode are looking fantastic! Let's do Milestone 2 verification.",
      time: "10m ago",
      unread: true,
      escrowAmount: 3500
    },
    {
      id: "C-2",
      clientName: "FinTech Research Group",
      avatar: "https://i.pravatar.cc/150?u=fintech",
      projectTitle: "10-Page Technical Whitepaper on AI Agents",
      lastMessage: "We received the PDF draft. Running automated compliance audit now.",
      time: "2h ago",
      unread: false,
      escrowAmount: 2000
    },
    {
      id: "C-3",
      clientName: "TechCorp Labs",
      avatar: "https://i.pravatar.cc/150?u=techcorp",
      projectTitle: "FastAPI REST Microservice & Postgres Setup",
      lastMessage: "Can we add two more query filters to the transactions endpoint?",
      time: "1d ago",
      unread: false,
      escrowAmount: 5000
    }
  ]);

  const [activeConv, setActiveConv] = useState<Conversation>(conversations[0]);
  const [messages, setMessages] = useState([
    { id: 1, sender: "client", text: "Hey Rahul! Could you send the latest git commit or code snippet for the responsive charts?", time: "10:15 AM" },
    { id: 2, sender: "freelancer", text: "Sure thing Sarah! I just pushed the responsive grid and KaTeX math renderer to main.", time: "10:18 AM" },
    { id: 3, sender: "client", text: "The responsive charts and dark mode are looking fantastic! Let's do Milestone 2 verification.", time: "10:22 AM" }
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "freelancer", text: inputText.trim(), time: "Just now" }
    ]);
    setInputText("");
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans h-screen overflow-hidden">
      <AppSidebar activePage="messages" />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase tracking-wider">
              Freelancer Portal
            </span>
            <span className="text-sm font-bold text-slate-800">Direct Client Messages</span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Messaging Layout */}
        <div className="flex-1 flex min-h-0">
          
          {/* Left Chat List */}
          <div className="w-[360px] bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search client chats..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  className={`w-full p-4 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                    activeConv.id === c.id ? "bg-blue-50/70" : "hover:bg-slate-50"
                  }`}
                >
                  <img src={c.avatar} alt={c.clientName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{c.clientName}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{c.time}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-blue-600 truncate">{c.projectTitle}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Active Chat Workspace */}
          <div className="flex-1 flex flex-col bg-slate-50/50">
            
            {/* Chat Header */}
            <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img src={activeConv.avatar} alt={activeConv.clientName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeConv.clientName}</h3>
                  <p className="text-[11px] text-slate-500">{activeConv.projectTitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Escrow: ₹{activeConv.escrowAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Message History */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div 
                  key={m.id}
                  className={`flex ${m.sender === "freelancer" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                    m.sender === "freelancer"
                      ? "bg-blue-600 text-white rounded-br-xs shadow-md shadow-blue-500/20"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-sm"
                  }`}>
                    <p>{m.text}</p>
                    <span className={`block text-[10px] mt-1.5 ${
                      m.sender === "freelancer" ? "text-blue-200 text-right" : "text-slate-400"
                    }`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
              <input 
                type="text"
                placeholder="Type your message, milestone update, or share links..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </form>

          </div>

        </div>

      </main>
    </div>
  );
}
