"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowRight, Sparkles, Lock, Mail, User, Shield, AlertCircle, 
  Loader2, CheckCircle2, Eye, EyeOff, Check, Briefcase, ChevronRight,
  ShieldCheck, Zap, Globe
} from "lucide-react";
import { authApi } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"client" | "freelancer">("client");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync state from URL query parameters (e.g. ?mode=register&role=freelancer)
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    const roleParam = searchParams.get("role");

    if (modeParam === "register") {
      setIsRegister(true);
    } else if (modeParam === "login") {
      setIsRegister(false);
    }

    if (roleParam === "freelancer") {
      setRole("freelancer");
    } else if (roleParam === "client") {
      setRole("client");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isRegister) {
        if (!fullName.trim()) {
          setError("Please provide your full name");
          setLoading(false);
          return;
        }
        await authApi.register(email, password, fullName, role);
        setSuccess("Account created successfully! Teleporting to your dashboard...");
      } else {
        await authApi.login(email, password);
        setSuccess("Welcome back! Redirecting...");
      }

      setTimeout(() => {
        let targetRole = role;
        try {
          const stored = localStorage.getItem("paypilot_user");
          if (stored) {
            const user = JSON.parse(stored);
            if (user?.role) targetRole = user.role.toLowerCase();
          }
        } catch {
          // fallback to role state
        }

        if (targetRole === "freelancer") {
          router.push("/dashboard/freelancer");
        } else {
          router.push("/dashboard/client");
        }
      }, 700);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoRole: string) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await authApi.login(demoEmail, "Password123!");
      setSuccess(`Signed in as demo ${demoRole}! Teleporting...`);
      setTimeout(() => {
        if (demoRole === "freelancer") {
          router.push("/dashboard/freelancer");
        } else {
          router.push("/dashboard/client");
        }
      }, 700);
    } catch (err: any) {
      console.error(err);
      setError("Demo login failed. Make sure backend is running and seeded.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto grid lg:grid-cols-12 gap-0 bg-[#0B1121]/90 border border-slate-700/60 rounded-[32px] shadow-[0_25px_80px_rgba(15,23,42,0.9)] backdrop-blur-2xl overflow-hidden relative z-20">
      
      {/* LEFT COLUMN: 2026 Brand Showcase & Escrow Perks (Hidden on small screens) */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-blue-950/60 via-[#0E172E] to-[#070B14] p-10 flex-col justify-between border-r border-slate-800/80 relative overflow-hidden">
        {/* Glow orb in corner */}
        <div className="absolute top-[-20%] left-[-20%] w-72 h-72 bg-blue-500/20 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-72 h-72 bg-cyan-500/15 blur-[90px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 mb-10 group">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl p-2 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight">PayPilot</span>
              <span className="block text-[9px] uppercase font-bold tracking-widest text-cyan-400">Escrow Cloud</span>
            </div>
          </Link>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[11px] font-bold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Autonomous Escrow</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
              Work protected by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Gemini AI</span> & <span className="text-white">PayPal</span>.
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Join thousands of clients and specialists executing verified freelance contracts with instantaneous PayPal releases.
            </p>
          </div>

          <div className="mt-8 space-y-3 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>PayPal Smart Escrow Vault protection</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span>Autonomous Gemini 1.5 deliverable audit</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span>1-Click official single-page GST tax invoices</span>
            </div>
          </div>
        </div>

        {/* Live quote preview badge */}
        <div className="relative z-10 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-sm mt-8">
          <p className="text-[11px] italic text-slate-300 leading-relaxed">
            "PayPilot's escrow gave me total confidence to hire talent internationally."
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px]">
            <span className="font-bold text-white">Sarah Jenkins • Client</span>
            <span className="text-cyan-400 font-mono">Verified ₹35,000 Spent</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Form with Smooth Micro-Interactions */}
      <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
        
        {/* Toggle Mode: Floating Pill Slider */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl mb-6 border border-slate-700/60 shadow-inner">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(""); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              !isRegister 
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(""); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isRegister 
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-500/20" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Free Account
          </button>
        </div>

        {/* Header Text */}
        <div className="mb-6">
          <h3 className="text-2xl font-black text-white tracking-tight">
            {isRegister ? "Join PayPilot Today" : "Welcome Back"}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister 
              ? "Select your profile type and get started in seconds." 
              : "Access your escrow contracts, messages, and earnings."}
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selector Tabs (Only in Register mode) */}
          {isRegister && (
            <div className="space-y-1.5 pb-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                I Want To Join As
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    role === "client" 
                      ? "bg-blue-600/20 border-cyan-400 shadow-sm shadow-cyan-500/10 text-white" 
                      : "border-slate-700/80 bg-slate-900/50 text-slate-400 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${role === "client" ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                    💼
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs block text-white">Client</span>
                    <span className="text-[10px] text-slate-400 block truncate">Hire talent & fund escrows</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("freelancer")}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    role === "freelancer" 
                      ? "bg-blue-600/20 border-cyan-400 shadow-sm shadow-cyan-500/10 text-white" 
                      : "border-slate-700/80 bg-slate-900/50 text-slate-400 hover:border-slate-600 hover:text-white"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${role === "freelancer" ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"}`}>
                    🚀
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs block text-white">Freelancer</span>
                    <span className="text-[10px] text-slate-400 block truncate">Get hired & receive payouts</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Full Name (Register Mode) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === "freelancer" ? "e.g. Rahul Kumar" : "e.g. Sarah Johnson"}
                  className="w-full bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          </div>

          {/* Password with Show/Hide toggle */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-300">Password</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => alert("Demo Password: Password123!")}
                  className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/80 border border-slate-700/80 focus:border-cyan-400 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner focus:ring-2 focus:ring-cyan-500/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRegister ? (
              <>
                <span>Create {role === "freelancer" ? "Freelancer" : "Client"} Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Sign In to PayPilot</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Cards */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              1-Click Demo Sandbox Accounts
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">Password: Password123!</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin("client@paypilot.demo", "client")}
              disabled={loading}
              className="p-3 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-400/80 rounded-2xl transition-all text-left cursor-pointer group"
            >
              <div className="text-base mb-1">💼</div>
              <span className="font-bold text-xs text-white block group-hover:text-cyan-400 transition-colors">Client</span>
              <span className="text-[10px] text-slate-500 block truncate">Sarah Johnson</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("rahul@paypilot.demo", "freelancer")}
              disabled={loading}
              className="p-3 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-400/80 rounded-2xl transition-all text-left cursor-pointer group"
            >
              <div className="text-base mb-1">🚀</div>
              <span className="font-bold text-xs text-white block group-hover:text-cyan-400 transition-colors">Freelancer</span>
              <span className="text-[10px] text-slate-500 block truncate">Rahul Kumar</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin("admin@paypilot.demo", "admin")}
              disabled={loading}
              className="p-3 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-purple-400/80 rounded-2xl transition-all text-left cursor-pointer group"
            >
              <div className="text-base mb-1">🛡️</div>
              <span className="font-bold text-xs text-white block group-hover:text-purple-400 transition-colors">Admin</span>
              <span className="text-[10px] text-slate-500 block truncate">PayPilot Protocol</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] bg-cyan-500/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Navbar Back Shortcut */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 relative z-10 px-2">
        <Link 
          href="/" 
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>&larr; Back to Home</span>
        </Link>
        <span className="text-xs text-slate-500 font-medium">
          Protected by RBI & PayPal Escrow Architecture
        </span>
      </div>

      <Suspense fallback={<div className="text-slate-400 text-sm">Loading PayPilot Auth...</div>}>
        <LoginForm />
      </Suspense>

      {/* Footer Legal */}
      <footer className="mt-8 text-center text-xs text-slate-500 relative z-10">
        <p>&copy; 2026 PayPilot Inc. All payments secured via PayPal Smart Escrow Sandbox.</p>
      </footer>
    </div>
  );
}
