import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "About — Leon Muriithi",
  description:
    "Leon Muriithi's development philosophy, current focus, and the technologies he works with.",
};

const philosophy = [
  {
    title: "Build real things.",
    description: "Projects should solve actual problems, not just demonstrate features.",
  },
  {
    title: "Learn through doing.",
    description: "The best understanding comes from implementation, not just reading documentation.",
  },
  {
    title: "Write code that works.",
    description: "Reliability and clarity matter more than cleverness.",
  },
  {
    title: "Think about security.",
    description: "Good software considers threats from the beginning, not as an afterthought.",
  },
  {
    title: "Improve continuously.",
    description: "Every project is a chance to do better than the last one.",
  },
];

export default function AboutPage() {
  return (
    <div className="cinematic relative bg-[#0a0a0a]">
      {/* Subtle purple-tinted background — ties to homepage violet identity, not generic dark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(168,85,247,0.08),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_85%_50%,rgba(168,85,247,0.06),transparent_65%)]"
      />
      <Container as="main" className="relative py-20 sm:py-28">
        <SectionHeading
          title="About"
          description="A developer focused on building real software and learning through practical projects."
        />

        <div className="mx-auto flex max-w-3xl flex-col gap-8">
            {/* Who I Am — keep as introductory text, not in a panel to preserve hierarchy */}
            <section className="flex flex-col gap-4">
              <p className="text-base leading-relaxed text-muted">
                I&apos;m Leon Muriithi, a software developer with a passion for
                building practical tools and solving real problems. I believe the
                best way to learn is by building things that actually work.
              </p>
              <p className="text-base leading-relaxed text-muted">
                Every project I take on is an opportunity to deepen my understanding
                of software development — from architecture and code quality to
                user experience and performance.
              </p>
            </section>

            {/* Current Focus — same panel as homepage Skills/Certificates, now with accent heading + hover glow */}
            <section className="group rounded-2xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-black/20 transition-colors duration-300 hover:border-[#a855f7]/20 hover:shadow-[0_0_24px_rgba(168,85,247,0.08)] sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Current Focus
              </h2>
              <div className="mt-2 h-0.5 w-8 rounded-full bg-[#a855f7]/60" aria-hidden="true" />
              <p className="mt-4 text-sm leading-relaxed text-muted">
                I&apos;m currently exploring modern web development with React and
                Next.js, mobile development with Flutter, and backend systems with
                Firebase. I&apos;m also interested in machine learning and
                blockchain-based systems.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "React",
                  "Next.js",
                  "Flutter",
                  "Firebase",
                  "Machine Learning",
                  "TypeScript",
                ].map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </section>

            {/* Development Philosophy — clean numbered list within same panel system, purple markers */}
            <section className="group rounded-2xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-black/20 transition-colors duration-300 hover:border-[#a855f7]/20 hover:shadow-[0_0_24px_rgba(168,85,247,0.08)] sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Development Philosophy
              </h2>
              <div className="mt-2 h-0.5 w-8 rounded-full bg-[#a855f7]/60" aria-hidden="true" />
              <ul className="mt-6 flex flex-col gap-5" role="list">
                {philosophy.map((item, index) => (
                  <li key={item.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#a855f7]/20 bg-[#a855f7]/10 text-[11px] font-mono font-medium tracking-wider text-[#c084fc]"
                    >
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="flex flex-col gap-1 pt-0.5">
                      <span className="text-sm font-semibold text-foreground">
                        {item.title}
                      </span>
                      <span className="text-sm leading-relaxed text-muted">
                        {item.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Technologies I Work With — same tag pill treatment, grouped cleanly */}
            <section className="group rounded-2xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-black/20 transition-colors duration-300 hover:border-[#a855f7]/20 hover:shadow-[0_0_24px_rgba(168,85,247,0.08)] sm:p-8">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Technologies I Work With
              </h2>
              <div className="mt-2 h-0.5 w-8 rounded-full bg-[#a855f7]/60" aria-hidden="true" />
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "JavaScript",
                  "TypeScript",
                  "Dart",
                  "C++",
                  "Python",
                  "React",
                  "Next.js",
                  "Flutter",
                  "Tailwind CSS",
                  "Firebase",
                  "Firestore",
                  "Cloudinary",
                  "Git",
                  "GitHub",
                  "Vercel",
                  "Android Studio",
                ].map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            </section>
          </div>
      </Container>
    </div>
  );
}
