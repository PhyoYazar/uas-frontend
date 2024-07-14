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
import { analyzeGrading } from "../helpers/helpers";
import { useGetSubjectDetail, useStdGaGrades } from "../hooks/useFetches";

export const GaGrade = () => {
  const { subjectId } = useParams();
  const { subject, cos } = useGetSubjectDetail(subjectId);

  const gaLists = getUniqueObjects(cos.map((c) => c.ga).flat(1)).sort(
    (a, b) => +a.slug.slice(2) - +b.slug.slice(2)
  );
  const { data, isPending } = useStdGaGrades(
    subject?.year,
    subject?.academicYear,
    subjectId
  );

  if (isPending) return null;

  const results = analyzeGrading(
    gaLists.map((c) => c.id),
    (results) => {
      data.forEach((std) => {
        std.ga.forEach((ga) => {
          const grade = transformGrade(get2Decimal(ga.totalMarks));

          const index = results.findIndex((r) => r.grade === grade);
          if (index > -1) {
            const gaIndex = results[index].list.findIndex(
              (g) => g.id === ga.gaId
            );

            // co is exist in results
            if (gaIndex > -1) {
              results[index].list[gaIndex].count += 1;
              return;
            }

            results[index].list.push({
              id: ga.gaId,
              count: 1,
            });
          }
        });
      });
    }
  );

  return (
    <div className="overflow-auto pb-2">
      <div className="flex flex-nowrap">
        <FlexBox className="w-16 flex-shrink-0 justify-center border border-gray-400 border-r-0">
          Grade
        </FlexBox>

        <FlexBox className="w-52 flex-shrink-0 justify-center border border-gray-400">
          Mark
        </FlexBox>

        {gaLists.map((ga, index, arr) => (
          <Fragment key={"std-achi-keys-ga" + ga.id}>
            <FlexBox className="flex-col border border-gray-400 border-l-0">
              <Text className="w-full py-1 text-center border-b border-b-gray-400">
                {ga.slug}
              </Text>

              <FlexBox className="w-full flex-nowrap">
                <Text className="w-24 py-1 text-center border-r border-r-gray-400">
                  No. of student
                </Text>
                <Text className="w-24 py-1 text-center mr-[-1px]">% (Nos)</Text>
              </FlexBox>
            </FlexBox>

            {arr.length - 1 !== index ? (
              <div className="w-12 bg-gray-200 flex-shrink-0 border border-gray-400 border-l-0 border-b-0" />
            ) : null}
          </Fragment>
        ))}
      </div>

      {results.map((grade, stdIndex, stdArr) => (
        <div className="flex flex-nowrap " key={grade.grade + "co-grade-keys"}>
          <FlexBox className="w-16 py-1 flex-shrink-0 pl-6 border border-gray-400 border-r-0 border-t-0">
            {grade.grade}
          </FlexBox>

          <FlexBox className="w-52 flex-shrink-0 justify-center border border-gray-400 border-t-0">
            {grade.marks}
          </FlexBox>

          {grade.list.map((co, index, arr) => (
            <Fragment key={"std-achi-keys" + co.id}>
              <FlexBox className="flex-nowrap flex-shrink-0 w-24 border border-gray-400 border-l-0 border-t-0">
                <Text className="text-center flex-1">{co.count}</Text>
              </FlexBox>

              <FlexBox className="flex-nowrap flex-shrink-0 w-24 border border-gray-400 border-t-0 border-l-0">
                <Text className="text-center flex-1">
                  {get2Decimal((co.count / data.length) * 100)}%
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
          ))}
        </div>
      ))}
    </div>
  );
};
