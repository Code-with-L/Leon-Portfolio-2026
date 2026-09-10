import Link from "next/link";

export default function NotFound() {
  return (
    <div className="cinematic relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-5 py-20">
      {/* Violet identity — same as About/Projects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(168,85,247,0.12),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_90%_35%,rgba(168,85,247,0.06),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Oversized watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[140px] font-black leading-none tracking-[-0.04em] text-white/[0.025] sm:text-[200px] lg:text-[260px]">
          404
        </div>
      </div>

      <div className="relative flex flex-col items-center text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#a855f7]/20 bg-[#a855f7]/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.6)]" aria-hidden="true" />
          <span className="text-xs font-mono tracking-widest text-[#c084fc]">ERROR — PAGE NOT FOUND</span>
        </div>

        <h1 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-6xl font-black tracking-tighter text-transparent sm:text-8xl">
          404
        </h1>
        <div className="mt-4 h-0.5 w-16 rounded-full bg-[#a855f7]/50" aria-hidden="true" />

        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Lost in the void
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#a855f7] px-8 text-sm font-medium text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all hover:bg-[#9333ea] hover:shadow-[0_0_24px_rgba(168,85,247,0.4)]"
          >
            Back to Home
          </Link>
          <Link
            href="/projects"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 text-sm font-medium text-white/80 backdrop-blur transition-colors hover:bg-white/10 hover:text-white"
          >
            View Projects
          </Link>
        </div>

        <p className="mt-8 font-mono text-xs tracking-wider text-white/25">LEON MURIITHI — 2026</p>
      </div>
    </div>
  );
}
