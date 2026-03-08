import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sphere, Sparkles, Float } from '@react-three/drei'
import * as THREE from 'three'
import { useAppContext } from '../../contexts/AppContext'

function BackgroundOrbs() {
    const mouse = useRef({ x: 0, y: 0 })
    const groupRef = useRef<THREE.Group>(null)
    const { viewport } = useThree()

    // Track mouse
    useFrame((state) => {
        mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, (state.mouse.x * viewport.width) / 2, 0.05)
        mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, (state.mouse.y * viewport.height) / 2, 0.05)

        if (groupRef.current) {
            // Subtle parallax effect based on mouse
            groupRef.current.position.x = mouse.current.x * 0.1
            groupRef.current.position.y = mouse.current.y * 0.1
        }
    })

    return (
        <group ref={groupRef}>
            <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
                <Sphere args={[2, 64, 64]} position={[-3, 2, -5]}>
                    <meshStandardMaterial
                        color="#171717" // dark grey/black
                        emissive="#262626"
                        emissiveIntensity={0.5}
                        roughness={0.4}
                        metalness={0.8}
                        transparent
                        opacity={0.8}
                    />
                </Sphere>
            </Float>

            <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1.5}>
                <Sphere args={[2.5, 64, 64]} position={[4, -2, -6]}>
                    <meshStandardMaterial
                        color="#ea580c" // umain orange
                        emissive="#c2410c"
                        emissiveIntensity={0.3}
                        roughness={0.3}
                        metalness={0.9}
                        transparent
                        opacity={0.4}
                    />
                </Sphere>
            </Float>

            <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.8}>
                <Sphere args={[1.5, 64, 64]} position={[1, 3, -4]}>
                    <meshStandardMaterial
                        color="#9a3412" // deep copper
                        emissive="#7c2d12"
                        emissiveIntensity={0.4}
                        roughness={0.5}
                        metalness={0.7}
                        transparent
                        opacity={0.6}
                    />
                </Sphere>
            </Float>

            <Sparkles count={400} scale={15} size={2} speed={0.2} opacity={0.3} color="#ea580c" />
        </group>
    )
}

export function WebGLBackground() {
    const { settings } = useAppContext()

    if (!settings.enableEffects) {
        return <div className="absolute inset-0 z-0 bg-umain-background pointer-events-none" />
    }

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#ffedd5" />
                <BackgroundOrbs />
            </Canvas>
            {/* Noise Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        </div>
    )
}
