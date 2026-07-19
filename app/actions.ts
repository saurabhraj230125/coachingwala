"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Bypass RLS securely to verify the student using the Service Role Key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function loginStudent(formData: FormData) {
  const username = formData.get("username") as string;
  const pin = formData.get("pin") as string;

  // 1. Find the student
  const { data: student, error } = await supabase
    .from("students")
    .select("id, name, institute_id, batch")
    .eq("username", username)
    .eq("pin", pin)
    .single();

  // 2. Return an error safely if they type the wrong PIN
  if (error || !student) {
    return { error: "Invalid username or PIN. Please check your WhatsApp message." };
  }

  // 3. Set the 3 secret cookies
  const cookieStore = await cookies();
  cookieStore.set("student_id", student.id, { httpOnly: true, path: "/" });
  cookieStore.set("institute_id", student.institute_id, { httpOnly: true, path: "/" });
  cookieStore.set("student_batch", student.batch || "General", { httpOnly: true, path: "/" });

  // 4. Send them to the dashboard (No /portal needed anymore!)
  redirect("/dashboard");
}

export async function logoutStudent() {
  const cookieStore = await cookies();
  cookieStore.delete("student_id");
  cookieStore.delete("institute_id");
  cookieStore.delete("student_batch");
  
  // Kick them back to the login screen
  redirect("/");
}