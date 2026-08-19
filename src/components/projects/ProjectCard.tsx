import Link from "next/link";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {project.category}
        </span>
        <span className="text-xs text-muted">
          {project.status === "completed" ? "Completed" : "In Progress"}
        </span>
      </div>
      <div>
        <h3 className="text-lg font-semibold tracking-tight">
          <Link
            href={`/projects/${project.slug}`}
            className="transition-colors hover:text-muted"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {project.shortDescription}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
      <div className="mt-auto pt-2">
        <Link
          href={`/projects/${project.slug}`}
          className="text-sm font-medium text-foreground transition-colors hover:text-muted"
        >
          View Details &rarr;
        </Link>
      </div>
    </article>
  );
}
