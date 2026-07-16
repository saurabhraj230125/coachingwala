import { createClient } from "@/utils/supabase/server";
import Sidebar from "./components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch only the name to keep the server response blazing fast
  const { data: institute } = await supabase
    .from("institutes")
    .select("name")
    .eq("owner_id", user?.id)
    .single();

  return (
    <div className="min-h-[100dvh] bg-[#f4f7fb] text-slate-900 font-sans flex flex-col md:flex-row antialiased selection:bg-indigo-500/30">
      
      {/* 
        This is the new Client Component we built. 
        It handles the mobile slide-out logic while keeping your layout a Server Component! 
      */}
      <Sidebar instituteName={institute?.name || "Workspace"} />

      {/* Main Content Area: Notice the pb-20 for mobile thumb scrolling */}
      <main className="flex-1 min-w-0 overflow-y-auto pb-20 md:pb-0 scroll-smooth">
        {children}
      </main>
      
    </div>
  );
}