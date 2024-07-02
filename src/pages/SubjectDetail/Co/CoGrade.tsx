import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useGetSubjectDetail } from "../hooks/useFetches";

export const CoGrade = () => {
  const { subjectId } = useParams();
  const { cos } = useGetSubjectDetail(subjectId);

  const coLists = [...cos].sort((a, b) => +a.instance - +b.instance);

  //   const { students } = useGetAllStudentsBySubject(
  //     subject?.year,
  //     subject?.academicYear
  //   );

  return (
    <div className="overflow-auto pb-2">
      <div className="flex flex-nowrap">
        <FlexBox className="w-16 flex-shrink-0 justify-center border border-gray-400 border-r-0">
          Grade
        </FlexBox>

        <FlexBox className="w-52 flex-shrink-0 justify-center border border-gray-400">
          Mark
        </FlexBox>

        {coLists.map((co, index, arr) => (
          <Fragment key={"std-achi-keys" + co.id}>
            <FlexBox className="flex-col border border-gray-400 border-l-0">
              <Text className="w-full py-1 text-center border-b border-b-gray-400">
                CO{co.instance}
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

      {grades.map((grade, stdIndex, stdArr) => (
        <div className="flex flex-nowrap " key={grade.grade + "co-grade-keys"}>
          <FlexBox className="w-16 py-1 flex-shrink-0 pl-6 border border-gray-400 border-r-0 border-t-0">
            {grade.grade}
          </FlexBox>

          <FlexBox className="w-52 flex-shrink-0 justify-center border border-gray-400 border-t-0">
            {grade.mark}
          </FlexBox>

          {cos.map((co, index, arr) => (
            <Fragment key={"std-achi-keys" + co.id}>
              <FlexBox className="flex-nowrap flex-shrink-0 w-24 border border-gray-400 border-l-0 border-t-0">
                <Text className="text-center flex-1">
                  CO{co.instance} Grade
                </Text>
              </FlexBox>

              <FlexBox className="flex-nowrap flex-shrink-0 w-24 border border-gray-400 border-t-0 border-l-0">
                <Text className="text-center flex-1">
                  CO{co.instance} Grade
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

const grades = [
  { grade: "A+", mark: "75" },
  { grade: "A", mark: "70" },
  { grade: "A-", mark: "65" },
  { grade: "B+", mark: "60" },
  { grade: "B", mark: "55" },
  { grade: "B-", mark: "50" },
  { grade: "C+", mark: "45" },
  { grade: "C", mark: "42" },
  { grade: "C-", mark: "40" },
  { grade: "D", mark: "<40" },
];
