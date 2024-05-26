import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SubjectTable } from "./SubjectTable";

export const Subjects = () => {
  return (
    <section className="space-y-4">
      <FlexBox className="justify-between">
        <Text></Text>

        <Link to={"/subject/create"}>
          <Button>Create</Button>
        </Link>
      </FlexBox>

      <SubjectTable />
    </section>
  );
};
