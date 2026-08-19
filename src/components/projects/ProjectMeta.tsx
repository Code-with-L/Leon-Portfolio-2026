import type { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface ProjectMetaProps {
  project: Project;
}

export function ProjectMeta({ project }: ProjectMetaProps) {
  const metaItems = [
    project.year && { label: "Year", value: String(project.year) },
    { label: "Status", value: project.status === "completed" ? "Completed" : "In Progress" },
    { label: "Category", value: project.category },
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
      <dl className="flex flex-col gap-3 text-sm">
        {metaItems.map(
          (item) =>
            item && (
              <div key={item.label} className="flex gap-3">
                <dt className="w-20 shrink-0 text-muted">{item.label}</dt>
                <dd className="font-medium">{item.value}</dd>
              </div>
            ),
        )}
      </dl>
      <div className="flex gap-3">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:text-muted"
          >
            GitHub &rarr;
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:text-muted"
          >
            Live Site &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
