"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, X, Clock, CheckCircle2 } from "lucide-react";

interface DeadlineItem {
  id: string;
  date: string;
  project: string;
  milestone: string;
  status: "upcoming" | "in_review" | "completed";
}

const DEFAULT_DEADLINES: DeadlineItem[] = [
  {
    id: "d1",
    date: "Aug 12, 2026",
    project: "React Dashboard for College Project",
    milestone: "Milestone 2 Delivery by Rahul Kumar",
    status: "upcoming"
  },
  {
    id: "d2",
    date: "Aug 8, 2026",
    project: "10-Page Solar Power Report",
    milestone: "Final Review Submission by Arjun Menon",
    status: "in_review"
  },
  {
    id: "d3",
    date: "Aug 5, 2026",
    project: "Logo Design for Startup",
    milestone: "Priya Sharma — Delivered & Approved",
    status: "completed"
  }
];

export default function CalendarDeadlinesMenu({ className = "" }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
        title="Project Deadlines & Calendar"
      >
        <Calendar className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-84 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-900 text-sm">Upcoming Deadlines</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto">
            {DEFAULT_DEADLINES.map((item) => (
              <div 
                key={item.id} 
                className={`p-3 rounded-xl border text-left ${
                  item.status === "completed"
                    ? "bg-emerald-50/60 border-emerald-100"
                    : item.status === "in_review"
                    ? "bg-orange-50/60 border-orange-100"
                    : "bg-blue-50/60 border-blue-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    item.status === "completed"
                      ? "text-emerald-700"
                      : item.status === "in_review"
                      ? "text-orange-700"
                      : "text-blue-700"
                  }`}>
                    {item.date} {item.status === "completed" ? "(Completed)" : ""}
                  </span>
                  {item.status === "completed" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900">{item.project}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.milestone}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
