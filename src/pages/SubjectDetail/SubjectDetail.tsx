import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Subject } from "../Subjects/SubjectTable";
import { CoGaMapping } from "./CoGaMapping";
import { CourseWorkPlanning } from "./CourseWorkPlanning";
import { ExamPlanning } from "./ExamPlanning";

// const fetchBySubjectId = () => {
//   return axios.get("https://jsonplaceholder.typicode.com/posts");
// };

export const SubjectDetail = () => {
  const { subjectId } = useParams();

  const { data: subject } = useQuery({
    queryKey: ["subject-by-id", subjectId],
    queryFn: ({ signal }) =>
      axios.get<Subject>(`subjects/${subjectId}`, { signal }),
    staleTime: 5000,
    enabled: subjectId !== undefined,
    select: (data) => data?.data,
  });

  return (
    <section className="w-full p-4">
      <Tabs defaultValue="subject">
        <TabsList className="mb-4">
          <TabsTrigger value="subject">Subject</TabsTrigger>
          <TabsTrigger value="student">Student</TabsTrigger>
        </TabsList>

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
                label="% of Course Work"
                value={`${100 - (subject?.exam ?? 100) ?? ""}%`}
              />
            </div>

            <Tabs defaultValue="co_ga_mapping">
              <TabsList>
                <TabsTrigger value="co_ga_mapping">CO-GA Mapping</TabsTrigger>
                <TabsTrigger value="assessment_exam_planning">
                  Assessment (Planning)-Exam
                </TabsTrigger>
                <TabsTrigger value="assessment_course_work_planning">
                  Assessment (Planning) Course Work
                </TabsTrigger>
                {/* <TabsTrigger value="assessment_contribution">
                  Assessment Contribution
                </TabsTrigger> */}
              </TabsList>

              <TabsContent value="co_ga_mapping">
                <CoGaMapping />
              </TabsContent>

              <TabsContent value="assessment_exam_planning">
                <ExamPlanning />
              </TabsContent>

              <TabsContent value="assessment_course_work_planning">
                <CourseWorkPlanning />
              </TabsContent>

              {/* <TabsContent value="password">Change your password here.</TabsContent> */}
            </Tabs>
          </div>
        </TabsContent>

        {/* <TabsContent value="password">Change your password here.</TabsContent> */}
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
