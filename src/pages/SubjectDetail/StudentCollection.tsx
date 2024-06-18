import { get2Decimal } from "@/common/utils/utils";
import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { HeadText } from "./CourseWorkPlanning";
import {
  useGetAllStudentsBySubject,
  useGetAttributeWithCoGaMarks,
  useGetSubjectById,
} from "./hooks/useFetches";

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
          <StudentAssessment type="Question" />
        </TabsContent>

        <TabsContent value="tutorial">
          <StudentAssessment type="Tutorial" />
        </TabsContent>

        <TabsContent value="assignment">
          <StudentAssessment type="Assignment" />
        </TabsContent>

        <TabsContent value="lab">
          <StudentAssessment type="Lab" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// =================================================================================================

type StudentAssessmentProps = {
  type: "Question" | "Tutorial" | "Assignment" | "Lab";
};

const StudentAssessment = (props: StudentAssessmentProps) => {
  const { type } = props;

  const { subjectId } = useParams();

  const { attributes } = useGetAttributeWithCoGaMarks({
    subjectId,
    type,
  });

  const { subject } = useGetSubjectById(subjectId, (data) => data?.data);
  const examPercent = subject?.exam ?? 0;

  const { students } = useGetAllStudentsBySubject(
    subject?.year,
    subject?.academicYear
  );

  // -------------------------------------------------------------

  const totalAttributes = attributes?.length ?? 0;

  const gaArray =
    attributes?.map((attribute) =>
      attribute?.marks?.map((m) => m.gaSlug.slice(2))?.join(", ")
    ) ?? [];

  const coArray =
    attributes?.map((attribute) =>
      attribute?.co?.map((c) => c.instance)?.join(", ")
    ) ?? [];

  const fullMarks =
    attributes?.map((attribute) => attribute?.fullMark + "") ?? [];

  console.log("hello", attributes?.length);

  if (!attributes?.length) {
    return (
      <FlexBox className="h-96 justify-center flex-col gap-4">
        <Text className="text-lg font-semibold text-gray-700">
          Create {type} first to see the students results.
        </Text>

        <Link to={`/subject/create/${subjectId}`}>
          <Button>Create</Button>
        </Link>
      </FlexBox>
    );
  }

  return (
    <div className="w-full overflow-auto border border-gray-400 rounded-md">
      {/* ------------------ header ---------------- */}
      <div className={`grid grid-cols-12`}>
        <FlexBox className="col-span-3 border-r border-r-gray-400 justify-center p-2">
          <HeadText>Assessment</HeadText>
        </FlexBox>

        <FlexBox className="col-span-7 justify-center">
          <div
            className={`w-full grid justify-center`}
            style={{
              gridTemplateColumns: `repeat(${totalAttributes}, 1fr)`,
            }}
          >
            {attributes?.map(({ id, instance, name }) => (
              <HeadText
                key={id}
                className="col-span-1 p-2 border-r border-r-gray-400 text-center"
              >
                {name + " " + instance}
              </HeadText>
            ))}
          </div>
        </FlexBox>
      </div>

      <SubjectRow cols={totalAttributes} name="GA" values={gaArray} />
      <SubjectRow cols={totalAttributes} name="CO" values={coArray} />

      <SubjectRow
        cols={totalAttributes}
        name="Full mark"
        values={fullMarks}
        // values={Array.from({ length: totalAttributes }, () => fullMark + "")}
      />

      <SubjectRow
        cols={totalAttributes}
        name="Percentage"
        values={fullMarks.map(
          (fm) =>
            `${get2Decimal(
              type === "Question"
                ? (examPercent / 100) * +fm
                : ((100 - examPercent) / 100) * +fm
            )}`
        )}
      />

      <SubjectRow
        cols={totalAttributes}
        name="Calculation"
        values={Array.from(
          { length: totalAttributes },
          () =>
            `${
              type === "Question"
                ? examPercent / 100
                : (100 - examPercent) / 100
            }`
        )}
      />

      <div className={`grid grid-cols-12 h-8 border-t border-t-gray-400`} />

      {/* ================================= Student Headers ================================= */}
      <div
        className={`grid grid-cols-12 border-t border-t-gray-400 bg-yellow-400`}
      >
        <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center p-2">
          <HeadText>No</HeadText>
        </FlexBox>

        <FlexBox className="col-span-2 border-r border-r-gray-400 justify-center p-2">
          <HeadText>Student ID</HeadText>
        </FlexBox>

        <FlexBox className="col-span-7 justify-center border-r border-r-gray-400" />

        <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center">
          <HeadText className="">Total 100%</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center">
          <HeadText className="">
            Total (
            {type === "Question" ? examPercent + "" : 100 - examPercent + ""}%)
          </HeadText>
        </FlexBox>
      </div>

      {/* ================================= ROWS ================================= */}
      {students?.items?.map((std) => {
        const totalMarks = std?.attributes?.reduce(
          (acc, cur) => acc + cur.fullMark,
          0
        );

        return (
          <StudentRow
            key={std?.id}
            total={totalMarks}
            totalPercents={
              type === "Question"
                ? (totalMarks / 100) * examPercent
                : (totalMarks / 100) * (100 - examPercent)
            }
            studentId={std?.id}
            rollNumber={std?.rollNumber}
            stdNumber={std?.studentNumber}
            cols={totalAttributes}
            markArray={
              attributes?.map(({ id }) => {
                const findAttribute = std?.attributes?.find(
                  (att) => att.attributeId === id
                );

                if (findAttribute) {
                  return {
                    attributeId: findAttribute.attributeId,
                    mark: findAttribute.fullMark,
                    studentMarkId: findAttribute.studentMarkId,
                  };
                }

                return {
                  attributeId: id,
                  mark: 0,
                };
              }) ?? []
            }
          />
        );
      })}
    </div>
  );
};

// =================================================================================================

type SubjectRowProps = {
  cols: number;
  name: string;
  values: string[];
};

const SubjectRow = (props: SubjectRowProps) => {
  const { name, cols, values } = props;

  return (
    <div className={`grid grid-cols-12 border-t border-t-gray-400`}>
      <FlexBox className="col-span-3 border-r border-r-gray-400 justify-center p-2">
        <HeadText className="text-gray-500">{name}</HeadText>
      </FlexBox>

      <FlexBox className="col-span-7 justify-center">
        <div
          className={`w-full grid justify-center`}
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
          }}
        >
          {values.map((val, index) => (
            <HeadText
              key={val + "brnyr" + index}
              className="col-span-1 text-gray-500 p-2 border-r border-r-gray-400 text-center"
            >
              {val}
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
  studentId: string;
  stdNumber: number;
  markArray: { attributeId: string; studentMarkId?: string; mark: number }[];
  total: number;
  totalPercents: number;
};

const StudentRow = (props: StudentRowProps) => {
  const {
    rollNumber,
    studentId,
    stdNumber,
    markArray,
    cols,
    total,
    totalPercents,
  } = props;

  return (
    <div className={`grid grid-cols-12 border-t border-t-gray-400`}>
      <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center p-2">
        <HeadText className="text-gray-600">{rollNumber}</HeadText>
      </FlexBox>

      <FlexBox className="col-span-2 border-r border-r-gray-400 justify-center p-2">
        <HeadText className="text-gray-600">{stdNumber}</HeadText>
      </FlexBox>

      <FlexBox className="col-span-7 justify-center">
        <div
          className={`w-full grid justify-center`}
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
          }}
        >
          {markArray.map(({ attributeId, studentMarkId, mark }) => (
            <EditInput
              val={mark}
              studentId={studentId}
              attributeId={attributeId}
              studentMarkId={studentMarkId}
              key={"attStd" + attributeId}
            />
          ))}
        </div>
      </FlexBox>

      <FlexBox className="col-span-1 border-r border-r-gray-400 justify-center">
        <HeadText className="text-gray-600">{total}</HeadText>
      </FlexBox>

      <FlexBox className="col-span-1 justify-center">
        <HeadText className="text-gray-600">{totalPercents}</HeadText>
      </FlexBox>
    </div>
  );
};

type EditInputProps = {
  val: number;
  attributeId: string;
  studentId: string;
  studentMarkId?: string;
};

const EditInput = (props: EditInputProps) => {
  const { val, studentId, attributeId, studentMarkId } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [mark, setMark] = useState("");

  const { subjectId } = useParams();
  const queryClient = useQueryClient();

  const { subject } = useGetSubjectById(subjectId, (data) => data?.data);

  const addMarkMutation = useMutation({
    mutationFn: (newMark: {
      subjectID: string;
      attributeID: string;
      studentID: string;
      mark: number;
    }) => axios.post("student_mark", newMark),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "all-students-by-subject-id",
          subject?.year,
          subject?.academicYear,
        ],
      });
    },
    onError() {
      toast.error("Fail to add the mark.");
    },
  });

  const updateMarkMutation = useMutation({
    mutationFn: (newMark: { mark: number }) =>
      axios.put(`student_mark/${studentMarkId}`, newMark),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "all-students-by-subject-id",
          subject?.year,
          subject?.academicYear,
        ],
      });
    },
    onError() {
      toast.error("Fail to update the mark.");
    },
  });

  useEffect(() => {
    setMark(val + "");
  }, [val]);

  return (
    <div className="col-span-1 border-r border-r-gray-400">
      {isEditing ? (
        <div className="border-r border-r-gray-400 p-1">
          <Input
            autoFocus
            type="number"
            className="w-full h-7 focus-visible:ring-green-500  rounded-none"
            value={mark}
            onChange={(e) => setMark(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              setMark(val + "");
            }}
            min={1}
            onKeyUp={(e) => {
              if (e.key !== "Enter") return;

              if (studentMarkId === undefined) {
                if (subjectId) {
                  addMarkMutation.mutate({
                    subjectID: subjectId,
                    attributeID: attributeId,
                    studentID: studentId,
                    mark: +mark,
                  });
                }
              } else {
                updateMarkMutation.mutate({
                  mark: +mark,
                });
              }

              setIsEditing(false);
            }}
          />
        </div>
      ) : (
        <Text
          onDoubleClick={() => setIsEditing(true)}
          className="font-semibold p-2 text-gray-600 text-center"
        >
          {mark}
        </Text>
      )}
    </div>
  );
};
