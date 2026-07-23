"use client";

import { useState } from "react";
import { publishExamAction } from "./actions";
import { 
  Plus, CheckCircle2, Loader2, LayoutDashboard, 
  Settings, MonitorSmartphone, Target, Clock, ShieldCheck, 
  Send, ChevronRight, FileText, Activity, AlertTriangle
} from "lucide-react";

type ViewState = 'dashboard' | 'wizard';
type WizardStep = 1 | 2 | 3 | 4 | 5;

export default function ExamEngine() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [isPublishing, setIsPublishing] = useState(false);

  // --- CENTRALIZED FORM STATE ---
  const [basicDetails, setBasicDetails] = useState({
    title: "",
    targetBatch: "Target JEE 2027",
    examType: "cbt"
  });

  const [examConfig, setExamConfig] = useState({
    duration: 180,
    maxMarks: 300,
    shuffleQuestions: true,
    antiTabSwitch: true
  });

  const [questions, setQuestions] = useState([
    { id: 1, q_text: "", opt_a: "", opt_b: "", opt_c: "", opt_d: "", correct: "A" }
  ]);

  // --- ACTION HANDLER ---
  const executePublish = async () => {
    if (!basicDetails.title) {
      alert("Please provide an Exam Title in Step 1.");
      setWizardStep(1);
      return;
    }

    setIsPublishing(true);
    
    try {
      const formData = new FormData();
      formData.append("title", basicDetails.title);
      formData.append("batch_target", basicDetails.targetBatch);
      formData.append("duration", examConfig.duration.toString());
      formData.append("exam_type", basicDetails.examType);
      formData.append("questions_data", JSON.stringify(questions));
      formData.append("config_data", JSON.stringify(examConfig));

      const res = await publishExamAction(formData);

      if (res?.error) {
        alert(res.error);
        return;
      }

      // Reset & Return to Dashboard
      setView('dashboard');
      setWizardStep(1);
      setBasicDetails({ title: "", targetBatch: "Target JEE 2027", examType: "cbt" });
      setQuestions([{ id: 1, q_text: "", opt_a: "", opt_b: "", opt_c: "", opt_d: "", correct: "A" }]);
      alert("Exam successfully deployed!");
      
    } catch (error) {
      alert("Network or Server error. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  // --- SUB-COMPONENTS ---
  const WizardHeader = () => (
    <div className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <button onClick={() => setView('dashboard')} className="text-sm font-black text-slate-400 hover:text-rose-600 transition-colors">
          Exit Studio
        </button>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                wizardStep === s ? 'bg-indigo-600 text-white shadow-md' : 
                wizardStep > s ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                {wizardStep > s ? <CheckCircle2 className="h-4 w-4" /> : s}
              </div>
              {s < 5 && <div className={`h-1 w-8 rounded-full ${wizardStep > s ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button onClick={() => setWizardStep(prev => Math.max(1, prev - 1) as WizardStep)} disabled={wizardStep === 1} className="px-4 py-2 text-sm font-bold text-slate-600 disabled:opacity-30">
          Previous
        </button>
        {wizardStep < 5 ? (
          <button onClick={() => setWizardStep(prev => Math.min(5, prev + 1) as WizardStep)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-md">
            Next Step
          </button>
        ) : (
          <button onClick={executePublish} disabled={isPublishing} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-600/20 flex items-center gap-2">
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Publish Exam
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-200">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-64 bg-slate-900 min-h-screen text-slate-400 flex flex-col shrink-0">
        <div className="p-6 mb-4">
          <div className="h-10 w-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg shadow-indigo-500/20">CQ</div>
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Exam Center</h2>
        </div>
        <div className="flex-1 px-4 space-y-1">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${view === 'dashboard' ? 'bg-indigo-500 text-white shadow-md' : 'hover:bg-slate-800 hover:text-slate-200'}`}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-800 hover:text-slate-200 transition-all">
            <Activity className="h-4 w-4" /> Live Monitoring
          </button>
        </div>
      </div>
      
      {/* MAIN CONTENT AREA */}
      {view === 'dashboard' ? (
        // --- DASHBOARD VIEW ---
        <div className="p-8 flex-1 overflow-y-auto animate-in fade-in duration-500">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Exam Dashboard</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">Manage tests, monitor live activity, and review results.</p>
            </div>
            <button onClick={() => { setView('wizard'); setWizardStep(1); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-xl shadow-indigo-600/20">
              <Plus className="h-5 w-5" /> Create New Examination
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Exams</p>
              <h2 className="text-4xl font-black text-slate-900">84</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Students Attempted</p>
              <h2 className="text-4xl font-black text-slate-900">4,281</h2>
            </div>
            <div className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Average Score</p>
              <h2 className="text-4xl font-black text-slate-900">142<span className="text-xl text-slate-400">/300</span></h2>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-[1.5rem] p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2 flex items-center gap-1"><AlertTriangle className="h-3 w-3"/> Active Alerts</p>
              <h2 className="text-4xl font-black text-rose-700">2</h2>
            </div>
          </div>
        </div>
      ) : (
        // --- CREATION WIZARD VIEW ---
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
          <WizardHeader />
          
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto w-full pb-20">
              
              {/* STEP 1: Basic Details */}
              {wizardStep === 1 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 mb-6">Basic Information</h2>
                  
                  <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Examination Title</label>
                      <input type="text" placeholder="e.g. JEE Mains Full Syllabus 04" value={basicDetails.title} onChange={e => setBasicDetails({...basicDetails, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Target Batch</label>
                        <select value={basicDetails.targetBatch} onChange={e => setBasicDetails({...basicDetails, targetBatch: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer">
                          <option>Target JEE 2027</option>
                          <option>Target NEET 2027</option>
                          <option>Foundation Class 10</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Exam Mode</label>
                        <select value={basicDetails.examType} onChange={e => setBasicDetails({...basicDetails, examType: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none appearance-none cursor-pointer">
                          <option value="cbt">Digital CBT (Computer Based)</option>
                          <option value="pdf">PDF Upload Mode</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Configuration */}
              {wizardStep === 2 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 mb-6">Test Configuration</h2>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
                      <div>
                        <Clock className="h-5 w-5 text-indigo-500 mb-2" />
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Duration (Mins)</p>
                      </div>
                      <input type="number" value={examConfig.duration} onChange={e => setExamConfig({...examConfig, duration: parseInt(e.target.value)})} className="w-24 text-right text-3xl font-black text-slate-900 bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex items-center justify-between">
                      <div>
                        <Target className="h-5 w-5 text-indigo-500 mb-2" />
                        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Max Marks</p>
                      </div>
                      <input type="number" value={examConfig.maxMarks} onChange={e => setExamConfig({...examConfig, maxMarks: parseInt(e.target.value)})} className="w-24 text-right text-3xl font-black text-slate-900 bg-transparent border-b-2 border-slate-200 focus:border-indigo-500 outline-none" />
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-500"/> Security & Integrity Controls</h3>
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                      {[
                        { id: 'shuffleQuestions', label: 'Shuffle Questions per student' },
                        { id: 'antiTabSwitch', label: 'Enable Anti-Tab Switch Warnings' }
                      ].map(setting => (
                        <label key={setting.id} className="flex items-center gap-4 cursor-pointer group">
                          <div className={`w-12 h-7 rounded-full p-1 transition-colors ${examConfig[setting.id as keyof typeof examConfig] ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                            <div className={`bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${examConfig[setting.id as keyof typeof examConfig] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                          </div>
                          <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">{setting.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Question Builder */}
              {wizardStep === 3 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-slate-900">Question Studio</h2>
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100">{questions.length} Questions Drafted</span>
                  </div>

                  {questions.map((q, index) => (
                    <div key={q.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative group hover:border-indigo-300 transition-colors">
                      <div className="absolute -left-4 -top-4 h-12 w-12 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center shadow-lg text-lg">
                        Q{index + 1}
                      </div>

                      <textarea 
                        placeholder="Type question statement here..."
                        value={q.q_text}
                        onChange={(e) => {
                          const newQ = [...questions];
                          newQ[index].q_text = e.target.value;
                          setQuestions(newQ);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 min-h-[140px] text-base font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none transition-all resize-none mb-6" 
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                          <div key={opt} className={`flex items-center border-2 rounded-2xl p-2.5 transition-all ${q.correct === opt ? 'bg-emerald-50/50 border-emerald-400' : 'bg-white border-slate-200 focus-within:border-indigo-400'}`}>
                            <button
                              onClick={() => {
                                const newQ = [...questions];
                                newQ[index].correct = opt;
                                setQuestions(newQ);
                              }}
                              className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-black mr-3 transition-colors ${q.correct === opt ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                              {opt}
                            </button>
                            <input 
                              placeholder={`Option ${opt}`}
                              value={q[`opt_${opt.toLowerCase()}` as keyof typeof q] as string}
                              onChange={(e) => {
                                const newQ = [...questions];
                                (newQ[index] as any)[`opt_${opt.toLowerCase()}`] = e.target.value;
                                setQuestions(newQ);
                              }}
                              className="flex-1 outline-none font-bold text-sm text-slate-800 bg-transparent py-2"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={() => setQuestions([...questions, { id: Date.now(), q_text: "", opt_a: "", opt_b: "", opt_c: "", opt_d: "", correct: "A" }])}
                    className="w-full py-6 border-2 border-dashed border-slate-300 rounded-[2rem] text-slate-500 font-black text-sm hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="h-5 w-5" /> Add New Question
                  </button>
                </div>
              )}

              {/* STEP 4: NTA Preview */}
              {wizardStep === 4 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-500 space-y-6">
                  <h2 className="text-3xl font-black text-slate-900 mb-6 text-center">Student Interface Preview</h2>
                  
                  {/* Highly Accurate NTA Simulator */}
                  <div className="w-full max-w-4xl mx-auto bg-white border border-slate-300 shadow-2xl flex flex-col select-none rounded-xl overflow-hidden">
                    
                    {/* Top Bar */}
                    <div className="bg-[#3b4a54] text-white flex justify-between items-center px-4 py-2.5">
                      <span className="font-bold text-sm truncate">{basicDetails.title || "Advanced Practice Test"}</span>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="bg-white/10 px-3 py-1 rounded text-xs font-mono">Time Left: {examConfig.duration}:00</span>
                        <span className="text-sm font-bold hidden sm:block">Student Name</span>
                      </div>
                    </div>

                    <div className="flex border-b border-slate-200">
                      <div className="px-6 py-2 text-sm text-blue-600 font-bold border-b-2 border-blue-600 bg-blue-50/50">Physics</div>
                    </div>

                    <div className="flex flex-col sm:flex-row h-[500px]">
                      {/* Question Area */}
                      <div className="flex-1 p-6 overflow-y-auto flex flex-col">
                        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200">
                          <span className="font-black text-lg text-slate-800">Question 1</span>
                          <div className="flex gap-4 text-xs font-bold text-slate-500">
                            <span>MCQ</span>
                            <span className="text-emerald-600 text-[10px] border border-emerald-200 px-2 py-0.5 rounded bg-emerald-50">+4</span>
                            <span className="text-rose-500 text-[10px] border border-rose-200 px-2 py-0.5 rounded bg-rose-50">-1</span>
                          </div>
                        </div>
                        <p className="text-base text-slate-900 font-medium mb-8 whitespace-pre-wrap leading-relaxed">
                          {questions[0]?.q_text || "Question statement will appear here."}
                        </p>
                        
                        <div className="space-y-3 mt-auto">
                          {(['A', 'B', 'C', 'D'] as const).map(opt => (
                            <div key={opt} className="flex items-center gap-3 p-3 border border-slate-200 rounded bg-slate-50">
                              <div className="h-4 w-4 rounded-full border border-slate-400 bg-white"></div>
                              <span className="text-sm font-medium text-slate-700">{questions[0]?.[`opt_${opt.toLowerCase()}` as keyof typeof questions[0]] || `Option ${opt}`}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between">
                          <button className="px-4 py-2 border border-slate-300 text-slate-600 font-bold text-xs rounded bg-white hover:bg-slate-50">Mark for Review & Next</button>
                          <button className="px-8 py-2 bg-blue-600 text-white font-bold text-xs rounded hover:bg-blue-700">Save & Next</button>
                        </div>
                      </div>

                      {/* Palette Side Panel */}
                      <div className="w-full sm:w-[280px] bg-slate-50 border-l border-slate-200 flex flex-col shrink-0">
                        <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-2 text-[11px] font-bold text-slate-600 border-b border-slate-200 bg-white">
                          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-emerald-500 text-white flex items-center justify-center rounded-tl-md rounded-br-md">1</div> Answered</div>
                          <div className="flex items-center gap-2"><div className="w-6 h-6 bg-rose-500 text-white flex items-center justify-center rounded-tl-md rounded-br-md">2</div> Not Answered</div>
                        </div>
                        <div className="bg-blue-500 text-white font-bold text-sm p-2 text-center shadow-sm">Physics</div>
                        <div className="p-4 flex-1 overflow-y-auto">
                          <p className="text-xs font-bold text-slate-500 mb-3">Choose a question</p>
                          <div className="grid grid-cols-4 gap-2">
                            {questions.map((_, i) => (
                              <div key={i} className={`aspect-square flex items-center justify-center font-bold text-sm rounded cursor-pointer ${i === 0 ? 'bg-rose-500 text-white rounded-tl-lg rounded-br-lg' : 'bg-slate-200 text-slate-700 rounded-tl-lg rounded-br-lg'}`}>
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 border-t border-slate-200 bg-slate-100">
                          <button className="w-full py-3 bg-blue-500 text-white font-bold text-sm rounded hover:bg-blue-600 shadow-sm">Submit</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Final Review & Publish */}
              {wizardStep === 5 && (
                <div className="animate-in slide-in-from-right-8 fade-in duration-500 py-10 flex flex-col items-center text-center">
                  <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-xl shadow-emerald-500/20">
                    <Send className="h-10 w-10 text-emerald-500 ml-1" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Ready to Deploy</h2>
                  <p className="text-slate-500 font-medium max-w-md mx-auto mb-10">
                    You are about to publish <strong className="text-slate-800">{basicDetails.title || "this exam"}</strong> to the Student Portal.
                  </p>
                  
                  <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm w-full max-w-md text-left space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Questions</span>
                      <span className="font-black text-slate-900">{questions.length}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Duration</span>
                      <span className="font-black text-slate-900">{examConfig.duration} Mins</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Target Batch</span>
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg text-xs">{basicDetails.targetBatch}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}