"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function publishExamAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const title = formData.get("title") as string;
  const target = formData.get("batch_target") as string;
  const duration = formData.get("duration") as string;
  const examType = formData.get("exam_type") as string; // 'cbt' or 'pdf'
  const questionsData = formData.get("questions_data") as string; 
  const watermarkData = formData.get("watermark_data") as string;

  const { data: institute } = await supabase
    .from("institutes")
    .select("id")
    .eq("owner_id", user?.id)
    .single();

  if (!institute) return { error: "Institute not found" };

  // 1. Create the Master Exam Record
  const { data: exam, error: examError } = await supabase.from("exams").insert({
    institute_id: institute.id,
    title,
    batch_target: target,
    total_marks: 300, 
    duration_minutes: parseInt(duration),
    is_published: true,
    exam_type: examType,
    watermark_config: watermarkData ? JSON.parse(watermarkData) : null
  }).select().single();

  if (examError || !exam) return { error: "Failed to create exam" };

  // 2. Insert Multiple Questions (If CBT mode)
  if (examType === 'cbt' && questionsData) {
    const questions = JSON.parse(questionsData);
    const questionInserts = questions.map((q: any) => ({
      exam_id: exam.id,
      question_text: q.q_text,
      option_a: q.opt_a,
      option_b: q.opt_b,
      option_c: q.opt_c,
      option_d: q.opt_d,
      correct_option: q.correct,
    }));
    
    await supabase.from("exam_questions").insert(questionInserts);
  }

  // 3. Refresh the page data
  revalidatePath("/dashboard/exams");
  return { success: true };
}