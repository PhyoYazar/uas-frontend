import { useGetAllGAs } from "@/common/hooks/useFetches";
import { CustomTooltip } from "@/components/common/custom-tooltip";
import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CheckIcon } from "lucide-react";
import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Subject } from "../Subjects/SubjectTable";

type SubjectDetail = Subject & {
  co: {
    instance: string;
    name: string;
    id: string;
    ga: {
      id: string;
      name: string;
      slug: string;
    }[];
  }[];
};

export const CoGaMapping = () => {
  const { subjectId } = useParams();

  const { data: subjectWithCoGa } = useQuery({
    queryKey: ["subject-detail-by-id", subjectId],
    queryFn: ({ signal }) =>
      axios.get<SubjectDetail>(`subject-detail/${subjectId}`, { signal }),
    staleTime: 5000,
    enabled: subjectId !== undefined,
    select: (data) => data?.data,
  });

  const { allGAs } = useGetAllGAs();

  return (
    <section>
      <div
        className="grid w-full overflow-auto"
        style={{ gridTemplateColumns: "repeat(22, 1fr)" }}
      >
        <HeadItem name="No" />
        <HeadItem name="Co Description" className="col-span-9" />
        {allGAs?.map(({ name, slug }) => (
          <HeadItem name={slug} tooltipLabel={name} />
        ))}
      </div>

      {subjectWithCoGa?.co?.map((co) => (
        <div
          className="grid w-full overflow-auto"
          style={{ gridTemplateColumns: "repeat(22, 1fr)" }}
        >
          <HeadItem name={co?.instance} />
          <HeadItem name={co?.name} className="col-span-9 justify-start" />

          {allGAs?.map(({ slug }) => (
            <ElItem>
              {co?.ga?.map((ga) => ga?.slug).includes(slug) ? (
                <CheckIcon />
              ) : (
                "-"
              )}
            </ElItem>
          ))}
        </div>
      ))}
    </section>
  );
};

const HeadItem = (props: {
  name: string;
  className?: string;
  tooltipLabel?: string;
}) => {
  const { name, className, tooltipLabel } = props;

  const text = <Text className="font-semibold text-gray-500">{name}</Text>;

  return (
    <FlexBox
      className={cn(
        "border justify-center min-w-16 col-span-1 p-2 border-gray-400",
        className
      )}
    >
      {tooltipLabel ? (
        <CustomTooltip label={tooltipLabel}>{text}</CustomTooltip>
      ) : (
        text
      )}
    </FlexBox>
  );
};

const ElItem = (props: { children: ReactNode; className?: string }) => {
  const { children, className } = props;

  return (
    <FlexBox
      className={cn(
        "border justify-center min-w-16 col-span-1 p-2 text-gray-500 border-gray-400",
        className
      )}
    >
      {children}
    </FlexBox>
  );
};
