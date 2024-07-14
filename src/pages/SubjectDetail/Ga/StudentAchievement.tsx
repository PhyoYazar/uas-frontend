import {
  get2Decimal,
  getUniqueObjects,
  transformGrade,
} from "@/common/utils/utils";
import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useCalculateMarkDistribution } from "../hooks/useCalculateMarkDistributin";
import { useGetSubjectDetail, useStdGaGrades } from "../hooks/useFetches";

export const StudentAchievement = () => {
  const { subjectId } = useParams();
  const { subject, cos } = useGetSubjectDetail(subjectId);

  const gaLists = getUniqueObjects(cos.map((c) => c.ga).flat(1)).sort(
    (a, b) => +a.slug.slice(2) - +b.slug.slice(2)
  );

  const { gaResults } = useCalculateMarkDistribution(subjectId);

  const { data } = useStdGaGrades(subject?.year, subject?.academicYear);

  return (
    <div className="overflow-auto pb-2">
      <div className="flex flex-nowrap">
        <FlexBox className="w-16 flex-shrink-0 justify-center border border-gray-400 border-r-0">
          No
        </FlexBox>

        <FlexBox className="w-52 flex-shrink-0 justify-center border border-gray-400">
          Student ID
        </FlexBox>

        {gaLists.map((ga, index, arr) => {
          const gaMarkDistribution = gaResults.find(
            (g) => g.id === ga.id
          )?.result;

          return (
            <Fragment key={"std-achi-keys" + ga.id}>
              <FlexBox className="flex-nowrap w-72 border border-gray-400 border-l-0">
                <FlexBox className="flex-col w-48 border-r border-r-gray-400">
                  <Text className="w-full py-1 text-center border-b border-b-gray-400">
                    {ga.slug}
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
                      {gaMarkDistribution}
                    </Text>
                    <Text className="flex-1 py-1 text-center">100</Text>
                  </FlexBox>
                </FlexBox>

                <Text className="text-center w-24">{ga.slug} Grade</Text>
              </FlexBox>

              {arr.length - 1 !== index ? (
                <div className="w-12 bg-gray-200 flex-shrink-0 border border-gray-400 border-l-0 border-b-0" />
              ) : null}
            </Fragment>
          );
        })}
      </div>

      {data?.map((std, stdIndex, stdArr) => {
        //...

        return (
          <div className="flex flex-nowrap " key={std.id + "std-keys"}>
            <FlexBox className="w-16 py-1 flex-shrink-0 justify-center border border-gray-400 border-r-0 border-t-0">
              {std.rollNumber}
            </FlexBox>

            <FlexBox className="w-52 flex-shrink-0 justify-center border border-gray-400 border-t-0">
              {std.studentName}
            </FlexBox>

            {gaLists.map((ga, index, arr) => {
              const gaValue = std?.ga?.find((g) => g.gaId === ga.id);

              if (gaValue === undefined) return null;

              // addition mark base on co instance / addition full mark base on co instance * 100
              const calculatedValue = get2Decimal(gaValue.totalMarks);

              const gaMarkDistribution = gaResults.find(
                (g) => g.id === ga.id
              )?.result;

              const markDistributionResult = get2Decimal(
                (calculatedValue / 100) * (gaMarkDistribution ?? 1)
              );

              return (
                <Fragment key={"std-achi-keys" + ga.id}>
                  <FlexBox className="flex-nowrap flex-shrink-0 w-24 border border-gray-400 border-l-0 border-t-0">
                    <Text className="text-center flex-1">
                      {markDistributionResult}
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
