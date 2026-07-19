import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { logoutStudent } from "../actions";
import { LogOut, BookOpen, FileText, TrendingUp, Calendar as CalIcon } from "lucide-react";

// This forces Next.js to always read the live cookie and never cache the page
export const dynamic = "force-dynamic";

export default async function StudentDashboard() {
  const cookieStore = await cookies(); 
  
  const studentId = cookieStore.get("student_id")?.value;
  const batchName = cookieStore.get("student_batch")?.value || "General Batch";
  const instituteId = cookieStore.get("institute_id")?.value;

  // Security Check: If no cookie is found, kick them back to the portal login
  if (!studentId || !instituteId) {
    redirect("/portal");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch the student's personal details
  const { data: student } = await supabase
    .from("students")
    .select("name, full_name")
    .eq("id", studentId)
    .single();

  const studentName = student?.name || student?.full_name || "Student";

  // Fetch their specific batch materials
  const { data: materials } = await supabase
    .from("study_materials")
    .select("*")
    .eq("institute_id", instituteId)
    .eq("batch_name", batchName)
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch their specific test scores
  const { data: tests } = await supabase
    .from("test_scores")
    .select("*")
    .eq("student_id", studentId)
    .order("test_date", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20">
      
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="font-black text-slate-900 tracking-tight text-lg">Gateway</span>
        </div>
        
        <form action={logoutStudent}>
          <button type="submit" className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 hover:bg-rose-50 px-4 py-2 rounded-lg border border-slate-100">
            Logout <LogOut className="h-4 w-4" />
          </button>
        </form>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-10">
        
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Welcome back, {studentName.split(" ")[0]}!
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-50 border border-indigo-100 mt-3 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">{batchName}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Column: Study Materials */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" /> Recent Materials
                </h2>
              </div>
              
              <div className="space-y-3">
                {materials && materials.length > 0 ? materials.map((doc) => (
                  <a key={doc.id} href={doc.pdf_url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:text-indigo-600 transition-colors">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{doc.title}</p>
                        <p className="text-xs font-medium text-slate-400 mt-0.5">PDF Document</p>
                      </div>
                    </div>
                  </a>
                )) : (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <p className="text-sm font-bold text-slate-400">No materials uploaded for your batch yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column: Performance & Attendance */}
          <div className="space-y-6">
            
            {/* Performance Card */}
            <div className="bg-white border border-slate-200/60 rounded-[2rem] p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-emerald-500" /> Recent Scores
              </h2>
              <div className="space-y-3">
                {tests && tests.length > 0 ? tests.map((test) => (
                  <div key={test.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                    <span className="text-sm font-bold text-slate-700">{test.test_name}</span>
                    <span className="text-sm font-black text-slate-900 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200">
                      {test.score}/{test.total_marks}
                    </span>
                  </div>
                )) : (
                  <p className="text-xs font-bold text-slate-400 text-center py-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">No tests recorded.</p>
                )}
              </div>
            </div>

            {/* Quick Attendance Stat */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <CalIcon className="h-24 w-24" />
              </div>
              <h2 className="text-lg font-black flex items-center gap-2 mb-1 relative z-10">
                <CalIcon className="h-5 w-5 text-indigo-400" /> Attendance
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 relative z-10">This Month</p>
              <div className="flex items-end gap-2 text-4xl font-black relative z-10">
                -- <span className="text-sm text-slate-400 font-bold mb-1">Days Present</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}