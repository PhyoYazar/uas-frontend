import { get2Decimal, transformGrade } from "@/common/utils/utils";
import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { HeadText } from "../Subject/CourseWorkPlanning";
import { calculateAttributeFinalResult } from "../helpers/helpers";
import {
  Attribute,
  useGetAllStudentsBySubject,
  useGetAttributeWithCoGaMarks,
  useGetSubjectById,
} from "../hooks/useFetches";

export const StudentCollection = () => {
  return (
    <div>
      <Tabs defaultValue="question">
        <TabsList className="mb-4">
          <TabsTrigger value="question">Question</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorial</TabsTrigger>
          <TabsTrigger value="assignment">Assignment</TabsTrigger>
          <TabsTrigger value="lab">Lab</TabsTrigger>
          <TabsTrigger value="practical">Practical</TabsTrigger>
          <TabsTrigger value="total">Total</TabsTrigger>
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

        <TabsContent value="practical">
          <StudentAssessment type="Practical" />
        </TabsContent>

        <TabsContent value="total">
          <StudentAssessment type="Total" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// =================================================================================================

type AttributeType =
  | "Question"
  | "Tutorial"
  | "Assignment"
  | "Lab"
  | "Practical"
  | "Total";

type StudentAssessmentProps = {
  type: AttributeType;
};

const StudentAssessment = (props: StudentAssessmentProps) => {
  const { type } = props;

  const { subjectId } = useParams();

  const { attributes } = useGetAttributeWithCoGaMarks({
    subjectId,
    type,
  });

  const sortedAttributes = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let upd: Attribute[] = [];

    ["Question", "Tutorial", "Practical", "Lab", "Assignment"].forEach(
      (typ) => {
        upd = [
          ...upd,
          ...(attributes
            ?.filter((att) => att.name === typ)
            .sort((a, b) => a.instance - b.instance) ?? []),
        ];
      }
    );

    return upd;
  }, [attributes]);

  const updatedAttributes = type === "Total" ? sortedAttributes : attributes;

  const { subject } = useGetSubjectById(subjectId, (data) => data?.data);

  const examPercent = subject?.exam ?? 0;
  const tutorialPercent = subject?.tutorial ?? 0;
  const labPercent = subject?.lab ?? 0;
  const assignmentPercent = subject?.assignment ?? 0;
  const practicalPercent = subject?.practical ?? 0;

  const getPercent = (typ: AttributeType) => {
    if (typ === "Question") return examPercent;
    if (typ === "Tutorial") return tutorialPercent;
    if (typ === "Practical") return practicalPercent;
    if (typ === "Lab") return labPercent;
    if (typ === "Assignment") return assignmentPercent;

    return 0;
  };
  const percent = getPercent(type);

  const { students } = useGetAllStudentsBySubject(
    subject?.year,
    subject?.academicYear
  );

  // -------------------------------------------------------------

  const totalAttributes = updatedAttributes?.length ?? 0;

  const gaArray =
    updatedAttributes?.map((attribute) =>
      attribute?.marks?.map((m) => m.gaSlug.slice(2))?.join(", ")
    ) ?? [];

  const coArray =
    updatedAttributes?.map((attribute) =>
      attribute?.co?.map((c) => c.instance)?.join(", ")
    ) ?? [];

  const fullMarks =
    updatedAttributes?.map((attribute) => attribute?.fullMark + "") ?? [];

  if (!updatedAttributes?.length) {
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
    <div className="overflow-auto pb-2">
      {/* ------------------ header ---------------- */}
      <div className="w-full flex flex-nowrap">
        <div className={`flex flex-nowrap`}>
          <FlexBox className="border border-gray-400 border-b-0 border-r-0 justify-center p-2 min-w-52">
            <HeadText>Assessment</HeadText>
          </FlexBox>

          <FlexBox className="min-w-[700px]">
            <div className={`w-full flex flex-nowrap`}>
              {updatedAttributes?.map(({ id, instance, name }, index, arr) => (
                <HeadText
                  key={id}
                  className={cn(
                    "p-2 border border-gray-400 border-b-0 border-r-0 text-center min-w-32",
                    index === arr.length - 1 ? "border-r-1" : ""
                  )}
                >
                  {name + " " + instance}
                </HeadText>
              ))}
            </div>
          </FlexBox>
        </div>
      </div>

      <SubjectRow name="GA" values={gaArray} />
      <SubjectRow name="CO" values={coArray} />

      <SubjectRow
        name="Full mark (100%)"
        values={fullMarks}
        // values={Array.from({ length: totalAttributes }, () => fullMark + "")}
      />

      <SubjectRow
        name={`Percentage`}
        values={updatedAttributes.map(
          (att) =>
            `${get2Decimal(
              (getPercent(att?.name as AttributeType) / 100) * +att.fullMark
            )}`
        )}
      />

      <SubjectRow
        className="border-b-1"
        name="Calculation"
        values={updatedAttributes.map(
          (att) =>
            `${get2Decimal(getPercent(att?.name as AttributeType) / 100)}`
        )}
        // values={Array.from(
        //   { length: totalAttributes },
        //   () => `${percent / 100}`
        // )}
      />

      <div className={`h-8`} />

      {/* ================================= Student Headers ================================= */}
      <div
        className={`w-full flex flex-nowrap`}
        style={{ gridTemplateColumns: "repeat(12, 1fr)" }}
      >
        <FlexBox className="border border-gray-400 border-r-0 justify-center p-2 min-w-20">
          <HeadText>No</HeadText>
        </FlexBox>

        <FlexBox className="border border-gray-400 border-r-0 justify-center p-2 min-w-32">
          <HeadText>Student Name</HeadText>
        </FlexBox>

        <FlexBox className="min-w-700 border border-gray-400 border-r-0">
          {Array.from({ length: totalAttributes }).map((t, index) => (
            <div key={"asdfaa--" + t + index} className="min-w-32" />
          ))}
        </FlexBox>

        <FlexBox className="border border-gray-400 border-r-0 justify-center min-w-24">
          <HeadText className="">Total 100%</HeadText>
        </FlexBox>

        {type === "Total" ? (
          <FlexBox className="border border-gray-400 justify-center min-w-24">
            <HeadText className="">Grade</HeadText>
          </FlexBox>
        ) : (
          <FlexBox className="border border-gray-400 justify-center min-w-24">
            <HeadText className="">Total ({percent}%)</HeadText>
          </FlexBox>
        )}
      </div>

      {/* ================================= ROWS ================================= */}
      {students?.items?.map((std, index, arr) => {
        const totalMarks = std?.attributes?.reduce((acc, cur) => {
          if (cur.name === type) {
            acc += cur.mark;
          }

          return acc;
        }, 0);

        const tutorialResults = calculateAttributeFinalResult(
          "Tutorial",
          tutorialPercent,
          std
        );

        const practicalResults = calculateAttributeFinalResult(
          "Practical",
          practicalPercent,
          std
        );

        const labResults = calculateAttributeFinalResult(
          "Lab",
          labPercent,
          std
        );

        const assignmentResults = calculateAttributeFinalResult(
          "Assignment",
          assignmentPercent,
          std
        );

        const questionResults = calculateAttributeFinalResult(
          "Question",
          examPercent,
          std
        );

        const totalResult = get2Decimal(
          tutorialResults +
            practicalResults +
            labResults +
            assignmentResults +
            questionResults
        );

        console.log("hello ", totalResult, questionResults);

        return (
          <StudentRow
            className={index === arr.length - 1 ? "border-b-1" : ""}
            key={std?.id}
            total={type === "Total" ? totalResult : totalMarks}
            totalPercents={
              type === "Total"
                ? transformGrade(totalResult)
                : get2Decimal((totalMarks / 100) * percent)
            }
            studentId={std?.id}
            rollNumber={std?.rollNumber}
            studentName={std?.studentName}
            cols={totalAttributes}
            markArray={
              updatedAttributes?.map(({ id, fullMark }) => {
                const findAttribute = std?.attributes?.find(
                  (att) => att.attributeId === id
                );

                if (findAttribute) {
                  return {
                    attributeId: findAttribute.attributeId,
                    mark: findAttribute.mark,
                    fullMark: fullMark,
                    studentMarkId: findAttribute.studentMarkId,
                  };
                }

                return {
                  attributeId: id,
                  mark: 0,
                  fullMark: fullMark,
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
  name: string;
  values: string[];
  className?: string;
};

const SubjectRow = (props: SubjectRowProps) => {
  const { name, values, className } = props;

  return (
    <div className="w-full flex flex-nowrap">
      <div
        className={cn(`flex flex-nowrap`)}
        style={{ gridTemplateColumns: "repeat(12, 1fr)" }}
      >
        <FlexBox
          className={cn(
            "border border-gray-400 border-r-0 border-b-0 justify-center p-2 min-w-52",
            className
          )}
        >
          <HeadText className="text-gray-500">{name}</HeadText>
        </FlexBox>

        <FlexBox className="min-w-[700px]">
          <div className={`w-full flex flex-nowrap`}>
            {values.map((val, index, arr) => (
              <HeadText
                key={val + "brnyr" + index}
                className={cn(
                  "text-gray-500 p-2 border border-gray-400 border-b-0 border-r-0 text-center min-w-32",
                  index === arr.length - 1 ? "border-r-1" : "",
                  className
                )}
              >
                {val}
              </HeadText>
            ))}
          </div>
        </FlexBox>
      </div>
    </div>
  );
};

// =================================================================================================

type StudentRowProps = {
  cols: number;
  rollNumber: number;
  studentId: string;
  studentName: string;
  markArray: {
    attributeId: string;
    fullMark: number;
    studentMarkId?: string;
    mark: number;
  }[];
  total: number;
  totalPercents: number | string;
  className?: string;
};

const StudentRow = (props: StudentRowProps) => {
  const {
    rollNumber,
    studentId,
    studentName,
    markArray,
    total,
    totalPercents,
    className,
  } = props;

  return (
    <div className={cn(`flex flex-nowrap`, className)}>
      <FlexBox className="border border-gray-400 border-r-0 border-t-0 justify-center p-2 min-w-20">
        <HeadText className="text-gray-600">{rollNumber}</HeadText>
      </FlexBox>

      <FlexBox className="border border-gray-400 border-r-0 border-t-0 justify-center p-2 min-w-32">
        <HeadText className="text-gray-600">{studentName}</HeadText>
      </FlexBox>

      <FlexBox className="min-w-700 border-r">
        <div className={`w-full flex flex-nowrap`}>
          {markArray.map(({ attributeId, studentMarkId, mark, fullMark }) => (
            <EditInput
              val={mark}
              fullMark={fullMark}
              studentId={studentId}
              attributeId={attributeId}
              studentMarkId={studentMarkId}
              key={"attStd" + attributeId}
            />
          ))}
        </div>
      </FlexBox>

      <FlexBox className="justify-center border border-gray-400 border-t-0 border-r-0 min-w-24">
        <HeadText className="text-gray-600">{total || "-"}</HeadText>
      </FlexBox>

      <FlexBox className="justify-center border border-gray-400 border-t-0 min-w-24">
        <HeadText className="text-gray-600">{totalPercents || "-"}</HeadText>
      </FlexBox>
    </div>
  );
};

type EditInputProps = {
  val: number;
  attributeId: string;
  studentId: string;
  studentMarkId?: string;
  className?: string;
  fullMark: number;
};

const EditInput = (props: EditInputProps) => {
  const { val, studentId, attributeId, className, fullMark, studentMarkId } =
    props;

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

      toast.success("Mark is successfully created");
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

      toast.success("Mark is successfully updated");
    },
    onError() {
      toast.error("Fail to update the mark.");
    },
  });

  useEffect(() => {
    setMark(val + "");
  }, [val]);

  return (
    <div
      className={cn(
        "border border-gray-400 border-r-0 border-t-0 w-32",
        className
      )}
    >
      {isEditing ? (
        <div className="p-1">
          <Input
            autoFocus
            type="number"
            className="w-full h-7 focus-visible:ring-green-500 rounded-none"
            value={mark}
            onChange={(e) => setMark(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              setMark(val + "");
            }}
            min={1}
            onKeyUp={(e) => {
              if (e.key !== "Enter") return;

              if (+mark > fullMark) {
                toast.error("Mark is higher than the full mark");
                return;
              }

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
