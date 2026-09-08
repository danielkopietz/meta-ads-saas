"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/db/client";
import { hashPassword } from "@/modules/auth/password";
import { createSession } from "@/modules/auth/session";

const registerSchema = z.object({
  firstName: z.string().trim().min(2, "Bitte gib deinen Vornamen ein."),
  lastName: z.string().trim().min(2, "Bitte gib deinen Nachnamen ein."),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen enthalten."),
});

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/register?error=Bitte prüfe deine Eingaben.");
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    redirect("/login?error=Für diese E-Mail-Adresse gibt es bereits ein Konto.");
  }

  const user = await prisma.user.create({
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email,
      passwordHash: await hashPassword(parsed.data.password),
    },
  });

  await createSession(user.id);
  redirect("/onboarding");
}
