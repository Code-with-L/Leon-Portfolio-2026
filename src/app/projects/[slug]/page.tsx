import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProjectMeta } from "@/components/projects/ProjectMeta";
import {
  getProjectBySlug,
  getProjectSlugs,
} from "@/repositories/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProjectSlugs().then((slugs) =>
    slugs.map((slug) => ({ slug })),
  );
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} — Leon Muriithi`,
    description: project.shortDescription,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <Container as="main" className="py-20 sm:py-28">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/projects"
          className="mb-10 inline-flex items-center gap-1 text-sm text-muted transition-colors duration-150 hover:text-foreground"
        >
          <span aria-hidden="true">&larr;</span>
          All Projects
        </Link>

        <header className="mb-10 flex flex-col gap-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            {project.category}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {project.title}
          </h1>
          <p className="text-base leading-relaxed text-muted sm:text-lg">
            {project.shortDescription}
          </p>
        </header>

        <div className="mb-12 border-y border-border py-6">
          <ProjectMeta project={project} />
        </div>

        {project.sections && project.sections.length > 0 && (
          <div className="flex flex-col gap-12">
            {project.sections.map((section) => (
              <section key={section.title} className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {section.title}
                </h2>
                <p className="text-base leading-relaxed text-muted">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        )}
      </article>
    </Container>
  );
}
