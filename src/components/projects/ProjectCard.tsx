import Link from "next/link";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group flex h-full flex-col">
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="font-medium uppercase tracking-wider">
          {project.category}
        </span>
        {project.year && (
          <>
            <span aria-hidden="true">&middot;</span>
            <time>{project.year}</time>
          </>
        )}
        {project.status === "in-progress" && (
          <>
            <span aria-hidden="true">&middot;</span>
            <span className="font-medium uppercase tracking-wider text-foreground/70">
              In Progress
            </span>
          </>
        )}
      </div>

      <div className="mt-4 flex-1">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          <Link
            href={`/projects/${project.slug}`}
            className="after:absolute after:inset-0"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {project.shortDescription}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors duration-150 hover:text-muted"
        >
          Read case study
          <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-0.5">&rarr;</span>
        </Link>
      </div>
    </article>
  );
}
