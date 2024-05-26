import { gaLists } from "@/common/constants/helpers";
import { CustomTooltip } from "@/components/common/custom-tooltip";
import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";

export const CoGaMapping = () => {
  return (
    <section
      className="grid w-full overflow-auto"
      style={{ gridTemplateColumns: "repeat(22, 1fr)" }}
    >
      <HeadItem name="No" />
      <HeadItem name="Co Description" className="col-span-9" />
      {gaLists.map(({ name, label }) => (
        <HeadItem name={name} tooltipLabel={label} />
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
