import type { Skill } from "@/types";

export const skills: Skill[] = [
  { name: "JavaScript", category: "language" },
  { name: "TypeScript", category: "language" },
  { name: "Dart", category: "language" },
  { name: "C++", category: "language" },
  { name: "Python", category: "language" },
  { name: "React", category: "framework" },
  { name: "Next.js", category: "framework" },
  { name: "Flutter", category: "framework" },
  { name: "Tailwind CSS", category: "framework" },
  { name: "Firebase", category: "backend" },
  { name: "Firestore", category: "database" },
  { name: "Cloudinary", category: "backend" },
  { name: "Git", category: "tools" },
  { name: "GitHub", category: "tools" },
  { name: "Vercel", category: "tools" },
  { name: "Android Studio", category: "tools" },
];

export function getSkills(): Skill[] {
  return skills;
}

export function getSkillsByCategory(category: Skill["category"]): Skill[] {
  return skills.filter((s) => s.category === category);
}

export function getSkillCategories(): Skill["category"][] {
  return [...new Set(skills.map((s) => s.category))];
}
