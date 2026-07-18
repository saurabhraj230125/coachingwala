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
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect("/login");
  }

  // 🔥 ONE FETCH TO RULE THEM ALL
  // We extract both 'data' and 'error' to prevent false onboarding loops.
  const { data: institutes, error: dbError } = await supabase
    .from("institutes")
    .select("name, onboarding_completed, subscription_status, trial_ends_at")
    .eq("owner_id", user.id)
    .limit(1);

  // 1. Critical Error Handling: If the database is down, do NOT send them to onboarding.
  if (dbError) {
    console.error("Database fetch failed:", dbError.message);
    // Throwing an error here triggers your Next.js error.tsx boundary instead of 
    // confusing the user with a setup screen they already completed.
    throw new Error("Unable to load workspace data. Please refresh the page.");
  }

  const institute = institutes?.[0];

  // 2. Onboarding Check: Now we know for a fact that if institute is undefined, they are actually new.
  if (!institute || institute.onboarding_completed === false) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-[100dvh] bg-[#f4f7fb] text-slate-900 font-sans flex flex-col md:flex-row antialiased selection:bg-indigo-500/30">
      <CommandPalette />
      <Sidebar instituteName={institute.name || "Workspace"} />
      
      <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0 scroll-smooth relative">
        {/* 
          3. THE GLASS WALL (Trial Guard)
          We pass the pre-fetched data directly into the Guard so it doesn't 
          have to query the database again. 
        */}
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