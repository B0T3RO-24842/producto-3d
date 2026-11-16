"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";
import { Bottle } from "./Bottle";
import type { ColorOption, SizeOption } from "@/lib/product";

// Radial alpha: opaque under the bottle, transparent at the rim.
function fadeTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, "#fff");
  r.addColorStop(0.35, "#bbb");
  r.addColorStop(1, "#000");
  g.fillStyle = r;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export default function ProductViewer({ color, size }: { color: ColorOption; size: SizeOption }) {
  // This file only loads in the browser (dynamic import, ssr: false).
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fade = useMemo(fadeTexture, []);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 2, 8.6], fov: 30 }}
      role="img"
      aria-label={`Termo X ${size.label} color ${color.label} en 3D`}
      fallback={<p className="grid h-full place-items-center p-6 text-center text-sm opacity-70">Tu navegador no puede mostrar el modelo 3D.</p>}
    >
      <ambientLight intensity={0.3} />
      {/* Two lamps fixed in the room: as the view orbits, their shadows sweep around the bottle. */}
      <directionalLight castShadow position={[4, 6, 3]} intensity={1.6} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} shadow-normalBias={0.02} shadow-radius={6} />
      <directionalLight castShadow position={[-5, 4, -2]} intensity={0.6} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} shadow-normalBias={0.02} shadow-radius={10} />
      {/* procedural studio lighting: no HDR download at runtime */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 5, 2]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={3} position={[-5, 1, 1]} scale={[2, 7, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[5, 1, -1]} scale={[2, 7, 1]} />
        <Lightformer form="ring" intensity={2} position={[0, 1, 6]} scale={3} />
      </Environment>
      <Bottle color={color} size={size} />
      {/* Lit floor disc so the shadows have something to fall on; it fades out into the page. */}
      <mesh receiveShadow rotation-x={-Math.PI / 2} position-y={-1.5}>
        <circleGeometry args={[4.5, 64]} />
        <meshStandardMaterial color="#3a3d44" roughness={0.9} alphaMap={fade} transparent depthWrite={false} />
      </mesh>
      <OrbitControls
        target={[0, 0.15, 0]}
        enableZoom={false}
        enablePan={false}
        autoRotate={!still}
        autoRotateSpeed={1.6}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  );
}
