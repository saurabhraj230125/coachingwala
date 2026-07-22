import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ExamEngine from "./ExamEngine";

export const dynamic = "force-dynamic";

export default async function ExamsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <ExamEngine />;
}