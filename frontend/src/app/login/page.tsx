"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Lock, Mail, User, Shield, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { authApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        setSuccess("Registration successful! Redirecting...");
      } else {
        await authApi.login(email, password);
        setSuccess("Login successful! Redirecting...");
      }

      setTimeout(() => {
        if (role === "freelancer") {
          router.push("/dashboard/freelancer");
        } else {
          router.push("/dashboard/client");
        }
      }, 700);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Authentication failed. Please verify your credentials.");
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
      setSuccess(`Signed in as demo ${demoRole}! Redirecting...`);
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
    <div className="min-h-screen bg-[#05030f] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[130px] rounded-full pointer-events-none"></div>

      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 mb-8 group relative z-10">
        <div className="bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2.5 shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-3xl font-extrabold tracking-tight text-white">PayPilot</span>
      </Link>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-700/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Toggle Mode */}
        <div className="flex bg-slate-800/60 p-1 rounded-2xl mb-8 border border-slate-700/50">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(""); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              !isRegister ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(""); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
              isRegister ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">I want to join as</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    role === "client" 
                      ? "bg-blue-600/30 border-blue-500 text-white" 
                      : "border-slate-700 bg-slate-800/40 text-slate-400 hover:text-white"
                  }`}
                >
                  Client (Hiring)
                </button>
                <button
                  type="button"
                  onClick={() => setRole("freelancer")}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    role === "freelancer" 
                      ? "bg-blue-600/30 border-blue-500 text-white" 
                      : "border-slate-700 bg-slate-800/40 text-slate-400 hover:text-white"
                  }`}
                >
                  Freelancer (Talent)
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRegister ? (
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>Sign In <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        {/* Demo Accounts Quick Login */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">
            Or Click to Sign In with Demo Accounts
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("client@paypilot.demo", "client")}
              disabled={loading}
              className="py-2.5 px-2 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-blue-500/50 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white transition-all text-center cursor-pointer"
            >
              👤 Client
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("rahul@paypilot.demo", "freelancer")}
              disabled={loading}
              className="py-2.5 px-2 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-cyan-500/50 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white transition-all text-center cursor-pointer"
            >
              💼 Freelancer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@paypilot.demo", "admin")}
              disabled={loading}
              className="py-2.5 px-2 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-purple-500/50 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white transition-all text-center cursor-pointer"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
