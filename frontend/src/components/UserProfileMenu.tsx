"use client";

import { useState, useEffect, useRef } from "react";
import { User, Settings, Shield, CreditCard, LogOut, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

interface UserProfileMenuProps {
  className?: string;
  avatarUrl?: string;
  fallbackName?: string;
  fallbackRole?: string;
}

export default function UserProfileMenu({
  className = "",
  avatarUrl,
  fallbackName = "Sarah Johnson",
  fallbackRole = "Client",
}: UserProfileMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>({
    full_name: fallbackName,
    email: "client@paypilot.demo",
    role: fallbackRole,
  });

  // Pick suitable avatar according to role or provided prop
  const resolvedAvatar = avatarUrl || (
    (user.role?.toLowerCase() === "freelancer" || fallbackRole.toLowerCase() === "freelancer")
      ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  );

  // Load user from localStorage if logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem("paypilot_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser((prev: any) => ({
          ...prev,
          ...parsed,
          full_name: parsed.full_name || fallbackName,
          role: parsed.role ? (parsed.role.charAt(0).toUpperCase() + parsed.role.slice(1)) : fallbackRole,
        }));
      }
    } catch {
      // Keep defaults
    }
  }, [fallbackName, fallbackRole]);

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

  const handleSignOut = () => {
    authApi.logout();
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 cursor-pointer pl-4 border-l border-slate-200 hover:opacity-90 transition-opacity focus:outline-none text-left"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          <img
            src={resolvedAvatar}
            alt={user.full_name || "User"}
            className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-sm"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-none">{user.full_name}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">{user.role}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50 rounded-xl mb-1">
            <p className="font-bold text-slate-900 text-sm">{user.full_name}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                {user.role}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified
              </span>
            </div>
          </div>

          <div className="py-1 space-y-0.5">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>Profile Information</span>
            </Link>

            <Link
              href="/settings/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Account Preferences</span>
            </Link>

            <Link
              href="/settings/security"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <Shield className="w-4 h-4 text-slate-400" />
              <span>Security & Sessions</span>
            </Link>

            <Link
              href="/settings/payments"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span>Payment Methods</span>
            </Link>
          </div>

          <div className="pt-1 mt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
