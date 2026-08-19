import type { CertificateType, SkillCategory } from "@/types";

const VALID_STATUSES = ["completed", "in-progress", "planned"] as const;
const VALID_CERT_TYPES: CertificateType[] = ["certificate", "badge", "codelab"];
const VALID_SKILL_CATEGORIES: SkillCategory[] = [
  "language",
  "framework",
  "backend",
  "database",
  "tools",
];

export interface ValidationError {
  field: string;
  message: string;
}

export function validateProject(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
    errors.push({ field: "title", message: "Title is required." });
  }

  if (!data.slug || typeof data.slug !== "string" || !data.slug.trim()) {
    errors.push({ field: "slug", message: "Slug is required." });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug.trim())) {
    errors.push({
      field: "slug",
      message: "Slug must be lowercase with hyphens (e.g. my-project).",
    });
  }

  if (!data.shortDescription || typeof data.shortDescription !== "string" || !data.shortDescription.trim()) {
    errors.push({ field: "shortDescription", message: "Short description is required." });
  }

  if (!data.category || typeof data.category !== "string" || !data.category.trim()) {
    errors.push({ field: "category", message: "Category is required." });
  }

  if (data.status && !VALID_STATUSES.includes(data.status as typeof VALID_STATUSES[number])) {
    errors.push({ field: "status", message: "Invalid status value." });
  }

  if (data.year && (typeof data.year !== "number" || data.year < 2000 || data.year > 2100)) {
    errors.push({ field: "year", message: "Year must be a valid number." });
  }

  if (data.githubUrl && typeof data.githubUrl === "string" && data.githubUrl.trim()) {
    try {
      new URL(data.githubUrl as string);
    } catch {
      errors.push({ field: "githubUrl", message: "GitHub URL is not valid." });
    }
  }

  if (data.liveUrl && typeof data.liveUrl === "string" && data.liveUrl.trim()) {
    try {
      new URL(data.liveUrl as string);
    } catch {
      errors.push({ field: "liveUrl", message: "Live URL is not valid." });
    }
  }

  if (data.technologies && !Array.isArray(data.technologies)) {
    errors.push({ field: "technologies", message: "Technologies must be a list." });
  }

  return errors;
}

export function validateCertificate(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
    errors.push({ field: "title", message: "Title is required." });
  }

  if (!data.issuer || typeof data.issuer !== "string" || !data.issuer.trim()) {
    errors.push({ field: "issuer", message: "Issuer is required." });
  }

  if (data.type && !VALID_CERT_TYPES.includes(data.type as CertificateType)) {
    errors.push({ field: "type", message: "Invalid certificate type." });
  }

  if (data.credentialUrl && typeof data.credentialUrl === "string" && data.credentialUrl.trim()) {
    try {
      new URL(data.credentialUrl as string);
    } catch {
      errors.push({ field: "credentialUrl", message: "Credential URL is not valid." });
    }
  }

  if (data.skills && !Array.isArray(data.skills)) {
    errors.push({ field: "skills", message: "Skills must be a list." });
  }

  return errors;
}

export function validateSkill(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.push({ field: "name", message: "Name is required." });
  }

  if (!data.category || typeof data.category !== "string" || !data.category.trim()) {
    errors.push({ field: "category", message: "Category is required." });
  } else if (!VALID_SKILL_CATEGORIES.includes(data.category as SkillCategory)) {
    errors.push({ field: "category", message: "Invalid skill category." });
  }

  return errors;
}
