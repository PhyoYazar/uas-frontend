import { FlexBox } from "@/components/common/flex-box";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { dualYears } from "@/common/constants/helpers";
import { Subject } from "./SubjectTable";

const formSchema = z.object({
  name: z.string().min(1, { message: "Subject name is required" }),
  code: z.string().min(1, { message: "Code is required" }),
  instructor: z.string().min(1, { message: "Instructor name is required" }),
  year: z.string().min(1, { message: "Year is empty" }),
  semester: z.string().min(1, { message: "Semester is required" }),
  academicYear: z.string().min(1, { message: "Academic Year is required" }),
  examPercent: z
    .string()
    .min(1, { message: "Exam mark percentage is required" }),
  tutorialPercent: z
    .string()
    .min(1, { message: "Tutorial percentage is required" }),
  assignmentPercent: z
    .string()
    .min(1, { message: "Assignment percentage is required" }),
  labPercent: z.string().min(1, { message: "Lab percentage is required" }),
  practicalPercent: z
    .string()
    .min(1, { message: "Practical percentage is required" }),
});

type EditSubjectProps = {
  subject: Subject;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditSubject = (props: EditSubjectProps) => {
  const { subject, open, setOpen } = props;

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subject.name,
      code: subject.code,
      instructor: subject.instructor,
      year: subject.year,
      semester: subject.semester,
      academicYear: subject.academicYear,
      examPercent: subject.exam + "",
      practicalPercent: subject.practical + "",
      tutorialPercent: subject.tutorial + "",
      labPercent: subject.lab + "",
      assignmentPercent: subject.assignment + "",
    },
  });

  // const examPercentValue = +form.watch("examPercentage");
  // const cwPercent = examPercentValue === 0 ? "" : 100 - examPercentValue + "";

  const updateSubjectMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (updSub: any) => axios.put(`subjects/${subject.id}`, updSub),
    onSuccess() {
      toast.success("Subject has been updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["all-subjects"],
      });

      setOpen(false);
    },
    onError(error) {
      console.log("hello error", error);

      toast.error("Fail to update the subject.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // if (isNaN(+values.examPercent)) {
    //   toast.warning("Exam Percentage must be a number");
    //   return;
    // }

    const totalPercent =
      +values.examPercent +
      +values.labPercent +
      +values.assignmentPercent +
      +values.tutorialPercent +
      +values.practicalPercent;

    if (totalPercent !== 100) {
      toast.warning("Exam and Course work's total percentage must be 100.");
      return;
    }

    updateSubjectMutation.mutate({
      name: values.name,
      code: values.code,
      year: values.year,
      academicYear: values.academicYear,
      semester: values.semester,
      instructor: values.instructor,
      exam: +values.examPercent,
      practical: +values.practicalPercent,
      tutorial: +values.tutorialPercent,
      lab: +values.labPercent,
      assignment: +values.assignmentPercent,
    });
  }

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Edit subject</DialogTitle>
          <DialogDescription>
            Make changes to your subject here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full p-4"
          >
            <div className="items-start  grid grid-cols-2 gap-x-12 gap-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Type subject name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Academic Year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dualYears.map((year) => (
                          <SelectItem value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Type subject code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="First Year">First Year</SelectItem>
                        <SelectItem value="Second Year">Second Year</SelectItem>
                        <SelectItem value="Third Year">Third Year</SelectItem>
                        <SelectItem value="Fourth Year">Fourth Year</SelectItem>
                        <SelectItem value="Fifth Year">Fifth Year</SelectItem>
                        <SelectItem value="Sixth Year">Sixth Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor</FormLabel>
                    <FormControl>
                      <Input placeholder="Type instructor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semester</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="first">1</SelectItem>
                        <SelectItem value="second">2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="examPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Percentage</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type exam percentage"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tutorialPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tutorial Percentage</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tutorial percentage"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="practicalPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Practical Percentage</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Practical percentage"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="labPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lab Percentage</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lab percentage"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignmentPercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Percentage</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Assignment percentage"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FlexBox className="justify-end">
              <Button
                className="w-40"
                type="submit"
                disabled={updateSubjectMutation.isPending}
              >
                Save
              </Button>
            </FlexBox>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
