"use client";

import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings as SettingsIcon, 
  Bell, ChevronDown, Search, Plus, User, Shield, BellRing, Settings2,
  Mail, Smartphone, AlertCircle, RefreshCw, FileText, Landmark,
  Flag, CloudUpload, Calendar, BrainCircuit, UserPlus, ShieldCheck,
  TriangleAlert, Moon, Clock, Save, Circle, CheckCircle2, Sparkles
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { useState, useEffect } from "react";
import { settingsApi, authApi } from "@/lib/api";

export default function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [paymentConfirmations, setPaymentConfirmations] = useState(true);
  const [aiVerificationAlerts, setAiVerificationAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchPrefs() {
      try {
        if (typeof window !== "undefined" && !localStorage.getItem("paypilot_token")) {
          const role = typeof window !== "undefined" ? (JSON.parse(localStorage.getItem("paypilot_user") || "{}").role || "freelancer") : "freelancer"; if (role === "freelancer") { await authApi.loginAsDemoFreelancer(); } else { await authApi.loginAsDemoClient(); }
        }
        const prefs = await settingsApi.getNotificationPreferences();
        if (isMounted && prefs) {
          if (prefs.email_notifications !== undefined) setEmailNotifications(prefs.email_notifications);
          if (prefs.project_updates !== undefined) setProjectUpdates(prefs.project_updates);
          if (prefs.payment_confirmations !== undefined) setPaymentConfirmations(prefs.payment_confirmations);
          if (prefs.ai_verification_alerts !== undefined) setAiVerificationAlerts(prefs.ai_verification_alerts);
          if (prefs.marketing_emails !== undefined) setMarketingEmails(prefs.marketing_emails);
        }
      } catch (err) {
        console.warn("Could not load notification preferences", err);
      }
    }
    fetchPrefs();
    return () => { isMounted = false; };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      await settingsApi.updateNotificationPreferences({
        email_notifications: emailNotifications,
        project_updates: projectUpdates,
        payment_confirmations: paymentConfirmations,
        ai_verification_alerts: aiVerificationAlerts,
        marketing_emails: marketingEmails,
      });
      setSavedMsg("Notification preferences saved successfully!");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      console.error(err);
      setSavedMsg("Error saving preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans h-screen overflow-hidden">
      
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
            <span className="text-slate-700 font-bold">Notifications</span>
          </div>

          <div className="relative w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search settings..." 
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-5">
            <NotificationBell />
            <UserProfileMenu />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-[1400px] w-full mx-auto pb-24">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[2rem] font-extrabold text-slate-900 tracking-tight">Notification Settings</h1>
            <p className="text-slate-500 font-medium mt-1">Choose how and when PayPilot keeps you informed.</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex mb-6 px-2 overflow-hidden">
            <Link href="/settings" className="flex-1 py-4 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <User className="w-4 h-4" /> Profile
            </Link>
            <Link href="/settings/account" className="flex-1 py-4 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <Settings2 className="w-4 h-4" /> Account
            </Link>
            <Link href="/settings/notifications" className="flex-1 py-4 flex items-center justify-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600">
              <BellRing className="w-4 h-4" /> Notifications
            </Link>
            <Link href="/settings/security" className="flex-1 py-4 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <Shield className="w-4 h-4" /> Security
            </Link>
            <Link href="/settings/payments" className="flex-1 py-4 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <CreditCard className="w-4 h-4" /> Payments
            </Link>
          </div>

          {savedMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{savedMsg}</span>
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              
              {/* Notification Channels */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Notification Channels</h3>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">Select how you want to receive notifications.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="pt-0.5">
                        <h4 className="font-bold text-slate-900 text-sm">Email Notifications</h4>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">Receive notifications via email.</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`w-11 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-colors ${
                        emailNotifications ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                        emailNotifications ? "right-1" : "left-1"
                      }`}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="pt-0.5">
                        <h4 className="font-bold text-slate-900 text-sm">AI Verification Alerts</h4>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">Alerts when deliverables are audited by AI.</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setAiVerificationAlerts(!aiVerificationAlerts)}
                      className={`w-11 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-colors ${
                        aiVerificationAlerts ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                        aiVerificationAlerts ? "right-1" : "left-1"
                      }`}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Notifications */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Payment Notifications</h3>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">Get notified about all payment-related activities.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="pt-0.5">
                        <h4 className="font-bold text-slate-900 text-sm">Payment confirmations</h4>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">When a payment is successfully completed.</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setPaymentConfirmations(!paymentConfirmations)}
                      className={`w-11 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-colors ${
                        paymentConfirmations ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                        paymentConfirmations ? "right-1" : "left-1"
                      }`}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Project Activity */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Folder className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Project Activity</h3>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">Keep track of milestones and project submissions.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <RefreshCw className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="pt-0.5">
                        <h4 className="font-bold text-slate-900 text-sm">Project status updates</h4>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">When a project status changes.</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setProjectUpdates(!projectUpdates)}
                      className={`w-11 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-colors ${
                        projectUpdates ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                        projectUpdates ? "right-1" : "left-1"
                      }`}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="pt-0.5">
                        <h4 className="font-bold text-slate-900 text-sm">Marketing emails</h4>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">Tips, promotions, and updates.</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setMarketingEmails(!marketingEmails)}
                      className={`w-11 h-6 rounded-full relative cursor-pointer shadow-inner shrink-0 transition-colors ${
                        marketingEmails ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${
                        marketingEmails ? "right-1" : "left-1"
                      }`}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Save Changes</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Persist your updated notification preferences.</p>
                </div>
                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>

            </div>

          </div>
          
        </div>
      </main>
    </div>
  );
}
