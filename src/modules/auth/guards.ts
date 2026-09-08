import { redirect } from "next/navigation";

import { getCurrentSession } from "@/modules/auth/session";
import { authRequiredRedirect } from "@/modules/auth/policies";
import { requireOrganizationMember } from "@/modules/organizations/tenant";

export async function requireAuthenticatedUser() {
  const session = await getCurrentSession();

  if (!session) {
    const redirectPath = authRequiredRedirect(false);
    if (redirectPath) redirect(redirectPath);
    throw new Error("Unauthenticated request");
  }

  return session;
}

export async function requireActiveOrganization() {
  const session = await requireAuthenticatedUser();

  if (!session.organizationId) {
    redirect("/onboarding");
    throw new Error("Organization onboarding required");
  }

  const membership = await requireOrganizationMember({
    userId: session.userId,
    organizationId: session.organizationId,
  });

  return { session, membership };
}
