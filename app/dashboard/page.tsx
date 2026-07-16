import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { 
  Users, CalendarCheck, Wallet, BookOpenCheck, 
  Sparkles, ExternalLink, ArrowRight, ShieldCheck, 
  TrendingUp, Clock
} from "lucide-react";
import CopyButton from "./components/CopyButton"; // The interactive button we just made

export default async function FullPotentialDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch telemetry
  const { data: institute } = await supabase.from("institutes").select("*").eq("owner_id", user?.id).single();
  const { count: studentCount } = await supabase.from("students").select("*", { count: 'exact', head: true }).eq("institute_id", institute?.id);
  const { count: examCount } = await supabase.from("exams").select("*", { count: 'exact', head: true }).eq("institute_id", institute?.id);

  // Generate the dynamic student portal URL
  const portalUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/student/login` 
    : "http://localhost:3000/student/login";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 w-full pb-24 md:pb-8">
      
      {/* 1. BRAND & GREETING HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-4 md:pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Overview Console <Sparkles className="h-6 w-6 text-indigo-500" />
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            System Node: <span className="text-slate-800 font-bold">{institute?.name || "Workspace"}</span>
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Link href="/dashboard/students" className="flex-1 md:flex-none flex items-center justify-center px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95">
            + New Student
          </Link>
          <Link href="/dashboard/attendance" className="flex-1 md:flex-none flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95">
            Mark Attendance
          </Link>
        </div>
      </div>

      {/* 2. THE STUDENT PORTAL GATEWAY (WhatsApp Share Card) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-indigo-900/10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 border border-slate-800">
        {/* Decorative Background Blur */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex-1 w-full text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Portal is Live
          </div>
          <h2 className="text-2xl font-black mb-2">Student Access Gateway</h2>
          <p className="text-indigo-200 text-sm max-w-md mx-auto lg:mx-0">
            Share this secure link with your students. They will use their Portal Username and PIN to access live NTA-style tests, DPPs, and their performance dashboard.
          </p>
        </div>

        {/* The Link Box */}
        <div className="relative z-10 w-full lg:w-auto bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-3 lg:min-w-[340px]">
          <div className="bg-black/40 px-4 py-3 rounded-xl flex items-center justify-between border border-white/5 shadow-inner">
            <code className="text-indigo-100 text-xs md:text-sm font-mono truncate mr-4 selection:bg-indigo-500/50">{portalUrl}</code>
            <ExternalLink className="h-4 w-4 text-indigo-400 shrink-0" />
          </div>
          <CopyButton url={portalUrl} />
        </div>
      </div>

      {/* 3. CORE METRICS ENGINE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Roster Card */}
        <div className="group bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] md:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Enrolled</p>
            <div className="p-2 md:p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Users className="h-4 w-4 md:h-5 md:w-5" /></div>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-slate-900">{studentCount || 0}</p>
            <Link href="/dashboard/students" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800">
              Manage Roster <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="group bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] md:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Attendance</p>
            <div className="p-2 md:p-2.5 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><CalendarCheck className="h-4 w-4 md:h-5 md:w-5" /></div>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-slate-900">Track</p>
            <Link href="/dashboard/attendance" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-800">
              Log Registers <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Fee Card */}
        <div className="group bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] md:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Revenue</p>
            <div className="p-2 md:p-2.5 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Wallet className="h-4 w-4 md:h-5 md:w-5" /></div>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-slate-900">Fees</p>
            <Link href="/dashboard/fees" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-800">
              Collect Dues <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Exams Card */}
        <div className="group bg-white border border-slate-200/60 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-violet-200 transition-all flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-[10px] md:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Live Tests</p>
            <div className="p-2 md:p-2.5 bg-violet-50 rounded-xl text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors"><BookOpenCheck className="h-4 w-4 md:h-5 md:w-5" /></div>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-slate-900">{examCount || 0}</p>
            <Link href="/dashboard/exams" className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-violet-600 hover:text-violet-800">
              NTA Engine <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

      </div>

      {/* 4. OPERATIONAL COMMAND CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Security & Reliability */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">System Integrity</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">All modules are operating smoothly.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Automated Cloud Backups</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Student data is synced in real-time.</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">Secured</span>
            </div>
          </div>
        </div>

        {/* Right: Upgrade/Growth Prompt */}
        <div className="bg-gradient-to-b from-indigo-50 to-white border border-indigo-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-indigo-600">
              <TrendingUp className="h-5 w-5" />
              <h3 className="font-extrabold text-sm uppercase tracking-widest">Scale Your Coaching</h3>
            </div>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Unlock automated parent WhatsApp alerts, deep fee analytics, and massive storage for study materials with the Max Plan.
            </p>
          </div>
          <div className="mt-8">
            <Link href="/dashboard/billing" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              Upgrade Subscription <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}