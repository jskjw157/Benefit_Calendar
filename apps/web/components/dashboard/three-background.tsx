'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useMemo, useRef, Suspense } from 'react'
import * as THREE from 'three'

function ParticleField() {
  const ref = useRef<THREE.Points>(null)

  // Generate 1000 particle positions
  const positions = useMemo(() => {
    const pos = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  // Animate based on mouse movement
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.mouse.y * 0.1
      ref.current.rotation.y = state.mouse.x * 0.1
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#3b82f6"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  )
}

export function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-40">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ParticleField />
        </Canvas>
      </Suspense>
    </div>
  )
}
