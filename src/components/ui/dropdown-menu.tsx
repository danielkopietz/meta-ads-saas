"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export function DropdownMenu({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <button aria-expanded={open} className="inline-flex" onClick={() => setOpen((value) => !value)} type="button">{trigger}</button>
      {open ? <div className="absolute right-0 top-[calc(100%+8px)] z-30 min-w-48 rounded-lg border border-border bg-white p-1.5 shadow-lg" onClick={() => setOpen(false)}>{children}</div> : null}
    </div>
  );
}

export function DropdownMenuItem({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("flex w-full items-center rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-muted-surface", className)} type="button" {...props} />;
}
