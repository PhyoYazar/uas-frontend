import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CoGrade } from "./CoGrade";
import { StudentAchievement } from "./StudentAchievement";

export const CoResults = () => {
  return (
    <Tabs defaultValue="stdAchievement">
      <TabsList>
        <TabsTrigger value="stdAchievement">Student Achievement</TabsTrigger>
        <TabsTrigger value="coGrade">Co Grade</TabsTrigger>
      </TabsList>

      <TabsContent value="stdAchievement">
        <StudentAchievement />
      </TabsContent>

      <TabsContent value="coGrade">
        <CoGrade />
      </TabsContent>
    </Tabs>
  );
};
