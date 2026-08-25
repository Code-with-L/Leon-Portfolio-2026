"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

const HuracanCanvas = dynamic(() => import("./HuracanCanvas"), { ssr: false });

// ── WebGL capability detection ────────────────────────────────────────────
function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

// ── prefers-reduced-motion store ──────────────────────────────────────────
function subscribeMotionPref(onChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const SECTION_IDS = ["hero", "work", "skills", "certs", "about", "contact"] as const;
const INITIAL_TOPS = new Array(SECTION_IDS.length).fill(0) as number[];

/**
 * HuracanExperience — scroll-driven 3D Lamborghini Huracán.
 *
 * Gates (all resolved before Canvas mounts):
 *   - idle-deferred mount (hydration / LCP untouched)
 *   - WebGL availability → CSS fallback otherwise
 *   - prefers-reduced-motion → instant pose snaps, no damping
 *   - tab visibility → Canvas component handles via frameloop
 *
 * The Canvas is fixed full-viewport behind all content (z-index: 0).
 * Main is elevated (z-index: 1) so content sits above the canvas.
 * Sections have transparent backgrounds so the model shows through gaps.
 */
export function HuracanExperience() {
  const [ready, setReady] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [sectionTops, setSectionTops] = useState<number[]>(INITIAL_TOPS);

  const reducedMotion = useSyncExternalStore(
    subscribeMotionPref,
    () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  // ── idle-deferred mount + WebGL detect ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const resolve = () => {
      if (cancelled) return;
      setHasWebGL(detectWebGL());
      setReady(true);
    };
    if ("requestIdleCallback" in window) {
      const w = window as Window & {
        requestIdleCallback: (cb: () => void) => number;
        cancelIdleCallback: (id: number) => void;
      };
      const id = w.requestIdleCallback(resolve);
      return () => {
        cancelled = true;
        w.cancelIdleCallback(id);
      };
    }
    const id = setTimeout(resolve, 150);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, []);

  // ── measure section offsets ─────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const measure = () => {
      setSectionTops(
        SECTION_IDS.map((id) => {
          const el = document.getElementById(id);
          return el ? el.offsetTop : 0;
        }),
      );
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [ready]);

  if (!ready || !hasWebGL) {
    return <HuracanFallback showLoading={ready && hasWebGL} />;
  }

  return (
    <HuracanCanvas
      sectionTops={sectionTops}
      reducedMotion={reducedMotion}
    />
  );
}

// ── fallback ──────────────────────────────────────────────────────────────

function HuracanFallback({ showLoading }: { showLoading: boolean }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none flex items-center justify-center"
      style={{ zIndex: -10 }}
      aria-hidden="true"
    >
      {/* Warm gold radial glow — subtle, never competes with content */}
      <div
        className="h-[360px] w-[360px] rounded-full sm:h-[480px] sm:w-[480px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 48%, rgba(212,175,55,0.12) 0%, rgba(154,118,37,0.06) 40%, transparent 70%)",
        }}
      />
      {showLoading && (
        <p className="absolute bottom-12 text-xs tracking-wide text-muted/60">
          Loading 3D experience…
        </p>
      )}
    </div>
  );
}
