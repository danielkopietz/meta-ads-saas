import Link from "next/link";
import { ArrowLeft, Sparkles, Workflow } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";

export default function NewCampaignPage() {
  return (
    <div className="space-y-8">
      <Link className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground" href="/campaigns"><ArrowLeft className="size-4" /> Kampagnen</Link>
      <PageHeader eyebrow="Neue Kampagne" title="Wie möchtest du starten?" description="Die Kampagnenmodi werden nach dem Fundament schrittweise freigeschaltet." />
      <Card>
        <CardContent className="p-6 sm:p-10">
          <EmptyState icon={Sparkles} title="Kampagnenerstellung folgt" description="Schnell, geführt und erweitert sind bereits als Produktpfade vorgesehen. Die eigentliche Erstellung wird in einem späteren Milestone implementiert." action={<div className="flex items-center gap-2 text-sm font-medium text-muted"><Workflow className="size-4" /> Noch keine Daten werden gespeichert</div>} />
        </CardContent>
      </Card>
    </div>
  );
}
