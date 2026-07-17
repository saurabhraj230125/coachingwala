import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "./components/Sidebar";
import CommandPalette from "./components/CommandPalette";

// 🔥 THE DEEP FIX: These two lines explicitly tell Vercel's production servers 
// to NEVER cache this layout. It forces a fresh database read every single time.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // 1. Security Check: If no user (or an auth error occurs), kick to login
  if (authError || !user) {
    redirect("/login");
  }

  // 2. Onboarding Check: Fetch their absolute latest institute data from the database
  const { data: institute, error: dbError } = await supabase
    .from("institutes")
    .select("name, onboarding_completed")
    .eq("owner_id", user.id)
    .single();

  // 3. The Gatekeeper: If they have no database entry or haven't finished onboarding, route them to setup.
  // We added `dbError` here to catch cases where the row simply doesn't exist yet.
  if (dbError || !institute || institute.onboarding_completed === false) {
    redirect("/onboarding");
  }

  // 4. If they pass all checks, load the premium dashboard
  return (
    <div className="min-h-[100dvh] bg-[#f4f7fb] text-slate-900 font-sans flex flex-col md:flex-row antialiased selection:bg-indigo-500/30">
      <CommandPalette />
      <Sidebar instituteName={institute.name} />
      <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0 scroll-smooth">
        {children}
      </main>
    </div>
  );
}