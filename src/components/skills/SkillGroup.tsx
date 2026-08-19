import type { Skill, SkillCategory } from "@/types";

interface SkillGroupProps {
  category: SkillCategory;
  skills: Skill[];
}

const categoryLabels: Record<SkillCategory, string> = {
  language: "Languages",
  framework: "Frameworks & Libraries",
  backend: "Backend & Cloud",
  database: "Databases",
  tools: "Tools & Platforms",
};

export function SkillGroup({ category, skills }: SkillGroupProps) {
  return (
    <div className="border-t border-border pt-6">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
        {categoryLabels[category]}
      </h3>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2" role="list">
        {skills.map((skill) => (
          <li key={skill.name} className="text-sm text-foreground">
            {skill.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
