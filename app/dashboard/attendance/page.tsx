import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { CalendarCheck, CheckCircle2, XCircle, Users } from "lucide-react";

// SERVER ACTION: Handles the 1-Click logging directly to Supabase
async function logAttendance(formData: FormData) {
  "use server";
  const supabase = await createClient();
  
  const studentId = formData.get("studentId") as string;
  const status = formData.get("status") as string;
  const instituteId = formData.get("instituteId") as string;
  
  // Get today's date in YYYY-MM-DD format based on standard timezone
  const today = new Date().toISOString().split('T')[0];

  // Upsert the record (if they misclick, clicking the other button updates it)
  await supabase.from("attendance_logs").upsert({
    student_id: studentId,
    institute_id: instituteId,
    status: status,
    date: today
  }, { onConflict: 'student_id, date' });

  // Instantly refresh the UI to show the new status
  revalidatePath("/dashboard/attendance");
}

export default async function AttendanceMatrix() {
  const supabase = await createClient();
  
  // 1. Get the current logged-in owner
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 2. Fetch their institute ID
  const { data: institute } = await supabase
    .from("institutes")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!institute) return <div>Workspace not found.</div>;

  const today = new Date().toISOString().split('T')[0];

  // 3. Fetch all students for this institute
  const { data: students } = await supabase
    .from("students")
    .select("*")
    .eq("institute_id", institute.id)
    .order("name", { ascending: true });

  // 4. Fetch today's attendance logs to color-code the buttons
  const { data: logs } = await supabase
    .from("attendance_logs")
    .select("student_id, status")
    .eq("institute_id", institute.id)
    .eq("date", today);

  // Map logs for quick lookup
  const attendanceMap = new Map(logs?.map(log => [log.student_id, log.status]) || []);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto w-full bg-[#f8fafc] min-h-screen text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <CalendarCheck className="h-8 w-8 text-indigo-600" /> 
            Today's Attendance
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
          Total Roster: <span className="text-indigo-600">{students?.length || 0}</span>
        </div>
      </div>

      {/* ATTENDANCE MATRIX */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-6 md:col-span-5">Student Profile</div>
          <div className="col-span-6 md:col-span-3 hidden md:block">Batch</div>
          <div className="col-span-6 md:col-span-4 text-right pr-4">Mark Status</div>
        </div>

        {/* Student Rows */}
        <div className="divide-y divide-slate-100">
          {students?.map((student) => {
            const currentStatus = attendanceMap.get(student.id);

            return (
              <div key={student.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50/50 transition-colors">
                
                {/* Name & Avatar */}
                <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{student.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{student.parent_phone}</p>
                  </div>
                </div>

                {/* Batch Name (Hidden on very small screens) */}
                <div className="col-span-6 md:col-span-3 hidden md:flex items-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                    {student.batch_name}
                  </span>
                </div>

                {/* 1-Click Action Buttons */}
                <div className="col-span-6 md:col-span-4 flex justify-end gap-2">
                  
                  {/* Mark Present Button */}
                  <form action={logAttendance}>
                    <input type="hidden" name="studentId" value={student.id} />
                    <input type="hidden" name="instituteId" value={institute.id} />
                    <input type="hidden" name="status" value="present" />
                    <button 
                      type="submit"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                        currentStatus === 'present' 
                          ? 'bg-green-50 border-green-200 text-green-700 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-green-300 hover:text-green-600'
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" /> Present
                    </button>
                  </form>

                  {/* Mark Absent Button */}
                  <form action={logAttendance}>
                    <input type="hidden" name="studentId" value={student.id} />
                    <input type="hidden" name="instituteId" value={institute.id} />
                    <input type="hidden" name="status" value="absent" />
                    <button 
                      type="submit"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                        currentStatus === 'absent' 
                          ? 'bg-red-50 border-red-200 text-red-700 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-600'
                      }`}
                    >
                      <XCircle className="h-4 w-4" /> Absent
                    </button>
                  </form>

                </div>
              </div>
            );
          })}

          {(!students || students.length === 0) && (
            <div className="py-16 text-center">
              <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-800 font-bold">No Students Enrolled</h3>
              <p className="text-sm text-slate-400 mt-1">Go to the Students tab to add your first student.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}