"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// 🔥 We deleted the old email/password signup and login. 
// Our premium app relies exclusively on Google OAuth and Phone OTP handled in the UI.

export async function signOut() {
  const supabase = await createClient();
  
  // Securely terminate the session on the server
  await supabase.auth.signOut();
  
  // Hard redirect the user back to the login page
  return redirect("/login");
}