import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | DoubtShare",
  description: "Home page",
};

export default function Home() {
  const token = cookies().get("auth_token")?.value as string;
  if (token) {
    const data = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof data === "string") {
      redirect("/logout");
    }
    if (data.role === "student") {
      redirect("/student");
    } else if (data.role === "tutor") {
      redirect("/tutor");
    }
  }
  redirect("/login");
}
