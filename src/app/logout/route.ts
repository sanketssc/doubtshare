import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export function GET(request: Request) {
  cookies().delete("auth_token");
  redirect("/login");
}
