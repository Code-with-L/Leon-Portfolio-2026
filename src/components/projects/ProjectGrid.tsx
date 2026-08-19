import type { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid gap-px sm:grid-cols-2">
      {projects.map((project) => (
        <div
          key={project.slug}
          className="border border-border p-6 sm:p-8"
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
