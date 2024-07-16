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
  studentName: z.string().min(1, { message: "Student name is required" }),
  rollNumber: z.string().min(1, { message: "Roll Number is required" }),
  year: z.string().min(1, { message: "Year is empty" }),
  academicYear: z.string().min(1, { message: "Academic Year is required" }),
});

type CreateStudent = {
  studentName: string;
  year: string;
  academicYear: string;
  rollNumber: number;
};

export const StudentCreate = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      rollNumber: "",
      year: "",
      academicYear: "",
    },
  });

  const createSubjectMutation = useMutation({
    mutationFn: (newStd: CreateStudent) => axios.post("student", newStd),
    onSuccess(data) {
      const studentId = data?.data?.id;

      toast.success("Student has been created", {
        description: formatDateString(data.data.dateUpdated),
        // action: {
        //   label: "Undo",
        //   onClick: () => console.log("Undo"),
        // },
      });

      if (studentId) navigate("/student");
    },
    onError(error) {
      console.log("hello error", error);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((error as any)?.response?.status === 409) {
        toast.error(error.message + " Student is not unique,");
      } else {
        toast.error("Fail to create the student.");
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createSubjectMutation.mutate({
      studentName: values.studentName,
      rollNumber: +values.rollNumber,
      year: values.year,
      academicYear: values.academicYear,
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
              Creating Student
            </Text>

            <div className="items-start  grid grid-cols-2 gap-x-12 gap-y-8">
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Type student name" {...field} />
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
                          <SelectValue placeholder="Start Year" />
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
                name="rollNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Roll Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Type roll number" {...field} />
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
