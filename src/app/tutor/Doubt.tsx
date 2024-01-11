import React from "react";
import type { Doubt } from "@/db/schema";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Doubt({ doubt }: { doubt: Doubt }) {
  return (
    <Link href={`/tutor/doubts/${doubt.id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{doubt.subject}</CardTitle>
          <CardDescription className="overflow-ellipsis">
            {doubt.question}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
