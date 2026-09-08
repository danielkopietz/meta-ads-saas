import { redirect } from "next/navigation";

import { getCurrentSession } from "@/modules/auth/session";
import { postLoginPath } from "@/modules/auth/policies";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  redirect(postLoginPath(Boolean(session.organizationId)));
}
