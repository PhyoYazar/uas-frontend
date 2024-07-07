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
