"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function publishExamAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return { error: "Authentication failed. Please sign in." };

  try {
    const title = formData.get("title") as string;
    const target = formData.get("batch_target") as string;
    const duration = formData.get("duration") as string;
    const examType = formData.get("exam_type") as string; 
    const questionsData = formData.get("questions_data") as string; 
    const configData = formData.get("config_data") as string; 

    const { data: institute, error: instError } = await supabase
      .from("institutes")
      .select("id")
      .eq("owner_id", user.id)
      .single();

    if (instError || !institute) return { error: "Institute workspace not found." };

    const { data: exam, error: examError } = await supabase.from("exams").insert({
      institute_id: institute.id,
      title: title || "Untitled Exam",
      batch_target: target || "All Batches",
      total_marks: 300, 
      duration_minutes: parseInt(duration) || 180,
      is_published: true,
      exam_type: examType || 'cbt',
      advanced_config: configData ? JSON.parse(configData) : {}
    }).select().single();

    if (examError || !exam) return { error: "Failed to create master exam record." };

    if (examType === 'cbt' && questionsData) {
      const questions = JSON.parse(questionsData);
      const questionInserts = questions.map((q: any) => ({
        exam_id: exam.id,
        question_text: q.q_text,
        option_a: q.opt_a,
        option_b: q.opt_b,
        option_c: q.opt_c,
        option_d: q.opt_d,
        correct_option: q.correct
      }));
      
      const { error: qError } = await supabase.from("exam_questions").insert(questionInserts);
      if (qError) return { error: "Exam created, but questions failed to save." };
    }

    revalidatePath("/dashboard/exams");
    return { success: true };

  } catch (err: any) {
    console.error("Server Action Exception:", err);
    return { error: "A fatal server error occurred." };
  }
}