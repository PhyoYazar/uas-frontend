import { FlexBox } from "@/components/common/flex-box";
import Icon from "@/components/common/icon";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHover } from "@uidotdev/usehooks";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { HeadText } from "./CourseWorkPlanning";
import { useGetExamAttributeWithCoGaMarks } from "./hooks/useFetches";

export const ExamPlanning = () => {
  const { subjectId } = useParams();
  const { attributes } = useGetExamAttributeWithCoGaMarks({
    subjectId,
  });

  return (
    <div className="w-full overflow-auto border border-gray-300 rounded-md">
      {/* ------------------ header ---------------- */}
      <div className="grid grid-cols-12">
        <FlexBox className="col-span-2 border-r border-r-gray-300 justify-center">
          <HeadText>Question No</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
          <HeadText>Co</HeadText>
        </FlexBox>

        <FlexBox className="col-span-7 flex-col border-r border-r-gray-300 justify-center">
          <HeadText className="py-2">Graduate Attributes</HeadText>
          <div className="w-full grid grid-cols-12 border-t border-gray-300">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => (
              <FlexBox
                key={el + "table-ma"}
                className={cn(
                  "col-span-1 py-2 justify-center",
                  el !== 12 ? "border-r border-r-gray-300 " : ""
                )}
              >
                <HeadText>{"GA" + el}</HeadText>
              </FlexBox>
            ))}
          </div>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
          <HeadText>% Total</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 justify-center">
          <HeadText>Time, min</HeadText>
        </FlexBox>
      </div>

      {attributes?.map((attribute) => (
        <CustomRow
          key={attribute?.id}
          attributeId={attribute?.id}
          name={attribute?.name + " " + attribute?.instance}
          cos={attribute?.co?.map((c) => c.instance).join(", ")}
          marks={attribute?.marks}
          total={`100`}
        />
      ))}

      {/* <CustomRow name="Question 1" ga={dummyGa} total={`100`} />
      <CustomRow name="Total Marks Upon 100%" ga={dummyGa} total={`100`} />
      <CustomRow name={`Total Marks Upon ` + "80%"} ga={dummyGa} total={`80`} /> */}
    </div>
  );
};

type CustomRowType = {
  name: string;
  cos?: string;
  marks: { gaID: string; gaSlug: string; id: string; mark: number }[];
  total?: string;
  time?: string;
  attributeId?: string;
};

const CustomRow = (props: CustomRowType) => {
  const { name, cos = "", marks, attributeId, total = "", time = "" } = props;

  const { subjectId } = useParams();
  const queryClient = useQueryClient();
  const [ref, hovering] = useHover();

  const deleteMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ attributeId, subjectId }: any) =>
      axios.delete(`remove_attribute/${attributeId}?subject_id=${subjectId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attributes-co-ga-exam-marks", subjectId],
      });

      toast.success(`Question has been successfully deleted.`);
    },
    onError: (err) => {
      console.log("hello err", err);

      toast.error(`Deleting exam question has been failed. Please try again!`);
    },
  });

  const onDeleteHandler = () => {
    if (subjectId && attributeId) {
      deleteMutation.mutate({ subjectId, attributeId });
    }
  };

  return (
    <div ref={ref} className="grid grid-cols-12 border-t border-t-gray-300">
      <FlexBox className="col-span-2 border-r border-r-gray-300 justify-center relative">
        <Text className="">{name}</Text>
        {hovering ? (
          <FlexBox
            className="justify-center w-full h-full cursor-pointer bg-gradient-to-r from-red-400 to-red-300 absolute top-0"
            onClick={() => onDeleteHandler()}
          >
            <Icon name="trash-2" className="text-red-700" />
          </FlexBox>
        ) : null}
      </FlexBox>

      <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
        <Text className="">{cos}</Text>
      </FlexBox>

      <FlexBox className="col-span-7 flex-col border-r border-r-gray-300 justify-center">
        <div className="w-full grid grid-cols-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => {
            const mark = marks?.find((m) => +m?.gaSlug?.slice(-1) === el);

            const markIsExist = +(mark?.gaSlug?.slice(-1) ?? 0) === el;

            return (
              <FlexBox
                key={el + "table-body"}
                className={cn(
                  "col-span-1 py-2 justify-center",
                  el !== 12 ? "border-r border-r-gray-300 " : ""
                )}
              >
                <Text
                  className={cn(markIsExist ? "text-medium" : "text-gray-200")}
                >
                  {markIsExist ? mark?.mark : "-"}
                </Text>
              </FlexBox>
            );
          })}
        </div>
      </FlexBox>

      <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
        <Text className="">{total}</Text>
      </FlexBox>

      <FlexBox className="col-span-1 justify-center">
        <Text className="">{time}</Text>
      </FlexBox>
    </div>
  );
};
