import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { getProjects } from "@/repositories/projects";

export const metadata: Metadata = {
  title: "Projects — Leon Muriithi",
  description:
    "Software projects built by Leon Muriithi, including web platforms, AI tools, and systems.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <Container as="main" className="py-20 sm:py-28">
      <SectionHeading
        title="Projects"
        description="Software projects I've built or am currently working on. Each project represents a real problem solved."
      />
      <ProjectGrid projects={projects} />
    </Container>
  );
}
