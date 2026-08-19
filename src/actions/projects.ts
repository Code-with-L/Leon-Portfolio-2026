"use server";

import { revalidatePath } from "next/cache";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";
import { validateProject, type ValidationError } from "@/lib/validation";
import type { Project } from "@/types";

export interface ActionResult {
  success: boolean;
  errors?: ValidationError[];
  error?: string;
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

  const projectData = {
    slug: (data.slug as string).trim(),
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

  await db.collection("projects").doc(slug).set(projectData, { merge: true });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);

  return { success: true };
}

export async function deleteProject(slug: string): Promise<ActionResult> {
  try {
    await verifyAdmin();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const db = getAdminDb();
  await db.collection("projects").doc(slug).delete();

  revalidatePath("/");
  revalidatePath("/projects");

  return { success: true };
}
