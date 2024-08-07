import { BackBtn } from "@/components/common/back-button";
import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CoResults } from "./Co/CoResults";
import { GaResults } from "./Ga/GaResults";
import { StudentCollection } from "./Student/StudentCollection";
import { AssessmentContribution } from "./Subject/AssessmentContribution";
import { CoGaMapping } from "./Subject/CoGaMapping";
import { CourseWorkPlanning } from "./Subject/CourseWorkPlanning";
import { ExamPlanning } from "./Subject/ExamPlanning";
import { useGetSubjectById } from "./hooks/useFetches";

export const SubjectDetail = () => {
  const { subjectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const assessmentQueryValue = searchParams.get("subject_assessmentType");

  const { subject } = useGetSubjectById(subjectId);

  return (
    <section className="w-full p-4">
      <Tabs defaultValue="subject">
        <FlexBox className="mb-4 gap-4">
          <BackBtn route="/subject" />

          <TabsList>
            <TabsTrigger value="subject">Subject</TabsTrigger>
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="co">Course Outlines</TabsTrigger>
            <TabsTrigger value="ga">Graduate Attribute</TabsTrigger>
          </TabsList>
        </FlexBox>

        <TabsContent value="subject">
          <div className="space-y-6">
            <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-100 rounded-md border border-gray-200 shadow-sm">
              <ListItem label="Course Name" value={subject?.name ?? ""} />
              <ListItem label="Course Code" value={subject?.code ?? ""} />
              <ListItem
                label="Semester"
                valClassName="capitalize"
                value={subject?.semester ?? ""}
              />
              <ListItem
                label="Academic Year"
                value={subject?.academicYear ?? ""}
              />
              <ListItem
                label="Lecturer/Coordinator Name"
                value={subject?.instructor ?? ""}
              />
              <ListItem label="Year" value={subject?.year ?? ""} />
              <ListItem
                label="% of Final Exam"
                value={`${subject?.exam ?? ""}%`}
              />
              <ListItem
                label="% of Tutorial"
                value={`${subject?.tutorial ?? ""}%`}
              />
              <ListItem label="% of Lab" value={`${subject?.lab ?? ""}%`} />
              <ListItem
                label="% of Assignment"
                value={`${subject?.assignment ?? ""}%`}
              />
              <ListItem
                label="% of Practical"
                value={`${subject?.practical ?? ""}%`}
              />
            </div>

            <Tabs
              defaultValue={assessmentQueryValue ?? "co_ga_mapping"}
              onValueChange={(val) =>
                setSearchParams({ subject_assessmentType: val })
              }
            >
              <FlexBox className="justify-between">
                <TabsList>
                  <TabsTrigger value="co_ga_mapping">CO-GA Mapping</TabsTrigger>
                  <TabsTrigger value="assessment_exam_planning">
                    Assessment (Planning)-Exam
                  </TabsTrigger>
                  <TabsTrigger value="assessment_course_work_planning">
                    Assessment (Planning) Course Work
                  </TabsTrigger>
                  <TabsTrigger value="assessment_contribution">
                    Assessment Contribution
                  </TabsTrigger>
                </TabsList>

                <Link
                  to={`/subject/create/${subjectId}${
                    assessmentQueryValue === "assessment_contribution"
                      ? ""
                      : `?subject_assessmentType=${
                          assessmentQueryValue ?? "co_ga_mapping"
                        }`
                  }`}
                >
                  <Button>Create</Button>
                </Link>
              </FlexBox>

              <TabsContent value="co_ga_mapping">
                <CoGaMapping />
              </TabsContent>

              <TabsContent value="assessment_exam_planning">
                <ExamPlanning />
              </TabsContent>

              <TabsContent value="assessment_course_work_planning">
                <CourseWorkPlanning />
              </TabsContent>

              <TabsContent value="assessment_contribution">
                <AssessmentContribution />
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="student">
          <StudentCollection />
        </TabsContent>

        <TabsContent value="co">
          <CoResults />
        </TabsContent>

        <TabsContent value="ga">
          <GaResults />
        </TabsContent>
      </Tabs>
    </section>
  );
};

const ListItem = (props: {
  label: string;
  value: string;
  valClassName?: string;
}) => {
  const { label, value, valClassName } = props;

  return (
    <FlexBox className="w-full items-start">
      <Text className="w-56 text-md font-medium  text-gray-500">{label}</Text>
      <Text className="w-8 text-md font-medium text-gray-500">{`:`}</Text>
      <Text
        className={cn("flex-1 text-md font-medium text-gray-700", valClassName)}
      >
        {value}
      </Text>
    </FlexBox>
  );
};
