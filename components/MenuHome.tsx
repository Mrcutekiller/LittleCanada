'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { MENU, CATEGORIES, type CategoryKey } from '@/lib/menu-data'
import { useScrollTransition, interpolate } from '@/hooks/useScrollTransition'
import dynamic from 'next/dynamic'

const Food3D = dynamic(() => import('./Food3D').then(m => m.Food3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-t-[#D4AF37] border-r-transparent border-b-[#D4AF37] border-l-transparent animate-spin" />
    </div>
  ),
})

type FoodType = 'burger' | 'pizza' | 'sandwich' | 'dessert'

function getFoodType(itemId: string): FoodType {
  if (itemId === 'd1') return 'pizza'
  if (itemId.startsWith('br')) return 'sandwich'
  if (itemId.startsWith('b')) return 'burger'
  if (itemId.startsWith('p')) return 'pizza'
  return 'dessert'
}

type Theme = 'dark' | 'white'

const THEMES: Record<Theme, { bg: string; card: string; text: string; muted: string; border: string; accent: string; surface: string }> = {
  dark:   { bg: '#000000', card: 'from-white/5 to-white/[0.01]', text: '#FFFFFF', muted: '#888888', border: 'border-white/10', accent: '#D4AF37', surface: 'bg-white/5' },
  white:  { bg: '#FFFFFF', card: 'from-black/5 to-black/[0.02]', text: '#0A0A0A', muted: '#666666', border: 'border-black/10', accent: '#D4AF37', surface: 'bg-black/5' },
}

export function MenuHome() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('burgers')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [theme, setTheme] = useState<Theme>('white')

  const dragX = useMotionValue(0)
  const rotateY = useTransform(dragX, [-300, 300], [-30, 30])

  const items = useMemo(() => MENU[activeCategory], [activeCategory])
  const item = items[currentIndex] ?? items[0]
  const foodType = getFoodType(item.id)

  const rotationOffset = useMotionValue(0)
  const baseRotation = useRef(0)
  const isTransitioning = useRef(false)

  const {
    transitionProgress,
    goToHome,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useScrollTransition()

  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const unsub = transitionProgress.on('change', (v) => setProgress(v))
    return unsub
  }, [transitionProgress])

  const isHome = progress < 0.5
  const t = THEMES[theme]

  const triggerSpin = useCallback((dir: 1 | -1) => {
    isTransitioning.current = true
    const targetRotation = baseRotation.current - dir * Math.PI * 2
    animate(rotationOffset, targetRotation, {
      type: 'spring', stiffness: 140, damping: 22,
      onComplete: () => { baseRotation.current = targetRotation; isTransitioning.current = false }
    })
  }, [rotationOffset])

  const go = useCallback((dir: 1 | -1) => {
    triggerSpin(dir)
    setCurrentIndex(prev => {
      const next = prev + dir
      if (next < 0) return items.length - 1
      if (next >= items.length) return 0
      return next
    })
  }, [items.length, triggerSpin])

  const handleCategoryChange = (cat: CategoryKey) => {
    setActiveCategory(cat); setCurrentIndex(0); triggerSpin(1)
  }

  const handleCardDragEnd = useCallback((_: any, info: { offset: { x: number } }) => {
    if (Math.abs(info.offset.x) > 60) { go(info.offset.x > 0 ? -1 : 1) }
    else { animate(rotationOffset, baseRotation.current, { type: 'spring', stiffness: 200, damping: 25 }) }
    animate(dragX, 0, { type: 'spring', stiffness: 500, damping: 40 })
  }, [go, rotationOffset, dragX])

  useEffect(() => {
    const unsubscribe = dragX.on('change', (latestX) => {
      if (isTransitioning.current) return
      rotationOffset.set(latestX * -0.015 + baseRotation.current)
    })
    return () => unsubscribe()
  }, [dragX, rotationOffset])

  const handleBack = useCallback(() => {
    goToHome()
  }, [goToHome])

  const price = item.basePrice

  const cardScale = interpolate(progress, [0, 1], [1, 1.2])
  const cardY = interpolate(progress, [0, 1], [0, -40])
  const cardRadius = interpolate(progress, [0, 1], [32, 24])
  const homeOpacity = interpolate(progress, [0, 0.3], [1, 0])
  const detailOpacity = interpolate(progress, [0.6, 1], [0, 1])
  const bottomSheetY = interpolate(progress, [0.3, 1], [100, 0])
  const bottomSheetOpacity = interpolate(progress, [0.3, 0.6], [0, 1])
  const backOpacity = interpolate(progress, [0.7, 1], [0, 1])

  const cycleTheme = () => {
    setTheme(theme === 'dark' ? 'white' : 'dark')
  }

  return (
    <div
      className="min-h-screen font-sans transition-colors duration-300"
      style={{ backgroundColor: t.bg, color: t.text }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="max-w-lg mx-auto min-h-screen relative flex flex-col overflow-hidden transition-colors duration-300" style={{ backgroundColor: t.bg }}>

        {/* Header */}
        <div className="flex justify-between items-center p-5 sm:p-6 pb-0 z-10 relative"
          style={{ opacity: homeOpacity }}>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight" style={{ color: t.accent }}>
              Little Canada
            </h1>
            <p className="text-[8px] sm:text-[9px] mt-0.5 font-bold tracking-widest uppercase" style={{ color: t.muted }}>
              Premium Café Experience
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={cycleTheme}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all active:scale-90"
              style={{ borderColor: t.accent + '40', color: t.accent, backgroundColor: t.accent + '10' }}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <a href="tel:+251988984865"
              onPointerDown={(e) => e.stopPropagation()}
              className="text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all active:scale-95"
              style={{ color: t.accent, borderColor: t.accent + '30', backgroundColor: t.accent + '10' }}>
              📞 Call
            </a>
          </div>
        </div>

        {/* Back button */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-2 z-40 absolute top-0 left-0 right-0"
          style={{ opacity: backOpacity, pointerEvents: backOpacity > 0.5 ? 'auto' : 'none' }}>
          <button onClick={handleBack}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-9 h-9 rounded-full border flex items-center justify-center active:scale-90 shrink-0"
            style={{ backgroundColor: t.bg + 'CC', borderColor: theme === 'white' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)', color: t.accent }}>
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-sm sm:text-base font-serif font-black tracking-tight truncate" style={{ color: t.text }}>{item.name}</h2>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 mt-3 px-5 sm:px-6 z-10 relative snap-x"
          style={{ opacity: homeOpacity }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => handleCategoryChange(cat.key)}
              onPointerDown={(e) => e.stopPropagation()}
              className={`snap-start flex-shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-bold transition-all active:scale-95 ${
                activeCategory === cat.key ? 'shadow-md' : ''
              }`}
              style={activeCategory === cat.key
                ? { backgroundColor: t.accent, color: t.bg }
                : { backgroundColor: t.accent + '08', color: t.muted, border: `1px solid ${t.accent}15` }
              }>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Food Name */}
        <div className="text-center mt-3 mb-1 min-h-[60px] flex flex-col items-center justify-center z-10 relative px-5">
          <div className="flex flex-col items-center" style={{ opacity: homeOpacity }}>
            {item.popular && (
              <span className="text-[7px] sm:text-[8px] font-black tracking-widest uppercase mb-1 px-2 py-0.5 rounded-full border"
                style={{ color: t.accent, backgroundColor: t.accent + '15', borderColor: t.accent + '25' }}>
                🔥 Popular
              </span>
            )}
            <h2 className="text-lg sm:text-xl font-serif font-black tracking-tight leading-tight" style={{ color: t.text }}>
              {item.name}
            </h2>
            <p className="text-[9px] sm:text-[10px] mt-0.5 truncate max-w-[220px]" style={{ color: t.muted }}>{item.description}</p>
            <span className="text-base sm:text-lg font-black mt-0.5" style={{ color: t.accent }}>{price} ETB</span>
          </div>
        </div>

        {/* Food Card */}
        <div className="flex-1 flex items-center justify-center relative mt-1 z-10">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={handleCardDragEnd}
            style={{
              background: `linear-gradient(135deg, ${theme === 'white' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}, ${theme === 'white' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)'})`,
              borderColor: theme === 'white' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
              x: dragX,
              rotateY,
              transformPerspective: 900,
              scale: cardScale,
              y: cardY,
              borderRadius: cardRadius,
            }}
            className="relative w-full max-w-[280px] sm:max-w-[300px] h-[280px] sm:h-[320px] rounded-[2rem] sm:rounded-[2.5rem] border shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
          >
            <div className="w-full h-full relative">
              <Food3D
                type={foodType}
                selectedToppings={[]}
                rotationOffset={rotationOffset}
                transitionProgress={transitionProgress}
                explodeProgress={0}
                visibleLayers={new Set()}
                onLayerClick={() => {}}
              />
              {item.coverImage && (
                <div className="absolute inset-0 z-30">
                  <img
                    src={item.coverImage}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* View Details Button */}
        <div className="mt-3 px-5 sm:px-6 z-10 relative" style={{ opacity: homeOpacity }}>
          <button
            onClick={() => {
              const target = 1
              animate(transitionProgress, target, { type: 'spring', stiffness: 200, damping: 28, mass: 0.8 })
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full py-3 rounded-xl text-[11px] font-bold border transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ borderColor: t.accent + '40', backgroundColor: t.accent + '12', color: t.accent }}
          >
            <span>Explore This Item</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex justify-between items-center mt-3 mb-4 px-5 sm:px-6 z-10 relative" style={{ opacity: homeOpacity }}>
          <button onClick={() => go(-1)} onPointerDown={(e) => e.stopPropagation()} className="w-9 h-9 rounded-full border flex items-center justify-center hover:opacity-80 active:scale-90"
            style={{ backgroundColor: t.accent + '08', borderColor: theme === 'white' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)', color: t.accent }}>
            <ChevronLeft size={16} />
          </button>
          <p className="text-[9px] sm:text-[10px] tracking-widest uppercase" style={{ color: t.muted + '60' }}>
            {currentIndex + 1} / {items.length}
          </p>
          <button onClick={() => go(1)} onPointerDown={(e) => e.stopPropagation()} className="w-9 h-9 rounded-full border flex items-center justify-center hover:opacity-80 active:scale-90"
            style={{ backgroundColor: t.accent + '08', borderColor: theme === 'white' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)', color: t.accent }}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Bottom Sheet — Explore Detail */}
        <div className="absolute bottom-0 left-0 right-0 z-30"
          style={{
            transform: `translateY(${bottomSheetY}%)`,
            opacity: bottomSheetOpacity,
            pointerEvents: bottomSheetOpacity > 0.5 ? 'auto' : 'none',
          }}>
          <div className="border-t rounded-t-[2rem] p-5 sm:p-6 transition-colors duration-300 overflow-y-auto max-h-[75vh]"
            style={{ backgroundColor: t.bg, borderColor: theme === 'white' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)', boxShadow: '0 -12px 40px rgba(0,0,0,0.15)' }}>

            {item.coverImage && (
              <div className="mb-4 rounded-2xl overflow-hidden">
                <img
                  src={item.coverImage}
                  alt={item.name}
                  className="w-full h-[220px] object-cover"
                />
              </div>
            )}

            <div className="mb-4 text-center">
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight" style={{ color: t.text }}>{item.name}</h2>
              <span className="text-xl sm:text-2xl font-black" style={{ color: t.accent }}>{price} ETB</span>
            </div>

            <div className="mb-4">
              <h3 className="text-[9px] sm:text-[10px] font-bold mb-2 uppercase tracking-widest" style={{ color: t.accent }}>Ingredients</h3>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.map((ing, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-medium border"
                    style={{ backgroundColor: t.accent + '08', color: t.muted, borderColor: t.accent + '10' }}>
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {item.funFact && (
              <div className="rounded-xl p-4 border" style={{ backgroundColor: t.accent + '08', borderColor: t.accent + '15' }}>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: t.accent }}>🍁 Canada Fun Fact</p>
                <p className="text-[11px] sm:text-[12px] leading-relaxed" style={{ color: t.muted }}>{item.funFact}</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
