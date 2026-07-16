import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { 
  Users, Calendar, Award, Target, Sparkles, Wallet, TrendingUp, ChevronRight
} from "lucide-react";

export default async function FullPotentialDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: institute } = await supabase.from("institutes").select("*").eq("owner_id", user?.id).single();
  const { count: studentCount } = await supabase.from("students").select("*", { count: 'exact', head: true }).eq("institute_id", institute?.id);
  const { count: examCount } = await supabase.from("exams").select("*", { count: 'exact', head: true }).eq("institute_id", institute?.id);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 w-full">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-2">
            Dashboard Overview <Sparkles className="h-6 w-6 text-indigo-500" />
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            System Node: <span className="text-slate-700 font-bold">{institute?.name || "Workspace"}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/students" className="px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all">
            + Add Student
          </Link>
          <Link href="/dashboard/attendance" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 transition-all">
            Mark Attendance
          </Link>
        </div>
      </div>

      {/* METRIC TRACKING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Roster Card */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Active Roster</p>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Users className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-black mt-4 text-slate-900 relative z-10">{studentCount || 0}</p>
          <Link href="/dashboard/students" className="mt-4 flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 relative z-10">
            View Database <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Attendance Card */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Daily Yield</p>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Calendar className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-black mt-4 text-slate-900">94.2%</p>
          <Link href="/dashboard/attendance" className="mt-4 flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700">
            Log Registers <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* NEW: Financial/Fee Card */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Fees Collected</p>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Wallet className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-black mt-4 text-slate-900">₹0 <span className="text-sm font-bold text-slate-300">/mo</span></p>
          <Link href="/dashboard/fees" className="mt-4 flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700">
            Unlock Pro Tools <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Exam Card */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">DPPs Live</p>
            <div className="p-2 bg-violet-50 rounded-lg text-violet-600"><Award className="h-4 w-4" /></div>
          </div>
          <p className="text-3xl font-black mt-4 text-slate-900">{examCount || 0}</p>
          <Link href="/dashboard/exams" className="mt-4 flex items-center gap-1 text-[11px] font-bold text-violet-600 hover:text-violet-700">
            Access Engine <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

      </div>

      {/* QUICK ACTIONS & GROWTH CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Batch Target Segmentation */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-indigo-600" />
            <h3 className="font-extrabold text-base text-slate-900">Active Batch Telemetry</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Class 11/12 Foundation</h4>
                <p className="text-xs text-slate-500 mt-0.5">Standard batch tracking</p>
              </div>
              <span className="bg-white border border-slate-200 text-slate-700 text-xs font-black px-3 py-1.5 rounded-lg shadow-sm">
                Active
              </span>
            </div>
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">JEE/NEET Droppers <span className="bg-indigo-600 text-white text-[9px] uppercase px-1.5 py-0.5 rounded">High Vol</span></h4>
                <p className="text-xs text-slate-500 mt-0.5">Advanced DPP tracking enabled</p>
              </div>
              <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-md shadow-indigo-200">
                Optimized
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Projection Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <TrendingUp className="h-5 w-5" />
              <h3 className="font-extrabold text-sm uppercase tracking-widest">Growth Engine</h3>
            </div>
            <p className="text-slate-400 text-sm font-medium">Activate Fee Management to generate automated financial reports and SMS due alerts.</p>
          </div>
          <div className="mt-8">
            <Link href="/dashboard/billing" className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
              Upgrade to Pro <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}