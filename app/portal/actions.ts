"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function loginStudent(formData: FormData) {
  const username = formData.get("username") as string;
  const pin = formData.get("pin") as string;

  // We use the Service Role Key here to bypass RLS just for this strict verification check
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Run the strict database query
  const { data: student, error } = await supabase
    .from("students")
    .select("id, batch_name, institute_id, name")
    .eq("portal_username", username)
    .eq("portal_pin", pin)
    .single();

  // 2. If nothing returns, they typed it wrong
  if (error || !student) {
    return { error: "Invalid Gateway ID or PIN. Please try again." };
  }

  // 3. Verification Successful: Await and drop the secure cookies
  const cookieStore = await cookies(); // 🔥 THE DEEP FIX: Await the cookies promise
  
  cookieStore.set("student_id", student.id, { secure: true, httpOnly: true, maxAge: 60 * 60 * 24 * 30 }); // 30 days
  cookieStore.set("student_batch", student.batch_name, { secure: true, httpOnly: true, maxAge: 60 * 60 * 24 * 30 });
  cookieStore.set("institute_id", student.institute_id, { secure: true, httpOnly: true, maxAge: 60 * 60 * 24 * 30 });

  // 4. Send them to the dashboard
  redirect("/portal/dashboard");
}

export async function logoutStudent() {
  const cookieStore = await cookies(); // 🔥 THE DEEP FIX: Await the cookies promise
  
  cookieStore.delete("student_id");
  cookieStore.delete("student_batch");
  cookieStore.delete("institute_id");
  
  redirect("/portal");
}