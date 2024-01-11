"use server";

import jwt from "jsonwebtoken";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await db.select().from(users).where(eq(users.email, email));
  //console.log(user);

  if (user.length === 0) {
    //console.log("Email does not exist");
    return {
      error: "Email does not exist",
    };
  }

  const validPassword = await bcrypt.compare(password, user[0].password);

  if (!validPassword) {
    //console.log("Invalid password");
    return {
      error: "Invalid password",
    };
  }

  const token = jwt.sign(
    {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      role: user[0].role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "30d",
    }
  );

  cookies().set("auth_token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  redirect("/");
}
