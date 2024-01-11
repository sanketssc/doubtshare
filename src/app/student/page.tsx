import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { db } from "@/db";
import { type Doubt as DoubtType, doubts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import Doubt from "./Doubt";
import Create from "./Create";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student | DoubtShare",
  description: "Student page",
};

export default async function page() {
  const token = cookies().get("auth_token");
  if (!token) redirect("/login");
  const user = jwt.verify(token.value, process.env.JWT_SECRET as string);
  if (typeof user === "string") redirect("/logout");
  const dts = await db
    .select()
    .from(doubts)
    .where(eq(doubts.studentId, user.id))
    .orderBy(desc(doubts.updatedAt));
  const ongoing = dts.filter((dt) => dt.status === "open");
  const completed = dts.filter((dt) => dt.status === "closed");
  return (
    <div className="max-w-screen-xl mx-auto p-5">
      <Tabs defaultValue="ongoing">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="logout">Logout</TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing">
          {ongoing.length > 0 ? (
            <>
              {ongoing.map((dt: DoubtType) => (
                <Doubt key={dt.id} doubt={dt} />
              ))}
            </>
          ) : (
            <div className="text-center text-gray-500">No ongoing doubts</div>
          )}
        </TabsContent>
        <TabsContent value="completed">
          {completed.length > 0 ? (
            <>
              {completed.map((dt: DoubtType) => (
                <Doubt key={dt.id} doubt={dt} />
              ))}
            </>
          ) : (
            <div className="text-center text-gray-500">No Completed doubts</div>
          )}
        </TabsContent>
        <TabsContent value="create">
          <Create />
        </TabsContent>
        <TabsContent value="logout">
          <div className="flex items-center justify-center min-h-[80dvh] h-full">
            <form
              action={async () => {
                "use server";
                cookies().delete("auth_token");
              }}
            >
              <Button type="submit" variant={"outline"}>
                Log Out
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
