import { Attribute } from "@/common/hooks/useFetches";
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
import { useGetSubjectDetail } from "@/pages/SubjectDetail/hooks/useFetches";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const fieldSchema = z.object({
  key: z.string().min(1, "Key is required"),
  slug: z.string().min(1, "Slug is required"),
  value: z.string().min(1, "Value is required"),
});

const examQformSchema = z.object({
  attributeId: z.string().min(1),
  fullMark: z.string().min(1, "Full Mark is required"),
  fields: z.array(fieldSchema),
});

type CreateMarkProps = {
  type: "exam" | "coursework";
  attributes: Attribute[] | undefined;
};

type CWType = "Tutorial" | "Lab" | "Assignment" | "Practical";

export const CreateMark = (props: CreateMarkProps) => {
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
      fullMark: "",
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
      queryClient.invalidateQueries({
        queryKey: [
          type === "exam"
            ? "attributes-co-ga-exam-marks"
            : "attributes-co-ga-cw-marks",
          subjectId,
        ],
      });

      form.reset();
      setCoLists([]);

      toast.success(
        ` ${
          type === "exam" ? "Exam Question" : "Course Work"
        } has been successfully created with marks.`
      );
    },
    onError: (err) => {
      console.log("hello err", err);

      toast.error(
        `Creating ${
          type === "exam" ? "Exam Question" : "Course Work"
        } has been failed. Please try again!`
      );
    },
  });

  function onSubmit(values: z.infer<typeof examQformSchema>) {
    const totalGaMarks = values.fields.reduce(
      (cur, acc) => cur + +acc.value,
      0
    );

    if (totalGaMarks !== +values.fullMark) {
      toast.warning("Full marks and total ga marks are not same");

      return;
    }

    const result = {
      subjectID: subjectId,
      attributeID: values.attributeId,
      fullMark: +values.fullMark,
      coIDs: coLists,
      gas: values.fields.map((f) => ({ gaID: f.key, mark: +f.value })),
    };

    createMarkMutation.mutate(result);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="w-[800px] space-y-6 rounded-md border border-gray-200 shadow-sm p-4 max-w-[900px] ">
          <Text className="text-xl font-semibold">Create {type} marks</Text>

          {type === "coursework" ? (
            <div className="space-y-2">
              <Label className="text-base" htmlFor="cw-type-111">
                Select Course Work Type
              </Label>
              <Select
                defaultValue={cwType}
                onValueChange={(val) => setCwType(val as CWType)}
              >
                <SelectTrigger id="cw-type-111">
                  <SelectValue placeholder="Select Course Work Type" />
                </SelectTrigger>
                <SelectContent>
                  {["Tutorial", "Lab", "Assignment", "Practical"].map((cw) => (
                    <SelectItem key={cw + "whaadsf"} value={cw}>
                      {cw}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                      ?.filter((a) =>
                        type === "exam" ? true : a.name === cwType
                      )
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

          <FormField
            control={form.control}
            name="fullMark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Mark</FormLabel>
                <FormControl>
                  <Input placeholder="Full mark" {...field} />
                </FormControl>
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
                {allCOs
                  ?.sort((a, b) => +a.instance - +b.instance)
                  ?.map((item) => (
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

                            const updatedGaArray = gaArray.filter(
                              (g) => !fields?.map((f) => f.key).includes(g.key)
                            );

                            // add to the fields
                            append(updatedGaArray);

                            return;
                          }
                          setCoLists((perv) =>
                            perv.filter((id) => id !== item?.id)
                          );

                          const indexes = item?.ga
                            ?.map((g) =>
                              fields.findIndex((f) => f.key === g.id)
                            )
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
