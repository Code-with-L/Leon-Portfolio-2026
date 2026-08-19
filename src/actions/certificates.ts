"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { deleteImage } from "@/lib/cloudinary";
import { validateCertificate, type ValidationError } from "@/lib/validation";
import type { MediaImage } from "@/types";

export interface ActionResult {
  success: boolean;
  errors?: ValidationError[];
  error?: string;
}

function parseImageData(formData: FormData): MediaImage | null {
  const url = formData.get("imageUrl") as string | null;
  const publicId = formData.get("imagePublicId") as string | null;
  const alt = formData.get("imageAlt") as string | null;

  if (url && publicId && alt) {
    return { url, publicId, alt: alt.trim() };
  }

  return null;
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

  const imageData = parseImageData(formData);

  const certData: Record<string, unknown> = {
    id,
    title: (data.title as string).trim(),
    issuer: (data.issuer as string).trim(),
    type: data.type,
    date: data.date || null,
    skills: data.skills,
    credentialUrl: data.credentialUrl || null,
  };

  if (imageData) {
    certData.image = imageData;
  }

  await db.collection("certificates").doc(id).set(certData);

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

  // Get existing data for image replacement
  const existingDoc = await db.collection("certificates").doc(id).get();
  const existingData = existingDoc.data() as Record<string, unknown> | undefined;
  const existingImage = existingData?.image as MediaImage | undefined;

  const newImage = parseImageData(formData);
  const keepExisting = formData.get("keepExistingImage") === "true";
  let finalImage: MediaImage | null = null;

  if (newImage) {
    finalImage = newImage;
    if (existingImage && existingImage.publicId !== newImage.publicId) {
      try {
        await deleteImage(existingImage.publicId);
      } catch {
        console.error("Failed to delete old certificate image");
      }
    }
  } else if (keepExisting && existingImage) {
    finalImage = existingImage;
  }

  const certData: Record<string, unknown> = {
    id,
    title: (data.title as string).trim(),
    issuer: (data.issuer as string).trim(),
    type: data.type,
    date: data.date || null,
    skills: data.skills,
    credentialUrl: data.credentialUrl || null,
  };

  if (finalImage) {
    certData.image = finalImage;
  } else {
    certData.image = null;
  }

  await db.collection("certificates").doc(id).set(certData, { merge: true });

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

  // Get certificate to find associated image
  const doc = await db.collection("certificates").doc(id).get();
  if (doc.exists) {
    const data = doc.data();
    const image = data?.image as MediaImage | undefined;
    if (image?.publicId) {
      try {
        await deleteImage(image.publicId);
      } catch {
        console.error("Failed to delete certificate image from Cloudinary");
      }
    }
  }

  await db.collection("certificates").doc(id).delete();

  revalidatePath("/");
  revalidatePath("/certificates");

  return { success: true };
}
