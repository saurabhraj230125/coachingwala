"use client";

import { useState, useMemo } from "react";
import { Users, Calendar, CheckCircle2, XCircle, Save, Loader2, AlertCircle, BellRing } from "lucide-react";

// Dummy architecture for Batches and Students
const batches = ["Class 12 - Target JEE", "Class 11 - Foundation", "Class 10 - Boards"];

const mockStudents = [
  { id: "1", name: "Rahul Kumar", roll: "BOK-001", batch: "Class 12 - Target JEE" },
  { id: "2", name: "Priya Singh", roll: "BOK-002", batch: "Class 12 - Target JEE" },
  { id: "3", name: "Amit Sharma", roll: "BOK-003", batch: "Class 12 - Target JEE" },
  { id: "4", name: "Neha Gupta", roll: "BOK-004", batch: "Class 12 - Target JEE" },
  { id: "5", name: "Vikas Verma", roll: "BOK-005", batch: "Class 12 - Target JEE" },
  { id: "6", name: "Anjali Das", roll: "BOK-006", batch: "Class 12 - Target JEE" },
];

export default function AttendancePage() {
  const [selectedBatch, setSelectedBatch] = useState<string>("Class 12 - Target JEE");
  const [date, setDate] = useState<string>("2026-07-17"); // Defaulting to today
  
  // Attendance State: Record<studentId, 'Present' | 'Absent'>
  const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent'>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter students by selected batch
  const currentStudents = useMemo(() => {
    return mockStudents.filter(s => s.batch === selectedBatch);
  }, [selectedBatch]);

  // Initialize all students as "Present" when batch changes, if not already set
  useMemo(() => {
    const initialState: Record<string, 'Present' | 'Absent'> = {};
    currentStudents.forEach(student => {
      initialState[student.id] = 'Present'; // Smart Default
    });
    setAttendance(initialState);
    setIsSuccess(false);
  }, [currentStudents]);

  // 1-Click Toggle Logic
  const toggleAttendance = (studentId: string) => {
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

  const handleSave = () => {
    setIsSaving(true);
    // Simulate database save and parent SMS trigger
    setTimeout(() => {
      setIsSaving(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-32 md:pb-32 relative min-h-screen">
      
      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Rapid Attendance</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Tap a student to mark them absent. Everyone else is present.</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          {/* Date Picker */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <Calendar className="h-4 w-4 text-slate-400 mr-2" />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 outline-none w-full sm:w-auto"
            />
          </div>
          
          {/* Batch Selector */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
            <Users className="h-4 w-4 text-slate-400 mr-2" />
            <select 
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 outline-none w-full sm:w-auto appearance-none cursor-pointer pr-4"
            >
              {batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* THE 1-CLICK GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {currentStudents.map((student) => {
          const isPresent = attendance[student.id] === 'Present';
          
          return (
            <div 
              key={student.id}
              onClick={() => toggleAttendance(student.id)}
              className={`relative cursor-pointer rounded-2xl p-4 transition-all duration-200 active:scale-95 border-2 select-none flex flex-col items-center text-center ${
                isPresent 
                  ? 'bg-white border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-md' 
                  : 'bg-red-50 border-red-500 shadow-lg shadow-red-500/20 scale-[0.98]'
              }`}
            >
              {/* Status Icon Indicator */}
              <div className="absolute top-3 right-3">
                {isPresent ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 opacity-50" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 fill-red-100" />
                )}
              </div>

              {/* Avatar */}
              <div className={`h-14 w-14 rounded-full flex items-center justify-center text-lg font-black mb-3 transition-colors ${
                isPresent ? 'bg-slate-100 text-slate-600' : 'bg-red-200 text-red-700'
              }`}>
                {student.name.charAt(0)}
              </div>
              
              {/* Details */}
              <h3 className={`text-sm font-black transition-colors ${isPresent ? 'text-slate-900' : 'text-red-900'}`}>
                {student.name}
              </h3>
              <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 transition-colors ${isPresent ? 'text-slate-400' : 'text-red-500'}`}>
                {student.roll}
              </p>
            </div>
          );
        })}
      </div>

      {/* STICKY ACTION BAR */}
      <div className="fixed bottom-6 left-0 right-0 px-4 md:px-8 z-50 pointer-events-none flex justify-center">
        <div className="pointer-events-auto w-full max-w-4xl bg-slate-900 rounded-[2rem] p-2 md:p-3 shadow-2xl shadow-slate-900/50 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-8 duration-500">
          
          <div className="flex items-center gap-6 px-4 py-2">
            <div className="text-center md:text-left">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total</p>
              <p className="text-lg font-black text-white">{stats.total}</p>
            </div>
            <div className="h-8 w-px bg-slate-700 hidden md:block"></div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-extrabold text-emerald-500/70 uppercase tracking-widest">Present</p>
              <p className="text-lg font-black text-emerald-400">{stats.present}</p>
            </div>
            <div className="h-8 w-px bg-slate-700 hidden md:block"></div>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-extrabold text-red-500/70 uppercase tracking-widest">Absent</p>
              <p className="text-lg font-black text-red-400">{stats.absent}</p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving || isSuccess}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-90 ${
              isSuccess 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                : stats.absent > 0 
                  ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg shadow-red-500/20'
                  : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
            }`}
          >
            {isSaving ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Saving Data...</>
            ) : isSuccess ? (
              <><CheckCircle2 className="h-5 w-5" /> Saved & Synced</>
            ) : stats.absent > 0 ? (
              <><BellRing className="h-5 w-5" /> Save & Alert {stats.absent} Parents</>
            ) : (
              <><Save className="h-5 w-5" /> Save Perfect Attendance</>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}