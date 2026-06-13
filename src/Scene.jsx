import { Canvas, useFrame } from '@react-three/fiber'
import { Cloud, Sparkles, Stars, Float, Html } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { lovePanels } from './loveTexts.js'

function CameraRig({ started }) {
  useFrame((state) => {
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, started ? 5.2 : 7.8, 0.018)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, started ? 0.14 : 0.0, 0.014)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function Nebula() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.08) * 0.08
    ref.current.position.x = Math.sin(clock.elapsedTime * 0.05) * 0.15
  })
  return (
    <group ref={ref} position={[0, 0, -5.8]}>
      <Cloud opacity={0.22} speed={0.08} width={9} depth={1.8} segments={34} color="#285aa8" />
      <Cloud opacity={0.13} speed={0.05} width={7} depth={1.5} segments={30} color="#7db5ff" position={[1.2, -0.3, 0]} />
      <Cloud opacity={0.10} speed={0.04} width={6} depth={1.2} segments={24} color="#152f73" position={[-1.6, 0.45, -0.3]} />
    </group>
  )
}

function CrystalNode({ panel, index, activePanel, setActivePanel }) {
  const mesh = useRef()
  const aura = useRef()
  const [hovered, setHovered] = useState(false)
  const positions = [[-2.45, .3, -0.15], [0, -.22, .25], [2.45, .3, -0.15]]

  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.4 + index) * 0.035
    const target = hovered || activePanel === panel.id ? 1.18 : 1
    if (mesh.current) mesh.current.scale.setScalar(THREE.MathUtils.lerp(mesh.current.scale.x, target * pulse, 0.08))
    if (aura.current) aura.current.material.opacity = THREE.MathUtils.lerp(aura.current.material.opacity, hovered ? 0.24 : 0.11, 0.06)
  })

  return (
    <Float speed={1.0} floatIntensity={0.28} rotationIntensity={0.2}>
      <group position={positions[index]}>
        <mesh
          ref={mesh}
          onClick={(e) => { e.stopPropagation(); setActivePanel(panel.id) }}
          onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor='pointer' }}
          onPointerLeave={() => { setHovered(false); document.body.style.cursor='default' }}
        >
          <sphereGeometry args={[0.22, 64, 64]} />
          <meshPhysicalMaterial
            color="#fff7cc"
            emissive="#ffd166"
            emissiveIntensity={hovered ? 2.4 : 1.25}
            roughness={0.05}
            metalness={0.08}
            transmission={0.45}
            transparent
            opacity={0.92}
            thickness={0.8}
          />
        </mesh>
        <mesh ref={aura}>
          <sphereGeometry args={[0.58, 64, 64]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.11} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <Html center distanceFactor={7} position={[0,-.62,0]}>
          <button className="node-label" onClick={() => setActivePanel(panel.id)}>{panel.title}</button>
        </Html>
      </group>
    </Float>
  )
}

function ShootingStars() {
  const items = useMemo(() => Array.from({ length: 5 }, (_, i) => ({
    y: -1.8 + i * 0.9,
    z: -1.8 - i * 0.35,
    delay: i * 1.7,
    speed: 0.32 + i * 0.035
  })), [])
  return items.map((s, i) => <ShootingStar key={i} {...s} />)
}

function ShootingStar({ y, z, delay, speed }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = ((clock.elapsedTime * speed + delay) % 6)
    if (!ref.current) return
    ref.current.position.x = 4.5 - t * 1.7
    ref.current.position.y = y + t * 0.34
    ref.current.material.opacity = t > .4 && t < 2.2 ? 0.32 : 0
  })
  return <mesh ref={ref} position={[4,y,z]} rotation={[0,0,-0.32]}>
    <planeGeometry args={[1.2, .018]} />
    <meshBasicMaterial color="#ffe8a3" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
  </mesh>
}

function World(props) {
  return <>
    <color attach="background" args={["#06152d"]} />
    <fog attach="fog" args={["#06152d", 6, 13]} />
    <ambientLight intensity={0.35} />
    <pointLight position={[0, 1.8, 3]} color="#ffd700" intensity={1.4} />
    <pointLight position={[-3,-1,-2]} color="#4f8cff" intensity={2.4} />
    <CameraRig started={props.started} />
    <Nebula />
    <Stars radius={85} depth={50} count={1800} factor={3.4} fade speed={0.18} saturation={0} />
    <Sparkles count={160} scale={[7,4.4,4]} size={1.35} speed={0.14} color="#FFD700" opacity={0.45} />
    <Sparkles count={80} scale={[7,4.4,3]} size={2.2} speed={0.09} color="#ffffff" opacity={0.16} />
    <ShootingStars />
    {props.started && lovePanels.map((p, i) => <CrystalNode key={p.id} panel={p} index={i} {...props} />)}
    <EffectComposer multisampling={0}>
      <Bloom intensity={1.05} luminanceThreshold={0.22} luminanceSmoothing={0.78} mipmapBlur />
      <DepthOfField focusDistance={0.028} focalLength={0.035} bokehScale={1.6} />
      <Vignette offset={0.18} darkness={0.62} />
    </EffectComposer>
  </>
}

export default function Scene({ started, activePanel, setActivePanel }) {
  return <Canvas camera={{ position: [0,0,7.8], fov: 42 }} dpr={[1, 1.6]} gl={{ antialias: true, powerPreference: 'high-performance' }} onPointerMissed={() => setActivePanel(null)}>
    <World started={started} activePanel={activePanel} setActivePanel={setActivePanel} />
  </Canvas>
}
