import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { getProjects } from "@/repositories/projects";

export const metadata: Metadata = {
  title: "Projects — Leon Muriithi",
  description:
    "Software projects built by Leon Muriithi, including web platforms, AI tools, and systems.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="cinematic relative overflow-hidden bg-[#0a0a0a]">
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[96px] font-black leading-none tracking-[-0.04em] text-white/[0.025] sm:text-[140px] lg:text-[180px]">
          PROJECTS
        </div>
      </div>
      <Container as="main" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#a855f7]/20 bg-[#a855f7]/10 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.6)]" aria-hidden="true" />
            <span className="text-xs font-mono tracking-widest text-[#c084fc]">02 — PROJECTS</span>
          </div>
          <h1 className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
            Projects
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60">
            Software projects I&apos;ve built or am currently working on. Each project represents a real problem
            solved.
          </p>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-[#a855f7]/30 via-[#a855f7]/10 to-transparent" aria-hidden="true" />
        </div>
        <div className="mt-12">
          <ProjectGrid projects={projects} />
        </div>
      </Container>
    </div>
  );
}
