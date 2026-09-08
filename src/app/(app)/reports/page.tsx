import { BarChart3 } from "lucide-react";

import { ModulePlaceholder } from "@/components/module-placeholder";

export default function ReportsPage() {
  return <ModulePlaceholder eyebrow="Arbeitsbereich" title="Reports" description="Client-fähige Auswertungen auf Basis synchronisierter Kampagnendaten." emptyTitle="Noch keine Reports" emptyDescription="Reports werden verfügbar, sobald echte Kampagnendaten synchronisiert werden." icon={BarChart3} />;
}
