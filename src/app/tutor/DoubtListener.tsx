"use client";

import { Tutor } from "@/db/schema";
import { useRouter } from "next/navigation";
import pusher from "pusher-js";
import { useEffect } from "react";
import { toast } from "sonner";

export default function DoubtListener({ tutor }: { tutor: Tutor }) {
  const router = useRouter();
  useEffect(() => {
    //console.log("subscribing");
    const pusherClient = new pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
    });
    const channel = pusherClient.subscribe("doubts");
    channel.bind(
      "new",
      (data: {
        id: number;
        language: string;
        grade: number;
        question: string;
        subject: string;
      }) => {
        //console.log(data);
        //console.log(tutor);
        if (!tutor.language.includes(data.language)) return;
        if (!tutor.grade.includes(data.grade)) return;
        if (!tutor.subject.includes(data.subject)) return;
        toast(`${data.subject}-${data.language}`, {
          description: data.question,
          action: {
            label: "Answer",
            onClick: () => {
              router.push(`/tutor/doubts/${data.id}`);
            },
          },
        });
      }
    );
    //console.log("subscribed");
    return () => {
      //console.log("unsubscribing");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div></div>;
}
