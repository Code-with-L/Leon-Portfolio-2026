import type { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {projects.map((project) => (
        <div
          key={project.slug}
          className="rounded-lg border border-border p-6 transition-colors hover:border-foreground/20"
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  );
}
