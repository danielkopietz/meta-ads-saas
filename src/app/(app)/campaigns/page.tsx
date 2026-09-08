import { Workflow } from "lucide-react";

import { ModulePlaceholder } from "@/components/module-placeholder";

export default function CampaignsPage() {
  return <ModulePlaceholder eyebrow="Arbeitsbereich" title="Kampagnen" description="Entwürfe, veröffentlichte Kampagnen und ihre nächsten Schritte an einem Ort." emptyTitle="Noch keine Kampagnen" emptyDescription="Starte einen Entwurf, sobald du deine erste Kampagne vorbereiten möchtest." icon={Workflow} actionHref="/campaigns/new" actionLabel="Entwurf starten" />;
}
