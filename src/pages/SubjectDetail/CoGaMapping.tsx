import { useGetAllGAs } from "@/common/hooks/useFetches";
import { CustomTooltip } from "@/components/common/custom-tooltip";
import { FlexBox } from "@/components/common/flex-box";
import Icon from "@/components/common/icon";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHover } from "@uidotdev/usehooks";
import axios from "axios";
import { CheckIcon } from "lucide-react";
import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useGetSubjectDetail } from "./hooks/useFetches";

export const CoGaMapping = () => {
  const { subjectId } = useParams();

  const { subject } = useGetSubjectDetail(subjectId);
  const { allGAs } = useGetAllGAs();

  const cos =
    subject?.co?.filter(
      (c) => c.id !== "00000000-0000-0000-0000-000000000000"
    ) ?? [];

  return (
    <section className="overflow-auto pb-2">
      <div className="w-full flex flex-nowrap">
        <div
          className="grid bg-yellow-400"
          style={{ gridTemplateColumns: "repeat(22, 1fr)" }}
        >
          <HeadItem name="No" />
          <HeadItem name="Co Description" className="col-span-9 min-w-56" />
          {allGAs?.map(({ name, slug }) => (
            <HeadItem key={slug + "helsa"} name={slug} tooltipLabel={name} />
          ))}
        </div>

        <FlexBox className="justify-center col-span-1 min-w-28 bg-yellow-400 border border-gray-400">
          Full Mark
        </FlexBox>
      </div>

      {cos.map((co) => (
        <CoRow
          key={co?.id + "what ev"}
          id={co?.id ?? ""}
          name={co?.name ?? ""}
          instance={co?.instance ?? ""}
          ga={co?.ga ?? []}
          fullMark={co?.mark ?? ""}
        />
      ))}
    </section>
  );
};

type CoRowProps = {
  id: string;
  instance: string;
  name: string;
  fullMark: number;
  ga: { slug: string; id: string; name: string }[];
};

const CoRow = (props: CoRowProps) => {
  const { id, instance, name, fullMark, ga } = props;

  const queryClient = useQueryClient();
  const { subjectId } = useParams();
  const [ref, hovering] = useHover();

  const { allGAs } = useGetAllGAs();

  const deleteMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ coId }: any) => axios.delete(`co/${coId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subject-detail-by-id", subjectId],
      });

      toast.success(`Course outlines has been successfully deleted.`);
    },
    onError: (err) => {
      console.log("hello err", err);

      toast.error(
        `Deleting course outlines has been failed. Please try again!`
      );
    },
  });

  return (
    <div className="w-full flex flex-nowrap">
      <div
        ref={ref}
        className="grid"
        style={{ gridTemplateColumns: "repeat(22, 1fr)" }}
      >
        <HeadItem
          name={instance}
          hover={hovering}
          onDelete={() => deleteMutation.mutate({ coId: id })}
        />
        <HeadItem name={name} className="col-span-9 justify-start min-w-56" />

        {allGAs?.map(({ slug }) => (
          <ElItem key={slug + "wwdfaf osp"}>
            {ga?.map((ga) => ga?.slug).includes(slug) ? <CheckIcon /> : "-"}
          </ElItem>
        ))}
      </div>

      <HeadItem
        name={fullMark + ""}
        className="col-span-1 justify-center min-w-28"
      />
    </div>
  );
};

const HeadItem = (props: {
  name: string;
  hover?: boolean;
  className?: string;
  tooltipLabel?: string;
  onDelete?: () => void;
}) => {
  const { name, className, onDelete, hover = false, tooltipLabel } = props;

  const text = <Text className="font-semibold text-gray-700">{name}</Text>;

  return (
    <FlexBox
      className={cn(
        "justify-center min-w-16 col-span-1 p-2 border border-gray-400",
        hover ? "relative" : "",
        className
      )}
    >
      {hover ? (
        <FlexBox
          className="justify-center w-full h-full cursor-pointer bg-gradient-to-r from-red-400 to-red-300 absolute top-0"
          onClick={() => onDelete?.()}
        >
          <Icon name="trash-2" className="text-red-700" />
        </FlexBox>
      ) : null}
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
