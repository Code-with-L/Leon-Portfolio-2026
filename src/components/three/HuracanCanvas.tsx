"use client";

import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import HuracanModel from "./HuracanModel";

interface HuracanCanvasProps {
  sectionTops: readonly number[];
  reducedMotion: boolean;
}

/**
 * Keep the still frame correct when demand-mode is active and the window
 * resizes (camera aspect / projection changes).
 */
function ResizeInvalidator() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const onResize = () => invalidate();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [invalidate]);
  return null;
}

/**
 * Procedural studio environment — RoomEnvironment → PMREMGenerator.
 * Fully local, no HDRI, no CDN, no network.
 */
function ProceduralEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04);
    room.dispose?.();
    // eslint-disable-next-line react-hooks/immutability
    scene.environment = envMap.texture;
    scene.environmentIntensity = 0.4;
    return () => {
      envMap.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}

/**
 * Fixed-viewport R3F layer for the Huracán.
 *
 * Transparent canvas (alpha) so page background shows through.
 * frameloop "always" — the model component uses useFrame for damping and
 * calls invalidate() to schedule frames only when the pose is settling.
 * When fully still, no frames render (demand semantics via manual invalidation).
 */
export default function HuracanCanvas({
  sectionTops,
  reducedMotion,
}: HuracanCanvasProps) {
  return (
    <div
      data-huracan-canvas
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -10 }}
    >
      <Canvas
        camera={{ position: [4.8, 2.2, -4.2], fov: 38, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        frameloop="always"
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ pointerEvents: "none" }}
      >
        {/* Studio lighting — key + fill + rim */}
        <hemisphereLight args={["#e8eaef", "#0b0b0d", 0.5]} />
        <directionalLight position={[5, 7, 4]} intensity={1.5} color="#fff8e8" />
        <directionalLight
          position={[-4, 3, -5]}
          intensity={0.7}
          color="#c0d8f0"
        />

        <Suspense fallback={null}>
          <HuracanModel
            sectionTops={sectionTops}
            reducedMotion={reducedMotion}
          />
        </Suspense>

        <ProceduralEnvironment />
        <ResizeInvalidator />
      </Canvas>
    </div>
  );
}
