"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const instituteName = formData.get("instituteName") as string;
  const phone = formData.get("phone") as string;

  // 1. Register the core user account securely
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `http://localhost:3000/auth/callback?next=/dashboard`,
    }
  });

  if (authError || !authData.user) {
    return redirect("/login?error=" + encodeURIComponent(authError?.message || "Auth failed"));
  }

  // 2. Initialize the isolated multi-tenant database tenant row
  const { error: dbError } = await supabase.from("institutes").insert({
    owner_id: authData.user.id,
    name: instituteName,
    phone_number: phone,
    subscription_status: "trialing"
  });

  if (dbError) {
    return redirect("/login?error=Failed to initialize workspace data");
  }

  return redirect("/dashboard");
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Sign in the owner using secure password comparison
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?error=Invalid login credentials");
  }

  return redirect("/dashboard");
}