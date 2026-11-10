"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminSettingsNav from "@/components/AdminSettingsNav";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { 
  Settings, Bell, Globe, Shield, Lock, 
  CheckCircle2, Sliders, Save, Database, Cpu
} from "lucide-react";

export default function AdminSettingsPage() {
  const [autoReleaseEnabled, setAutoReleaseEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [webhookStrictValidation, setWebhookStrictValidation] = useState(true);
  const [defaultCurrency, setDefaultCurrency] = useState("INR");
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(85);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setActionSuccess("Global protocol preferences saved to environment config.");
    setTimeout(() => setActionSuccess(null), 3500);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
      <AdminSidebar activeTab="settings" />

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
                Governance Preferences
              </span>
              <span className="text-xs font-semibold text-slate-500">System Parameters</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Admin Account & Protocol Preferences</h1>
          </div>
        </header>

        {/* Quick Horizontal Tab Bar for Easy Access */}
        <AdminSettingsNav />

        <div className="p-8 space-y-6 max-w-4xl">
          {actionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Automation & Escrow Rules */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Escrow Automation & AI Release Governance</span>
              </h3>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-900">Autonomous Escrow Release</p>
                  <p className="text-xs text-slate-500">Automatically trigger PayPal payout when Gemini delivers a passing score.</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoReleaseEnabled}
                  onChange={(e) => setAutoReleaseEnabled(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-900">Strict PayPal Webhook Verification</p>
                  <p className="text-xs text-slate-500">Verify CRC32 and SHA256 certificates on all incoming PayPal IPN messages.</p>
                </div>
                <input
                  type="checkbox"
                  checked={webhookStrictValidation}
                  onChange={(e) => setWebhookStrictValidation(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Default AI Quality Threshold</span>
                  <span className="font-black text-blue-600">{aiConfidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="98"
                  value={aiConfidenceThreshold}
                  onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Notification & Currency Settings */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>Operational Notifications & Currency</span>
              </h3>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-900">Priority Dispute Email Alerts</p>
                  <p className="text-xs text-slate-500">Send instant notification when a client opens a formal contract dispute.</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-xs font-bold text-slate-900">Primary Reporting Currency</p>
                  <p className="text-xs text-slate-500">Default base currency displayed across supervisory command views.</p>
                </div>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-1.5 rounded-xl"
                >
                  <option value="INR">Indian Rupee (INR - ₹)</option>
                  <option value="USD">US Dollar (USD - $)</option>
                  <option value="EUR">Euro (EUR - €)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
