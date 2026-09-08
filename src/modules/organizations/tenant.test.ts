import { describe, expect, it } from "vitest";

import { scopedOrganizationMemberWhere } from "@/modules/organizations/tenant";

describe("tenant query scopes", () => {
  it("requires both organization and user identity for membership queries", () => {
    expect(scopedOrganizationMemberWhere({ organizationId: "org-a", userId: "user-a" })).toEqual({
      organizationId: "org-a",
      userId: "user-a",
      status: "ACTIVE",
    });
  });

  it("does not allow an organization-only membership lookup", () => {
    const scope = scopedOrganizationMemberWhere({ organizationId: "org-a", userId: "user-a" });
    expect(scope).toHaveProperty("userId", "user-a");
    expect(scope).toHaveProperty("organizationId", "org-a");
  });
});
