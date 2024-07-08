import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GaGrade } from "./GaGrade";
import { StudentAchievement } from "./StudentAchievement";

export const GaResults = () => {
  return (
    <Tabs defaultValue="stdAchievement">
      <TabsList>
        <TabsTrigger value="stdAchievement">Student Achievement</TabsTrigger>
        <TabsTrigger value="gaGrade">Ga Grade</TabsTrigger>
      </TabsList>

      <TabsContent value="stdAchievement">
        <StudentAchievement />
      </TabsContent>

      <TabsContent value="gaGrade">
        <GaGrade />
      </TabsContent>
    </Tabs>
  );
};
