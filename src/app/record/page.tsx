"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";

const RecordScene = dynamic(() => import("@/components/three/RecordScene"), {
  ssr: false,
});

/**
 * Dev-only route for recording a cinematic .webm of the Huracán scene.
 *
 * Renders a full-viewport R3F canvas with a scripted camera timeline
 * (14 s, four shots).  Click "Record" to capture the stream via
 * MediaRecorder — the .webm downloads automatically when done.
 *
 * Usage: open /record in Chrome, click Record, wait ~15 s.
 * Strip this route before shipping to production.
 */
export default function RecordPage() {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [previewKeyframe, setPreviewKeyframe] = useState<number | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("preview");
    if (v !== null) {
      const n = Number(v);
      if (Number.isFinite(n)) setPreviewKeyframe(n);
    }
  }, []);

  const handleRecord = useCallback(() => {
    setRecording(true);
    setElapsed(0);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed(((Date.now() - start) / 1000).toFixed(1) as unknown as number);
    }, 100);
  }, []);

  const handleTimelineEnd = useCallback(() => {
    setRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setElapsed(0);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#fafafa]" style={{ zIndex: 9999 }}>
      <Canvas
        camera={{
          position: [-2.5, 0.9, -3.0],
          fov: 24,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: 4, // ACESFilmicToneMapping
          toneMappingExposure: 1.3,
        }}
      >
        <RecordScene
          recording={recording}
          onTimelineEnd={handleTimelineEnd}
          previewKeyframe={previewKeyframe}
        />
      </Canvas>

      {/* ── Recording UI overlay ──────────────────────────────────────── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 rounded-xl border border-border bg-card/90 px-6 py-3 shadow-lg backdrop-blur">
        <button
          onClick={handleRecord}
          disabled={recording}
          className="rounded-lg bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {recording ? "Recording…" : "Record"}
        </button>

        {recording && (
          <span className="tabular-nums text-sm text-muted">
            {elapsed}s / 14.0s
          </span>
        )}

        {!recording && elapsed === 0 && (
          <span className="text-xs text-muted/60">
            Opens Chrome — click Record, wait 15 s, .webm downloads
          </span>
        )}
      </div>

      {/* ── Shot list reference ───────────────────────────────────────── */}
      <div className="fixed top-6 right-6 rounded-lg border border-border bg-card/80 px-4 py-3 text-xs text-muted backdrop-blur">
        <p className="mb-1 font-medium text-foreground">Timeline</p>
        <ol className="space-y-0.5">
          <li>0 – 3.5 s · Hero wide</li>
          <li>3.5 – 7 s · Wheel close-up</li>
          <li>7 – 10.5 s · Badge close-up</li>
          <li>10.5 – 14 s · Closing wide</li>
        </ol>
      </div>
    </div>
  );
}
