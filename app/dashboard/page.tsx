import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { 
  Users, CalendarCheck, Wallet, BookOpenCheck, 
  ExternalLink, ArrowRight, ShieldCheck, 
  TrendingUp, LayoutDashboard, Share2, Plus
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

  const portalUrl = process.env.NEXT_PUBLIC_STUDENT_PORTAL_URL || "https://student-portal-app-omega.vercel.app";

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 w-full pb-24 min-h-screen">
      
      {/* 1. CLEAN HEADER & QUICK ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-2">
        <div>
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Overview</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            {institute?.name || "Your Coaching Center"}
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link href="/dashboard/students" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-sm rounded-xl shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95">
            <Plus className="h-4 w-4 text-slate-400" /> Add Student
          </Link>
          <Link href="/dashboard/attendance" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95">
            <CalendarCheck className="h-4 w-4" /> Mark Attendance
          </Link>
        </div>
      </div>

      {/* 2. MINIMALIST METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Active Students", value: studentCount, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50", link: "/dashboard/students" },
          { title: "Today's Attendance", value: "Mark Now", icon: CalendarCheck, color: "text-emerald-600", bg: "bg-emerald-50", link: "/dashboard/attendance", action: true },
          { title: "Fee Dues", value: "Check", icon: Wallet, color: "text-amber-600", bg: "bg-amber-50", link: "/dashboard/fees", action: true },
          { title: "Mock Tests", value: examCount, icon: BookOpenCheck, color: "text-rose-600", bg: "bg-rose-50", link: "/dashboard/exams" },
        ].map((item, idx) => (
          <Link key={idx} href={item.link} className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`h-10 w-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{item.title}</p>
              <p className={`text-2xl font-black tracking-tight ${item.action ? 'text-slate-400' : 'text-slate-900'}`}>
                {item.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. THE STUDENT PORTAL MANAGER (Clean, highly actionable) */}
      <div className="bg-white border border-indigo-100 rounded-3xl p-1 shadow-sm overflow-hidden">
        <div className="bg-indigo-50/50 rounded-[1.35rem] p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 border border-indigo-50/50">
          
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Portal Live
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Your Student App Gateway
            </h2>
            <p className="text-slate-600 text-sm max-w-lg font-medium leading-relaxed">
              Share this exact link on your WhatsApp groups. Students use their secure PIN to log in, view their attendance, download your notes, and check mock test results.
            </p>
          </div>

          <div className="w-full lg:w-auto bg-white p-5 rounded-2xl border border-slate-200 shadow-sm lg:min-w-[400px]">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Share2 className="h-3.5 w-3.5" /> Portal Link
            </p>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl overflow-hidden">
                <code className="text-slate-800 text-sm font-semibold truncate block w-full select-all">
                  {portalUrl}
                </code>
              </div>
              <a href={portalUrl} target="_blank" rel="noreferrer" className="shrink-0 bg-slate-100 text-slate-600 p-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="Open Portal">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <CopyButton url={portalUrl} />
          </div>
          
        </div>
      </div>

      {/* 4. UTILITY CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Security Assurance */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
          <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Data Isolation Guard</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your data is cryptographically isolated. Students can never access other students' marks or records.
            </p>
          </div>
        </div>

        {/* Growth/Pro */}
        <Link href="/dashboard/billing" className="group bg-slate-900 rounded-2xl p-6 flex items-start justify-between gap-4 shadow-sm hover:shadow-lg transition-all hover:bg-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
              <TrendingUp className="h-3.5 w-3.5" /> Upgrade Available
            </div>
            <h3 className="font-bold text-white mb-1">Automate WhatsApp</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Send automated fee reminders and attendance reports directly to parents.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 mt-1" />
        </Link>

      </div>
    </div>
  );
}