import * as THREE from "three";

/**
 * Procedural placeholder frame — stands in for a real branded .glb model.
 * Built in millimeter-ish units matching real-world facial anatomy, so the
 * try-on component can scale it by a single anatomical measurement:
 *  - LENS_SEPARATION (~63mm): center-to-center distance between the two
 *    lenses, aligned with the average human pupil-to-pupil distance. The
 *    component scales the frame so this maps to the wearer's *measured*
 *    pupil distance each frame — which pins the lens centers onto the
 *    pupils and makes the fit scale naturally with any face size.
 * The lens radius is then a realistic proportion of that, so the lenses
 * frame the eyes the way real glasses do.
 * See the auto-fit logic in virtual-try-on.tsx.
 */
const LENS_RADIUS = 19;
export const LENS_SEPARATION = 63;

export function buildGlassesModel(color: string) {
  const group = new THREE.Group();
  group.name = "glasses-model";

  const frameMaterial = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.35,
    metalness: 0.2,
  });
  const lensMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a0a,
    transparent: true,
    opacity: 0.22,
    roughness: 0.05,
    transmission: 0.55,
    thickness: 3,
  });

  const lensRadius = LENS_RADIUS;
  const lensSeparation = LENS_SEPARATION;

  const ringGeometry = new THREE.TorusGeometry(lensRadius, 2.1, 12, 32);
  const lensGeometry = new THREE.CircleGeometry(lensRadius - 1.5, 32);

  for (const side of [-1, 1]) {
    const ring = new THREE.Mesh(ringGeometry, frameMaterial);
    ring.position.set((lensSeparation / 2) * side, 0, 0);
    group.add(ring);

    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.position.set((lensSeparation / 2) * side, 0, 0.9);
    group.add(lens);
  }

  const bridgeGeometry = new THREE.CylinderGeometry(
    1.8,
    1.8,
    lensSeparation - lensRadius * 2 + 4.5,
    8,
  );
  const bridge = new THREE.Mesh(bridgeGeometry, frameMaterial);
  bridge.rotation.z = Math.PI / 2;
  bridge.position.set(0, 3.75, 1.5);
  group.add(bridge);

  const templeGeometry = new THREE.CylinderGeometry(1.5, 1.5, 82.5, 8);
  for (const side of [-1, 1]) {
    const temple = new THREE.Mesh(templeGeometry, frameMaterial);
    temple.rotation.x = Math.PI / 2;
    temple.position.set(
      (lensSeparation / 2 + lensRadius - 3) * side,
      0,
      -43.5,
    );
    group.add(temple);
  }

  return group;
}

export const FRAME_COLORS = [
  { name: "Tortoise", value: "#5c4530" },
  { name: "Black", value: "#1a1a1a" },
  { name: "Clear rose", value: "#d8a7a1" },
  { name: "Navy", value: "#26344a" },
  { name: "Gold", value: "#b98a3d" },
] as const;
