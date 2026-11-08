"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import LandingNavbar from "./LandingNavbar";

export default function RootClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Prevent copying and cutting outside editable form controls
    const handleCopyCut = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        Boolean(activeEl && (activeEl as HTMLElement).isContentEditable);

      if (!isInput) {
        e.preventDefault();
      }
    };

    // Prevent drag-selection of images & text
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" || !target.closest("input, textarea, [contenteditable='true']")) {
        e.preventDefault();
      }
    };

    document.addEventListener("copy", handleCopyCut);
    document.addEventListener("cut", handleCopyCut);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("copy", handleCopyCut);
      document.removeEventListener("cut", handleCopyCut);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  const isMarketing = 
    pathname === "/" || 
    pathname === "/how-it-works" || 
    pathname === "/for-clients" || 
    pathname === "/for-freelancers" || 
    pathname === "/pricing";

  if (isMarketing) {
    return (
      <div className="min-h-screen bg-[#05030f] text-white font-sans overflow-x-hidden relative selection:bg-transparent flex flex-col">
        {/* Background ambient glow effects */}
        <div className="absolute top-0 left-0 w-full h-[1200px] overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/15 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full"></div>
        </div>

        {/* Persistent Smooth Animated Navigation Header */}
        <LandingNavbar />

        {/* Page Content View */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
