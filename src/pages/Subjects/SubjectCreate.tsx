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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  code: z.string(),
  instructor: z.string(),
  year: z.string(),
  semester: z.string(),
  academicStartYear: z.string(),
  academicEndYear: z.string(),
  examPercentage: z.string(),
});

export const SubjectCreate = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      instructor: "",
      year: "",
      semester: "",
      academicStartYear: "",
      academicEndYear: "",
      examPercentage: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    toast("Subject has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => console.log("Undo"),
      },
    });
  }

  return (
    <section className="space-y-8">
      <Text className="text-xl font-semibold text-center">
        Creating Subject
      </Text>

      <FlexBox className="justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="w-[800px] rounded-md border border-gray-200 shadow-sm px-4 py-8 max-w-[900px] grid grid-cols-2 gap-x-12 gap-y-8">
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

              <FlexBox className="items-end gap-4">
                <FormField
                  control={form.control}
                  name="academicStartYear"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
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
                          {years.map((year) => (
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
                  name="academicEndYear"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="End Year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FlexBox>

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
                        <SelectItem value="firstYear">First Year</SelectItem>
                        <SelectItem value="secondYear">Second Year</SelectItem>
                        <SelectItem value="thirdYear">Third Year</SelectItem>
                        <SelectItem value="fourthYear">Fourth Year</SelectItem>
                        <SelectItem value="fifthYear">Fifth Year</SelectItem>
                        <SelectItem value="sixthYear">Sixth Year</SelectItem>
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
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="examPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Percentage</FormLabel>
                    <FormControl>
                      <Input placeholder="Type exam percentage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FlexBox className="justify-end">
              <Button className="w-40" type="submit">
                Submit
              </Button>
            </FlexBox>
          </form>
        </Form>
      </FlexBox>
    </section>
  );
};

const years = [
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
  "2031",
  "2032",
  "2033",
  "2034",
  "2035",
  "2036",
  "2037",
];
