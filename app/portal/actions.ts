"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Bypass RLS securely to verify the student
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function loginStudent(formData: FormData) {
  const username = formData.get("username") as string;
  const pin = formData.get("pin") as string;

  // 1. Find the student and explicitly select batch and institute_id
  const { data: student, error } = await supabase
    .from("students")
    .select("id, name, institute_id, batch")
    .eq("username", username)
    .eq("pin", pin)
    .single();

  if (error || !student) {
    throw new Error("Invalid username or PIN. Please check your WhatsApp message.");
  }

  // 2. Await cookies and set all three precisely as your dashboard expects
  const cookieStore = await cookies();
  
  cookieStore.set("student_id", student.id, { httpOnly: true, path: "/" });
  cookieStore.set("institute_id", student.institute_id, { httpOnly: true, path: "/" });
  cookieStore.set("student_batch", student.batch || "General", { httpOnly: true, path: "/" });

  // 3. Send them into the portal
  redirect("/portal/dashboard");
}

export async function logoutStudent() {
  const cookieStore = await cookies();
  cookieStore.delete("student_id");
  cookieStore.delete("institute_id");
  cookieStore.delete("student_batch");
  redirect("/portal");
}