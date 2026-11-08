"use client";

import { useState } from "react";
import { 
  User, Mail, Phone, MapPin, Briefcase, Award, 
  DollarSign, CheckCircle2, Star, ShieldCheck, Plus, X, Camera
} from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import UserProfileMenu from "@/components/UserProfileMenu";

export default function FreelancerProfilePage() {
  const [name, setName] = useState("Rahul Kumar");
  const [title, setTitle] = useState("Full Stack Developer & Technical Writer");
  const [hourlyRate, setHourlyRate] = useState(1500);
  const [location, setLocation] = useState("Bengaluru, India");
  const [email] = useState("rahul@paypilot.demo");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [bio, setBio] = useState("Specialized in building full-stack web applications with React, Next.js, and Python FastAPI. Passionate about writing clear technical documentation and architecting clean, secure systems.");
  
  const [skills, setSkills] = useState([
    "React", "Next.js", "Python", "FastAPI", "PostgreSQL", 
    "TypeScript", "Tailwind CSS", "PayPal SDK", "Technical Writing"
  ]);
  const [newSkill, setNewSkill] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = () => {
    setSavedMsg("Freelancer profile updated successfully!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      <AppSidebar activePage="settings" />

      <main className="flex-1 p-8 max-w-[1200px]">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase tracking-wider">
                Freelancer Portal
              </span>
              <span className="text-xs text-slate-400 font-medium">Public Talent Card & Portfolio</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Profile & Skills</h1>
            <p className="text-slate-500 text-sm mt-0.5">Showcase your verified technical expertise, rates, and portfolio to potential clients.</p>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <UserProfileMenu fallbackName="Rahul Kumar" fallbackRole="Freelancer" />
          </div>
        </header>

        {/* Saved Alert */}
        {savedMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{savedMsg}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src="https://i.pravatar.cc/150?u=rahul" 
                  alt="Rahul Kumar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-md"
                />
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow"
                  title="Upload avatar"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-extrabold text-slate-900">{name}</h2>
                  <span className="px-2.5 py-0.5 bg-cyan-50 text-cyan-700 text-[10px] font-bold rounded-full uppercase">
                    Level 2 Freelancer
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-500">{title}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {location}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="w-3.5 h-3.5 fill-amber-500" /> 4.9 (14 reviews)</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold"><ShieldCheck className="w-3.5 h-3.5" /> Verified PayPal Seller</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Hourly Rate</span>
              <div className="text-3xl font-black text-slate-900">₹{hourlyRate}<span className="text-sm font-normal text-slate-400">/hr</span></div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Professional Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Hourly Rate (₹ INR)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">City & Country</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Professional Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 outline-none focus:border-blue-500 resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Skills Tag Editor */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8">
          <h3 className="text-base font-bold text-slate-900 mb-1">Skills & Technical Vectorizer</h3>
          <p className="text-xs text-slate-400 mb-6">Our AI semantic matching engine indexes these tags against incoming client project scopes.</p>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            {skills.map((skill) => (
              <span 
                key={skill}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-2 border border-blue-100"
              >
                <span>{skill}</span>
                <button 
                  type="button" 
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-red-500 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 max-w-md">
            <input
              type="text"
              placeholder="Add skill (e.g. Next.js, Docker, AI)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); }}}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            Save Profile & Skills
          </button>
        </div>

      </main>
    </div>
  );
}
