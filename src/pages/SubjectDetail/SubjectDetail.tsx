import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  // const { data } = useQuery({
  //   queryKey: ["subject-detail"],
  //   queryFn: () => fetchBySubjectId(),
  // });

  const { data } = useQuery({
    queryKey: ["subject-by-id", subjectId],
    queryFn: ({ signal }) =>
      axios.get<Subject>(`subject-detail/${subjectId}`, { signal }),
    staleTime: 5000,
    enabled: subjectId !== undefined,
  });

  console.log("hello", data);

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
              <ListItem
                label="Course Name"
                value={"Data Communication and Networking"}
              />
              <ListItem label="Course Code" value={"IT-20123"} />
              <ListItem label="Semester" value={"1"} />
              <ListItem label="Academic Year" value={"2020-2021"} />
              <ListItem
                label="Lecturer/Coordinator Name"
                value={"Teacher Name"}
              />
              <ListItem label="Year" value={"Fourth Year"} />
              <ListItem label="% of Final Exam" value={"80%"} />
              <ListItem label="% of Course Work" value={"40%"} />
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

const ListItem = (props: { label: string; value: string }) => {
  const { label, value } = props;

  return (
    <FlexBox className="w-full items-start">
      <Text className="w-56 text-md font-medium  text-gray-500">{label}</Text>
      <Text className="w-8 text-md font-medium text-gray-500">{`:`}</Text>
      <Text className="flex-1 text-md font-medium text-gray-700">{value}</Text>
    </FlexBox>
  );
};
