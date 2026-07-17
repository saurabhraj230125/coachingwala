import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { 
  Users, CalendarCheck, Wallet, BookOpenCheck, 
  Sparkles, ExternalLink, ArrowRight, ShieldCheck, 
  TrendingUp, Clock
} from "lucide-react";
import CopyButton from "./components/CopyButton";

// 🔥 THE DEEP FIX: Force Vercel to load this live, never cache it.
export const dynamic = "force-dynamic";

export default async function FullPotentialDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // 1. Safely fetch the institute
  const { data: institute } = await supabase
    .from("institutes")
    .select("*")
    .eq("owner_id", user?.id)
    .single();

  // 2. CRASH-PROOF TELEMETRY FETCHING
  // If the institute isn't loaded or the tables don't exist yet, default to 0 instead of crashing Next.js
  let studentCount = 0;
  let examCount = 0;

  if (institute?.id) {
    // Fetch students safely
    const { count: sCount, error: sError } = await supabase
      .from("students")
      .select("*", { count: 'exact', head: true })
      .eq("institute_id", institute.id);
    
    if (!sError) studentCount = sCount || 0;

    // Fetch exams safely
    const { count: eCount, error: eError } = await supabase
      .from("exams")
      .select("*", { count: 'exact', head: true })
      .eq("institute_id", institute.id);
      
    if (!eError) examCount = eCount || 0;
  }

  // Generate the dynamic student portal URL
  const portalUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/student/login` 
    : "http://localhost:3000/student/login";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 w-full pb-24 md:pb-8">
      
      {/* 1. BRAND & GREETING HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 md:pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Overview <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-indigo-500" />
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Active Workspace: <span className="text-slate-800 font-bold">{institute?.name || "Loading Workspace..."}</span>
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Link href="/dashboard/students" className="flex-1 md:flex-none flex items-center justify-center px-5 py-3 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95">
            + New Student
          </Link>
          <Link href="/dashboard/attendance" className="flex-1 md:flex-none flex items-center justify-center px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95">
            Mark Attendance
          </Link>
        </div>
      </div>

      {/* 2. THE STUDENT PORTAL GATEWAY */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-[2rem] p-6 md:p-8 text-white shadow-2xl shadow-indigo-900/10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex-1 w-full text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Portal is Live
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Student Gateway</h2>
          <p className="text-indigo-200 text-sm max-w-md mx-auto lg:mx-0 leading-relaxed">
            Share this secure link. Students use their Portal Username and PIN to access NTA-style tests, DPPs, and analytics.
          </p>
        </div>

        <div className="relative z-10 w-full lg:w-auto bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-3 lg:min-w-[340px]">
          <div className="bg-black/40 px-4 py-3.5 rounded-xl flex items-center justify-between border border-white/5 shadow-inner">
            <code className="text-indigo-100 text-xs md:text-sm font-mono truncate mr-4 selection:bg-indigo-500/50">{portalUrl}</code>
            <ExternalLink className="h-4 w-4 text-indigo-400 shrink-0" />
          </div>
          {/* We will handle CopyButton error next if it acts up, assuming it's safe for now */}
          <CopyButton url={portalUrl} />
        </div>
      </div>

      {/* 3. INTERACTIVE WIDGET GRID (100% Clickable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Roster Widget */}
        <Link href="/dashboard/students" className="group block bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 active:scale-[0.97] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-blue-50/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm"><Users className="h-6 w-6" /></div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">Enrolled</p>
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{studentCount}</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
              Manage Roster <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Attendance Widget */}
        <Link href="/dashboard/attendance" className="group block bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all duration-300 active:scale-[0.97] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-emerald-50/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm"><CalendarCheck className="h-6 w-6" /></div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Daily</p>
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">Track</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-emerald-600 transition-colors">
              Log Registers <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Fees Widget */}
        <Link href="/dashboard/fees" className="group block bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300 transition-all duration-300 active:scale-[0.97] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-amber-50/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300 shadow-sm"><Wallet className="h-6 w-6" /></div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest group-hover:text-amber-500 transition-colors">Revenue</p>
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-black text-slate-900 tracking-tight group-hover:text-amber-500 transition-colors">Fees</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-amber-600 transition-colors">
              Collect Dues <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Exams Widget */}
        <Link href="/dashboard/exams" className="group block bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 hover:border-violet-300 transition-all duration-300 active:scale-[0.97] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-violet-50/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3 bg-violet-50 rounded-2xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-300 shadow-sm"><BookOpenCheck className="h-6 w-6" /></div>
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest group-hover:text-violet-500 transition-colors">Live Tests</p>
          </div>
          <div className="relative z-10">
            <p className="text-4xl font-black text-slate-900 tracking-tight group-hover:text-violet-600 transition-colors">{examCount}</p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-violet-600 transition-colors">
              NTA Engine <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

      </div>

      {/* 4. OPERATIONAL COMMAND CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Integrity */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-[2rem] p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">System Integrity</h3>
              <p className="text-sm text-slate-500 font-medium">All modules operating securely on edge network.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-slate-400" />
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Automated Cloud Backup</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Student data synced and encrypted in real-time.</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg">Secured</span>
            </div>
          </div>
        </div>

        {/* Pro Upgrade */}
        <Link href="/dashboard/billing" className="group bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 hover:border-indigo-300 rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all active:scale-[0.98] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-indigo-600">
              <TrendingUp className="h-6 w-6" />
              <h3 className="font-black text-sm uppercase tracking-widest">Scale Fast</h3>
            </div>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Unlock automated WhatsApp alerts, deep fee analytics, and massive storage with the Max Plan.
            </p>
          </div>
          <div className="mt-8 flex items-center justify-between w-full py-4 px-5 bg-indigo-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all group-hover:bg-indigo-700">
            <span>Upgrade to Max</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>
    </div>
  );
}