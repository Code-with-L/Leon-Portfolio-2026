"use server";

import { verifyAdmin } from "@/lib/admin-auth";
import { uploadImage, deleteImage, type UploadResult } from "@/lib/cloudinary";
import { validateImageFile } from "@/lib/validation";

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

interface UploadActionResult {
  success: boolean;
  data?: UploadResult;
  error?: string;
}

export async function uploadProjectImage(
  slug: string,
  formData: FormData,
): Promise<UploadActionResult> {
  try {
    await verifyAdmin();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const file = formData.get("image") as File | null;
  if (!file || !(file instanceof File)) {
    return { success: false, error: "No image provided." };
  }

  const validationErrors = validateImageFile(file);
  if (validationErrors.length > 0) {
    return { success: false, error: validationErrors[0].message };
  }

  if (!ALLOWED_MIMES.includes(file.type)) {
    return { success: false, error: "Image must be JPEG, PNG, WebP, or AVIF." };
  }

  if (file.size > MAX_SIZE) {
    return { success: false, error: "Image must be 5 MB or smaller." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const publicId = `projects/${slug}`;
    const result = await uploadImage(buffer, "portfolio", publicId);
    return { success: true, data: result };
  } catch {
    console.error("Cloudinary upload failed");
    return { success: false, error: "Image upload failed. Please try again." };
  }
}

export async function uploadCertificateImage(
  certId: string,
  formData: FormData,
): Promise<UploadActionResult> {
  try {
    await verifyAdmin();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const file = formData.get("image") as File | null;
  if (!file || !(file instanceof File)) {
    return { success: false, error: "No image provided." };
  }

  const validationErrors = validateImageFile(file);
  if (validationErrors.length > 0) {
    return { success: false, error: validationErrors[0].message };
  }

  if (!ALLOWED_MIMES.includes(file.type)) {
    return { success: false, error: "Image must be JPEG, PNG, WebP, or AVIF." };
  }

  if (file.size > MAX_SIZE) {
    return { success: false, error: "Image must be 5 MB or smaller." };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const publicId = `certificates/${certId}`;
    const result = await uploadImage(buffer, "portfolio", publicId);
    return { success: true, data: result };
  } catch {
    console.error("Cloudinary upload failed");
    return { success: false, error: "Image upload failed. Please try again." };
  }
}

export async function removeImage(publicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await verifyAdmin();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  // Validate publicId format to prevent arbitrary deletion
  if (!publicId.startsWith("portfolio/projects/") && !publicId.startsWith("portfolio/certificates/")) {
    return { success: false, error: "Invalid image reference." };
  }

  try {
    await deleteImage(publicId);
    return { success: true };
  } catch {
    console.error("Cloudinary delete failed");
    return { success: false, error: "Failed to remove image. Please try again." };
  }
}
