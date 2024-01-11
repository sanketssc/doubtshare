"use server";
import jwt from "jsonwebtoken";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users, students } from "@/db/schema";
import { eq } from "drizzle-orm";

type StudentData = {
  name: string;
  email: string;
  password: string;
  role: string;
  grade: number;
  language: string;
};

export default async function registerStudent(studentData: StudentData) {
  //console.log("studentData", studentData);
  const userExists = await db
    .select()
    .from(users)
    .where(eq(users.email, studentData.email));

  //console.log("userExists", userExists);
  if (userExists.length > 0) {
    return {
      error: "Email already exists",
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(studentData.password, salt);

  const user = await db
    .insert(users)
    .values({
      name: studentData.name,
      email: studentData.email,
      password: hashedPassword,
      role: studentData.role,
    })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    });

  const studentEntry = await db
    .insert(students)
    .values({
      grade: studentData.grade,
      language: studentData.language,
      userid: user[0].id,
    })
    .returning({
      id: students.id,
      grade: students.grade,
      language: students.language,
      userid: students.userid,
    });
  //console.log("studentEntry", studentEntry);

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
