import { createClient } from "@/utils/supabase/server";
import { CheckCircle2, Zap, Rocket, Shield, ArrowRight } from "lucide-react";

export default async function BillingDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: institute } = await supabase.from("institutes").select("tier").eq("owner_id", user?.id).single();

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto w-full">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-3">Scale Your Institute</h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Upgrade your workspace to unlock automated fee tracking, custom student portals, and the advanced DPP engine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* TIER 1: STARTER */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col relative">
          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">Starter <Shield className="h-5 w-5 text-slate-400" /></h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Perfect for daily operations.</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-black text-slate-900">₹500</span>
            <span className="text-sm font-bold text-slate-400">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> Unlimited Student Roster</li>
            <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> 1-Click Attendance Matrix</li>
            <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="h-5 w-5 text-indigo-500 shrink-0" /> Basic Batch Management</li>
            <li className="flex items-start gap-3 text-sm font-bold text-slate-300"><CheckCircle2 className="h-5 w-5 text-slate-200 shrink-0" /> Fee Collection Management</li>
            <li className="flex items-start gap-3 text-sm font-bold text-slate-300"><CheckCircle2 className="h-5 w-5 text-slate-200 shrink-0" /> Test Series & DPP Creator</li>
          </ul>
          <button className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all">
            Current Plan
          </button>
        </div>

        {/* TIER 2: PRO (FEE MANAGEMENT) */}
        <div className="bg-gradient-to-b from-indigo-900 to-slate-900 rounded-3xl p-8 border border-indigo-800 shadow-xl shadow-indigo-900/20 flex flex-col relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
            Most Popular
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">Pro <Zap className="h-5 w-5 text-amber-400" /></h3>
            <p className="text-xs text-indigo-200 mt-1 font-medium">Add financial tracking & dues.</p>
          </div>
          <div className="mb-8">
            <span className="text-4xl font-black text-white">₹1000</span>
            <span className="text-sm font-bold text-indigo-300">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-sm font-bold text-white"><CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" /> Everything in Starter</li>
            <li className="flex items-start gap-3 text-sm font-bold text-white"><CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" /> Advanced Fee Management</li>
            <li className="flex items-start gap-3 text-sm font-bold text-white"><CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" /> Pending Dues Dashboard</li>
            <li className="flex items-start gap-3 text-sm font-bold text-indigo-200/50"><CheckCircle2 className="h-5 w-5 text-indigo-500/30 shrink-0" /> Test Series & DPP Creator</li>
            <li className="flex items-start gap-3 text-sm font-bold text-indigo-200/50"><CheckCircle2 className="h-5 w-5 text-indigo-500/30 shrink-0" /> Custom Student Portal</li>
          </ul>
          <button className="w-full py-3.5 rounded-xl bg-indigo-500 text-white font-bold text-sm hover:bg-indigo-400 shadow-lg shadow-indigo-500/30 transition-all flex justify-center items-center gap-2">
            Upgrade to Pro <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* TIER 3: MAX (TESTS & PORTALS) */}
        <div className="bg-white rounded-3xl p-8 border border-violet-200 shadow-lg shadow-violet-100/50 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl"></div>
          <div className="mb-6 relative z-10">
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">Max <Rocket className="h-5 w-5 text-violet-500" /></h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">The ultimate coaching ecosystem.</p>
          </div>
          <div className="mb-8 relative z-10">
            <span className="text-4xl font-black text-slate-900">₹1500</span>
            <span className="text-sm font-bold text-slate-400">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1 relative z-10">
            <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="h-5 w-5 text-violet-500 shrink-0" /> Everything in Pro</li>
            <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="h-5 w-5 text-violet-500 shrink-0" /> Science/Math DPP Engine</li>
            <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="h-5 w-5 text-violet-500 shrink-0" /> Custom Live Test Series</li>
            <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="h-5 w-5 text-violet-500 shrink-0" /> Dedicated Student Portal</li>
            <li className="flex items-start gap-3 text-sm font-bold text-slate-700"><CheckCircle2 className="h-5 w-5 text-violet-500 shrink-0" /> Priority Chat Support</li>
          </ul>
          <button className="w-full py-3.5 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all flex justify-center items-center gap-2 relative z-10">
            Unlock Max Ecosystem <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}