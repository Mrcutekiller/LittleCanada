'use client'

import { useRef, useEffect, memo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PresentationControls, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

interface Food3DProps {
  type: 'burger' | 'pizza' | 'sandwich' | 'dessert'
  selectedToppings?: string[]
}

function BurgerModel({ selectedToppings = [] }: Omit<Food3DProps, 'type'>) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.008
    }
  })

  // Create a rounded rectangle shape for burger layers
  const createBunShape = (radius: number) => {
    const shape = new THREE.Shape()
    shape.moveTo(radius, 0)
    shape.quadraticCurveTo(radius, radius, 0, radius)
    shape.quadraticCurveTo(-radius, radius, -radius, 0)
    shape.quadraticCurveTo(-radius, -radius, 0, -radius)
    shape.quadraticCurveTo(radius, -radius, radius, 0)
    return shape
  }

  return (
    <group ref={groupRef} scale={1.8}>
      {/* Bottom Bun */}
      <mesh position={[0, -0.35, 0]}>
        <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial 
          color="#CD853F" 
          roughness={0.6}
          metalness={0}
        />
      </mesh>

      {/* Patty */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.12, 32]} />
        <meshStandardMaterial 
          color="#6B4423"
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* Cheese Layer (if selected) */}
      {selectedToppings.includes('cheese') && (
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.74, 0.74, 0.04, 32]} />
          <meshStandardMaterial 
            color="#FFD700"
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* Lettuce Layer (if selected) */}
      {selectedToppings.includes('lettuce') && (
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.06, 32]} />
          <meshStandardMaterial 
            color="#2D5016"
            roughness={0.95}
            metalness={0}
          />
        </mesh>
      )}

      {/* Tomato Layer (if selected) */}
      {selectedToppings.includes('tomato') && (
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.74, 0.74, 0.05, 32]} />
          <meshStandardMaterial 
            color="#DC143C"
            roughness={0.7}
            metalness={0}
          />
        </mesh>
      )}

      {/* Pepperoni (if selected) */}
      {selectedToppings.includes('pepperoni') && (
        <>
          <mesh position={[-0.3, 0.3, 0.3]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
            <meshStandardMaterial color="#B22222" roughness={0.6} />
          </mesh>
          <mesh position={[0.25, 0.32, -0.35]}>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
            <meshStandardMaterial color="#B22222" roughness={0.6} />
          </mesh>
        </>
      )}

      {/* Top Bun */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial 
          color="#D2691E"
          roughness={0.65}
          metalness={0}
        />
      </mesh>
    </group>
  )
}

function PizzaModel({ selectedToppings = [] }: Omit<Food3DProps, 'type'>) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.006
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.2
    }
  })

  return (
    <group ref={groupRef} scale={2}>
      {/* Crust */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.08, 64]} />
        <meshStandardMaterial 
          color="#CD853F"
          roughness={0.7}
          metalness={0}
        />
      </mesh>

      {/* Sauce/Base */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.02, 64]} />
        <meshStandardMaterial 
          color="#C1272D"
          roughness={0.5}
          metalness={0}
        />
      </mesh>

      {/* Cheese */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
        <cylinderGeometry args={[0.87, 0.87, 0.03, 64]} />
        <meshStandardMaterial 
          color="#FFD700"
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>

      {/* Pepperoni (if selected) */}
      {selectedToppings.includes('pepperoni') && (
        <>
          {[
            [-0.4, -0.3, 0.15],
            [0.3, 0.4, 0.15],
            [-0.2, 0.2, 0.15],
            [0.5, -0.15, 0.15],
          ].map((pos, i) => (
            <mesh key={`pep-${i}`} position={pos as [number, number, number]}>
              <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
              <meshStandardMaterial color="#B22222" roughness={0.6} />
            </mesh>
          ))}
        </>
      )}

      {/* Mushroom (if selected) */}
      {selectedToppings.includes('mushroom') && (
        <>
          {[
            [0.2, -0.4, 0.15],
            [-0.35, 0.35, 0.15],
          ].map((pos, i) => (
            <mesh key={`mush-${i}`} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#8B4513" roughness={0.8} />
            </mesh>
          ))}
        </>
      )}

      {/* Olive (if selected) */}
      {selectedToppings.includes('olive') && (
        <>
          {[
            [0.5, 0.2, 0.15],
            [-0.3, -0.45, 0.15],
          ].map((pos, i) => (
            <mesh key={`olive-${i}`} position={pos as [number, number, number]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

function SandwichModel({ selectedToppings = [] }: Omit<Food3DProps, 'type'>) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.007
      groupRef.current.rotation.z = Math.sin(Date.now() * 0.0008) * 0.15
    }
  })

  return (
    <group ref={groupRef} scale={1.6}>
      {/* Bottom Bread */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.8, 0.15, 0.6]} />
        <meshStandardMaterial 
          color="#D2B48C"
          roughness={0.6}
          metalness={0}
        />
      </mesh>

      {/* Lettuce */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.85, 0.04, 0.65]} />
        <meshStandardMaterial 
          color="#2D5016"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Filling (Tuna/Cheese) */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.75, 0.08, 0.55]} />
        <meshStandardMaterial 
          color="#8B7355"
          roughness={0.7}
          metalness={0}
        />
      </mesh>

      {/* Top Bread */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.15, 0.6]} />
        <meshStandardMaterial 
          color="#D2A679"
          roughness={0.65}
          metalness={0}
        />
      </mesh>
    </group>
  )
}

function DessertModel({ selectedToppings = [] }: Omit<Food3DProps, 'type'>) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0012) * 0.1
    }
  })

  return (
    <group ref={groupRef} scale={1.8}>
      {/* Ice cream scoops */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#F5DEB3"
          roughness={0.3}
          metalness={0}
        />
      </mesh>

      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial 
          color="#8B4513"
          roughness={0.4}
          metalness={0}
        />
      </mesh>

      {/* Cone */}
      <mesh position={[0, -0.3, 0]}>
        <coneGeometry args={[0.45, 0.8, 32]} />
        <meshStandardMaterial 
          color="#CD853F"
          roughness={0.65}
          metalness={0}
        />
      </mesh>

      {/* Chocolate drizzle (if selected) */}
      {selectedToppings.includes('chocolate') && (
        <mesh position={[0, 0.5, 0]}>
          <torusGeometry args={[0.4, 0.03, 8, 100]} />
          <meshStandardMaterial 
            color="#3D2817"
            roughness={0.5}
          />
        </mesh>
      )}
    </group>
  )
}

const BurgerMemo = memo(BurgerModel)
const PizzaMemo = memo(PizzaModel)
const SandwichMemo = memo(SandwichModel)
const DessertMemo = memo(DessertModel)

export function Food3D({ type, selectedToppings = [] }: Food3DProps) {
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1
  
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      dpr={dpr}
    >
      {/* Professional Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 7]} intensity={1.2} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 5, 10]} intensity={0.6} />

      {/* Environment for realistic reflections */}
      <Environment preset="studio" />

      {/* Render based on food type */}
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[0, Math.PI * 0.5]}
        azimuth={[-Math.PI * 0.5, Math.PI * 0.5]}
      >
        {type === 'burger' && <BurgerMemo selectedToppings={selectedToppings} />}
        {type === 'pizza' && <PizzaMemo selectedToppings={selectedToppings} />}
        {type === 'sandwich' && <SandwichMemo selectedToppings={selectedToppings} />}
        {type === 'dessert' && <DessertMemo selectedToppings={selectedToppings} />}
      </PresentationControls>
    </Canvas>
  )
}
