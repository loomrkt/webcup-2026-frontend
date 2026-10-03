"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars } from "@react-three/drei";
import * as THREE from "three";

const ACCENT = "#8b6cff";
const ACCENT_BRIGHT = "#c3b0ff";
const PLANET = "#151233";
const PLANET_EMISSIVE = "#2a1f6e";

const CANVAS_GL = { antialias: true, alpha: true };
const CANVAS_DPR = [1, 2];
const CANVAS_CAMERA = { position: [0, 0, 6], fov: 42 };
const ATMOSPHERE_COLOR = new THREE.Color(ACCENT);
const ATMOSPHERE_UNIFORMS = { uColor: { value: ATMOSPHERE_COLOR } };

const atmosphereVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
    gl_FragColor = vec4(uColor, 1.0) * intensity;
  }
`;

function seededRandom(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function useCityLights(count: number, radius: number) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      positions[i * 3] = Math.cos(theta) * r * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(theta) * r * radius;
    }
    return positions;
  }, [count, radius]);
}

function useRingPoints(count: number, inner: number, outer: number) {
  return useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = seededRandom(i) * Math.PI * 2;
      const radius = inner + seededRandom(i + count) * (outer - inner);
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (seededRandom(i + count * 2) - 0.5) * 0.05;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, [count, inner, outer]);
}

function Planet() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Points>(null);
  const cityPositions = useCityLights(420, 1.02);
  const ringPositions = useRingPoints(1500, 1.8, 2.7);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.06;
    if (ring.current) ring.current.rotation.y += delta * 0.022;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1, 64]} />
        <MeshDistortMaterial
          color={PLANET}
          emissive={PLANET_EMISSIVE}
          emissiveIntensity={0.55}
          roughness={0.6}
          metalness={0.25}
          distort={0.32}
          speed={1.4}
        />
      </mesh>

      <mesh scale={1.22}>
        <icosahedronGeometry args={[1, 32]} />
        <shaderMaterial
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={ATMOSPHERE_UNIFORMS}
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
        />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cityPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={ACCENT_BRIGHT}
          size={0.02}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh rotation={[Math.PI / 2.4, 0, 0.35]}>
        <torusGeometry args={[2.1, 0.006, 8, 160]} />
        <meshBasicMaterial
          color={ACCENT}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <points ref={ring}>
        <bufferGeometry>
          <bufferAttribute args={[ringPositions, 3]} attach="attributes-position" />
        </bufferGeometry>
        <pointsMaterial
          color={ACCENT}
          size={0.013}
          sizeAttenuation
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function SceneRig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  useFrame(() => {
    if (!ref.current) return;
    const target = THREE.MathUtils.clamp(viewport.width / 11, 0.55, 1.05);
    const current = ref.current.scale.x;
    ref.current.scale.setScalar(current + (target - current) * 0.08);
  });

  return (
    <group ref={ref} position={[0, -0.3, 0]}>
      {children}
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={CANVAS_DPR}
      gl={CANVAS_GL}
      camera={CANVAS_CAMERA}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 3, 5]} intensity={1.4} color={ACCENT_BRIGHT} />
      <pointLight position={[-4, -2, -4]} intensity={0.6} color={ACCENT} />

      <Stars
        radius={40}
        depth={40}
        count={2600}
        factor={4}
        saturation={0}
        fade
        speed={0.6}
      />

      <SceneRig>
        <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.6}>
          <Planet />
        </Float>
      </SceneRig>
    </Canvas>
  );
}
