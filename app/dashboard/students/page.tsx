"use client";

import { useState } from "react";
import { Zap, Target, BookOpen, Clock, ChevronRight, Download, Trophy, TrendingUp, Calendar, ArrowRight, BrainCircuit, PlayCircle } from "lucide-react";

// Mock Architecture for the Student View
const studentData = {
  name: "Saurabh Raj",
  institute: "FutureQ Academy",
  batch: "Class 12 - Target JEE 2027",
  school: "DPS Bokaro",
  attendance: 92,
  streak: 14,
  rank: 3,
};

const upcomingClasses = [
  { id: 1, subject: "Physics", topic: "Rotational Mechanics - Part 3", time: "Today, 5:00 PM", type: "Offline", room: "Hall A" },
  { id: 2, subject: "Math", topic: "Integral Calculus DPP Discussion", time: "Today, 7:30 PM", type: "Live", url: "#" },
];

const recentMaterials = [
  { id: 1, title: "JEE Advanced 2025 PYQs", subject: "Physics", size: "2.4 MB" },
  { id: 2, title: "Reaction Mechanism Flowchart", subject: "Chemistry", size: "1.1 MB" },
];

export default function StudentPortal() {
  const [focusMode, setFocusMode] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // Micro UX: Simulate a secure PDF download
  const handleDownload = (id: number) => {
    setDownloadingId(id);
    setTimeout(() => setDownloadingId(null), 1500);
  };

  return (
    <div className={`min-h-[100dvh] transition-colors duration-500 selection:bg-indigo-500/30 ${
      focusMode ? "bg-slate-950 text-slate-300" : "bg-[#f4f7fb] text-slate-900"
    }`}>
      
      {/* TOP NAVIGATION */}
      <nav className={`px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-500 ${
        focusMode ? "bg-slate-950/80 border-slate-800" : "bg-[#f4f7fb]/80 border-slate-200/60"
      }`}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
            FQ
          </div>
          <div>
            <h1 className={`font-black text-lg leading-tight transition-colors ${focusMode ? "text-white" : "text-slate-900"}`}>
              {studentData.institute}
            </h1>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">{studentData.batch}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* FOCUS MODE TOGGLE */}
          <button 
            onClick={() => setFocusMode(!focusMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all active:scale-95 ${
              focusMode 
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                : "bg-white text-slate-600 border border-slate-200 shadow-sm hover:bg-slate-50"
            }`}
          >
            <BrainCircuit className="h-4 w-4" />
            {focusMode ? "Focus Mode Active" : "Enter Focus Mode"}
          </button>
          
          <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-black border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform">
            {studentData.name.charAt(0)}
          </div>
        </div>
      </nav>

      {/* MAIN PORTAL CONTENT */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* LEFT COLUMN: The Primary Feed (Spans 2 columns on Desktop) */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* HERO GREETING */}
          <div className={`p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden transition-colors duration-500 shadow-xl ${
            focusMode 
              ? "bg-slate-900 border border-slate-800 shadow-slate-900/50" 
              : "bg-gradient-to-br from-slate-900 to-indigo-950 shadow-indigo-900/10"
          }`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <p className="text-indigo-300 font-bold text-sm mb-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span> Online & Syncing
                </p>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                  Let's crack it, <br/>{studentData.name.split(' ')[0]}.
                </h2>
                <p className="text-slate-400 font-medium">Your next milestone is JEE Mains Attempt 1.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex items-center gap-4 w-full md:w-auto">
                <div className="h-12 w-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-400/80 uppercase tracking-widest mb-0.5">Current Streak</p>
                  <p className="text-2xl font-black text-white leading-none">{studentData.streak} Days</p>
                </div>
              </div>
            </div>
          </div>

          {/* UPCOMING CLASSES */}
          <div className={`${focusMode ? "opacity-30 pointer-events-none blur-sm" : "opacity-100"} transition-all duration-700`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-black ${focusMode ? "text-slate-400" : "text-slate-900"}`}>Today's Schedule</h3>
              <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center">
                Full Timetable <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingClasses.map((cls) => (
                <div key={cls.id} className={`p-5 rounded-3xl border transition-all hover:shadow-md cursor-pointer group ${
                  focusMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/60"
                }`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                      cls.type === 'Live' 
                        ? 'bg-red-50 text-red-600 border-red-100' 
                        : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      {cls.type === 'Live' ? '🔴 Live Stream' : '🏢 ' + cls.room}
                    </span>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {cls.time}
                    </span>
                  </div>
                  <h4 className={`text-xl font-black mb-1 group-hover:text-indigo-600 transition-colors ${
                    focusMode ? "text-white" : "text-slate-900"
                  }`}>{cls.subject}</h4>
                  <p className="text-sm font-medium text-slate-500">{cls.topic}</p>
                  
                  {cls.type === 'Live' && (
                    <button className="mt-4 w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 group-hover:bg-indigo-600 transition-colors">
                      <PlayCircle className="h-4 w-4" /> Join Class Now
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RECENT STUDY MATERIAL (THE VAULT) */}
          <div className={`${focusMode ? "opacity-30 pointer-events-none blur-sm" : "opacity-100"} transition-all duration-700 delay-100`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-black flex items-center gap-2 ${focusMode ? "text-slate-400" : "text-slate-900"}`}>
                <BookOpen className="h-5 w-5 text-indigo-500" /> New Material
              </h3>
            </div>
            
            <div className={`rounded-3xl border overflow-hidden ${focusMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/60"}`}>
              <div className="divide-y divide-slate-100 (focusMode ? 'divide-slate-800' : '')">
                {recentMaterials.map((file) => (
                  <div key={file.id} className="p-4 flex items-center justify-between hover:bg-slate-50 (focusMode ? 'hover:bg-slate-800' : '') transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${focusMode ? "text-slate-200" : "text-slate-900"}`}>{file.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{file.subject} • {file.size}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDownload(file.id)}
                      className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                        downloadingId === file.id 
                          ? "bg-emerald-100 text-emerald-600" 
                          : "bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600"
                      }`}
                    >
                      {downloadingId === file.id ? <Clock className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>

        {/* RIGHT COLUMN: Stats & Gamification */}
        <div className="space-y-6 md:space-y-8">
          
          {/* EXAM PERFORMANCE WIDGET */}
          <div className={`p-6 rounded-3xl border transition-all ${
            focusMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/60 shadow-sm"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-sm font-black uppercase tracking-widest ${focusMode ? "text-slate-400" : "text-slate-900"}`}>Latest Test</h3>
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
            
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">JEE Mock 04</p>
                <h4 className={`text-4xl font-black ${focusMode ? "text-white" : "text-slate-900"}`}>242<span className="text-lg text-slate-500">/300</span></h4>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest mb-1">Percentile</p>
                <p className="text-xl font-black text-emerald-500">97.5%</p>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-3 border border-slate-100">
              <div className="h-8 w-8 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center font-black text-sm">
                #{studentData.rank}
              </div>
              <p className="text-xs font-bold text-slate-600">You are in the top 5% of the Target 2027 batch.</p>
            </div>
          </div>

          {/* ATTENDANCE WIDGET (SVG Circular Progress) */}
          <div className={`p-6 rounded-3xl border flex flex-col items-center text-center transition-all ${
            focusMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200/60 shadow-sm"
          }`}>
            <h3 className={`text-sm font-black uppercase tracking-widest w-full text-left mb-6 ${focusMode ? "text-slate-400" : "text-slate-900"}`}>Attendance</h3>
            
            <div className="relative h-32 w-32 flex items-center justify-center mb-4">
              {/* Background Circle */}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke={focusMode ? "#1e293b" : "#f1f5f9"} strokeWidth="10" />
                {/* Progress Circle (92%) */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray="283" strokeDashoffset={283 - (283 * studentData.attendance) / 100} strokeLinecap="round" transform="rotate(-90 50 50)" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-3xl font-black ${focusMode ? "text-white" : "text-slate-900"}`}>{studentData.attendance}%</span>
              </div>
            </div>
            
            <p className="text-xs font-bold text-slate-500">You safely meet the 75% criteria. Keep it up!</p>
          </div>

          {/* FEE NUDGE WIDGET (Only shows if there's a pending fee, mocked as true here) */}
          <div className={`${focusMode ? "opacity-0 pointer-events-none hidden" : "block"} transition-opacity duration-300`}>
            <div className="bg-gradient-to-br from-red-50 to-amber-50 border border-red-100 p-6 rounded-3xl">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-red-900 mb-1">Fee Installment Due</h3>
                  <p className="text-xs font-medium text-red-700/80 mb-3">Your July installment of ₹2,500 was due on the 10th.</p>
                  <button className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 hover:bg-red-700 transition-colors">
                    Pay via UPI Now
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}