"use client";

import { 
  X, PhoneCall, MessageCircle, Copy, 
  TrendingUp, CheckCircle2, Key, Send, Smartphone, User, ShieldAlert
} from "lucide-react";
import { useEffect, useState } from "react";

// 🔥 DEEP FIX: Updated to perfectly match your Supabase database schema
export type Student = {
  id: string;
  name?: string;
  full_name?: string;
  phone_number: string;
  parent_phone: string;
  batch_name: string;
  portal_username?: string;
  portal_pin?: string;
  status?: string; // Optional if you add it later
  attendancePct?: number; // Optional if you calculate it later
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

  const studentName = student.name || student.full_name || "Student";
  const initials = studentName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  const status = student.status || "Active";
  const attendance = student.attendancePct || 100; // Fallback for UI if not calculated yet

  // Micro UX: Copy to clipboard with instant visual feedback
  const handleCopy = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // WhatsApp Message Generator
  const copyWhatsAppMessage = () => {
    const baseUrl = window.location.origin;
    const message = `🎓 *Welcome to the Gateway!*\n\nHere are your secure login details for the Student Portal.\n\n🔗 *Portal Link:* ${baseUrl}/portal\n👤 *Gateway ID:* ${student.portal_username}\n🔑 *PIN:* ${student.portal_pin}\n\n_Please keep this safe._`;
    handleCopy(message, 'whatsapp');
  };

  return (
    <>
      {/* BACKGROUND OVERLAY - Blurs the table behind it */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-all duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* THE SLIDE-OUT PANEL (Apple-style spring curve) */}
      <div className={`fixed top-0 right-0 h-[100dvh] w-full md:w-[440px] bg-slate-50 shadow-2xl z-[110] transform transition-transform duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* HEADER SECTION (Cover Photo Style) */}
        <div className="relative pt-12 pb-6 px-6 bg-white border-b border-slate-100 flex flex-col items-center text-center shrink-0">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none"></div>
          
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-slate-50 border border-slate-100 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all active:scale-95 shadow-sm z-10">
            <X className="h-5 w-5" />
          </button>

          {/* Premium Avatar */}
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-500/30 border-4 border-white">
              {initials}
            </div>
            {status === 'Active' && (
              <div className="absolute bottom-1 right-1 h-4 w-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
            )}
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 tracking-tight relative z-10">{studentName}</h2>
          <div className="flex justify-center items-center gap-2 mt-2 relative z-10">
            <span className="bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
              {student.batch_name}
            </span>
          </div>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* MICRO UX: Action Bar */}
          <div className="grid grid-cols-2 gap-3">
            <a href={`https://wa.me/91${student.parent_phone}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border border-[#25D366]/20">
              <MessageCircle className="h-4 w-4" /> Parent WA
            </a>
            <a href={`tel:+91${student.parent_phone}`} className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border border-indigo-100">
              <PhoneCall className="h-4 w-4" /> Call Parent
            </a>
          </div>

          {/* 🔥 THE GATEWAY CREDENTIALS CARD */}
          <div className="bg-slate-900 rounded-2xl p-5 shadow-xl shadow-slate-900/10 relative overflow-hidden group">
            {/* Shimmer effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                  <ShieldAlert className="h-4 w-4 text-emerald-400" /> Gateway Access
                </h3>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-0.5">Student Portal Login</p>
              </div>
              <button 
                onClick={copyWhatsAppMessage}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors border border-white/10"
              >
                {copied === 'whatsapp' ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Send className="h-3.5 w-3.5" />}
                {copied === 'whatsapp' ? 'Copied' : 'Share'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><User className="h-3 w-3"/> Gateway ID</p>
                <p className="text-indigo-300 font-mono font-bold text-sm truncate">{student.portal_username || "Pending"}</p>
              </div>
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Key className="h-3 w-3"/> Secure PIN</p>
                <p className="text-emerald-400 font-mono font-bold text-sm">{student.portal_pin || "Pending"}</p>
              </div>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-200/60 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-center relative overflow-hidden group hover:border-indigo-200 transition-colors">
              <div className="absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="h-16 w-16" />
              </div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
              <p className="text-3xl font-black text-slate-900 flex items-baseline gap-1">
                {attendance}<span className="text-lg text-slate-400">%</span>
              </p>
            </div>
            
            <div className="border border-slate-200/60 rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-center">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Fee Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-sm font-bold text-slate-900">Cleared</p>
              </div>
            </div>
          </div>

          {/* CONTACT INFO CARD */}
          <div className="border border-slate-200/60 rounded-2xl p-1 bg-white shadow-sm">
            <div className="bg-slate-50/50 rounded-[14px] p-4 space-y-4">
              
              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
                    <Smartphone className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Student Phone</p>
                    <p className="text-sm font-bold text-slate-700">{student.phone_number}</p>
                  </div>
                </div>
                <button onClick={() => handleCopy(student.phone_number, 'student')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all active:scale-95 bg-white border border-slate-100 shadow-sm">
                  {copied === 'student' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="h-px w-full bg-slate-200/60"></div>

              <div className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
                    <PhoneCall className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Parent Phone</p>
                    <p className="text-sm font-bold text-slate-700">{student.parent_phone}</p>
                  </div>
                </div>
                <button onClick={() => handleCopy(student.parent_phone, 'parent')} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all active:scale-95 bg-white border border-slate-100 shadow-sm">
                  {copied === 'parent' ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}