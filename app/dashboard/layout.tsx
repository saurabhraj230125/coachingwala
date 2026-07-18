import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "./components/Sidebar";
import CommandPalette from "./components/CommandPalette";

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

  // 🔥 THE DEEP FIX: Replaced .single() with .limit(1)
  // If the database accidentally has two rows, .single() throws a fatal error.
  // .limit(1) safely grabs the first one without ever crashing.
  const { data: institutes } = await supabase
    .from("institutes")
    .select("name, onboarding_completed")
    .eq("owner_id", user.id)
    .limit(1);

  const institute = institutes?.[0];

  // If no database entry exists or onboarding is false, trigger setup.
  if (!institute || institute.onboarding_completed === false) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-[100dvh] bg-[#f4f7fb] text-slate-900 font-sans flex flex-col md:flex-row antialiased selection:bg-indigo-500/30">
      <CommandPalette />
      <Sidebar instituteName={institute.name || "Workspace"} />
      <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0 scroll-smooth">
        {children}
      </main>
    </div>
  );
}