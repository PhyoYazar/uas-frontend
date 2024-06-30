import { get2Decimal } from "@/common/utils/utils";
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
} from "../hooks/useFetches";

export const CourseWorkPlanning = () => {
  const { subjectId } = useParams();
  const { attributes } = useGetCWAttributeWithCoGaMarks({
    subjectId,
  });

  const tutorialAttributes =
    attributes?.filter(({ name }) => name === "Tutorial") ?? [];
  const labAttributes = attributes?.filter(({ name }) => name === "Lab") ?? [];
  const practicalAttributes =
    attributes?.filter(({ name }) => name === "Practical") ?? [];
  const assignmentAttributes =
    attributes?.filter(({ name }) => name === "Assignment") ?? [];

  const { attributes: examAttributes } = useGetExamAttributeWithCoGaMarks({
    subjectId,
  });

  const { subject } = useGetSubjectById(subjectId, (data) => data?.data);

  const examPercent = subject?.exam ?? 0;
  const tutorialPercent = subject?.tutorial ?? 0;
  const labPercent = subject?.lab ?? 0;
  const assignmentPercent = subject?.assignment ?? 0;
  const practicalPercent = subject?.practical ?? 0;

  const { gaMarks: labGaMarks } = useCalculateMarks(labAttributes ?? []);
  const { gaMarks: practicalGaMarks } = useCalculateMarks(
    practicalAttributes ?? []
  );
  const { gaMarks: assignmentGaMarks } = useCalculateMarks(
    assignmentAttributes ?? []
  );
  const { gaMarks: tutorialGaMarks } = useCalculateMarks(
    tutorialAttributes ?? []
  );

  const calculatedLabGaMarks = labGaMarks?.map((m) => ({
    ...m,
    mark: get2Decimal((m.mark / 100) * labPercent),
  }));

  const calculatedPracticalGaMarks = practicalGaMarks?.map((m) => ({
    ...m,
    mark: get2Decimal((m.mark / 100) * practicalPercent),
  }));

  const calculatedTutorialGaMarks = tutorialGaMarks?.map((m) => ({
    ...m,
    mark: get2Decimal((m.mark / 100) * tutorialPercent),
  }));

  const calculatedAssignmentGaMarks = assignmentGaMarks?.map((m) => ({
    ...m,
    mark: get2Decimal((m.mark / 100) * assignmentPercent),
  }));

  const { gaMarks: examGaMarks } = useCalculateMarks(examAttributes ?? []);
  const { gaMarks: cwGaMarks } = useCalculateMarks(attributes ?? []);

  const calculatedCwGaMarks = cwGaMarks?.map((m) => ({
    ...m,
    mark: get2Decimal((m.mark / 100) * (100 - examPercent)),
  }));

  // exam calculation
  const calculatedExamGaMarks = examGaMarks?.map((m) => ({
    ...m,
    mark: get2Decimal((m.mark / 100) * examPercent),
  }));

  const totalGaMarks = calculatedCwGaMarks.map((cw) => ({
    ...cw,
    mark: get2Decimal(
      cw.mark +
        (calculatedExamGaMarks.find((e) => e.gaID === cw.gaID)?.mark ?? 0)
    ),
  }));

  return (
    <div className="w-full overflow-auto border border-gray-400 rounded-md">
      {/* ------------------ header ---------------- */}
      <div className="grid grid-cols-12 bg-yellow-400">
        <FlexBox className="col-span-2 border-r border-r-gray-400 justify-center">
          <HeadText>Course Works</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center">
          <HeadText>Co</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center">
          <HeadText>Full Marks</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center">
          <HeadText>% Marks</HeadText>
        </FlexBox>

        <FlexBox className="col-span-7 flex-col justify-center">
          <HeadText className="py-2">Mark Distribution for each GA</HeadText>

          <div className="w-full grid grid-cols-12 border-t border-t-gray-400">
            <div className="col-span-4 border-r border-r-gray-400">
              <HeadText className="py-2 text-center">Cognitive</HeadText>

              <div className="w-full grid grid-cols-4 border-t border-gray-400">
                {[1, 2, 3, 4].map((el) => (
                  <FlexBox
                    key={el + "table-cogni"}
                    className={cn(
                      "col-span-1 py-2 justify-center",
                      el !== 4 ? "border-r border-r-gray-400 " : ""
                    )}
                  >
                    <HeadText>{"GA" + el}</HeadText>
                  </FlexBox>
                ))}
              </div>
            </div>

            <div className="col-span-1 overflow-clip border-r border-r-gray-400">
              <CustomTooltip label="Psychomotor">
                <HeadText className="py-2">Psychomotor</HeadText>
              </CustomTooltip>

              <div className="w-full border-t border-gray-400">
                <FlexBox className={cn("py-2 justify-center")}>
                  <HeadText>GA5</HeadText>
                </FlexBox>
              </div>
            </div>

            <div className="col-span-7">
              <HeadText className="py-2 text-center">Affective</HeadText>

              <div className="w-full grid grid-cols-7 border-t border-gray-400">
                {[6, 7, 8, 9, 10, 11, 12].map((el) => (
                  <FlexBox
                    key={el + "table-affective-bo"}
                    className={cn(
                      "col-span-1 py-2 justify-center",
                      el !== 12 ? "border-r border-r-gray-400 " : ""
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

      {attributes?.map((attribute) => {
        let percent = assignmentPercent;
        if (attribute.name === "Tutorial") percent = tutorialPercent;
        if (attribute.name === "Practical") percent = practicalPercent;
        if (attribute.name === "Lab") percent = labPercent;

        return (
          <CustomRow
            allowDelete
            key={attribute?.id}
            attributeId={attribute?.id}
            name={attribute?.name + " " + attribute?.instance}
            cos={attribute?.co?.map((c) => c.instance).join(", ")}
            marks={attribute?.marks}
            fullMark={attribute?.fullMark + "" ?? ""}
            percentMark={get2Decimal((attribute?.fullMark / 100) * percent)}
          />
        );
      })}

      {(attributes?.length ?? 0) > 0 ? (
        <>
          <div className="col-span-full bg-gray-50 h-6 border-t border-t-gray-400" />

          {calculatedPracticalGaMarks.some((item) => item?.mark > 0) ? (
            <CustomRow
              name="Total Practical"
              marks={calculatedPracticalGaMarks}
              percentMark={practicalPercent}
            />
          ) : null}

          {calculatedTutorialGaMarks.some((item) => item?.mark > 0) ? (
            <CustomRow
              name="Total Tutorial"
              marks={calculatedTutorialGaMarks}
              percentMark={tutorialPercent}
            />
          ) : null}

          {calculatedLabGaMarks.some((item) => item?.mark > 0) ? (
            <CustomRow
              name="Total Lab"
              marks={calculatedLabGaMarks}
              percentMark={labPercent}
            />
          ) : null}

          {calculatedAssignmentGaMarks.some((item) => item?.mark > 0) ? (
            <CustomRow
              name="Total Assignment"
              marks={calculatedAssignmentGaMarks}
              percentMark={assignmentPercent}
            />
          ) : null}

          <div className="col-span-full bg-gray-50 h-6 border-t border-t-gray-400" />

          <CustomRow
            name="Total Course Works"
            marks={calculatedCwGaMarks}
            percentMark={100 - examPercent}
          />
          <CustomRow
            name="Final Exam"
            marks={calculatedExamGaMarks}
            percentMark={examPercent}
          />
          <CustomRow
            name="Total Marks"
            marks={totalGaMarks}
            percentMark={100}
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
  percentMark?: number;
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
    percentMark,
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
    <div ref={ref} className="grid grid-cols-12 border-t border-t-gray-400">
      <FlexBox className="col-span-2 border-r border-r-gray-400 justify-center relative">
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

      <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center">
        <Text className="">{cos}</Text>
      </FlexBox>

      <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center">
        <Text className="">{fullMark}</Text>
      </FlexBox>

      <FlexBox className="col-span-1 justify-center border-r border-r-gray-400">
        <Text className="">{percentMark}</Text>
      </FlexBox>

      <FlexBox className="col-span-7 flex-col  justify-center">
        <div className="w-full grid grid-cols-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => {
            const mark = marks?.find((m) => +m?.gaSlug?.slice(2) === el);

            const markIsExist =
              +(mark?.gaSlug?.slice(2) ?? 0) === el && (mark?.mark ?? 0) > 0;

            return (
              <FlexBox
                key={el + "table-cw-lis"}
                className={cn(
                  "col-span-1 py-2 justify-center",
                  el !== 12 ? "border-r border-r-gray-400 " : ""
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
    <Text className={cn("font-semibold text-gray-700", className)}>
      {children}
    </Text>
  );
};
