"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  React.useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => event.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onOpenChange, open]);

  if (!open) return null;

  return (
    <div aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-5" role="dialog">
      {children}
    </div>
  );
}

export function DialogContent({ className, onClose, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }) {
  return (
    <div className={cn("relative w-full max-w-lg rounded-xl border border-border bg-white p-6 shadow-2xl", className)} {...props}>
      {onClose ? <button aria-label="Dialog schließen" className="absolute right-4 top-4 rounded-md p-1.5 text-muted hover:bg-muted-surface" onClick={onClose} type="button"><X className="size-4" /></button> : null}
      {children}
    </div>
  );
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}
