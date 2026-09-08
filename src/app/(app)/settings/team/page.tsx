import { Users } from "lucide-react";

import { ModulePlaceholder } from "@/components/module-placeholder";

export default function TeamPage() {
  return <ModulePlaceholder eyebrow="Verwalten" title="Team" description="Mitglieder und Rollen für deinen Arbeitsbereich." emptyTitle="Teamverwaltung folgt" emptyDescription="Die Rollen OWNER, ADMIN und MEMBER sind im Fundament definiert. Einladungen und Verwaltung folgen in einem späteren Ausbau." icon={Users} />;
}
