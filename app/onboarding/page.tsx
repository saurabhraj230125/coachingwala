import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Sparkles, Building2, Target, Users, ArrowRight } from "lucide-react";

// SERVER ACTION: Saves the onboarding data and unlocks the dashboard
async function completeSetup(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("institutes").update({
      name: formData.get("coachingName") as string,
      primary_focus: formData.get("focus") as string,
      student_volume_estimate: formData.get("volume") as string,
      is_onboarded: true, // UNLOCKS THE DASHBOARD
      tier: 'Enterprise' // Auto-enroll in the premium tier for the trial
    }).eq("owner_id", user.id);

    redirect("/dashboard");
  }
}

export default async function OnboardingWizard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If already onboarded, boot them to the dashboard
  const { data: institute } = await supabase.from("institutes").select("is_onboarded").eq("owner_id", user?.id).single();
  if (institute?.is_onboarded) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-indigo-500/30">
      <div className="max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* LEFT PANE: The Pitch & Value Prep */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-indigo-900 to-slate-900 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="h-12 w-12 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
              <Sparkles className="h-6 w-6 text-indigo-300" />
            </div>
            <h1 className="text-3xl font-black tracking-tight leading-tight mb-4">
              Configure Your Command Center.
            </h1>
            <p className="text-indigo-200 text-sm font-medium leading-relaxed">
              We are provisioning your isolated database shards. Tell us about your institute so we can calibrate the DPP engine and attendance matrix for your specific batch types.
            </p>
          </div>

          <div className="mt-12 relative z-10 space-y-4">
            <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl backdrop-blur-sm">
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">Included in Activation</p>
              <ul className="text-sm font-medium text-slate-300 space-y-2">
                <li className="flex items-center gap-2">✓ Automated JEE/NEET DPPs</li>
                <li className="flex items-center gap-2">✓ Student Portal Access</li>
                <li className="flex items-center gap-2">✓ 1-Click Attendance Tracking</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: The Data Collection Form */}
        <div className="w-full md:w-7/12 p-10 md:p-14 bg-white">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Institute Details</h2>
            <p className="text-sm text-slate-500 mt-1">Step 1 of 1: System Calibration</p>
          </div>

          <form action={completeSetup} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registered Coaching Name</label>
              <div className="relative">
                <Building2 className="absolute top-3 left-4 h-5 w-5 text-slate-400" />
                <input name="coachingName" required defaultValue="My Coaching Academy" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Primary Target Exam</label>
                <div className="relative">
                  <Target className="absolute top-3 left-3 h-5 w-5 text-slate-400" />
                  <select name="focus" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 appearance-none">
                    <option value="JEE (Main & Adv)">JEE (Main & Adv)</option>
                    <option value="NEET Medical">NEET Medical</option>
                    <option value="Foundation (9th-10th)">Foundation (9th-10th)</option>
                    <option value="Boards + Competitive">Boards + Competitive</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Student Volume</label>
                <div className="relative">
                  <Users className="absolute top-3 left-3 h-5 w-5 text-slate-400" />
                  <select name="volume" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 appearance-none">
                    <option value="0 - 50 Students">0 - 50 Students</option>
                    <option value="51 - 200 Students">51 - 200 Students</option>
                    <option value="200 - 500 Students">200 - 500 Students</option>
                    <option value="500+ Students">500+ Students</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 group">
                Initialize Workspace & Enter Dashboard <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}