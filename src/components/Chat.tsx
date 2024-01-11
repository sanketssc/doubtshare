"use client";
import { sendMessage } from "@/actions/send-message";
import { Input } from "@/components/ui/input";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { User } from "@/db/schema";
import { useRouter } from "next/navigation";

export default function Chat({
  id,
  sender,
  msgs,
  status,
}: {
  id: number;
  sender: User;
  msgs: { message: string; senderName: string }[];
  status: "open" | "closed";
}) {
  //console.log(status);
  const router = useRouter();
  const [messages, setMessages] = useState<
    {
      message: string;
      senderName: string;
    }[]
  >(msgs);
  const [msg, setMsg] = useState("");
  const [isClosed, setIsClosed] = useState(status === "closed");
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
    });
    const channel = pusher.subscribe("doubts");
    channel.bind(
      `${id}`,
      function (data: { message: string; senderName: string }) {
        //console.log("new doubt");
        setMessages((prev) => [...prev, data]);
      }
    );

    channel.bind(`doubt-${id}`, function (data: { status: string }) {
      if (data.status === "closed") setIsClosed(true);
      else setIsClosed(false);

      router.push(`/${sender.role}/doubts/${id}?d=${Date.now()}`);
    });

    return () => {
      //console.time("disconnecting");
      pusher.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col justify-between h-full min-h-[75dvh] gap-10 sm:px-4">
      <div className="flex flex-col gap-3 sm:gap-1">
        {messages.map((message, i) => (
          <div className="flex gap-2" key={i}>
            <p className="font-semibold italic underline">
              {message.senderName === sender.name ? "You" : message.senderName}
            </p>
            <p className="font-semibold">:</p>
            <p className="font-normal">{message.message}</p>
          </div>
        ))}
      </div>
      {isClosed ? (
        <div className="text-center text-gray-500">This doubt is closed</div>
      ) : (
        <form
          className="flex gap-2 sm:gap-5 sm:px-10"
          action={async () => {
            await sendMessage({ id: id.toString(), msg, sender: sender });
            setMsg("");
          }}
        >
          <Input
            type="text"
            value={msg}
            placeholder="Type your message here"
            onChange={(e) => setMsg(e.target.value)}
          />
          <Button variant={"default"} type="submit">
            Send
          </Button>
        </form>
      )}
    </div>
  );
}
