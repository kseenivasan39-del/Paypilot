"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminSettingsNav from "@/components/AdminSettingsNav";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { 
  ShieldCheck, Key, Lock, Laptop, Smartphone, Globe, 
  Clock, AlertTriangle, CheckCircle2, RefreshCw, LogOut,
  Fingerprint, Sparkles, Terminal
} from "lucide-react";

interface AdminSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function AdminSecurityPage() {
  const [hardwareKeyEnabled, setHardwareKeyEnabled] = useState(true);
  const [requireDualSignForEscrow, setRequireDualSignForEscrow] = useState(true);
  const [ipWhitelistStrict, setIpWhitelistStrict] = useState(true);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState("30");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [sessions, setSessions] = useState<AdminSession[]>([
    {
      id: "sess_01",
      device: "MacBook Pro 16\" (M3 Max)",
      browser: "Chrome 131.0 • macOS Sonoma",
      ip: "127.0.0.1 (Local VPC Gateway)",
      location: "Singapore • SG-1 Gov Hub",
      lastActive: "Active right now",
      isCurrent: true,
    },
    {
      id: "sess_02",
      device: "Admin Emergency Mobile Terminal",
      browser: "Safari Mobile 18 • iOS 18.1",
      ip: "103.252.12.88 (Encrypted APN)",
      location: "Singapore (Roaming)",
      lastActive: "42 minutes ago",
      isCurrent: false,
    },
    {
      id: "sess_03",
      device: "Standby Operations Console",
      browser: "Firefox ESR 128 • Linux Ubuntu 24.04",
      ip: "172.31.44.102 (AWS Private Subnet)",
      location: "AWS ap-southeast-1",
      lastActive: "3 hours ago",
      isCurrent: false,
    },
  ]);

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setActionSuccess("Administrative session revoked immediately across edge nodes.");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleRevokeAllExceptCurrent = () => {
    setSessions((prev) => prev.filter((s) => s.isCurrent));
    setActionSuccess("All remote admin sessions terminated across CloudHSM session cache.");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess("Admin security policies and dual-auth parameters updated.");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <AdminSidebar activeTab="security" />

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
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200">
                Supervisor Hardening
              </span>
              <span className="text-xs font-semibold text-slate-500">CloudHSM & Active Token Authority</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Admin Security & Active Sessions</h1>
          </div>
          <button
            onClick={handleRevokeAllExceptCurrent}
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold text-xs rounded-xl transition-all shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Emergency Purge Other Sessions</span>
          </button>
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

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">WebAuthn / FIDO2</p>
                <p className="text-base font-black text-slate-900 mt-0.5">YubiKey 5C NFC Active</p>
                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Hardware Token Bound
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">HSM Signing Role</p>
                <p className="text-base font-black text-slate-900 mt-0.5">Dual-Key Tier 1</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Partition ID: #HSM-SG-9902</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Terminal className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Leases</p>
                <p className="text-base font-black text-slate-900 mt-0.5">{sessions.length} Authorizations</p>
                <p className="text-[11px] text-purple-600 font-bold mt-0.5">Zero untrusted CIDR blocks</p>
              </div>
            </div>
          </div>

          {/* Active Sessions Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-base">Active Governance Sessions</h2>
                <p className="text-xs text-slate-500 mt-0.5">Authenticated terminals with administrative override & escrow authorization rights.</p>
              </div>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                {sessions.length} Devices
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {sessions.map((sess) => (
                <div key={sess.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sess.isCurrent ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-600"}`}>
                      {sess.device.includes("Mobile") ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full">
                            CURRENT SESSION
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{sess.browser}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                        <span className="flex items-center gap-1 font-mono">
                          <Globe className="w-3.5 h-3.5 text-slate-400" /> {sess.ip}
                        </span>
                        <span>•</span>
                        <span>{sess.location}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {sess.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {sess.isCurrent ? (
                      <span className="text-xs font-bold text-emerald-600 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                        Protected Session
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRevokeSession(sess.id)}
                        className="px-3.5 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
                      >
                        Terminate Session
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Governance Policies */}
          <form onSubmit={handleSaveSecurity} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Cryptographic Policy & Hardware Rules</h2>
              <p className="text-xs text-slate-500 mt-0.5">Configure authentication gates for escrow manual intervention.</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200/70 hover:bg-slate-50/50 cursor-pointer transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900">Enforce Hardware Token (FIDO2 / WebAuthn)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Require physical biometric security key touch for any manual fund disbursement or account freeze.</p>
                </div>
                <input
                  type="checkbox"
                  checked={hardwareKeyEnabled}
                  onChange={(e) => setHardwareKeyEnabled(e.target.checked)}
                  className="w-5 h-5 mt-1 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200/70 hover:bg-slate-50/50 cursor-pointer transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900">Dual-Admin Sign-Off for Transactions &gt; ₹50,000</p>
                  <p className="text-xs text-slate-500 mt-0.5">Transactions exceeding platform risk ceiling require two distinct keyholders to sign before payout transmission.</p>
                </div>
                <input
                  type="checkbox"
                  checked={requireDualSignForEscrow}
                  onChange={(e) => setRequireDualSignForEscrow(e.target.checked)}
                  className="w-5 h-5 mt-1 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-200/70 hover:bg-slate-50/50 cursor-pointer transition-colors">
                <div>
                  <p className="text-sm font-bold text-slate-900">Strict IP & CIDR Whitelisting</p>
                  <p className="text-xs text-slate-500 mt-0.5">Restrict admin API endpoints to corporate VPNs, dedicated egress gateways, and localhost debugging bounds.</p>
                </div>
                <input
                  type="checkbox"
                  checked={ipWhitelistStrict}
                  onChange={(e) => setIpWhitelistStrict(e.target.checked)}
                  className="w-5 h-5 mt-1 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-700">Idle Session Inactivity Expiry</p>
                <p className="text-[11px] text-slate-400">Terminates supervisor token if no heartbeat received.</p>
              </div>
              <select
                value={sessionTimeoutMins}
                onChange={(e) => setSessionTimeoutMins(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes (Recommended)</option>
                <option value="60">1 Hour</option>
                <option value="120">2 Hours</option>
              </select>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition shadow-xs flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Save Security Configuration</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
