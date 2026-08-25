"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { getBlendedPose, mobileCameraScale } from "./huracanPoses";

const GLB_PATH = "/models/huracan.glb";

interface HuracanModelProps {
  sectionTops: readonly number[];
  reducedMotion: boolean;
}

/**
 * Loads + normalises the Huracán GLB and applies scroll-driven camera + model
 * transforms every frame.
 */
export default function HuracanModel({
  sectionTops,
  reducedMotion,
}: HuracanModelProps) {
  const groupRef = useRef<THREE.Group>(null!);

  // Camera rig refs — damp toward target each frame.
  const camPosRef = useRef(new THREE.Vector3(4.8, 2.2, -4.2));
  const camTargetRef = useRef(new THREE.Vector3(0, 0.5, 0));
  const camFovRef = useRef(38);
  const modelRotYRef = useRef(0);
  const modelPosYRef = useRef(0);

  const { camera, invalidate, size } = useThree();
  const perspective = camera as THREE.PerspectiveCamera;
  const mobileScale = mobileCameraScale(size.width);

  const { scene } = useGLTF(GLB_PATH, false, true);

  // ── normalise once on mount ────────────────────────────────────────────
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const span = box.getSize(new THREE.Vector3());
    const longest = Math.max(span.x, span.y, span.z);
    if (longest === 0) return;

    const TARGET_LENGTH = 4.5;
    const s = TARGET_LENGTH / longest;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.computeBoundingBox();
      }
    });

    const normaliser = new THREE.Group();
    normaliser.name = "__huracan_normalised";
    normaliser.add(scene);
    normaliser.position.set(-center.x, -center.y, -center.z);
    normaliser.scale.setScalar(s);
    groupRef.current.add(normaliser);
    const g = groupRef.current;

    return () => {
      g.remove(normaliser);
      normaliser.remove(scene);
    };
  }, [scene]);

  // ── render loop — scroll-driven poses ──────────────────────────────────
  // Camera mutation inside useFrame is the standard R3F pattern for
  // imperative camera control — the linter rule is overly conservative here.
  // eslint-disable-next-line react-hooks/immutability
  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const totalHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;
    const progress =
      totalHeight > 0
        ? THREE.MathUtils.clamp(window.scrollY / totalHeight, 0, 1)
        : 0;

    // Target pose from scroll position.
    const target = {
      camPos: new THREE.Vector3(),
      camTarget: new THREE.Vector3(),
      fov: 38,
      modelRotationY: 0,
      modelPositionY: 0,
      canvasOpacity: 1,
    };
    getBlendedPose(progress, sectionTops, totalHeight, target);

    // Apply mobile scaling.
    target.camPos.multiplyScalar(mobileScale);

    if (reducedMotion) {
      camPosRef.current.copy(target.camPos);
      camTargetRef.current.copy(target.camTarget);
      camFovRef.current = target.fov;
      modelRotYRef.current = target.modelRotationY;
      modelPosYRef.current = target.modelPositionY;
    } else {
      const k = Math.min(1, delta * 3.2);
      camPosRef.current.lerp(target.camPos, k);
      camTargetRef.current.lerp(target.camTarget, k);
      camFovRef.current = THREE.MathUtils.lerp(camFovRef.current, target.fov, k);
      modelRotYRef.current = THREE.MathUtils.lerp(
        modelRotYRef.current,
        target.modelRotationY,
        k,
      );
      modelPosYRef.current = THREE.MathUtils.lerp(
        modelPosYRef.current,
        target.modelPositionY,
        k,
      );
    }

    // Apply camera.
    perspective.position.copy(camPosRef.current);
    perspective.lookAt(camTargetRef.current);
    // eslint-disable-next-line react-hooks/immutability
    perspective.fov = camFovRef.current;
    perspective.updateProjectionMatrix();

    // Apply model transform.
    g.rotation.y = modelRotYRef.current;
    g.position.y = modelPosYRef.current;

    // Canvas opacity — direct style mutation, no React re-render.
    const canvas = document.querySelector<HTMLElement>(
      "[data-huracan-canvas]",
    );
    if (canvas) {
      canvas.style.opacity = String(
        reducedMotion
          ? target.canvasOpacity
          : THREE.MathUtils.lerp(
              parseFloat(canvas.style.opacity || "1"),
              target.canvasOpacity,
              Math.min(1, delta * 4),
            ),
      );
    }

    // Keep rendering while pose is settling.
    if (!reducedMotion) invalidate();
  });

  return <group ref={groupRef} />;
}

useGLTF.preload(GLB_PATH, false, true);
