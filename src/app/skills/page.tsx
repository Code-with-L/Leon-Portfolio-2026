import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillGroup } from "@/components/skills/SkillGroup";
import { getSkillsByCategory, getSkillCategories } from "@/data/skills";

export const metadata: Metadata = {
  title: "Skills — Leon Muriithi",
  description:
    "Technologies, frameworks, and tools used by Leon Muriithi in software development.",
};

export default function SkillsPage() {
  const categories = getSkillCategories();

  return (
    <Container as="main" className="py-20 sm:py-28">
      <SectionHeading
        title="Skills"
        description="Technologies and tools I use to build software."
      />
      <div className="flex flex-col gap-10">
        {categories.map((category) => (
          <SkillGroup
            key={category}
            category={category}
            skills={getSkillsByCategory(category)}
          />
        ))}
      </div>
    </Container>
  );
}
