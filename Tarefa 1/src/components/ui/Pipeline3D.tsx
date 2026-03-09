import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Icosahedron, Sparkles, Float, Line } from '@react-three/drei'
import * as THREE from 'three'

const stepColors = {
  idle: new THREE.Color('#ea580c'),
  step0: new THREE.Color('#fdba74'),
  step1: new THREE.Color('#f97316'),
  step2: new THREE.Color('#c2410c'),
  step3: new THREE.Color('#7c2d12'),
}

function getTargetColor(activeStep: number | null) {
  if (activeStep === 0) return stepColors.step0
  if (activeStep === 1) return stepColors.step1
  if (activeStep === 2) return stepColors.step2
  if (activeStep === 3) return stepColors.step3
  return stepColors.idle
}

function AdaptiveLights({ activeStep, calculating }: { activeStep: number | null; calculating: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null)

  useFrame(() => {
    if (lightRef.current) {
      const targetColor = getTargetColor(activeStep)
      lightRef.current.color.lerp(targetColor, 0.05)
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, calculating ? 2 : 1, 0.1)
    }
  })

  return <pointLight ref={lightRef} position={[10, 10, 10]} intensity={1} color="#ea580c" />
}

function DataNode({
  position,
  color,
  calculating,
  activeStep,
  nodeIndex,
}: {
  position: [number, number, number]
  color: string
  calculating: boolean
  activeStep: number | null
  nodeIndex: number
}) {
  const nodeRef = useRef<THREE.Group>(null)
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position])
  const inPos = useMemo(() => new THREE.Vector3(...position).multiplyScalar(0.4), [position])
  const baseColor = useMemo(() => new THREE.Color(color), [color])
  const isActive = activeStep === nodeIndex
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    if (nodeRef.current) {
      let currentTarget = initialPos

      if (calculating) {
        if (isActive) {
          currentTarget = new THREE.Vector3().copy(inPos).multiplyScalar(0.8)
          currentTarget.y += Math.sin(state.clock.elapsedTime * 8 + nodeIndex) * 0.5
          currentTarget.x += Math.cos(state.clock.elapsedTime * 6 + nodeIndex) * 0.5
        } else if (activeStep !== null && nodeIndex < activeStep) {
          currentTarget = new THREE.Vector3().copy(inPos).multiplyScalar(1.2)
        } else {
          currentTarget = new THREE.Vector3().copy(initialPos).multiplyScalar(0.9)
          currentTarget.y += Math.sin(state.clock.elapsedTime * 2 + nodeIndex) * 0.2
          currentTarget.x += Math.cos(state.clock.elapsedTime * 1.5 + nodeIndex) * 0.2
        }
      } else {
        currentTarget = new THREE.Vector3().copy(initialPos)
        currentTarget.y += Math.sin(state.clock.elapsedTime + nodeIndex) * 0.1
      }

      nodeRef.current.position.lerp(currentTarget, isActive ? 0.1 : 0.03)
    }

    if (materialRef.current) {
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        isActive ? 2.5 : calculating ? 0.5 : 0.2,
        0.1,
      )
    }
  })

  return (
    <group ref={nodeRef}>
      <Float speed={isActive ? 8 : calculating ? 2 : 1} rotationIntensity={isActive ? 2 : 0.5} floatIntensity={isActive ? 3 : 1}>
        <Sphere args={[isActive ? 0.4 : 0.3, 32, 32]}>
          <meshStandardMaterial ref={materialRef} color={baseColor} emissive={baseColor} emissiveIntensity={0.2} roughness={0.2} metalness={0.8} />
        </Sphere>
      </Float>
      <Line points={[[0, 0, 0], [0, 0, 0]]} color={baseColor} opacity={0} transparent lineWidth={1} />
    </group>
  )
}

function CoreAI({ calculating, activeStep }: { calculating: boolean; activeStep: number | null }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  useFrame((state) => {
    let speedMultiplier = calculating ? 5 : 1
    let scaleTarget = 1
    let pulseIntensity = 0

    if (activeStep === 0) {
      speedMultiplier = 3
      scaleTarget = 1.1
    } else if (activeStep === 1) {
      speedMultiplier = 15
      scaleTarget = 1.2
      pulseIntensity = Math.sin(state.clock.elapsedTime * 20) * 0.1
    } else if (activeStep === 2) {
      speedMultiplier = 2
      scaleTarget = 1.4
    } else if (activeStep === 3) {
      speedMultiplier = 1.5
      scaleTarget = 1.2
      pulseIntensity = Math.max(0, Math.sin(state.clock.elapsedTime * 8)) * 0.3
    } else if (calculating) {
      speedMultiplier = 5
      scaleTarget = 1.1
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speedMultiplier
      meshRef.current.rotation.y += 0.015 * speedMultiplier

      const currentScale = meshRef.current.scale.x
      const newScale = THREE.MathUtils.lerp(currentScale, scaleTarget + pulseIntensity, 0.1)
      meshRef.current.scale.set(newScale, newScale, newScale)
    }

    if (innerRef.current) {
      innerRef.current.rotation.x += 0.01 * (speedMultiplier * -0.6)
      innerRef.current.rotation.y += 0.012 * (speedMultiplier * -0.6)

      const currentScale = innerRef.current.scale.x
      const newScale = THREE.MathUtils.lerp(currentScale, (scaleTarget - 0.2) + pulseIntensity, 0.1)
      innerRef.current.scale.set(newScale, newScale, newScale)
    }

    if (materialRef.current) {
      const targetColor = getTargetColor(activeStep)
      materialRef.current.color.lerp(targetColor, 0.05)
      materialRef.current.emissive.lerp(targetColor, 0.05)
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        calculating ? (activeStep === 1 ? 3 : 2) : 0.8,
        0.1,
      )
    }
  })

  return (
    <Float speed={calculating ? 10 : 4} rotationIntensity={calculating ? 3 : 1} floatIntensity={calculating ? 1 : 2}>
      <Icosahedron ref={meshRef} args={[1.2, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial
          ref={materialRef}
          color="#ea580c"
          emissive="#ea580c"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={calculating ? 1 : 0.8}
        />
      </Icosahedron>
      <Icosahedron ref={innerRef} args={[0.8, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#000000"
          roughness={0.1}
          metalness={1}
        />
      </Icosahedron>
    </Float>
  )
}

export function Pipeline3D({ calculating, activeStep }: { calculating: boolean; activeStep: number | null }) {
  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden bg-black/40 border border-umain-border/50 relative">
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-umain-text-muted mb-1">WebGL Interactive Core</p>
        <p className="text-sm font-semibold text-umain-text">Data Ingestion Engine</p>
      </div>

      <Canvas camera={{ position: [0, 2, 7], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <AdaptiveLights activeStep={activeStep} calculating={calculating} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#c2410c" />

        <CoreAI calculating={calculating} activeStep={activeStep} />

        <DataNode position={[-3, 1, -1]} color="#fdba74" calculating={calculating} activeStep={activeStep} nodeIndex={0} />
        <DataNode position={[3, 1.5, -2]} color="#f97316" calculating={calculating} activeStep={activeStep} nodeIndex={1} />
        <DataNode position={[-2, -1.5, 1]} color="#c2410c" calculating={calculating} activeStep={activeStep} nodeIndex={2} />
        <DataNode position={[2.5, -1, 2]} color="#7c2d12" calculating={calculating} activeStep={activeStep} nodeIndex={3} />

        <Sparkles
          count={calculating ? (activeStep === 1 ? 400 : 200) : 50}
          scale={activeStep === 2 ? 10 : 7}
          size={calculating ? 4 : 2}
          speed={calculating ? 2 : 0.2}
          opacity={activeStep !== null ? 0.6 : 0.4}
          color="#ea580c"
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  )
}
