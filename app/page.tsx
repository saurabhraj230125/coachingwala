import Link from "next/link";
import { ArrowRight, Wallet, CalendarCheck, MessageSquare, LineChart, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-indigo-500/30 font-sans text-slate-900 overflow-x-hidden">
      
      {/* 1. Navigation Bar */}
      <nav className="w-full border-b border-slate-200 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md">
              CW
            </div>
            <span className="font-black text-xl tracking-tight">CoachingWala</span>
          </div>
          <Link 
            href="/login"
            className="text-sm font-bold bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-24 pb-16 px-6 text-center max-w-5xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8">
          <Zap className="h-3.5 w-3.5" />
          The New Standard for Institutes
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
          Run your coaching institute <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-500">
            like a tech company.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-10">
          The ultimate operating system to automate fee collection, track student attendance, and communicate with parents. Zero friction. Just ₹500/month.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/20"
          >
            Start 7-Day Free Trial <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-xs font-bold text-slate-400 sm:hidden">No credit card required</p>
        </div>
        <p className="hidden sm:block mt-4 text-xs font-bold text-slate-400">No credit card required • Setup in 30 seconds</p>
      </section>

      {/* 3. The Bento Grid (Feature Highlights) */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Large Feature Card 1 */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
            <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Wallet className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="text-3xl font-black mb-3">Zero Pending Fees.</h3>
            <p className="text-slate-500 font-medium text-lg max-w-md">
              Automated WhatsApp reminders, 1-click receipt generation, and a beautiful dashboard that tells you exactly who hasn't paid this month.
            </p>
          </div>

          {/* Square Feature Card 2 */}
          <div className="bg-slate-900 border border-slate-800 text-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-all duration-700">
              <CalendarCheck className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <div className="h-12 w-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                <CalendarCheck className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black mb-2">Smart Roll Call</h3>
              <p className="text-slate-400 font-medium">
                Mark attendance in seconds. Instantly notify parents via SMS if their child is absent.
              </p>
            </div>
          </div>

          {/* Square Feature Card 3 */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all group">
            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-black mb-2">Parent Comms</h3>
            <p className="text-slate-500 font-medium">
              Broadcast exam schedules, holiday notices, and performance reports directly to parents.
            </p>
          </div>

          {/* Large Feature Card 4 */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all group">
            <div className="h-14 w-14 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LineChart className="h-7 w-7 text-cyan-600" />
            </div>
            <h3 className="text-3xl font-black mb-3">NTA-Style Analytics.</h3>
            <p className="text-slate-500 font-medium text-lg max-w-md">
              Conduct tests and generate deep analytics. Show parents exact growth trajectories and subject-wise weak points.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-600/30">
          <ShieldCheck className="h-12 w-12 mx-auto mb-6 text-indigo-200" />
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Ready to upgrade your institute?
          </h2>
          <p className="text-indigo-100 text-lg font-medium mb-10 max-w-xl mx-auto">
            Join the next generation of coaching owners. Setup takes less than 30 seconds.
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-black text-lg hover:bg-slate-50 hover:scale-105 transition-all shadow-xl"
          >
            Create Your Workspace
          </Link>
        </div>
      </section>

      {/* 5. Simple Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-slate-400 text-sm font-bold">
        <p>© {new Date().getFullYear()} CoachingWala OS. All rights reserved.</p>
      </footer>
      
    </div>
  );
}