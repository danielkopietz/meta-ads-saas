import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { registerAction } from "./actions";

type RegisterPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;

  return (
    <Card className="border-white/70 shadow-[0_20px_60px_rgba(30,48,86,0.08)]">
      <CardHeader className="space-y-3 px-7 pt-7 sm:px-9 sm:pt-9">
        <div className="mb-3 flex items-center gap-3 text-sm font-semibold lg:hidden">
          <span className="grid size-8 place-items-center rounded-lg bg-[#2855c7] text-white">K</span>
          Kampagnenwerk
        </div>
        <p className="text-sm font-medium text-[#2855c7]">Willkommen</p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">Konto erstellen</h1>
        <p className="text-sm leading-6 text-muted">Starte mit deinem persönlichen Zugang. Die Organisation legst du im nächsten Schritt an.</p>
      </CardHeader>
      <CardContent className="px-7 pb-7 sm:px-9 sm:pb-9">
        {params.error ? <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{params.error}</p> : null}
        <form action={registerAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Vorname
              <Input name="firstName" autoComplete="given-name" required />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Nachname
              <Input name="lastName" autoComplete="family-name" required />
            </label>
          </div>
          <label className="block space-y-2 text-sm font-medium">
            E-Mail-Adresse
            <Input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="block space-y-2 text-sm font-medium">
            Passwort
            <Input name="password" type="password" autoComplete="new-password" minLength={8} required />
            <span className="block text-xs font-normal text-muted">Mindestens 8 Zeichen.</span>
          </label>
          <Button className="mt-2 w-full" size="lg" type="submit">
            Konto erstellen <ArrowRight className="size-4" />
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Bereits registriert? <Link className="font-semibold text-[#2855c7] hover:underline" href="/login">Anmelden</Link>
        </p>
      </CardContent>
    </Card>
  );
}
