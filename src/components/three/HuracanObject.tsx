"use client";

import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { tuneMaterials } from "./tuneMaterials";

export const GLB_PATH = "/models/huracan.glb";
export const CAR_LENGTH = 3.0;

/**
 * Reusable Huracán model: loads GLB, normalises scale, tunes materials,
 * and renders as a <group>.  No camera logic — consumers control the camera.
 */
export default function HuracanObject() {
  const groupRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF(GLB_PATH, false, true);

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const span = box.getSize(new THREE.Vector3());
    const longest = Math.max(span.x, span.y, span.z);
    if (longest === 0) return;

    const s = CAR_LENGTH / longest;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.computeBoundingBox();
      }
    });

    tuneMaterials(scene);

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

  return <group ref={groupRef} />;
}

useGLTF.preload(GLB_PATH, false, true);
