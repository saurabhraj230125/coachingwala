import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { 
  Users, CalendarCheck, Wallet, BookOpenCheck, 
  ExternalLink, ArrowRight, ShieldCheck, 
  TrendingUp, LayoutDashboard, Sparkles, Zap
} from "lucide-react";
import CopyButton from "./components/CopyButton";

export const dynamic = "force-dynamic";

export default async function FullPotentialDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: institute } = await supabase
    .from("institutes")
    .select("*")
    .eq("owner_id", user?.id)
    .single();

  let studentCount = 0;
  let examCount = 0;

  if (institute?.id) {
    const { count: sCount, error: sError } = await supabase
      .from("students")
      .select("*", { count: 'exact', head: true })
      .eq("institute_id", institute.id);
    if (!sError) studentCount = sCount || 0;

    const { count: eCount, error: eError } = await supabase
      .from("exams")
      .select("*", { count: 'exact', head: true })
      .eq("institute_id", institute.id);
    if (!eError) examCount = eCount || 0;
  }

  // 🔥 THE CORRECTED PORTAL LINK
  const portalUrl = process.env.NEXT_PUBLIC_STUDENT_PORTAL_URL || "https://student-portal-app-omega.vercel.app";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full pb-24 md:pb-12 bg-slate-50/30 min-h-screen">
      
      {/* 1. PREMIUM ANIMATED HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-100/50 text-indigo-700 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-200/50 shadow-sm">
            <LayoutDashboard className="h-4 w-4" /> Management Console
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-800 to-slate-500 pb-1">
            {institute?.name || "Your Coaching Center"}
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link href="/dashboard/students" className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 transition-all duration-300 active:scale-95">
            <Users className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" /> Add Student
          </Link>
          <Link href="/dashboard/attendance" className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 active:scale-95 overflow-hidden relative">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <CalendarCheck className="h-4 w-4 relative z-10" /> <span className="relative z-10">Mark Attendance</span>
          </Link>
        </div>
      </div>

      {/* 2. THE ULTRA-GATEWAY WIDGET (Deep Dark Mode Glassmorphism) */}
      <div className="relative rounded-[2rem] p-1 overflow-hidden group shadow-2xl shadow-indigo-900/10">
        {/* Deep Animated Gradients */}
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-400/40 transition-colors duration-700"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3 group-hover:bg-emerald-400/30 transition-colors duration-700"></div>
        
        <div className="relative z-10 bg-slate-900/40 backdrop-blur-3xl rounded-[1.85rem] p-8 md:p-10 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden">
          
          <div className="flex-1 w-full text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              Portal is Live
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4 flex items-center justify-center lg:justify-start gap-3">
              Student App Gateway <Sparkles className="h-7 w-7 text-indigo-400 animate-pulse" />
            </h2>
            <p className="text-slate-300 text-base max-w-lg leading-relaxed font-medium">
              Give your students superpowers. Share this dedicated portal link on WhatsApp so they can track attendance, download notes, and view mock test results instantly.
            </p>
          </div>

          <div className="w-full lg:w-auto bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl lg:min-w-[420px] transform hover:scale-[1.02] transition-transform duration-500">
            <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Zap className="h-3 w-3" /> Shareable URL
            </p>
            <div className="bg-white/5 px-4 py-4 rounded-2xl flex items-center justify-between border border-white/10 mb-4 group/link">
              <code className="text-indigo-100 text-sm font-bold truncate mr-4 selection:bg-indigo-500">{portalUrl}</code>
              <a href={portalUrl} target="_blank" rel="noreferrer" className="shrink-0 bg-indigo-500/20 p-2.5 rounded-xl hover:bg-indigo-500 hover:text-white transition-all text-indigo-300 group-hover/link:rotate-12 group-hover/link:scale-110">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <CopyButton url={portalUrl} />
          </div>
        </div>
      </div>

      {/* 3. BENTO METRICS GRID (Animated Cards with Simple Terminology) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "Total Students", value: studentCount, icon: Users, color: "text-indigo-600", hoverIcon: "group-hover:text-indigo-500", bg: "bg-indigo-50", link: "/dashboard/students", borderHover: "hover:border-indigo-300", shadowHover: "hover:shadow-indigo-500/15" },
          { title: "Daily Attendance", value: "Mark Now", icon: CalendarCheck, color: "text-emerald-600", hoverIcon: "group-hover:text-emerald-500", bg: "bg-emerald-50", link: "/dashboard/attendance", borderHover: "hover:border-emerald-300", shadowHover: "hover:shadow-emerald-500/15", badge: "Today" },
          { title: "Fee Collection", value: "View Dues", icon: Wallet, color: "text-amber-600", hoverIcon: "group-hover:text-amber-500", bg: "bg-amber-50", link: "/dashboard/fees", borderHover: "hover:border-amber-300", shadowHover: "hover:shadow-amber-500/15" },
          { title: "Mock Tests", value: examCount, icon: BookOpenCheck, color: "text-rose-600", hoverIcon: "group-hover:text-rose-500", bg: "bg-rose-50", link: "/dashboard/exams", borderHover: "hover:border-rose-300", shadowHover: "hover:shadow-rose-500/15" },
        ].map((item, idx) => (
          <Link key={idx} href={item.link} className={`group flex flex-col justify-between bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-xl ${item.shadowHover} ${item.borderHover} transition-all duration-500 hover:-translate-y-1`}>
            <div className="flex items-start justify-between mb-8">
              <div className={`h-14 w-14 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-inner`}>
                <item.icon className="h-7 w-7" />
              </div>
              {item.badge ? (
                <span className={`text-[10px] font-black ${item.color} ${item.bg} px-2.5 py-1 rounded-md border border-current/10 uppercase tracking-widest`}>
                  {item.badge}
                </span>
              ) : (
                <ArrowRight className="h-5 w-5 text-slate-200 group-hover:text-slate-400 group-hover:translate-x-1.5 transition-all duration-300" />
              )}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-slate-500 transition-colors">{item.title}</p>
              <p className={`text-3xl font-black text-slate-900 tracking-tight ${item.hoverIcon} transition-colors duration-300`}>{item.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 4. FOOTER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
        
        {/* Trust Banner */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm hover:shadow-md transition-shadow group">
          <div className="h-16 w-16 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
            <ShieldCheck className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-black text-lg text-slate-900 mb-2">Military-Grade Data Privacy</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Your student data is strictly isolated. The portal guarantees that no student can ever view another student's test marks, attendance, or personal details.
            </p>
          </div>
        </div>

        {/* Upgrade/Growth Card - Premium "Credit Card" Look */}
        <Link href="/dashboard/billing" className="group relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 overflow-hidden hover:-translate-y-1">
          {/* Shimmer effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 text-amber-400 rounded-full text-xs font-black uppercase tracking-widest mb-5 border border-amber-400/20 group-hover:bg-amber-400/20 transition-colors">
              <TrendingUp className="h-4 w-4" /> Go Pro
            </div>
            <h3 className="font-black text-white text-xl mb-2 leading-snug">Automate WhatsApp Reminders</h3>
          </div>
          <div className="mt-6 flex items-center justify-between w-full text-indigo-300 font-bold text-sm relative z-10">
            <span>View Pricing</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300 text-amber-400" />
          </div>
        </Link>

      </div>
    </div>
  );
}