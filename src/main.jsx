import React, { Suspense, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Stars } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import * as THREE from 'three';
import { panels, starWords } from './data/loveTexts';
import './styles.css';

function Stardust() {
  const points = useRef();
  const particles = useMemo(() => {
    const count = 850;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.018;
    points.current.rotation.x += delta * 0.006;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#f5d78a" transparent opacity={0.78} depthWrite={false} />
    </points>
  );
}

function LightBeams() {
  const group = useRef();
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.z += delta * 0.012;
  });

  return (
    <group ref={group} position={[0, 0, -4]}>
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[(i - 2) * 1.6, -2.8 + i * 0.18, 0]} rotation={[0, 0, -0.33 + i * 0.08]}>
          <planeGeometry args={[0.08, 9]} />
          <meshBasicMaterial color="#d6b76b" transparent opacity={0.075} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function GlowingNode({ panel, position, onOpen, index }) {
  const mesh = useRef();
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.08);
  });

  return (
    <Float speed={1.1 + index * 0.1} rotationIntensity={0.25} floatIntensity={0.5}>
      <group position={position}>
        <mesh ref={mesh} onClick={() => onOpen(panel)}>
          <sphereGeometry args={[0.16, 32, 32]} />
          <meshStandardMaterial color="#ffd989" emissive="#d89d34" emissiveIntensity={1.6} roughness={0.18} metalness={0.1} transparent opacity={0.92} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.36, 32, 32]} />
          <meshBasicMaterial color="#ffd989" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <Html center distanceFactor={8} className="node-label-wrap">
          <button className="node-label" onClick={() => onOpen(panel)}>{panel.title}</button>
        </Html>
      </group>
    </Float>
  );
}

function Scene({ onOpen }) {
  const positions = [
    [-2.4, 1.8, 0], [2.25, 1.25, -0.2], [-1.9, -0.65, 0.15], [2.15, -1.55, 0],
    [0, 2.55, -0.4], [0.15, -2.35, 0.2], [-3.15, 0.15, -0.3], [3.2, 0.1, -0.15], [0, 0, 0.35]
  ];

  return (
    <>
      <color attach="background" args={["#030612"]} />
      <fog attach="fog" args={["#050814", 4, 15]} />
      <ambientLight intensity={0.65} />
      <pointLight position={[1, 2, 4]} color="#f6d38a" intensity={1.4} />
      <Stars radius={80} depth={35} count={1900} factor={4} saturation={0} fade speed={0.35} />
      <Stardust />
      <LightBeams />
      {panels.map((panel, i) => (
        <GlowingNode key={panel.id} panel={panel} index={i} position={positions[i]} onOpen={onOpen} />
      ))}
    </>
  );
}

function FloatingWords() {
  return (
    <div className="floating-words" aria-hidden="true">
      {starWords.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 12, scale: 0.86 }}
          animate={{ opacity: [0, 0.75, 0.22], y: [-4, -24, -54], scale: [0.85, 1, 0.9] }}
          transition={{ duration: 9 + (i % 7), delay: (i % 18) * 0.7, repeat: Infinity, repeatDelay: 2 }}
          style={{ left: `${4 + ((i * 23) % 88)}%`, top: `${8 + ((i * 37) % 78)}%` }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

function Intro({ onStart }) {
  return (
    <motion.div className="intro" initial={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(14px)' }} transition={{ duration: 1.1 }}>
      <div className="intro-orb" />
      <motion.div className="intro-card" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.1, ease: 'easeOut' }}>
        <p className="eyebrow">это не просто ссылка</p>
        <h1>Для тебя открывается маленькая вселенная</h1>
        <p>Коснись — и пусть всё начнётся тихо, как молитва сердца.</p>
        <button onClick={onStart}>Коснись моей души</button>
      </motion.div>
    </motion.div>
  );
}

function PoemPanel({ active, onClose }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div className="panel-layer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.article
            className="poem-panel"
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close" onClick={onClose}>×</button>
            <p className="panel-kicker">записка сердца</p>
            <h2>{active.title}</h2>
            <div className="panel-text">{active.text.split('\n').map((p, i) => <p key={i}>{p}</p>)}</div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  const [active, setActive] = useState(null);
  const audio = useRef(null);

  const start = async () => {
    setStarted(true);
    try {
      audio.current.volume = 0.38;
      await audio.current.play();
    } catch {}
  };

  return (
    <main>
      <audio ref={audio} src="/music.mp3" loop preload="auto" />
      <div className="canvas-shell">
        <Canvas camera={{ position: [0, 0, 7], fov: 54 }} dpr={[1, 1.7]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
          <Suspense fallback={null}>
            {started && <Scene onOpen={setActive} />}
          </Suspense>
        </Canvas>
      </div>
      {started && <FloatingWords />}
      {started && (
        <motion.div className="top-note" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <span>нажми на сияющие звёзды</span>
        </motion.div>
      )}
      <AnimatePresence>{!started && <Intro onStart={start} />}</AnimatePresence>
      <PoemPanel active={active} onClose={() => setActive(null)} />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
