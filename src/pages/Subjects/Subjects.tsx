import { FlexBox } from "@/components/common/flex-box";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { SubjectTable } from "./SubjectTable";

export const Subjects = () => {
  return (
    <section className="space-y-4">
      <FlexBox className="justify-between">
        <FlexBox>
          <Input placeholder="search by name" className="w-80" />
        </FlexBox>

        <Link to={"/subject/create"}>
          <Button className="w-40">Create</Button>
        </Link>
      </FlexBox>

      <SubjectTable />
    </section>
  );
};
