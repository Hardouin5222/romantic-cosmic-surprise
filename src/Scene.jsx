import { Canvas, useFrame } from '@react-three/fiber';
import { Cloud, Float, Html, Sparkles, Stars } from '@react-three/drei';
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const GOLD = '#FFD700';
const BLUE = '#10265f';

const nodeData = [
  { id: 'path', label: 'Путь любви', pos: [-2.05, 0.35, 0] },
  { id: 'fire', label: 'Огонь любви', pos: [0, -0.15, -0.35] },
  { id: 'names', label: 'Имена любви', pos: [2.05, 0.35, 0] }
];

function CameraRig({ started }) {
  useFrame((state) => {
    const target = started ? new THREE.Vector3(0, 0.08, 4.35) : new THREE.Vector3(0, 0.05, 6.8);
    state.camera.position.lerp(target, 0.028);
    state.camera.lookAt(0, 0, -1.2);
  });
  return null;
}

function NebulaClouds() {
  const group = useRef();
  useFrame(({ clock }) => {
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.08) * 0.08;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <group ref={group} position={[0, 0, -4.6]}>
      <Cloud opacity={0.23} speed={0.08} width={8.8} depth={2.7} segments={30} color="#1d4ed8" position={[-1.3, 0.35, 0]} />
      <Cloud opacity={0.18} speed={0.06} width={7.5} depth={2.2} segments={25} color="#60a5fa" position={[1.2, -0.55, -0.2]} />
      <Cloud opacity={0.10} speed={0.04} width={9.6} depth={1.8} segments={22} color="#0f172a" position={[0, 0.2, 0.5]} />
    </group>
  );
}

function ShootingStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        delay: i * 2.7,
        y: 1.8 - i * 0.7,
        z: -2.4 - i * 0.4,
        speed: 0.55 + i * 0.12
      })),
    []
  );
  return stars.map((s, i) => <ShootingStar key={i} {...s} />);
}

function ShootingStar({ delay, y, z, speed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * speed + delay) % 7;
    ref.current.position.x = 4.2 - t * 1.35;
    ref.current.position.y = y - t * 0.32;
    ref.current.material.opacity = t > 0.4 && t < 2.4 ? 0.5 : 0;
  });
  return (
    <mesh ref={ref} position={[3.8, y, z]} rotation={[0, 0, -0.28]}>
      <planeGeometry args={[1.25, 0.015]} />
      <meshBasicMaterial color={GOLD} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function PremiumNode({ node, activePanel, setActivePanel }) {
  const mesh = useRef();
  const halo = useRef();
  const [hovered, setHovered] = useState(false);
  const active = activePanel === node.id;

  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.2) * 0.045;
    const target = hovered || active ? 1.22 : 1;
    mesh.current.scale.setScalar(THREE.MathUtils.lerp(mesh.current.scale.x, target * pulse, 0.08));
    halo.current.material.opacity = THREE.MathUtils.lerp(halo.current.material.opacity, hovered || active ? 0.24 : 0.11, 0.08);
  });

  return (
    <Float speed={1.15} rotationIntensity={0.25} floatIntensity={0.45}>
      <group position={node.pos}>
        <mesh
          ref={mesh}
          onClick={(e) => {
            e.stopPropagation();
            setActivePanel(node.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'default';
          }}
        >
          <sphereGeometry args={[0.23, 64, 64]} />
          <meshPhysicalMaterial
            color="#fff1b8"
            emissive={GOLD}
            emissiveIntensity={hovered || active ? 2.5 : 1.35}
            roughness={0.08}
            metalness={0.1}
            transmission={0.35}
            thickness={0.45}
            clearcoat={1}
          />
        </mesh>
        <mesh ref={halo}>
          <sphereGeometry args={[0.52, 64, 64]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.11} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <pointLight color={GOLD} intensity={hovered || active ? 2.2 : 1.1} distance={3} />
        <Html center distanceFactor={7.7}>
          <div className="node-label">{node.label}</div>
        </Html>
      </group>
    </Float>
  );
}

function World({ started, activePanel, setActivePanel }) {
  return (
    <>
      <color attach="background" args={['#020817']} />
      <fog attach="fog" args={['#020817', 5, 12]} />
      <ambientLight intensity={0.28} />
      <pointLight position={[0, 1.6, 3]} intensity={1.4} color={GOLD} />
      <pointLight position={[-3.3, -1.2, -2.6]} intensity={2.4} color={BLUE} />
      <CameraRig started={started} />
      <NebulaClouds />
      <Stars radius={95} depth={45} count={2500} factor={3.8} saturation={0.35} fade speed={0.18} />
      <Sparkles count={210} scale={[7.5, 4.5, 4]} size={2.8} speed={0.22} color={GOLD} opacity={0.7} />
      <ShootingStars />
      {started && nodeData.map((node) => <PremiumNode key={node.id} node={node} activePanel={activePanel} setActivePanel={setActivePanel} />)}
      <EffectComposer>
        <Bloom intensity={1.35} luminanceThreshold={0.12} luminanceSmoothing={0.65} mipmapBlur />
        <DepthOfField focusDistance={0.032} focalLength={0.05} bokehScale={3.6} />
        <Noise opacity={0.035} />
        <Vignette offset={0.28} darkness={0.78} />
      </EffectComposer>
    </>
  );
}

export default function Scene({ started, activePanel, setActivePanel }) {
  return (
    <Canvas
      camera={{ position: [0, 0.05, 6.8], fov: 42 }}
      dpr={[1, 1.65]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onPointerMissed={() => setActivePanel(null)}
    >
      <World started={started} activePanel={activePanel} setActivePanel={setActivePanel} />
    </Canvas>
  );
}
