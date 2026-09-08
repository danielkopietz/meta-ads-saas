import { redirect } from "next/navigation";

import { ArrowRight, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCurrentSession } from "@/modules/auth/session";

import { completeOnboardingAction } from "./actions";

type OnboardingPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export const dynamic = "force-dynamic";

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  if (session.organizationId) {
    redirect("/dashboard");
  }

  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 flex items-center gap-3 text-sm font-semibold">
          <span className="grid size-9 place-items-center rounded-xl bg-[#2855c7] text-white">K</span>
          Kampagnenwerk
        </div>
        <div className="mb-8 max-w-xl">
          <p className="mb-3 text-sm font-medium text-[#2855c7]">Schritt 1 von 1</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em]">Richte deinen Arbeitsbereich ein.</h1>
          <p className="mt-4 text-base leading-7 text-muted">Dein Arbeitsbereich bündelt später Kunden, Kampagnen und Reports an einem Ort.</p>
        </div>
        <Card className="border-white/80 shadow-[0_20px_60px_rgba(30,48,86,0.08)]">
          <CardHeader className="flex-row items-center gap-4 border-b border-border px-7 py-6 sm:px-9">
            <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-[#2855c7]"><Building2 className="size-5" /></span>
            <div>
              <h2 className="font-semibold">Über dein Unternehmen</h2>
              <p className="mt-1 text-sm text-muted">Diese Angaben kannst du später jederzeit ändern.</p>
            </div>
          </CardHeader>
          <CardContent className="px-7 py-7 sm:px-9">
            {params.error ? <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{params.error}</p> : null}
            <form action={completeOnboardingAction} className="space-y-5">
              <label className="block space-y-2 text-sm font-medium">
                Agenturname / Unternehmensname
                <Input name="companyName" placeholder="z. B. Nordlicht Performance" required />
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium">
                  Vorname
                  <Input name="firstName" defaultValue={session.user.firstName} autoComplete="given-name" required />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Nachname
                  <Input name="lastName" defaultValue={session.user.lastName} autoComplete="family-name" required />
                </label>
              </div>
              <label className="block space-y-2 text-sm font-medium">
                Website <span className="font-normal text-muted">(optional)</span>
                <Input name="websiteUrl" type="url" placeholder="https://deine-agentur.de" autoComplete="url" />
              </label>
              <div className="flex justify-end border-t border-border pt-6">
                <Button size="lg" type="submit">
                  Arbeitsbereich erstellen <ArrowRight className="size-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
