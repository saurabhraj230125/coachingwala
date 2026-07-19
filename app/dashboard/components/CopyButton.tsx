"use client";

import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";

export default function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className={`relative w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-500 overflow-hidden group flex items-center justify-center gap-2 active:scale-[0.97] ${
        copied 
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400" 
          : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/20 border border-slate-700 hover:border-indigo-500/50"
      }`}
    >
      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 group-hover:translate-x-full duration-1000 transition-all"></div>
      
      <div className="relative z-10 flex items-center gap-2">
        {copied ? (
          <>
            <CheckCircle2 className="h-4 w-4 animate-in zoom-in duration-300" /> Link Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" /> Copy Link for WhatsApp
          </>
        )}
      </div>
    </button>
  );
}