"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitUTR(formData: FormData) {
  const supabase = await createClient();
  const utr = formData.get("utr") as string;

  // Securely get the logged-in owner
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Update their subscription status to pending verification
  const { error } = await supabase
    .from("institutes")
    .update({
      subscription_status: "pending_verification",
      utr_number: utr
    })
    .eq("owner_id", user.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to submit UTR");
  }

  // Instantly refresh the billing page 
  revalidatePath("/dashboard/billing");
}