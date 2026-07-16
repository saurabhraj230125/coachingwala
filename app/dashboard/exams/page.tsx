"use client";

import { useState, useRef, useEffect } from "react";
import { PlusCircle, FileText, CheckCircle, Calculator, FlaskConical, Sigma, Type } from "lucide-react";
import { createExamAction } from "./actions";
import { createClient } from "@/utils/supabase/client";

export default function ExamDPPModule() {
  const supabase = createClient();
  const [exams, setExams] = useState<any[]>([]);
  const [qText, setQText] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTab, setActiveTab] = useState('math');

  // Load the exams on the client side
  useEffect(() => {
    async function loadExams() {
      const { data } = await supabase.from("exams").select("*, exam_questions(*)").order("created_at", { ascending: false });
      if (data) setExams(data);
    }
    loadExams();
  }, [supabase]);

  // The custom Science & Math Injection Engine
  const insertSymbol = (symbol: string) => {
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart;
      const end = textAreaRef.current.selectionEnd;
      const newText = qText.substring(0, start) + symbol + qText.substring(end);
      setQText(newText);
      
      // Keep focus on text area after clicking a tool
      setTimeout(() => {
        textAreaRef.current?.focus();
        textAreaRef.current?.setSelectionRange(start + symbol.length, start + symbol.length);
      }, 0);
    } else {
      setQText(qText + symbol);
    }
  };

  const toolbars = {
    math: ['√', '∫', '∑', '∞', 'π', 'θ', '±', '≤', '≥', '≠', '≈', 'x²', 'x³', '½', '¼'],
    chem: ['→', '⇌', '∆', '°', 'H₂O', 'CO₂', 'O₂', '⁺', '⁻', 'α', 'β', 'γ', 'λ', 'μ', 'ρ'],
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full bg-[#f8fafc] min-h-screen text-slate-900">
      <div className="mb-10 pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-black tracking-tight">Test Series & DPP Engine</h1>
        <p className="text-sm text-slate-500 mt-1">Author exam matrix setups with the Advanced Science & Math Editor.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT TWO COLUMNS: LIVE PUBLISHED TESTS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-extrabold text-sm uppercase text-slate-400 tracking-wider flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-indigo-600" /> Active Examination Roster ({exams?.length || 0})
          </h2>

          <div className="space-y-4">
            {exams?.map((exam) => (
              <div key={exam.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {exam.batch_target}
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 mt-1.5">{exam.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">Duration: {exam.duration_minutes} Mins | Questions Logged: {exam.exam_questions?.length || 0}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50/60 px-3 py-1 rounded-full border border-emerald-100">
                    <CheckCircle className="h-3.5 w-3.5" /> Published
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: ENTERPRISE SCIENCE BUILDER PANEL */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900 mb-1">Create Paper & DPP</h2>
          <p className="text-xs text-slate-500 mb-6">Use the Science Tools to instantly format complex equations.</p>

          <form action={createExamAction} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Test Title</label>
              <input name="title" required placeholder="e.g., Target DPP: Thermodynamics-01" className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Batch</label>
                <select name="batch_target" className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-none">
                  <option value="JEE Droppers">JEE Droppers</option>
                  <option value="NEET Batch">NEET Batch</option>
                  <option value="Class 12 Premium">Class 12 Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Time (Mins)</label>
                <input name="duration" type="number" required placeholder="60" className="w-full bg-slate-50 border border-slate-200 text-sm rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none" />
              </div>
            </div>

            {/* THE ADVANCED SCIENCE & MATH TOOLBAR */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold text-indigo-600 uppercase">Question Editor</label>
                <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg">
                  <button type="button" onClick={() => setActiveTab('math')} className={`p-1.5 rounded-md text-xs transition-colors ${activeTab === 'math' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    <Calculator className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" onClick={() => setActiveTab('chem')} className={`p-1.5 rounded-md text-xs transition-colors ${activeTab === 'chem' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
                    <FlaskConical className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-t-xl p-2 flex flex-wrap gap-1 border-b-0">
                {(activeTab === 'math' ? toolbars.math : toolbars.chem).map((symbol) => (
                  <button
                    key={symbol}
                    type="button"
                    onClick={() => insertSymbol(symbol)}
                    className="h-7 min-w-[28px] px-1.5 bg-white border border-slate-200 rounded font-mono text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                  >
                    {symbol}
                  </button>
                ))}
              </div>
              
              <textarea 
                ref={textAreaRef}
                name="q_text" 
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Type the question content here..." 
                className="w-full bg-slate-50 border border-slate-200 text-sm rounded-b-xl p-3 text-slate-900 h-28 focus:outline-none focus:border-indigo-600 font-medium" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input name="opt_a" placeholder="Option A" className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-900 focus:outline-none" />
              <input name="opt_b" placeholder="Option B" className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-900 focus:outline-none" />
              <input name="opt_c" placeholder="Option C" className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-900 focus:outline-none" />
              <input name="opt_d" placeholder="Option D" className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-2 text-slate-900 focus:outline-none" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Answer Key</label>
                <select name="correct" className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:outline-none">
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <button type="submit" className="flex-[2] mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-md shadow-indigo-100 text-xs transition-all flex items-center justify-center gap-2">
                <PlusCircle className="h-4 w-4" /> Broadcast Test
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}