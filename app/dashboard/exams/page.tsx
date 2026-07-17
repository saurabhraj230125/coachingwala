"use client";

import { useState } from "react";
import { Trophy, Target, AlertTriangle, Send, Search, Plus, FileText, ChevronRight, BarChart3, BrainCircuit, CheckCircle2, Loader2 } from "lucide-react";

// Mock Architecture for the latest NTA-style test
const latestTest = {
  name: "JEE Mains Full Syllabus Mock - 04",
  date: "15 Jul 2026",
  batch: "Class 12 - Target JEE",
  totalMarks: 300,
  highest: 265,
  average: 142,
  attendance: "95%",
};

const topicAnalysis = [
  { topic: "Rotational Mechanics (Physics)", accuracy: 32, status: "Critical" },
  { topic: "Integral Calculus (Math)", accuracy: 45, status: "Warning" },
  { topic: "Coordination Compounds (Chem)", accuracy: 78, status: "Strong" },
  { topic: "Thermodynamics (Physics)", accuracy: 82, status: "Strong" },
];

const studentResults = [
  { id: "1", rank: 1, name: "Rahul Kumar", roll: "BOK-001", score: 265, percentile: 99.8, parentPhone: "9988776655", trend: "up" },
  { id: "2", rank: 2, name: "Priya Singh", roll: "BOK-002", score: 242, percentile: 97.5, parentPhone: "8877665544", trend: "up" },
  { id: "3", rank: 18, name: "Neha Gupta", roll: "BOK-004", score: 145, percentile: 72.0, parentPhone: "6655443322", trend: "same" },
  { id: "4", rank: 42, name: "Amit Sharma", roll: "BOK-003", score: 68, percentile: 34.5, parentPhone: "7766554433", trend: "down" }, // At risk
];

export default function ExamsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const filteredResults = studentResults.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Micro UX: Global Broadcast Simulation
  const handleBroadcastResults = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 4000);
    }, 2000);
  };

  // Micro UX: Individual WhatsApp Report
  const sendIndividualReport = (student: any) => {
    const message = `*Test Result Alert: ${latestTest.name}* \n\nDear Parent, ${student.name} scored ${student.score}/${latestTest.totalMarks} (Rank: ${student.rank}). \nPercentile: ${student.percentile}%. \n\nView detailed analysis here: [Link]`;
    window.open(`https://wa.me/91${student.parentPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24 md:pb-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Exam Engine</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">NTA-Level analysis and automated parent reporting.</p>
        </div>
        <button className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
          <Plus className="h-4 w-4" /> Create NTA Test
        </button>
      </div>

      {/* LATEST TEST HIGHLIGHT (THE HERO CARD) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl shadow-slate-900/10 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 bg-white/10 text-indigo-200 text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/10 backdrop-blur-md">
              Latest Result
            </span>
            <span className="text-xs font-bold text-slate-400">{latestTest.date}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{latestTest.name}</h2>
          <p className="text-sm font-medium text-slate-400 mt-1">{latestTest.batch} • NTA Pattern • Total Marks: {latestTest.totalMarks}</p>
        </div>

        <div className="flex items-center gap-6 relative z-10 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md w-full md:w-auto">
          <div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Avg Score</p>
            <p className="text-2xl font-black text-white">{latestTest.average}</p>
          </div>
          <div className="h-10 w-px bg-white/10"></div>
          <div>
            <p className="text-[10px] font-extrabold text-amber-400/80 uppercase tracking-widest mb-1">Highest</p>
            <p className="text-2xl font-black text-amber-400">{latestTest.highest}</p>
          </div>
        </div>
      </div>

      {/* THE AI INTELLIGENCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Topic Analysis (Width: 2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-black text-slate-900">Topic-wise Accuracy</h3>
          </div>
          
          <div className="space-y-5">
            {topicAnalysis.map((topic, i) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-sm font-bold text-slate-700">{topic.topic}</p>
                  <p className={`text-xs font-black ${
                    topic.accuracy < 40 ? 'text-red-500' : topic.accuracy < 70 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>{topic.accuracy}%</p>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      topic.accuracy < 40 ? 'bg-red-500' : topic.accuracy < 70 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`} 
                    style={{ width: `${topic.accuracy}%` }}
                  />
                </div>
                {topic.accuracy < 40 && (
                  <p className="text-[10px] font-bold text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" /> Teacher action required: Re-schedule doubt class.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Action Alerts (Width: 1 col) */}
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-black text-slate-900">AI Insights</h3>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm">
              <p className="text-xs font-bold text-slate-900 mb-1">⚠️ At-Risk Student Detected</p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                <span className="font-bold">Amit Sharma's</span> score dropped by 45% compared to Mock 03. Highly recommend scheduling a parent meeting.
              </p>
              <button className="mt-3 text-[10px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-700">View Timeline &rarr;</button>
            </div>
            
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
              <p className="text-xs font-bold text-slate-900 mb-1">🏆 Breakout Performer</p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                <span className="font-bold">Rahul Kumar</span> improved accuracy in Chemistry by 22%.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LEADERBOARD & RESULTS TABLE */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Header & Actions */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3 w-full md:w-auto bg-white px-3 py-2 rounded-xl border border-slate-200">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none w-full md:w-48"
            />
          </div>

          <button 
            onClick={handleBroadcastResults}
            disabled={isSending || sentSuccess}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-100 ${
              sentSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isSending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Broadcasting...</>
            ) : sentSuccess ? (
              <><CheckCircle2 className="h-4 w-4" /> Reports Sent</>
            ) : (
              <><Send className="h-4 w-4" /> Broadcast All to Parents</>
            )}
          </button>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Rank</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Student</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Score</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Percentile</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Report Card</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredResults.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black ${
                      student.rank === 1 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      student.rank === 2 ? 'bg-slate-200 text-slate-700 border border-slate-300' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      #{student.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{student.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{student.roll}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-black ${student.score < 100 ? 'text-red-600' : 'text-slate-900'}`}>
                      {student.score}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/{latestTest.totalMarks}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                      {student.percentile} %ile
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => sendIndividualReport(student)}
                      className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-[#25D366]/10 hover:text-[#128C7E] font-bold text-xs rounded-lg transition-all active:scale-95"
                    >
                      <Send className="h-3 w-3" /> WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}