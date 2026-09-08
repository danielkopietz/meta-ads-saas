import { describe, expect, it } from "vitest";

import { authRequiredRedirect, postLoginPath } from "@/modules/auth/policies";

describe("authentication route policy", () => {
  it("redirects unauthenticated users to login", () => {
    expect(authRequiredRedirect(false)).toBe("/login");
  });

  it("allows authenticated users through", () => {
    expect(authRequiredRedirect(true)).toBeNull();
  });

  it("sends users to onboarding until an organization exists", () => {
    expect(postLoginPath(false)).toBe("/onboarding");
    expect(postLoginPath(true)).toBe("/dashboard");
  });
});
