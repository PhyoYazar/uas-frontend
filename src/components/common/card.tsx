import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-md border border-gray-200 shadow-sm p-4", className)}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = "Card";
