"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { ArrowRight, Users, Wallet, Calendar, MessageSquare, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [instituteName, setInstituteName] = useState("");
  const [studentScale, setStudentScale] = useState("");
  const [painPoint, setPainPoint] = useState("");

  // Labor Illusion State
  const [loadingText, setLoadingText] = useState("Provisioning secure database...");

  // Auto-focus input on Step 1
  useEffect(() => {
    if (step === 1) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [step]);

  // Handle the final submission and the "Labor Illusion"
  const handleCompleteSetup = async (selectedPainPoint: string) => {
    setPainPoint(selectedPainPoint);
    setStep(4); // Move to loading screen
    
    // 1. Start the UI Labor Illusion (Psychological Hook)
    const texts = [
      "Provisioning secure database...",
      "Configuring fee tracking engine...",
      "Setting up NTA exam modules...",
      "Finalizing workspace...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < texts.length) setLoadingText(texts[i]);
    }, 1200);

    // 2. Fetch User and Save to Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 🔥 THE DEEP FIX: We now explicitly check for 'error'
      const { error } = await supabase.from("institutes").upsert({
        owner_id: user.id,
        name: instituteName,
        student_scale: studentScale,
        primary_pain_point: selectedPainPoint,
        onboarding_completed: true, 
      }, { onConflict: 'owner_id' });

      // IF THE DATABASE FAILS, STOP THE REDIRECT!
      if (error) {
        clearInterval(interval);
        setLoadingText("Security Alert: " + error.message);
        alert("Database Error: " + error.message + "\n\nDid you enable RLS policies?");
        return; 
      }
    }

    // 3. If successful, wait for the illusion to finish, then hard redirect
    setTimeout(() => {
      clearInterval(interval);
      window.location.href = "/dashboard";
    }, 4800);
  };

  return (
    <div className="h-[100dvh] w-full bg-[#fafafa] flex flex-col items-center justify-center overflow-hidden selection:bg-indigo-500/30">
      
      {/* Progress Bar */}
      {step < 4 && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <div 
            className="h-full bg-slate-900 transition-all duration-700 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      )}

      <div className="w-full max-w-3xl px-6 md:px-12 flex flex-col items-center">
        
        {/* STEP 1: Institute Name */}
        {step === 1 && (
          <div className="w-full animate-in slide-in-from-right-8 fade-in duration-500 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">
              Welcome to the future of coaching. <br />
              <span className="text-slate-400">What is your institute's name?</span>
            </h1>
            <input
              ref={inputRef}
              type="text"
              placeholder="e.g., FutureQ Academy"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && instituteName.trim() && setStep(2)}
              className="w-full max-w-xl text-center text-2xl md:text-4xl font-black bg-transparent border-b-2 border-slate-200 focus:border-slate-900 pb-4 outline-none transition-colors placeholder:text-slate-300"
            />
            <button 
              onClick={() => setStep(2)}
              disabled={!instituteName.trim()}
              className="mt-10 flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              Continue <ArrowRight className="h-5 w-5" />
            </button>
            <p className="mt-4 text-xs font-bold text-slate-400">Press Enter to continue</p>
          </div>
        )}

        {/* STEP 2: Student Scale */}
        {step === 2 && (
          <div className="w-full animate-in slide-in-from-right-8 fade-in duration-500 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-10">
              How many students do you currently have?
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
              {['0 - 50', '50 - 200', '200 - 500', '500+'].map((scale) => (
                <button
                  key={scale}
                  onClick={() => {
                    setStudentScale(scale);
                    setStep(3);
                  }}
                  className="flex flex-col items-center justify-center py-8 px-6 bg-white border-2 border-slate-200 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all active:scale-[0.98] group shadow-sm"
                >
                  <Users className="h-8 w-8 text-slate-400 group-hover:text-indigo-500 mb-3 transition-colors" />
                  <span className="text-xl font-black text-slate-700 group-hover:text-indigo-900 transition-colors">{scale}</span>
                  <span className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Students</span>
                </button>
              ))}
            </div>
            
            <button onClick={() => setStep(1)} className="mt-10 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
              &larr; Back
            </button>
          </div>
        )}

        {/* STEP 3: The Pain Point */}
        {step === 3 && (
          <div className="w-full animate-in slide-in-from-right-8 fade-in duration-500 flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-10">
              What is your biggest headache right now?
            </h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
              
              <button onClick={() => handleCompleteSetup('fees')} className="flex items-start gap-4 p-6 bg-white border-2 border-slate-200 rounded-3xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all active:scale-[0.98] group text-left shadow-sm">
                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <Wallet className="h-6 w-6 text-slate-400 group-hover:text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-emerald-900">Collecting Fees</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Following up on pending payments and generating receipts.</p>
                </div>
              </button>

              <button onClick={() => handleCompleteSetup('attendance')} className="flex items-start gap-4 p-6 bg-white border-2 border-slate-200 rounded-3xl hover:border-blue-500 hover:bg-blue-50/30 transition-all active:scale-[0.98] group text-left shadow-sm">
                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Calendar className="h-6 w-6 text-slate-400 group-hover:text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-blue-900">Managing Attendance</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Taking daily roll calls and notifying parents of absentees.</p>
                </div>
              </button>

              <button onClick={() => handleCompleteSetup('communication')} className="flex items-start gap-4 p-6 bg-white border-2 border-slate-200 rounded-3xl hover:border-amber-500 hover:bg-amber-50/30 transition-all active:scale-[0.98] group text-left shadow-sm">
                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                  <MessageSquare className="h-6 w-6 text-slate-400 group-hover:text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-amber-900">Parent Communication</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Answering calls, sending updates, and sharing reports.</p>
                </div>
              </button>

              <button onClick={() => handleCompleteSetup('all')} className="flex items-start gap-4 p-6 bg-white border-2 border-slate-200 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all active:scale-[0.98] group text-left shadow-sm">
                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <Users className="h-6 w-6 text-slate-400 group-hover:text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-900">All of the above</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">I need a complete operating system to manage everything.</p>
                </div>
              </button>

            </div>
            <button onClick={() => setStep(2)} className="mt-10 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">
              &larr; Back
            </button>
          </div>
        )}

        {/* STEP 4: The Labor Illusion (Loading State) */}
        {step === 4 && (
          <div className="w-full animate-in fade-in duration-1000 flex flex-col items-center text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
              <div className="h-20 w-20 bg-white shadow-xl shadow-slate-200/50 rounded-2xl flex items-center justify-center relative z-10 border border-slate-100">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-2">Setting up {instituteName}</h2>
            
            {/* Morphing Loading Text */}
            <div className="h-6 overflow-hidden flex justify-center">
              <p className="text-sm font-bold text-indigo-500 animate-in slide-in-from-bottom-4 fade-in duration-300" key={loadingText}>
                {loadingText}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}