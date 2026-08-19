"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { deleteImage } from "@/lib/cloudinary";
import { validateProject, type ValidationError } from "@/lib/validation";
import type { Project, MediaImage } from "@/types";

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

export async function createProject(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await verifyAdmin();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const data = {
    slug: formData.get("slug"),
    title: formData.get("title"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description") || "",
    category: formData.get("category"),
    technologies: formData.get("technologies")
      ? (formData.get("technologies") as string).split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    featured: formData.get("featured") === "on",
    status: formData.get("status") || "completed",
    year: formData.get("year") ? Number(formData.get("year")) : undefined,
    githubUrl: formData.get("githubUrl") || undefined,
    liveUrl: formData.get("liveUrl") || undefined,
  };

  const errors = validateProject(data);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  const db = getAdminDb();
  const slug = (data.slug as string).trim();

  const existing = await db.collection("projects").doc(slug).get();
  if (existing.exists) {
    return { success: false, errors: [{ field: "slug", message: "A project with this slug already exists." }] };
  }

  const imageData = parseImageData(formData);

  const project: Omit<Project, "sections"> & { sections?: Project["sections"] } = {
    slug,
    title: (data.title as string).trim(),
    shortDescription: (data.shortDescription as string).trim(),
    description: (data.description as string).trim(),
    category: (data.category as string).trim(),
    technologies: data.technologies as string[],
    featured: data.featured as boolean,
    status: data.status as Project["status"],
    year: data.year as number | undefined,
    githubUrl: data.githubUrl as string | undefined,
    liveUrl: data.liveUrl as string | undefined,
  };

  if (imageData) {
    project.image = imageData;
  }

  await db.collection("projects").doc(slug).set(project);

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);

  return { success: true };
}

export async function updateProject(
  slug: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  try {
    await verifyAdmin();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const data = {
    slug: formData.get("slug"),
    title: formData.get("title"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description") || "",
    category: formData.get("category"),
    technologies: formData.get("technologies")
      ? (formData.get("technologies") as string).split(",").map((s) => s.trim()).filter(Boolean)
      : [],
    featured: formData.get("featured") === "on",
    status: formData.get("status") || "completed",
    year: formData.get("year") ? Number(formData.get("year")) : undefined,
    githubUrl: formData.get("githubUrl") || undefined,
    liveUrl: formData.get("liveUrl") || undefined,
  };

  const errors = validateProject(data);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  const db = getAdminDb();
  const newSlug = (data.slug as string).trim();

  // Get existing project data to handle image replacement
  const existingDoc = await db.collection("projects").doc(slug).get();
  const existingData = existingDoc.data() as Record<string, unknown> | undefined;
  const existingImage = existingData?.image as MediaImage | undefined;

  // Determine image: use new upload if provided, else use existing, else null
  const newImage = parseImageData(formData);
  const keepExisting = formData.get("keepExistingImage") === "true";
  let finalImage: MediaImage | null = null;

  if (newImage) {
    // New image uploaded — delete old if different
    finalImage = newImage;
    if (existingImage && existingImage.publicId !== newImage.publicId) {
      try {
        await deleteImage(existingImage.publicId);
      } catch {
        console.error("Failed to delete old project image");
      }
    }
  } else if (keepExisting && existingImage) {
    // Keep existing image
    finalImage = existingImage;
  }
  // else: image was removed (finalImage stays null)

  const projectData: Record<string, unknown> = {
    slug: newSlug,
    title: (data.title as string).trim(),
    shortDescription: (data.shortDescription as string).trim(),
    description: (data.description as string).trim(),
    category: (data.category as string).trim(),
    technologies: data.technologies as string[],
    featured: data.featured as boolean,
    status: data.status as Project["status"],
    year: data.year as number | undefined,
    githubUrl: data.githubUrl as string | undefined,
    liveUrl: data.liveUrl as string | undefined,
  };

  if (finalImage) {
    projectData.image = finalImage;
  } else {
    // Explicitly set to null to clear it
    projectData.image = null;
  }

  await db.collection("projects").doc(slug).set(projectData, { merge: true });

  // If slug changed, delete old document and clean up old image
  if (slug !== newSlug) {
    await db.collection("projects").doc(slug).delete();
  }

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${newSlug}`);
  if (slug !== newSlug) {
    revalidatePath(`/projects/${slug}`);
  }

  return { success: true };
}

export async function deleteProject(slug: string): Promise<ActionResult> {
  try {
    await verifyAdmin();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const db = getAdminDb();

  // Get project to find associated image
  const doc = await db.collection("projects").doc(slug).get();
  if (doc.exists) {
    const data = doc.data();
    const image = data?.image as MediaImage | undefined;
    if (image?.publicId) {
      try {
        await deleteImage(image.publicId);
      } catch {
        console.error("Failed to delete project image from Cloudinary");
      }
    }
  }

  await db.collection("projects").doc(slug).delete();

  revalidatePath("/");
  revalidatePath("/projects");

  return { success: true };
}
