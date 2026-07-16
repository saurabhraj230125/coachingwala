"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, CalendarCheck, FolderOpen, 
  Wallet, BookOpenCheck, Settings, CreditCard, 
  GraduationCap, ChevronRight, Menu, X, Sparkles 
} from "lucide-react";

export default function Sidebar({ instituteName }: { instituteName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on mobile when a route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navItems = [
    { label: "Overview Console", href: "/dashboard", icon: LayoutDashboard },
    { label: "Student Roster", href: "/dashboard/students", icon: Users },
    { label: "Attendance Matrix", href: "/dashboard/attendance", icon: CalendarCheck },
    { label: "Study Materials", href: "/dashboard/materials", icon: FolderOpen },
    { label: "Fee Management", href: "/dashboard/fees", icon: Wallet, badge: "PRO" },
    { label: "Test Series & DPPs", href: "/dashboard/exams", icon: BookOpenCheck, badge: "MAX" },
  ];

  return (
    <>
      {/* MOBILE TOP NAVIGATION BAR */}
      <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-md">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <h2 className="font-black text-sm tracking-tight text-slate-900 truncate max-w-[150px]">
            {instituteName}
          </h2>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* THE SIDEBAR (Locked on Desktop, Slide-in on Mobile) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/60 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] transform transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        <div>
          <div className="h-16 md:h-20 px-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div className="hidden md:block">
                <h2 className="font-black text-base tracking-tight text-slate-900 truncate max-w-[140px]">
                  {instituteName}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 truncate">Director Account</p>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-xl">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1 mt-2 overflow-y-auto max-h-[calc(100vh-250px)]">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pl-3 mb-3">Core Modules</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-3 rounded-xl border transition-all duration-300 font-bold text-sm ${
                    isActive 
                      ? 'bg-indigo-50 border-indigo-100 text-indigo-700 shadow-sm' 
                      : 'hover:bg-slate-50 border-transparent hover:border-slate-200/60 text-slate-600 hover:text-indigo-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      item.badge === 'PRO' ? 'bg-amber-100 text-amber-700' : 'bg-violet-100 text-violet-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM UPGRADE MODULE */}
        <div className="p-4 space-y-2 bg-white">
          <Link href="/dashboard/billing" className="block p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-900/10 active:scale-95 transition-all">
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold">Upgrade to Max</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-3 w-full bg-slate-700/50 h-1.5 rounded-full overflow-hidden relative z-10">
              <div className="bg-gradient-to-r from-amber-400 to-amber-200 h-full w-[33%] rounded-full"></div>
            </div>
          </Link>

          <div className="flex gap-2">
            <Link href="/dashboard/billing" className="flex-1 flex items-center justify-center gap-2 py-3 md:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 active:bg-slate-100 transition-all text-xs font-bold">
              <CreditCard className="h-4 w-4" /> Billing
            </Link>
            <Link href="/dashboard/settings" className="flex-1 flex items-center justify-center gap-2 py-3 md:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 active:bg-slate-100 transition-all text-xs font-bold">
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}