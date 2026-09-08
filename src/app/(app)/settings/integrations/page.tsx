import { SlidersHorizontal } from "lucide-react";

import { ModulePlaceholder } from "@/components/module-placeholder";

export default function IntegrationsPage() {
  return <ModulePlaceholder eyebrow="Verwalten" title="Integrationen" description="Verbindungen zu Meta und weiteren Diensten an einem sicheren Ort." emptyTitle="Noch keine Integrationen" emptyDescription="Die Meta-Verbindung wird in Milestone 3 ergänzt. Bis dahin werden keine Konten oder Werbedaten abgefragt." icon={SlidersHorizontal} />;
}
