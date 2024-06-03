import { gaLists } from "@/common/constants/helpers";
import { Card } from "@/components/common/card";
import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

export const CoGaCreate = () => {
  return (
    <section className="space-y-12 h-full">
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

// =================================================================================================

const fieldSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
});

const examQformSchema = z.object({
  question: z.string().min(1),
  cos: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one course outlines.",
  }),
  fields: z.array(fieldSchema),
});

const ConnectExam = () => {
  const form = useForm<z.infer<typeof examQformSchema>>({
    resolver: zodResolver(examQformSchema),
    defaultValues: {
      question: "",
      cos: [],
      fields: [],
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const questionSelected = form.watch("question");
  const cosSelected = form.watch("cos");

  const [tempF, setTempF] = useState<{ key: string; value: string }[]>([]);
  const [chan, setChan] = useState(false);

  useEffect(() => {
    if (chan && connectedGas.length > 0) {
      connectedGas.forEach((ga) => {
        setTempF((prev) => {
          if (prev.find((field) => field.key === ga.key) === undefined) {
            return [...prev, { key: ga.id, value: ga.key }];
          }
          return prev;
        });
      });
    }
  }, [chan]);

  useEffect(() => {
    if (tempF.length > 0) {
      tempF.forEach((f) => {
        if (!fields.map((t) => t.key).includes(f.key)) {
          append({ key: f.key, value: f.value });
          setChan(false);
        }
      });
    }
  }, [append, fields, tempF]);

  function onSubmit(values: z.infer<typeof examQformSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="w-[800px] space-y-4 rounded-md border border-gray-200 shadow-sm p-4 max-w-[900px] ">
          <Text className="text-xl font-semibold">
            Connect Co, Ga with exam and course work
          </Text>

          <Button type="button" onClick={() => setChan(true)}>
            Chg
          </Button>

          <Button
            type="button"
            onClick={() =>
              setTempF((prev) => [...prev, { key: "6", value: "GA6" }])
            }
          >
            UPd
          </Button>

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
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Questions</FormLabel>
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

          {questionSelected ? (
            <Card>
              <FormField
                control={form.control}
                name="cos"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Connect CO with question
                      </FormLabel>
                      <FormDescription>
                        Select the items you want to connect the course outlines
                        with selected question.
                      </FormDescription>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {coItems.map((item) => (
                        <FormField
                          key={item.id + "co-key"}
                          control={form.control}
                          name="cos"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel>{item.label}</FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          ) : null}

          {cosSelected.length > 0 ? (
            <Card className="grid grid-cols-2 gap-x-8 gap-y-4">
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`fields.${index}.value`}
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fields[index].value} marks</FormLabel>
                      <FormControl>
                        <Input placeholder="Type " {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </Card>
          ) : null}

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

const connectedGas = gaLists
  .filter(({ id }) => ["1", "3", "4"].includes(id))
  .map((ga) => ({ key: ga.name, label: ga.label, id: ga.id }));

const coItems = [
  {
    id: "1",
    label: "CO1",
  },
  {
    id: "2",
    label: "CO2",
  },
  {
    id: "3",
    label: "CO3",
  },
  {
    id: "4",
    label: "CO4",
  },
] as const;

// =================================================================================================

const coCreateformSchema = z.object({
  name: z.string().min(1, { message: "Course outline name is required" }),
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
        <Card className="w-[800px] space-y-4  max-w-[900px] ">
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
        </Card>
      </form>
    </Form>
  );
};
