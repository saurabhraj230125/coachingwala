"use client";

import { useState } from "react";
import { publishExamAction } from "./actions"; // <--- Add this import!
import { 
  Trophy, Target, AlertTriangle, Send, Search, Plus, FileText, 
  BarChart3, BrainCircuit, CheckCircle2, Loader2, MonitorSmartphone, 
  Settings, UploadCloud, Copy, LayoutList, Eye
} from "lucide-react";
// import { publishExamAction } from "@/app/actions/examActions"; // Uncomment this when running

export default function ExamEngine() {
  const [activeTab, setActiveTab] = useState<'overview' | 'studio' | 'analytics'>('overview');

  // --- STUDIO STATES ---
  const [creationMode, setCreationMode] = useState<'cbt' | 'pdf' | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Digital CBT State
  const [questions, setQuestions] = useState([
    { id: 1, q_text: "", opt_a: "", opt_b: "", opt_c: "", opt_d: "", correct: "A" }
  ]);

  // PDF Watermark State
  const [watermarkConfig, setWatermarkConfig] = useState({
    text: "FUTURE Q ACADEMY", // Using your tech agency name as default!
    address: "DPS Bokaro Sector 4",
    opacity: 30
  });

  // --- MOCK ANALYTICS DATA ---
  const studentResults = [
    { id: "1", rank: 1, name: "Rahul Kumar", roll: "BOK-001", score: 265, percentile: 99.8, parentPhone: "9988776655", trend: "up" },
    { id: "2", rank: 2, name: "Priya Singh", roll: "BOK-002", score: 242, percentile: 97.5, parentPhone: "8877665544", trend: "up" },
    { id: "3", rank: 18, name: "Neha Gupta", roll: "BOK-004", score: 145, percentile: 72.0, parentPhone: "6655443322", trend: "same" },
    { id: "4", rank: 42, name: "Amit Sharma", roll: "BOK-003", score: 68, percentile: 34.5, parentPhone: "7766554433", trend: "down" },
  ];

  // --- HANDLERS ---
  const handleAddQuestion = () => {
    setQuestions([...questions, { id: Date.now(), q_text: "", opt_a: "", opt_b: "", opt_c: "", opt_d: "", correct: "A" }]);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    
    // Simulate Server Action Delay
    setTimeout(() => {
      setIsPublishing(false);
      setActiveTab('overview');
      setCreationMode(null);
      alert("Successfully encrypted and published to Student Portals!");
    }, 2000);

    /* 
    REAL SUBMISSION CODE:
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    formData.append("exam_type", creationMode || "cbt");
    formData.append("questions_data", JSON.stringify(questions));
    await publishExamAction(formData);
    */
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto w-full pb-24 min-h-screen flex flex-col">
      
      {/* GLOBAL HEADER & NAVIGATION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 shrink-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Exam Engine</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Create DPPs, NTA Mock Tests, and track granular performance.</p>
        </div>

        {/* Core Navigation Tabs */}
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl w-full md:w-auto shadow-inner border border-slate-200/50">
          {(['overview', 'studio', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); if(tab !== 'studio') setCreationMode(null); }}
              className={`flex-1 md:flex-none px-6 py-2.5 text-sm font-bold rounded-xl transition-all capitalize ${
                activeTab === tab ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'studio' ? 'Creation Studio' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* ==============================================
          TAB 1: OVERVIEW (The Analytics & Hero Card)
      ============================================== */}
      {activeTab === 'overview' && (
        <div className="animate-in fade-in duration-500 space-y-8">
          {/* HERO CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 border border-slate-800">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="relative z-10 w-full md:w-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/30 backdrop-blur-md flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span> Active Exam
                </span>
                <span className="text-xs font-bold text-slate-400">Class 12 - JEE Target</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">JEE Full Syllabus 04</h2>
              <p className="text-sm font-medium text-slate-400">Published 2 days ago • 145 Students Attempted</p>
            </div>

            <div className="flex items-center gap-8 relative z-10 bg-black/20 p-6 rounded-[2rem] border border-white/5 backdrop-blur-xl w-full md:w-auto">
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Avg Score</p>
                <p className="text-3xl font-black text-white">142<span className="text-lg text-slate-500">/300</span></p>
              </div>
              <div className="h-12 w-px bg-white/10"></div>
              <div>
                <p className="text-[10px] font-extrabold text-amber-400/80 uppercase tracking-widest mb-1.5">Highest</p>
                <p className="text-3xl font-black text-amber-400">265</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => {setActiveTab('studio'); setCreationMode('cbt');}}>
              <MonitorSmartphone className="h-16 w-16 text-indigo-500 mb-4" />
              <h3 className="text-2xl font-black text-slate-900">Create NTA Digital Test</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium max-w-sm">Build a fully interactive CBT (Computer Based Test) with automatic grading and analytics.</p>
            </div>
            <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center hover:border-indigo-200 transition-colors cursor-pointer" onClick={() => {setActiveTab('studio'); setCreationMode('pdf');}}>
              <FileText className="h-16 w-16 text-indigo-500 mb-4" />
              <h3 className="text-2xl font-black text-slate-900">Upload Branded DPP</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium max-w-sm">Upload a PDF practice paper. Our engine will automatically apply your coaching's watermark.</p>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================
          TAB 2: CREATION STUDIO (The Advanced Form)
      ============================================== */}
      {activeTab === 'studio' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Mode Selector (If not selected yet) */}
          {!creationMode && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-24 w-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-6">
                <LayoutList className="h-12 w-12 text-indigo-500" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Choose Exam Format</h2>
              <p className="text-slate-500 font-medium mt-2 mb-8">How would you like to deliver this content to your students?</p>
              <div className="flex gap-4">
                <button onClick={() => setCreationMode('cbt')} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1">Digital CBT Mode</button>
                <button onClick={() => setCreationMode('pdf')} className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-sm hover:border-indigo-300 transition-all shadow-sm hover:-translate-y-1">PDF Upload Mode</button>
              </div>
            </div>
          )}

          {/* CREATION FORM */}
          {creationMode && (
            <form onSubmit={handlePublish} className="space-y-6">
              
              {/* Common Metadata Card */}
              <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="h-6 w-6 text-indigo-600" />
                  <h2 className="text-xl font-black text-slate-900">Exam Metadata</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Exam / DPP Title</label>
                    <input required name="title" type="text" placeholder="e.g. Physics Rotation DPP 01" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Batch</label>
                    <select name="batch_target" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all appearance-none">
                      <option>Class 12 - Target JEE</option>
                      <option>Class 11 - Foundation</option>
                      <option>Class 10 - Boards</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Minutes)</label>
                    <input required name="duration" type="number" defaultValue={60} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all" />
                  </div>
                </div>
              </div>

              {/* MODE: DIGITAL CBT BUILDER */}
              {creationMode === 'cbt' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black text-slate-900">Question Builder</h2>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg">{questions.length} Questions</span>
                  </div>

                  {questions.map((q, index) => (
                    <div key={q.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm group hover:border-indigo-200 transition-colors relative">
                      <div className="absolute -left-3 -top-3 h-10 w-10 bg-slate-900 text-white font-black rounded-xl flex items-center justify-center shadow-lg">
                        Q{index + 1}
                      </div>

                      {/* Spacious Question Input */}
                      <textarea 
                        required
                        placeholder="Type your question here. (e.g. Find the moment of inertia of a solid cylinder...)"
                        value={q.q_text}
                        onChange={(e) => {
                          const newQ = [...questions];
                          newQ[index].q_text = e.target.value;
                          setQuestions(newQ);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 min-h-[120px] font-medium text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none mb-6" 
                      />

                      {/* Luxurious Options Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                          <div 
                            key={opt} 
                            className={`flex items-center border rounded-2xl p-2 transition-all ${
                              q.correct === opt 
                                ? 'bg-emerald-50/50 border-emerald-300 ring-4 ring-emerald-50' 
                                : 'bg-white border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                const newQ = [...questions];
                                newQ[index].correct = opt;
                                setQuestions(newQ);
                              }}
                              className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-black mr-3 transition-colors ${
                                q.correct === opt ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {opt}
                            </button>
                            <input 
                              required
                              placeholder={`Option ${opt}`}
                              value={q[`opt_${opt.toLowerCase()}` as keyof typeof q] as string}
                              onChange={(e) => {
                                const newQ = [...questions];
                                (newQ[index] as any)[`opt_${opt.toLowerCase()}`] = e.target.value;
                                setQuestions(newQ);
                              }}
                              className="flex-1 outline-none font-bold text-sm text-slate-800 bg-transparent py-2 pr-2"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button" 
                    onClick={handleAddQuestion}
                    className="w-full py-6 border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-500 font-black text-sm hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" /> Add Next Question
                  </button>
                </div>
              )}

              {/* MODE: PDF WATERMARK ENGINE */}
              {creationMode === 'pdf' && (
                <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Left: Uploader & Config */}
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 mb-1">Watermark Engine</h2>
                        <p className="text-sm font-medium text-slate-500">Protect your intellectual property automatically.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Overlay Text (Institute Name)</label>
                          <input 
                            type="text" value={watermarkConfig.text} onChange={e => setWatermarkConfig({...watermarkConfig, text: e.target.value})} 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Footer Address</label>
                          <input 
                            type="text" value={watermarkConfig.address} onChange={e => setWatermarkConfig({...watermarkConfig, address: e.target.value})} 
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all" 
                          />
                        </div>
                      </div>

                      <label className="block border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all">
                        <input type="file" accept="application/pdf" className="hidden" />
                        <div className="h-12 w-12 mx-auto bg-white shadow-sm rounded-full flex items-center justify-center mb-4 text-indigo-500">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <h3 className="text-sm font-black text-slate-900">Upload Raw PDF</h3>
                        <p className="text-xs font-bold text-slate-500 mt-1">We will apply the watermark dynamically.</p>
                      </label>
                    </div>

                    {/* Right: Live Preview Engine */}
                    <div className="bg-slate-100 rounded-[2rem] p-6 flex flex-col items-center justify-center border-2 border-slate-200 overflow-hidden relative">
                      <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <Eye className="h-3 w-3" /> Live PDF Preview
                      </div>
                      
                      {/* The Simulated PDF Page */}
                      <div className="w-full max-w-[300px] aspect-[1/1.4] bg-white shadow-2xl relative flex flex-col p-6 overflow-hidden pointer-events-none mt-4">
                        
                        {/* Mock PDF Content */}
                        <div className="w-full h-4 bg-slate-200 rounded mb-4"></div>
                        <div className="w-3/4 h-3 bg-slate-100 rounded mb-8"></div>
                        <div className="w-full h-24 bg-slate-50 border border-slate-100 rounded mb-4"></div>
                        <div className="w-5/6 h-24 bg-slate-50 border border-slate-100 rounded mb-4"></div>

                        {/* THE DYNAMIC WATERMARK */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <span 
                            className="text-4xl md:text-5xl font-black text-slate-900 whitespace-nowrap -rotate-45 select-none"
                            style={{ opacity: watermarkConfig.opacity / 100 }}
                          >
                            {watermarkConfig.text || "WATERMARK"}
                          </span>
                        </div>

                        {/* Footer Watermark */}
                        <div className="absolute bottom-4 left-0 w-full text-center z-10" style={{ opacity: (watermarkConfig.opacity / 100) + 0.2 }}>
                          <span className="text-[8px] font-black text-slate-900 tracking-widest uppercase">
                            {watermarkConfig.address}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Publish Action Bar */}
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-4 z-50">
                <button type="button" onClick={() => setCreationMode(null)} className="px-6 py-3 text-white/70 hover:text-white font-bold text-sm transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isPublishing}
                  className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2 disabled:opacity-50"
                >
                  {isPublishing ? <><Loader2 className="h-4 w-4 animate-spin"/> Encrypting & Publishing...</> : <><Send className="h-4 w-4"/> Publish to Student Portal</>}
                </button>
              </div>

            </form>
          )}
        </div>
      )}

      {/* ==============================================
          TAB 3: ANALYTICS & RESULTS
      ============================================== */}
      {activeTab === 'analytics' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden flex flex-col relative">
            
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-black text-slate-900">Student Performance Ledger</h2>
                <p className="text-xs font-bold text-slate-500 mt-1">Track individual growth across the latest tests.</p>
              </div>
              <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm w-full md:w-64">
                <Search className="h-4 w-4 text-slate-400" />
                <input type="text" placeholder="Search roll number..." className="bg-transparent border-none outline-none text-sm font-medium w-full" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Raw Score</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Percentile</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Analytics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentResults.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black ${
                          student.rank === 1 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          student.rank === 2 ? 'bg-slate-200 text-slate-700 border border-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          #{student.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{student.name}</p>
                        <p className="text-xs text-slate-500 font-medium">{student.roll}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-black ${student.score < 100 ? 'text-red-600' : 'text-slate-900'}`}>{student.score}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                          {student.percentile} %ile
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 font-bold text-xs rounded-xl transition-all">
                          <BarChart3 className="h-4 w-4" /> Deep Dive
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}