import { BriefcaseBusiness } from "lucide-react";

import { ModulePlaceholder } from "@/components/module-placeholder";

export default function ClientsPage() {
  return <ModulePlaceholder eyebrow="Arbeitsbereich" title="Kunden" description="Verwalte später Marken, Zugänge und wiederverwendbares Wissen pro Kunde." emptyTitle="Noch keine Kunden" emptyDescription="Lege deinen ersten Kunden an, um Kampagnen und Brand Brain an einem Ort zu bündeln." icon={BriefcaseBusiness} actionLabel="Zur Übersicht" />;
}
