import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Sparkles, Stars, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

const nodes = [
  { id: 'path', label: 'I', sub: 'Путь любви', position: [-1.9, 0.58, 0.1] },
  { id: 'fire', label: 'II', sub: 'Огонь сердца', position: [0, -0.28, -0.2] },
  { id: 'stars', label: 'III', sub: 'Звёздные слова', position: [1.9, 0.56, 0.1] }
];

function CameraRig({ started }) {
  useFrame((state) => {
    const z = started ? 4.7 : 6.1;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, z, 0.02);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(state.clock.elapsedTime * 0.13) * 0.08, 0.02);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, Math.cos(state.clock.elapsedTime * 0.11) * 0.06, 0.02);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Nebula() {
  const group = useRef();
  useFrame(({ clock }) => {
    group.current.rotation.z = clock.elapsedTime * 0.006;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.09;
  });
  return (
    <group ref={group} position={[0, 0, -4.8]}>
      <Cloud opacity={0.2} speed={0.08} width={10} depth={2.6} segments={28} color="#123c8c" />
      <Cloud opacity={0.12} speed={0.05} width={7} depth={2.4} segments={24} color="#6bb7ff" position={[1.4, -0.55, -0.3]} />
      <Cloud opacity={0.08} speed={0.06} width={6} depth={2.4} segments={18} color="#ffd36a" position={[-1.8, 0.6, -0.6]} />
    </group>
  );
}

function BokehLights() {
  const points = useMemo(() => Array.from({ length: 18 }, (_, i) => ({
    key: i,
    position: [(Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4.2, -1.2 - Math.random() * 3],
    scale: 0.03 + Math.random() * 0.08
  })), []);
  return points.map((p) => (
    <mesh key={p.key} position={p.position} scale={p.scale}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial color="#ffd977" transparent opacity={0.25} blending={THREE.AdditiveBlending} />
    </mesh>
  ));
}

function ShootingStars() {
  const group = useRef();
  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * 0.18) % 1;
    group.current.position.x = THREE.MathUtils.lerp(4.8, -4.8, t);
    group.current.position.y = THREE.MathUtils.lerp(2.4, 0.4, t);
    group.current.children.forEach((m) => { m.material.opacity = t < 0.08 || t > 0.88 ? 0 : 0.55; });
  });
  return (
    <group ref={group} rotation={[0, 0, -0.28]}>
      <mesh>
        <planeGeometry args={[1.45, 0.012]} />
        <meshBasicMaterial color="#ffd56f" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function GlowNode({ node, activePanel, setActivePanel }) {
  const core = useRef();
  const halo = useRef();
  const [hovered, setHovered] = useState(false);
  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.7) * 0.035;
    const target = hovered || activePanel === node.id ? 1.22 : 1;
    core.current.scale.setScalar(THREE.MathUtils.lerp(core.current.scale.x, target * pulse, 0.08));
    halo.current.rotation.z += 0.006;
  });
  return (
    <Float speed={0.9} rotationIntensity={0.3} floatIntensity={0.45}>
      <group position={node.position}>
        <mesh
          ref={core}
          onClick={(e) => { e.stopPropagation(); setActivePanel(node.id); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
        >
          <sphereGeometry args={[0.18, 48, 48]} />
          <meshStandardMaterial color="#fff0a6" emissive="#ffd700" emissiveIntensity={hovered ? 2.2 : 1.35} roughness={0.12} metalness={0.15} />
        </mesh>
        <mesh ref={halo}>
          <torusGeometry args={[0.32, 0.006, 12, 100]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.38} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.43, 48, 48]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={hovered ? 0.13 : 0.07} blending={THREE.AdditiveBlending} />
        </mesh>
        <Html center distanceFactor={8}>
          <div className="node-label">
            <b>{node.label}</b><span>{node.sub}</span>
          </div>
        </Html>
      </group>
    </Float>
  );
}

function World(props) {
  return (
    <>
      <color attach="background" args={["#020817"]} />
      <fog attach="fog" args={["#020817", 5, 14]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 1.5, 3.2]} intensity={1.6} color="#ffd700" />
      <pointLight position={[-3, -1.5, -2]} intensity={2.2} color="#1e66ff" />
      <CameraRig started={props.started} />
      <Nebula />
      <Stars radius={85} depth={48} count={2600} factor={3.6} saturation={0} fade speed={0.22} />
      <Sparkles count={180} scale={[7.5, 4.4, 4.2]} size={3.2} speed={0.13} color="#FFD700" opacity={0.5} />
      <BokehLights />
      <ShootingStars />
      {props.started && nodes.map((node) => <GlowNode key={node.id} node={node} {...props} />)}
      <EffectComposer multisampling={0}>
        <Bloom intensity={1.25} luminanceThreshold={0.18} luminanceSmoothing={0.75} mipmapBlur />
        <DepthOfField focusDistance={0.02} focalLength={0.035} bokehScale={2.3} />
        <Vignette offset={0.18} darkness={0.78} />
      </EffectComposer>
    </>
  );
}

export default function Scene({ started, activePanel, setActivePanel }) {
  return (
    <Canvas camera={{ position: [0, 0, 6.1], fov: 42 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }} onPointerMissed={() => setActivePanel(null)}>
      <World started={started} activePanel={activePanel} setActivePanel={setActivePanel} />
    </Canvas>
  );
}
