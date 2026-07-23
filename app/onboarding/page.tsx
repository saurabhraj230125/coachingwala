"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createInstituteAction } from "./actions"; // Importing your co-located Server Action
import { 
  ArrowRight, Users, Wallet, Calendar, MessageSquare, 
  Loader2, GraduationCap, CheckCircle2, Sparkles 
} from "lucide-react";

const EXAM_OPTIONS = [
  "JEE (Main & Advanced)", "NEET UG", 
  "Foundation (Class 8-10)", "CBSE / State Boards", 
  "CUET", "UPSC / State PSC", 
  "SSC / Banking / Govt", "Other Skill Training"
];

export default function OnboardingPage() {
  const router = useRouter();
  
  // 0 = Welcome, 1 = Name, 2 = Exams, 3 = Scale, 4 = Pain Point, 5 = Provisioning
  const [step, setStep] = useState(0); 
  const inputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [instituteName, setInstituteName] = useState("");
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [studentScale, setStudentScale] = useState("");

  // Labor Illusion State
  const [loadingText, setLoadingText] = useState("Initializing workspace...");

  // Auto-focus input on Step 1
  useEffect(() => {
    if (step === 1) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  const toggleExam = (exam: string) => {
    setSelectedExams(prev => 
      prev.includes(exam) ? prev.filter(e => e !== exam) : [...prev, exam]
    );
  };

  // Handle the final submission via Server Action
  const handleCompleteSetup = async (selectedPainPoint: string) => {
    setStep(5); // Move to loading screen
    
    // 1. Start the UI Labor Illusion
    const texts = [
      "Provisioning secure database...",
      "Configuring fee tracking engine...",
      "Setting up NTA exam modules...",
      "Encrypting student roster...",
      "Finalizing your command center...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < texts.length) setLoadingText(texts[i]);
    }, 1200);

    // 2. Prepare Data for Server Action
    const formData = new FormData();
    formData.append("institute_name", instituteName);
    formData.append("exams_taught", JSON.stringify(selectedExams));
    formData.append("student_scale", studentScale);
    formData.append("primary_pain_point", selectedPainPoint);

    try {
      // 3. Fire the Server Action AND enforce a minimum loading time (for the UX illusion)
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 5500));
      const dbRequest = createInstituteAction(formData);

      // Wait for BOTH the database to finish AND the 5.5s animation to complete
      const [_, response] = await Promise.all([minLoadingTime, dbRequest]);

      if (response?.error) {
        clearInterval(interval);
        alert("Setup Error: " + response.error);
        setStep(4); 
        return; 
      }

      // 4. Complete illusion and redirect
      clearInterval(interval);
      router.refresh(); 
      router.push("/dashboard");

    } catch (err: any) {
      clearInterval(interval);
      alert(err.message || "A fatal error occurred.");
      setStep(4);
    }
  };

  return (
    <div suppressHydrationWarning className="h-[100dvh] w-full bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden selection:bg-indigo-500/30 font-sans">
      
      {/* Dynamic Progress Bar */}
      {step > 0 && step < 5 && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <div 
            className="h-full bg-slate-900 transition-all duration-700 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      )}

      <div className="w-full max-w-3xl px-6 flex flex-col items-center">
        
        {/* STEP 0: The Welcome Screen (CW Logo) */}
        {step === 0 && (
          <div className="w-full animate-in zoom-in-95 fade-in duration-700 flex flex-col items-center text-center">
            <div className="relative mb-8 group cursor-default">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full"></div>
              <div className="h-24 w-24 bg-slate-900 rounded-[2rem] shadow-2xl flex items-center justify-center relative z-10 border border-slate-700/50 group-hover:scale-105 transition-transform duration-500">
                <span className="text-4xl font-black text-white tracking-tighter">CW</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Welcome to CoachingWala
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-md mx-auto mb-10">
              The ultimate operating system to manage your students, automate fees, and conduct NTA-level exams.
            </p>
            <button 
              onClick={() => setStep(1)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all active:scale-95 shadow-lg shadow-indigo-600/25"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* STEP 1: Institute Name */}
        {step === 1 && (
          <div className="w-full animate-in slide-in-from-right-12 fade-in duration-500 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-8">
              Let's set up your workspace. <br />
              <span className="text-slate-400">What is your coaching name?</span>
            </h1>
            <input
              ref={inputRef}
              type="text"
              placeholder="e.g. Future Q Academy"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && instituteName.trim() && setStep(2)}
              className="w-full max-w-xl text-center text-3xl md:text-4xl font-black bg-transparent border-b-2 border-slate-200 focus:border-indigo-600 pb-4 outline-none transition-colors placeholder:text-slate-300 text-slate-900"
            />
            <button 
              onClick={() => setStep(2)}
              disabled={!instituteName.trim()}
              className="mt-10 flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              Continue <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* STEP 2: Exams Taught (THE MULTI-SELECT) */}
        {step === 2 && (
          <div className="w-full animate-in slide-in-from-right-12 fade-in duration-500 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
              What do you prepare students for?
            </h1>
            <p className="text-slate-500 font-medium mb-8">Select all that apply. We'll tailor your exam engine to these.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mb-10">
              {EXAM_OPTIONS.map((exam) => {
                const isSelected = selectedExams.includes(exam);
                return (
                  <button
                    key={exam}
                    onClick={() => toggleExam(exam)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 font-bold text-sm transition-all active:scale-[0.98] ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                    }`}>
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                    </div>
                    {exam}
                  </button>
                );
              })}
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={() => setStep(1)} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors px-4 py-3">
                Back
              </button>
              <button 
                onClick={() => setStep(3)}
                disabled={selectedExams.length === 0}
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Student Scale */}
        {step === 3 && (
          <div className="w-full animate-in slide-in-from-right-12 fade-in duration-500 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-8">
              How many students do you currently have?
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
              {['0 - 50', '51 - 200', '201 - 500', '500+'].map((scale) => (
                <button
                  key={scale}
                  onClick={() => {
                    setStudentScale(scale);
                    setStep(4);
                  }}
                  className="flex flex-col items-center justify-center py-8 px-6 bg-white border-2 border-slate-200 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all active:scale-[0.98] group shadow-sm"
                >
                  <Users className="h-8 w-8 text-slate-400 group-hover:text-indigo-500 mb-3 transition-colors" />
                  <span className="text-xl font-black text-slate-700 group-hover:text-indigo-900 transition-colors">{scale}</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Active Students</span>
                </button>
              ))}
            </div>
            
            <button onClick={() => setStep(2)} className="mt-8 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
              &larr; Back
            </button>
          </div>
        )}

        {/* STEP 4: The Pain Point */}
        {step === 4 && (
          <div className="w-full animate-in slide-in-from-right-12 fade-in duration-500 flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Final Step</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-8">
              What's the #1 challenge you want to solve today?
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
              
              <button onClick={() => handleCompleteSetup('fees')} className="flex items-start gap-4 p-5 bg-white border-2 border-slate-200 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all active:scale-[0.98] group text-left shadow-sm">
                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <Wallet className="h-6 w-6 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-emerald-900">Collecting Fees</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">Tracking pending payments and generating receipts.</p>
                </div>
              </button>

              <button onClick={() => handleCompleteSetup('attendance')} className="flex items-start gap-4 p-5 bg-white border-2 border-slate-200 rounded-3xl hover:border-blue-500 hover:bg-blue-50/30 transition-all active:scale-[0.98] group text-left shadow-sm">
                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Calendar className="h-6 w-6 text-slate-400 group-hover:text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-blue-900">Managing Attendance</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">Daily roll calls and notifying parents of absentees.</p>
                </div>
              </button>

              <button onClick={() => handleCompleteSetup('communication')} className="flex items-start gap-4 p-5 bg-white border-2 border-slate-200 rounded-3xl hover:border-amber-500 hover:bg-amber-50/30 transition-all active:scale-[0.98] group text-left shadow-sm">
                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                  <MessageSquare className="h-6 w-6 text-slate-400 group-hover:text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-amber-900">Parent Comms</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">Automating SMS alerts and sharing test reports.</p>
                </div>
              </button>

              <button onClick={() => handleCompleteSetup('all')} className="flex items-start gap-4 p-5 bg-slate-900 border-2 border-slate-900 rounded-3xl hover:bg-slate-800 transition-all active:scale-[0.98] group text-left shadow-lg">
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">All of the above</h3>
                  <p className="text-xs font-medium text-slate-300 mt-1 leading-relaxed">I need a complete OS to manage my entire institute.</p>
                </div>
              </button>

            </div>
            <button onClick={() => setStep(3)} className="mt-8 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
              &larr; Back
            </button>
          </div>
        )}

        {/* STEP 5: The Labor Illusion (Loading State) */}
        {step === 5 && (
          <div className="w-full animate-in fade-in duration-1000 flex flex-col items-center text-center">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-indigo-500 blur-[40px] opacity-30 rounded-full animate-pulse"></div>
              <div className="h-24 w-24 bg-white shadow-2xl shadow-indigo-500/20 rounded-[2rem] flex items-center justify-center relative z-10 border border-slate-100">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Setting up {instituteName}</h2>
            
            <div className="h-6 overflow-hidden flex justify-center">
              <p className="text-sm font-black uppercase tracking-widest text-indigo-500 animate-in slide-in-from-bottom-4 fade-in duration-300" key={loadingText}>
                {loadingText}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}