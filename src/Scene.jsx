import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Stars, Cloud, Float, Html } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import { useRef, useState } from "react";
import * as THREE from "three";

const nodes = [
  { id: "path", label: "Душа", position: [-2.2, 0.4, 0] },
  { id: "fire", label: "Любовь", position: [0, -0.35, -0.4] },
  { id: "stars", label: "Вечность", position: [2.2, 0.45, 0] },
];

function CameraRig({ started }) {
  useFrame((state) => {
    const targetZ = started ? 4.6 : 6.2;
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      targetZ,
      0.025
    );
  });

  return null;
}

function Nebula() {
  const group = useRef();

  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.z = clock.elapsedTime * 0.015;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.12) * 0.08;
  });

  return (
    <group ref={group} position={[0, 0, -5]}>
      <Cloud
        opacity={0.18}
        speed={0.12}
        width={9}
        depth={2}
        segments={28}
        color="#1d4ed8"
      />
      <Cloud
        opacity={0.12}
        speed={0.08}
        width={7}
        depth={2}
        segments={22}
        color="#60a5fa"
        position={[1.5, -0.7, -0.4]}
      />
    </group>
  );
}

function ShootingStar() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (clock.elapsedTime * 0.32) % 7;
    ref.current.position.x = 4 - t * 1.6;
    ref.current.position.y = 2.4 - t * 0.45;
    ref.current.material.opacity = t < 1 || t > 6 ? 0 : 0.55;
  });

  return (
    <mesh ref={ref} position={[4, 2.4, -2]} rotation={[0, 0, -0.35]}>
      <planeGeometry args={[1.4, 0.012]} />
      <meshBasicMaterial
        color="#ffd166"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function GlowNode({ node, activePanel, setActivePanel }) {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const base = hovered || activePanel === node.id ? 1.25 : 1;
    ref.current.scale.setScalar(
      THREE.MathUtils.lerp(
        ref.current.scale.x,
        base + Math.sin(clock.elapsedTime * 2) * 0.035,
        0.08
      )
    );
  });

  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.35}>
      <group position={node.position}>
        <mesh
          ref={ref}
          onClick={(e) => {
            e.stopPropagation();
            setActivePanel(node.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "default";
          }}
        >
          <sphereGeometry args={[0.16, 48, 48]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={hovered ? 2.2 : 1.25}
            roughness={0.18}
            metalness={0.25}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[0.34, 48, 48]} />
          <meshBasicMaterial
            color="#ffd700"
            transparent
            opacity={hovered ? 0.16 : 0.08}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <Html center distanceFactor={8}>
          <div className="pointer-events-none mt-16 whitespace-nowrap rounded-full border border-amber-200/20 bg-white/5 px-3 py-1 text-[11px] tracking-[0.35em] text-amber-100/80 backdrop-blur-md">
            {node.label}
          </div>
        </Html>
      </group>
    </Float>
  );
}

function World({ started, activePanel, setActivePanel }) {
  return (
    <>
      <color attach="background" args={["#020817"]} />

      <ambientLight intensity={0.35} />
      <pointLight position={[0, 1.5, 3]} intensity={1.2} color="#ffd700" />
      <pointLight position={[-3, -2, -3]} intensity={1.6} color="#1e40af" />

      <CameraRig started={started} />
      <Nebula />

      <Stars
        radius={80}
        depth={45}
        count={2200}
        factor={3.2}
        saturation={0}
        fade
        speed={0.25}
      />

      <Sparkles
        count={120}
        scale={[7, 4, 4]}
        size={2.8}
        speed={0.18}
        color="#ffd700"
        opacity={0.55}
      />

      <ShootingStar />

      {started &&
        nodes.map((node) => (
          <GlowNode
            key={node.id}
            node={node}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          />
        ))}

      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.18} luminanceSmoothing={0.8} />
        <DepthOfField focusDistance={0.025} focalLength={0.035} bokehScale={2.5} />
        <Vignette eskil={false} offset={0.25} darkness={0.75} />
      </EffectComposer>
    </>
  );
}

export default function Scene({ started, activePanel, setActivePanel }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      dpr={[1, 1.7]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onPointerMissed={() => setActivePanel(null)}
    >
      <World
        started={started}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />
    </Canvas>
  );
}
