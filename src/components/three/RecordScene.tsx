"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import HuracanObject from "./HuracanObject";

/* ------------------------------------------------------------------ */
/*  Camera keyframe timeline (14 s total)                              */
/* ------------------------------------------------------------------ */

interface Keyframe {
  t: number;
  camPos: [number, number, number];
  camTarget: [number, number, number];
  fov: number;
}

/*  Car normalisation: longest axis = 3.0 units.
 *  Approx dims after normalise: L 3.0 × W 1.27 × H 0.78.
 *  Front ≈ z +1.5,  Rear ≈ z −1.5.
 *  Front-left wheel centre ≈ (−0.55, −0.25, +1.0).
 *  Front badge/grille ≈ (0, 0.15, +1.5).
 *
 *  NO text collision constraint — camera fills the frame aggressively.  */

const KEYFRAMES: Keyframe[] = [
  {
    // HERO WIDE — 3/4 front-left, LOW angle.  Car fills ~100 % width × ~46 % height.
    t: 0,
    camPos: [-2.5, 0.9, -3.0],
    camTarget: [0, 0.15, 0],
    fov: 24,
  },
  {
    // WHEEL MACRO — front-left wheel fills entire frame.
    t: 3.5,
    camPos: [-1.3, 0.0, 0.4],
    camTarget: [-0.55, -0.25, 1.0],
    fov: 14,
  },
  {
    // BADGE MACRO — front grille / badge fills entire frame.
    t: 7,
    camPos: [-0.3, 0.55, 3.0],
    camTarget: [0, 0.15, 1.3],
    fov: 16,
  },
  {
    // CLOSING WIDE — 3/4 rear-right, LOW angle.  Car fills ~100 % width.
    t: 10.5,
    camPos: [2.5, 0.9, -3.0],
    camTarget: [0, 0.15, 0],
    fov: 24,
  },
  {
    // CLOSING END — tighter 3/4 rear, slightly lower.
    t: 14,
    camPos: [2.6, 1.0, -3.2],
    camTarget: [0, 0.15, -0.2],
    fov: 22,
  },
];

const DURATION = KEYFRAMES[KEYFRAMES.length - 1].t;

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function lerp3(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function getCameraAtTime(time: number) {
  let i = 0;
  for (; i < KEYFRAMES.length - 1; i++) {
    if (time <= KEYFRAMES[i + 1].t) break;
  }
  i = Math.min(i, KEYFRAMES.length - 2);

  const a = KEYFRAMES[i];
  const b = KEYFRAMES[i + 1];
  const raw = (time - a.t) / (b.t - a.t);
  const t = smoothstep(raw);

  return {
    camPos: lerp3(a.camPos, b.camPos, t),
    camTarget: lerp3(a.camTarget, b.camTarget, t),
    fov: a.fov + (b.fov - a.fov) * t,
  };
}

/* ------------------------------------------------------------------ */
/*  RecordScene — scripted camera for /record route                    */
/* ------------------------------------------------------------------ */

interface RecordSceneProps {
  recording: boolean;
  onTimelineEnd?: () => void;
  previewKeyframe?: number; // lock camera to this keyframe index (for QA screenshots)
}

export default function RecordScene({
  recording,
  onTimelineEnd,
  previewKeyframe,
}: RecordSceneProps) {
  const { camera, gl, scene } = useThree();
  const perspective = camera as THREE.PerspectiveCamera;

  const startTimeRef = useRef(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const timelineDoneRef = useRef(false);

  // ── set scene background + environment ───────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    scene.background = new THREE.Color("#fafafa");
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04);
    room.dispose?.();
    scene.environment = envMap.texture;
    scene.environmentIntensity = 1.5;
    return () => {
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  // ── recording lifecycle ──────────────────────────────────────────────
  useEffect(() => {
    if (!recording) {
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
      recorderRef.current = null;
      return;
    }

    const stream = gl.domElement.captureStream(60);
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 12_000_000,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "huracan-hero.webm";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      timelineDoneRef.current = false;
      onTimelineEnd?.();
    };

    recorder.start(100);
    recorderRef.current = recorder;
    startTimeRef.current = performance.now();
    timelineDoneRef.current = false;

    return () => {
      if (recorder.state !== "inactive") recorder.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  // ── camera timeline ──────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/immutability
  useFrame(() => {
    // Preview mode: lock camera to a specific keyframe
    if (previewKeyframe !== undefined && previewKeyframe >= 0 && previewKeyframe < KEYFRAMES.length) {
      const kf = KEYFRAMES[previewKeyframe];
      perspective.position.set(kf.camPos[0], kf.camPos[1], kf.camPos[2]);
      perspective.lookAt(kf.camTarget[0], kf.camTarget[1], kf.camTarget[2]);
      // eslint-disable-next-line react-hooks/immutability
      perspective.fov = kf.fov;
      perspective.updateProjectionMatrix();
      return;
    }

    if (!recording || timelineDoneRef.current) return;

    const elapsed = (performance.now() - startTimeRef.current) / 1000;

    if (elapsed >= DURATION) {
      timelineDoneRef.current = true;
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }
      return;
    }

    const cam = getCameraAtTime(elapsed);
    perspective.position.set(cam.camPos[0], cam.camPos[1], cam.camPos[2]);
    perspective.lookAt(cam.camTarget[0], cam.camTarget[1], cam.camTarget[2]);
    // eslint-disable-next-line react-hooks/immutability
    perspective.fov = cam.fov;
    perspective.updateProjectionMatrix();
  });

  return (
    <>
      {/* Three-point lighting rig (same as production) */}
      <hemisphereLight args={["#eef0f4", "#0a0a0c", 0.6]} />
      <directionalLight
        position={[5, 7, 4]}
        intensity={3.0}
        color="#fff0d0"
      />
      <directionalLight
        position={[-3, 4, -3]}
        intensity={1.2}
        color="#c8daf0"
      />
      <directionalLight
        position={[-5, 2, -6]}
        intensity={3.0}
        color="#d8e8ff"
      />
      <pointLight
        position={[2, -0.5, -3]}
        intensity={8}
        distance={12}
        decay={2}
        color="#f0d8a0"
      />

      <HuracanObject />
    </>
  );
}
