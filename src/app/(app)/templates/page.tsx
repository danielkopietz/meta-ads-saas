import { BookOpen } from "lucide-react";

import { ModulePlaceholder } from "@/components/module-placeholder";

export default function TemplatesPage() {
  return <ModulePlaceholder eyebrow="Arbeitsbereich" title="Vorlagen" description="Bewährte Kampagnen- und Landingpage-Strukturen für dein Team." emptyTitle="Noch keine Vorlagen" emptyDescription="Blueprints und Landingpage-Templates werden später hier verfügbar sein." icon={BookOpen} />;
}
