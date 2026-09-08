"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  Palette,
  Settings,
  SlidersHorizontal,
  Users,
  Workflow,
} from "lucide-react";

import { cn } from "@/lib/utils";

const primaryNavigation = [
  { label: "Übersicht", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kunden", href: "/clients", icon: BriefcaseBusiness },
  { label: "Kampagnen", href: "/campaigns", icon: Workflow },
  { label: "Creatives", href: "/creatives", icon: Palette },
  { label: "Vorlagen", href: "/templates", icon: BookOpen },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];

const secondaryNavigation = [
  { label: "Integrationen", href: "/settings/integrations", icon: SlidersHorizontal },
  { label: "Team", href: "/settings/team", icon: Users },
  { label: "Einstellungen", href: "/settings", icon: Settings },
];

function NavigationLink({ label, href, icon: Icon }: (typeof primaryNavigation)[number]) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  return (
    <Link className={cn("group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-muted-surface hover:text-foreground", active && "bg-primary-soft text-primary hover:bg-primary-soft hover:text-primary")} href={href}>
      <Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} />
      {label}
    </Link>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-border px-6">
        <span className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-bold text-white">K</span>
        <span className="text-sm font-bold tracking-[-0.01em]">Kampagnenwerk</span>
      </div>
      <nav aria-label="Hauptnavigation" className="flex flex-1 flex-col px-4 py-6">
        <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#98a2b3]">Arbeitsbereich</p>
        <div className="space-y-1">
          {primaryNavigation.map((item) => <NavigationLink key={item.href} {...item} />)}
        </div>
        <div className="mt-auto border-t border-border pt-5">
          <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#98a2b3]">Verwalten</p>
          <div className="space-y-1">
            {secondaryNavigation.map((item) => <NavigationLink key={item.href} {...item} />)}
          </div>
        </div>
      </nav>
      <div className="border-t border-border px-6 py-4 text-xs leading-5 text-muted">
        <div className="flex items-center gap-2 font-medium text-foreground"><FileText className="size-3.5" /> Milestone 1</div>
        <p className="mt-1">Die Kampagnenwerkzeuge werden Schritt für Schritt ergänzt.</p>
      </div>
    </aside>
  );
}
