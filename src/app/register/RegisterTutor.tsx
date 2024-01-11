"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { validLanguage, validSubjects, validGrades } from "@/constants";
import { Checkbox } from "@/components/ui/checkbox";
import registerTutor from "@/actions/register-tutor";

export default function RegisterTutor() {
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
        const languages = formData.getAll("language") as string[];
        const subjects = formData.getAll("subject") as string[];
        const grades = (formData.getAll("grade") as string[]).map((grade) => {
          return parseInt(grade);
        });
        if (
          languages.length === 0 ||
          subjects.length === 0 ||
          grades.length === 0
        ) {
          setError("Please select a language, subject, and grade");
          return;
        }
        const error = await registerTutor({
          name: name,
          email: email,
          password: password,
          language: languages,
          subject: subjects,
          grade: grades,
          role: "tutor",
        });
        if (error) {
          setError(error.error);
        }
      }}
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
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
        <Label>Language(s)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 w-full gap-2">
          {validLanguage.map((lang, index) => {
            return (
              <div key={index} className="flex cursor-pointer gap-4">
                <Checkbox
                  id={`lang-${index}`}
                  key={index}
                  name="language"
                  value={lang}
                />
                <Label className="cursor-pointer" htmlFor={`lang-${index}`}>
                  {lang}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <Label>Subject(s)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 w-full gap-2">
          {validSubjects.map((subject, index) => {
            return (
              <div key={index} className="flex cursor-pointer gap-4">
                <Checkbox
                  id={`subject-${index}`}
                  key={index}
                  name="subject"
                  value={subject}
                />
                <Label className="cursor-pointer" htmlFor={`subject-${index}`}>
                  {subject}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <Label>Grade(s)</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 w-full gap-2">
          {validGrades.map((grade, index) => {
            return (
              <div key={index} className="flex cursor-pointer gap-4">
                <Checkbox
                  id={`grade-${index}`}
                  key={index}
                  name="grade"
                  value={grade.toString()}
                />
                <Label className="cursor-pointer" htmlFor={`grade-${index}`}>
                  {grade}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
      <Button variant={"default"} type="submit">
        Register
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
