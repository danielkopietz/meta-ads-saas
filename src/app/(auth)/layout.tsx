import type { ReactNode } from "react";

import { ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f6f8fb] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-[#172d67] px-12 py-12 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div>
          <div className="flex items-center gap-3 text-sm font-semibold tracking-[0.02em]">
            <span className="grid size-9 place-items-center rounded-xl bg-white text-[#2855c7]">K</span>
            Kampagnenwerk
          </div>
          <div className="mt-28 max-w-xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-200">Meta Ads für Teams</p>
            <h1 className="mt-5 text-5xl font-semibold leading-[1.08] tracking-[-0.04em]">
              Mehr Zeit für Entscheidungen, weniger Zeit für Routine.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-blue-100">
              Kampagnen planen, prüfen und später direkt aus einem klaren Workflow heraus verwalten.
            </p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-blue-100">
          {[
            "Einheitliche Abläufe für jedes Kundenkonto",
            "Strategie und Qualität vor dem Launch",
            "Für Agenturen im DACH-Markt entwickelt",
          ].map((item) => (
            <div className="flex items-center gap-3" key={item}>
              <CheckCircle2 className="size-4 text-blue-300" />
              {item}
            </div>
          ))}
          <div className="flex items-center gap-2 pt-6 text-xs text-blue-200">
            Ruhig im Design. Klar im nächsten Schritt. <ArrowUpRight className="size-3" />
          </div>
        </div>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
