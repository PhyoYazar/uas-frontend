import { useGetAllGAs } from "@/common/hooks/useFetches";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const coCreateformSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Course outline description is required" }),
  instance: z.string().min(1, { message: "Course outline number is required" }),
  mark: z.string().min(1, { message: "Course outline mark is required" }),
  gas: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one graduate attribute.",
  }),
});

export const CreateCo = () => {
  const { subjectId } = useParams();
  const queryClient = useQueryClient();

  const { allGAs } = useGetAllGAs();

  const form = useForm<z.infer<typeof coCreateformSchema>>({
    resolver: zodResolver(coCreateformSchema),
    defaultValues: {
      name: "",
      instance: "",
      mark: "",
      gas: [],
    },
  });

  const connectCoGaMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (newCo: any) => axios.post("connect_co_gas", newCo),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subject-detail-by-id", subjectId],
      });

      form.reset();

      toast.success(
        "Course Outlines has been successfully created and connected with GA."
      );
    },
    onError: (err) => {
      console.log("hello err", err);
      toast.error(
        "Creating Course Outlines has been failed. Please try again!"
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
        mark: +values.mark,
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
            name="mark"
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
