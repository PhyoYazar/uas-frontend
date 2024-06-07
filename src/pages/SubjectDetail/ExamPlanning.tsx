import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { HeadText } from "./CourseWorkPlanning";
import { useGetAttributeWithCoGaMarks } from "./hooks/useFetches";

export const ExamPlanning = () => {
  const { subjectId } = useParams();
  const { attributes } = useGetAttributeWithCoGaMarks({
    subjectId,
    type: "EXAM",
    // select: (data) => data?.data,
  });

  console.log("hello attributes => ", attributes);

  return (
    <div className="w-full overflow-auto border border-gray-300 rounded-md">
      {/* ------------------ header ---------------- */}
      <div className="grid grid-cols-12">
        <FlexBox className="col-span-2 border-r border-r-gray-300 justify-center">
          <HeadText>Question No</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
          <HeadText>Co</HeadText>
        </FlexBox>

        <FlexBox className="col-span-7 flex-col border-r border-r-gray-300 justify-center">
          <HeadText className="py-2">Graduate Attributes</HeadText>
          <div className="w-full grid grid-cols-12 border-t border-gray-300">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => (
              <FlexBox
                key={el + "table-ma"}
                className={cn(
                  "col-span-1 py-2 justify-center",
                  el !== 12 ? "border-r border-r-gray-300 " : ""
                )}
              >
                <HeadText>{"GA" + el}</HeadText>
              </FlexBox>
            ))}
          </div>
        </FlexBox>

        <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
          <HeadText>% Total</HeadText>
        </FlexBox>

        <FlexBox className="col-span-1 justify-center">
          <HeadText>Time, min</HeadText>
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

      {/* <CustomRow name="Question 1" ga={dummyGa} total={`100`} />
      <CustomRow name="Total Marks Upon 100%" ga={dummyGa} total={`100`} />
      <CustomRow name={`Total Marks Upon ` + "80%"} ga={dummyGa} total={`80`} /> */}
    </div>
  );
};

type CustomRowType = {
  name: string;
  cos?: string;
  marks: { gaID: string; gaSlug: string; id: string; mark: number }[];
  total?: string;
  time?: string;
};

const CustomRow = (props: CustomRowType) => {
  const { name, cos = "", marks, total = "", time = "" } = props;

  return (
    <div className="grid grid-cols-12 border-t border-t-gray-300">
      <FlexBox className="col-span-2 border-r border-r-gray-300 justify-center">
        <Text className="">{name}</Text>
      </FlexBox>

      <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
        <Text className="">{cos}</Text>
      </FlexBox>

      <FlexBox className="col-span-7 flex-col border-r border-r-gray-300 justify-center">
        <div className="w-full grid grid-cols-12">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => {
            const mark = marks?.find((m) => +m?.gaSlug?.slice(-1) === el);

            const markIsExist = +(mark?.gaSlug?.slice(-1) ?? 0) === el;

            return (
              <FlexBox
                key={el + "table-body"}
                className={cn(
                  "col-span-1 py-2 justify-center",
                  el !== 12 ? "border-r border-r-gray-300 " : ""
                )}
              >
                <Text
                  className={cn(markIsExist ? "text-medium" : "text-gray-300")}
                >
                  {markIsExist ? mark?.mark : "-"}
                </Text>
              </FlexBox>
            );
          })}
        </div>
      </FlexBox>

      <FlexBox className="col-span-1 border-r border-r-gray-300 justify-center">
        <Text className="">{total}</Text>
      </FlexBox>

      <FlexBox className="col-span-1 justify-center">
        <Text className="">{time}</Text>
      </FlexBox>
    </div>
  );
};
