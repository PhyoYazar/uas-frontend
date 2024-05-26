import { CustomTooltip } from "@/components/common/custom-tooltip";
import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";

export const CoGaMapping = () => {
  return (
    <section
      className="grid w-full overflow-auto"
      style={{ gridTemplateColumns: "repeat(20, 1fr)" }}
    >
      <HeadItem name="No" />
      <HeadItem name="Co Description" className="col-span-7" />
      {gaLists.map(({ name, label }) => (
        <HeadItem name={name} tooltipLabel={label} />
      ))}
    </section>
  );
};

const gaLists = [
  { name: "GA1", label: "Engineering Knowledge" },
  { name: "GA2", label: "Problem Analysis" },
  { name: "GA3", label: "Design/ Development of Solutions" },
  { name: "GA4", label: "Investigation" },
  { name: "GA5", label: "Modern Tool Usage" },
  { name: "GA6", label: "The Engineer and Society" },
  { name: "GA7", label: "Environment and Sustainability" },
  { name: "GA8", label: "Ethics" },
  { name: "GA9", label: "Individual and Team Work" },
  { name: "GA10", label: "Communication" },
  { name: "GA11", label: "Life-long Learning" },
  { name: "GA12", label: "Project Management and Finance" },
];

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
        "border justify-center min-w-16 col-span-1 py-2 border-gray-400",
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
