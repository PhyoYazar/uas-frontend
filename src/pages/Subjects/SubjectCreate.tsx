import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Button } from "@/components/ui/button";
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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { dualYears } from "@/common/constants/helpers";
import { BackBtn } from "@/components/common/back-button";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

// Extend dayjs with the plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const formatDateString = (dateString: string): string => {
  // Parse the date string and convert it to the desired format
  const date = dayjs(dateString);
  return date.tz("UTC").format("dddd, MMMM DD, YYYY [at] h:mm A");
};

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

type CreateSubject = {
  name: string;
  code: string;
  year: string;
  academicYear: string;
  semester: string;
  instructor: string;
  exam: number;
  tutorial: number;
  practical: number;
  lab: number;
  assignment: number;
};

export const SubjectCreate = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      instructor: "",
      year: "",
      semester: "",
      academicYear: "",
      examPercent: "",
      practicalPercent: "0",
      tutorialPercent: "",
      labPercent: "0",
      assignmentPercent: "",
    },
  });

  // const examPercentValue = +form.watch("examPercent");
  // const cwPercent = examPercentValue === 0 ? "" : 100 - examPercentValue + "";

  const createSubjectMutation = useMutation({
    mutationFn: (newSub: CreateSubject) => axios.post("subject", newSub),
    onSuccess(data) {
      const subjectId = data?.data?.id;

      toast.success("Subject has been created", {
        description: formatDateString(data.data.dateUpdated),
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
      });

      if (subjectId) navigate(subjectId);
    },
    onError(error) {
      console.log("hello error", error);

      toast.error("Fail to create the subject.");
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

    createSubjectMutation.mutate({
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
    <section className="space-y-4">
      <BackBtn />

      <FlexBox className="">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-[800px] rounded-md border border-gray-200 shadow-sm p-4 max-w-[900px]"
          >
            <Text className="text-xl font-semibold text-start">
              Creating Subject
            </Text>

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
                          <SelectItem key={year + "dafsklje2"} value={year}>
                            {year}
                          </SelectItem>
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
                disabled={createSubjectMutation.isPending}
              >
                Create
              </Button>
            </FlexBox>
          </form>
        </Form>
      </FlexBox>
    </section>
  );
};
