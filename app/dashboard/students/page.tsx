import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Search, UserPlus, Users, Phone, FolderOpen, ShieldAlert } from "lucide-react";

// Server Action directly embedded to keep execution dead simple
async function addStudentAction(formData: FormData) {
  "use server";
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const batch = formData.get("batch") as string;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Fetch the owner's active tenant token
  const { data: institute } = await supabase
    .from("institutes")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (institute) {
    await supabase.from("students").insert({
      institute_id: institute.id,
      name,
      parent_phone: phone,
      batch_name: batch
    });
    
    // Instantly refreshes the server component UI matrix
    revalidatePath("/dashboard/students");
  }
}

export default async function RealStudentManager() {
  const supabase = await createClient();
  
  // Pull dynamic student logs managed through the tenant firewall
  const { data: students } = await supabase
    .from("students")
    .select("*")
    .order("name", { ascending: true });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full bg-[#f8fafc] min-h-screen text-slate-900">
      
      {/* MANAGEMENT HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Workspace</h1>
          <p className="text-sm text-slate-500 mt-1">Manage active enrollment profiles and monitor registration batches.</p>
        </div>
      </div>

      {/* CORE DISPLAY MATRIX GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT TWO COLUMNS: ROSTER GRID VIEWS */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" /> Active Roster ({students?.length || 0})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {students?.map((student) => (
              <div key={student.id} className="bg-white border border-slate-200 hover:border-indigo-100 rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{student.name}</h3>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50/60 px-2 py-0.5 rounded-md mt-1">
                        <FolderOpen className="h-3 w-3" /> {student.batch_name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5 font-mono text-slate-700">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> {student.parent_phone}
                  </span>
                </div>
              </div>
            ))}

            {(!students || students.length === 0) && (
              <div className="col-span-full py-16 text-center bg-white border border-slate-200 border-dashed rounded-2xl">
                <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-slate-800 font-bold">No Records Logged</h3>
                <p className="text-sm text-slate-400 mt-1">Use the quick registration console to enroll your first student profile.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: QUICK REGISTRATION SIDE CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-6">
          <h2 className="text-base font-extrabold text-slate-900 mb-2">Enroll New Student</h2>
          <p className="text-xs text-slate-500 mb-6">Instantly inject a verified student entry straight into your live secure database shard.</p>

          <form action={addStudentAction} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Student Full Name</label>
              <input name="name" required placeholder="e.g. Saurabh Raj" className="w-full bg-slate-50 border border-slate-200 text-sm text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Parent WhatsApp (Alert Line)</label>
              <input name="phone" type="tel" required placeholder="e.g. +91 98765 43210" className="w-full bg-slate-50 border border-slate-200 text-sm text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-mono" />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Assign Execution Batch</label>
              <select name="batch" className="w-full bg-slate-50 border border-slate-200 text-sm text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all">
                <option value="Class 11 PCM">Class 11 PCM</option>
                <option value="Class 12 JEE">Class 12 JEE</option>
                <option value="Droppers Batch">Droppers Batch</option>
              </select>
            </div>

            <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md shadow-indigo-100 text-sm transition-all flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" /> Save Record
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}