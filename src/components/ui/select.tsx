import * as React from "react";

import { cn } from "@/lib/utils";

export const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, ...props }, ref) => (
    <select
      className={cn(
        "flex h-11 w-full appearance-none rounded-lg border border-border bg-white px-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Select.displayName = "Select";
