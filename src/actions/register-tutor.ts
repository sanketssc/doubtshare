"use server";
import jwt from "jsonwebtoken";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users, tutors } from "@/db/schema";
import { eq } from "drizzle-orm";

type TutorData = {
  name: string;
  email: string;
  password: string;
  role: string;
  grade: number[];
  language: string[];
  subject: string[];
};

export default async function registerTutor(tutorData: TutorData) {
  const userExists = await db
    .select()
    .from(users)
    .where(eq(users.email, tutorData.email));

  if (userExists.length > 0) {
    return {
      error: "Email already exists, Please login",
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(tutorData.password, salt);

  const user = await db
    .insert(users)
    .values({
      name: tutorData.name,
      email: tutorData.email,
      password: hashedPassword,
      role: tutorData.role,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    });

  const TutorEntry = await db
    .insert(tutors)
    .values({
      subject: tutorData.subject,
      grade: tutorData.grade,
      language: tutorData.language,
      userid: user[0].id,
    })
    .returning({
      id: tutors.id,
      grade: tutors.grade,
      language: tutors.language,
      subject: tutors.subject,
      userid: tutors.userid,
    });
  //console.log("TutorEntry", TutorEntry);

  const token = jwt.sign(user[0], process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });

  cookies().set("auth_token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  redirect("/");
}
