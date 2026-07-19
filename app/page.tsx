import Link from "next/link";
import { ArrowRight, Wallet, CalendarCheck, MessageSquare, LineChart, ShieldCheck, Zap, Smartphone } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-indigo-500/30 font-sans text-slate-900 overflow-x-hidden">
      
      {/* 1. Navigation Bar */}
      <nav className="w-full border-b border-slate-200 bg-white/70 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md">
              CW
            </div>
            <span className="font-black text-xl tracking-tight">CoachingWala</span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <Link 
              href="https://YOUR-STUDENT-PORTAL-LINK.vercel.app" 
              className="hidden md:block text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Student Portal
            </Link>
            <Link 
              href="/login"
              className="text-sm font-bold bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-all active:scale-95 shadow-sm shadow-indigo-600/20"
            >
              Owner Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="pt-24 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black uppercase tracking-widest mb-8 shadow-sm">
          <Zap className="h-3.5 w-3.5 fill-indigo-500" />
          The New Standard for Institutes
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1] mb-6">
          Run your coaching institute <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
            like a tech company.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-10">
          The ultimate operating system to automate fee collection, track student attendance, and communicate with parents. Zero friction. Just ₹500/month.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:-translate-y-1"
          >
            Start 7-Day Free Trial <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <p className="mt-5 text-xs font-bold text-slate-400 uppercase tracking-wider">No credit card required • Setup in 30 seconds</p>
      </section>

      {/* 3. The Bento Grid (5 Cards) */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Large Feature Card 1 (Row 1) */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all group">
            <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <Wallet className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="text-3xl font-black mb-3 text-slate-900">Zero Pending Fees.</h3>
            <p className="text-slate-500 font-medium text-lg max-w-md">
              Automated WhatsApp reminders, 1-click receipt generation, and a beautiful dashboard that tells you exactly who hasn't paid this month.
            </p>
          </div>

          {/* Square Feature Card 2 (Row 1) */}
          <div className="bg-slate-900 border border-slate-800 text-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-150 group-hover:rotate-12 transition-all duration-700">
              <CalendarCheck className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <div className="h-12 w-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
                <CalendarCheck className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-black mb-2">Smart Roll Call</h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                Mark attendance in seconds. Instantly notify parents via SMS if their child is absent.
              </p>
            </div>
          </div>

          {/* Square Feature Card 3 (Row 2) */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all group">
            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
              <MessageSquare className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-black mb-2 text-slate-900">Parent Comms</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Broadcast exam schedules, holiday notices, and performance reports directly to parents' phones.
            </p>
          </div>

          {/* Square Feature Card 4 (Row 2) */}
          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all group">
            <div className="h-12 w-12 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
              <LineChart className="h-6 w-6 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-black mb-2 text-slate-900">NTA Analytics</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Show parents exact growth trajectories and subject-wise weak points after every mock test.
            </p>
          </div>

          {/* NEW: Square Feature Card 5 (Row 2) - Advertising the Student Portal */}
          <div className="bg-indigo-600 border border-indigo-500 text-white rounded-[2rem] p-8 shadow-md hover:shadow-xl hover:bg-indigo-700 transition-all group">
            <div className="h-12 w-12 bg-indigo-500/50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-2">Student App</h3>
            <p className="text-indigo-100 font-medium leading-relaxed">
              Every student gets a dedicated, secure portal to download study materials and view scores.
            </p>
          </div>

        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
          
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"></div>
          </div>

          <div className="relative z-10">
            <ShieldCheck className="h-14 w-14 mx-auto mb-6 text-indigo-400" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
              Ready to upgrade <br className="hidden md:block" /> your institute?
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-medium mb-10 max-w-xl mx-auto">
              Join the next generation of coaching owners. Setup takes less than 30 seconds.
            </p>
            <Link 
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-10 py-5 rounded-full font-black text-lg hover:bg-slate-50 hover:scale-105 transition-all shadow-xl"
            >
              Create Your Workspace
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Simple Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-2">
          <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xs opacity-50 mb-2">
            CW
          </div>
          <p className="text-slate-400 text-sm font-bold tracking-wide">
            © {new Date().getFullYear()} CoachingWala OS. All rights reserved.
          </p>
        </div>
      </footer>
      
    </div>
  );
}