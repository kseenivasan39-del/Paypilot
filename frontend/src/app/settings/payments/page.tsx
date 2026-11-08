"use client";

import { useState, useEffect } from "react";
import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings as SettingsIcon, 
  Bell, ChevronDown, Search, Plus, User, Shield, BellRing, Settings2,
  MoreVertical, Info, Landmark, Calendar, ShieldCheck, Database, ArrowRight,
  Save, Circle, CheckCircle2, Beaker, ExternalLink, ShieldAlert, X, Loader2
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { settingsApi } from "@/lib/api";

export default function PaymentSettings() {
  const [destination, setDestination] = useState("PayPal (sarah@example.com)");
  const [schedule, setSchedule] = useState("Automatic (Daily)");
  const [currency, setCurrency] = useState("INR (₹)");

  // Notification toggles
  const [notifyMilestoneRelease, setNotifyMilestoneRelease] = useState(true);
  const [notifyPaymentFailure, setNotifyPaymentFailure] = useState(true);
  const [instantDisputeAlerts, setInstantDisputeAlerts] = useState(true);

  // Manage Connection Modal
  const [showManageModal, setShowManageModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToastMessage("Payment preferences and payout configuration saved!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans h-screen overflow-hidden">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-8 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 z-50 animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <AppSidebar activePage="settings" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
        <header className="h-16 bg-white/50 backdrop-blur-sm border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Home className="w-4 h-4 text-slate-400" />
            <span>Home</span>
            <span className="text-slate-300">/</span>
            <Link href="/settings" className="hover:text-slate-700">Settings</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-700 font-bold">Payments</span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu />
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto pb-24">
          
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payment & Payout Settings</h1>
            <p className="text-slate-500 font-medium text-xs mt-1">Configure your PayPal Sandbox account and payout rules.</p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex mb-6 px-2 overflow-hidden text-sm">
            <Link href="/settings" className="flex-1 py-3.5 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <User className="w-4 h-4" /> Profile
            </Link>
            <Link href="/settings/account" className="flex-1 py-3.5 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <SettingsIcon className="w-4 h-4" /> Account
            </Link>
            <Link href="/settings/notifications" className="flex-1 py-3.5 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <Bell className="w-4 h-4" /> Notifications
            </Link>
            <Link href="/settings/security" className="flex-1 py-3.5 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <Shield className="w-4 h-4" /> Security
            </Link>
            <Link href="/settings/payments" className="flex-1 py-3.5 flex items-center justify-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600">
              <CreditCard className="w-4 h-4" /> Payments
            </Link>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              
              {/* Connected Payment Accounts */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Connected Payment Accounts</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Manage connected accounts for escrow milestone transactions.</p>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-xl p-4 flex items-center justify-between hover:border-blue-100 transition-colors mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-slate-900 text-sm">PayPal (Sandbox)</h4>
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">Connected</span>
                      </div>
                      <p className="text-xs font-medium text-slate-500">client@paypilot.demo</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Verified on Sandbox REST API</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowManageModal(true)}
                    className="px-4 py-1.5 border border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Manage
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex gap-2.5">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">Sandbox Environment Active</p>
                    <p className="text-slate-600 mt-0.5">Payments use official PayPal sandbox tokens. Real debit or credit cards are not charged.</p>
                  </div>
                </div>
              </div>

              {/* Payout Preferences */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Landmark className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Payout Preferences</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Configure how completed milestone funds are routed.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Destination</label>
                    <div className="relative">
                      <select 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option>PayPal (sarah@example.com)</option>
                        <option>Direct Bank Transfer (HDFC)</option>
                        <option>Direct UPI Transfer</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Schedule</label>
                    <div className="relative">
                      <select 
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option>Automatic (Daily)</option>
                        <option>Weekly (Every Monday)</option>
                        <option>Manual Release</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Security & Alerts */}
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Payment Notifications & Protection</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Control transaction security alerts.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Notify on milestone release</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Get an email and in-app alert when payment is captured.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifyMilestoneRelease(!notifyMilestoneRelease)}
                      className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${notifyMilestoneRelease ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifyMilestoneRelease ? "right-1" : "left-1"}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Notify on payment failures</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Immediate alert if PayPal card capture is cancelled or declined.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifyPaymentFailure(!notifyPaymentFailure)}
                      className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${notifyPaymentFailure ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${notifyPaymentFailure ? "right-1" : "left-1"}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Instant dispute protection alerts</h4>
                      <p className="text-xs text-slate-500 mt-0.5">High-priority warning if deliverable audits trigger a conflict flag.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setInstantDisputeAlerts(!instantDisputeAlerts)}
                      className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${instantDisputeAlerts ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${instantDisputeAlerts ? "right-1" : "left-1"}`} />
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
          
        </div>
      </main>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-8 z-50">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-600/30 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Payment Settings</span>
            </>
          )}
        </button>
      </div>

      {/* Manage PayPal Sandbox Connection Modal */}
      {showManageModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">PayPal Sandbox Connection</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Official REST API integration parameters</p>
              </div>
              <button onClick={() => setShowManageModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 my-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">API Endpoint:</span>
                  <span className="font-mono text-slate-800 font-bold">api-m.sandbox.paypal.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Client ID:</span>
                  <span className="font-mono text-slate-800">mock_sandbox_client_id</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Webhooks Status:</span>
                  <span className="text-emerald-600 font-bold">Listening & Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Idempotency:</span>
                  <span className="text-blue-600 font-bold">Header Enforced</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-[11px] leading-relaxed">
                Live payments require valid PayPal Production credentials set in the backend environment variables (`PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`).
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setShowManageModal(false)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
