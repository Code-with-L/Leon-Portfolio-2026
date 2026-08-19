"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { validateCertificate, type ValidationError } from "@/lib/validation";

export interface ActionResult {
  success: boolean;
  errors?: ValidationError[];
  error?: string;
}

export async function createCertificate(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await verifyAdmin();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const data = {
    title: formData.get("title"),
    issuer: formData.get("issuer"),
    type: formData.get("type") || "certificate",
    date: formData.get("date") || undefined,
    skills: formData.get("skills")
      ? (formData.get("skills") as string).split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    credentialUrl: formData.get("credentialUrl") || undefined,
  };

  const errors = validateCertificate(data);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  const db = getAdminDb();
  const id = db.collection("certificates").doc().id;

  await db.collection("certificates").doc(id).set({
    id,
    title: (data.title as string).trim(),
    issuer: (data.issuer as string).trim(),
    type: data.type,
    date: data.date || null,
    skills: data.skills,
    credentialUrl: data.credentialUrl || null,
  });

  revalidatePath("/");
  revalidatePath("/certificates");

  return { success: true };
}

export async function updateCertificate(
  id: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await verifyAdmin();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const data = {
    title: formData.get("title"),
    issuer: formData.get("issuer"),
    type: formData.get("type") || "certificate",
    date: formData.get("date") || undefined,
    skills: formData.get("skills")
      ? (formData.get("skills") as string).split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    credentialUrl: formData.get("credentialUrl") || undefined,
  };

  const errors = validateCertificate(data);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  const db = getAdminDb();

  await db.collection("certificates").doc(id).set({
    id,
    title: (data.title as string).trim(),
    issuer: (data.issuer as string).trim(),
    type: data.type,
    date: data.date || null,
    skills: data.skills,
    credentialUrl: data.credentialUrl || null,
  }, { merge: true });

  revalidatePath("/");
  revalidatePath("/certificates");

  return { success: true };
}

export async function deleteCertificate(id: string): Promise<ActionResult> {
  try {
    await verifyAdmin();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const db = getAdminDb();
  await db.collection("certificates").doc(id).delete();

  revalidatePath("/");
  revalidatePath("/certificates");

  return { success: true };
}
