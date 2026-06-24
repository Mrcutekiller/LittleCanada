'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PresentationControls, Float } from '@react-three/drei'
import * as THREE from 'three'

interface Food3DProps {
  type: 'burger' | 'pizza' | 'sandwich' | 'dessert'
  color: string
  selectedToppings?: string[]
  autoRotate?: boolean
}

function BurgerModel({ color, selectedToppings = [] }: Omit<Food3DProps, 'type'> & { type?: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={groupRef}>
      {/* Bun Bottom */}
      <mesh position={[0, -0.3, 0]}>
        <capsuleGeometry args={[0.8, 0.3, 4, 8]} />
        <meshStandardMaterial color="#D2691E" roughness={0.7} />
      </mesh>

      {/* Patty */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 0.15, 32]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>

      {/* Cheese (if selected) */}
      {selectedToppings.includes('cheese') && (
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.05, 32]} />
          <meshStandardMaterial color="#FFD700" roughness={0.6} />
        </mesh>
      )}

      {/* Lettuce (if selected) */}
      {selectedToppings.includes('lettuce') && (
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.75, 0.75, 0.08, 32]} />
          <meshStandardMaterial color="#228B22" roughness={0.9} />
        </mesh>
      )}

      {/* Tomato (if selected) */}
      {selectedToppings.includes('tomato') && (
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
          <meshStandardMaterial color="#FF4500" roughness={0.7} />
        </mesh>
      )}

      {/* Bun Top */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.8, 0.3, 4, 8]} />
        <meshStandardMaterial color="#D2691E" roughness={0.7} />
      </mesh>
    </group>
  )
}

function PizzaModel({ color, selectedToppings = [] }: Omit<Food3DProps, 'type'> & { type?: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.003
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {/* Pizza Base */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI * 0.1, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.2, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>

      {/* Cheese */}
      <mesh position={[0, 0.11, 0]} rotation={[Math.PI * 0.1, 0, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.08, 32]} />
        <meshStandardMaterial color="#FFD700" roughness={0.7} />
      </mesh>

      {/* Toppings - Pepperoni (if selected) */}
      {selectedToppings.includes('pepperoni') && (
        <>
          {[...Array(6)].map((_, i) => {
            const angle = (i / 6) * Math.PI * 2
            const radius = 0.6
            return (
              <mesh key={`pep-${i}`} position={[Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius]}>
                <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
                <meshStandardMaterial color="#DC143C" roughness={0.5} />
              </mesh>
            )
          })}
        </>
      )}

      {/* Mushrooms (if selected) */}
      {selectedToppings.includes('mushroom') && (
        <>
          {[...Array(4)].map((_, i) => {
            const angle = (i / 4) * Math.PI * 2 + Math.PI / 8
            const radius = 0.4
            return (
              <mesh key={`mush-${i}`} position={[Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius]}>
                <sphereGeometry args={[0.12, 16, 16]} />
                <meshStandardMaterial color="#8B6914" roughness={0.7} />
              </mesh>
            )
          })}
        </>
      )}

      {/* Olives (if selected) */}
      {selectedToppings.includes('olive') && (
        <>
          {[...Array(5)].map((_, i) => {
            const angle = (i / 5) * Math.PI * 2
            const radius = 0.7
            return (
              <mesh key={`olive-${i}`} position={[Math.cos(angle) * radius, 0.2, Math.sin(angle) * radius]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#000000" roughness={0.6} />
              </mesh>
            )
          })}
        </>
      )}
    </group>
  )
}

function SandwichModel({ color, selectedToppings = [] }: Omit<Food3DProps, 'type'> & { type?: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004
    }
  })

  return (
    <group ref={groupRef}>
      {/* Bottom Bread */}
      <mesh position={[0, -0.25, -0.2]} scale={[1.2, 0.3, 0.9]}>
        <boxGeometry />
        <meshStandardMaterial color="#DAA520" roughness={0.8} />
      </mesh>

      {/* Filling */}
      <mesh position={[0, 0, 0]} scale={[1.0, 0.2, 0.8]}>
        <boxGeometry />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>

      {/* Extra filling (if toppings selected) */}
      {selectedToppings.length > 0 && (
        <mesh position={[0, 0.15, 0]} scale={[0.95, 0.15, 0.75]}>
          <boxGeometry />
          <meshStandardMaterial color="#FF6347" roughness={0.7} />
        </mesh>
      )}

      {/* Top Bread */}
      <mesh position={[0, 0.25, -0.2]} scale={[1.2, 0.3, 0.9]}>
        <boxGeometry />
        <meshStandardMaterial color="#DAA520" roughness={0.8} />
      </mesh>
    </group>
  )
}

function DessertModel({ color, selectedToppings = [] }: Omit<Food3DProps, 'type'> & { type?: string }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.006
      groupRef.current.position.y = Math.sin(Date.now() * 0.0008) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main dessert base */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Whipped cream (if selected) */}
      {selectedToppings.includes('cream') && (
        <mesh position={[0, 0.8, 0]} scale={[0.6, 0.8, 0.6]}>
          <coneGeometry args={[0.5, 0.8, 32]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>
      )}

      {/* Cherry on top (if selected) */}
      {selectedToppings.includes('cherry') && (
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#DC143C" roughness={0.6} />
        </mesh>
      )}

      {/* Chocolate drizzle (if selected) */}
      {selectedToppings.includes('chocolate') && (
        <>
          {[...Array(3)].map((_, i) => (
            <mesh key={`choc-${i}`} position={[-0.3 + i * 0.3, 0.3, -0.7]} rotation={[0, 0, Math.PI / 6]}>
              <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
              <meshStandardMaterial color="#8B4513" roughness={0.8} />
            </mesh>
          ))}
        </>
      )}
    </group>
  )
}

function FoodModel({ type, color, selectedToppings }: Food3DProps) {
  if (type === 'burger') return <BurgerModel color={color} selectedToppings={selectedToppings} />
  if (type === 'pizza') return <PizzaModel color={color} selectedToppings={selectedToppings} />
  if (type === 'sandwich') return <SandwichModel color={color} selectedToppings={selectedToppings} />
  if (type === 'dessert') return <DessertModel color={color} selectedToppings={selectedToppings} />
  return null
}

export function Food3D({ type, color, selectedToppings = [] }: Food3DProps) {
  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color="#FFF" />

      <PresentationControls
        global
        rotation={[0, 0, 0]}
        polar={[0, 0]}
        azimuth={[-Math.PI / 4, Math.PI / 4]}
      >
        <Float speed={1} rotationIntensity={0} floatIntensity={0.2}>
          <FoodModel type={type} color={color} selectedToppings={selectedToppings} />
        </Float>
      </PresentationControls>
    </Canvas>
  )
}
