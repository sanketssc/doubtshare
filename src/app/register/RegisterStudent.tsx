"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { validLanguage, validSubjects, validGrades } from "@/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import registerStudent from "@/actions/register-student";

export default function RegisterStudent() {
  const [error, setError] = useState<string>("");
  return (
    <form
      className="flex flex-col gap-5 pt-10"
      action={async (formData: FormData) => {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        if (!name || !email || !password) {
          setError("Please fill out all fields");
          return;
        }
        const language = formData.get("language") as string;
        const grade = formData.get("grade") as string;
        if (!language || !grade) {
          setError("Please select a language and grade");
          return;
        }
        const error = await registerStudent({
          name: name,
          email: email,
          password: password,
          language: language,
          grade: await parseInt(grade),
          role: "student",
        });

        if (error) {
          setError(error.error);
        }
      }}
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          className="autofill:!bg-red-500"
          name="name"
          id="name"
          type="text"
          autoComplete="name"
          required
          placeholder="name"
        />
      </div>
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
          required
          autoComplete="current-password"
          placeholder="password"
        />
      </div>
      <div>
        <Label>Language</Label>
        <Select name="language" required>
          <SelectTrigger>
            <SelectValue
              defaultValue={"english"}
              placeholder="Select a language"
            ></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {validLanguage.map((lang, index) => {
                return (
                  <SelectItem key={index} value={lang}>
                    {lang}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Grade</Label>
        <Select name="grade">
          <SelectTrigger name="grade">
            <SelectValue
              defaultValue={"10"}
              placeholder="Select grade"
            ></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {validGrades.map((grade, index) => {
                return (
                  <SelectItem key={index} value={grade.toString()}>
                    {grade}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button variant={"default"} type="submit">
        Register
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
