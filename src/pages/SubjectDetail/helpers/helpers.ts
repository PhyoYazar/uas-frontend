import { get2Decimal } from "@/common/utils/utils";
import { StudentLists } from "../hooks/useFetches";

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

export function analyzeGrading(
  defaultLists: string[],
  fn: (val: TotalGradingResult) => void
) {
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

  fn(results);

  return results;
}

//================================================================================================
