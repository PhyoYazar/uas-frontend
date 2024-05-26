import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const Text = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm font-normal text-gray-700", className)}
      {...props}
    >
      {children}
    </p>
  );
});

Text.displayName = "Text";
