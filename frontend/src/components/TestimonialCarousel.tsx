"use client";

import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Amit Verma",
    role: "Student & Startup Founder",
    location: "Chennai, India",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    quote: "PayPilot made it so easy to find a skilled freelancer for my project. The AI matching saved me a lot of time, and the PayPal payment process was smooth and secure. Highly recommend!"
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "Product Lead",
    location: "San Francisco, USA",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    quote: "The automated milestone verification is a complete game changer. Code deliverables are audited against our specs before escrow release, guaranteeing zero dispute headaches."
  },
  {
    id: 3,
    name: "Karthik Subramanian",
    role: "Engineering Director",
    location: "Bengaluru, India",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    quote: "We hired 3 developers in under 48 hours. The instant PayPal sandbox simulation and 1-click official tax invoices made legal compliance completely effortless."
  }
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide to next person every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const active = TESTIMONIALS[currentIndex];

  return (
    <section className="relative z-20 px-10 py-10 max-w-[1400px] mx-auto">
      <div 
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="bg-[#0B1120] border border-slate-800 rounded-3xl p-8 flex items-center justify-between gap-8 relative overflow-hidden transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        {/* Testimonial Content with smooth fade */}
        <div className="flex gap-6 items-center flex-1 min-w-0 transition-opacity duration-300 key={active.id}">
          <img 
            src={active.avatar} 
            className="w-20 h-20 rounded-full border-4 border-slate-800 object-cover shrink-0 shadow-lg" 
            alt={active.name} 
          />
          <div className="flex-1 min-w-0">
            <Quote className="w-6 h-6 text-blue-500 mb-2 opacity-50 shrink-0" />
            <p className="text-[15px] text-slate-300 leading-relaxed max-w-3xl mb-4 transition-all">
              "{active.quote}"
            </p>
            <div>
              <span className="font-bold text-white text-[13px]">{active.name}</span>
              <span className="text-slate-500 text-[11px] ml-2">
                {active.role} • {active.location}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Controls & Pagination Indicators */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <div className="flex gap-2 mr-4">
            {TESTIMONIALS.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx 
                    ? "bg-blue-500 w-6" 
                    : "bg-slate-700 hover:bg-slate-600"
                }`}
                title={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
          
          <button 
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors text-slate-400 hover:text-white cursor-pointer"
            title="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors text-slate-400 hover:text-white cursor-pointer"
            title="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
