import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { db } from "@/db";
import { type Doubt as DoubtType, doubts, users, tutors } from "@/db/schema";
import { and, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import Doubt from "./Doubt";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutor | DoubtShare",
  description: "Tutor page",
};

export default async function page() {
  const token = cookies().get("auth_token");
  if (!token) redirect("/login");
  const user = jwt.verify(token.value, process.env.JWT_SECRET as string);
  if (typeof user === "string") redirect("/logout");
  const tutor = await db
    .select()
    .from(tutors)
    .where(eq(tutors.userid, user.id));
  //console.log(tutor);
  if (tutor.length === 0) redirect("/logout");

  const dts = await db
    .select()
    .from(doubts)
    .where(
      and(
        inArray(doubts.grade, tutor[0].grade),
        inArray(doubts.subject, tutor[0].subject),
        inArray(doubts.language, tutor[0].language),
        or(eq(doubts.tutorId, tutor[0].userid), isNull(doubts.tutorId))
      )
    )
    .orderBy(desc(doubts.updatedAt));
  //console.log("dts", dts);
  const ongoing = dts.filter((dt) => dt.status === "open");
  const assigned = ongoing.filter((dt) => dt.tutorId === tutor[0].userid);
  const unassigned = ongoing.filter((dt) => dt.tutorId === null);
  const completed = dts.filter((dt) => dt.status === "closed");
  return (
    <div className="max-w-screen-xl mx-auto p-5">
      <Tabs defaultValue="ongoing">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ongoing">Open</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
          <TabsTrigger value="completed">Closed</TabsTrigger>
          <TabsTrigger value="logout">Logout</TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing">
          {unassigned.length > 0 ? (
            <>
              {unassigned.map((dt: DoubtType) => (
                <Doubt key={dt.id} doubt={dt} />
              ))}
            </>
          ) : (
            <div className="text-center text-gray-500">No ongoing doubts</div>
          )}
        </TabsContent>
        <TabsContent value="assigned">
          {assigned.length > 0 ? (
            <>
              {assigned.map((dt: DoubtType) => (
                <Doubt key={dt.id} doubt={dt} />
              ))}
            </>
          ) : (
            <div className="text-center text-gray-500">No assigned doubts</div>
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
        <TabsContent value="logout">
          <div className="flex items-center justify-center min-h-[80dvh] h-full">
            <form
              action={async () => {
                "use server";
                cookies().delete("auth_token");
                redirect("/login");
              }}
            >
              <Button type="submit" variant={"outline"}>
                Logout
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
