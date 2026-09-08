export function authRequiredRedirect(isAuthenticated: boolean) {
  return isAuthenticated ? null : "/login";
}

export function postLoginPath(hasOrganization: boolean) {
  return hasOrganization ? "/dashboard" : "/onboarding";
}
