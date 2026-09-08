import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "muted" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        variant === "default" && "bg-primary-soft text-primary",
        variant === "success" && "bg-emerald-50 text-success",
        variant === "warning" && "bg-amber-50 text-warning",
        variant === "muted" && "bg-muted-surface text-muted",
        className,
      )}
      {...props}
    />
  );
}
