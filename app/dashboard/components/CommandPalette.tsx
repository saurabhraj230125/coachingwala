"use client";

import { useState, useEffect, useRef } from "react";
import { Search, User, Wallet, Calendar, BookOpen, Settings, CornerDownLeft, FileText, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock Global Index (In production, this queries Supabase instantly)
const searchIndex = [
  { id: "p1", type: "page", title: "Dashboard Overview", icon: LayoutDashboard, route: "/dashboard" },
  { id: "p2", type: "page", title: "Student Roster", icon: User, route: "/dashboard/students" },
  { id: "p3", type: "page", title: "Fee Intelligence", icon: Wallet, route: "/dashboard/fees" },
  { id: "p4", type: "page", title: "NTA Exam Engine", icon: BookOpen, route: "/dashboard/exams" },
  { id: "p5", type: "page", title: "Rapid Attendance", icon: Calendar, route: "/dashboard/attendance" },
  { id: "a1", type: "action", title: "Collect pending fee from Rahul Kumar", icon: FileText, route: "/dashboard/fees?student=rahul" },
  { id: "s1", type: "student", title: "Rahul Kumar", subtitle: "Class 12 - Target JEE • BOK-001", icon: User, route: "/dashboard/students?id=1" },
  { id: "s2", type: "student", title: "Priya Singh", subtitle: "Class 11 - Foundation • BOK-002", icon: User, route: "/dashboard/students?id=2" },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen for Cmd+K (Mac) or Ctrl+K (Windows)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredResults = searchIndex.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  const navigateTo = (route: string) => {
    setIsOpen(false);
    router.push(route);
  };

  return (
    <>
      {/* Blur Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* The Palette Modal */}
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-200/60 z-[210] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Massive Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
          <Search className="h-6 w-6 text-indigo-500 shrink-0" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search students, pages, or actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium text-slate-900 placeholder:text-slate-400 outline-none"
          />
          <div className="flex items-center gap-1">
            <kbd className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-black px-1.5 py-0.5 rounded uppercase font-sans shadow-sm">ESC</kbd>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm font-medium">
              No results found for "{query}"
            </div>
          ) : (
            <div className="space-y-1">
              {filteredResults.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.route)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 text-left transition-colors group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                      item.type === 'page' ? 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600' :
                      item.type === 'action' ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-100' :
                      'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                    }`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <CornerDownLeft className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 transition-colors opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">Navigate with <kbd className="bg-white border border-slate-200 px-1 py-0.5 rounded shadow-sm text-slate-600">↑</kbd> <kbd className="bg-white border border-slate-200 px-1 py-0.5 rounded shadow-sm text-slate-600">↓</kbd></span>
            <span className="flex items-center gap-1">Open with <kbd className="bg-white border border-slate-200 px-1 py-0.5 rounded shadow-sm text-slate-600">↵</kbd></span>
          </div>
          <span>CoachingWala OS</span>
        </div>
      </div>
    </>
  );
}