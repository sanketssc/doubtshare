import { validSubjects } from "@/constants";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createDoubt } from "@/actions/create-doubt";
import { Button } from "@/components/ui/button";

export default function Create() {
  return (
    <div className="px-3 sm:px-20 py-10">
      <h1 className="text-3xl font-bold text-center mb-10">Create Doubt</h1>
      <form action={createDoubt} className="flex flex-col gap-5">
        <div>
          <Label>Subject</Label>
          <Select name="subject" required>
            <SelectTrigger>
              <SelectValue
                defaultValue={"english"}
                placeholder="Select a subject"
              ></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {validSubjects.map((sub, index) => {
                  //console.log("sub", sub);
                  return (
                    <SelectItem key={index} value={sub}>
                      {sub}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="question">Question</Label>
          <Textarea
            name="question"
            id="question"
            required
            placeholder="question"
          />
        </div>
        <Button variant={"default"} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
