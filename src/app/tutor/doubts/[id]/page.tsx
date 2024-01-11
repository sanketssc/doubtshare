import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { doubts, messages, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Chat from "@/components/Chat";
import { Button } from "@/components/ui/button";
import { assignToSelf } from "@/actions/assign-to-self";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { closeDoubt } from "@/actions/close-doubt";
import { reOpenDoubt } from "@/actions/reopen-doubt";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doubt | DoubtShare",
  description: "Doubt page",
};

export default async function DoubtPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id);
  const token = cookies().get("auth_token")?.value as string;
  const data = jwt.verify(token, process.env.JWT_SECRET as string);
  if (typeof data === "string") {
    redirect("/logout");
  }
  const doubt = await db.select().from(doubts).where(eq(doubts.id, id));
  if (!doubt[0]) redirect("/tutor");

  if (!doubt[0].tutorId) {
    return (
      <div className="min-h-[90dvh] flex flex-col justify-start max-w-screen-lg mx-auto py-5 px-2 sm:px-5">
        <Card className=" h-full sm:gap-10">
          <div className="flex justify-between items-center">
            <div className="px-4 sm:px-10">
              <Link href={"/tutor"}>
                <Button variant={"outline"}>Back</Button>
              </Link>
            </div>
            <CardHeader className="flex">
              <CardTitle className="flex gap-2 items-center">
                <p className="text-xl font-semibold">
                  Sub: {doubt[0].subject}{" "}
                </p>{" "}
                -<p className="text-lg italic">Lang: {doubt[0].language}</p>
              </CardTitle>
              <CardDescription className="overflow-ellipsis">
                Question: {doubt[0].question}
              </CardDescription>
            </CardHeader>
            <div className=" px-4 sm:px-10">
              <form
                action={async () => {
                  "use server";
                  await assignToSelf({ id: id, tutorId: data.id });
                }}
              >
                <Button variant={"default"}>Accept</Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    );
  }
  if (doubt[0].tutorId !== data.id) redirect("/tutor");
  const tutor = await db
    .select()
    .from(users)
    .where(eq(users.id, doubt[0].tutorId));
  const ms = await db.select().from(messages).where(eq(messages.doubtId, id));
  const msgs = ms.map((m) => ({
    message: m.message,
    senderName: m.senderName,
  }));

  return (
    <div className="min-h-[90dvh] flex flex-col justify-start max-w-screen-lg mx-auto py-5 px-2 sm:px-5">
      <Card className=" h-full sm:gap-10">
        <div className="flex justify-between items-center">
          <div className="px-4 sm:px-10">
            <Link href={"/tutor"}>
              <Button variant={"outline"}>Back</Button>
            </Link>
          </div>
          <CardHeader className="flex">
            <CardTitle className="flex gap-2 items-center">
              <p className="text-xl font-semibold">{doubt[0].subject} </p> -
              <p className="text-lg italic">{doubt[0].language}</p>
            </CardTitle>
            <CardDescription className="overflow-ellipsis">
              Q: {doubt[0].question}
            </CardDescription>
          </CardHeader>
          <div className=" px-4 sm:px-10">
            {doubt[0].status === "open" ? (
              <form
                action={async () => {
                  "use server";
                  await closeDoubt({ id: id, route: "tutor" });
                }}
              >
                <Button variant={"destructive"}>Close</Button>
              </form>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await reOpenDoubt({ id: id, route: "tutor" });
                }}
              >
                <Button variant={"default"}>Reopen</Button>
              </form>
            )}
          </div>
        </div>
        <CardContent>
          <Chat
            id={id}
            sender={tutor[0]}
            msgs={msgs}
            status={doubt[0].status}
          />
        </CardContent>
      </Card>
    </div>
  );
}
