import type { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface ProjectMetaProps {
  project: Project;
}

export function ProjectMeta({ project }: ProjectMetaProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>

      <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-3">
        {project.year && (
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs uppercase tracking-wider text-muted">Year</dt>
            <dd className="font-medium">{project.year}</dd>
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs uppercase tracking-wider text-muted">Status</dt>
          <dd className="font-medium">
            {project.status === "completed" ? "Completed" : "In Progress"}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs uppercase tracking-wider text-muted">Category</dt>
          <dd className="font-medium">{project.category}</dd>
        </div>
      </dl>

      {(project.githubUrl || project.liveUrl) && (
        <div className="flex gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-150 hover:text-muted"
            >
              GitHub
              <span aria-hidden="true">&rarr;</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-150 hover:text-muted"
            >
              Live Site
              <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
