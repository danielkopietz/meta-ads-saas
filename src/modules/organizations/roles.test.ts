import { describe, expect, it } from "vitest";

import {
  AuthorizationError,
  OrganizationRole,
  assertRole,
  canAccessOrganization,
  canManageMembers,
  canManageOrganization,
} from "@/modules/organizations/roles";

describe("organization roles", () => {
  it("allows every active role to access its organization", () => {
    expect(canAccessOrganization(OrganizationRole.OWNER)).toBe(true);
    expect(canAccessOrganization(OrganizationRole.ADMIN)).toBe(true);
    expect(canAccessOrganization(OrganizationRole.MEMBER)).toBe(true);
  });

  it("keeps organization and member management owner-only", () => {
    expect(canManageOrganization(OrganizationRole.OWNER)).toBe(true);
    expect(canManageOrganization(OrganizationRole.ADMIN)).toBe(false);
    expect(canManageMembers(OrganizationRole.MEMBER)).toBe(false);
  });

  it("throws a stable authorization error when a role is insufficient", () => {
    expect(() => assertRole(OrganizationRole.MEMBER, canManageOrganization)).toThrow(AuthorizationError);
  });
});
