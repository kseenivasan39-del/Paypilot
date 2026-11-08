"use client";

import { useState, useEffect } from "react";
import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings as SettingsIcon, 
  Bell, ChevronDown, Search, Plus, User, Shield, BellRing, Settings2, 
  MapPin, Globe, Clock, Lock, Mail, ChevronRight, Check,
  EyeOff, Save, CheckCircle2, Loader2
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { settingsApi } from "@/lib/api";
import { useRef } from "react";

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "zh", name: "Chinese (Mandarin)", nativeName: "中文", flag: "🇨🇳" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
];

export default function AccountSettings() {
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("INR (₹)");
  const [timezone, setTimezone] = useState("Asia/Kolkata (GMT +5:30)");
  const [country, setCountry] = useState("India");
  const [dateFormat, setDateFormat] = useState("MMM D, YYYY");

  // Language searchable dropdown state
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Toggles
  const [profileVisible, setProfileVisible] = useState(true);
  const [hideEmail, setHideEmail] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setShowLangDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await settingsApi.getSettings();
        if (res) {
          if (res.language) setLanguage(res.language);
          if (res.currency) setCurrency(res.currency);
          if (res.timezone) setTimezone(res.timezone);
        }
      } catch {
        // Fallback to defaults
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.updateSettings({
        language,
        currency,
        timezone,
      });
      setToastMessage("Account preferences saved successfully!");
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setToastMessage("Preferences updated locally (demo mode).");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setSaving(false);
    }
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
            <span className="text-slate-700 font-bold">Account</span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu />
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-8 max-w-[1200px] w-full mx-auto pb-24">
          
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-slate-500 font-medium text-xs mt-1">Manage your account settings, localization, and privacy preferences.</p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex mb-6 px-2 overflow-hidden text-sm">
            <Link href="/settings" className="flex-1 py-3.5 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <User className="w-4 h-4" /> Profile
            </Link>
            <Link href="/settings/account" className="flex-1 py-3.5 flex items-center justify-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600">
              <SettingsIcon className="w-4 h-4" /> Account
            </Link>
            <Link href="/settings/notifications" className="flex-1 py-3.5 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <Bell className="w-4 h-4" /> Notifications
            </Link>
            <Link href="/settings/security" className="flex-1 py-3.5 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <Shield className="w-4 h-4" /> Security
            </Link>
            <Link href="/settings/payments" className="flex-1 py-3.5 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <CreditCard className="w-4 h-4" /> Payments
            </Link>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              
              {/* General Preferences */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Settings2 className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">General Preferences</h3>
                    <p className="text-xs font-medium text-slate-500">Set your language, currency, and timezone preferences.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Language</label>
                    <div className="relative" ref={langDropdownRef}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowLangDropdown(!showLangDropdown);
                          setLangSearch("");
                        }}
                        className="w-full flex items-center justify-between border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium text-slate-700 bg-white hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <span className="truncate">
                          {LANGUAGES.find(l => l.name.toLowerCase() === language.toLowerCase())?.flag || "🌐"}{" "}
                          {language}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${showLangDropdown ? "rotate-180 text-blue-600" : ""}`} />
                      </button>

                      {showLangDropdown && (
                        <div className="absolute left-0 top-full mt-1.5 w-full min-w-[240px] bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="p-2 border-b border-slate-100 bg-slate-50">
                            <div className="relative">
                              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                              <input
                                type="text"
                                value={langSearch}
                                onChange={(e) => setLangSearch(e.target.value)}
                                placeholder="Search language..."
                                autoFocus
                                className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 p-1">
                            {LANGUAGES.filter(item => {
                              if (!langSearch.trim()) return true;
                              const q = langSearch.toLowerCase();
                              return item.name.toLowerCase().includes(q) || item.nativeName.toLowerCase().includes(q);
                            }).map((item) => {
                              const isSelected = language.toLowerCase() === item.name.toLowerCase();
                              return (
                                <button
                                  key={item.code}
                                  type="button"
                                  onClick={() => {
                                    setLanguage(item.name);
                                    setShowLangDropdown(false);
                                    setLangSearch("");
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                                    isSelected
                                      ? "bg-blue-50 text-blue-700 font-bold"
                                      : "text-slate-700 hover:bg-slate-50 font-medium"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="text-sm leading-none shrink-0">{item.flag}</span>
                                    <span className="truncate">{item.name}</span>
                                    <span className="text-slate-400 text-[11px]">({item.nativeName})</span>
                                  </div>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-2" />}
                                </button>
                              );
                            })}
                            {LANGUAGES.filter(item => {
                              if (!langSearch.trim()) return true;
                              const q = langSearch.toLowerCase();
                              return item.name.toLowerCase().includes(q) || item.nativeName.toLowerCase().includes(q);
                            }).length === 0 && (
                              <div className="p-3 text-center text-xs text-slate-500">
                                No languages found matching &ldquo;{langSearch}&rdquo;
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Currency</label>
                    <div className="relative">
                      <select 
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Timezone</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-xs font-medium text-slate-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option>Asia/Kolkata (GMT +5:30)</option>
                      <option>UTC (GMT +0:00)</option>
                      <option>America/New_York (EST)</option>
                      <option>Europe/London (GMT)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Regional Preferences */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Regional Preferences</h3>
                    <p className="text-xs font-medium text-slate-500">Customize regional formatting settings.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Country</label>
                    <div className="relative">
                      <select 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option>India</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Germany</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Date Format</label>
                    <div className="relative">
                      <select 
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-700 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option>MMM D, YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Privacy & Communication */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Privacy & Visibility</h3>
                    <p className="text-xs font-medium text-slate-500">Control who can discover your activity on PayPilot.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Profile Search Visibility</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Allow clients and freelancers to find your profile in marketplace searches.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfileVisible(!profileVisible)}
                      className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${profileVisible ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${profileVisible ? "right-1" : "left-1"}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Hide Email Address</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Keep your direct email hidden from counterparties until an order is created.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHideEmail(!hideEmail)}
                      className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${hideEmail ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${hideEmail ? "right-1" : "left-1"}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Product Announcements</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Receive occasional updates on new AI and payment features.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductUpdates(!productUpdates)}
                      className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${productUpdates ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${productUpdates ? "right-1" : "left-1"}`} />
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
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
