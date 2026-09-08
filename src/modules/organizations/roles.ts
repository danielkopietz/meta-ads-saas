import { OrganizationRole } from "@prisma/client";

export { OrganizationRole };

export class AuthorizationError extends Error {
  constructor(message = "Du hast keine Berechtigung für diese Aktion.") {
    super(message);
    this.name = "AuthorizationError";
  }
}

export function canAccessOrganization(role: OrganizationRole) {
  return [OrganizationRole.OWNER, OrganizationRole.ADMIN, OrganizationRole.MEMBER].includes(role);
}

export function canManageOrganization(role: OrganizationRole) {
  return role === OrganizationRole.OWNER;
}

export function canManageMembers(role: OrganizationRole) {
  return role === OrganizationRole.OWNER;
}

export function assertRole(
  role: OrganizationRole,
  predicate: (role: OrganizationRole) => boolean,
) {
  if (!predicate(role)) {
    throw new AuthorizationError();
  }
}
