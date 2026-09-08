import { Settings } from "lucide-react";

import { ModulePlaceholder } from "@/components/module-placeholder";

export default function SettingsPage() {
  return <ModulePlaceholder eyebrow="Verwalten" title="Einstellungen" description="Organisation, Sprache und weitere Arbeitsbereich-Einstellungen." emptyTitle="Einstellungen folgen" emptyDescription="Die Grundlagen sind vorbereitet. Detaillierte Organisations-Einstellungen werden im weiteren Aufbau ergänzt." icon={Settings} />;
}
