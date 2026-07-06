import * as THREE from "three";

/**
 * Procedural placeholder frame — stands in for a real branded .glb model.
 * Built in the same rough scale as MediaPipe's canonical face model, so it
 * roughly lines up with the tracked facial transformation matrix out of the box.
 */
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
    thickness: 0.02,
  });

  const lensRadius = 0.19;
  const lensSeparation = 0.42;

  const ringGeometry = new THREE.TorusGeometry(lensRadius, 0.014, 12, 32);
  const lensGeometry = new THREE.CircleGeometry(lensRadius - 0.01, 32);

  for (const side of [-1, 1]) {
    const ring = new THREE.Mesh(ringGeometry, frameMaterial);
    ring.position.set((lensSeparation / 2) * side, 0, 0);
    group.add(ring);

    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.position.set((lensSeparation / 2) * side, 0, 0.006);
    group.add(lens);
  }

  const bridgeGeometry = new THREE.CylinderGeometry(
    0.012,
    0.012,
    lensSeparation - lensRadius * 2 + 0.03,
    8,
  );
  const bridge = new THREE.Mesh(bridgeGeometry, frameMaterial);
  bridge.rotation.z = Math.PI / 2;
  bridge.position.set(0, 0.025, 0.01);
  group.add(bridge);

  const templeGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.55, 8);
  for (const side of [-1, 1]) {
    const temple = new THREE.Mesh(templeGeometry, frameMaterial);
    temple.rotation.x = Math.PI / 2;
    temple.position.set(
      (lensSeparation / 2 + lensRadius - 0.02) * side,
      0,
      -0.29,
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
