import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-background px-5"><div className="text-center"><p className="text-sm font-semibold text-primary">404</p><h1 className="mt-2 text-3xl font-semibold">Seite nicht gefunden</h1><p className="mt-3 text-sm text-muted">Diese Seite existiert nicht oder ist noch nicht freigeschaltet.</p><Link className={cn(buttonVariants({ variant: "outline" }), "mt-6")} href="/dashboard"><ArrowLeft className="size-4" /> Zur Übersicht</Link></div></main>;
}
