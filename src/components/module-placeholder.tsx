import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

export function ModulePlaceholder({ eyebrow, title, description, emptyTitle, emptyDescription, icon: Icon, actionHref = "/dashboard", actionLabel = "Zur Übersicht" }: { eyebrow?: string; title: string; description: string; emptyTitle: string; emptyDescription: string; icon: LucideIcon; actionHref?: string; actionLabel?: string }) {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <EmptyState icon={Icon} title={emptyTitle} description={emptyDescription} action={<Link className={cn(buttonVariants({ variant: "outline" }))} href={actionHref}><ArrowLeft className="size-4" /> {actionLabel}</Link>} />
      <div className="flex items-center justify-center gap-2 text-xs text-muted"><span>Dieser Bereich wird in einem späteren Milestone ergänzt.</span><ArrowRight className="size-3" /></div>
    </div>
  );
}
