"use server";

import { createClient } from "@/utils/supabase/server";

export async function createInstituteAction(formData: FormData) {
  const supabase = await createClient();
  
  const name = formData.get("institute_name") as string;
  const examsTaught = formData.get("exams_taught") as string; 
  const studentScale = formData.get("student_scale") as string;
  const primaryPainPoint = formData.get("primary_pain_point") as string;

  // 1. Authenticate the exact user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Authentication failed. Please sign in again." };
  }

  // 2. Insert/Update the row securely on the backend
  const { error: dbError } = await supabase
    .from("institutes")
    .upsert({
      owner_id: user.id,
      name: name,
      exams_taught: examsTaught ? JSON.parse(examsTaught) : [],
      student_scale: studentScale,
      primary_pain_point: primaryPainPoint,
      onboarding_completed: true,
      subscription_status: 'trialing',
      phone_number: user.phone || "NOT_PROVIDED"
    }, { onConflict: 'owner_id' });

  if (dbError) {
    console.error("Database Error:", dbError);
    return { error: dbError.message };
  }

  // 3. Return success so the Client UI can finish its loading animation
  return { success: true };
}