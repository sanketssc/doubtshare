"use client";

import { login } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string>("");
  return (
    <div className="max-w-screen-lg mx-auto">
      <form
        className="flex flex-col gap-5 w-11/12 sm:w-4/5 mx-auto sm:p-20"
        action={async (formData: FormData) => {
          const error = await login(formData);
          if (error) {
            //console.log("error", error);
            setError(error.error);
          }
        }}
      >
        <h1 className="text-3xl font-bold text-center">Login</h1>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            id="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="password"
          />
        </div>

        <Button variant={"default"} type="submit">
          Login
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <div className="text-center">
        <p>Dont have an account?</p>
        <Link href="/register">Register</Link>
      </div>
    </div>
  );
}
