"use client";

import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { ReactNode } from "react";

interface FeatureLockProps {
  isLocked: boolean;
  featureName: string;
  children: ReactNode;
}

export default function FeatureLock({ isLocked, featureName, children }: FeatureLockProps) {
  // If the trial is active, just render the normal content normally
  if (!isLocked) {
    return <>{children}</>;
  }

  // If the trial is over, wrap the content in the Animated Paywall
  return (
    <div className="relative w-full rounded-[2rem] overflow-hidden group">
      
      {/* 1. The Blurred Underlying Content (Labor Illusion) */}
      <div className="pointer-events-none select-none blur-[6px] opacity-40 transition-all duration-700 grayscale-[30%]">
        {children}
      </div>

      {/* 2. The Glassmorphic Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/5 backdrop-blur-[2px] transition-all duration-500 group-hover:bg-slate-900/20 group-hover:backdrop-blur-[6px]">
        
        {/* 3. The Animated Lock Container */}
        <div className="flex flex-col items-center animate-in zoom-in-95 fade-in duration-700">
          
          {/* Glowing Lock Icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-40 rounded-full animate-pulse"></div>
            <div className="h-20 w-20 bg-white shadow-2xl shadow-indigo-500/20 rounded-[1.5rem] flex items-center justify-center relative z-10 border border-slate-100 group-hover:-translate-y-2 transition-transform duration-500">
              <Lock className="h-8 w-8 text-indigo-600" />
            </div>
            {/* Tiny Floating Sparkle */}
            <Sparkles className="absolute -top-2 -right-3 h-5 w-5 text-amber-400 animate-pulse z-20" />
          </div>

          {/* Premium Copywriting */}
          <h3 className="text-2xl font-black text-slate-900 tracking-tight drop-shadow-sm mb-2 text-center">
            {featureName} is Locked
          </h3>
          <p className="text-sm font-bold text-slate-600 mb-6 text-center max-w-xs drop-shadow-sm">
            Your 7-Day Trial has ended. Upgrade your workspace to unlock this feature and supercharge your coaching.
          </p>

          {/* The Upgrade Button */}
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-8 py-3.5 rounded-full font-black text-sm transition-all active:scale-95 shadow-xl shadow-slate-900/20 hover:shadow-indigo-600/30">
            <Sparkles className="h-4 w-4" /> Upgrade to Pro <ArrowRight className="h-4 w-4" />
          </button>

        </div>
      </div>

      {/* Decorative Shimmer Effect on Hover */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none z-20"></div>

    </div>
  );
}