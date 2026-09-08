import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { prisma } from "@/db/client";
import { requireActiveOrganization } from "@/modules/auth/guards";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { session } = await requireActiveOrganization();
  if (!session.organizationId) {
    redirect("/onboarding");
    throw new Error("Organization onboarding required");
  }
  const organization = await prisma.organization.findFirst({
    where: {
      id: session.organizationId,
      members: {
        some: { userId: session.userId, status: "ACTIVE" },
      },
    },
    select: { name: true },
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <TopNav firstName={session.user.firstName} organizationName={organization?.name ?? "Arbeitsbereich"} />
        <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10">{children}</main>
      </div>
    </div>
  );
}
