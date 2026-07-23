"use client";

import { useState } from "react";
import { publishExamAction } from "./actions";
import { 
  Plus, CheckCircle2, Loader2, LayoutDashboard, 
  Settings, Target, Clock, ShieldCheck, 
  Send, FileText, Activity, AlertTriangle, HelpCircle,
  GripVertical, Bold, Italic, Type, Sigma, Image as ImageIcon,
  ChevronRight, AlignLeft, Info
} from "lucide-react";

type ViewState = 'dashboard' | 'wizard';
type WizardStep = 1 | 2 | 3 | 4 | 5;

export default function ExamEngine() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [wizardStep, setWizardStep] = useState<WizardStep>(1);
  const [isPublishing, setIsPublishing] = useState(false);

  // 🔥 CRITICAL FIX: Default changed to "All Batches" to sync with Student Portal
  const [basicDetails, setBasicDetails] = useState({
    title: "",
    targetBatch: "All Batches", 
    examType: "cbt"
  });

  const [examConfig, setExamConfig] = useState({
    duration: 180,
    maxMarks: 300,
    shuffleQuestions: true,
    antiTabSwitch: true,
    calculator: false,
    autoSubmit: true
  });

  const [questions, setQuestions] = useState([
    { id: 1, section: "Physics", q_text: "", opt_a: "", opt_b: "", opt_c: "", opt_d: "", correct: "A", marks: 4, negative: 1 }
  ]);

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

      setView('dashboard');
      setWizardStep(1);
      // 🔥 CRITICAL FIX: Reset back to "All Batches"
      setBasicDetails({ title: "", targetBatch: "All Batches", examType: "cbt" });
      setQuestions([{ id: 1, section: "Physics", q_text: "", opt_a: "", opt_b: "", opt_c: "", opt_d: "", correct: "A", marks: 4, negative: 1 }]);
      
    } catch (error) {
      alert("Network or Server error. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const WizardHeader = () => (
    <div className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-50 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <button onClick={() => setView('dashboard')} className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1">
          Exit Studio
        </button>
        <div className="h-4 w-px bg-slate-200"></div>
        <div className="flex items-center gap-3">
          {['Basic Setup', 'Configuration', 'Question Builder', 'NTA Preview', 'Publish Exam'].map((label, i) => {
            const stepNum = (i + 1) as WizardStep;
            const isActive = wizardStep === stepNum;
            const isPast = wizardStep > stepNum;
            return (
              <div key={stepNum} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 text-xs font-bold transition-colors cursor-pointer ${isActive ? 'text-indigo-600' : isPast ? 'text-slate-700' : 'text-slate-400'}`} onClick={() => setWizardStep(stepNum)}>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${isActive ? 'bg-indigo-600 text-white' : isPast ? 'bg-emerald-500 text-white' : 'bg-slate-100 border border-slate-200 text-slate-400'}`}>
                    {isPast ? <CheckCircle2 className="h-3 w-3" /> : stepNum}
                  </div>
                  <span className="hidden md:block">{label}</span>
                </div>
                {stepNum < 5 && <ChevronRight className="h-4 w-4 text-slate-300" />}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {wizardStep < 5 ? (
          <button onClick={() => setWizardStep(prev => Math.min(5, prev + 1) as WizardStep)} className="px-5 py-2 bg-slate-900 text-white rounded-md font-bold text-xs hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
            Save & Next Step
          </button>
        ) : (
          <button onClick={executePublish} disabled={isPublishing} className="px-5 py-2 bg-indigo-600 text-white rounded-md font-bold text-xs hover:bg-indigo-700 transition-all active:scale-95 shadow-sm flex items-center gap-2">
            {isPublishing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />} Deploy Examination
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-indigo-100">
      
      <div className="w-60 bg-[#1e2329] min-h-screen text-slate-400 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-white/5 flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg">FQ</div>
          <div>
            <h2 className="text-xs font-black text-white tracking-wide">FutureQ Academy</h2>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Exam OS</p>
          </div>
        </div>
        <div className="flex-1 py-4 space-y-1 px-3">
          <button onClick={() => setView('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm transition-all ${view === 'dashboard' ? 'bg-indigo-500/10 text-indigo-400' : 'hover:bg-white/5 hover:text-slate-200'}`}>
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm hover:bg-white/5 hover:text-slate-200 transition-all">
            <Activity className="h-4 w-4" /> Live Monitoring
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm hover:bg-white/5 hover:text-slate-200 transition-all">
            <FileText className="h-4 w-4" /> Question Bank
          </button>
        </div>
      </div>
      
      {view === 'dashboard' ? (
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50/50">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Exam Dashboard</h1>
              <p className="text-xs font-medium text-slate-500 mt-1">Manage tests, monitor live activity, and review results.</p>
            </div>
            <button onClick={() => { setView('wizard'); setWizardStep(1); }} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md font-bold text-xs transition-all shadow-sm">
              <Plus className="h-4 w-4" /> Create New Examination
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[{label: "Total Exams", val: "84", sub: "+8 this month"}, {label: "Students Attempted", val: "4,281", sub: "91% Completion Rate"}, {label: "Average Score", val: "142/300", sub: "Stable"}, {label: "Cheating Alerts", val: "2", sub: "Needs Review", alert: true}].map((metric, i) => (
              <div key={i} className={`bg-white border ${metric.alert ? 'border-rose-200' : 'border-slate-200'} rounded-xl p-5 shadow-sm`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${metric.alert ? 'text-rose-500' : 'text-slate-500'} mb-2`}>{metric.label}</p>
                <h2 className={`text-3xl font-black ${metric.alert ? 'text-rose-600' : 'text-slate-900'} mb-1`}>{metric.val}</h2>
                <p className="text-xs font-medium text-slate-400">{metric.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Active & Upcoming</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white">Exam Name</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white">Target</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white">Status</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">Physics Full Test 03</p>
                    <p className="text-xs text-slate-500 mt-0.5">PHY-FT-03 • 180 Mins</p>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-700">Target JEE 2027</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Now
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded border border-indigo-100 transition-colors">Monitor Live</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
          <WizardHeader />
          
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto w-full pb-20">
              
              {/* STEP 1: Basic Details */}
              {wizardStep === 1 && (
                <div className="animate-in fade-in duration-300">
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                      <h2 className="text-base font-black text-slate-900">Basic Information</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Set up the foundation for this examination.</p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Examination Title</label>
                        <input type="text" placeholder="e.g. Physics Sectional Mock 01" value={basicDetails.title} onChange={e => setBasicDetails({...basicDetails, title: e.target.value})} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400" />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700">Target Batch</label>
                          {/* 🔥 CRITICAL FIX: Dropdown mapped accurately */}
                          <select value={basicDetails.targetBatch} onChange={e => setBasicDetails({...basicDetails, targetBatch: e.target.value})} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all cursor-pointer">
                            <option value="All Batches">All Batches (Global Exam)</option>
                            <option value="Target JEE 2027">Target JEE 2027</option>
                            <option value="Bokaro Offline Center">Bokaro Offline Center</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700">Exam Format</label>
                          <select value={basicDetails.examType} onChange={e => setBasicDetails({...basicDetails, examType: e.target.value})} className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm font-medium text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all cursor-pointer">
                            <option value="cbt">Digital CBT (Computer Based Test)</option>
                            <option value="pdf">PDF Practice Paper</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Configuration */}
              {wizardStep === 2 && (
                <div className="animate-in fade-in duration-300 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                      <h2 className="text-base font-black text-slate-900">Exam Parameters</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Total Duration (Minutes)</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input type="number" value={examConfig.duration} onChange={e => setExamConfig({...examConfig, duration: parseInt(e.target.value)})} className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-2 text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700">Maximum Marks</label>
                        <div className="relative">
                          <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input type="number" value={examConfig.maxMarks} onChange={e => setExamConfig({...examConfig, maxMarks: parseInt(e.target.value)})} className="w-full bg-white border border-slate-300 rounded-md pl-9 pr-3 py-2 text-sm font-medium focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                      <h2 className="text-base font-black text-slate-900 flex items-center gap-2">Security & Advanced Rules</h2>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-8">
                      {[
                        { id: 'shuffleQuestions', label: 'Shuffle Questions' },
                        { id: 'antiTabSwitch', label: 'Anti-Tab Switch Alert' },
                        { id: 'calculator', label: 'Enable On-Screen Calculator' },
                        { id: 'autoSubmit', label: 'Auto Submit on Timer End' }
                      ].map(setting => (
                        <label key={setting.id} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-9 h-5 rounded-full p-0.5 transition-colors ${examConfig[setting.id as keyof typeof examConfig] ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${examConfig[setting.id as keyof typeof examConfig] ? 'translate-x-4' : 'translate-x-0'}`}></div>
                          </div>
                          <span className="text-sm font-medium text-slate-700">{setting.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Question Builder */}
              {wizardStep === 3 && (
                <div className="animate-in fade-in duration-300 flex gap-6 h-[calc(100vh-140px)]">
                  <div className="w-64 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col shrink-0 overflow-hidden">
                    <div className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-600">Question Navigator</span>
                      <button className="text-indigo-600 p-1 hover:bg-indigo-50 rounded"><Plus className="h-4 w-4"/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {questions.map((q, i) => (
                        <div key={q.id} className="bg-indigo-50 border border-indigo-200 text-indigo-700 p-2 rounded-md text-xs font-bold flex justify-between items-center cursor-pointer">
                          <span>Q{i + 1}. {q.section}</span>
                          <span className="bg-white px-1.5 py-0.5 rounded shadow-sm text-[10px] text-slate-500">MCQ</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-slate-400 cursor-grab" />
                        <h3 className="text-sm font-bold text-slate-800">Question 1</h3>
                      </div>
                      <div className="flex gap-2">
                        <select className="text-xs border border-slate-300 rounded px-2 py-1 outline-none bg-white">
                          <option>Physics</option><option>Chemistry</option><option>Maths</option>
                        </select>
                        <div className="flex items-center text-xs font-bold border border-slate-300 rounded px-2 py-1 bg-white divide-x divide-slate-200">
                          <span className="text-emerald-600 pr-2">+4</span><span className="text-rose-500 pl-2">-1</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 bg-white">
                      <div className="flex items-center gap-1 mb-2 border border-slate-200 bg-slate-50 p-1 rounded-md w-max">
                        <button className="p-1.5 hover:bg-white rounded text-slate-600"><Bold className="h-3.5 w-3.5"/></button>
                        <button className="p-1.5 hover:bg-white rounded text-slate-600"><Italic className="h-3.5 w-3.5"/></button>
                        <div className="h-4 w-px bg-slate-300 mx-1"></div>
                        <button className="p-1.5 hover:bg-white rounded text-slate-600"><Sigma className="h-3.5 w-3.5"/></button>
                        <button className="p-1.5 hover:bg-white rounded text-slate-600"><ImageIcon className="h-3.5 w-3.5"/></button>
                      </div>

                      <textarea 
                        value={questions[0].q_text}
                        onChange={(e) => { const newQ = [...questions]; newQ[0].q_text = e.target.value; setQuestions(newQ); }}
                        placeholder="Type question statement here..."
                        className="w-full text-sm font-medium text-slate-800 border border-slate-300 rounded-md p-3 min-h-[120px] outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none mb-6"
                      />

                      <div className="space-y-3">
                        {(['A', 'B', 'C', 'D'] as const).map(opt => (
                          <div key={opt} className={`flex items-start gap-3 p-2 border rounded-md transition-all ${questions[0].correct === opt ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-300 bg-white focus-within:border-indigo-500'}`}>
                            <button onClick={() => { const newQ = [...questions]; newQ[0].correct = opt; setQuestions(newQ); }} className={`mt-0.5 shrink-0 h-6 w-6 rounded border flex items-center justify-center text-xs font-bold ${questions[0].correct === opt ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-slate-100 border-slate-300 text-slate-500 hover:bg-slate-200'}`}>
                              {opt}
                            </button>
                            <input 
                              placeholder={`Option ${opt}`}
                              value={questions[0][`opt_${opt.toLowerCase()}` as keyof typeof questions[0]] as string}
                              onChange={(e) => { const newQ = [...questions]; (newQ[0] as any)[`opt_${opt.toLowerCase()}`] = e.target.value; setQuestions(newQ); }}
                              className="flex-1 outline-none text-sm text-slate-800 bg-transparent py-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: NTA Preview */}
              {wizardStep === 4 && (
                <div className="animate-in fade-in duration-300 flex flex-col items-center">
                  <div className="w-full max-w-[1000px] border border-slate-300 shadow-2xl flex flex-col font-sans select-none bg-white relative h-[600px] text-sm overflow-hidden">
                    <div className="bg-[#37474f] text-white flex justify-between items-center px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{basicDetails.title || "Advanced Practice Test"}</span>
                        <Info className="h-4 w-4 opacity-70" />
                      </div>
                    </div>
                    <div className="bg-white border-b border-slate-200 flex items-center shadow-sm relative z-10">
                      <span className="text-xs text-slate-600 px-4 py-2 border-r border-slate-200">Sections</span>
                      <div className="flex">
                        <div className="px-4 py-2.5 text-xs text-white bg-blue-600 font-medium flex items-center gap-1"><ChevronRight className="h-4 w-4"/> Physics <Info className="h-3 w-3 opacity-80"/></div>
                      </div>
                    </div>
                    <div className="flex flex-1 overflow-hidden">
                      <div className="flex-1 flex flex-col border-r border-slate-300">
                        <div className="px-6 py-3 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-0">
                          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                            <span className="text-base text-slate-900 font-bold">Question 1</span>
                            <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">Question Type: MCQ</span>
                          </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto bg-white">
                          <p className="text-base text-slate-900 mb-6 font-medium">{questions[0].q_text || "Preview Question"}</p>
                        </div>
                      </div>
                      <div className="w-[320px] bg-slate-50 flex flex-col shrink-0">
                        <div className="bg-blue-600 text-white font-bold text-sm px-4 py-2 shadow-sm z-10">Physics</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Final Review & Publish */}
              {wizardStep === 5 && (
                <div className="animate-in fade-in duration-300 py-10 flex flex-col items-center">
                  <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm w-full max-w-lg">
                    <div className="text-center mb-8">
                      <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Ready to Deploy</h2>
                      <p className="text-slate-500 text-sm">Review your settings before making it live.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-500">Examination</span>
                        <span className="font-bold text-slate-900 text-sm">{basicDetails.title || "Untitled"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold text-slate-500">Target Audience</span>
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded text-xs">{basicDetails.targetBatch}</span>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button onClick={executePublish} disabled={isPublishing} className="w-full py-3 bg-indigo-600 text-white rounded-md font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-md flex justify-center items-center gap-2">
                        {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Deploy to Student Portal
                      </button>
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