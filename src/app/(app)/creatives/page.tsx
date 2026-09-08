import { Palette } from "lucide-react";

import { ModulePlaceholder } from "@/components/module-placeholder";

export default function CreativesPage() {
  return <ModulePlaceholder eyebrow="Arbeitsbereich" title="Creatives" description="Eine gemeinsame Bibliothek für hochgeladene und später generierte Werbemittel." emptyTitle="Noch keine Creatives" emptyDescription="Hier findest du später deine Medien, Varianten und Creative Families." icon={Palette} />;
}
