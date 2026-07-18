"use client";

import { useState } from "react";
import { loginStudent } from "./actions";
import { ArrowRight, KeyRound, ShieldAlert, BookOpen } from "lucide-react";

export default function PortalLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await loginStudent(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 selection:bg-indigo-500/30">
      <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-700">
        
        {/* Branding */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="h-16 w-16 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-slate-900/20 rotate-3 hover:rotate-0 transition-transform">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Gateway</h1>
          <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Authorized Access Only</p>
        </div>

        {/* Login Box */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl flex items-center gap-2 border border-red-100 animate-in fade-in">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Gateway ID</label>
              <input 
                name="username" 
                required 
                placeholder="e.g. rahul8492" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">6-Digit PIN</label>
              <div className="relative">
                <input 
                  name="pin" 
                  type="password" 
                  required 
                  maxLength={6}
                  placeholder="••••••" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl tracking-widest font-black text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300 placeholder:tracking-normal"
                />
                <KeyRound className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-lg shadow-indigo-600/20"
            >
              {isPending ? "Verifying..." : "Access Portal"} <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}