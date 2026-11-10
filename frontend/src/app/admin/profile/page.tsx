"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { 
  User, Shield, Mail, Key, CheckCircle2, Lock, 
  ExternalLink, Sparkles, Building, Phone, MapPin, 
  Save, AlertCircle, RefreshCw
} from "lucide-react";

export default function AdminProfilePage() {
  const [fullName, setFullName] = useState("PayPilot Admin");
  const [email, setEmail] = useState("admin@paypilot.demo");
  const [title, setTitle] = useState("Protocol Governance & Escrow Arbiter");
  const [phone, setPhone] = useState("+65 6789 0123");
  const [location, setLocation] = useState("Singapore • Headquarters SG-1");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess("Administrator credentials & profile updated successfully.");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <AdminSidebar activeTab="profile" />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Utility Bar */}
        <div className="px-8 pt-4 pb-2 border-b border-slate-100 flex items-center justify-end gap-3 bg-white">
          <NotificationBell />
          <UserProfileMenu fallbackName="PayPilot Admin" fallbackRole="Admin" />
        </div>

        {/* Header */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-5 flex items-center justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Supervisor Identity
              </span>
              <span className="text-xs font-semibold text-slate-500">Multisig Tier-1 Keyholder</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Administrator Profile Information</h1>
          </div>
        </header>

        <div className="p-8 space-y-6 max-w-4xl">
          {actionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Profile Card Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
                alt="Admin"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 shadow-md"
              />
              <span className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-slate-900">{fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-200">
                  ROOT SUPERUSER
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                  DUAL-SIGN VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-500">{title}</p>
              <p className="text-xs font-mono text-blue-600 font-bold">{email}</p>
            </div>
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
              Official Identity & Governance Role
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Official Governance Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Position / Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Emergency Contact Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Primary Operational Station</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          {/* Keyholder Status Container */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-sans">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Key className="w-4 h-4" />
                <span>Cryptographic Keyholder Status</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE MULTISIG 2/2
              </span>
            </div>

            <div className="space-y-1 text-slate-400 text-[11px]">
              <p>Public Key: <span className="text-white">0xPayPilotGovernanceMasterKeySG1_99fa28bc01</span></p>
              <p>Escrow Dual-Sign Allowance: <span className="text-emerald-400 font-bold">Unlimited (Protocol Consensus)</span></p>
              <p>Hardware Security Module (HSM): <span className="text-white">AWS CloudHSM SG-1 Partition 04</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
