import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProjectMeta } from "@/components/projects/ProjectMeta";
import { getProjectBySlug, getProjectSlugs } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: ProjectPageProps,
): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

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
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <Container as="main" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/projects"
          className="mb-8 inline-block text-sm text-muted transition-colors hover:text-foreground"
        >
          &larr; All Projects
        </Link>

        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-muted">
            {project.shortDescription}
          </p>
        </header>

        <div className="mb-12">
          <ProjectMeta project={project} />
        </div>

        {project.sections && project.sections.length > 0 && (
          <div className="flex flex-col gap-10">
            {project.sections.map((section) => (
              <section key={section.title} className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold tracking-tight">
                  {section.title}
                </h2>
                <p className="text-base leading-relaxed text-muted">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
