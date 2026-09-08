import Link from "next/link";
import { ArrowRight, BarChart3, CircleCheck, Clock3, FilePlus2, Plus, Sparkles, Users } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

const metricCards = [
  { label: "Werbeausgaben", value: "—", detail: "Noch keine Daten verbunden", icon: BarChart3 },
  { label: "Leads / Ergebnisse", value: "—", detail: "Wird mit Reports verfügbar", icon: Users },
  { label: "Ø CPL / CPA", value: "—", detail: "Keine Kampagnen vorhanden", icon: CircleCheck },
  { label: "Aktive Kampagnen", value: "0", detail: "Bereit für deinen ersten Entwurf", icon: Clock3 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-9">
      <PageHeader
        eyebrow="Übersicht"
        title="Guten Morgen."
        description="Hier siehst du später die wichtigsten Entwicklungen deiner Organisation auf einen Blick."
        action={<Link className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")} href="/campaigns/new"><Plus className="size-4" /> Kampagne erstellen</Link>}
      />

      <section aria-label="Kennzahlen" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map(({ label, value, detail, icon: Icon }) => (
          <Card className="shadow-[0_8px_24px_rgba(30,48,86,0.03)]" key={label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-muted">{label}</p>
                <Icon className="size-[18px] text-[#9aa7bc]" />
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-[#23345b]">{value}</p>
              <p className="mt-2 text-xs text-muted">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between border-b border-border pb-5">
            <div>
              <h2 className="font-semibold">Performance im Überblick</h2>
              <p className="mt-1 text-sm text-muted">Deine Entwicklung wird hier sichtbar, sobald Daten vorliegen.</p>
            </div>
            <span className="rounded-md bg-muted-surface px-2.5 py-1 text-xs font-medium text-muted">Keine Daten</span>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-border bg-[#fbfcfe]">
              <div className="max-w-xs text-center">
                <BarChart3 className="mx-auto size-6 text-[#9aa7bc]" />
                <p className="mt-3 text-sm font-medium">Noch keine Performance-Daten</p>
                <p className="mt-1 text-xs leading-5 text-muted">Verbinde später ein Werbekonto und starte deine erste Kampagne, um Entwicklungen zu sehen.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border pb-5">
            <div className="flex items-center gap-2"><Sparkles className="size-4 text-primary" /><h2 className="font-semibold">Nächste Schritte</h2></div>
            <p className="mt-1 text-sm text-muted">Baue deinen Arbeitsbereich in wenigen Schritten auf.</p>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-2">
              {[
                ["Ersten Kunden anlegen", "/clients"],
                ["Meta später verbinden", "/settings/integrations"],
                ["Kampagnenentwurf starten", "/campaigns/new"],
              ].map(([label, href], index) => (
                <Link className="flex items-center gap-3 rounded-lg px-2.5 py-3 transition-colors hover:bg-muted-surface" href={href} key={href}>
                  <span className="grid size-7 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">{index + 1}</span>
                  <span className="flex-1 text-sm font-medium">{label}</span>
                  <ArrowRight className="size-4 text-muted" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between border-b border-border pb-5">
          <div><h2 className="font-semibold">Letzte Kampagnen</h2><p className="mt-1 text-sm text-muted">Entwürfe und veröffentlichte Kampagnen erscheinen hier.</p></div>
          <Link className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex" href="/campaigns">Alle anzeigen <ArrowRight className="size-4" /></Link>
        </CardHeader>
        <CardContent className="p-5"><EmptyState icon={FilePlus2} title="Noch keine Kampagnen" description="Erstelle deinen ersten Entwurf, sobald du bereit bist. Die eigentliche Kampagnenerstellung wird in einem späteren Schritt ergänzt." action={<Link className={cn(buttonVariants({ variant: "outline" }))} href="/campaigns/new">Entwurf starten</Link>} /></CardContent>
      </Card>
    </div>
  );
}
