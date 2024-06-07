import {
  Attribute,
  useGetAllGAs,
  useGetAttributes,
} from "@/common/hooks/useFetches";
import { Card } from "@/components/common/card";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { CoGaMapping } from "../SubjectDetail/CoGaMapping";
import { CourseWorkPlanning } from "../SubjectDetail/CourseWorkPlanning";
import { ExamPlanning } from "../SubjectDetail/ExamPlanning";
import { useGetSubjectDetail } from "../SubjectDetail/hooks/useFetches";

export const CoGaCreate = () => {
  const { subjectId } = useParams();

  const { attributes: examQuestions } = useGetAttributes({
    type: "EXAM",
    select: (data) => data?.data?.items,
  });

  const { attributes: tutorialsCW } = useGetAttributes({
    type: "COURSEWORK",
    select: (data) => data?.data?.items,
  });

  const { data: totalCos } = useQuery({
    queryKey: ["co-by-subject-id", subjectId],
    queryFn: ({ signal }) =>
      axios.get(`cos?subjectId=${subjectId}`, { signal }),
    staleTime: 5000,
    enabled: subjectId !== undefined,
    select: (data) => data?.data?.total ?? 0,
  });

  return (
    <section className="space-y-16 h-full">
      <Tabs defaultValue="co">
        <TabsList className="mb-4">
          <TabsTrigger value="co">Course Outlines</TabsTrigger>
          <TabsTrigger value="exam_marks">Exam</TabsTrigger>
          <TabsTrigger value="cw_marks">Course Work</TabsTrigger>
        </TabsList>

        <TabsContent value="co">
          <Card className="space-y-4 bg-gray-50">
            {totalCos === 0 ? (
              <Text>
                There is no course outlines. Please create course outlines.
              </Text>
            ) : (
              <>
                <Text className="text-xl font-semibold">Course outlines</Text>
                <CoGaMapping />
              </>
            )}

            <CoCreate />
          </Card>
        </TabsContent>

        <TabsContent value="exam_marks">
          <Card className="space-y-4 bg-gray-50">
            {totalCos === 0 ? (
              <Text>
                There is no question created with marks. Please create question.
              </Text>
            ) : (
              <>
                <Text className="text-xl font-semibold">
                  Exam Planning Assessment
                </Text>
                <ExamPlanning />
              </>
            )}

            <CreateMark type="exam" attributes={examQuestions} />
          </Card>
        </TabsContent>

        <TabsContent value="cw_marks">
          <Card className="space-y-4 bg-gray-50">
            {totalCos === 0 ? (
              <Text>
                There is no course work created with marks. Please create course
                work.
              </Text>
            ) : (
              <>
                <Text className="text-xl font-semibold">
                  Course Work Planning Assessment
                </Text>
                <CourseWorkPlanning />
              </>
            )}

            <CreateMark type="coursework" attributes={tutorialsCW} />
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

// =================================================================================================

const fieldSchema = z.object({
  key: z.string().min(1, "Key is required"),
  slug: z.string().min(1, "Slug is required"),
  value: z.string().min(1, "Value is required"),
});

const examQformSchema = z.object({
  attributeId: z.string().min(1),
  fields: z.array(fieldSchema),
});

type CreateMarkProps = {
  type: "exam" | "coursework";
  attributes: Attribute[] | undefined;
};

type CWType = "Tutorial" | "Lab" | "Assignment";

const CreateMark = (props: CreateMarkProps) => {
  const { type, attributes } = props;

  const [cwType, setCwType] = useState<CWType>("Tutorial");
  const [coLists, setCoLists] = useState<string[]>([]);

  const { subjectId } = useParams();
  const queryClient = useQueryClient();

  const { subject } = useGetSubjectDetail(subjectId);

  const allCOs = subject?.co;

  const form = useForm<z.infer<typeof examQformSchema>>({
    resolver: zodResolver(examQformSchema),
    defaultValues: {
      attributeId: "",
      fields: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const questionSelected = form.watch("attributeId");

  const createMarkMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (newCo: any) => axios.post("create_mark_with_co_ga", newCo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes-co-ga-marks"] });

      form.reset();
      setCoLists([]);

      toast("Exam Question has been successfully created with marks.");
    },
  });

  function onSubmit(values: z.infer<typeof examQformSchema>) {
    const result = {
      subjectID: subjectId,
      attributeID: values.attributeId,
      coIDs: coLists,
      gas: values.fields.map((f) => ({ gaID: f.key, mark: +f.value })),
    };

    createMarkMutation.mutate(result);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="w-[800px] space-y-4 rounded-md border border-gray-200 shadow-sm p-4 max-w-[900px] ">
          <Text className="text-xl font-semibold">Create {type} marks</Text>

          {type === "coursework" ? (
            <Select
              defaultValue={cwType}
              onValueChange={(val) => setCwType(val as CWType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Course Work Type" />
              </SelectTrigger>
              <SelectContent>
                {["Tutorial", "Lab", "Assignment"].map((cw) => (
                  <SelectItem key={cw + "whaadsf"} value={cw}>
                    {cw}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}

          <FormField
            control={form.control}
            name="attributeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  {type === "exam" ? "Questions" : "Course Works"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={`Select ${
                          type === "exam" ? "Questions" : "Course Works"
                        }`}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {attributes
                      ?.filter((a) => a.name === cwType)
                      ?.map((att) => (
                        <SelectItem
                          key={att?.id + "select what whd" + cwType}
                          value={att?.id}
                        >
                          {att?.name + " " + att?.instance}
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
              <div className="mb-4">
                <Text className="text-base">Connect CO with question</Text>
                <Text>
                  Select the items you want to connect the course outlines with
                  selected question.
                </Text>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {allCOs?.map((item) => (
                  <FlexBox key={item?.id} className="gap-2">
                    <Checkbox
                      id={item?.id}
                      onCheckedChange={(check) => {
                        if (check) {
                          setCoLists((perv) => [...perv, item?.id]);

                          const gaArray = item?.ga?.map((g) => ({
                            key: g.id,
                            slug: g.slug,
                            value: "",
                          }));

                          // add to the fields
                          append(gaArray);

                          return;
                        }
                        setCoLists((perv) =>
                          perv.filter((id) => id !== item?.id)
                        );

                        const indexes = item?.ga
                          ?.map((g) => fields.findIndex((f) => f.key === g.id))
                          .filter((num) => num !== -1);

                        // remove from fields
                        remove(indexes);
                      }}
                    />
                    <Label htmlFor={item?.id}>{"CO" + item?.instance}</Label>
                  </FlexBox>
                ))}
              </div>
            </Card>
          ) : null}

          {coLists.length > 0 ? (
            <Card className="grid grid-cols-2 gap-x-8 gap-y-4">
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`fields.${index}.value`}
                  defaultValue=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fields[index].slug}</FormLabel>
                      <FormControl>
                        <Input placeholder="Marks " {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </Card>
          ) : null}

          <FlexBox className="justify-end">
            <Button
              disabled={createMarkMutation.isPending}
              className="w-40"
              type="submit"
            >
              Create
            </Button>
          </FlexBox>
        </div>
      </form>
    </Form>
  );
};

// =================================================================================================

const coCreateformSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Course outline description is required" }),
  instance: z.string().min(1, { message: "Course outline name is required" }),
  gas: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one graduate attribute.",
  }),
});

const CoCreate = () => {
  const { subjectId } = useParams();
  const queryClient = useQueryClient();

  const { allGAs } = useGetAllGAs();

  const form = useForm<z.infer<typeof coCreateformSchema>>({
    resolver: zodResolver(coCreateformSchema),
    defaultValues: {
      name: "",
      instance: "",
      gas: [],
    },
  });

  const connectCoGaMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (newCo: any) => axios.post("connect_co_gas", newCo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subject-detail-by-id"] });

      form.reset();

      toast(
        "Course Outlines has been successfully created and connected with GA."
      );
    },
  });

  function onSubmit(values: z.infer<typeof coCreateformSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log("hello", values);

    if (typeof +values.instance === "number") {
      connectCoGaMutation.mutate({
        coName: values.name,
        coInstance: +values.instance,
        subjectID: subjectId,
        gaIDs: values.gas,
      });
    }
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
            name="instance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type CO number"
                    type="number"
                    min={1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type course outline description"
                    {...field}
                  />
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
                    {allGAs?.map((ga) => (
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
                                {ga?.slug ?? ""}
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
            <Button
              className="w-40"
              type="submit"
              disabled={connectCoGaMutation.isPending}
            >
              Create
            </Button>
          </FlexBox>
        </Card>
      </form>
    </Form>
  );
};
