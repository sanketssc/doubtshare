import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

import RegisterStudent from "./RegisterStudent";
import RegisterTutor from "./RegisterTutor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | DoubtShare",
  description: "Register for a new account",
};

export default function RegisterPage() {
  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="flex flex-col gap-5 w-11/12 sm:w-4/5 mx-auto sm:px-20 py-5">
        <h1 className="text-3xl font-bold text-center">Register</h1>
        <Tabs defaultValue="student">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="tutor">Tutor</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <RegisterStudent />
          </TabsContent>
          <TabsContent value="tutor">
            <RegisterTutor />
          </TabsContent>
        </Tabs>
      </div>

      <div className="text-center">
        <p>Already have an account?</p>
        <Link href="/login">Login</Link>
      </div>
    </div>
  );
}
