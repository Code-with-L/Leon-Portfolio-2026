import * as THREE from "three";

/** Camera + model pose at a specific section anchor. */
export interface Pose {
  camPos: [number, number, number];
  camTarget: [number, number, number];
  fov: number;
  modelRotationY: number;
  modelPositionY: number;
  canvasOpacity: number;
}

/**
 * Section-anchored keyframes.
 *
 * Poses ordered by scroll progression (hero → contact).
 * Each camera is tuned for the Huracán's proportions after normalization
 * (~4.5 units long, centred at origin, facing roughly +Z).
 */
export const sectionPoses: Pose[] = [
  {
    // Hero — cinematic 3/4 front-right, car fills right half of viewport
    camPos: [4.8, 2.2, -4.2],
    camTarget: [0, 0.5, 0],
    fov: 38,
    modelRotationY: -0.35,
    modelPositionY: 0,
    canvasOpacity: 1,
  },
  {
    // Selected Work — low side profile, car shifts left, content reads right
    camPos: [5.5, 1.4, 0.3],
    camTarget: [-0.6, 0.6, 0],
    fov: 40,
    modelRotationY: -Math.PI / 2,
    modelPositionY: 0,
    canvasOpacity: 0.18,
  },
  {
    // Skills — elevated oblique, subtle presence behind tech list
    camPos: [2.2, 4.8, 3.2],
    camTarget: [0, 0.3, 0],
    fov: 42,
    modelRotationY: Math.PI / 6,
    modelPositionY: -0.1,
    canvasOpacity: 0.15,
  },
  {
    // Certificates — rear 3/4 view, elegant departure
    camPos: [-4, 2.4, 3.8],
    camTarget: [0, 0.5, 0],
    fov: 40,
    modelRotationY: Math.PI + 0.4,
    modelPositionY: 0,
    canvasOpacity: 0.2,
  },
  {
    // About — dramatic low-front pull
    camPos: [2.4, 0.9, -5.2],
    camTarget: [0, 0.8, 0],
    fov: 36,
    modelRotationY: 0.15,
    modelPositionY: 0,
    canvasOpacity: 0.25,
  },
  {
    // Contact — refined full-vehicle pullback, final statement
    camPos: [3.5, 2.8, 5.5],
    camTarget: [0, 0.5, 0],
    fov: 40,
    modelRotationY: -Math.PI / 3,
    modelPositionY: 0,
    canvasOpacity: 0.3,
  },
];

// ---------- interpolation helpers ----------

const _vA = new THREE.Vector3();
const _vB = new THREE.Vector3();

/** Smooth-step (0→1 acceleration, 1→2 deceleration) for organic feel. */
export function smoothstep(t: number): number {
  const c = THREE.MathUtils.clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

/** Find which two poses we're between and the fractional blend. */
export function getBlendedPose(
  scrollProgress: number, // 0..1 over full document
  sectionTops: readonly number[], // cumulative pixel offsets per section
  totalHeight: number,
  out: {
    camPos: THREE.Vector3;
    camTarget: THREE.Vector3;
    fov: number;
    modelRotationY: number;
    modelPositionY: number;
    canvasOpacity: number;
  },
) {
  const scrollY = scrollProgress * totalHeight;

  // Map pixel position to pose index.
  let idx = 0;
  for (let i = 0; i < sectionTops.length - 1; i++) {
    if (scrollY >= sectionTops[i]) idx = i;
  }
  idx = Math.min(idx, sectionPoses.length - 2);

  const topA = sectionTops[idx] ?? 0;
  const topB = sectionTops[Math.min(idx + 1, sectionTops.length - 1)] ?? totalHeight;
  const span = Math.max(topB - topA, 1);
  const t = smoothstep((scrollY - topA) / span);

  const a = sectionPoses[idx];
  const b = sectionPoses[Math.min(idx + 1, sectionPoses.length - 1)];

  _vA.set(...a.camPos);
  _vB.set(...b.camPos);
  out.camPos.lerpVectors(_vA, _vB, t);

  _vA.set(...a.camTarget);
  _vB.set(...b.camTarget);
  out.camTarget.lerpVectors(_vA, _vB, t);

  out.fov = THREE.MathUtils.lerp(a.fov, b.fov, t);
  out.modelRotationY = THREE.MathUtils.lerp(a.modelRotationY, b.modelRotationY, t);
  out.modelPositionY = THREE.MathUtils.lerp(a.modelPositionY, b.modelPositionY, t);
  out.canvasOpacity = THREE.MathUtils.lerp(a.canvasOpacity, b.canvasOpacity, t);
}

// ---------- responsive helpers ----------

/** Scale camera distance for narrow viewports (avoids clipping on mobile). */
export function mobileCameraScale(viewportWidth: number): number {
  if (viewportWidth < 480) return 1.35;
  if (viewportWidth < 768) return 1.15;
  return 1;
}
