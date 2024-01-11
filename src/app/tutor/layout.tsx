import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import DoubtListener from "./DoubtListener";
import { db } from "@/db";
import { tutors } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tokenCookie = cookies().get("auth_token");
  if (!tokenCookie) {
    redirect("/login");
  }

  const token = tokenCookie.value;
  if (!token) {
    redirect("/login");
  }

  const user = jwt.verify(token, process.env.JWT_SECRET as string);
  //@ts-ignore
  if (user.role === "student") redirect("/student");
  if (typeof user === "string") redirect("/logout");

  const tutor = await db
    .select()
    .from(tutors)
    .where(eq(tutors.userid, user.id));

  return (
    <div>
      {children}
      <DoubtListener tutor={tutor[0]} />
    </div>
  );
}
