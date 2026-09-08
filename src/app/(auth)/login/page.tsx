import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { loginAction } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <Card className="border-white/70 shadow-[0_20px_60px_rgba(30,48,86,0.08)]">
      <CardHeader className="space-y-3 px-7 pt-7 sm:px-9 sm:pt-9">
        <div className="mb-3 flex items-center gap-3 text-sm font-semibold lg:hidden">
          <span className="grid size-8 place-items-center rounded-lg bg-[#2855c7] text-white">K</span>
          Kampagnenwerk
        </div>
        <p className="text-sm font-medium text-[#2855c7]">Schön, dass du da bist</p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">Anmelden</h1>
        <p className="text-sm leading-6 text-muted">Greife auf deine Organisation und deine Kampagnenübersicht zu.</p>
      </CardHeader>
      <CardContent className="px-7 pb-7 sm:px-9 sm:pb-9">
        {params.error ? <p className="mb-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{params.error}</p> : null}
        <form action={loginAction} className="space-y-4">
          <label className="block space-y-2 text-sm font-medium">
            E-Mail-Adresse
            <Input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="block space-y-2 text-sm font-medium">
            Passwort
            <Input name="password" type="password" autoComplete="current-password" required />
          </label>
          <Button className="mt-2 w-full" size="lg" type="submit">
            Anmelden <ArrowRight className="size-4" />
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Noch kein Konto? <Link className="font-semibold text-[#2855c7] hover:underline" href="/register">Jetzt registrieren</Link>
        </p>
      </CardContent>
    </Card>
  );
}
