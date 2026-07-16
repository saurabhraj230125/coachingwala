"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createExamAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const title = formData.get("title") as string;
  const target = formData.get("batch_target") as string;
  const duration = formData.get("duration") as string;
  
  const { data: institute } = await supabase.from("institutes").select("id").eq("owner_id", user?.id).single();

  if (institute) {
    const { data: exam } = await supabase.from("exams").insert({
      institute_id: institute.id,
      title,
      batch_target: target,
      total_marks: 4, 
      duration_minutes: parseInt(duration),
      is_published: true
    }).select().single();

    const qText = formData.get("q_text") as string;
    if (qText && exam) {
      await supabase.from("exam_questions").insert({
        exam_id: exam.id,
        question_text: qText,
        option_a: formData.get("opt_a") as string,
        option_b: formData.get("opt_b") as string,
        option_c: formData.get("opt_c") as string,
        option_d: formData.get("opt_d") as string,
        correct_option: formData.get("correct") as string,
      });
    }
    revalidatePath("/dashboard/exams");
  }
}