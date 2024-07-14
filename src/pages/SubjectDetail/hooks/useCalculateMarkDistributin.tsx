import { useCallback, useMemo } from "react";
import { AttributeType } from "../helpers/helpers";
import {
  useAttributesWithCoGaFullMarks,
  useGetSubjectById,
} from "./useFetches";

export const useCalculateMarkDistribution = (subjectId?: string) => {
  const { data } = useAttributesWithCoGaFullMarks(subjectId);
  const { subject } = useGetSubjectById(subjectId, (data) => data?.data);

  const examPercent = subject?.exam ?? 0;
  const tutorialPercent = subject?.tutorial ?? 0;
  const labPercent = subject?.lab ?? 0;
  const assignmentPercent = subject?.assignment ?? 0;
  const practicalPercent = subject?.practical ?? 0;

  const getPercent = useCallback(
    (typ?: AttributeType) => {
      if (typ === "Question") return examPercent;
      if (typ === "Tutorial") return tutorialPercent;
      if (typ === "Practical") return practicalPercent;
      if (typ === "Lab") return labPercent;
      if (typ === "Assignment") return assignmentPercent;

      return 0;
    },
    [
      assignmentPercent,
      examPercent,
      labPercent,
      practicalPercent,
      tutorialPercent,
    ]
  );

  const { coResults, gaResults } = useMemo(() => {
    const coResults: { id: string; instance: number; result: number }[] = [];
    const gaResults: { id: string; slug: string; result: number }[] = [];

    data?.forEach((attribute) => {
      const percent =
        attribute.full_mark *
        (getPercent(attribute?.name as AttributeType) / 100);

      const fraction = percent / 100;

      attribute.co.forEach((c) => {
        const index = coResults.findIndex((r) => r.id === c.id);
        if (index > -1) {
          coResults[index].result += c.coMark * fraction;
        } else {
          coResults.push({
            id: c.id,
            instance: +c.instance,
            result: c.coMark * fraction,
          });
        }
      });

      attribute.ga.forEach((g) => {
        const index = gaResults.findIndex((r) => r.id === g.id);
        if (index > -1) {
          gaResults[index].result += g.gaMark * fraction;
        } else {
          gaResults.push({
            id: g.id,
            slug: g.slug,
            result: g.gaMark * fraction,
          });
        }
      });
    });

    return { coResults, gaResults };
  }, [data, getPercent]);

  return { coResults, gaResults, getPercent };
};
