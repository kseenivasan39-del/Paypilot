"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Bell, Check, X, Shield, ArrowRight, CheckCircle2, 
  DollarSign, MessageSquare, Sparkles, Clock, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { notificationsApi } from "@/lib/api";

interface NotificationItem {
  id: number;
  title: string;
  time: string;
  unread: boolean;
  message: string;
  category: "ESCROW" | "MILESTONE" | "MESSAGE" | "AI_AUDIT";
  link?: string;
}

const FREELANCER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 101,
    title: "PayPal Escrow Released! 💰",
    time: "5 mins ago",
    unread: true,
    message: "₹3,500 has been captured and credited to your connected PayPal sandbox wallet for Milestone 2.",
    category: "ESCROW",
    link: "/freelancer/earnings",
  },
  {
    id: 102,
    title: "Milestone Accepted by Client",
    time: "25 mins ago",
    unread: true,
    message: "Sarah Johnson approved your responsive dashboard deliverables. Escrow released automatically.",
    category: "MILESTONE",
    link: "/freelancer/proposals",
  },
  {
    id: 103,
    title: "AI Milestone Pre-Audit Passed",
    time: "2 hours ago",
    unread: true,
    message: "Your code snippet scored 99% compliance against contractual criteria with zero secrets exposed.",
    category: "AI_AUDIT",
    link: "/freelancer/ai",
  },
  {
    id: 104,
    title: "New Client Message",
    time: "Yesterday",
    unread: false,
    message: "FinTech Research Group: 'We received the PDF draft. Running automated compliance audit now.'",
    category: "MESSAGE",
    link: "/freelancer/messages",
  },
];

const CLIENT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "Deliverable Ready for Review",
    time: "10 mins ago",
    unread: true,
    message: "Rahul Kumar submitted milestone 2 deliverables for React Dashboard.",
    category: "MILESTONE",
    link: "/projects/verification",
  },
  {
    id: 2,
    title: "Milestone Payment Processed",
    time: "2 hours ago",
    unread: true,
    message: "PayPal sandbox payment of ₹3,500 successfully captured.",
    category: "ESCROW",
    link: "/transactions",
  },
  {
    id: 3,
    title: "AI Verification Passed",
    time: "Yesterday",
    unread: false,
    message: "Solar Power Report passed AI compliance audit (96% match score).",
    category: "AI_AUDIT",
    link: "/projects/verification",
  },
];

interface NotificationBellProps {
  className?: string;
  iconClassName?: string;
  forceRole?: "freelancer" | "client";
}

export default function NotificationBell({ 
  className = "", 
  iconClassName = "w-5 h-5",
  forceRole
}: NotificationBellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Determine active role from pathname or forceRole or localStorage
  const isFreelancer = forceRole === "freelancer" || pathname?.startsWith("/freelancer") || pathname === "/dashboard/freelancer";
  
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    isFreelancer ? FREELANCER_NOTIFICATIONS : CLIENT_NOTIFICATIONS
  );

  // Sync role-specific defaults whenever path changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem("paypilot_user");
      let role = isFreelancer ? "freelancer" : "client";
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.role) role = parsed.role.toLowerCase();
      }
      if (isFreelancer || role === "freelancer") {
        setNotifications(FREELANCER_NOTIFICATIONS);
      } else {
        setNotifications(CLIENT_NOTIFICATIONS);
      }
    } catch {
      setNotifications(isFreelancer ? FREELANCER_NOTIFICATIONS : CLIENT_NOTIFICATIONS);
    }
  }, [pathname, isFreelancer]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Optionally fetch real notifications from backend
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await notificationsApi.list();
        if (Array.isArray(data) && data.length > 0) {
          setNotifications(
            data.map((item: any) => ({
              id: item.id,
              title: item.title || "Notification",
              time: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now",
              unread: !item.is_read,
              message: item.message || "",
              category: "MILESTONE",
              link: item.link || (isFreelancer ? "/freelancer/proposals" : "/dashboard/client"),
            }))
          );
        }
      } catch {
        // Fall back to role-specific defaults
      }
    }
    fetchNotifications();
  }, [isFreelancer]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    try {
      await notificationsApi.markAllRead();
    } catch {
      // Demo fallback
    }
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    setIsOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  const getCategoryBadge = (cat: NotificationItem["category"]) => {
    switch (cat) {
      case "ESCROW":
        return <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0"><DollarSign className="w-3.5 h-3.5" /></span>;
      case "AI_AUDIT":
        return <span className="p-1.5 rounded-lg bg-cyan-50 text-cyan-600 shrink-0"><Sparkles className="w-3.5 h-3.5" /></span>;
      case "MESSAGE":
        return <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 shrink-0"><MessageSquare className="w-3.5 h-3.5" /></span>;
      default:
        return <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0"><CheckCircle2 className="w-3.5 h-3.5" /></span>;
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-slate-100/80 focus:outline-none cursor-pointer"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className={iconClassName} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white animate-in zoom-in-50">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-84 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-4 z-50 text-left animate-in fade-in zoom-in-95 duration-100">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-extrabold rounded-full border border-blue-200">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications Feed */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No notifications yet.</p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                    item.unread
                      ? "bg-blue-50/70 hover:bg-blue-100/60 border border-blue-100"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  {getCategoryBadge(item.category)}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 leading-snug truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Real-time PayPal & AI updates</span>
            <Link
              href="/settings/notifications"
              onClick={() => setIsOpen(false)}
              className="font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Preferences</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
