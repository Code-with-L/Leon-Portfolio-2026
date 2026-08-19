import type { Skill, SkillCategory } from "@/types";
import { Badge } from "@/components/ui/Badge";

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
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted">
        {categoryLabels[category]}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill.name}>{skill.name}</Badge>
        ))}
      </div>
    </div>
  );
}
