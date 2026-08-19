import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { SkillGroup } from "@/components/skills/SkillGroup";
import { CertificateGrid } from "@/components/certificates/CertificateGrid";
import { getFeaturedProjects } from "@/data/projects";
import { getSkillsByCategory, getSkillCategories } from "@/data/skills";
import { getCertificates } from "@/data/certificates";

export default function Home() {
  const featuredProjects = getFeaturedProjects();
  const certificates = getCertificates();
  const categories = getSkillCategories();

  return (
    <>
      {/* Hero */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="flex max-w-2xl flex-col gap-6">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Leon Muriithi
            </h1>
            <p className="text-lg text-muted">Software Developer</p>
            <p className="max-w-lg text-base leading-relaxed text-muted">
              I build practical software, explore new technologies, and learn by
              solving real problems. This portfolio is a collection of that work.
            </p>
            <div className="flex gap-3 pt-2">
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
      <section className="border-t border-border py-20">
        <Container>
          <div className="flex items-end justify-between">
            <SectionHeading
              title="Selected Projects"
              description="A selection of projects I've built or am currently working on."
            />
            <Link
              href="/projects"
              className="hidden text-sm font-medium transition-colors hover:text-muted sm:block"
            >
              View All &rarr;
            </Link>
          </div>
          <ProjectGrid projects={featuredProjects} />
          <Link
            href="/projects"
            className="mt-8 block text-center text-sm font-medium transition-colors hover:text-muted sm:hidden"
          >
            View All Projects &rarr;
          </Link>
        </Container>
      </section>

      {/* Skills */}
      <section className="border-t border-border py-20">
        <Container>
          <SectionHeading
            title="What I Work With"
            description="Technologies and tools I use to build software."
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <SkillGroup
                key={category}
                category={category}
                skills={getSkillsByCategory(category)}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Certificates */}
      <section className="border-t border-border py-20">
        <Container>
          <SectionHeading
            title="Certificates & Learning"
            description="Credentials and learning milestones."
          />
          <CertificateGrid certificates={certificates} />
        </Container>
      </section>

      {/* About Preview */}
      <section className="border-t border-border py-20">
        <Container>
          <div className="flex max-w-2xl flex-col gap-6">
            <SectionHeading title="About" />
            <p className="text-base leading-relaxed text-muted">
              I&apos;m a software developer focused on building practical tools
              and learning through real projects. I care about writing code that
              works, solving problems that matter, and continuously improving my
              craft.
            </p>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-muted"
            >
              Learn More &rarr;
            </Link>
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-border py-20">
        <Container>
          <div className="flex max-w-2xl flex-col gap-6">
            <SectionHeading
              title="Get in Touch"
              description="Have a question, idea, or want to collaborate? I'd like to hear from you."
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
