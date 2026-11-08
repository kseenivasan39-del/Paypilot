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
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "Deliverable Ready for Review",
    time: "10 mins ago",
    unread: true,
    message: "Rahul Kumar submitted milestone 2 deliverables for React Dashboard.",
    link: "/projects/verification",
  },
  {
    id: 2,
    title: "Milestone Payment Processed",
    time: "2 hours ago",
    unread: true,
    message: "PayPal sandbox payment of ₹3,500 successfully captured.",
    link: "/transactions",
  },
  {
    id: 3,
    title: "AI Verification Passed",
    time: "Yesterday",
    unread: false,
    message: "Solar Power Report passed AI compliance audit (96% match score).",
    link: "/projects/verification",
  },
];

interface NotificationBellProps {
  className?: string;
  iconClassName?: string;
}

export default function NotificationBell({ className = "", iconClassName = "w-5 h-5" }: NotificationBellProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
              link: item.link || "/dashboard/client",
            }))
          );
        }
      } catch {
        // Fall back to demo notifications
      }
    }
    fetchNotifications();
  }, []);

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
        className="relative text-slate-500 hover:text-slate-700 transition-colors p-1.5 rounded-full hover:bg-slate-100/70 focus:outline-none"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className={iconClassName} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-1 ring-red-400"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-84 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 text-left animate-in fade-in zoom-in-95 duration-100">
          <div className="flex justify-between items-center mb-3 pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-extrabold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No notifications yet.</p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    item.unread
                      ? "bg-blue-50/80 hover:bg-blue-100/70 border border-blue-100/70"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{item.message}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <Link
              href="/settings/notifications"
              onClick={() => setIsOpen(false)}
              className="font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <span>Notification preferences</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
