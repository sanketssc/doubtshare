"use server";

import { db } from "@/db";
import { doubts } from "@/db/schema";
import { eq } from "drizzle-orm";
import Pusher from "pusher";

export async function closeDoubt({
  id,
  route,
}: {
  id: number;
  route: "student" | "tutor";
}) {
  const doubt = await db
    .update(doubts)
    .set({ status: "closed", updatedAt: new Date() })
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
  //console.log("close-doubt", doubt);

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: process.env.PUSHER_APP_CLUSTER!,
    useTLS: true,
  });

  pusher.trigger("doubts", `doubt-${id}`, {
    status: "closed",
  });
}
