import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
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
    <div className="cinematic relative overflow-hidden bg-[#0a0a0a]">
      {/* Layered violet identity — more depth than before, still restrained */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(168,85,247,0.14),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_90%_35%,rgba(168,85,247,0.07),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Oversized watermark — subtle, adds scale without competing */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        <div className="absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-[96px] font-black leading-none tracking-[-0.04em] text-white/[0.025] sm:text-[140px] lg:text-[180px]">
          ABOUT
        </div>
      </div>

      <Container as="main" className="relative py-20 sm:py-28">
        {/* Eyebrow + striking heading */}
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#a855f7]/20 bg-[#a855f7]/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.6)]" aria-hidden="true" />
            <span className="text-xs font-mono tracking-widest text-[#c084fc]">01 — ABOUT</span>
          </div>
          <h1 className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            About
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60">
            A developer focused on building <span className="text-white">real software</span> and learning through
            practical projects — from architecture and code quality to user experience.
          </p>
          <div className="mt-6 h-px w-full max-w-3xl bg-gradient-to-r from-[#a855f7]/30 via-[#a855f7]/10 to-transparent" aria-hidden="true" />
        </div>

        <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-8">
          {/* Who I Am — elevated from plain paragraphs to a subtle intro card */}
          <section className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-black/20 backdrop-blur-[1px] transition-colors duration-300 hover:border-[#a855f7]/20 hover:shadow-[0_0_32px_rgba(168,85,247,0.08)] sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a855f7]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
            <p className="text-base leading-relaxed text-muted">
              I&apos;m <span className="font-medium text-foreground">Leon Muriithi</span>, a software developer with a
              passion for building practical tools and solving real problems. I believe the best way to learn is by
              building things that actually work.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Every project I take on is an opportunity to deepen my understanding of software development — from
              architecture and code quality to user experience and performance.
            </p>
          </section>

          {/* Current Focus — same panel, now with top accent + violet glow */}
          <section className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-black/20 transition-colors duration-300 hover:border-[#a855f7]/20 hover:shadow-[0_0_32px_rgba(168,85,247,0.08)] sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a855f7]/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <div className="h-6 w-px bg-[#a855f7]/40" aria-hidden="true" />
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Current Focus</h2>
            </div>
            <div className="mt-2 h-0.5 w-8 rounded-full bg-[#a855f7]/60" aria-hidden="true" />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              I&apos;m currently exploring modern web development with React and Next.js, mobile development with
              Flutter, and backend systems with Firebase. I&apos;m also interested in machine learning and
              blockchain-based systems.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["React", "Next.js", "Flutter", "Firebase", "Machine Learning", "TypeScript"].map((tech) => (
                <Badge key={tech} className="border-[#a855f7]/10 hover:border-[#a855f7]/30 hover:bg-[#a855f7]/5">
                  {tech}
                </Badge>
              ))}
            </div>
          </section>

          {/* Development Philosophy — numbered with violet glow + subtle dividers */}
          <section className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-black/20 transition-colors duration-300 hover:border-[#a855f7]/20 hover:shadow-[0_0_32px_rgba(168,85,247,0.08)] sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a855f7]/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <div className="h-6 w-px bg-[#a855f7]/40" aria-hidden="true" />
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Development Philosophy</h2>
            </div>
            <div className="mt-2 h-0.5 w-8 rounded-full bg-[#a855f7]/60" aria-hidden="true" />
            <ul className="mt-8 flex flex-col" role="list">
              {philosophy.map((item, index) => (
                <li key={item.title} className="group/item flex gap-4 py-5 first:pt-2 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#a855f7]/20 bg-[#a855f7]/10 text-[11px] font-mono font-medium tracking-wider text-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.15)] transition-all group-hover/item:border-[#a855f7]/30 group-hover/item:shadow-[0_0_16px_rgba(168,85,247,0.22)]"
                  >
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="flex flex-1 flex-col gap-1 pt-1">
                    <span className="text-sm font-semibold text-foreground">{item.title}</span>
                    <span className="text-sm leading-relaxed text-muted">{item.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Technologies I Work With — denser, with subtle violet hover on pills */}
          <section className="group relative overflow-hidden rounded-2xl border border-border/60 bg-background/60 p-6 shadow-lg shadow-black/20 transition-colors duration-300 hover:border-[#a855f7]/20 hover:shadow-[0_0_32px_rgba(168,85,247,0.08)] sm:p-8">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a855f7]/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            <div className="flex items-center gap-3">
              <div className="h-6 w-px bg-[#a855f7]/40" aria-hidden="true" />
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Technologies I Work With</h2>
            </div>
            <div className="mt-2 h-0.5 w-8 rounded-full bg-[#a855f7]/60" aria-hidden="true" />
            <div className="mt-6 flex flex-wrap gap-2">
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
                <Badge key={tech} className="border-[#a855f7]/10 hover:border-[#a855f7]/30 hover:bg-[#a855f7]/5">
                  {tech}
                </Badge>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
