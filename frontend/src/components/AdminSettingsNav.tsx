"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Settings, Shield, Landmark } from "lucide-react";

export default function AdminSettingsNav() {
  const pathname = usePathname();

  const tabs = [
    {
      id: "profile",
      label: "Admin Profile",
      description: "Supervisor identity & HSM keys",
      icon: User,
      href: "/admin/profile",
    },
    {
      id: "settings",
      label: "Protocol Preferences",
      description: "AI auto-release & webhooks",
      icon: Settings,
      href: "/admin/settings",
    },
    {
      id: "security",
      label: "Security & Sessions",
      description: "FIDO2 tokens & active terminals",
      icon: Shield,
      href: "/admin/security",
    },
    {
      id: "treasury",
      label: "Treasury & Reserves",
      description: "Corporate banks & fees",
      icon: Landmark,
      href: "/admin/treasury",
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 px-8">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
                isActive
                  ? "bg-blue-50 text-blue-700 border-blue-200/80 shadow-xs"
                  : "bg-transparent text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                isActive ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-500"
              }`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="block leading-tight">{tab.label}</span>
                <span className={`block text-[10px] font-normal leading-tight mt-0.5 ${isActive ? "text-blue-500" : "text-slate-400"}`}>
                  {tab.description}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
