"use client";

import { X, PhoneCall, MessageCircle, Copy, TrendingUp, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

// The shape of our student data
type Student = {
  id: string;
  name: string;
  rollNumber: string;
  phone: string;
  parentPhone: string;
  batch: string;
  status: string;
  attendancePct: number;
};

export default function StudentSlideOut({ 
  student, 
  isOpen, 
  onClose 
}: { 
  student: Student | null, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [copied, setCopied] = useState<string | null>(null);
  
  // Prevent background scrolling when the sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  if (!student) return null;

  // Micro UX: Copy to clipboard with instant visual feedback
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      {/* BACKGROUND OVERLAY - Blurs the table behind it */}
      <div 
        className={`fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* THE SLIDE-OUT PANEL */}
      <div className={`fixed top-0 right-0 h-[100dvh] w-full md:w-[480px] bg-white shadow-2xl z-[110] transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* HEADER SECTION */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/80">
          <div className="flex gap-4 items-center">
            {/* Apple-style Avatar */}
            <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-inner shadow-white/20">
              {student.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{student.name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm">
                  {student.rollNumber}
                </span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md flex items-center gap-1 border shadow-sm ${
                  student.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span> 
                  {student.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
          
          {/* MICRO UX: Action Bar */}
          <div className="grid grid-cols-2 gap-3">
            <a href={`https://wa.me/91${student.parentPhone}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95">
              <MessageCircle className="h-4 w-4" /> WhatsApp Parent
            </a>
            <a href={`tel:+91${student.parentPhone}`} className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95">
              <PhoneCall className="h-4 w-4" /> Call Parent
            </a>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-200/60 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Attendance</p>
              <p className="text-3xl font-black text-slate-900 flex items-center gap-2">
                {student.attendancePct}% <TrendingUp className={`h-5 w-5 ${student.attendancePct >= 75 ? 'text-emerald-500' : 'text-amber-500'}`} />
              </p>
            </div>
            <div className="border border-slate-200/60 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Current Batch</p>
              <p className="text-sm font-bold text-slate-900 leading-tight">{student.batch}</p>
            </div>
          </div>

          {/* CONTACT INFO CARD */}
          <div className="border border-slate-200/60 rounded-2xl p-6 bg-white shadow-sm space-y-5">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3">Contact Details</h3>
            
            <div className="flex justify-between items-center group">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Student Phone</p>
                <p className="text-sm font-bold text-slate-700">{student.phone}</p>
              </div>
              <button onClick={() => handleCopy(student.phone, 'student')} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-95 bg-slate-50 border border-slate-100 group-hover:border-indigo-100">
                {copied === 'student' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex justify-between items-center group">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Parent Phone</p>
                <p className="text-sm font-bold text-slate-700">{student.parentPhone}</p>
              </div>
              <button onClick={() => handleCopy(student.parentPhone, 'parent')} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-95 bg-slate-50 border border-slate-100 group-hover:border-indigo-100">
                {copied === 'parent' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}