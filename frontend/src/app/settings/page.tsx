"use client";

import { 
  Home, Folder, Users, CreditCard, MessageSquare, Bot, Settings as SettingsIcon, 
  Bell, ChevronDown, Search, Plus, User, Shield, BellRing, Settings2, 
  Camera, MapPin, Globe, Clock, Sun, Moon, Lock, Smartphone, Key,
  Mail, MessageCircle, FileText, Sparkles, ChevronRight, Check,
  MoreVertical, CheckCircle2, AlertCircle
} from "lucide-react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";
import { useState, useEffect, useRef } from "react";
import { authApi, usersApi, settingsApi } from "@/lib/api";

interface CountryCode {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: "IN", dialCode: "+91", name: "India", flag: "🇮🇳" },
  { code: "US", dialCode: "+1", name: "United States", flag: "🇺🇸" },
  { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "AU", dialCode: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "DE", dialCode: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "FR", dialCode: "+33", name: "France", flag: "🇫🇷" },
  { code: "SG", dialCode: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "AE", dialCode: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", dialCode: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "JP", dialCode: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "CN", dialCode: "+86", name: "China", flag: "🇨🇳" },
  { code: "BR", dialCode: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "ZA", dialCode: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "MY", dialCode: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "NZ", dialCode: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "NL", dialCode: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", dialCode: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", dialCode: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "ES", dialCode: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "IT", dialCode: "+39", name: "Italy", flag: "🇮🇹" },
];

interface LocationOption {
  city: string;
  country: string;
  flag: string;
}

const POPULAR_LOCATIONS: LocationOption[] = [
  // India
  { city: "Chennai", country: "India", flag: "🇮🇳" },
  { city: "Bengaluru", country: "India", flag: "🇮🇳" },
  { city: "Mumbai", country: "India", flag: "🇮🇳" },
  { city: "Hyderabad", country: "India", flag: "🇮🇳" },
  { city: "Delhi NCR", country: "India", flag: "🇮🇳" },
  { city: "Pune", country: "India", flag: "🇮🇳" },
  { city: "Kolkata", country: "India", flag: "🇮🇳" },
  { city: "Ahmedabad", country: "India", flag: "🇮🇳" },
  { city: "Kochi", country: "India", flag: "🇮🇳" },
  { city: "Coimbatore", country: "India", flag: "🇮🇳" },
  // United States
  { city: "San Francisco, CA", country: "United States", flag: "🇺🇸" },
  { city: "New York, NY", country: "United States", flag: "🇺🇸" },
  { city: "Austin, TX", country: "United States", flag: "🇺🇸" },
  { city: "Seattle, WA", country: "United States", flag: "🇺🇸" },
  { city: "Los Angeles, CA", country: "United States", flag: "🇺🇸" },
  { city: "Boston, MA", country: "United States", flag: "🇺🇸" },
  { city: "Chicago, IL", country: "United States", flag: "🇺🇸" },
  // United Kingdom & Europe
  { city: "London", country: "United Kingdom", flag: "🇬🇧" },
  { city: "Manchester", country: "United Kingdom", flag: "🇬🇧" },
  { city: "Berlin", country: "Germany", flag: "🇩🇪" },
  { city: "Munich", country: "Germany", flag: "🇩🇪" },
  { city: "Paris", country: "France", flag: "🇫🇷" },
  { city: "Amsterdam", country: "Netherlands", flag: "🇳🇱" },
  { city: "Dublin", country: "Ireland", flag: "🇮🇪" },
  { city: "Zurich", country: "Switzerland", flag: "🇨🇭" },
  { city: "Stockholm", country: "Sweden", flag: "🇸🇪" },
  // Canada
  { city: "Toronto, ON", country: "Canada", flag: "🇨🇦" },
  { city: "Vancouver, BC", country: "Canada", flag: "🇨🇦" },
  { city: "Montreal, QC", country: "Canada", flag: "🇨🇦" },
  // Asia Pacific & Middle East
  { city: "Singapore", country: "Singapore", flag: "🇸🇬" },
  { city: "Dubai", country: "United Arab Emirates", flag: "🇦🇪" },
  { city: "Sydney", country: "Australia", flag: "🇦🇺" },
  { city: "Melbourne", country: "Australia", flag: "🇦🇺" },
  { city: "Tokyo", country: "Japan", flag: "🇯🇵" },
  { city: "Seoul", country: "South Korea", flag: "🇰🇷" },
  { city: "Hong Kong", country: "Hong Kong", flag: "🇭🇰" },
];

export default function Settings() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [fullName, setFullName] = useState("Sarah Johnson");
  const [email, setEmail] = useState("sarah@example.com");
  const [phoneNumber, setPhoneNumber] = useState("98765 43210");
  const [location, setLocation] = useState("Chennai, India");
  const [bio, setBio] = useState("I'm a student and tech enthusiast. I use PayPilot to find skilled freelancers for my academic and personal projects.");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  // Country code selector state
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Location selector state
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchUser() {
      try {
        if (typeof window !== "undefined" && !localStorage.getItem("paypilot_token")) {
          await authApi.loginAsDemoClient();
        }
        const user = await authApi.getMe();
        if (isMounted && user) {
          setCurrentUser(user);
          if (user.full_name) setFullName(user.full_name);
          if (user.email) setEmail(user.email);
        }
      } catch (err) {
        console.warn("User fetch error", err);
      }
    }
    fetchUser();
    return () => { isMounted = false; };
  }, []);

  const handleSaveChanges = async () => {
    setSaving(true);
    setSavedMsg("");
    try {
      if (currentUser?.id) {
        await usersApi.update(currentUser.id, {
          full_name: fullName,
        });
      }
      setSavedMsg("Profile changes saved successfully!");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err: any) {
      console.error("Save error", err);
      setSavedMsg("Failed to save changes. Please try again.");
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
            <span className="text-slate-700 font-bold">Settings</span>
          </div>

          <div className="relative w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search projects, freelancers, or anything..." 
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-5">
            <NotificationBell />
            <UserProfileMenu fallbackName={fullName} />
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-[1400px] w-full mx-auto">
          
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-[2rem] font-extrabold text-slate-900 tracking-tight">Settings</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your account, preferences, security, and notifications.</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex mb-6 px-2 overflow-hidden">
            <Link href="/settings" className="flex-1 py-4 flex items-center justify-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600">
              <User className="w-4 h-4" /> Profile
            </Link>
            <Link href="/settings/account" className="flex-1 py-4 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
              <Settings2 className="w-4 h-4" /> Account
            </Link>
            <Link href="/settings/notifications" className="flex-1 py-4 flex items-center justify-center gap-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">
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

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              
              {/* Profile Information Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <User className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Profile Information</h3>
                    <p className="text-xs font-medium text-slate-500">Update your personal information and how others see you on PayPilot.</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <img src="https://i.pravatar.cc/150?u=sarah" alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-white" />
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-slate-900 text-lg">{fullName}</h4>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">
                        {currentUser?.role || "Client"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">{email}</p>
                    <p className="text-xs text-slate-400 font-medium mb-3">Member since Oct 2026</p>
                    <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                      <Camera className="w-4 h-4" /> Change Photo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      disabled 
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-500 bg-slate-50 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-2">Phone Number</label>
                    <div className="flex relative">
                      {/* Country Code Dropdown Trigger */}
                      <div className="relative" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                          className="flex items-center justify-center px-3 py-2.5 border border-r-0 border-slate-200 rounded-l-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-sm font-semibold gap-1.5 select-none shrink-0 shadow-sm transition-colors focus:outline-none"
                          title="Select Country Code"
                        >
                          <span className="text-base leading-none">{selectedCountry.flag}</span>
                          <span className="font-bold text-slate-900">{selectedCountry.dialCode}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${showCountryDropdown ? "rotate-180" : ""}`} />
                        </button>

                        {/* Country Code Searchable Menu */}
                        {showCountryDropdown && (
                          <div className="absolute left-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-left">
                            <div className="p-1.5 border-b border-slate-100 mb-1">
                              <input
                                type="text"
                                placeholder="Search country or code..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-blue-500"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-56 overflow-y-auto space-y-0.5">
                              {COUNTRY_CODES.filter((c) => 
                                c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
                                c.dialCode.includes(countrySearch) || 
                                c.code.toLowerCase().includes(countrySearch.toLowerCase())
                              ).map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCountry(c);
                                    setShowCountryDropdown(false);
                                    setCountrySearch("");
                                  }}
                                  className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-lg transition-colors text-left ${
                                    selectedCountry.code === c.code
                                      ? "bg-blue-50 text-blue-700 font-bold"
                                      : "text-slate-700 hover:bg-slate-50 font-medium"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="text-sm leading-none">{c.flag}</span>
                                    <span className="truncate">{c.name}</span>
                                  </div>
                                  <span className="font-mono text-slate-500 ml-2 shrink-0">{c.dialCode}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <input 
                        type="text" 
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full border border-slate-200 rounded-r-xl px-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 mb-2">Location</label>
                    <div className="relative" ref={locationDropdownRef}>
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input 
                        type="text" 
                        value={location}
                        onFocus={() => setShowLocationDropdown(true)}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setShowLocationDropdown(true);
                        }}
                        placeholder="Search or enter city, country..."
                        className="w-full border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 rounded"
                        title="Toggle locations"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLocationDropdown ? "rotate-180 text-blue-600" : ""}`} />
                      </button>

                      {showLocationDropdown && (
                        <div className="absolute left-0 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
                            <span>Select or type your location</span>
                            <span className="text-[11px] text-slate-400">Popular hubs</span>
                          </div>
                          <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 p-1">
                            {POPULAR_LOCATIONS.filter(item => {
                              if (!location.trim()) return true;
                              const q = location.toLowerCase();
                              return item.city.toLowerCase().includes(q) || item.country.toLowerCase().includes(q);
                            }).map((item, idx) => {
                              const displayValue = `${item.city}, ${item.country}`;
                              const isSelected = location.trim().toLowerCase() === displayValue.toLowerCase();
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setLocation(displayValue);
                                    setShowLocationDropdown(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                                    isSelected
                                      ? "bg-blue-50 text-blue-700 font-bold"
                                      : "text-slate-700 hover:bg-slate-50 font-medium"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <span className="text-sm leading-none shrink-0">{item.flag}</span>
                                    <span className="truncate">{item.city}</span>
                                  </div>
                                  <span className="text-slate-400 text-[11px] ml-2 shrink-0">{item.country}</span>
                                </button>
                              );
                            })}
                            {POPULAR_LOCATIONS.filter(item => {
                              if (!location.trim()) return true;
                              const q = location.toLowerCase();
                              return item.city.toLowerCase().includes(q) || item.country.toLowerCase().includes(q);
                            }).length === 0 && (
                              <div className="p-3 text-center text-xs text-slate-500">
                                No preset found for &ldquo;{location}&rdquo;. You can keep your custom entry!
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-900 mb-2">Bio</label>
                  <textarea 
                    rows={3} 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  ></textarea>
                  <div className="text-right text-[11px] text-slate-400 font-medium mt-1">{bio.length}/500</div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleSaveChanges}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>

              {/* Security Overview Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Security Settings</h3>
                      <p className="text-xs font-medium text-slate-500">Keep your account secure with the latest security settings.</p>
                    </div>
                  </div>
                </div>

                <Link href="/settings/security" className="border border-slate-100 rounded-xl p-4 hover:border-slate-300 transition-colors cursor-pointer flex items-center justify-between mb-4 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">Two-Factor Authentication (2FA)</h4>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded">Not Configured</span>
                      </div>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">Protect your account with authenticator verification.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </Link>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Notifications Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <Bell className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">Notifications</h3>
                      <p className="text-xs font-medium text-slate-500">Manage how you receive alerts.</p>
                    </div>
                  </div>
                  <Link href="/settings/notifications" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                    Manage
                  </Link>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <Folder className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Project updates</h4>
                        <p className="text-[11px] font-medium text-slate-500">Milestone and status alerts</p>
                      </div>
                    </div>
                    <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                      <CreditCard className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Payment confirmations</h4>
                        <p className="text-[11px] font-medium text-slate-500">Receipts and ledger updates</p>
                      </div>
                    </div>
                    <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Payments */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Connected Payments</h3>
                    <p className="text-xs font-medium text-slate-500">Manage your payment methods and connections.</p>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-xl p-4 flex items-center justify-between hover:border-blue-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#F5F9FF] rounded-lg flex items-center justify-center shrink-0">
                      <span className="font-extrabold text-[#003087] italic text-sm">PayPal</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">PayPal Sandbox</h4>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">Connected</span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500">{email}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
