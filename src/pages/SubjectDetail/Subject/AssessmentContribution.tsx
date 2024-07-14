import { getUniqueObjects } from "@/common/utils/utils";
import { Text } from "@/components/common/text";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { AttributeType } from "../helpers/helpers";
import { useCalculateMarkDistribution } from "../hooks/useCalculateMarkDistributin";
import {
  useAttributesWithCoGaFullMarks,
  useGetSubjectDetail,
} from "../hooks/useFetches";

export const AssessmentContribution = () => {
  const { subjectId } = useParams();

  const { cos } = useGetSubjectDetail(subjectId);
  const coLists = [...cos].sort((a, b) => +a.instance - +b.instance);

  const gaLists = getUniqueObjects(cos.map((c) => c.ga).flat(1)).sort(
    (a, b) => +a.slug.slice(2) - +b.slug.slice(2)
  );

  const { data } = useAttributesWithCoGaFullMarks(subjectId);

  const { coResults, gaResults, getPercent } =
    useCalculateMarkDistribution(subjectId);

  return (
    <div className="overflow-auto pb-4">
      <div className="flex flex-nowrap">
        {/* <HeadText className="">No</HeadText> */}

        <HeadText className="border-t-1 w-48">Assessment Items</HeadText>

        <HeadText className="border-t-1 w-28">Full Marks</HeadText>

        <HeadText className="border-t-1 ">%</HeadText>

        <HeadText className="border-t-1 w-32">Fraction</HeadText>

        {coLists?.map((co) => (
          <HeadText key={co.id + "32lsdf"} className="border-t-1 ">
            Co {co.instance}
          </HeadText>
        ))}

        <HeadText className="border-t-1 w-32">Total</HeadText>

        {gaLists?.map((ga) => (
          <HeadText key={ga.id + "adhsfw"} className="border-t-1 ">
            {ga.slug}
          </HeadText>
        ))}

        <HeadText className="border-t-1 w-32 border-r-1">Total</HeadText>
      </div>

      {data?.map((attribute) => {
        const percent =
          attribute.full_mark *
          (getPercent(attribute?.name as AttributeType) / 100);

        return (
          <div className="flex flex-nowrap" key={attribute.id + "att-s"}>
            {/* <HeadText className="">No</HeadText> */}

            <HeadText className="w-48">
              {attribute.name} {attribute.instance}
            </HeadText>

            <HeadText className="w-28">{attribute.full_mark}</HeadText>

            <HeadText className="">{percent}</HeadText>

            <HeadText className="w-32">{percent / 100}</HeadText>

            {coLists?.map((co) => {
              const coVal = attribute?.co?.find((c) => c.id === co.id);

              if (!coVal)
                return (
                  <HeadText key={co.id + "adf;l"} className="">
                    -
                  </HeadText>
                );

              return (
                <EditInput
                  key={co.id + "co-klst"}
                  type="co"
                  updateAPIId={coVal.co_attribute_id}
                  val={coVal.coMark}
                />
              );
            })}

            <HeadText className="w-32">Total</HeadText>

            {gaLists?.map((ga) => {
              const gaVal = attribute?.ga?.find((g) => g.id === ga.id);

              if (!gaVal)
                return (
                  <HeadText key={ga.id + "123kas2"} className="">
                    -
                  </HeadText>
                );

              return (
                <EditInput
                  key={ga.id + "galists"}
                  type="ga"
                  updateAPIId={gaVal.mark_id}
                  val={gaVal.gaMark}
                />
              );
            })}

            <HeadText className="w-32 border-r-1">Total</HeadText>
          </div>
        );
      })}

      <div className="flex flex-nowrap">
        {/* <HeadText className="">No</HeadText> */}

        <HeadText className=" w-[304px]">Total</HeadText>

        <HeadText className=" ">100</HeadText>

        <HeadText className="border-y-0 w-32">{""}</HeadText>

        {coLists?.map((co) => {
          const coVal = coResults.find((c) => c.id === co.id);

          return (
            <HeadText key={co.id + "32lsdf"} className="">
              {coVal?.result}
            </HeadText>
          );
        })}

        <HeadText className=" w-32">100</HeadText>

        {gaLists?.map((ga) => {
          const gaVal = gaResults.find((g) => g.id === ga.id);

          return (
            <HeadText key={ga.id + "adhsfw"} className=" ">
              {gaVal?.result}
            </HeadText>
          );
        })}

        <HeadText className=" w-32 border-r-1">100</HeadText>
      </div>
    </div>
  );
};

const HeadText = (props: {
  className?: string;
  onDoubleClick?: () => void;
  children: ReactNode;
}) => {
  const { children, onDoubleClick, className } = props;

  return (
    <Text
      onDoubleClick={onDoubleClick}
      className={cn(
        "font-semibold w-20 flex-shrink-0 text-center border py-2 border-gray-400 border-r-0 border-t-0 text-gray-700",
        className
      )}
    >
      {children}
    </Text>
  );
};

type EditInputProps = {
  val: number;
  updateAPIId?: string;
  className?: string;
  type: "co" | "ga";
};

const EditInput = (props: EditInputProps) => {
  const { val, className, updateAPIId, type } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [mark, setMark] = useState("");

  const { subjectId } = useParams();
  const queryClient = useQueryClient();

  const updateCoMarkMutation = useMutation({
    mutationFn: (newMark: { coMark: number }) =>
      axios.put(`co_attribute/${updateAPIId}`, newMark),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attributes-detail-with-co-ga", subjectId],
      });

      toast.success("Mark is successfully updated");
    },
    onError() {
      toast.error("Fail to update the mark.");
    },
  });

  const updateGaMarkMutation = useMutation({
    mutationFn: (newMark: { gaMark: number }) =>
      axios.put(`mark/${updateAPIId}`, newMark),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attributes-detail-with-co-ga", subjectId],
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
    <div className={cn("w-32", className)}>
      {isEditing ? (
        <div className="p-1">
          <Input
            autoFocus
            type="number"
            className="w-[72px] h-7 focus-visible:ring-green-500 rounded-none"
            value={mark}
            onChange={(e) => setMark(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              setMark(val + "");
            }}
            min={1}
            onKeyUp={(e) => {
              if (e.key !== "Enter") return;

              if (+mark > 100) {
                toast.error("Mark is higher than the 100 mark");
                return;
              }

              if (type === "ga") {
                updateGaMarkMutation.mutate({
                  gaMark: +mark,
                });
              }

              if (type === "co") {
                updateCoMarkMutation.mutate({
                  coMark: +mark,
                });
              }

              setIsEditing(false);
            }}
          />
        </div>
      ) : (
        <HeadText
          onDoubleClick={() => setIsEditing(true)}
          className="bg-gray-100"
        >
          {mark}
        </HeadText>
      )}
    </div>
  );
};
