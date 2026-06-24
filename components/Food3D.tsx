'use client'

import { useRef, useState, useEffect, Component, ErrorInfo, ReactNode, memo, useCallback, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, RoundedBox } from '@react-three/drei'
// @ts-ignore
import * as THREE from 'three'
import { motion, MotionValue } from 'framer-motion'
import { useDrag } from '@use-gesture/react'
import { getIngredientLayers, type IngredientLayer } from '@/lib/menu-data'

// WebGL Error Boundary
class WebGLBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  public state = { hasError: false }
  public static getDerivedStateFromError() { return { hasError: true } }
  public componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.warn("WebGL crash caught, falling back to 2D:", error, errorInfo)
  }
  public render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

// ─── 2D Fallback Components ────────────────────────────────────────────────────
function Burger2D({ selectedToppings }: { selectedToppings: string[] }) {
  const hasCheese = selectedToppings.includes('cheese')
  const hasLettuce = selectedToppings.includes('lettuce')
  const hasTomato = selectedToppings.includes('tomato')
  return (
    <motion.div initial="initial" animate="animate" className="flex flex-col items-center justify-center -space-y-3 pt-2">
      <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.1 }}
        className="z-50 relative w-32 h-12 bg-gradient-to-b from-[#E2A762] to-[#C0833C] rounded-t-[40px] shadow-md border-b-2 border-[#A86E2A] flex items-center justify-center">
        <div className="absolute inset-0 flex justify-around items-center px-4 py-2 opacity-80 pointer-events-none">
          <span className="w-1 h-0.5 bg-yellow-100 rounded-full transform rotate-12 -mt-4" />
          <span className="w-1 h-0.5 bg-yellow-100 rounded-full transform -rotate-45 -mt-2" />
          <span className="w-1 h-0.5 bg-yellow-100 rounded-full transform rotate-45 -mt-5" />
          <span className="w-1 h-0.5 bg-yellow-100 rounded-full transform -rotate-12 -mt-3" />
        </div>
      </motion.div>
      {hasCheese && (
        <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}
          className="z-40 w-[134px] h-2.5 bg-gradient-to-b from-[#FCD34D] to-[#F59E0B] rounded-b-md border-b border-[#D97706] relative">
          <div className="absolute top-1 left-4 w-2.5 h-3 bg-[#F59E0B] rounded-b-full" />
          <div className="absolute top-1 right-8 w-2.5 h-2.5 bg-[#F59E0B] rounded-b-full" />
        </motion.div>
      )}
      {hasTomato && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 12 }}
          className="z-30 flex justify-center gap-1 w-32 h-3.5 px-2">
          <div className="w-14 h-3 bg-gradient-to-b from-[#EF4444] to-[#DC2626] rounded-full border-b border-[#991B1B] shadow" />
          <div className="w-14 h-3 bg-gradient-to-b from-[#EF4444] to-[#DC2626] rounded-full border-b border-[#991B1B] shadow" />
        </motion.div>
      )}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 10, delay: 0.05 }}
        className="z-20 w-[128px] h-6 bg-gradient-to-b from-[#5C3A21] to-[#3D2513] rounded-full border-b-4 border-[#28180C] shadow-md relative">
        <div className="absolute inset-0 flex justify-center gap-4 opacity-30">
          <div className="w-1 h-full bg-[#1B0F07] transform skew-x-12" />
          <div className="w-1 h-full bg-[#1B0F07] transform skew-x-12" />
          <div className="w-1 h-full bg-[#1B0F07] transform skew-x-12" />
        </div>
      </motion.div>
      {hasLettuce && (
        <motion.div initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 10 }}
          className="z-10 w-32 h-3 bg-gradient-to-b from-[#4ADE80] to-[#16A34A] rounded-full border-b border-[#15803D] flex items-center justify-around px-2 shadow relative">
          <div className="w-3.5 h-3.5 bg-[#16A34A] rounded-full -mt-1.5" />
          <div className="w-2.5 h-2.5 bg-[#16A34A] rounded-full -mt-0.5" />
          <div className="w-3.5 h-3.5 bg-[#16A34A] rounded-full -mt-1.5" />
        </motion.div>
      )}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 10 }}
        className="z-0 w-30 h-7 bg-gradient-to-b from-[#D18E4A] to-[#B07233] rounded-b-xl border-b-2 border-[#945C24] shadow-md" />
    </motion.div>
  )
}

function Pizza2D({ selectedToppings }: { selectedToppings: string[] }) {
  const hasPepperoni = selectedToppings.includes('pepperoni')
  const hasMushroom = selectedToppings.includes('mushroom')
  const hasOlive = selectedToppings.includes('olive')
  const hasVeggie = selectedToppings.includes('lettuce')
  return (
    <motion.div initial={{ scale: 0.6, rotate: -45, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 12 }}
      className="relative w-36 h-36 rounded-full bg-gradient-to-b from-[#C8844E] to-[#A05A28] border-[6px] border-[#8A4A1C] shadow-xl flex items-center justify-center">
      <div className="w-[90%] h-[90%] rounded-full bg-gradient-to-b from-[#C23A22] to-[#991B1B] flex items-center justify-center border border-[#821313]/30">
        <div className="w-[92%] h-[92%] rounded-full bg-gradient-to-b from-[#F6D060] to-[#E9A92D] relative shadow-inner overflow-hidden">
          {hasPepperoni && (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 left-8 w-5 h-5 bg-gradient-to-b from-[#B91C1C] to-[#7F1D1D] rounded-full border border-red-950 shadow" />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.05 }} className="absolute bottom-5 left-10 w-5 h-5 bg-gradient-to-b from-[#B91C1C] to-[#7F1D1D] rounded-full border border-red-950 shadow" />
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="absolute top-10 right-4 w-5 h-5 bg-gradient-to-b from-[#B91C1C] to-[#7F1D1D] rounded-full border border-red-950 shadow" />
            </>
          )}
          {hasMushroom && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-10 left-3 text-xs select-none">🍄</motion.div>}
          {hasOlive && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute bottom-10 left-4 w-2.5 h-2.5 bg-neutral-900 rounded-full" />}
          {hasVeggie && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-12 left-10 text-xs select-none">🌿</motion.div>}
        </div>
      </div>
    </motion.div>
  )
}

function Sandwich2D({ selectedToppings }: { selectedToppings: string[] }) {
  const hasCheese = selectedToppings.includes('cheese')
  const hasLettuce = selectedToppings.includes('lettuce')
  const hasTomato = selectedToppings.includes('tomato')
  return (
    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 13 }}
      className="relative flex flex-col items-center justify-center -space-y-2.5 pt-2">
      <div className="z-40 w-32 h-7 bg-gradient-to-b from-[#C8985A] to-[#A0703B] rounded-xl border-t border-b border-[#8A5A28] shadow-md" />
      {hasTomato && <div className="z-30 w-[124px] h-2.5 px-2 flex justify-between">
        <div className="w-10 h-2.5 bg-gradient-to-b from-[#EF4444] to-[#B91C1C] rounded-full" />
        <div className="w-10 h-2.5 bg-gradient-to-b from-[#EF4444] to-[#B91C1C] rounded-full" />
      </div>}
      {hasCheese && <div className="z-20 w-32 h-1.5 bg-[#FCD34D] border-b border-amber-600" />}
      {hasLettuce && <div className="z-10 w-[126px] h-2.5 bg-gradient-to-b from-[#4ADE80] to-[#16A34A] rounded-full" />}
      <div className="z-5 w-[122px] h-3.5 bg-[#7A5A35] border-b border-[#4D3A1B] rounded-full" />
      <div className="z-0 w-32 h-7 bg-gradient-to-b from-[#D4A06A] to-[#B07A44] rounded-xl border-t border-b border-[#946234] shadow-lg" />
    </motion.div>
  )
}

function Dessert2D({ selectedToppings }: { selectedToppings: string[] }) {
  const hasDrizzle = selectedToppings.includes('chocolate')
  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 15 }}
      className="relative flex flex-col items-center justify-center -space-y-3.5 pt-2">
      <div className="z-50 w-5 h-5 bg-gradient-to-b from-red-500 to-red-800 rounded-full border border-red-950 shadow" />
      <div className="z-40 w-20 h-16 bg-gradient-to-b from-[#6D4C41] to-[#4E342E] rounded-full border-b border-[#3E2723] shadow-md relative">
        {hasDrizzle && <div className="absolute top-0.5 inset-x-2 h-5 bg-[#2D1500] rounded-t-full" />}
      </div>
      <div className="z-30 w-24 h-16 bg-gradient-to-b from-[#FFFDF0] to-[#EAE0C0] rounded-full border-b border-[#D8C7A0] -mt-5" />
      <div className="z-20 w-16 h-22 relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-b from-[#D4A017] to-[#A05A28] shadow-md" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)' }} />
      </div>
    </motion.div>
  )
}

function Food2D({ type, selectedToppings = [] }: { type: string; selectedToppings?: string[] }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden select-none">
      <div className="relative w-60 h-28 flex items-center justify-center mt-4">
        <div className="absolute w-52 h-10 bg-black/15 blur-md rounded-full bottom-1" />
        <div className="absolute w-56 h-18 bg-[#8B5E3C] border-b-[5px] border-[#6B3F1E] rounded-full flex items-center justify-center shadow-lg">
          <div className="w-[88%] h-[82%] bg-[#7A4F2D] rounded-full flex items-center justify-center border-b-[1.5px] border-[#5C361B]/40" />
        </div>
        <div className="absolute bottom-5 flex flex-col items-center justify-center">
          {type === 'burger' && <Burger2D selectedToppings={selectedToppings} />}
          {type === 'pizza' && <Pizza2D selectedToppings={selectedToppings} />}
          {type === 'sandwich' && <Sandwich2D selectedToppings={selectedToppings} />}
          {type === 'dessert' && <Dessert2D selectedToppings={selectedToppings} />}
        </div>
      </div>
    </div>
  )
}

// ─── Organic Noise Perturbation ────────────────────────────────────────────────
function perturbGeometry(geometry: THREE.BufferGeometry, scale: number = 0.04, frequency: number = 6) {
  const position = geometry.attributes.position
  if (!position) return geometry
  const vertex = new THREE.Vector3()
  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i)
    const noise = (
      Math.sin(vertex.x * frequency + 1) * Math.cos(vertex.y * frequency + 2) +
      Math.sin(vertex.y * frequency + 3) * Math.cos(vertex.z * frequency + 4) +
      Math.sin(vertex.z * frequency + 5) * Math.cos(vertex.x * frequency + 6)
    ) * scale
    const length = vertex.length()
    if (length > 0) vertex.addScaledVector(vertex.clone().normalize(), noise)
    position.setXYZ(i, vertex.x, vertex.y, vertex.z)
  }
  geometry.computeVertexNormals()
  return geometry
}

// ─── Procedural Food Models (High Realism) ─────────────────────────────────────

// ── Burger ──────────────────────────────────────────────────────────────────────
function BurgerModel({ exploded, explodeProgress, visibleLayers, onLayerClick }: {
  exploded: boolean; explodeProgress: number; visibleLayers: Set<string>; onLayerClick: (id: string) => void
}) {
  const layers = useMemo(() => getIngredientLayers('burger'), [])
  const refs = useRef<Record<string, THREE.Group>>({})
  const currentPositions = useRef<Record<string, number>>({})
  const groupRef = useRef<THREE.Group>(null)

  const geometries = useMemo(() => {
    const topBun = new THREE.SphereGeometry(0.72, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.52)
    perturbGeometry(topBun, 0.018, 7)
    const botBun = new THREE.SphereGeometry(0.72, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.55)
    perturbGeometry(botBun, 0.012, 7)
    const patty = new THREE.CylinderGeometry(0.7, 0.72, 0.16, 16)
    perturbGeometry(patty, 0.028, 14)
    const cheese = new THREE.BoxGeometry(1.3, 0.02, 1.1, 3, 1, 3)
    perturbGeometry(cheese, 0.006, 10)
    const lettuce1 = new THREE.PlaneGeometry(1.35, 1.05, 8, 8)
    const pos1 = lettuce1.attributes.position
    for (let i = 0; i < pos1.count; i++) {
      const x = pos1.getX(i), y = pos1.getY(i)
      const edge = Math.max(Math.abs(x), Math.abs(y))
      const ruffle = Math.sin(x * 22) * Math.cos(y * 22) * 0.035
      const droop = edge > 0.5 ? -(edge - 0.5) * 0.15 : 0
      pos1.setZ(i, ruffle + droop)
    }
    lettuce1.computeVertexNormals()
    const tomato = new THREE.CylinderGeometry(0.65, 0.65, 0.05, 16)
    perturbGeometry(tomato, 0.004, 10)
    return { topBun, botBun, patty, cheese, lettuce1, tomato }
  }, [])

  useEffect(() => {
    layers.forEach(l => {
      currentPositions.current[l.id] = l.defaultY + (l.explodedY - l.defaultY) * explodeProgress
    })
  }, [explodeProgress, layers])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.03)
    layers.forEach(l => {
      const ref = refs.current[l.id]
      if (!ref) return
      const target = currentPositions.current[l.id] ?? l.defaultY
      ref.position.y = THREE.MathUtils.lerp(ref.position.y, target, 8 * dt)
    })
    // Perspective tilt during explode
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, explodeProgress * 0.15, 6 * dt)
    }
  })

  const handleClick = useCallback((id: string) => (e: any) => {
    e.stopPropagation(); onLayerClick(id)
  }, [onLayerClick])

  return (
    <group ref={groupRef} scale={1.1}>
      {/* Bottom Bun */}
      {visibleLayers.has('bottom-bun') && (
        <group ref={el => { if (el) refs.current['bottom-bun'] = el }} position={[0, -0.42, 0]} onClick={handleClick('bottom-bun')}>
          <mesh geometry={geometries.botBun}>
            <meshPhysicalMaterial color="#C88B3E" roughness={0.62} clearcoat={0.18} clearcoatRoughness={0.35} envMapIntensity={0.75} />
          </mesh>
          {/* Toasted sesame seeds on bottom */}
          {[0,1,2,3,4,5].map(i => (
            <mesh key={`seed-b-${i}`} position={[Math.cos(i*Math.PI/3)*0.38, -0.28, Math.sin(i*Math.PI/3)*0.38]}
              rotation={[0.3, i*0.5, 0.2]}>
              <sphereGeometry args={[0.022, 6, 6]} />
              <meshPhysicalMaterial color="#E8D5A0" roughness={0.25} clearcoat={0.25} metalness={0.08} />
            </mesh>
          ))}
          {/* Butter glaze on bottom bun */}
          <mesh position={[0, -0.35, 0]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 0.005, 16]} />
            <meshPhysicalMaterial color="#FFE082" roughness={0.08} clearcoat={0.9} transparent opacity={0.25} />
          </mesh>
        </group>
      )}

      {/* Patty */}
      {visibleLayers.has('patty') && (
        <group ref={el => { if (el) refs.current['patty'] = el }} position={[0, 0.12, 0]} onClick={handleClick('patty')}>
          <mesh geometry={geometries.patty}>
            <meshPhysicalMaterial color="#4A2511" roughness={0.85} metalness={0.03} clearcoat={0.08} envMapIntensity={0.35} />
          </mesh>
          {/* Grill marks */}
          {[-0.35, -0.12, 0.12, 0.35].map((x, i) => (
            <mesh key={`grill-${i}`} position={[x, 0.085, 0]} rotation={[0, 0.15, 0]}>
              <boxGeometry args={[0.52, 0.004, 0.032]} />
              <meshStandardMaterial color="#1A0804" roughness={1} />
            </mesh>
          ))}
          {/* Charred edge detail */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            return (
              <mesh key={`char-${i}`} position={[Math.cos(angle)*0.55, 0.082, Math.sin(angle)*0.55]}>
                <sphereGeometry args={[0.015 + Math.random()*0.01, 4, 4]} />
                <meshStandardMaterial color="#1A0804" roughness={0.95} />
              </mesh>
            )
          })}
          {/* Juicy grease sheen */}
          <mesh position={[0.15, 0.082, 0.2]}>
            <circleGeometry args={[0.06, 16]} />
            <meshPhysicalMaterial color="#5C2E15" roughness={0.15} clearcoat={0.8} transparent opacity={0.6} />
          </mesh>
        </group>
      )}

      {/* Sauce */}
      {visibleLayers.has('sauce') && (
        <group ref={el => { if (el) refs.current['sauce'] = el }} position={[0, 0.28, 0]} onClick={handleClick('sauce')}>
          <mesh>
            <cylinderGeometry args={[0.68, 0.68, 0.018, 16]} />
            <meshPhysicalMaterial color="#D32F2F" roughness={0.3} transparent opacity={0.85} clearcoat={0.45} clearcoatRoughness={0.2} />
          </mesh>
          {/* Sauce drips down the sides */}
          {[
            [0.45, -0.04, 0.4, 0.035], [-0.35, -0.06, -0.45, 0.04],
            [0.2, -0.05, -0.5, 0.032], [-0.5, -0.03, 0.15, 0.028],
            [0.55, -0.04, -0.1, 0.03], [-0.15, -0.07, 0.52, 0.038]
          ].map(([x, y, z, r], i) => (
            <mesh key={`drip-${i}`} position={[x as number, y as number, z as number]}>
              <sphereGeometry args={[r as number, 8, 8]} />
              <meshPhysicalMaterial color="#B71C1C" roughness={0.25} transparent opacity={0.75} clearcoat={0.3} />
            </mesh>
          ))}
        </group>
      )}

      {/* Cheese */}
      {visibleLayers.has('cheese') && (
        <group ref={el => { if (el) refs.current['cheese'] = el }} position={[0, 0.30, 0]} onClick={handleClick('cheese')}>
          <mesh geometry={geometries.cheese}>
            <meshPhysicalMaterial color="#FF9100" roughness={0.22} clearcoat={0.55} clearcoatRoughness={0.12} envMapIntensity={0.9} />
          </mesh>
          {/* Melted cheese drips hanging off edges */}
          {[
            [0.52, -0.04, 0.42, 0.055], [-0.45, -0.06, -0.38, 0.065],
            [0.3, -0.05, -0.5, 0.05], [-0.2, -0.07, 0.48, 0.07],
            [0.58, -0.03, -0.15, 0.045], [-0.55, -0.04, 0.2, 0.052]
          ].map(([x, y, z, r], i) => (
            <mesh key={`cdrip-${i}`} position={[x as number, y as number, z as number]}>
              <sphereGeometry args={[r as number, 8, 6]} />
              <meshPhysicalMaterial color="#FFA000" roughness={0.18} clearcoat={0.65} clearcoatRoughness={0.1} />
            </mesh>
          ))}
        </group>
      )}

      {/* Lettuce */}
      {visibleLayers.has('lettuce') && (
        <group ref={el => { if (el) refs.current['lettuce'] = el }} position={[0, 0.34, 0]} onClick={handleClick('lettuce')}>
          <mesh geometry={geometries.lettuce1} rotation={[-Math.PI/6, 0, 0]}>
            <meshPhysicalMaterial color="#2E7D32" roughness={0.68} clearcoat={0.18} side={THREE.DoubleSide} envMapIntensity={0.4} />
          </mesh>
          {/* Ruffled edge frills */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const r = 0.5 + Math.random() * 0.18
            return (
              <mesh key={`frill-${i}`} position={[Math.cos(angle)*r, 0.02, Math.sin(angle)*r]}
                rotation={[Math.random()*0.6 - 0.3, angle, Math.random()*0.4]}>
                <sphereGeometry args={[0.07 + Math.random()*0.04, 6, 4]} />
                <meshPhysicalMaterial color={i % 2 === 0 ? "#388E3C" : "#43A047"} roughness={0.7} side={THREE.DoubleSide} transparent opacity={0.92} />
              </mesh>
            )
          })}
        </group>
      )}

      {/* Tomato */}
      {visibleLayers.has('tomato') && (
        <group ref={el => { if (el) refs.current['tomato'] = el }} position={[0, 0.38, 0]} onClick={handleClick('tomato')}>
          <mesh geometry={geometries.tomato}>
            <meshPhysicalMaterial color="#C62828" roughness={0.18} clearcoat={0.65} clearcoatRoughness={0.08} envMapIntensity={0.8} />
          </mesh>
          {/* Translucent pulp layer */}
          <mesh position={[0, 0.028, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.003, 16]} />
            <meshPhysicalMaterial color="#EF5350" roughness={0.06} transparent opacity={0.5} clearcoat={0.3} />
          </mesh>
          {/* Seeds */}
          {[0.2, -0.18, 0.12, -0.28, 0.05].map((x, i) => (
            <mesh key={`seed-${i}`} position={[x, 0.035, (i % 2 === 0 ? 0.15 : -0.15)]}>
              <sphereGeometry args={[0.012, 6, 6]} />
              <meshPhysicalMaterial color="#F9A825" roughness={0.15} clearcoat={0.4} />
            </mesh>
          ))}
        </group>
      )}

      {/* Top Bun */}
      {visibleLayers.has('top-bun') && (
        <group ref={el => { if (el) refs.current['top-bun'] = el }} position={[0, 0.52, 0]} onClick={handleClick('top-bun')}>
          <mesh geometry={geometries.topBun}>
            <meshPhysicalMaterial color="#D4943A" roughness={0.5} clearcoat={0.3} clearcoatRoughness={0.25} envMapIntensity={1.0} />
          </mesh>
          {/* Sesame seeds on top */}
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i / 14) * Math.PI * 2
            const r = 0.22 + (i % 3) * 0.1
            return (
              <mesh key={`seed-t-${i}`}
                position={[Math.cos(angle)*r, 0.14 + Math.sin(angle*3)*0.02, Math.sin(angle)*r]}
                rotation={[0.4 + Math.random()*0.3, angle, 0.1]}>
                <sphereGeometry args={[0.024, 6, 6]} />
                <meshPhysicalMaterial color="#FFF8DC" roughness={0.25} clearcoat={0.35} metalness={0.05} />
              </mesh>
            )
          })}
          {/* Bun glaze highlight */}
          <mesh position={[0, 0.18, 0.15]} rotation={[0.5, 0, 0]}>
            <circleGeometry args={[0.2, 24]} />
            <meshPhysicalMaterial color="#E8A840" roughness={0.1} clearcoat={0.9} transparent opacity={0.35} />
          </mesh>
        </group>
      )}
    </group>
  )
}

// ── Pizza ───────────────────────────────────────────────────────────────────────
function PizzaModel({ exploded, explodeProgress, visibleLayers, onLayerClick }: {
  exploded: boolean; explodeProgress: number; visibleLayers: Set<string>; onLayerClick: (id: string) => void
}) {
  const layers = useMemo(() => getIngredientLayers('pizza'), [])
  const refs = useRef<Record<string, THREE.Group>>({})
  const currentPositions = useRef<Record<string, number>>({})
  const groupRef = useRef<THREE.Group>(null)

  const crustGeom = useMemo(() => {
    const g = new THREE.TorusGeometry(0.88, 0.065, 8, 32)
    perturbGeometry(g, 0.022, 9)
    return g
  }, [])

  useEffect(() => {
    layers.forEach(l => {
      currentPositions.current[l.id] = l.defaultY + (l.explodedY - l.defaultY) * explodeProgress
    })
  }, [explodeProgress, layers])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.03)
    layers.forEach(l => {
      const ref = refs.current[l.id]
      if (!ref) return
      const target = currentPositions.current[l.id] ?? l.defaultY
      ref.position.y = THREE.MathUtils.lerp(ref.position.y, target, 8 * dt)
    })
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, explodeProgress * 0.18, 6 * dt)
    }
  })

  const handleClick = useCallback((id: string) => (e: any) => {
    e.stopPropagation(); onLayerClick(id)
  }, [onLayerClick])

  return (
    <group ref={groupRef} scale={1.15}>
      {visibleLayers.has('crust') && (
        <group ref={el => { if (el) refs.current['crust'] = el }} position={[0, 0.02, 0]} onClick={handleClick('crust')}>
          {/* Puffy crust ring */}
          <mesh rotation={[Math.PI/2, 0, 0]} geometry={crustGeom}>
            <meshPhysicalMaterial color="#C47A3A" roughness={0.72} clearcoat={0.12} envMapIntensity={0.5} />
          </mesh>
          {/* Charred leopard spots on crust */}
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * Math.PI * 2 + 0.15
            const r = 0.88
            return (
              <mesh key={`char-${i}`} position={[Math.cos(angle)*r, 0.05, Math.sin(angle)*r]}>
                <sphereGeometry args={[0.03 + Math.random()*0.025, 6, 6]} />
                <meshStandardMaterial color="#3A1505" roughness={0.95} />
              </mesh>
            )
          })}
          {/* Dough base */}
          <mesh>
            <cylinderGeometry args={[0.86, 0.86, 0.065, 20]} />
            <meshPhysicalMaterial color="#E0A868" roughness={0.68} clearcoat={0.08} envMapIntensity={0.4} />
          </mesh>
          {/* Flour dusting */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = i * 0.9
            return (
              <mesh key={`flour-${i}`} position={[Math.cos(angle)*0.5, 0.035, Math.sin(angle)*0.5]}>
                <circleGeometry args={[0.045, 12]} />
                <meshStandardMaterial color="#F5F0E0" roughness={0.9} transparent opacity={0.4} />
              </mesh>
            )
          })}
        </group>
      )}

      {visibleLayers.has('sauce') && (
        <group ref={el => { if (el) refs.current['sauce'] = el }} position={[0, 0.055, 0]} onClick={handleClick('sauce')}>
          <mesh>
            <cylinderGeometry args={[0.82, 0.82, 0.022, 20]} />
            <meshPhysicalMaterial color="#B71C1C" roughness={0.32} clearcoat={0.35} envMapIntensity={0.65} />
          </mesh>
          {/* Sauce texture bumps */}
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = i * 0.65
            const r = 0.2 + Math.random() * 0.5
            return (
              <mesh key={`sauce-${i}`} position={[Math.cos(angle)*r, 0.012, Math.sin(angle)*r]}>
                <sphereGeometry args={[0.04 + Math.random()*0.035, 8, 6]} />
                <meshPhysicalMaterial color="#C62828" roughness={0.28} clearcoat={0.3} />
              </mesh>
            )
          })}
          {/* Herb flecks in sauce */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = i * 1.2
            return (
              <mesh key={`herb-${i}`} position={[Math.cos(angle)*0.4, 0.014, Math.sin(angle)*0.4]} rotation={[Math.PI/2, angle, 0]}>
                <planeGeometry args={[0.03, 0.01]} />
                <meshStandardMaterial color="#2E7D32" roughness={0.8} transparent opacity={0.6} />
              </mesh>
            )
          })}
        </group>
      )}

      {visibleLayers.has('cheese') && (
        <group ref={el => { if (el) refs.current['cheese'] = el }} position={[0, 0.08, 0]} onClick={handleClick('cheese')}>
          <mesh>
            <cylinderGeometry args={[0.8, 0.8, 0.028, 20]} />
            <meshPhysicalMaterial color="#FFF9C4" roughness={0.18} clearcoat={0.65} clearcoatRoughness={0.08} envMapIntensity={1.0} />
          </mesh>
          {/* Melted cheese bubbles */}
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * Math.PI * 2
            const r = 0.15 + Math.random() * 0.55
            return (
              <mesh key={`bubble-${i}`} position={[Math.cos(angle)*r, 0.018, Math.sin(angle)*r]}>
                <sphereGeometry args={[0.025 + Math.random()*0.03, 8, 8]} />
                <meshPhysicalMaterial color={i % 3 === 0 ? "#FFE082" : "#FFF9C4"} roughness={0.12} clearcoat={0.75} />
              </mesh>
            )
          })}
          {/* Browned cheese spots */}
          {[0.3, -0.2, 0.45, -0.4, 0.1, -0.35].map((x, i) => (
            <mesh key={`brown-${i}`} position={[x, 0.02, (i%2===0?0.3:-0.3)]}>
              <circleGeometry args={[0.06, 12]} />
              <meshPhysicalMaterial color="#D4A030" roughness={0.25} clearcoat={0.5} transparent opacity={0.7} />
            </mesh>
          ))}
          {/* Cheese pull strings at edges */}
          {Array.from({ length: 4 }).map((_, i) => {
            const angle = (i / 4) * Math.PI * 2 + 0.5
            return (
              <mesh key={`pull-${i}`} position={[Math.cos(angle)*0.72, 0.01, Math.sin(angle)*0.72]} rotation={[0, angle, Math.PI/6]}>
                <cylinderGeometry args={[0.008, 0.012, 0.12, 6]} />
                <meshPhysicalMaterial color="#FFE082" roughness={0.15} clearcoat={0.6} transparent opacity={0.7} />
              </mesh>
            )
          })}
        </group>
      )}

      {visibleLayers.has('toppings') && (
        <group ref={el => { if (el) refs.current['toppings'] = el }} position={[0, 0.12, 0]} onClick={handleClick('toppings')}>
          {/* Pepperoni slices */}
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2 + 0.4
            const r = 0.2 + (i % 2) * 0.25
            const cupped = new THREE.CylinderGeometry(0.08, 0.08, 0.014, 10)
            const cuppedPos = cupped.attributes.position
            for (let j = 0; j < cuppedPos.count; j++) {
              const v = new THREE.Vector3().fromBufferAttribute(cuppedPos, j)
              const dist = Math.sqrt(v.x*v.x + v.z*v.z)
              if (v.y > 0) v.y -= dist * dist * 0.08
              cuppedPos.setXYZ(j, v.x, v.y, v.z)
            }
            cupped.computeVertexNormals()
            return (
              <group key={`pep-${i}`} position={[Math.cos(angle)*r, 0.01, Math.sin(angle)*r]} rotation={[0, angle*2, 0]}>
                <mesh geometry={cupped}>
                  <meshPhysicalMaterial color="#9B1B18" roughness={0.28} clearcoat={0.45} envMapIntensity={0.6} />
                </mesh>
                {/* Fat speckles on pepperoni */}
                {[0.025, -0.018, 0.012].map((dx, j) => (
                  <mesh key={j} position={[dx, 0.009, dx*0.7]}>
                    <sphereGeometry args={[0.01 + j*0.003, 6, 6]} />
                    <meshPhysicalMaterial color="#E8706A" roughness={0.15} clearcoat={0.3} />
                  </mesh>
                ))}
                {/* Grease pooling around pepperoni */}
                <mesh position={[0, 0.005, 0]}>
                  <cylinderGeometry args={[0.085, 0.085, 0.002, 10]} />
                  <meshPhysicalMaterial color="#8E1F18" roughness={0.08} clearcoat={0.9} transparent opacity={0.3} />
                </mesh>
              </group>
            )
          })}
        </group>
      )}
    </group>
  )
}

// ── Sandwich ────────────────────────────────────────────────────────────────────
function SandwichModel({ exploded, explodeProgress, visibleLayers, onLayerClick }: {
  exploded: boolean; explodeProgress: number; visibleLayers: Set<string>; onLayerClick: (id: string) => void
}) {
  const layers = useMemo(() => getIngredientLayers('sandwich'), [])
  const refs = useRef<Record<string, THREE.Group>>({})
  const currentPositions = useRef<Record<string, number>>({})
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    layers.forEach(l => {
      currentPositions.current[l.id] = l.defaultY + (l.explodedY - l.defaultY) * explodeProgress
    })
  }, [explodeProgress, layers])

  const s = 1.0

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.03)
    layers.forEach(l => {
      const ref = refs.current[l.id]
      if (!ref) return
      const target = currentPositions.current[l.id] ?? l.defaultY
      ref.position.y = THREE.MathUtils.lerp(ref.position.y, target, 8 * dt)
    })
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, explodeProgress * 0.12, 6 * dt)
    }
  })

  const handleClick = useCallback((id: string) => (e: any) => {
    e.stopPropagation(); onLayerClick(id)
  }, [onLayerClick])

  return (
    <group ref={groupRef} scale={s}>
      {visibleLayers.has('bottom-bread') && (
        <group ref={el => { if (el) refs.current['bottom-bread'] = el }} position={[0, -0.28, 0]} onClick={handleClick('bottom-bread')}>
          <RoundedBox args={[1.4, 0.18, 0.9]} radius={0.06}>
            <meshPhysicalMaterial color="#C68E56" roughness={0.65} clearcoat={0.18} envMapIntensity={0.5} />
          </RoundedBox>
        </group>
      )}

      {visibleLayers.has('filling') && (
        <group ref={el => { if (el) refs.current['filling'] = el }} position={[0, 0.14, 0]} onClick={handleClick('filling')}>
          <mesh>
            <boxGeometry args={[1.38, 0.06, 0.88]} />
            <meshPhysicalMaterial color="#7A5A35" roughness={0.72} clearcoat={0.12} />
          </mesh>
          {[0,1,2].map(i => (
            <mesh key={`chicken-${i}`} position={[(i-1)*0.35, 0.035, 0]} rotation={[0, 0.2*i, 0]}>
              <boxGeometry args={[0.25, 0.008, 0.15]} />
              <meshPhysicalMaterial color="#8B6914" roughness={0.55} clearcoat={0.15} />
            </mesh>
          ))}
        </group>
      )}

      {visibleLayers.has('cheese') && (
        <group ref={el => { if (el) refs.current['cheese'] = el }} position={[0, 0.18, 0]} onClick={handleClick('cheese')}>
          <mesh>
            <boxGeometry args={[1.35, 0.015, 0.86]} />
            <meshPhysicalMaterial color="#FFB300" roughness={0.18} clearcoat={0.55} />
          </mesh>
        </group>
      )}

      {visibleLayers.has('lettuce') && (
        <group ref={el => { if (el) refs.current['lettuce'] = el }} position={[0, 0.22, 0]} onClick={handleClick('lettuce')}>
          <mesh rotation={[-0.2, 0, 0]}>
            <planeGeometry args={[1.3, 0.9, 14, 14]} />
            <meshPhysicalMaterial color="#2E7D32" roughness={0.65} side={THREE.DoubleSide} clearcoat={0.18} />
          </mesh>
        </group>
      )}

      {visibleLayers.has('tomato') && (
        <group ref={el => { if (el) refs.current['tomato'] = el }} position={[0, 0.24, 0]} onClick={handleClick('tomato')}>
          <mesh>
            <boxGeometry args={[1.2, 0.025, 0.7]} />
            <meshPhysicalMaterial color="#C62828" roughness={0.18} clearcoat={0.55} />
          </mesh>
        </group>
      )}

      {visibleLayers.has('top-bread') && (
        <group ref={el => { if (el) refs.current['top-bread'] = el }} position={[0, 0.26, 0]} onClick={handleClick('top-bread')}>
          <RoundedBox args={[1.4, 0.18, 0.9]} radius={0.06}>
            <meshPhysicalMaterial color="#D69C65" roughness={0.6} clearcoat={0.22} envMapIntensity={0.6} />
          </RoundedBox>
          {/* Toasted sesame seeds on top */}
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i} position={[(Math.random()-0.5)*1.0, 0.1, (Math.random()-0.5)*0.6]}>
              <sphereGeometry args={[0.022, 6, 6]} />
              <meshPhysicalMaterial color="#FFF1C4" roughness={0.3} clearcoat={0.2} metalness={0.05} />
            </mesh>
          ))}
          {/* Toasted crust edge detail */}
          {Array.from({ length: 6 }).map((_, i) => {
            const x = (i - 2.5) * 0.25
            return (
              <mesh key={`crust-${i}`} position={[x, 0.09, 0.45]}>
                <sphereGeometry args={[0.015, 4, 4]} />
                <meshStandardMaterial color="#B8860B" roughness={0.7} />
              </mesh>
            )
          })}
        </group>
      )}
    </group>
  )
}

// ── Dessert ─────────────────────────────────────────────────────────────────────
function DessertModel({ exploded, explodeProgress, visibleLayers, onLayerClick }: {
  exploded: boolean; explodeProgress: number; visibleLayers: Set<string>; onLayerClick: (id: string) => void
}) {
  const layers = useMemo(() => getIngredientLayers('dessert'), [])
  const refs = useRef<Record<string, THREE.Group>>({})
  const currentPositions = useRef<Record<string, number>>({})
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    layers.forEach(l => {
      currentPositions.current[l.id] = l.defaultY + (l.explodedY - l.defaultY) * explodeProgress
    })
  }, [explodeProgress, layers])

  const s = 1.1

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.03)
    layers.forEach(l => {
      const ref = refs.current[l.id]
      if (!ref) return
      const target = currentPositions.current[l.id] ?? l.defaultY
      ref.position.y = THREE.MathUtils.lerp(ref.position.y, target, 8 * dt)
    })
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, explodeProgress * 0.12, 6 * dt)
    }
  })

  const handleClick = useCallback((id: string) => (e: any) => {
    e.stopPropagation(); onLayerClick(id)
  }, [onLayerClick])

  return (
    <group ref={groupRef} scale={s}>
      {visibleLayers.has('cone') && (
        <group ref={el => { if (el) refs.current['cone'] = el }} position={[0, -0.45, 0]} onClick={handleClick('cone')}>
          <mesh>
            <coneGeometry args={[0.42, 0.9, 10]} />
            <meshPhysicalMaterial color="#C17F38" roughness={0.6} clearcoat={0.15} />
          </mesh>
          {/* Waffle cone grid pattern */}
          {[-0.2, 0, 0.2].map((y, i) => (
            <mesh key={i} position={[0, y, 0]} rotation={[Math.PI/2, 0, i*0.5]}>
              <torusGeometry args={[0.22 + i*0.08, 0.008, 4, 12]} />
              <meshStandardMaterial color="#8E541E" roughness={0.75} />
            </mesh>
          ))}
          {/* Cone rim detail */}
          <mesh position={[0, 0.0, 0]} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[0.42, 0.015, 6, 16]} />
            <meshPhysicalMaterial color="#A66B2A" roughness={0.5} clearcoat={0.2} />
          </mesh>
        </group>
      )}

      {visibleLayers.has('scoop1') && (
        <group ref={el => { if (el) refs.current['scoop1'] = el }} position={[0, 0.15, 0]} onClick={handleClick('scoop1')}>
          <mesh>
            <sphereGeometry args={[0.48, 14, 14]} />
            <meshPhysicalMaterial color="#FDFBF7" roughness={0.5} clearcoat={0.3} clearcoatRoughness={0.2} envMapIntensity={1.0} />
          </mesh>
          {/* Vanilla bean specks */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={`speck-${i}`} position={[Math.cos(i*0.8)*0.35, 0.1, Math.sin(i*0.8)*0.35]}>
              <sphereGeometry args={[0.01, 4, 4]} />
              <meshStandardMaterial color="#2C1810" roughness={0.8} />
            </mesh>
          ))}
          {/* Cream swirl ridges */}
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2
            return (
              <mesh key={`ridge-${i}`} position={[Math.cos(angle)*0.3, 0.15, Math.sin(angle)*0.3]} rotation={[0, angle, Math.PI/4]}>
                <cylinderGeometry args={[0.008, 0.012, 0.15, 6]} />
                <meshPhysicalMaterial color="#FFF8E1" roughness={0.4} clearcoat={0.3} transparent opacity={0.6} />
              </mesh>
            )
          })}
        </group>
      )}

      {visibleLayers.has('scoop2') && (
        <group ref={el => { if (el) refs.current['scoop2'] = el }} position={[0, 0.62, 0]} onClick={handleClick('scoop2')}>
          <mesh>
            <sphereGeometry args={[0.42, 14, 14]} />
            <meshPhysicalMaterial color="#3E2723" roughness={0.55} clearcoat={0.35} clearcoatRoughness={0.15} envMapIntensity={0.9} />
          </mesh>
          {/* Chocolate drizzle */}
          {[0,1,2,3].map(i => (
            <mesh key={`drizzle-${i}`} position={[Math.cos(i*1.8)*0.25, 0.2, Math.sin(i*1.8)*0.25]} rotation={[0.3, i, 0]}>
              <torusGeometry args={[0.12, 0.018, 4, 10, Math.PI]} />
              <meshPhysicalMaterial color="#1A0A04" roughness={0.3} clearcoat={0.5} />
            </mesh>
          ))}
          {/* Chocolate chunks */}
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={`chunk-${i}`} position={[Math.cos(i*1.5)*0.2, 0.25, Math.sin(i*1.5)*0.2]} rotation={[Math.random(), Math.random(), 0]}>
              <boxGeometry args={[0.04, 0.03, 0.025]} />
              <meshPhysicalMaterial color="#4E342E" roughness={0.4} clearcoat={0.2} />
            </mesh>
          ))}
        </group>
      )}

      {visibleLayers.has('topping') && (
        <group ref={el => { if (el) refs.current['topping'] = el }} position={[0, 1.0, 0]} onClick={handleClick('topping')}>
          <mesh>
            <sphereGeometry args={[0.14, 10, 10]} />
            <meshPhysicalMaterial color="#D32F2F" roughness={0.15} clearcoat={0.7} clearcoatRoughness={0.08} />
          </mesh>
          {/* Strawberry seeds */}
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * Math.PI * 2
            const r = 0.08
            return (
              <mesh key={`seed-${i}`} position={[Math.cos(angle)*r, 0.08, Math.sin(angle)*r]}>
                <sphereGeometry args={[0.006, 4, 4]} />
                <meshStandardMaterial color="#FDD835" roughness={0.3} />
              </mesh>
            )
          })}
          {/* Leaf stem */}
          <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.008, 0.012, 0.12, 6]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.7} />
          </mesh>
          {/* Leaf */}
          <mesh position={[0.04, 0.14, 0]} rotation={[0.3, 0.5, 0.2]}>
            <planeGeometry args={[0.08, 0.05]} />
            <meshPhysicalMaterial color="#388E3C" roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  )
}

const BurgerMemo = memo(BurgerModel)
const PizzaMemo = memo(PizzaModel)
const SandwichMemo = memo(SandwichModel)
const DessertMemo = memo(DessertModel)

// ─── Topping Physics System ────────────────────────────────────────────────────
interface ToppingInstance {
  id: string; toppingId: string
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
  targetX: number; targetY: number; targetZ: number
  rotX: number; rotY: number; rotZ: number
  rotVx: number; rotVy: number; rotVz: number
  scale: number; targetScale: number
  status: 'falling' | 'landed' | 'removing'
  elasticity: number; bounceCount: number
}

function getToppingHeight(dishType: string, toppingId: string): number {
  if (dishType === 'pizza') return 0.10 + Math.random() * 0.04
  if (dishType === 'burger') {
    if (toppingId === 'lettuce') return -0.12
    if (toppingId === 'tomato') return 0.02
    if (toppingId === 'cheese') return 0.22
    if (toppingId === 'avocado') return 0.26
    if (toppingId === 'bacon') return 0.28
    if (toppingId === 'onion') return 0.32
    return 0.38
  }
  if (dishType === 'sandwich') {
    if (toppingId === 'lettuce') return -0.09
    if (toppingId === 'tomato') return -0.01
    if (toppingId === 'cheese') return 0.07
    return 0.22
  }
  if (dishType === 'dessert') return 0.58 + Math.random() * 0.05
  return 0.0
}

function ToppingGeometryRender({ toppingId }: { toppingId: string }) {
  const meshes = useMemo(() => {
    switch (toppingId) {
      case 'pepperoni': {
        const geom = new THREE.CylinderGeometry(0.085, 0.085, 0.015, 10)
        const pos = geom.attributes.position
        const v = new THREE.Vector3()
        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(pos, i)
          const dist = Math.sqrt(v.x*v.x + v.z*v.z)
          if (v.y > 0) v.y -= Math.pow(dist, 2) * 0.05
          pos.setXYZ(i, v.x, v.y, v.z)
        }
        geom.computeVertexNormals()
        return (
          <group>
            <mesh geometry={geom}>
              <meshPhysicalMaterial color="#8E1F18" roughness={0.3} clearcoat={0.4} />
            </mesh>
            <mesh position={[0.025, 0.009, 0.02]}>
              <sphereGeometry args={[0.01, 6, 6]} />
              <meshStandardMaterial color="#E85D56" roughness={0.2} />
            </mesh>
            <mesh position={[-0.03, 0.009, -0.015]}>
              <sphereGeometry args={[0.012, 6, 6]} />
              <meshStandardMaterial color="#E85D56" roughness={0.2} />
            </mesh>
          </group>
        )
      }
      case 'mushroom': {
        const capGeom = new THREE.SphereGeometry(0.065, 10, 6, 0, Math.PI*2, 0, Math.PI*0.6)
        perturbGeometry(capGeom, 0.006, 12)
        return (
          <group>
            <mesh position={[0, 0.022, 0]} geometry={capGeom}>
              <meshPhysicalMaterial color="#7D6656" roughness={0.7} clearcoat={0.1} />
            </mesh>
            <mesh position={[0, -0.012, 0]} rotation={[0, 0, 0.15]}>
              <cylinderGeometry args={[0.018, 0.022, 0.065, 8]} />
              <meshStandardMaterial color="#DFCAB2" roughness={0.65} />
            </mesh>
          </group>
        )
      }
      case 'olive': {
        return (
          <group rotation={[Math.PI/2, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.045, 0.018, 6, 12]} />
              <meshPhysicalMaterial color="#121212" roughness={0.15} metalness={0.1} clearcoat={0.3} />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.03, 8]} />
              <meshStandardMaterial color="#C62828" roughness={0.35} />
            </mesh>
          </group>
        )
      }
      case 'lettuce': {
        const leafGeom = new THREE.PlaneGeometry(0.18, 0.14, 6, 6)
        const pos = leafGeom.attributes.position
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i), y = pos.getY(i)
          pos.setZ(i, Math.sin(x*25)*Math.cos(y*25)*0.03)
        }
        leafGeom.computeVertexNormals()
        return (
          <mesh geometry={leafGeom} rotation={[-Math.PI/6, 0, 0]}>
            <meshPhysicalMaterial color="#2E7D32" roughness={0.7} side={THREE.DoubleSide} clearcoat={0.15} />
          </mesh>
        )
      }
      case 'cheese': {
        const cheesePiece = new THREE.BoxGeometry(0.08, 0.018, 0.03)
        perturbGeometry(cheesePiece, 0.004, 10)
        return (
          <mesh geometry={cheesePiece}>
            <meshPhysicalMaterial color="#FF9100" roughness={0.25} clearcoat={0.4} />
          </mesh>
        )
      }
      case 'tomato': {
        const sliceGeom = new THREE.CylinderGeometry(0.11, 0.11, 0.025, 10)
        perturbGeometry(sliceGeom, 0.003, 12)
        return (
          <group>
            <mesh geometry={sliceGeom}>
              <meshPhysicalMaterial color="#C62828" roughness={0.2} clearcoat={0.5} />
            </mesh>
            <mesh position={[0, 0.013, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.002, 10]} />
              <meshPhysicalMaterial color="#E53935" roughness={0.08} transparent opacity={0.5} />
            </mesh>
            <mesh position={[0.04, 0.015, 0.02]}>
              <sphereGeometry args={[0.01, 6, 6]} />
              <meshStandardMaterial color="#FDD835" roughness={0.2} />
            </mesh>
          </group>
        )
      }
      case 'avocado': {
        const avoGeom = new THREE.SphereGeometry(0.08, 10, 6, 0, Math.PI, 0, Math.PI)
        const pos = avoGeom.attributes.position
        for (let i = 0; i < pos.count; i++) {
          const v = new THREE.Vector3().fromBufferAttribute(pos, i)
          v.x *= 0.4; v.z *= 1.6
          pos.setXYZ(i, v.x, v.y, v.z)
        }
        avoGeom.computeVertexNormals()
        return (
          <group>
            <mesh geometry={avoGeom}>
              <meshPhysicalMaterial color="#1B330F" roughness={0.75} clearcoat={0.1} />
            </mesh>
            <mesh position={[0, 0.002, 0]} scale={[0.95, 0.98, 0.95]}>
              <sphereGeometry args={[0.08, 10, 6, 0, Math.PI, 0, Math.PI]} />
              <meshPhysicalMaterial color="#C5E1A5" roughness={0.45} clearcoat={0.2} />
            </mesh>
          </group>
        )
      }
      case 'bacon': {
        const baconGeom = new THREE.BoxGeometry(0.24, 0.012, 0.07, 20, 1, 1)
        const pos = baconGeom.attributes.position
        for (let i = 0; i < pos.count; i++) {
          const v = new THREE.Vector3().fromBufferAttribute(pos, i)
          v.y += Math.sin(v.x*20)*0.02
          pos.setXYZ(i, v.x, v.y, v.z)
        }
        baconGeom.computeVertexNormals()
        return (
          <mesh geometry={baconGeom}>
            <meshPhysicalMaterial color="#5D150B" roughness={0.35} clearcoat={0.2} />
          </mesh>
        )
      }
      case 'onion': {
        return (
          <group rotation={[Math.PI/2, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.08, 0.01, 6, 12]} />
              <meshPhysicalMaterial color="#6A1B29" roughness={0.25} clearcoat={0.3} />
            </mesh>
            <mesh position={[0, 0, 0.001]}>
              <torusGeometry args={[0.075, 0.005, 6, 12]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.55} />
            </mesh>
          </group>
        )
      }
      case 'pepper': {
        const pepperGeom = new THREE.TorusGeometry(0.09, 0.016, 6, 10)
        perturbGeometry(pepperGeom, 0.008, 8)
        return (
          <mesh geometry={pepperGeom} rotation={[Math.PI/2, 0, 0]}>
            <meshPhysicalMaterial color="#2E7D32" roughness={0.18} clearcoat={0.5} />
          </mesh>
        )
      }
      case 'chocolate': {
        const curlGeom = new THREE.TorusGeometry(0.05, 0.014, 4, 10, Math.PI*1.5)
        return (
          <mesh geometry={curlGeom} rotation={[0, 0, Math.PI/4]}>
            <meshPhysicalMaterial color="#3E2723" roughness={0.5} clearcoat={0.3} />
          </mesh>
        )
      }
      default: {
        return (
          <mesh>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshPhysicalMaterial color="#FFA000" roughness={0.45} clearcoat={0.3} />
          </mesh>
        )
      }
    }
  }, [toppingId])
  return meshes
}

const ToppingGeometryMemo = memo(ToppingGeometryRender)

function ToppingMesh({ instance, onDelete }: { instance: ToppingInstance; onDelete: (id: string) => void }) {
  const meshRef = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    if (!meshRef.current) return
    const inst = instance
    const dt = Math.min(delta, 0.025)
    if (inst.status === 'falling') {
      inst.vy -= 18 * dt  // Gravity
      inst.x += inst.vx * dt; inst.y += inst.vy * dt; inst.z += inst.vz * dt
      inst.rotX += inst.rotVx * dt; inst.rotY += inst.rotVy * dt; inst.rotZ += inst.rotVz * dt
      inst.scale = THREE.MathUtils.lerp(inst.scale, inst.targetScale, 10 * dt)
      if (inst.y <= inst.targetY) {
        inst.y = inst.targetY
        if (Math.abs(inst.vy) > 0.8 && inst.bounceCount < 2) {
          inst.vy = -inst.vy * inst.elasticity; inst.vx *= 0.4; inst.vz *= 0.4; inst.rotVx *= 0.5; inst.rotVy *= 0.5; inst.rotVz *= 0.5; inst.bounceCount++
        } else {
          inst.vy=0; inst.vx=0; inst.vz=0; inst.rotVx=0; inst.rotVy=0; inst.rotVz=0; inst.status = 'landed'
        }
      }
    } else if (inst.status === 'landed') {
      inst.x = THREE.MathUtils.lerp(inst.x, inst.targetX, 12*dt)
      inst.y = THREE.MathUtils.lerp(inst.y, inst.targetY, 12*dt)
      inst.z = THREE.MathUtils.lerp(inst.z, inst.targetZ, 12*dt)
      inst.scale = THREE.MathUtils.lerp(inst.scale, inst.targetScale, 12*dt)
    } else if (inst.status === 'removing') {
      inst.x += inst.vx*dt; inst.y += inst.vy*dt; inst.z += inst.vz*dt
      inst.vy += 6*dt  // Gentle upward drift
      inst.vx *= 0.98; inst.vz *= 0.98  // Air resistance
      inst.rotX += inst.rotVx*dt; inst.rotY += inst.rotVy*dt; inst.rotZ += inst.rotVz*dt
      inst.rotVx *= 0.97; inst.rotVy *= 0.97; inst.rotVz *= 0.97  // Dampen rotation
      inst.scale = THREE.MathUtils.lerp(inst.scale, 0, 10*dt)
      if (inst.scale < 0.015 || inst.y > 6.0) onDelete(inst.id)
    }
    meshRef.current.position.set(inst.x, inst.y, inst.z)
    meshRef.current.rotation.set(inst.rotX, inst.rotY, inst.rotZ)
    meshRef.current.scale.setScalar(inst.scale)
  })
  return (
    <group ref={meshRef}>
      <ToppingGeometryMemo toppingId={instance.toppingId} />
    </group>
  )
}

function PhysicsToppings({ type, selectedToppings }: { type: string; selectedToppings: string[] }) {
  const [instances, setInstances] = useState<ToppingInstance[]>([])
  const handleDelete = useCallback((id: string) => { setInstances(prev => prev.filter(i => i.id !== id)) }, [])

  useEffect(() => {
    setInstances(prev => {
      const next = [...prev]
      selectedToppings.forEach(toppingId => {
        const active = next.some(i => i.toppingId === toppingId && i.status !== 'removing')
        if (!active) {
          for (let i = 0; i < 5; i++) {
            const id = `${toppingId}-${i}-${Math.random()}`
            const r = 0.10 + Math.random()*0.42
            const theta = (i*(Math.PI*2)/5) + (Math.random()-0.5)*0.5
            const targetX = r*Math.cos(theta), targetZ = r*Math.sin(theta)
            const targetY = getToppingHeight(type, toppingId)
            // Staggered fall: each piece drops slightly after the previous
            const staggerDelay = i * 0.08
            next.push({
              id, toppingId,
              x: targetX+(Math.random()-0.5)*0.4, y: 3.5+Math.random()*1.0+staggerDelay*3, z: targetZ+(Math.random()-0.5)*0.4,
              vx: (Math.random()-0.5)*0.6, vy: 0.5+Math.random()*1.0, vz: (Math.random()-0.5)*0.6,
              targetX, targetY, targetZ,
              rotX: Math.random()*Math.PI*2, rotY: Math.random()*Math.PI*2, rotZ: Math.random()*Math.PI*2,
              rotVx: (Math.random()-0.5)*12, rotVy: (Math.random()-0.5)*12, rotVz: (Math.random()-0.5)*12,
              scale: 0.01, targetScale: 0.85+Math.random()*0.3,
              status: 'falling', elasticity: 0.35+Math.random()*0.2, bounceCount: 0
            })
          }
        }
      })
      next.forEach(inst => {
        if (!selectedToppings.includes(inst.toppingId) && inst.status !== 'removing') {
          // Fly out laterally with upward drift for a smooth dissolve effect
          inst.status = 'removing'; inst.vy = 3.0+Math.random()*2.0
          const angle = Math.random() * Math.PI * 2
          inst.vx = Math.cos(angle) * (4.0+Math.random()*3.0)
          inst.vz = Math.sin(angle) * (4.0+Math.random()*3.0)
          inst.rotVx = (Math.random()-0.5)*20; inst.rotVy = (Math.random()-0.5)*20; inst.rotVz = (Math.random()-0.5)*20
        }
      })
      return next
    })
  }, [selectedToppings, type])

  return (
    <group>
      {instances.map(inst => <ToppingMesh key={inst.id} instance={inst} onDelete={handleDelete} />)}
    </group>
  )
}

// ─── Camera Rig (driven by transitionProgress) ─────────────────────────────────
function CameraRig({ transitionProgress }: { transitionProgress?: MotionValue<number> | number }) {
  const { camera } = useThree()
  useFrame((_, delta) => {
    let tp = 0
    if (transitionProgress !== undefined) {
      if (typeof transitionProgress === 'number') tp = transitionProgress
      else if (transitionProgress && typeof (transitionProgress as any).get === 'function') tp = (transitionProgress as any).get()
    }
    const dt = Math.min(delta, 0.03)
    const targetZ = THREE.MathUtils.lerp(3.2, 2.6, tp)
    const targetY = THREE.MathUtils.lerp(0.9, 0.6, tp)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 6 * dt)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 6 * dt)
    camera.lookAt(0, 0.2, 0)
  })
  return null
}

// ─── Interactive Drag Rotation ──────────────────────────────────────────────────
function InteractiveGroup({ children, rotationOffset, transitionProgress, explodeProgress }: {
  children: React.ReactNode
  rotationOffset?: MotionValue<number> | number
  transitionProgress?: MotionValue<number> | number
  explodeProgress?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { gl } = useThree()
  const rotState = useRef({ x: 0.12, y: 0.0, targetX: 0.12, targetY: 0.0, vx: 0.0, vy: 0.0, isDragging: false, autoSpin: true })

  const bind = useDrag(
    ({ delta: [dx, dy], down, velocity: [vx, vy], direction: [xDir, yDir] }) => {
      const s = rotState.current; s.isDragging = down
      if (down) {
        s.autoSpin = false
        s.targetY += dx*0.007
        s.targetX = THREE.MathUtils.clamp(s.targetX + dy*0.007, -Math.PI*0.20, Math.PI*0.22)
      } else {
        s.vy = vx*xDir*0.12; s.vx = vy*yDir*0.12
      }
    },
    { target: gl.domElement, eventOptions: { passive: false } }
  )

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const s = rotState.current, dt = Math.min(delta, 0.025)

    // Get transition progress (0 = home, 1 = detail)
    let tp = 0
    if (transitionProgress !== undefined) {
      if (typeof transitionProgress === 'number') tp = transitionProgress
      else if (transitionProgress && typeof (transitionProgress as any).get === 'function') tp = (transitionProgress as any).get()
    }

    if (s.isDragging) {
      s.x = THREE.MathUtils.lerp(s.x, s.targetX, 15*dt)
      s.y = THREE.MathUtils.lerp(s.y, s.targetY, 15*dt)
    } else {
      s.targetX += s.vx*dt*60; s.targetY += s.vy*dt*60
      s.vx *= Math.pow(0.88, dt*60); s.vy *= Math.pow(0.88, dt*60)
      const restX = 0.12
      let offset = 0
      if (rotationOffset !== undefined) {
        if (typeof rotationOffset === 'number') offset = rotationOffset
        else if (rotationOffset && typeof (rotationOffset as any).get === 'function') offset = (rotationOffset as any).get()
      }
      const defaultSpin = state.clock.elapsedTime*0.15 + offset
      if (Math.abs(s.vx) < 0.015 && Math.abs(s.vy) < 0.015) {
        s.targetX = THREE.MathUtils.lerp(s.targetX, restX, 3*dt)
        if (s.autoSpin) { s.targetY = defaultSpin }
        else {
          s.targetY = THREE.MathUtils.lerp(s.targetY, defaultSpin, 1.5*dt)
          if (Math.abs(s.targetY - defaultSpin) < 0.05) s.autoSpin = true
        }
      }
      s.x = THREE.MathUtils.lerp(s.x, s.targetX, 10*dt)
      s.y = THREE.MathUtils.lerp(s.y, s.targetY, 10*dt)
    }
    // Transition-driven 3D transforms
    const extraRotateY = tp * (Math.PI / 3)      // 0 → 60°
    const extraRotateZ = tp * (Math.PI / 12)      // 0 → 15° tilt
    const modelScale = 1 + tp * 0.25               // 1.0 → 1.25

    // Explode-driven perspective distortion (isometric tilt)
    const ep = explodeProgress ?? 0
    const explodeRotateX = ep * 0.35              // tilt back to see between layers
    const explodeRotateZ = ep * 0.08              // slight Z tilt for depth
    const explodeScale = 1 + ep * 0.12            // grow slightly during explode

    groupRef.current.rotation.x = s.x + explodeRotateX
    groupRef.current.rotation.y = s.y + extraRotateY
    groupRef.current.rotation.z = extraRotateZ + explodeRotateZ
    groupRef.current.scale.setScalar(modelScale * explodeScale)
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime*0.8)*0.05 - tp * 0.3
  })

  return <group ref={groupRef}>{children}</group>
}

// ─── Scene Lights (Food Photography Studio) ─────────────────────────────────────
function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[6, 12, 8]} intensity={2.5} />
      <directionalLight position={[-6, 6, -5]} intensity={0.9} color="#FFECD6" />
      <spotLight position={[0, 10, 0]} intensity={1.2} angle={0.35} penumbra={0.8} color="#FFFFFF" />
    </>
  )
}

// ─── Cardboard Box ──────────────────────────────────────────────────────────────
function CardboardBox({ active }: { active: boolean }) {
  const boxRef = useRef<THREE.Group>(null)
  const leftFlapRef = useRef<THREE.Group>(null)
  const rightFlapRef = useRef<THREE.Group>(null)
  const frontFlapRef = useRef<THREE.Group>(null)
  const backFlapRef = useRef<THREE.Group>(null)
  const stateRef = useRef({ y: -2.8, targetY: -2.8, flapAngle: Math.PI*0.45, targetFlapAngle: Math.PI*0.45 })

  useEffect(() => {
    const s = stateRef.current
    if (active) { s.targetY = -0.72; s.targetFlapAngle = Math.PI*0.55 }
    else { s.targetY = -2.8; s.targetFlapAngle = Math.PI*0.05 }
  }, [active])

  useFrame((_, delta) => {
    if (!boxRef.current) return
    const s = stateRef.current, dt = Math.min(delta, 0.03)
    s.y = THREE.MathUtils.lerp(s.y, s.targetY, 7*dt)
    s.flapAngle = THREE.MathUtils.lerp(s.flapAngle, s.targetFlapAngle, 7*dt)
    boxRef.current.position.y = s.y
    if (leftFlapRef.current) leftFlapRef.current.rotation.z = s.flapAngle
    if (rightFlapRef.current) rightFlapRef.current.rotation.z = -s.flapAngle
    if (frontFlapRef.current) frontFlapRef.current.rotation.x = -s.flapAngle
    if (backFlapRef.current) backFlapRef.current.rotation.x = s.flapAngle
  })

  const boxColor = "#C39B78", darkCardboard = "#A9815E"
  return (
    <group ref={boxRef}>
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[2.5, 0.04, 2.5]} />
        <meshStandardMaterial color={boxColor} roughness={0.9} />
      </mesh>
      <mesh position={[-1.25, 0.02, 0]}><boxGeometry args={[0.04, 0.3, 2.5]} /><meshStandardMaterial color={boxColor} roughness={0.9} /></mesh>
      <mesh position={[1.25, 0.02, 0]}><boxGeometry args={[0.04, 0.3, 2.5]} /><meshStandardMaterial color={boxColor} roughness={0.9} /></mesh>
      <mesh position={[0, 0.02, 1.25]}><boxGeometry args={[2.46, 0.3, 0.04]} /><meshStandardMaterial color={boxColor} roughness={0.9} /></mesh>
      <mesh position={[0, 0.02, -1.25]}><boxGeometry args={[2.46, 0.3, 0.04]} /><meshStandardMaterial color={boxColor} roughness={0.9} /></mesh>
      <group ref={leftFlapRef} position={[-1.25, 0.17, 0]}><mesh position={[-0.4, 0.01, 0]}><boxGeometry args={[0.8, 0.02, 2.5]} /><meshStandardMaterial color={darkCardboard} roughness={0.9} /></mesh></group>
      <group ref={rightFlapRef} position={[1.25, 0.17, 0]}><mesh position={[0.4, 0.01, 0]}><boxGeometry args={[0.8, 0.02, 2.5]} /><meshStandardMaterial color={darkCardboard} roughness={0.9} /></mesh></group>
      <group ref={frontFlapRef} position={[0, 0.17, 1.25]}><mesh position={[0, 0.01, 0.4]}><boxGeometry args={[2.46, 0.02, 0.8]} /><meshStandardMaterial color={darkCardboard} roughness={0.9} /></mesh></group>
      <group ref={backFlapRef} position={[0, 0.17, -1.25]}><mesh position={[0, 0.01, -0.4]}><boxGeometry args={[2.46, 0.02, 0.8]} /><meshStandardMaterial color={darkCardboard} roughness={0.9} /></mesh></group>
    </group>
  )
}

// ─── Wood Plate ─────────────────────────────────────────────────────────────────
function WoodPlate() {
  const [plateGeom, rimGeom, innerGeom, shadowGeom] = useMemo(() => [
    new THREE.CylinderGeometry(1.15, 1.05, 0.12, 20),
    new THREE.TorusGeometry(1.08, 0.04, 6, 20),
    new THREE.CylinderGeometry(0.95, 0.95, 0.01, 20),
    new THREE.CircleGeometry(1.3, 20)
  ], [])
  return (
    <group>
      <mesh position={[0, -0.78, 0]} geometry={plateGeom}>
        <meshPhysicalMaterial color="#784C32" roughness={0.45} metalness={0.05} clearcoat={0.15} envMapIntensity={0.8} />
      </mesh>
      <mesh position={[0, -0.73, 0]} geometry={rimGeom}>
        <meshPhysicalMaterial color="#59341F" roughness={0.35} metalness={0.1} clearcoat={0.2} />
      </mesh>
      <mesh position={[0, -0.72, 0]} geometry={innerGeom}>
        <meshStandardMaterial color="#653D25" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.84, 0]} rotation={[-Math.PI/2, 0, 0]} geometry={shadowGeom}>
        <meshStandardMaterial color="#000000" transparent opacity={0.2} roughness={1} />
      </mesh>
    </group>
  )
}

// ─── Main Food3D Export ─────────────────────────────────────────────────────────

interface Food3DProps {
  type: 'burger' | 'pizza' | 'sandwich' | 'dessert'
  selectedToppings?: string[]
  rotationOffset?: MotionValue<number> | number
  transitionProgress?: MotionValue<number> | number
  isExploded?: boolean
  explodeProgress?: number
  visibleLayers?: Set<string>
  onLayerClick?: (id: string) => void
}

export function Food3D(props: Food3DProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      setWebglSupported(!!gl)
    } catch { setWebglSupported(false) }
  }, [])

  if (webglSupported === null) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-transparent">
        <div className="w-8 h-8 rounded-full border-4 border-t-[#E87A30] border-r-transparent border-b-[#E87A30] border-l-transparent animate-spin" />
      </div>
    )
  }

  if (webglSupported === false) {
    return <Food2D type={props.type} selectedToppings={props.selectedToppings} />
  }

  const toppingsList = props.selectedToppings ?? []
  const showBox = toppingsList.length > 0
  const exploded = props.isExploded ?? false
  const explodeProgress = props.explodeProgress ?? (exploded ? 1 : 0)
  const visibleLayers = props.visibleLayers ?? new Set<string>([
    'bottom-bun', 'patty', 'sauce', 'cheese', 'lettuce', 'tomato', 'top-bun'
  ])
  const onLayerClick = props.onLayerClick ?? (() => {})

  return (
    <WebGLBoundary fallback={<Food2D type={props.type} selectedToppings={props.selectedToppings} />}>
      <Canvas
        camera={{ position: [0, 1.1, 3.8], fov: 38 }}
        style={{ width: '100%', height: '100%' }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2, powerPreference: 'low-power' }}
      >
        <SceneLights />
        <Environment preset="sunset" environmentIntensity={0.4} />
        <CameraRig transitionProgress={props.transitionProgress} />

        <InteractiveGroup rotationOffset={props.rotationOffset} transitionProgress={props.transitionProgress} explodeProgress={explodeProgress}>
          <group>
            <CardboardBox active={showBox} />
            <WoodPlate />
            <PhysicsToppings type={props.type} selectedToppings={toppingsList} />

            {props.type === 'burger' && <BurgerMemo exploded={exploded} explodeProgress={explodeProgress} visibleLayers={visibleLayers} onLayerClick={onLayerClick} />}
            {props.type === 'pizza' && <PizzaMemo exploded={exploded} explodeProgress={explodeProgress} visibleLayers={visibleLayers} onLayerClick={onLayerClick} />}
            {props.type === 'sandwich' && <SandwichMemo exploded={exploded} explodeProgress={explodeProgress} visibleLayers={visibleLayers} onLayerClick={onLayerClick} />}
            {props.type === 'dessert' && <DessertMemo exploded={exploded} explodeProgress={explodeProgress} visibleLayers={visibleLayers} onLayerClick={onLayerClick} />}
          </group>
        </InteractiveGroup>
      </Canvas>
    </WebGLBoundary>
  )
}
