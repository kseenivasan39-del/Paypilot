"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, X, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notificationsApi, authApi } from "@/lib/api";

interface NotificationItem {
  id: number;
  title: string;
  time: string;
  unread: boolean;
  message: string;
  link?: string;
  role?: "client" | "freelancer" | "both";
}

const DEFAULT_FREELANCER_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 101,
    title: "PayPal Milestone Payment Released",
    time: "15 mins ago",
    unread: true,
    message: "₹3,500 milestone release for React Dashboard has been credited to your PayPal Sandbox wallet.",
    link: "/freelancer/earnings",
    role: "freelancer"
  },
  {
    id: 102,
    title: "Milestone Deliverable Accepted",
    time: "2 hours ago",
    unread: true,
    message: "Sarah Johnson approved Milestone 2 deliverables! AI pre-audit score of 99% verified.",
    link: "/freelancer/proposals",
    role: "freelancer"
  },
  {
    id: 103,
    title: "New 98% Match Project Posted",
    time: "Yesterday",
    unread: false,
    message: "FinTech Research Group posted 'Full-Stack E-Commerce Store with Autonomous PayPal Escrow'.",
    link: "/freelancer/find-projects",
    role: "freelancer"
  }
];

const DEFAULT_CLIENT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "Deliverable Ready for Review",
    time: "10 mins ago",
    unread: true,
    message: "Rahul Kumar submitted milestone 2 deliverables for React Dashboard.",
    link: "/projects/verification",
    role: "client"
  },
  {
    id: 2,
    title: "Milestone Payment Processed",
    time: "2 hours ago",
    unread: true,
    message: "PayPal sandbox payment of ₹3,500 successfully captured.",
    link: "/transactions",
    role: "client"
  },
  {
    id: 3,
    title: "AI Verification Passed",
    time: "Yesterday",
    unread: false,
    message: "Solar Power Report passed AI compliance audit (96% match score).",
    link: "/projects/verification",
    role: "client"
  },
];

interface NotificationBellProps {
  className?: string;
  iconClassName?: string;
}

export default function NotificationBell({ className = "", iconClassName = "w-5 h-5" }: NotificationBellProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string>("freelancer");
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_FREELANCER_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect user role from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("paypilot_user");
      if (stored) {
        const user = JSON.parse(stored);
        const role = user?.role?.toLowerCase() || "freelancer";
        setUserRole(role);
        setNotifications(role === "client" ? DEFAULT_CLIENT_NOTIFICATIONS : DEFAULT_FREELANCER_NOTIFICATIONS);
      }
    } catch {
      // Default to freelancer
    }
  }, []);

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

  // Sync real notifications from backend if available
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
              link: item.link || (userRole === "client" ? "/dashboard/client" : "/dashboard/freelancer"),
            }))
          );
        }
      } catch {
        // Keep role-aware fallback
      }
    }
    fetchNotifications();
  }, [userRole]);

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

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer focus:outline-none"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className={iconClassName} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-84 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-100 text-left">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-red-100 text-red-700 text-[10px] font-extrabold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs font-medium">
                No notifications right now
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`pt-2 pb-2 px-2 rounded-xl text-left transition-colors cursor-pointer ${
                    n.unread ? "bg-blue-50/60 hover:bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
                      <span className="truncate">{n.title}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-2">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">{n.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
            <span className="text-slate-400 font-medium">
              {userRole === "freelancer" ? "Freelancer Escrow Alerts" : "Client Escrow Alerts"}
            </span>
            <Link
              href={userRole === "freelancer" ? "/freelancer/proposals" : "/transactions"}
              onClick={() => setIsOpen(false)}
              className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View Activity <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
