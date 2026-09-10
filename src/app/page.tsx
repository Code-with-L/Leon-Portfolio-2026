import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { SkillGroup } from "@/components/skills/SkillGroup";
import { CertificateGrid } from "@/components/certificates/CertificateGrid";
import VideoHero from "@/components/three/VideoHero";
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
      {/* ── Fixed full-bleed scroll-scrubbed video background ──────── */}
      <VideoHero />

      {/* ── Hero — text over the cinematic video background ────────── */}
      <section id="hero" className="relative flex min-h-screen items-center">
        <Container className="relative z-10">
          <div className="flex max-w-2xl flex-col gap-6 rounded-2xl border border-white/10 bg-black/30 p-8 sm:p-10">
            <p className="text-sm font-medium tracking-wide text-white/70 uppercase">
              Software Developer
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Leon Muriithi
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
              I build practical software, explore new technologies, and learn
              by solving real problems. This portfolio is a collection of that
              work.
            </p>
            <div className="flex flex-wrap gap-4 pt-3">
              <Link
                href="/projects"
                className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/85"
              >
                View Projects
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-white/20 bg-transparent px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Cinematic content region — re-scopes theme tokens to a dark
           palette so light text stays readable while the scrubbed video
           glows through the translucent section backgrounds. ──────── */}
      <div className="cinematic relative">
      {/* ── Selected Projects ──────────────────────────────────────── */}
      <section
        id="work"
        className="relative border-t border-border bg-black/80 py-20 sm:py-24"
      >
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

      {/* ── Skills ─────────────────────────────────────────────────── */}
      <section
        id="skills"
        className="relative border-t border-border bg-black/80 py-20 sm:py-24"
      >
        <Container>
          <SectionHeading
            title="What I Work With"
            description="Technologies and tools I use to build software."
          />
          <div className="max-w-3xl rounded-2xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-black/20 sm:p-8">
            {skillsByCategory.map(({ category, skills }) => (
              <SkillGroup key={category} category={category} skills={skills} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Certificates ───────────────────────────────────────────── */}
      <section
        id="certs"
        className="relative border-t border-border bg-black/80 py-20 sm:py-24"
      >
        <Container>
          <SectionHeading
            title="Certificates & Learning"
            description="Credentials and learning milestones."
          />
          <CertificateGrid certificates={certificates} />
        </Container>
      </section>

      {/* ── About Preview ──────────────────────────────────────────── */}
      <section
        id="about"
        className="relative border-t border-border bg-black/80 py-20 sm:py-24"
      >
        <Container>
          <SectionHeading
            title="About"
            description="A developer focused on building real software and learning through practical projects."
          />
          <div className="flex max-w-2xl flex-col gap-6 rounded-2xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-black/20 sm:p-8">
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

      {/* ── Contact CTA ────────────────────────────────────────────── */}
      <section
        id="contact"
        className="relative border-t border-border bg-black/80 py-20 sm:py-24"
      >
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <SectionHeading
              centered
              title="Get in Touch"
              description="Have a question, idea, or want to collaborate?"
            />
            <div className="rounded-2xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-black/20 sm:p-8">
              <Link href="/contact">
                <Button>Contact Me</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
      </div>
    </>
  );
}
