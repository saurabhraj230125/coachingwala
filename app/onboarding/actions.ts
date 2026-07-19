"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function createInstitute(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("institute_name") as string;

  // 1. Authenticate the exact user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized");

  // 2. Insert the row and let the Database start the timer
  const { error: insertError } = await supabase
    .from("institutes")
    .insert({
      owner_id: user.id,
      name: name,
      onboarding_completed: true,
      subscription_status: 'trialing'
      // 🔥 THE DEEP SECRET: Notice we DO NOT send "trial_ends_at" here. 
      // By leaving it blank, the Supabase server calculates NOW() + 7 Days 
      // down to the exact millisecond they clicked the "Submit" button.
    });

  if (insertError) {
    console.error(insertError);
    throw new Error("Failed to create workspace.");
  }

  // 3. Send them to the dashboard, where TrialGuard immediately kicks in
  redirect("/dashboard");
}