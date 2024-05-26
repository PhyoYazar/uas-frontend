import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoGaMapping } from "./CoGaMapping";

// const fetchBySubjectId = () => {
//   return axios.get("https://jsonplaceholder.typicode.com/posts");
// };

export const SubjectDetail = () => {
  //   const { subjectId } = useParams();

  // const { data } = useQuery({
  //   queryKey: ["subject-detail"],
  //   queryFn: () => fetchBySubjectId(),
  // });

  // console.log("hello", data);

  return (
    <section className="w-full p-4 space-y-4">
      <div className="p-4 grid grid-cols-2 gap-6 bg-gray-100 rounded-md border border-gray-200 shadow-sm">
        <ListItem label="Academic Year" value={"2020-2021"} />
        <ListItem label="Semester" value={"1"} />
        <ListItem
          label="Course Name"
          value={"Data Communication and Networking"}
        />
        <ListItem label="Course Code" value={"IT-20123"} />
        <ListItem label="Lecturer/Coordinator Name " value={"Teacher Name"} />
      </div>

      <Tabs defaultValue="co_ga_mapping">
        <TabsList>
          <TabsTrigger value="co_ga_mapping">CO-GA Mapping</TabsTrigger>
          <TabsTrigger value="assessment_planning">
            Assessment (Planning)-Exam
          </TabsTrigger>
          <TabsTrigger value="assessment_course_work">
            Assessment (Planning) Course Work
          </TabsTrigger>
          <TabsTrigger value="assessment_contribution">
            Assessment Contribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="co_ga_mapping">
          <CoGaMapping />
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
      <Text className="w-10 text-md font-medium text-gray-500">{`:`}</Text>
      <Text className="flex-1 text-md font-medium text-gray-700">{value}</Text>
    </FlexBox>
  );
};
