"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { label: "How it works", href: "/how-it-works" },
    { label: "For Clients", href: "/for-clients" },
    { label: "For Freelancers", href: "/for-freelancers" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="relative z-30 flex justify-between items-center py-6 px-10 max-w-[1400px] mx-auto w-full">
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-200 group">
        <div className="bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2 shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
          </svg>
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">PayPilot</span>
      </Link>

      {/* Nav Links with Smooth Layout Animation */}
      <nav className="hidden md:flex items-center gap-10 text-[15px] font-medium">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-1 transition-colors duration-200 ${
                isActive ? "text-white font-semibold" : "text-slate-300 hover:text-white"
              }`}
            >
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="landing-active-tab-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.9)]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Action Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          href="/login"
          className="text-[15px] font-medium text-slate-300 hover:text-white transition-all duration-200 px-4 py-2 border border-slate-700/50 hover:border-slate-600 rounded-xl hover:bg-slate-800/40 active:scale-95"
        >
          Sign In
        </Link>
        <Link
          href="/login?mode=register"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white px-6 py-2 rounded-xl text-[15px] font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all duration-200 active:scale-95"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
