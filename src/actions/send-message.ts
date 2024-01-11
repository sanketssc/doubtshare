"use server";
import { db } from "@/db";
import { User, doubts, messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import Pusher from "pusher";

export async function sendMessage({
  msg,
  id,
  sender,
}: {
  msg: string;
  id: string;
  sender: User;
}) {
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: process.env.PUSHER_APP_CLUSTER!,
    useTLS: true,
  });

  const message = await db.insert(messages).values({
    doubtId: parseInt(id),
    message: msg,
    sender: sender.id,
    senderName: sender.name,
  });
  //console.log("message", message);

  const updatedDoubt = await db
    .update(doubts)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(doubts.id, parseInt(id)))
    .returning({
      id: doubts.id,
    });
  //console.log("updatedDoubt", updatedDoubt);

  pusher.trigger("doubts", id, {
    message: msg,
    senderName: sender.name,
  });
}
