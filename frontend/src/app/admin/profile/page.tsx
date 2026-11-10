"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminSettingsNav from "@/components/AdminSettingsNav";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { 
  User, Shield, Mail, Key, CheckCircle2, Lock, 
  Sparkles, Building, Phone, MapPin, Save, AlertCircle, 
  Copy, ExternalLink, ShieldCheck, BadgeCheck
} from "lucide-react";

export default function AdminProfilePage() {
  const [fullName, setFullName] = useState("PayPilot Admin");
  const [email] = useState("admin@paypilot.demo");
  const [title, setTitle] = useState("Protocol Governance & Escrow Arbiter");
  const [phone, setPhone] = useState("+65 6789 0123");
  const [location, setLocation] = useState("Singapore • Headquarters SG-1");
  const [department, setDepartment] = useState("Risk, Escrow & Compliance");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const publicKey = "0xPayPilotGovernanceMasterKeySG1_99fa28bc01d448";

  const handleCopyKey = () => {
    navigator.clipboard.writeText(publicKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess("Administrator identity and governance records updated successfully.");
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

        {/* Quick Horizontal Tab Bar for Easy Access */}
        <AdminSettingsNav />

        <div className="p-8 space-y-6 max-w-5xl">
          {actionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Profile Card Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Gradient Top Banner */}
            <div className="h-28 bg-gradient-to-r from-[#0A1628] via-[#102a4e] to-blue-700 relative">
              <div className="absolute top-4 right-5 flex items-center gap-2">
                <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-cyan-300" /> Root Superuser
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Multisig 2/2 Active
                </span>
              </div>
            </div>

            {/* Profile Avatar & Primary Info */}
            <div className="px-8 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80"
                    alt="Admin Avatar"
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-white"
                  />
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">{fullName}</h2>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{title}</p>
                  <p className="text-xs font-mono text-blue-600 font-bold mt-1">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>{copiedKey ? "Copied Public Key" : "Copy HSM Key"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form & Keyholder Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Edit Profile Form (2 cols) */}
            <form onSubmit={handleSave} className="lg:col-span-2 bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Official Identity & Station</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Administrative credentials attached to immutable audit logs.</p>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  KYB Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Official Governance Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-500 cursor-not-allowed"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Emergency Hotline / Phone
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Operational Station
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[11px] text-slate-400">All updates require active hardware session authentication.</p>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>

            {/* Cryptographic & Protocol Authority Side Card (1 col) */}
            <div className="space-y-5">
              <div className="bg-[#0A1628] text-white p-6 rounded-3xl border border-blue-900/40 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
                    <Key className="w-4 h-4" />
                    <span>HSM Key Status</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Public Key Fingerprint</p>
                    <p className="font-mono text-[11px] text-cyan-300 break-all mt-1 bg-blue-950/60 p-2.5 rounded-xl border border-blue-900/50">
                      {publicKey}
                    </p>
                  </div>

                  <div className="pt-1 space-y-2 text-[11px]">
                    <div className="flex justify-between py-1 border-b border-blue-900/40">
                      <span className="text-slate-400">HSM Partition:</span>
                      <span className="text-slate-200 font-mono font-bold">AWS SG-1 #04</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-blue-900/40">
                      <span className="text-slate-400">Escrow Sign Threshold:</span>
                      <span className="text-emerald-400 font-bold">Tier 1 Dual-Sign</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-blue-900/40">
                      <span className="text-slate-400">Consensus Quorum:</span>
                      <span className="text-slate-200 font-bold">2 of 2 Required</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Dispute Override:</span>
                      <span className="text-cyan-400 font-bold">Authorized Arbiter</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Jump Shortcuts */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2.5">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">Quick Navigation</p>
                <a
                  href="/admin/settings"
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
                >
                  <span>Protocol & AI Preferences</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href="/admin/security"
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
                >
                  <span>Active Terminals & 2FA</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href="/admin/treasury"
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition"
                >
                  <span>Corporate Nodal Banks</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
