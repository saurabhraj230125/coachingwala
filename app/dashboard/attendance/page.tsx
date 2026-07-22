"use client";

import { useState, useMemo, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Users, Calendar, CheckCircle2, XCircle, 
  Save, Loader2, BellRing, ChevronDown, UserX 
} from "lucide-react";

type Student = {
  id: string;
  name?: string;
  full_name?: string;
  portal_username?: string;
  batch_name: string;
};

export default function AttendancePage() {
  const supabase = createClient();
  
  // Data States
  const [instituteId, setInstituteId] = useState<string | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // UI States
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toLocaleDateString('en-CA')); // YYYY-MM-DD
  
  // Attendance State: Record<studentId, 'Present' | 'Absent'>
  const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent'>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. Fetch Students & Extract Batches directly from your Roster
  useEffect(() => {
    async function fetchRoster() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: institute } = await supabase
        .from("institutes")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (institute) {
        setInstituteId(institute.id);
        const { data: roster } = await supabase
          .from("students")
          .select("id, name, full_name, portal_username, batch_name")
          .eq("institute_id", institute.id)
          .order("name", { ascending: true });

        if (roster && roster.length > 0) {
          setAllStudents(roster);
          
          // Dynamically extract unique batch names from the students
          const uniqueBatches = Array.from(new Set(roster.map(s => s.batch_name).filter(Boolean))) as string[];
          setBatches(uniqueBatches);
          
          if (uniqueBatches.length > 0) {
            setSelectedBatch(uniqueBatches[0]); // Auto-select the first batch
          }
        }
      }
      setIsLoadingData(false);
    }
    fetchRoster();
  }, []);

  // 2. Filter students by the currently selected batch
  const currentStudents = useMemo(() => {
    return allStudents.filter(s => s.batch_name === selectedBatch);
  }, [allStudents, selectedBatch]);

  // 3. Smart Default: Auto-mark everyone in the current batch as "Present"
  useEffect(() => {
    const initialState: Record<string, 'Present' | 'Absent'> = {};
    currentStudents.forEach(student => {
      initialState[student.id] = 'Present';
    });
    setAttendance(initialState);
    setIsSuccess(false);
  }, [currentStudents, date]); // Resets if batch or date changes

  // 1-Click Toggle Logic with Haptic Feedback
  const toggleAttendance = (studentId: string) => {
    // Trigger tiny vibration on mobile devices for tactile feedback
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present'
    }));
  };

  const stats = {
    total: currentStudents.length,
    present: Object.values(attendance).filter(v => v === 'Present').length,
    absent: Object.values(attendance).filter(v => v === 'Absent').length,
  };

  // 4. Save to Supabase (Assumes you have an 'attendance' table)
  const handleSave = async () => {
    if (!instituteId || currentStudents.length === 0) return;
    setIsSaving(true);

    // Prepare array of records to insert
    const records = currentStudents.map(student => ({
      institute_id: instituteId,
      student_id: student.id,
      date: date,
      status: attendance[student.id],
      batch_name: selectedBatch
    }));

    // Upsert means it will update if attendance for this date/student already exists
    const { error } = await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'student_id, date' });

    setIsSaving(false);

    if (error) {
      alert(`Error saving attendance: ${error.message}\n\nMake sure you have an 'attendance' table created in Supabase.`);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  if (isLoadingData) {
    return <div className="h-[70vh] flex flex-col items-center justify-center gap-3"><Loader2 className="h-8 w-8 text-indigo-500 animate-spin" /><p className="text-sm font-bold text-slate-400">Loading batches & roster...</p></div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-40 relative min-h-screen">
      
      {/* HEADER & SMART CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Rapid Attendance</h1>
          <p className="text-sm text-slate-500 mt-1.5 font-medium max-w-md leading-relaxed">
            Tap a student to mark them absent. Everyone else defaults to present. Faster than calling roll.
          </p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          {/* Custom Date Picker */}
          <div className="relative group flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all cursor-pointer"
            />
          </div>
          
          {/* Dynamic Batch Selector */}
          <div className="relative group flex-1 sm:flex-none">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Users className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <select 
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition-all appearance-none cursor-pointer"
            >
              {batches.length === 0 && <option value="">No batches found</option>}
              {batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {currentStudents.length === 0 && (
        <div className="py-24 flex flex-col items-center text-center bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
            <UserX className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-black text-slate-900">No students in this batch</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            Go to the Student Roster to add students to "{selectedBatch || "this batch"}".
          </p>
        </div>
      )}

      {/* THE 1-CLICK TACTILE GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {currentStudents.map((student) => {
          const isPresent = attendance[student.id] === 'Present';
          const studentName = student.name || student.full_name || "Unknown";
          const initials = studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
          
          return (
            <div 
              key={student.id}
              onClick={() => toggleAttendance(student.id)}
              className={`relative cursor-pointer rounded-[1.25rem] p-5 transition-all duration-300 select-none flex flex-col items-center text-center group ${
                isPresent 
                  ? 'bg-white border-2 border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-md hover:-translate-y-0.5' 
                  : 'bg-rose-50 border-2 border-rose-500 shadow-lg shadow-rose-500/20 scale-[0.97]'
              }`}
            >
              {/* Status Icon Indicator */}
              <div className="absolute top-3 right-3 transition-transform duration-300">
                {isPresent ? (
                  <CheckCircle2 className="h-5 w-5 text-slate-200 group-hover:text-emerald-400 transition-colors" />
                ) : (
                  <XCircle className="h-6 w-6 text-rose-500 fill-rose-100 animate-in zoom-in duration-200" />
                )}
              </div>

              {/* Avatar */}
              <div className={`h-14 w-14 rounded-full flex items-center justify-center text-lg font-black mb-3 transition-all duration-300 ${
                isPresent 
                  ? 'bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600' 
                  : 'bg-rose-200 text-rose-700 shadow-inner shadow-rose-500/20'
              }`}>
                {initials}
              </div>
              
              {/* Details */}
              <h3 className={`text-sm font-black transition-colors line-clamp-1 ${isPresent ? 'text-slate-900' : 'text-rose-900'}`}>
                {studentName}
              </h3>
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 transition-colors ${isPresent ? 'text-slate-400 group-hover:text-indigo-400' : 'text-rose-500'}`}>
                {student.portal_username || "No ID"}
              </p>
            </div>
          );
        })}
      </div>

      {/* GLASSMORPHIC DYNAMIC ISLAND (Sticky Bottom Bar) */}
      {currentStudents.length > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50 pointer-events-none flex justify-center animate-in slide-in-from-bottom-12 duration-500 fade-in">
          <div className="pointer-events-auto w-full max-w-3xl bg-slate-900/90 backdrop-blur-xl rounded-[2rem] p-2 md:p-2.5 shadow-2xl shadow-slate-900/40 border border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-6 px-6 py-2 w-full md:w-auto justify-between md:justify-start">
              <div className="text-center md:text-left">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total</p>
                <p className="text-xl font-black text-white leading-none mt-0.5">{stats.total}</p>
              </div>
              <div className="h-8 w-px bg-slate-700"></div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-extrabold text-emerald-400/80 uppercase tracking-widest">Present</p>
                <p className="text-xl font-black text-emerald-400 leading-none mt-0.5">{stats.present}</p>
              </div>
              <div className="h-8 w-px bg-slate-700"></div>
              <div className="text-center md:text-left">
                <p className="text-[10px] font-extrabold text-rose-400/80 uppercase tracking-widest">Absent</p>
                <p className="text-xl font-black text-rose-400 leading-none mt-0.5">{stats.absent}</p>
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={isSaving || isSuccess}
              className={`w-full md:w-auto flex items-center justify-center gap-2.5 px-8 py-4 md:py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-90 shrink-0 ${
                isSuccess 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : stats.absent > 0 
                    ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg shadow-rose-500/30'
                    : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
              }`}
            >
              {isSaving ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Saving...</>
              ) : isSuccess ? (
                <><CheckCircle2 className="h-5 w-5" /> Synced to Database</>
              ) : stats.absent > 0 ? (
                <><BellRing className="h-5 w-5" /> Save & Alert {stats.absent} Parents</>
              ) : (
                <><Save className="h-5 w-5" /> Save Perfect Attendance</>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}