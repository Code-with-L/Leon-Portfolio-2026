import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { SkillGroup } from "@/components/skills/SkillGroup";
import { CertificateGrid } from "@/components/certificates/CertificateGrid";
import { getFeaturedProjects } from "@/repositories/projects";
import { getSkillsByCategory, getSkillCategories } from "@/repositories/skills";
import { getCertificates } from "@/repositories/certificates";

export default async function Home() {
  const [featuredProjects, certificates, categories] = await Promise.all([
    getFeaturedProjects(),
    getCertificates(),
    getSkillCategories(),
  ]);

  const skillsByCategory = await Promise.all(
    categories.map(async (cat) => ({
      category: cat,
      skills: await getSkillsByCategory(cat),
    })),
  );

  return (
    <>
      {/* Hero */}
      <section className="py-24 sm:py-32 lg:py-40">
        <Container>
          <div className="flex max-w-2xl flex-col gap-6">
            <p className="text-sm font-medium tracking-wide text-muted uppercase">
              Software Developer
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Leon Muriithi
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              I build practical software, explore new technologies, and learn by
              solving real problems. This portfolio is a collection of that work.
            </p>
            <div className="flex gap-3 pt-3">
              <Link href="/projects">
                <Button>View Projects</Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary">Get in Touch</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Selected Projects */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <div className="flex items-end justify-between">
            <SectionHeading
              title="Selected Work"
              description="Projects I've built or am currently working on."
            />
            <Link
              href="/projects"
              className="mb-10 hidden text-sm font-medium text-muted transition-colors duration-150 hover:text-foreground sm:block"
            >
              View All &rarr;
            </Link>
          </div>
          <ProjectGrid projects={featuredProjects} />
          <Link
            href="/projects"
            className="mt-8 block text-center text-sm font-medium text-muted transition-colors duration-150 hover:text-foreground sm:hidden"
          >
            View All Projects &rarr;
          </Link>
        </Container>
      </section>

      {/* Skills */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            title="What I Work With"
            description="Technologies and tools I use to build software."
          />
          <div className="max-w-3xl">
            {skillsByCategory.map(({ category, skills }) => (
              <SkillGroup key={category} category={category} skills={skills} />
            ))}
          </div>
        </Container>
      </section>

      {/* Certificates */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <SectionHeading
            title="Certificates & Learning"
            description="Credentials and learning milestones."
          />
          <CertificateGrid certificates={certificates} />
        </Container>
      </section>

      {/* About Preview */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <div className="flex max-w-2xl flex-col gap-6">
            <SectionHeading
              title="About"
              description="A developer focused on building real software and learning through practical projects."
            />
            <p className="text-base leading-relaxed text-muted">
              Every project is an opportunity to deepen my understanding of
              software development — from architecture and code quality to
              user experience and performance.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors duration-150 hover:text-muted"
            >
              Learn More
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-border py-20 sm:py-24">
        <Container>
          <div className="flex max-w-2xl flex-col gap-6">
            <SectionHeading
              title="Get in Touch"
              description="Have a question, idea, or want to collaborate?"
            />
            <Link href="/contact">
              <Button>Contact Me</Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
