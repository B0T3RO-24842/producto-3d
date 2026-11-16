"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ColorOption, SizeOption } from "@/lib/product";

const H = 2.18; // body height at 500 ml
const damp = THREE.MathUtils.damp;

// Side profile revolved into the body: flat base, rounded edge, soft shoulder, neck.
function bodyProfile() {
  const p = new THREE.Path();
  p.moveTo(0, 0);
  p.lineTo(0.54, 0);
  p.quadraticCurveTo(0.6, 0, 0.6, 0.06);
  p.lineTo(0.6, 1.58);
  p.bezierCurveTo(0.6, 1.9, 0.33, 1.9, 0.33, 2.08);
  p.lineTo(0.33, H);
  return p.getPoints(28);
}

// Logo drawn on a canvas so nothing is downloaded at runtime.
function logoTexture() {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "700 112px system-ui, sans-serif";
  g.letterSpacing = "28px";
  for (const x of [512, 1536]) g.fillText("TERMO X", x, 132); // front and back
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function Bottle({ color, size }: { color: ColorOption; size: SizeOption }) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const logo = useRef<THREE.Mesh>(null);
  const top = useRef<THREE.Group>(null);
  const paint = useRef<THREE.MeshPhysicalMaterial>(null);

  const profile = useMemo(bodyProfile, []);
  const logoMap = useMemo(logoTexture, []);
  const target = useMemo(() => new THREE.Color(color.hex), [color.hex]);

  // One full turn each time the colour changes.
  const spin = useRef(0);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) first.current = false;
    else spin.current += Math.PI * 2;
  }, [color.id]);

  useFrame((_, dt) => {
    paint.current?.color.lerp(target, 1 - Math.exp(-6 * dt));
    const r = root.current, b = body.current, l = logo.current, t = top.current;
    if (!r || !b || !l || !t) return;
    // Only the body stretches; cap and logo keep their proportions and ride on top.
    const sx = damp(b.scale.x, size.scale[0], 7, dt);
    const sy = damp(b.scale.y, size.scale[1], 7, dt);
    b.scale.set(sx, sy, sx);
    l.scale.set(sx, 1, sx);
    l.position.y = 0.95 * sy;
    t.scale.setScalar(sx);
    t.position.y = H * sy;
    r.rotation.y = damp(r.rotation.y, spin.current, 3.5, dt);
  });

  return (
    <group ref={root} position={[0, -1.5, 0]}>
      <mesh ref={body} castShadow receiveShadow>
        <latheGeometry args={[profile, 96]} />
        <meshPhysicalMaterial ref={paint} color={color.hex} metalness={0.15} roughness={0.42} clearcoat={0.6} clearcoatRoughness={0.35} />
      </mesh>

      <mesh ref={logo} position={[0, 0.95, 0]}>
        <cylinderGeometry args={[0.603, 0.603, 0.474, 96, 1, true]} />
        <meshStandardMaterial map={logoMap} transparent depthWrite={false} metalness={0.6} roughness={0.35} />
      </mesh>

      <group ref={top} position={[0, H, 0]}>
        {/* steel collar */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.345, 0.345, 0.1, 64]} />
          <meshStandardMaterial color="#cfd3d8" metalness={1} roughness={0.22} />
        </mesh>
        {/* cap */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.37, 0.39, 0.34, 64]} />
          <meshStandardMaterial color="#141518" metalness={0.1} roughness={0.55} />
        </mesh>
        {/* carry loop */}
        <mesh position={[0, 0.41, 0]} castShadow>
          <torusGeometry args={[0.2, 0.04, 16, 48, Math.PI]} />
          <meshStandardMaterial color="#141518" metalness={0.1} roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}
