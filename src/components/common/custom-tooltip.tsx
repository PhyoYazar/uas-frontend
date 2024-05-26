import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Text } from "./text";

type CustomTooltipProps = {
  label: string | React.ReactNode;
  children: React.ReactNode;
  hideTooltip?: boolean;
  delayDuration?: number;
  tooltipContentClassName?: string;
  tooltipTriggerClassName?: string;
  disableHoverableContent?: boolean;
};

export const CustomTooltip = (props: CustomTooltipProps) => {
  const {
    label,
    children,
    hideTooltip = false,
    delayDuration = 200,
    tooltipContentClassName = "",
    disableHoverableContent = false,
    tooltipTriggerClassName = "",
  } = props;

  if (hideTooltip) {
    return children;
  }

  return (
    <TooltipProvider>
      <Tooltip
        delayDuration={delayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        <TooltipTrigger className={tooltipTriggerClassName}>
          {children}
        </TooltipTrigger>
        <TooltipContent className={cn(tooltipContentClassName)}>
          {typeof label === "string" ? (
            <Text className="text-sm font-medium text-white">{label}</Text>
          ) : (
            label
          )}
          <TooltipArrow />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
