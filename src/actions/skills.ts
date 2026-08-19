"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { validateSkill, type ValidationError } from "@/lib/validation";

export interface ActionResult {
  success: boolean;
  errors?: ValidationError[];
  error?: string;
}

export async function createSkill(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await verifyAdmin();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const data = {
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description") || undefined,
  };

  const errors = validateSkill(data);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  const db = getAdminDb();
  const docId = `${data.category}-${(data.name as string).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const existing = await db.collection("skills").doc(docId).get();
  if (existing.exists) {
    return { success: false, errors: [{ field: "name", message: "A skill with this name and category already exists." }] };
  }

  await db.collection("skills").doc(docId).set({
    name: (data.name as string).trim(),
    category: data.category,
    description: data.description || null,
  });

  revalidatePath("/");
  revalidatePath("/skills");

  return { success: true };
}

export async function updateSkill(
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
    name: formData.get("name"),
    category: formData.get("category"),
    description: formData.get("description") || undefined,
  };

  const errors = validateSkill(data);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  const db = getAdminDb();

  await db.collection("skills").doc(id).set({
    name: (data.name as string).trim(),
    category: data.category,
    description: data.description || null,
  }, { merge: true });

  revalidatePath("/");
  revalidatePath("/skills");

  return { success: true };
}

export async function deleteSkill(id: string): Promise<ActionResult> {
  try {
    await verifyAdmin();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const db = getAdminDb();
  await db.collection("skills").doc(id).delete();

  revalidatePath("/");
  revalidatePath("/skills");

  return { success: true };
}
