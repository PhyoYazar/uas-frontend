import { get2Decimal, transformGrade } from "@/common/utils/utils";
import { StudentCoGrade, StudentLists } from "../hooks/useFetches";

export type AttributeType =
  | "Question"
  | "Tutorial"
  | "Assignment"
  | "Lab"
  | "Practical"
  | "Total";

export const calculateAttributeFinalResult = (
  type: AttributeType,
  percent: number,
  std: StudentLists
) => {
  const result =
    std.attributes
      .filter((att) => att.name === type)
      .reduce((acc, cur) => acc + cur.mark, 0) *
    (percent / 100);

  return get2Decimal(result);
};

//================================================================================================

type TotalGradingResult = {
  grade: string;
  marks: string;
  list: {
    id: string;
    count: number;
  }[];
}[];

export function analyzeGrading(data: StudentCoGrade[], defaultLists: string[]) {
  let results: TotalGradingResult = [
    {
      grade: "A+",
      list: [],
      marks: "75",
    },
    {
      grade: "A",
      list: [],
      marks: "70",
    },
    {
      grade: "A-",
      list: [],
      marks: "65",
    },
    {
      grade: "B+",
      list: [],
      marks: "60",
    },
    {
      grade: "B",
      list: [],
      marks: "55",
    },
    {
      grade: "B-",
      list: [],
      marks: "50",
    },
    {
      grade: "C+",
      list: [],
      marks: "45",
    },
    {
      grade: "C",
      list: [],
      marks: "42",
    },
    {
      grade: "C-",
      list: [],
      marks: "40",
    },
    {
      grade: "D",
      list: [],
      marks: "<40",
    },
  ];

  results = results.map((r) => ({
    ...r,
    list: r.list.concat(defaultLists.map((val) => ({ id: val, count: 0 }))),
  }));

  data.forEach((std) => {
    std.co.forEach((co) => {
      const grade = transformGrade(
        get2Decimal((co?.totalMarks / co?.totalFullMarks) * 100)
      );

      const index = results.findIndex((r) => r.grade === grade);
      if (index > -1) {
        const coIndex = results[index].list.findIndex((c) => c.id === co.coId);

        // co is exist in results
        if (coIndex > -1) {
          results[index].list[coIndex].count += 1;
          return;
        }

        results[index].list.push({
          id: co.coId,
          count: 1,
        });
      }
    });
  });

  return results;
}

//================================================================================================
