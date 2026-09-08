"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/db/client";
import { createSession } from "@/modules/auth/session";
import { verifyPassword } from "@/modules/auth/password";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/login?error=Bitte prüfe deine Eingaben.");
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
    include: {
      memberships: {
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  if (!user || user.status !== "ACTIVE" || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    redirect("/login?error=E-Mail oder Passwort ist nicht korrekt.");
  }

  await createSession(user.id, user.memberships[0]?.organizationId);
  redirect(user.memberships[0] ? "/dashboard" : "/onboarding");
}
