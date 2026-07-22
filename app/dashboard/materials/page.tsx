import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MaterialVaultUI from "./MaterialVaultUI"; // We will create this next

export const dynamic = "force-dynamic";

export default async function DashboardMaterialsPage() {
  const supabase = await createClient();
  
  // 1. Authenticate the Owner
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Get their specific institute ID securely from the database
  const { data: institute } = await supabase
    .from("institutes")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!institute) redirect("/dashboard");

  // 3. Render the deeply polished UI
  return <MaterialVaultUI instituteId={institute.id} />;
}