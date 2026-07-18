import Link from "next/link";
import { Lock, Zap, ShieldAlert, ArrowRight, Sparkles, Timer, CheckCircle2 } from "lucide-react";

interface TrialGuardProps {
  children: React.ReactNode;
  status: string | null | undefined;
  trialEndsAt: string | null | undefined;
}

export default function TrialGuard({ children, status, trialEndsAt }: TrialGuardProps) {
  // If no trial data exists, we allow access (fallback for older accounts)
  if (!trialEndsAt) return <>{children}</>;

  const now = new Date();
  const trialEnd = new Date(trialEndsAt);
  
  // Calculate remaining time precisely
  const timeDiff = trialEnd.getTime() - now.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  const isTrialExpired = timeDiff <= 0;
  const isPaid = status === "active";
  const isPending = status === "pending_verification";

  // If already paid or awaiting manual verification, bypass the lock
  if (isPaid || isPending) {
    return <>{children}</>;
  }

  // 🔥 STATE 1: ACTIVE TRIAL (Premium Banner)
  if (!isTrialExpired) {
    // Clamp display to 1-7 days to prevent confusion if date logic has offsets
    const displayDays = Math.max(1, Math.min(daysLeft, 7)); 
    const isUrgent = displayDays <= 2;

    return (
      <div className="flex flex-col h-full w-full relative">
        <div className="w-full pt-4 pb-2 px-4 flex justify-center shrink-0 z-40 relative animate-in slide-in-from-top-4 fade-in duration-700">
          
          <div className={`backdrop-blur-xl border p-3 rounded-2xl shadow-lg flex items-center justify-between gap-6 w-full max-w-4xl transition-colors duration-500 ${
            isUrgent 
              ? 'bg-rose-600/95 border-rose-500 text-white' 
              : 'bg-slate-900/95 border-slate-700 text-white'
          }`}>
            
            <div className="flex items-center gap-4 pl-2 md:pl-4">
              <div className={`relative flex h-5 w-5 shrink-0 ${isUrgent ? 'animate-pulse' : ''}`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isUrgent ? 'bg-white' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-5 w-5 ${isUrgent ? 'bg-white' : 'bg-amber-500'}`}></span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm md:text-base font-black tracking-tight">
                  Your Future Q Trial: {displayDays} {displayDays === 1 ? 'Day' : 'Days'} Remaining
                </span>
                <span className={`text-[11px] font-bold hidden sm:block mt-0.5 opacity-80`}>
                  Unlock unlimited students and NTA engines.
                </span>
              </div>
            </div>
            
            <Link 
              href="/dashboard/billing" 
              className={`text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all active:scale-95 shadow-md ${
                isUrgent 
                  ? 'bg-white text-rose-600 hover:bg-rose-50' 
                  : 'bg-gradient-to-r from-amber-400 to-amber-300 text-amber-950 hover:shadow-lg'
              }`}
            >
              Upgrade Now
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full relative">
          {children}
        </div>
      </div>
    );
  }

  // 🔥 STATE 2: EXPIRED LOCKOUT
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[12px]"></div>
      
      {/* Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="bg-white/95 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full shadow-2xl relative z-10 animate-in zoom-in-95 duration-500 slide-in-from-bottom-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
          <Timer className="h-3.5 w-3.5" /> Trial Access Ended
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Restore Access</h1>
        <p className="text-slate-500 font-medium mb-8">
          Your 7-day trial has concluded. Upgrade to keep using your student gateway and coaching management tools.
        </p>

        <Link 
          href="/dashboard/billing"
          className="group w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-black text-lg py-4 rounded-2xl shadow-xl hover:bg-slate-800 transition-all"
        >
          View Upgrade Plans <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}