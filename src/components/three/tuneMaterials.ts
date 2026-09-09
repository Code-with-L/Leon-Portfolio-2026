import * as THREE from "three";

/**
 * Tune materials after GLB load to give the Huracán a premium
 * showroom-paint appearance. Classification is heuristic:
 *   - emissive materials → headlights / DRLs / taillights
 *   - transparent / alpha materials → glass
 *   - everything else → body paint / trim
 */
export function tuneMaterials(scene: THREE.Object3D) {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const mats = Array.isArray(child.material)
      ? child.material
      : [child.material];

    for (const m of mats) {
      if (!(m instanceof THREE.MeshStandardMaterial)) continue;

      const isEmissive =
        m.emissiveIntensity > 0 &&
        (m.emissive.r > 0.05 || m.emissive.g > 0.05 || m.emissive.b > 0.05);
      const isGlass = m.transparent || m.opacity < 0.9;

      if (isGlass) {
        m.metalness = 0;
        m.metalnessMap = null;
        m.roughness = 0.05;
        m.roughnessMap = null;
        m.envMapIntensity = 2.0;
      } else if (isEmissive) {
        m.envMapIntensity = 1.5;
      } else {
        m.metalnessMap = null;
        m.roughnessMap = null;
        m.metalness = 0.85;
        m.roughness = 0.15;
        m.envMapIntensity = 1.6;
      }
      m.needsUpdate = true;
    }
  });
}
