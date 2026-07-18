import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { 
  Users, CalendarCheck, Wallet, BookOpenCheck, 
  ExternalLink, ArrowRight, ShieldCheck, 
  TrendingUp, Copy, CheckCircle2, Home
} from "lucide-react";
import CopyButton from "./components/CopyButton";

// Force Vercel to load this live, never cache it.
export const dynamic = "force-dynamic";

export default async function FullPotentialDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Safely fetch the institute
  const { data: institute } = await supabase
    .from("institutes")
    .select("*")
    .eq("owner_id", user?.id)
    .single();

  // CRASH-PROOF TELEMETRY FETCHING
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

  // Generate the dynamic student portal URL
  const portalUrl = process.env.NEXT_PUBLIC_SITE_URL 
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/portal` 
    : "http://localhost:3000/portal";

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 w-full pb-24 md:pb-8 selection:bg-indigo-100">
      
      {/* 1. SIMPLE WELCOME HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Home className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-bold text-indigo-600 tracking-wide uppercase">Your Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
            {institute?.name || "Your Coaching Center"}
          </h1>
        </div>
        
        {/* Foolproof Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link href="/dashboard/students" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl shadow-sm transition-all active:scale-95">
            <Users className="h-4 w-4" /> Add Student
          </Link>
          <Link href="/dashboard/attendance" className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95">
            <CalendarCheck className="h-4 w-4" /> Mark Attendance
          </Link>
        </div>
      </div>

      {/* 2. THE STUDENT PORTAL GATEWAY - Redesigned to look like a physical instruction card */}
      <div className="bg-slate-900 rounded-[2rem] p-6 md:p-10 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Soft decorative background element */}
        <div className="absolute -right-20 -top-20 h-64 w-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex-1 w-full text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-200 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-400/20">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Website is Live
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-3">Share the Student Website</h2>
          <p className="text-slate-300 text-sm md:text-base max-w-lg leading-relaxed">
            Give this link to your students. They will use their unique ID and PIN to log in, view study materials, and check their marks.
          </p>
        </div>

        <div className="relative z-10 w-full lg:w-auto bg-white p-5 rounded-2xl flex flex-col gap-4 lg:min-w-[380px] shadow-lg">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Student Login Link</p>
            <div className="bg-slate-50 px-4 py-4 rounded-xl flex items-center justify-between border border-slate-200">
              <code className="text-slate-900 text-sm font-bold truncate mr-4">{portalUrl}</code>
              <ExternalLink className="h-4 w-4 text-slate-400 shrink-0" />
            </div>
          </div>
          
          <CopyButton url={portalUrl} />
        </div>
      </div>

      {/* 3. PLAIN ENGLISH WIDGET GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Students */}
        <Link href="/dashboard/students" className="group block bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Students</p>
          </div>
          <p className="text-4xl font-black text-slate-900">{studentCount}</p>
          <div className="mt-4 text-sm font-bold text-indigo-600 flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Attendance */}
        <Link href="/dashboard/attendance" className="group block bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Registers</p>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">Attendance</p>
          <div className="mt-4 text-sm font-bold text-emerald-600 flex items-center gap-1">
            Manage <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Fees */}
        <Link href="/dashboard/fees" className="group block bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Wallet className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Collections</p>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">Fees & Dues</p>
          <div className="mt-4 text-sm font-bold text-amber-600 flex items-center gap-1">
            Check Status <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Tests */}
        <Link href="/dashboard/exams" className="group block bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-rose-200 transition-all active:scale-[0.98]">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
              <BookOpenCheck className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Exams</p>
          </div>
          <p className="text-4xl font-black text-slate-900">{examCount}</p>
          <div className="mt-4 text-sm font-bold text-rose-600 flex items-center gap-1">
            Upload Marks <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>

      {/* 4. FOOTER: TRUST & UPGRADE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Simple Trust Indicator */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 flex items-center gap-6">
          <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck className="h-8 w-8 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-black text-lg text-slate-900 mb-1">Your Data is 100% Safe</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              All student information, test marks, and attendance records are automatically saved and securely locked. Only you and your students can see this information.
            </p>
          </div>
        </div>

        {/* Clear Upgrade Card */}
        <Link href="/dashboard/billing" className="group bg-slate-900 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between hover:bg-slate-800 transition-colors">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <TrendingUp className="h-4 w-4" /> Grow Faster
            </div>
            <h3 className="font-black text-white text-lg mb-2">Want automatic WhatsApp messages?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upgrade to the Max Plan to send automatic fee reminders and marks directly to parents on WhatsApp.
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between w-full text-white font-bold text-sm">
            <span className="underline decoration-slate-500 underline-offset-4">See Pricing</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>
    </div>
  );
}