import { CustomTooltip } from "@/components/common/custom-tooltip";
import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useGetAttributeWithCoGaMarks } from "./hooks/useFetches";

export const CourseWorkPlanning = () => {
  const { subjectId } = useParams();
  const { attributes } = useGetAttributeWithCoGaMarks({
    subjectId,
    type: "COURSEWORK",
    // select: (data) => data?.data,
  });

  console.log("hello", attributes);

  return (
    <div className="w-full overflow-auto border border-gray-300 rounded-md">
      {/* ------------------ header ---------------- */}
      <div className="grid grid-cols-12">
        <FlexBox className="col-span-2 border-r border-r-gray-300 justify-center">
          <HeadText>Course Works</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
          <HeadText>Co</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
          <HeadText>Full Marks</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
          <HeadText>% Marks</HeadText>
        </FlexBox>

        <FlexBox className="col-span-7 flex-col justify-center">
          <HeadText className="py-2">Mark Distribution for each GA</HeadText>

          <div className="w-full grid grid-cols-12 border-t border-t-gray-300">
            <div className="col-span-4 border-r border-r-gray-300">
              <HeadText className="py-2 text-center">Cognitive</HeadText>

              <div className="w-full grid grid-cols-4 border-t border-gray-300">
                {[1, 2, 3, 4].map((el) => (
                  <FlexBox
                    key={el + "table-cogni"}
                    className={cn(
                      "col-span-1 py-2 justify-center",
                      el !== 4 ? "border-r border-r-gray-300 " : ""
                    )}
                  >
                    <HeadText>{"GA" + el}</HeadText>
                  </FlexBox>
                ))}
              </div>
            </div>

            <div className="col-span-1 overflow-clip border-r border-r-gray-300">
              <CustomTooltip label="Psychomotor">
                <HeadText className="py-2">Psychomotor</HeadText>
              </CustomTooltip>

              <div className="w-full border-t border-gray-300">
                <FlexBox className={cn("py-2 justify-center")}>
                  <HeadText>GA5</HeadText>
                </FlexBox>
              </div>
            </div>

            <div className="col-span-7">
              <HeadText className="py-2 text-center">Affective</HeadText>

              <div className="w-full grid grid-cols-7 border-t border-gray-300">
                {[6, 7, 8, 9, 10, 11, 12].map((el) => (
                  <FlexBox
                    key={el + "table-affective-bo"}
                    className={cn(
                      "col-span-1 py-2 justify-center",
                      el !== 12 ? "border-r border-r-gray-300 " : ""
                    )}
                  >
                    <HeadText>{"GA" + el}</HeadText>
                  </FlexBox>
                ))}
              </div>
            </div>
          </div>
        </FlexBox>
      </div>

      {attributes?.items?.map((attribute) => (
        <CustomRow
          key={attribute?.id}
          name={attribute?.name + " " + attribute?.instance}
          cos={attribute?.co?.map((c) => c.instance).join(", ")}
          marks={attribute?.marks}
          total={`100`}
        />
      ))}

      {/*
      <CustomRow name="Question 1" ga={dummyGa} total={`100`} />
      <CustomRow name="Total Course Works" ga={dummyGa} total={`100`} />
      <CustomRow name="Final Exam" ga={dummyGa} />
      <CustomRow name="Total Marks" ga={dummyGa} /> */}
    </div>
  );
};

type CustomRowType = {
  name: string;
  cos?: string;
  marks: { gaID: string; gaSlug: string; id: string; mark: number }[];
  total?: string;
  percentMark?: string;
};

const CustomRow = (props: CustomRowType) => {
  const { name, cos = "", marks, total = "", percentMark = "" } = props;

  return (
    <div className="grid grid-cols-12 border-t border-t-gray-300">
      <FlexBox className="col-span-2 border-r border-r-gray-300 justify-center">
        <Text className="text-gray-600">{name}</Text>
      </FlexBox>

      <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
        <Text className="">{cos}</Text>
      </FlexBox>

      <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
        <Text className="">{total}</Text>
      </FlexBox>

      <FlexBox className="col-span-1 justify-center border-r border-r-gray-300">
        <Text className="">{percentMark}</Text>
      </FlexBox>

      <FlexBox className="col-span-7 flex-col border-r border-r-gray-300 justify-center">
        <div className="w-full grid grid-cols-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => {
            const mark = marks?.find((m) => +m?.gaSlug?.slice(-1) === el);

            const markIsExist = +(mark?.gaSlug?.slice(-1) ?? 0) === el;

            return (
              <FlexBox
                key={el + "table-cw-lis"}
                className={cn(
                  "col-span-1 py-2 justify-center",
                  el !== 12 ? "border-r border-r-gray-300 " : ""
                )}
              >
                <Text
                  className={cn(markIsExist ? "text-medium" : "text-gray-200")}
                >
                  {markIsExist ? mark?.mark : "-"}
                </Text>
              </FlexBox>
            );
          })}
        </div>
      </FlexBox>
    </div>
  );
};

export const HeadText = (props: {
  className?: string;
  children: ReactNode;
}) => {
  const { children, className } = props;

  return (
    <Text className={cn("font-semibold text-gray-400", className)}>
      {children}
    </Text>
  );
};
