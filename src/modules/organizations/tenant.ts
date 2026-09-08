import { MembershipStatus, Prisma, type OrganizationMember } from "@prisma/client";

import { prisma } from "@/db/client";
import { AuthorizationError, type OrganizationRole } from "@/modules/organizations/roles";

export type OrganizationScope = {
  userId: string;
  organizationId: string;
};

export type AuthorizedOrganization = OrganizationMember & {
  role: OrganizationRole;
};

export function organizationScope(organizationId: string): Prisma.OrganizationWhereInput {
  return { id: organizationId };
}

export function scopedOrganizationMemberWhere(
  scope: OrganizationScope,
): Prisma.OrganizationMemberWhereInput {
  return {
    organizationId: scope.organizationId,
    userId: scope.userId,
    status: MembershipStatus.ACTIVE,
  };
}

export async function requireOrganizationMember(
  scope: OrganizationScope,
): Promise<AuthorizedOrganization> {
  const membership = await prisma.organizationMember.findFirst({
    where: scopedOrganizationMemberWhere(scope),
  });

  if (!membership) {
    throw new AuthorizationError("Diese Organisation ist für dich nicht verfügbar.");
  }

  return membership;
}

export async function requireOrganizationOwner(scope: OrganizationScope) {
  const membership = await requireOrganizationMember(scope);

  if (membership.role !== "OWNER") {
    throw new AuthorizationError("Nur der Organisationsinhaber kann diese Einstellung ändern.");
  }

  return membership;
}
