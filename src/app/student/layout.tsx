import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import Link from "next/link";

export default function StudentLayout({
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
  if (user.role === "tutor") redirect("/tutor");

  return <div>{children}</div>;
}
