import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const FlexBox = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-nowrap items-center", className)}
    {...props}
  >
    {children}
  </div>
));

FlexBox.displayName = "FlexBox";
