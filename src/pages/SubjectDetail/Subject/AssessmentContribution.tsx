import { FlexBox } from "@/components/common/flex-box";
import { Text } from "@/components/common/text";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const AssessmentContribution = () => {
  return (
    <FlexBox className="flex-nowrap">
      <HeadText className="">No</HeadText>

      <HeadText className="w-44">Assessment Items</HeadText>

      <HeadText className="w-28">Full Marks</HeadText>

      <HeadText className="">%</HeadText>

      <HeadText className="w-24">Fraction</HeadText>

      <HeadText className="">Co</HeadText>

      <HeadText className="w-20">Total</HeadText>

      <HeadText className="">Ga</HeadText>

      <HeadText className="w-20 border-r-1">Total</HeadText>
    </FlexBox>
  );
};

const HeadText = (props: { className?: string; children: ReactNode }) => {
  const { children, className } = props;

  return (
    <Text
      className={cn(
        "font-semibold w-16 text-center border py-2 border-gray-400 border-r-0 text-gray-700",
        className
      )}
    >
      {children}
    </Text>
  );
};
