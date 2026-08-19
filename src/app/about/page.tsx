import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "About — Leon Muriithi",
  description:
    "Leon Muriithi's development philosophy, current focus, and the technologies he works with.",
};

export default function AboutPage() {
  return (
    <Container as="main" className="py-20 sm:py-28">
      <SectionHeading
        title="About"
        description="A developer focused on building real software and learning through practical projects."
      />

      <div className="flex max-w-2xl flex-col gap-12">
        {/* Who I Am */}
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

        {/* Current Focus */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Current Focus
          </h2>
          <p className="text-base leading-relaxed text-muted">
            I&apos;m currently exploring modern web development with React and
            Next.js, mobile development with Flutter, and backend systems with
            Firebase. I&apos;m also interested in machine learning and
            blockchain-based systems.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
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

        {/* Development Philosophy */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Development Philosophy
          </h2>
          <ul className="flex flex-col gap-4" role="list">
            <li className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">
                Build real things.
              </span>
              <span className="text-sm leading-relaxed text-muted">
                Projects should solve actual problems, not just demonstrate
                features.
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">
                Learn through doing.
              </span>
              <span className="text-sm leading-relaxed text-muted">
                The best understanding comes from implementation, not just
                reading documentation.
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">
                Write code that works.
              </span>
              <span className="text-sm leading-relaxed text-muted">
                Reliability and clarity matter more than cleverness.
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">
                Think about security.
              </span>
              <span className="text-sm leading-relaxed text-muted">
                Good software considers threats from the beginning, not as an
                afterthought.
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">
                Improve continuously.
              </span>
              <span className="text-sm leading-relaxed text-muted">
                Every project is a chance to do better than the last one.
              </span>
            </li>
          </ul>
        </section>

        {/* Technologies */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Technologies I Work With
          </h2>
          <div className="flex flex-wrap gap-2">
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
  );
}
