import { CustomTooltip } from "@/components/common/custom-tooltip";
import { FlexBox } from "@/components/common/flex-box";
import Icon from "@/components/common/icon";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHover } from "@uidotdev/usehooks";
import axios from "axios";
import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useCalculateMarks,
  useGetCWAttributeWithCoGaMarks,
  useGetExamAttributeWithCoGaMarks,
  useGetSubjectById,
} from "./hooks/useFetches";

export const CourseWorkPlanning = () => {
  const { subjectId } = useParams();
  const { attributes } = useGetCWAttributeWithCoGaMarks({
    subjectId,
  });

  const { attributes: examAttributes } = useGetExamAttributeWithCoGaMarks({
    subjectId,
  });

  const { subject: examPercent } = useGetSubjectById(
    subjectId,
    (data) => data?.data?.exam
  );

  const { gaMarks: cwGaMarks } = useCalculateMarks(attributes ?? []);
  const { gaMarks: examGaMarks } = useCalculateMarks(examAttributes ?? []);
  const totalGaMarks = cwGaMarks.map((cw) => ({
    ...cw,
    mark: cw.mark + (examGaMarks.find((e) => e.gaID === cw.gaID)?.mark ?? 0),
  }));

  return (
    <div className="w-full overflow-auto border border-gray-300 rounded-md">
      {/* ------------------ header ---------------- */}
      <div className="grid grid-cols-12">
        <FlexBox className="col-span-2 border-r border-r-gray-300 justify-center">
          <HeadText>Course Works</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
          <HeadText>Co</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
          <HeadText>Full Marks</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
          <HeadText>% Marks</HeadText>
        </FlexBox>

        <FlexBox className="col-span-7 flex-col justify-center">
          <HeadText className="py-2">Mark Distribution for each GA</HeadText>

          <div className="w-full grid grid-cols-12 border-t border-t-gray-300">
            <div className="col-span-4 border-r border-r-gray-300">
              <HeadText className="py-2 text-center">Cognitive</HeadText>

              <div className="w-full grid grid-cols-4 border-t border-gray-300">
                {[1, 2, 3, 4].map((el) => (
                  <FlexBox
                    key={el + "table-cogni"}
                    className={cn(
                      "col-span-1 py-2 justify-center",
                      el !== 4 ? "border-r border-r-gray-300 " : ""
                    )}
                  >
                    <HeadText>{"GA" + el}</HeadText>
                  </FlexBox>
                ))}
              </div>
            </div>

            <div className="col-span-1 overflow-clip border-r border-r-gray-300">
              <CustomTooltip label="Psychomotor">
                <HeadText className="py-2">Psychomotor</HeadText>
              </CustomTooltip>

              <div className="w-full border-t border-gray-300">
                <FlexBox className={cn("py-2 justify-center")}>
                  <HeadText>GA5</HeadText>
                </FlexBox>
              </div>
            </div>

            <div className="col-span-7">
              <HeadText className="py-2 text-center">Affective</HeadText>

              <div className="w-full grid grid-cols-7 border-t border-gray-300">
                {[6, 7, 8, 9, 10, 11, 12].map((el) => (
                  <FlexBox
                    key={el + "table-affective-bo"}
                    className={cn(
                      "col-span-1 py-2 justify-center",
                      el !== 12 ? "border-r border-r-gray-300 " : ""
                    )}
                  >
                    <HeadText>{"GA" + el}</HeadText>
                  </FlexBox>
                ))}
              </div>
            </div>
          </div>
        </FlexBox>
      </div>

      {attributes?.map((attribute) => (
        <CustomRow
          allowDelete
          key={attribute?.id}
          attributeId={attribute?.id}
          name={attribute?.name + " " + attribute?.instance}
          cos={attribute?.co?.map((c) => c.instance).join(", ")}
          marks={attribute?.marks}
          fullMark={attribute?.fullMark + "" ?? ""}
          percentMark={
            Math.round(
              (attribute?.fullMark / 100) * (100 - examPercent) * 100
            ) /
              100 +
            ""
          }
        />
      ))}

      {(attributes?.length ?? 0) > 0 ? (
        <>
          <div className="col-span-full bg-gray-50 h-6 border-t border-t-gray-300" />

          <CustomRow
            name="Total Course Works"
            marks={cwGaMarks?.map((m) => ({
              ...m,
              mark: Math.floor((m.mark / 100) * examPercent * 10) / 10,
            }))}
            percentMark={100 - examPercent + ""}
          />
          <CustomRow
            name="Final Exam"
            marks={examGaMarks?.map((m) => ({
              ...m,
              mark: Math.floor((m.mark / 100) * examPercent * 10) / 10,
            }))}
            percentMark={examPercent}
          />
          <CustomRow
            name="Total Marks"
            marks={totalGaMarks?.map((m) => ({
              ...m,
              mark: Math.floor((m.mark / 100) * examPercent * 10) / 10,
            }))}
            percentMark="100"
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
  fullMark?: string;
  percentMark?: string;
  attributeId?: string;
};

const CustomRow = (props: CustomRowType) => {
  const {
    name,
    marks,
    attributeId,
    allowDelete = false,
    cos = "",
    fullMark = "",
    percentMark = "",
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
        queryKey: ["attributes-co-ga-cw-marks", subjectId],
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
    <div ref={ref} className="grid grid-cols-12 border-t border-t-gray-300">
      <FlexBox className="col-span-2 border-r border-r-gray-300 justify-center relative">
        <Text className="text-gray-600">{name}</Text>

        {allowDelete && hovering ? (
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

      <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
        <Text className="">{fullMark}</Text>
      </FlexBox>

      <FlexBox className="col-span-1 justify-center border-r border-r-gray-300">
        <Text className="">{percentMark}</Text>
      </FlexBox>

      <FlexBox className="col-span-7 flex-col  justify-center">
        <div className="w-full grid grid-cols-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => {
            const mark = marks?.find((m) => +m?.gaSlug?.slice(-1) === el);

            const markIsExist =
              +(mark?.gaSlug?.slice(-1) ?? 0) === el && (mark?.mark ?? 0) > 0;

            return (
              <FlexBox
                key={el + "table-cw-lis"}
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
    </div>
  );
};

export const HeadText = (props: {
  className?: string;
  children: ReactNode;
}) => {
  const { children, className } = props;

  return (
    <Text className={cn("font-semibold text-gray-400", className)}>
      {children}
    </Text>
  );
};
