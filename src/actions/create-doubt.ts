"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { doubts, students } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Pusher from "pusher";

export async function createDoubt(formData: FormData) {
  const subject = formData.get("subject") as string;
  const question = formData.get("question") as string;
  const token = cookies().get("auth_token")?.value;
  const studentData = jwt.verify(token!, process.env.JWT_SECRET!);
  if (typeof studentData === "string") {
    return;
  }
  const studentId = studentData.id;
  //console.log("studentData", studentData);
  const student = await db
    .select()
    .from(students)
    .where(eq(students.userid, studentId));
  //console.log("student", student);
  const grade = student[0].grade;
  const language = student[0].language;
  const status = "open";

  const doubt = await db
    .insert(doubts)
    .values({
      grade: grade,
      language: language,
      subject: subject,
      question: question,
      studentId: studentId,
      status: status,
    })
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
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: process.env.PUSHER_APP_CLUSTER!,
    useTLS: true,
  });

  pusher.trigger("doubts", "new", {
    id: doubt[0].id,
    language,
    grade,
    subject,
    question,
  });

  redirect(`/student/doubts/${doubt[0].id}`);
}
