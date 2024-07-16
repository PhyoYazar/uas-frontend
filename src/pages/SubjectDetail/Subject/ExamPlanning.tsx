import { get2Decimal } from "@/common/utils/utils";
import { FlexBox } from "@/components/common/flex-box";
import Icon from "@/components/common/icon";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHover } from "@uidotdev/usehooks";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useCalculateMarks,
  useGetExamAttributeWithCoGaMarks,
  useGetSubjectById,
} from "../hooks/useFetches";
import { HeadText } from "./CourseWorkPlanning";

export const ExamPlanning = () => {
  const { subjectId } = useParams();

  const { attributes } = useGetExamAttributeWithCoGaMarks({
    subjectId,
  });
  const { subject } = useGetSubjectById(subjectId, (data) => data?.data);
  const examPercent = subject?.exam ?? 0;

  const { gaMarks } = useCalculateMarks(attributes ?? []);

  return (
    <div className="overflow-auto pb-2">
      {/* ------------------ header ---------------- */}
      <div className="w-full flex flex-nowrap">
        <div
          className="grid bg-yellow-400 border border-gray-400 border-b-0"
          style={{ gridTemplateColumns: "repeat(12, 1fr)" }}
        >
          <FlexBox className="col-span-2 border-r border-r-gray-400 min-w-44 justify-center">
            <HeadText>Question No</HeadText>
          </FlexBox>

          <FlexBox className="col-span-1 border-r border-r-gray-400 min-w-16 justify-center">
            <HeadText>Co</HeadText>
          </FlexBox>

          <FlexBox className="col-span-7 flex-col border-r border-r-gray-400 justify-center min-w-[550px]">
            <HeadText className="py-2">Graduate Attributes</HeadText>
            <div className="w-full grid grid-cols-12 border-t border-gray-400">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => (
                <FlexBox
                  key={el + "table-ma"}
                  className={cn(
                    "col-span-1 py-2 justify-center min-w-12",
                    el !== 12 ? "border-r border-r-gray-400 " : ""
                  )}
                >
                  <HeadText>{"GA" + el}</HeadText>
                </FlexBox>
              ))}
            </div>
          </FlexBox>

          <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center min-w-16">
            <HeadText>% Total</HeadText>
          </FlexBox>

          <FlexBox className="col-span-1 justify-center min-w-16">
            <HeadText>% Marks</HeadText>
          </FlexBox>
        </div>
      </div>

      {attributes
        ?.sort((a, b) => +a.instance - +b.instance)
        ?.map((attribute, index, arr) => (
          <CustomRow
            className={arr.length - 1 === index ? "border-b-1" : ""}
            allowDelete
            key={attribute?.id}
            attributeId={attribute?.id}
            name={attribute?.name + " " + attribute?.instance}
            cos={attribute?.co?.map((c) => c.instance).join(", ")}
            marks={attribute?.marks}
            fullMark={attribute?.fullMark}
            percentMark={get2Decimal((attribute?.fullMark / 100) * examPercent)}
          />
        ))}

      {(attributes?.length ?? 0) > 0 ? (
        <>
          <div className="h-6" />

          <CustomRow
            name="Total Marks Upon 100%"
            marks={gaMarks}
            fullMark={100}
          />
          <CustomRow
            className="border-b-1"
            name={`Total Marks Upon ` + examPercent + "%"}
            marks={gaMarks?.map((m) => ({
              ...m,
              mark: Math.floor((m.mark / 100) * examPercent * 10) / 10,
            }))}
            fullMark={examPercent}
          />
        </>
      ) : null}
    </div>
  );
};

type CustomRowType = {
  name: string;
  cos?: string;
  allowDelete?: boolean;
  marks: { gaID: string; gaSlug: string; id: string; mark: number }[];
  fullMark?: number;
  percentMark?: number;
  time?: string;
  attributeId?: string;
  className?: string;
};

const CustomRow = (props: CustomRowType) => {
  const {
    name,
    cos = "",
    allowDelete = false,
    marks,
    attributeId,
    fullMark,
    percentMark,
    className,
  } = props;

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

      toast.success(`${name} has been successfully deleted.`);
    },
    onError: (err) => {
      console.log("hello err", err);

      toast.error(`Deleting ${name} has been failed. Please try again!`);
    },
  });

  const onDeleteHandler = () => {
    if (subjectId && attributeId) {
      deleteMutation.mutate({ subjectId, attributeId });
    }
  };

  return (
    <div className="w-full flex flex-nowrap">
      <div
        ref={ref}
        className={cn("grid border border-gray-400 border-b-0", className)}
        style={{ gridTemplateColumns: "repeat(12, 1fr)" }}
      >
        <FlexBox className="col-span-2 border-r border-r-gray-400 justify-center relative min-w-44">
          <Text className="">{name}</Text>
          {allowDelete && hovering ? (
            <FlexBox
              className="justify-center w-full h-full cursor-pointer bg-gradient-to-r from-red-400 to-red-300 absolute top-0"
              onClick={() => onDeleteHandler()}
            >
              <Icon name="trash-2" className="text-red-700" />
            </FlexBox>
          ) : null}
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center min-w-16">
          <Text className="">{cos}</Text>
        </FlexBox>

        <FlexBox className="col-span-7 flex-col border-r border-r-gray-400 justify-center min-w-[550px]">
          <div className="w-full grid grid-cols-12">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => {
              const mark = marks?.find((m) => +m?.gaSlug?.slice(2) === el);

              const markIsExist =
                +(mark?.gaSlug?.slice(2) ?? 0) === el && (mark?.mark ?? 0) > 0;

              return (
                <FlexBox
                  key={el + "table-body"}
                  className={cn(
                    "col-span-1 py-2 justify-center min-w-12",
                    el !== 12 ? "border-r border-r-gray-400 " : ""
                  )}
                >
                  <Text
                    className={cn(
                      markIsExist ? "text-medium" : "text-gray-200"
                    )}
                  >
                    {markIsExist ? mark?.mark : "-"}
                  </Text>
                </FlexBox>
              );
            })}
          </div>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center min-w-16">
          <Text className="">{fullMark}</Text>
        </FlexBox>

        <FlexBox className="col-span-1 justify-center min-w-16">
          <Text className="">{percentMark}</Text>
        </FlexBox>
      </div>
    </div>
  );
};
