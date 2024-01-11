"use server";

import { db } from "@/db";
import { doubts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function assignToSelf({
  id,
  tutorId,
}: {
  id: number;
  tutorId: number;
}) {
  const doubt = await db
    .update(doubts)
    .set({ tutorId: tutorId })
    .where(eq(doubts.id, id))
    .returning({
      id: doubts.id,
      grade: doubts.grade,
      language: doubts.language,
      subject: doubts.subject,
      question: doubts.question,
      studentId: doubts.studentId,
      status: doubts.status,
      tutorId: doubts.tutorId,
    });
  //console.log("ats-doubt", doubt);

  revalidatePath(`/tutor/doubts/${id}`);
  redirect(`/tutor/doubts/${id}?assigned=true`);
}
