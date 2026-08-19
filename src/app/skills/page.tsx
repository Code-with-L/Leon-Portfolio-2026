import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SkillGroup } from "@/components/skills/SkillGroup";
import {
  getSkillsByCategory,
  getSkillCategories,
} from "@/repositories/skills";

export const metadata: Metadata = {
  title: "Skills — Leon Muriithi",
  description:
    "Technologies, frameworks, and tools used by Leon Muriithi in software development.",
};

export default async function SkillsPage() {
  const categories = await getSkillCategories();

  const skillsByCategory = await Promise.all(
    categories.map(async (cat) => ({
      category: cat,
      skills: await getSkillsByCategory(cat),
    })),
  );

  return (
    <Container as="main" className="py-20 sm:py-28">
      <SectionHeading
        title="Skills"
        description="Technologies and tools I use to build software."
      />
      <div className="max-w-3xl">
        {skillsByCategory.map(({ category, skills }) => (
          <SkillGroup key={category} category={category} skills={skills} />
        ))}
      </div>
    </Container>
  );
}
