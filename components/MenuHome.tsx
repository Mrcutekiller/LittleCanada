'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate, MotionValue } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowLeft, RotateCcw, Layers, Package } from 'lucide-react'
import { MENU, CATEGORIES, type CategoryKey, getIngredientLayers } from '@/lib/menu-data'
import { useScrollTransition, interpolate } from '@/hooks/useScrollTransition'
import dynamic from 'next/dynamic'

const Food3D = dynamic(() => import('./Food3D').then(m => m.Food3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-4 border-t-[#E87A30] border-r-transparent border-b-[#E87A30] border-l-transparent animate-spin" />
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

type Theme = 'dark' | 'black' | 'white'

const THEMES: Record<Theme, { bg: string; card: string; text: string; muted: string; border: string; accent: string; surface: string }> = {
  dark:   { bg: '#0C0A09', card: 'from-white/10 to-white/[0.03]', text: '#F5F5F4', muted: '#A89F91', border: 'border-white/10', accent: '#D4AF37', surface: 'bg-white/5' },
  black:  { bg: '#000000', card: 'from-white/5 to-white/[0.01]', text: '#FFFFFF', muted: '#666666', border: 'border-white/8', accent: '#D4AF37', surface: 'bg-white/3' },
  white:  { bg: '#F5F5F0', card: 'from-black/5 to-black/[0.02]', text: '#0A0A0A', muted: '#666666', border: 'border-black/10', accent: '#B8941F', surface: 'bg-black/5' },
}

export function MenuHome() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('burgers')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const explodeProgress = useMotionValue(0)
  const [explodeValue, setExplodeValue] = useState(0)
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set())
  const [theme, setTheme] = useState<Theme>('dark')

  const dragX = useMotionValue(0)
  const rotateY = useTransform(dragX, [-300, 300], [-30, 30])

  const items = useMemo(() => MENU[activeCategory], [activeCategory])
  const item = items[currentIndex] ?? items[0]
  const foodType = getFoodType(item.id)
  const ingredientLayers = useMemo(() => getIngredientLayers(foodType), [foodType])

  const rotationOffset = useMotionValue(0)
  const baseRotation = useRef(0)
  const isTransitioning = useRef(false)

  const {
    transitionProgress,
    gestureState,
    snapTo,
    goToHome,
    goToDetail,
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

  useEffect(() => {
    const unsub = explodeProgress.on('change', (v) => setExplodeValue(v))
    return unsub
  }, [explodeProgress])

  const isExploded = explodeValue > 0.5

  useEffect(() => {
    setVisibleLayers(new Set(ingredientLayers.map(l => l.id)))
    explodeProgress.set(0)
  }, [foodType, ingredientLayers, explodeProgress])

  useEffect(() => {
    setSelectedToppings([])
    explodeProgress.set(0)
    setVisibleLayers(new Set(ingredientLayers.map(l => l.id)))
  }, [currentIndex, activeCategory, ingredientLayers, explodeProgress])

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

  const toppingsForItem = useMemo(() => {
    const type = getFoodType(item.id)
    if (type === 'burger' || type === 'sandwich') {
      return [
        { id: 'cheese', emoji: '🧀', label: 'Cheddar' },
        { id: 'lettuce', emoji: '🥬', label: 'Lettuce' },
        { id: 'tomato', emoji: '🍅', label: 'Tomato' },
        { id: 'bacon', emoji: '🥓', label: 'Bacon' },
        { id: 'avocado', emoji: '🥑', label: 'Avocado' },
        { id: 'onion', emoji: '🧅', label: 'Red Onion' },
      ]
    }
    if (type === 'pizza') {
      return [
        { id: 'pepperoni', emoji: '🌶️', label: 'Pepperoni' },
        { id: 'mushroom', emoji: '🍄', label: 'Mushroom' },
        { id: 'olive', emoji: '⚫', label: 'Black Olive' },
        { id: 'lettuce', emoji: '🌿', label: 'Basil Leaf' },
        { id: 'cheese', emoji: '🧀', label: 'Mozzarella' },
        { id: 'pepper', emoji: '🫑', label: 'Bell Pepper' },
      ]
    }
    if (type === 'dessert') return [{ id: 'chocolate', emoji: '🍫', label: 'Choc Curls' }]
    return []
  }, [item.id])

  const isCustomizable = toppingsForItem.length > 0

  const handleToppingToggle = useCallback((id: string) => {
    setSelectedToppings(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }, [])

  const handleLayerClick = useCallback((layerId: string) => {
    setVisibleLayers(prev => {
      const next = new Set(prev)
      if (next.has(layerId)) next.delete(layerId)
      else next.add(layerId)
      return next
    })
  }, [])

  const handleExplode = useCallback(() => {
    const target = explodeProgress.get() > 0.5 ? 0 : 1
    animate(explodeProgress, target, { type: 'spring', stiffness: 200, damping: 25 })
  }, [explodeProgress])
  const handleReassemble = useCallback(() => {
    animate(explodeProgress, 0, { type: 'spring', stiffness: 200, damping: 25 })
    setVisibleLayers(new Set(ingredientLayers.map(l => l.id)))
  }, [ingredientLayers, explodeProgress])

  const handleBack = useCallback(() => {
    animate(explodeProgress, 0, { type: 'spring', stiffness: 200, damping: 25 })
    setVisibleLayers(new Set(ingredientLayers.map(l => l.id)))
    goToHome()
  }, [goToHome, ingredientLayers, explodeProgress])

  const price = item.basePrice

  const cardScale = interpolate(progress, [0, 1], [1, 1.4])
  const cardY = interpolate(progress, [0, 1], [0, -60])
  const cardRadius = interpolate(progress, [0, 1], [32, 24])
  const homeOpacity = interpolate(progress, [0, 0.3], [1, 0])
  const detailOpacity = interpolate(progress, [0.6, 1], [0, 1])
  const bottomSheetY = interpolate(progress, [0.3, 1], [100, 0])
  const bottomSheetOpacity = interpolate(progress, [0.3, 0.6], [0, 1])
  const backOpacity = interpolate(progress, [0.7, 1], [0, 1])

  const cycleTheme = () => {
    const order: Theme[] = ['dark', 'black', 'white']
    const idx = order.indexOf(theme)
    setTheme(order[(idx + 1) % order.length])
  }

  return (
    <div
      className="min-h-screen font-sans transition-colors duration-300"
      style={{ backgroundColor: t.bg, color: t.text }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="max-w-lg mx-auto min-h-screen relative flex flex-col overflow-hidden shadow-2xl transition-colors duration-300" style={{ backgroundColor: t.bg }}>

        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[20%] left-[-40px] text-5xl opacity-10 deco-1 select-none">🍅</div>
          <div className="absolute top-[45%] right-[-30px] text-4xl opacity-[0.07] deco-2 select-none">🌿</div>
          <div className="absolute bottom-[25%] left-[-20px] text-4xl opacity-[0.07] deco-3 select-none">🧀</div>
          <div className="absolute bottom-[10%] right-[-40px] text-5xl opacity-10 deco-1 select-none">🥑</div>
        </div>

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
              className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all active:scale-90"
              style={{ borderColor: t.accent + '40', color: t.accent, backgroundColor: t.accent + '10' }}>
              {theme === 'dark' ? '🌙' : theme === 'black' ? '⚫' : '☀️'}
            </button>
            <a href="tel:+251988984865"
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
            className="w-9 h-9 rounded-full border flex items-center justify-center active:scale-90 shrink-0"
            style={{ backgroundColor: t.bg + 'CC', borderColor: 'rgba(255,255,255,0.1)', color: t.accent }}>
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-sm sm:text-base font-serif font-black tracking-tight truncate" style={{ color: t.text }}>{item.name}</h2>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 mt-3 px-5 sm:px-6 z-10 relative snap-x"
          style={{ opacity: homeOpacity }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => handleCategoryChange(cat.key)}
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
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ opacity: detailOpacity }}>
            {item.popular && (
              <span className="text-[7px] sm:text-[8px] font-black tracking-widest uppercase mb-1 px-2 py-0.5 rounded-full border inline-block"
                style={{ color: t.accent, backgroundColor: t.accent + '15', borderColor: t.accent + '25' }}>
                Most Popular
              </span>
            )}
            <h2 className="text-lg sm:text-xl font-serif font-black tracking-tight leading-tight" style={{ color: t.text }}>{item.name}</h2>
            <p className="text-[9px] sm:text-[10px] mt-0.5 truncate max-w-[220px]" style={{ color: t.muted }}>{item.description}</p>
            <span className="text-base sm:text-lg font-black mt-0.5" style={{ color: t.accent }}>{price} ETB</span>
          </div>
        </div>

        {/* 3D Food Card — NO pointer events here, framer-motion drag handles horizontal */}
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
                selectedToppings={isHome ? [] : selectedToppings}
                rotationOffset={rotationOffset}
                transitionProgress={transitionProgress}
                explodeProgress={explodeValue}
                visibleLayers={visibleLayers}
                onLayerClick={handleLayerClick}
              />
              {!isExploded && isHome && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 px-2.5 py-1 rounded-full backdrop-blur-sm border"
                  style={{ backgroundColor: t.bg + '80', borderColor: 'rgba(255,255,255,0.1)' }}>
                  <span className="text-[7px] sm:text-[8px] font-bold tracking-wider uppercase flex items-center gap-1" style={{ color: t.muted }}>
                    <Layers size={8} /> Swipe left/right
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Home Controls */}
        <div className="mt-3 space-y-2 px-5 sm:px-6 z-10 relative" style={{ opacity: homeOpacity }}>
          <div className="flex gap-2 px-1">
            <button onClick={handleExplode}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold border transition-all active:scale-95"
              style={isExploded
                ? { borderColor: '#E87A30', backgroundColor: '#E87A3015', color: '#E87A30' }
                : { borderColor: 'rgba(255,255,255,0.1)', backgroundColor: t.accent + '08', color: t.muted }
              }>
              <Package size={12} />
              {isExploded ? 'Assembling...' : 'Explode View'}
            </button>
            {isExploded && (
              <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                onClick={handleReassemble}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold border active:scale-95"
                style={{ borderColor: t.accent + '40', backgroundColor: t.accent + '15', color: t.accent }}>
                <RotateCcw size={12} /> Reassemble
              </motion.button>
            )}
          </div>

          {isExploded && (
            <div className="rounded-xl border p-2.5" style={{ backgroundColor: t.accent + '08', borderColor: t.accent + '10' }}>
              <p className="text-[7px] sm:text-[8px] font-bold tracking-widest uppercase mb-2" style={{ color: t.accent }}>Tap layers to show/hide</p>
              <div className="grid grid-cols-2 gap-1.5 max-h-[100px] overflow-y-auto pr-1 hide-scrollbar">
                {ingredientLayers.map(layer => {
                  const vis = visibleLayers.has(layer.id)
                  return (
                    <button key={layer.id} onClick={() => handleLayerClick(layer.id)}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-left transition-all active:scale-95"
                      style={vis
                        ? { borderColor: t.accent + '40', backgroundColor: t.accent + '15', color: t.text }
                        : { borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.3)' }
                      }>
                      <span className="text-xs">{layer.emoji}</span>
                      <span className="text-[8px] sm:text-[9px] font-medium truncate flex-1">{layer.label}</span>
                      <div className="w-2 h-2 rounded-full border" style={vis ? { backgroundColor: t.accent, borderColor: t.accent } : { borderColor: 'rgba(255,255,255,0.2)' }} />
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Home Nav */}
        <div className="flex justify-between items-center mt-3 px-5 sm:px-6 z-10 relative" style={{ opacity: homeOpacity }}>
          <button onClick={() => go(-1)} className="w-9 h-9 rounded-full border flex items-center justify-center hover:opacity-80 active:scale-90"
            style={{ backgroundColor: t.accent + '08', borderColor: 'rgba(255,255,255,0.1)', color: t.accent }}>
            <ChevronLeft size={16} />
          </button>
          <p className="text-[9px] sm:text-[10px] tracking-widest uppercase" style={{ color: t.muted + '60' }}>
            {currentIndex + 1} / {items.length}
          </p>
          <button onClick={() => go(1)} className="w-9 h-9 rounded-full border flex items-center justify-center hover:opacity-80 active:scale-90"
            style={{ backgroundColor: t.accent + '08', borderColor: 'rgba(255,255,255,0.1)', color: t.accent }}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Bottom Sheet */}
        <div className="absolute bottom-0 left-0 right-0 z-30"
          style={{
            transform: `translateY(${bottomSheetY}%)`,
            opacity: bottomSheetOpacity,
            pointerEvents: bottomSheetOpacity > 0.5 ? 'auto' : 'none',
          }}>
          <div className="backdrop-blur border-t rounded-t-[2rem] p-4 sm:p-5 transition-colors duration-300"
            style={{ backgroundColor: t.bg + 'F0', borderColor: 'rgba(255,255,255,0.05)', boxShadow: '0 -12px 40px rgba(0,0,0,0.4)' }}>

            <div className="mb-3 flex gap-2">
              <button onClick={handleExplode}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold border transition-all active:scale-95"
                style={isExploded
                  ? { borderColor: '#E87A30', backgroundColor: '#E87A3015', color: '#E87A30' }
                  : { borderColor: 'rgba(255,255,255,0.1)', backgroundColor: t.accent + '08', color: t.muted }
                }>
                <Package size={12} />
                {isExploded ? 'Assembling...' : 'Explode View'}
              </button>
              {isExploded && (
                <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  onClick={handleReassemble}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-bold border active:scale-95"
                  style={{ borderColor: t.accent + '40', backgroundColor: t.accent + '15', color: t.accent }}>
                  <RotateCcw size={12} /> All
                </motion.button>
              )}
            </div>

            {isExploded && (
              <div className="mb-3">
                <div className="rounded-xl border p-2.5" style={{ backgroundColor: t.accent + '08', borderColor: t.accent + '10' }}>
                  <p className="text-[7px] sm:text-[8px] font-bold tracking-widest uppercase mb-2" style={{ color: t.accent }}>Tap layers to show/hide</p>
                  <div className="grid grid-cols-2 gap-1.5 max-h-[90px] overflow-y-auto pr-1 hide-scrollbar">
                    {ingredientLayers.map(layer => {
                      const vis = visibleLayers.has(layer.id)
                      return (
                        <button key={layer.id} onClick={() => handleLayerClick(layer.id)}
                          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-left transition-all active:scale-95"
                          style={vis
                            ? { borderColor: t.accent + '40', backgroundColor: t.accent + '15', color: t.text }
                            : { borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.3)' }
                          }>
                          <span className="text-xs">{layer.emoji}</span>
                          <span className="text-[8px] sm:text-[9px] font-medium truncate flex-1">{layer.label}</span>
                          <div className="w-2 h-2 rounded-full border" style={vis ? { backgroundColor: t.accent, borderColor: t.accent } : { borderColor: 'rgba(255,255,255,0.2)' }} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-3 py-2 border-t border-b overflow-x-auto hide-scrollbar flex gap-1.5"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {item.ingredients.slice(0, 5).map((ing, i) => (
                <span key={i} className="flex-shrink-0 px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-medium border"
                  style={{ backgroundColor: t.accent + '08', color: t.muted, borderColor: t.accent + '10' }}>
                  {ing}
                </span>
              ))}
            </div>

            {isCustomizable && (
              <div className="mb-4">
                <h3 className="text-[8px] sm:text-[9px] font-bold mb-2 uppercase tracking-widest" style={{ color: t.accent }}>
                  Customize Toppings <span className="normal-case opacity-70 ml-1" style={{ color: t.muted }}>(tap to add)</span>
                </h3>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 max-h-[120px] sm:max-h-[140px] overflow-y-auto pr-1 hide-scrollbar">
                  {toppingsForItem.map(topping => {
                    const active = selectedToppings.includes(topping.id)
                    return (
                      <button key={topping.id} onClick={() => handleToppingToggle(topping.id)}
                        className="flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl border transition-all active:scale-95"
                        style={active
                          ? { borderColor: t.accent, backgroundColor: t.accent + '15', color: t.text, fontWeight: 700 }
                          : { borderColor: 'rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.03)', color: t.muted }
                        }>
                        <span className="text-sm sm:text-base leading-none">{topping.emoji}</span>
                        <span className="text-[9px] sm:text-[10px] truncate flex-1 leading-none">{topping.label}</span>
                        {active && <div className="w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold"
                          style={{ backgroundColor: t.accent, color: t.bg }}>✓</div>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <a href="tel:+251988984865"
              className="flex justify-center items-center gap-2 w-full py-3.5 rounded-xl font-black text-xs tracking-wider uppercase transition shadow-lg active:scale-[0.98]"
              style={{ backgroundColor: t.accent, color: theme === 'white' ? '#FFFFFF' : '#000000' }}>
              📞 Call to Order
            </a>
          </div>
        </div>

        {/* Cart FAB */}
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          className="absolute bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-40"
          style={{ backgroundColor: '#E87A30', color: '#FFFFFF', boxShadow: '0 4px 20px rgba(232,122,48,0.3)' }}>
          <ShoppingCart size={20} />
        </motion.button>

      </div>
    </div>
  )
}
