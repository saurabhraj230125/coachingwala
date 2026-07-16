import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { User, Building, Phone, MapPin, Save, ShieldCheck, CreditCard } from "lucide-react";

// SERVER ACTION: Updates the profile directly in Supabase
async function updateProfile(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const name = formData.get("instituteName") as string;
    const phone = formData.get("phone") as string;
    const address = formData.get("address") as string;

    await supabase
      .from("institutes")
      .update({ 
        name: name, 
        phone_number: phone, 
        address: address 
      })
      .eq("owner_id", user.id);

    // Instantly refresh the data on the screen
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard"); // Refresh sidebar name too
  }
}

export default async function SettingsProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: institute } = await supabase
    .from("institutes")
    .select("*")
    .eq("owner_id", user?.id)
    .single();

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full bg-[#f8fafc] min-h-screen text-slate-900">
      
      <div className="mb-10 pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Workspace Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your coaching institute profile and system preferences.</p>
      </div>

      <div className="space-y-8">
        
        {/* READ-ONLY ACCOUNT SECURITY SECTION */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="font-bold text-slate-800">Account Security</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Director Email (Login ID)</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-600">
                  <User className="h-4 w-4 text-slate-400" />
                  {user?.email}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Email changes require manual verification through support.</p>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Subscription Tier</label>
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-600">
                  <span className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-500" />
                    {institute?.tier || "Growth Plan"}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* EDITABLE INSTITUTE PROFILE FORM */}
        <form action={updateProfile} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-indigo-600" />
              <h2 className="font-bold text-slate-800">Institute Profile</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Institute Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Coaching Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    name="instituteName" 
                    defaultValue={institute?.name || ""} 
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Contact Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    name="phone" 
                    defaultValue={institute?.phone_number || ""} 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Headquarters Address</label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <MapPin className="h-4 w-4 text-slate-400" />
                </div>
                <textarea 
                  name="address" 
                  defaultValue={institute?.address || ""} 
                  placeholder="Enter full physical address..."
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all resize-none"
                />
              </div>
            </div>

          </div>
          
          {/* Form Submit Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-indigo-100 transition-all"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}