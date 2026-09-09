"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_SRC = "/videos/hero_video_final.mp4";
const VIDEO_POSTER = "/videos/hero-poster.jpg";

/**
 * Scroll-scrubbed hero video — fixed full-viewport background layer.
 *
 * Maps total page scroll progress (from the very top of the page to the
 * very bottom of the scrollable content) to video.currentTime, so the
 * film's three shots (front 3/4 → wheel → closing) play out as the
 * visitor scrolls the whole page and end on the closing frame at the
 * bottom. Scrolling up reverses cleanly; the video never loops.
 *
 * Playback is driven entirely via direct currentTime assignment inside a
 * requestAnimationFrame loop (never .play()/.pause()), so scrubbing is
 * cheap and seek-buffer-jank-free.
 */
export default function VideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [ready, setReady] = useState(false);

  // ── detect whether the video file loads ────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      setHasVideo(true);
      setReady(true);
      v.pause();
    };
    const onError = () => {
      setHasVideo(false);
      setReady(true);
    };

    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("error", onError);
    v.load();

    return () => {
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("error", onError);
    };
  }, []);

  // ── scroll scrub (rAF-throttled, ready-guarded) ────────────────────
  useEffect(() => {
    if (!hasVideo || !ready) return;
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    // Scroll range: top of page → bottom of scrollable content.
    // Maps the video's 0–13.8s across the ENTIRE page scroll so the three
    // shots (front 3/4 → wheel → closing) play out from top to bottom and
    // end on the final frame at the bottom of the page.
    const getRange = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      return Math.max(1, maxScroll);
    };

    let raf = 0;

    const update = () => {
      raf = 0;
      if (video.readyState < 1 || !video.duration) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / getRange()));
      video.currentTime = progress * video.duration;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hasVideo, ready]);

  return (
    <>
      {/* Fixed full-viewport video (scrubbed, never autoplayed) */}
      <video
        ref={videoRef}
        className="fixed inset-0 z-0 h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
        src={VIDEO_SRC}
        poster={VIDEO_POSTER}
        aria-hidden="true"
      />

      {/* Placeholder when the video file isn't present yet */}
      {ready && !hasVideo && <VideoPlaceholder />}
    </>
  );
}

/**
 * Animated gradient shown while the video file is not yet available.
 */
function VideoPlaceholder() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 45%, rgba(212,175,55,0.12) 0%, rgba(100,80,30,0.04) 50%, transparent 80%)",
          animation: "placeholder-pulse 6s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes placeholder-pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.03); }
        }
      `}</style>
    </div>
  );
}
