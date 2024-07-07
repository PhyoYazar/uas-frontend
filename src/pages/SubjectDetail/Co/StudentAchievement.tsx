import { get2Decimal, transformGrade } from "@/common/utils/utils";
import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useGetSubjectDetail, useStdCoGrades } from "../hooks/useFetches";

export const StudentAchievement = () => {
  const { subjectId } = useParams();
  const { subject, cos } = useGetSubjectDetail(subjectId);

  // const examPercent = subject?.exam ?? 0;
  // const tutorialPercent = subject?.tutorial ?? 0;
  // const labPercent = subject?.lab ?? 0;
  // const assignmentPercent = subject?.assignment ?? 0;
  // const practicalPercent = subject?.practical ?? 0;

  const coLists = [...cos].sort((a, b) => +a.instance - +b.instance);

  const { data } = useStdCoGrades(subject?.year, subject?.academicYear);

  return (
    <div className="overflow-auto pb-2">
      <div className="flex flex-nowrap">
        <FlexBox className="w-16 flex-shrink-0 justify-center border border-gray-400 border-r-0">
          No
        </FlexBox>

        <FlexBox className="w-52 flex-shrink-0 justify-center border border-gray-400">
          Student ID
        </FlexBox>

        {coLists.map((co, index, arr) => (
          <Fragment key={"std-achi-keys" + co.id}>
            <FlexBox className="flex-nowrap w-72 border border-gray-400 border-l-0">
              <FlexBox className="flex-col w-48 border-r border-r-gray-400">
                <Text className="w-full py-1 text-center border-b border-b-gray-400">
                  CO{co.instance}
                </Text>

                <FlexBox className="flex-nowrap border-b border-b-gray-400">
                  <Text className="flex-1 py-1 text-center border-r border-r-gray-400">
                    Mark Distribution
                  </Text>
                  <Text className="flex-1 py-1 text-center">
                    Student Achievement
                  </Text>
                </FlexBox>

                <FlexBox className="flex-nowrap w-full ">
                  <Text className="flex-1 py-1 text-center border-r border-r-gray-400">
                    19.4
                  </Text>
                  <Text className="flex-1 py-1 text-center">100</Text>
                </FlexBox>
              </FlexBox>

              <Text className="text-center w-24">CO{co.instance} Grade</Text>
            </FlexBox>

            {arr.length - 1 !== index ? (
              <div className="w-12 bg-gray-200 flex-shrink-0 border border-gray-400 border-l-0 border-b-0" />
            ) : null}
          </Fragment>
        ))}
      </div>

      {data?.map((std, stdIndex, stdArr) => {
        // const tutorialResults = calculateAttributeFinalResult(
        //   "Tutorial",
        //   tutorialPercent,
        //   std
        // );

        // const practicalResults = calculateAttributeFinalResult(
        //   "Practical",
        //   practicalPercent,
        //   std
        // );

        // const labResults = calculateAttributeFinalResult(
        //   "Lab",
        //   labPercent,
        //   std
        // );

        // const assignmentResults = calculateAttributeFinalResult(
        //   "Assignment",
        //   assignmentPercent,
        //   std
        // );

        // const questionResults = calculateAttributeFinalResult(
        //   "Question",
        //   examPercent,
        //   std
        // );

        // const totalResult = get2Decimal(
        //   tutorialResults +
        //     practicalResults +
        //     labResults +
        //     assignmentResults +
        //     questionResults
        // );

        return (
          <div className="flex flex-nowrap " key={std.id + "std-keys"}>
            <FlexBox className="w-16 py-1 flex-shrink-0 justify-center border border-gray-400 border-r-0 border-t-0">
              {std.rollNumber}
            </FlexBox>

            <FlexBox className="w-52 flex-shrink-0 justify-center border border-gray-400 border-t-0">
              {std.studentName}
            </FlexBox>

            {coLists.map((co, index, arr) => {
              const coValue = std?.co?.find((c) => c.coId === co.id);

              if (coValue === undefined) return null;

              // addition mark base on co instance / addition full mark base on co instance * 100
              const calculatedValue = get2Decimal(
                (coValue?.totalMarks / coValue?.totalFullMarks) * 100
              );

              return (
                <Fragment key={"std-achi-keys" + co.id}>
                  <FlexBox className="flex-nowrap flex-shrink-0 w-24 border border-gray-400 border-l-0 border-t-0">
                    <Text className="text-center flex-1">
                      CO{co.instance} Grade
                    </Text>
                  </FlexBox>

                  <FlexBox className="flex-nowrap flex-shrink-0 w-24 border border-gray-400 border-t-0 border-l-0">
                    <Text className="text-center flex-1">
                      {calculatedValue}
                    </Text>
                  </FlexBox>

                  <FlexBox className="flex-nowrap flex-shrink-0 w-24 border border-gray-400 border-t-0 border-l-0">
                    <Text className="text-center flex-1">
                      {transformGrade(calculatedValue)}
                    </Text>
                  </FlexBox>

                  {arr.length - 1 !== index ? (
                    <div
                      className={cn(
                        "w-12 bg-gray-200 flex-shrink-0 border border-gray-400 border-l-0 border-t-0  border-b-0",
                        stdIndex === stdArr.length - 1 ? "border-b-1" : ""
                      )}
                    />
                  ) : null}
                </Fragment>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
