"use server";

import { randomBytes } from "node:crypto";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/db/client";
import { getCurrentSession } from "@/modules/auth/session";

const onboardingSchema = z.object({
  companyName: z.string().trim().min(2, "Bitte gib den Namen deiner Agentur oder deines Unternehmens ein."),
  firstName: z.string().trim().min(2, "Bitte gib deinen Vornamen ein."),
  lastName: z.string().trim().min(2, "Bitte gib deinen Nachnamen ein."),
  websiteUrl: z.union([z.string().trim().url("Bitte gib eine gültige Website-Adresse ein."), z.literal("")]).optional(),
});

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "organisation";
}

async function uniqueSlug(name: string) {
  const base = slugify(name);
  let slug = base;
  let suffix = 1;

  while (await prisma.organization.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function completeOnboardingAction(formData: FormData) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  if (session.organizationId) {
    redirect("/dashboard");
  }

  const parsed = onboardingSchema.safeParse({
    companyName: formData.get("companyName"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    websiteUrl: formData.get("websiteUrl"),
  });

  if (!parsed.success) {
    redirect("/onboarding?error=Bitte prüfe deine Eingaben.");
  }

  const existingMembership = await prisma.organizationMember.findFirst({
    where: { userId: session.userId, status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
  });

  if (existingMembership) {
    await prisma.session.update({
      where: { id: session.id },
      data: { organizationId: existingMembership.organizationId },
    });
    redirect("/dashboard");
  }

  const organization = await prisma.$transaction(async (transaction) => {
    const createdOrganization = await transaction.organization.create({
      data: {
        name: parsed.data.companyName,
        slug: `${await uniqueSlug(parsed.data.companyName)}-${randomBytes(2).toString("hex")}`,
        websiteUrl: parsed.data.websiteUrl || null,
        createdById: session.userId,
      },
    });

    await transaction.organizationMember.create({
      data: {
        organizationId: createdOrganization.id,
        userId: session.userId,
        role: "OWNER",
        status: "ACTIVE",
        joinedAt: new Date(),
      },
    });

    await transaction.user.update({
      where: { id: session.userId },
      data: {
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
      },
    });

    return createdOrganization;
  });

  await prisma.session.update({
    where: { id: session.id },
    data: { organizationId: organization.id, lastUsedAt: new Date() },
  });

  redirect("/dashboard");
}
