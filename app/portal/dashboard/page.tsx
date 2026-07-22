import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { logoutStudent } from "../actions";
import { LogOut, BookOpen, FileText, TrendingUp, Calendar as CalIcon, Folder, ArrowRight, Download } from "lucide-react";

export const dynamic = "force-dynamic";

// Helper to format bytes to MB/KB for the new file_size column
const formatSize = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 KB';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default async function StudentDashboard() {
  const cookieStore = await cookies(); 
  
  const studentId = cookieStore.get("student_id")?.value;
  const batchName = cookieStore.get("student_batch")?.value || "General Batch";
  const instituteId = cookieStore.get("institute_id")?.value;

  // Security Gatekeeper
  if (!studentId || !instituteId) {
    redirect("/portal");
  }

  // Bypassing RLS safely using Service Role ONLY for reading their specific data
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Fetch the student's personal details
  const { data: student } = await supabase
    .from("students")
    .select("name, full_name")
    .eq("id", studentId)
    .single();

  const studentName = student?.name || student?.full_name || "Student";

  // 2. 🔥 DEEP FIX: Fetch materials using the NEW architecture (file_url, file_size)
  // We fetch the 4 most recently uploaded files across the institute for quick access
  const { data: materials } = await supabase
    .from("study_materials")
    .select("id, title, file_url, file_size, created_at, study_folders(name)")
    .eq("institute_id", instituteId)
    .order("created_at", { ascending: false })
    .limit(4);

  // 3. Fetch their specific test scores
  const { data: tests } = await supabase
    .from("test_scores")
    .select("*")
    .eq("student_id", studentId)
    .order("test_date", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Navigation - Clean SaaS Look */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="font-black text-slate-900 tracking-tight text-lg">Student Portal</span>
        </div>
        
        <form action={logoutStudent}>
          <button type="submit" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors bg-white hover:bg-rose-50 px-4 py-2 rounded-xl border border-slate-200 active:scale-95 shadow-sm">
            Logout <LogOut className="h-4 w-4" />
          </button>
        </form>
      </nav>

      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-8 md:pt-12">
        
        {/* Welcome Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/50 border border-indigo-200/50 mb-4 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">{batchName}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Welcome back, {studentName.split(" ")[0]}!
          </h1>
          <p className="text-slate-500 font-medium mt-2">Here is your academic overview for today.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column: Study Materials */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Folder className="h-5 w-5 text-indigo-500 fill-indigo-100" /> Recently Uploaded Notes
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {materials && materials.length > 0 ? materials.map((doc) => (
                  <a 
                    key={doc.id} 
                    href={doc.file_url} // Fixed to match new database schema
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex flex-col justify-between p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-500/5 transition-all group"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-colors">
                        <FileText className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-indigo-700 transition-colors">{doc.title}</p>
                        {/* Safely display the folder name if we joined it correctly */}
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1.5">
                          {Array.isArray(doc.study_folders) ? doc.study_folders[0]?.name : (doc.study_folders as any)?.name || "General"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200/60">
                      <span className="text-xs font-bold text-slate-500">{formatSize(doc.file_size)}</span>
                      <Download className="h-4 w-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </a>
                )) : (
                  <div className="col-span-1 sm:col-span-2 text-center py-10 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-500">No materials uploaded by your institute yet.</p>
                  </div>
                )}
              </div>

              {materials && materials.length > 0 && (
                <button className="w-full mt-6 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2">
                  Browse All Folders <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Column: Performance & Attendance */}
          <div className="space-y-6">
            
            {/* Quick Attendance Stat */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 p-4 opacity-10 rotate-12">
                <CalIcon className="h-32 w-32" />
              </div>
              <h2 className="text-lg font-black flex items-center gap-2 mb-1 relative z-10">
                <CalIcon className="h-5 w-5 text-indigo-400" /> Attendance
              </h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4 relative z-10">Current Month</p>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-5xl font-black tracking-tighter">--</span> 
                <span className="text-sm text-slate-400 font-bold mb-1">Days Present</span>
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-5">
                <TrendingUp className="h-5 w-5 text-emerald-500" /> Recent Test Scores
              </h2>
              <div className="space-y-3">
                {tests && tests.length > 0 ? tests.map((test) => {
                  // Calculate percentage to color-code the score
                  const percentage = (test.score / test.total_marks) * 100;
                  const scoreColor = percentage >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : 
                                     percentage >= 50 ? "text-amber-600 bg-amber-50 border-amber-100" : 
                                     "text-rose-600 bg-rose-50 border-rose-100";

                  return (
                    <div key={test.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm hover:border-slate-300 transition-colors">
                      <div className="flex flex-col max-w-[60%]">
                        <span className="text-sm font-bold text-slate-800 truncate">{test.test_name}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                          {new Date(test.test_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div className={`px-3 py-1.5 rounded-xl border ${scoreColor} shadow-sm flex flex-col items-center justify-center shrink-0`}>
                        <span className="text-sm font-black leading-none">{test.score}</span>
                        <span className="text-[9px] font-black opacity-60 uppercase tracking-widest mt-0.5 border-t border-current/20 pt-0.5 w-full text-center">/{test.total_marks}</span>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <p className="text-xs font-bold text-slate-400">No mock tests recorded yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}