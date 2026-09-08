import Link from "next/link";

import { Bell, ChevronDown, Menu, Plus } from "lucide-react";

import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/(app)/actions";

const mobileLinks = [
  ["Übersicht", "/dashboard"],
  ["Kunden", "/clients"],
  ["Kampagnen", "/campaigns"],
  ["Creatives", "/creatives"],
  ["Vorlagen", "/templates"],
  ["Reports", "/reports"],
] as const;

export function TopNav({ firstName, organizationName }: { firstName: string; organizationName: string }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-white px-5 sm:px-8">
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <DropdownMenu trigger={<span className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-muted"><Menu className="size-5" /></span>}>
            {mobileLinks.map(([label, href]) => <Link className="block rounded-md px-3 py-2 text-sm hover:bg-muted-surface" href={href} key={href}>{label}</Link>)}
            <div className="my-1 border-t border-border" />
            <Link className="block rounded-md px-3 py-2 text-sm hover:bg-muted-surface" href="/settings">Einstellungen</Link>
          </DropdownMenu>
        </div>
        <div className="hidden text-sm text-muted sm:block">{organizationName}</div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Link className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-strong sm:px-4" href="/campaigns/new">
          <Plus className="size-4" /><span className="hidden sm:inline">Kampagne erstellen</span><span className="sm:hidden">Kampagne</span>
        </Link>
        <button aria-label="Benachrichtigungen" className="hidden size-10 items-center justify-center rounded-lg text-muted hover:bg-muted-surface sm:inline-flex" type="button"><Bell className="size-[18px]" /></button>
        <DropdownMenu trigger={<span className="inline-flex items-center gap-2 rounded-lg p-1.5 text-left hover:bg-muted-surface"><span className="grid size-8 place-items-center rounded-full bg-[#dbe5ff] text-xs font-bold text-primary">{firstName.slice(0, 1).toUpperCase()}</span><span className="hidden text-sm font-medium md:inline">{firstName}</span><ChevronDown className="hidden size-4 text-muted md:block" /></span>}>
          <Link className="block rounded-md px-3 py-2 text-sm hover:bg-muted-surface" href="/settings">Einstellungen</Link>
          <form action={logoutAction}><button className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50" type="submit">Abmelden</button></form>
        </DropdownMenu>
      </div>
    </header>
  );
}
