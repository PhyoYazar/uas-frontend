import { gaLists } from "@/common/constants/helpers";
import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { z } from "zod";

export const CoGaCreate = () => {
  return (
    <section className="space-y-12">
      <div className="space-y-4">
        {/* {true ? ( */}
        <Text>There is no course outlines. Please create course outlines.</Text>
        {/* ) : (
          <>
            <Text className="text-xl font-semibold">Course outlines</Text>
            <CoGaMapping />
          </>
        )} */}
      </div>

      <CoCreate />

      <ConnectExam />
    </section>
  );
};

const examQformSchema = z.object({
  name: z.string().min(1),
  cos: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one graduate attribute.",
  }),
});

const ConnectExam = () => {
  const form = useForm<z.infer<typeof examQformSchema>>({
    resolver: zodResolver(examQformSchema),
    defaultValues: {
      name: "",
      cos: [],
    },
  });

  function onSubmit(values: z.infer<typeof examQformSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="w-[800px] space-y-4 rounded-md border border-gray-200 shadow-sm p-4 max-w-[900px] ">
          <Text className="text-xl font-semibold">
            Connect Co, Ga with exam and course work
          </Text>

          {/* <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Question</FormLabel>
                <FormControl>
                  <Input placeholder="Type " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Question" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((q) => (
                      <SelectItem value={`question` + q}>
                        Question {q}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FlexBox className="justify-end">
            <Button className="w-40" type="submit">
              Create
            </Button>
          </FlexBox>
        </div>
      </form>
    </Form>
  );
};

const coCreateformSchema = z.object({
  name: z.string().min(1),
  gas: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one graduate attribute.",
  }),
});

const CoCreate = () => {
  const form = useForm<z.infer<typeof coCreateformSchema>>({
    resolver: zodResolver(coCreateformSchema),
    defaultValues: {
      name: "",
      gas: [],
    },
  });

  function onSubmit(values: z.infer<typeof coCreateformSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="w-[800px] space-y-4 rounded-md border border-gray-200 shadow-sm p-4 max-w-[900px] ">
          <Text className="text-xl font-semibold text-start">
            Creating Course Outlines
          </Text>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Outline</FormLabel>
                <FormControl>
                  <Input placeholder="Type course outline" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gas"
            render={() => (
              <FormItem>
                <div className="space-y-4 p-4 rounded-md border border-gray-200">
                  <FormLabel>
                    Choose graduate attributes that are associated with course
                    outlines
                  </FormLabel>
                  {/* <FormDescription>
                   Select the items you want to display in the sidebar.
                 </FormDescription>*/}

                  <div className="grid grid-cols-6 gap-4">
                    {gaLists.map((ga) => (
                      <FormField
                        key={ga.id}
                        control={form.control}
                        name="gas"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={ga.id}
                              className="flex flex-row items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(ga.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, ga.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== ga.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-sm text-gray-500">
                                {ga.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FlexBox className="justify-end">
            <Button className="w-40" type="submit">
              Create
            </Button>
          </FlexBox>
        </div>
      </form>
    </Form>
  );
};
