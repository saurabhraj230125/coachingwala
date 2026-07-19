import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "./components/Sidebar";
import CommandPalette from "./components/CommandPalette";
import TrialGuard from "./components/TrialGuard";

// 🔥 THE DEEP FIX: Force Next.js to NEVER cache this route under any circumstances.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  
  // 1. Authenticate the User
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect("/login");
  }

  // 2. ONE FETCH TO RULE THEM ALL
  // Grab everything we need for the layout and trial guard in a single database call
  const { data: institutes, error: dbError } = await supabase
    .from("institutes")
    .select("name, onboarding_completed, subscription_status, trial_ends_at")
    .eq("owner_id", user.id)
    .limit(1);

  // 3. Critical Error Handling
  if (dbError) {
    console.error("Database fetch failed:", dbError.message);
    throw new Error("Unable to load workspace data. Please refresh the page.");
  }

  const institute = institutes?.[0];

  // 4. Onboarding Gatekeeper
  if (!institute || institute.onboarding_completed === false) {
    redirect("/onboarding");
  }

  return (
    // Premium subtle radial gradient background
    <div className="min-h-[100dvh] bg-[#f8fafc] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-[#f8fafc] to-[#f8fafc] text-slate-900 font-sans flex flex-col md:flex-row antialiased selection:bg-indigo-500/30">
      
      {/* Global Components */}
      <CommandPalette />
      <Sidebar instituteName={institute.name || "Workspace"} />
      
      {/* Main Content Canvas */}
      <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0 scroll-smooth relative">
        <TrialGuard 
          status={institute.subscription_status} 
          trialEndsAt={institute.trial_ends_at}
        >
          {children}
        </TrialGuard>
      </main>

    </div>
  );
}