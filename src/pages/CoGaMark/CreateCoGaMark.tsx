import { useGetAttributes } from "@/common/hooks/useFetches";
import { BackBtn } from "@/components/common/back-button";
import { Card } from "@/components/common/card";
import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { CoGaMapping } from "../SubjectDetail/Subject/CoGaMapping";
import { CourseWorkPlanning } from "../SubjectDetail/Subject/CourseWorkPlanning";
import { ExamPlanning } from "../SubjectDetail/Subject/ExamPlanning";
import {
  useGetCWAttributeWithCoGaMarks,
  useGetExamAttributeWithCoGaMarks,
} from "../SubjectDetail/hooks/useFetches";
import { CreateCo } from "./CreateCo";
import { CreateMark } from "./CreateMark";

export const CreateCoGaMark = () => {
  const { subjectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const assessmentQueryValue = searchParams.get("subject_assessmentType");

  const { attributes: isEmptyCW } = useGetCWAttributeWithCoGaMarks({
    subjectId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: (data) => (data?.data?.items === null) as any,
  });

  const { attributes: isEmptyExamQ } = useGetExamAttributeWithCoGaMarks({
    subjectId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select: (data) => (data?.data?.items === null) as any,
  });

  const { attributes: examQuestions } = useGetAttributes({
    type: "EXAM",
    select: (data) => data?.data?.items,
  });

  const { attributes: tutorialsCW } = useGetAttributes({
    type: "COURSEWORK",
    select: (data) => data?.data?.items,
  });

  const { data: totalCos } = useQuery({
    queryKey: ["co-by-subject-id", subjectId],
    queryFn: ({ signal }) =>
      axios.get(`cos?subjectId=${subjectId}`, { signal }),
    staleTime: 5000,
    enabled: subjectId !== undefined,
    select: (data) => data?.data?.total ?? 0,
  });

  return (
    <section className="space-y-16 h-full">
      <Tabs
        defaultValue={assessmentQueryValue ?? "co_ga_mapping"}
        onValueChange={(val) =>
          setSearchParams({ subject_assessmentType: val })
        }
      >
        <FlexBox className="mb-4 gap-2">
          <BackBtn
            route={`/subject/${subjectId}?subject_assessmentType=${
              assessmentQueryValue ?? "co_ga_mapping"
            }`}
          />

          <TabsList className="">
            <TabsTrigger value="co_ga_mapping">Course Outlines</TabsTrigger>
            <TabsTrigger value="assessment_exam_planning">Exam</TabsTrigger>
            <TabsTrigger value="assessment_course_work_planning">
              Course Work
            </TabsTrigger>
          </TabsList>
        </FlexBox>

        <TabsContent value="co_ga_mapping">
          <Card className="space-y-4 bg-gray-50">
            {totalCos === 0 ? (
              <Text>
                There is no course outlines. Please create course outlines.
              </Text>
            ) : (
              <>
                <Text className="text-xl font-semibold">Course outlines</Text>

                <CoGaMapping />
              </>
            )}

            <CreateCo />
          </Card>
        </TabsContent>

        <TabsContent value="assessment_exam_planning">
          <Card className="space-y-4 bg-gray-50">
            {isEmptyExamQ ? (
              <Text>
                There is no question created with marks. Please create question.
              </Text>
            ) : (
              <>
                <Text className="text-xl font-semibold">
                  Exam Planning Assessment
                </Text>

                <ExamPlanning />
              </>
            )}

            <CreateMark type="exam" attributes={examQuestions} />
          </Card>
        </TabsContent>

        <TabsContent value="assessment_course_work_planning">
          <Card className="space-y-4 bg-gray-50">
            {isEmptyCW ? (
              <Text>
                There is no course work created with marks. Please create course
                work.
              </Text>
            ) : (
              <>
                <Text className="text-xl font-semibold">
                  Course Work Planning Assessment
                </Text>

                <CourseWorkPlanning />
              </>
            )}

            <CreateMark type="coursework" attributes={tutorialsCW} />
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};
