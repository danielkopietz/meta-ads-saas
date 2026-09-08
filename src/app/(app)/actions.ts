"use server";

import { redirect } from "next/navigation";

import { destroyCurrentSession } from "@/modules/auth/session";

export async function logoutAction() {
  await destroyCurrentSession();
  redirect("/login");
}
