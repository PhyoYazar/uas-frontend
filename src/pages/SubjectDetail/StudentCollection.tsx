import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { HeadText } from "./CourseWorkPlanning";

export const StudentCollection = () => {
  return (
    <div>
      <Tabs defaultValue="question">
        <TabsList className="mb-4">
          <TabsTrigger value="question">Question</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
          <TabsTrigger value="assignment">Assignment</TabsTrigger>
          <TabsTrigger value="lab">Lab</TabsTrigger>
        </TabsList>

        <TabsContent value="question">
          <StudentAssessment cols={5} />
        </TabsContent>
        <TabsContent value="tutorial"></TabsContent>
        <TabsContent value="assignment"></TabsContent>
        <TabsContent value="lab"></TabsContent>
      </Tabs>
    </div>
  );
};

// =================================================================================================

type StudentAssessmentProps = {
  cols: number;
};

const StudentAssessment = (props: StudentAssessmentProps) => {
  const { cols } = props;

  return (
    <div className="w-full overflow-auto border border-gray-300 rounded-md">
      {/* ------------------ header ---------------- */}
      <div className={`grid grid-cols-12`}>
        <FlexBox className="col-span-3 border-r border-r-gray-300 justify-center p-2">
          <HeadText>Assessment</HeadText>
        </FlexBox>

        <FlexBox className="col-span-7 justify-center">
          <div
            className={`w-full grid justify-center`}
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
            }}
          >
            {[1, 2, 3, 4, 5].map((e) => (
              <HeadText
                key={"asflke" + e}
                className="col-span-1 p-2 border-r border-r-gray-300 text-center"
              >
                Q{e}
              </HeadText>
            ))}
          </div>
        </FlexBox>
      </div>
      <SubjectRow cols={5} name="GA" />
      <SubjectRow cols={5} name="CO" />
      <SubjectRow cols={5} name="Full mark" />
      <SubjectRow cols={5} name="Percentage" />
      <SubjectRow cols={5} name="Calculation" />

      <div className={`grid grid-cols-12 h-8 border-t border-t-gray-300`} />

      {/* ================================= Sub Headers ================================= */}
      <div
        className={`grid grid-cols-12 border-t border-t-gray-300 bg-yellow-300`}
      >
        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center p-2">
          <HeadText>No</HeadText>
        </FlexBox>

        <FlexBox className="col-span-2 border-r border-r-gray-300 justify-center p-2">
          <HeadText>Student ID</HeadText>
        </FlexBox>

        <FlexBox className="col-span-7 justify-center border-r border-r-gray-300" />

        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
          <HeadText className="">Total</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
          <HeadText className="">Total (20%)</HeadText>
        </FlexBox>
      </div>

      {/* ================================= ROWS ================================= */}
      <StudentRow rollNumber={1} id="102" cols={5} />
    </div>
  );
};

// =================================================================================================

type SubjectRowProps = {
  cols: number;
  name: string;
};

const SubjectRow = (props: SubjectRowProps) => {
  const { name, cols } = props;

  return (
    <div className={`grid grid-cols-12 border-t border-t-gray-300`}>
      <FlexBox className="col-span-3 border-r border-r-gray-300 justify-center p-2">
        <HeadText className="text-gray-500">{name}</HeadText>
      </FlexBox>

      <FlexBox className="col-span-7 justify-center">
        <div
          className={`w-full grid justify-center`}
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
          }}
        >
          {[1, 2, 3, 4, 5].map((el) => (
            <HeadText
              key={"123s" + el}
              className="col-span-1 text-gray-500 p-2 border-r border-r-gray-300 text-center"
            >
              {el * 10}
            </HeadText>
          ))}
        </div>
      </FlexBox>
    </div>
  );
};

// =================================================================================================

type StudentRowProps = {
  cols: number;
  rollNumber: number;
  id: string;
};

const StudentRow = (props: StudentRowProps) => {
  const { rollNumber, id, cols } = props;

  return (
    <div className={`grid grid-cols-12 border-t border-t-gray-300`}>
      <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center p-2">
        <HeadText className="text-gray-600">{rollNumber}</HeadText>
      </FlexBox>

      <FlexBox className="col-span-2 border-r border-r-gray-300 justify-center p-2">
        <HeadText className="text-gray-600">{id}</HeadText>
      </FlexBox>

      <FlexBox className="col-span-7 justify-center">
        <div
          className={`w-full grid justify-center`}
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
          }}
        >
          {[1, 2, 3, 4, 5].map((el) => (
            <EditInput val="e" key={"adfasdf" + el} />
          ))}
        </div>
      </FlexBox>

      <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
        <HeadText className="text-gray-600">80</HeadText>
      </FlexBox>

      <FlexBox className="col-span-1 justify-center">
        <HeadText className="text-gray-600">40</HeadText>
      </FlexBox>
    </div>
  );
};

type EditInputProps = {
  val: string;
};

const EditInput = (props: EditInputProps) => {
  const { val } = props;

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="col-span-1 border-r border-r-gray-300">
      {isEditing ? (
        <div
          className="border-r border-r-gray-300 p-1"
          onDoubleClick={() => setIsEditing(false)}
        >
          <Input
            type="number"
            className="w-full h-7 focus-visible:ring-green-300  rounded-none"
          />
        </div>
      ) : (
        <Text
          onDoubleClick={() => setIsEditing(true)}
          className="font-semibold p-2 text-gray-600 text-center"
        >
          {val}
        </Text>
      )}
    </div>
  );
};
