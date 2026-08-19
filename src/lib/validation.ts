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

const MAX_TITLE = 200;
const MAX_SLUG = 100;
const MAX_DESCRIPTION = 5000;
const MAX_SHORT_DESCRIPTION = 500;
const MAX_CATEGORY = 100;
const MAX_TEXT = 1000;

export interface ValidationError {
  field: string;
  message: string;
}

function tooLong(value: string, max: number): boolean {
  return value.length > max;
}

export function validateProject(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title || typeof data.title !== "string" || !data.title.trim()) {
    errors.push({ field: "title", message: "Title is required." });
  } else if (tooLong(data.title.trim(), MAX_TITLE)) {
    errors.push({ field: "title", message: `Title must be ${MAX_TITLE} characters or fewer.` });
  }

  if (!data.slug || typeof data.slug !== "string" || !data.slug.trim()) {
    errors.push({ field: "slug", message: "Slug is required." });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug.trim())) {
    errors.push({
      field: "slug",
      message: "Slug must be lowercase with hyphens (e.g. my-project).",
    });
  } else if (tooLong(data.slug.trim(), MAX_SLUG)) {
    errors.push({ field: "slug", message: `Slug must be ${MAX_SLUG} characters or fewer.` });
  }

  if (!data.shortDescription || typeof data.shortDescription !== "string" || !data.shortDescription.trim()) {
    errors.push({ field: "shortDescription", message: "Short description is required." });
  } else if (tooLong(data.shortDescription.trim(), MAX_SHORT_DESCRIPTION)) {
    errors.push({ field: "shortDescription", message: `Short description must be ${MAX_SHORT_DESCRIPTION} characters or fewer.` });
  }

  if (typeof data.description === "string" && tooLong(data.description.trim(), MAX_DESCRIPTION)) {
    errors.push({ field: "description", message: `Description must be ${MAX_DESCRIPTION} characters or fewer.` });
  }

  if (!data.category || typeof data.category !== "string" || !data.category.trim()) {
    errors.push({ field: "category", message: "Category is required." });
  } else if (tooLong(data.category.trim(), MAX_CATEGORY)) {
    errors.push({ field: "category", message: `Category must be ${MAX_CATEGORY} characters or fewer.` });
  }

  if (data.status && !VALID_STATUSES.includes(data.status as typeof VALID_STATUSES[number])) {
    errors.push({ field: "status", message: "Invalid status value." });
  }

  if (data.year && (typeof data.year !== "number" || data.year < 2000 || data.year > 2100)) {
    errors.push({ field: "year", message: "Year must be a valid number." });
  }

  if (data.githubUrl && typeof data.githubUrl === "string" && data.githubUrl.trim()) {
    try {
      const url = new URL(data.githubUrl.trim());
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        errors.push({ field: "githubUrl", message: "GitHub URL must use http or https." });
      }
    } catch {
      errors.push({ field: "githubUrl", message: "GitHub URL is not valid." });
    }
  }

  if (data.liveUrl && typeof data.liveUrl === "string" && data.liveUrl.trim()) {
    try {
      const url = new URL(data.liveUrl.trim());
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        errors.push({ field: "liveUrl", message: "Live URL must use http or https." });
      }
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
  } else if (tooLong(data.title.trim(), MAX_TITLE)) {
    errors.push({ field: "title", message: `Title must be ${MAX_TITLE} characters or fewer.` });
  }

  if (!data.issuer || typeof data.issuer !== "string" || !data.issuer.trim()) {
    errors.push({ field: "issuer", message: "Issuer is required." });
  } else if (tooLong(data.issuer.trim(), MAX_TEXT)) {
    errors.push({ field: "issuer", message: `Issuer must be ${MAX_TEXT} characters or fewer.` });
  }

  if (data.type && !VALID_CERT_TYPES.includes(data.type as CertificateType)) {
    errors.push({ field: "type", message: "Invalid certificate type." });
  }

  if (data.credentialUrl && typeof data.credentialUrl === "string" && data.credentialUrl.trim()) {
    try {
      const url = new URL(data.credentialUrl.trim());
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        errors.push({ field: "credentialUrl", message: "Credential URL must use http or https." });
      }
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
  } else if (tooLong(data.name.trim(), MAX_TEXT)) {
    errors.push({ field: "name", message: `Name must be ${MAX_TEXT} characters or fewer.` });
  }

  if (!data.category || typeof data.category !== "string" || !data.category.trim()) {
    errors.push({ field: "category", message: "Category is required." });
  } else if (!VALID_SKILL_CATEGORIES.includes(data.category as SkillCategory)) {
    errors.push({ field: "category", message: "Invalid skill category." });
  }

  if (typeof data.description === "string" && tooLong(data.description.trim(), MAX_DESCRIPTION)) {
    errors.push({ field: "description", message: `Description must be ${MAX_DESCRIPTION} characters or fewer.` });
  }

  return errors;
}
