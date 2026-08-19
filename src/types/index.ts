export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  links: {
    github: string;
    email: string;
  };
  nav: readonly NavItem[];
}

export interface ProjectSection {
  title: string;
  content: string;
}

export interface MediaImage {
  url: string;
  publicId: string;
  alt: string;
}

export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  technologies: string[];
  featured: boolean;
  status: "completed" | "in-progress" | "planned";
  githubUrl?: string;
  liveUrl?: string;
  image?: MediaImage;
  year?: number;
  sections?: ProjectSection[];
}

export type CertificateType = "certificate" | "badge" | "codelab";

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  type: CertificateType;
  date?: string;
  skills: string[];
  credentialUrl?: string;
  image?: MediaImage;
}

export type SkillCategory =
  | "language"
  | "framework"
  | "backend"
  | "database"
  | "tools";

export interface Skill {
  name: string;
  category: SkillCategory;
  description?: string;
}
