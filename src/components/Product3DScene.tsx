'use client'

import { useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, ContactShadows, OrbitControls, Center } from '@react-three/drei'
import type { Group, Mesh } from 'three'

function ShirtModel() {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF('/shirt_baked.glb')

  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const m = child as Mesh
        if (m.material && !Array.isArray(m.material)) m.material = m.material.clone()
      }
    })
  }, [scene])

  useFrame(() => {
    if (!groupRef.current) return
    const t = performance.now() / 1000
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.2
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.02
  })

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} scale={1.5} />
      </Center>
    </group>
  )
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#e5e7eb" wireframe />
    </mesh>
  )
}

export default function Product3DScene() {
  return (
    <div className="relative w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 30 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <directionalLight position={[-3, 2, 4]} intensity={0.8} />
          <pointLight position={[0, 3, 2]} intensity={0.5} />
          <hemisphereLight args={['#ffffff', '#185FA5', 0.4]} />

          <ShirtModel />

          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.25}
            scale={6}
            blur={3}
            far={3}
          />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={2}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
