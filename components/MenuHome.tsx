'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowLeft, RotateCcw, Layers, Package } from 'lucide-react'
import { MENU, CATEGORIES, type CategoryKey, getIngredientLayers } from '@/lib/menu-data'
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

export function MenuHome() {
  const [pageState, setPageState] = useState<'home' | 'detail'>('home')
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('burgers')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [isExploded, setIsExploded] = useState(false)
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set())

  const dragX = useMotionValue(0)
  const rotateY = useTransform(dragX, [-300, 300], [-30, 30])

  const items = useMemo(() => MENU[activeCategory], [activeCategory])
  const item = items[currentIndex] ?? items[0]
  const foodType = getFoodType(item.id)
  const ingredientLayers = useMemo(() => getIngredientLayers(foodType), [foodType])

  const rotationOffset = useMotionValue(0)
  const baseRotation = useRef(0)
  const isTransitioning = useRef(false)

  useEffect(() => {
    setVisibleLayers(new Set(ingredientLayers.map(l => l.id)))
    setIsExploded(false)
  }, [foodType, ingredientLayers])

  useEffect(() => {
    setSelectedToppings([])
    setIsExploded(false)
    setVisibleLayers(new Set(ingredientLayers.map(l => l.id)))
  }, [currentIndex, activeCategory, ingredientLayers])

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

  const handleDragEnd = useCallback((_: any, info: { offset: { x: number } }) => {
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

  const handleExplode = useCallback(() => setIsExploded(prev => !prev), [])
  const handleReassemble = useCallback(() => {
    setIsExploded(false)
    setVisibleLayers(new Set(ingredientLayers.map(l => l.id)))
  }, [ingredientLayers])

  const price = item.basePrice

  return (
    <div className="min-h-screen bg-[#070504] font-sans selection:bg-[#E87A30]/30 selection:text-white">
      <div className="max-w-lg mx-auto min-h-screen bg-[#0C0A09] relative flex flex-col overflow-hidden shadow-2xl">

        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[20%] left-[-40px] text-5xl opacity-10 deco-1 select-none">🍅</div>
          <div className="absolute top-[45%] right-[-30px] text-4xl opacity-[0.07] deco-2 select-none">🌿</div>
          <div className="absolute bottom-[25%] left-[-20px] text-4xl opacity-[0.07] deco-3 select-none">🧀</div>
          <div className="absolute bottom-[10%] right-[-40px] text-5xl opacity-10 deco-1 select-none">🥑</div>
        </div>

        <AnimatePresence mode="wait">
          {pageState === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col p-5 sm:p-6 z-10 relative min-h-screen"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#D4AF37]">
                    Little Canada
                  </h1>
                  <p className="text-[8px] sm:text-[9px] text-[#A89F91] mt-0.5 font-bold tracking-widest uppercase">
                    Premium Café Experience
                  </p>
                </div>
                <a href="tel:+251988984865"
                  className="text-[10px] font-bold text-[#D4AF37] bg-white/5 hover:bg-[#D4AF37]/10 px-3 py-1.5 rounded-full border border-[#D4AF37]/20 transition-all active:scale-95">
                  📞 Call
                </a>
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 mt-3 snap-x">
                {CATEGORIES.map(cat => (
                  <button key={cat.key} onClick={() => handleCategoryChange(cat.key)}
                    className={`snap-start flex-shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-bold transition-all active:scale-95 ${
                      activeCategory === cat.key
                        ? 'bg-[#D4AF37] text-[#0C0A09] font-black shadow-md'
                        : 'bg-white/5 text-white/60 border border-white/5 hover:bg-white/10'
                    }`}>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Food Name - always visible above card */}
              <div className="text-center mt-3 mb-1 min-h-[60px] flex flex-col items-center justify-center cursor-pointer" onClick={() => setPageState('detail')}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="flex flex-col items-center"
                  >
                    {item.popular && (
                      <span className="text-[#D4AF37] text-[7px] sm:text-[8px] font-black tracking-widest uppercase mb-1 bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/20">
                        🔥 Popular
                      </span>
                    )}
                    <h2 className="text-lg sm:text-xl font-serif font-black tracking-tight leading-tight text-white">
                      {item.name}
                    </h2>
                    <p className="text-[9px] sm:text-[10px] text-white/50 mt-0.5 truncate max-w-[220px]">{item.description}</p>
                    <span className="text-base sm:text-lg font-black text-[#D4AF37] mt-0.5">{price} ETB</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 3D Food Card */}
              <div className="flex-1 flex items-center justify-center relative mt-1">
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={handleDragEnd}
                  style={{ x: dragX, rotateY, transformPerspective: 900 }}
                  className="relative w-full max-w-[280px] sm:max-w-[300px] h-[280px] sm:h-[320px] rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/[0.03] border border-white/10 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
                >
                  <div onClick={() => setPageState('detail')}
                    className="w-full h-full cursor-pointer relative">
                    <Food3D
                      type={foodType}
                      selectedToppings={[]}
                      rotationOffset={rotationOffset}
                      isExploded={isExploded}
                      visibleLayers={visibleLayers}
                      onLayerClick={handleLayerClick}
                    />
                    {!isExploded && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-40 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                        <span className="text-[7px] sm:text-[8px] text-white/50 font-bold tracking-wider uppercase flex items-center gap-1">
                          <Layers size={8} /> Tap to explode
                        </span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Controls */}
              <div className="mt-3 space-y-2">
                <div className="flex gap-2 px-1">
                  <button onClick={handleExplode}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold border transition-all active:scale-95 ${
                      isExploded ? 'border-[#E87A30] bg-[#E87A30]/10 text-[#E87A30]' : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                    }`}>
                    <Package size={12} />
                    {isExploded ? 'Assembling...' : 'Explode View'}
                  </button>
                  {isExploded && (
                    <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      onClick={handleReassemble}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] active:scale-95">
                      <RotateCcw size={12} /> Reassemble
                    </motion.button>
                  )}
                </div>

                <AnimatePresence>
                  {isExploded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="overflow-hidden">
                      <div className="bg-white/5 rounded-xl border border-white/5 p-2.5">
                        <p className="text-[7px] sm:text-[8px] text-[#D4AF37] font-bold tracking-widest uppercase mb-2">Tap layers to show/hide</p>
                        <div className="grid grid-cols-2 gap-1.5 max-h-[100px] overflow-y-auto pr-1 hide-scrollbar">
                          {ingredientLayers.map(layer => {
                            const vis = visibleLayers.has(layer.id)
                            return (
                              <button key={layer.id} onClick={() => handleLayerClick(layer.id)}
                                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-left transition-all active:scale-95 ${
                                  vis ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-white' : 'border-white/5 bg-white/3 text-white/30'
                                }`}>
                                <span className="text-xs">{layer.emoji}</span>
                                <span className="text-[8px] sm:text-[9px] font-medium truncate flex-1">{layer.label}</span>
                                <div className={`w-2 h-2 rounded-full border ${vis ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/20'}`} />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Nav */}
              <div className="flex justify-between items-center mt-3 px-2">
                <button onClick={() => go(-1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center hover:bg-white/10 active:scale-90">
                  <ChevronLeft size={16} />
                </button>
                <p className="text-[9px] sm:text-[10px] text-white/30 tracking-widest uppercase">
                  {currentIndex + 1} / {items.length}
                </p>
                <button onClick={() => go(1)} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] flex items-center justify-center hover:bg-white/10 active:scale-90">
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col z-10 relative min-h-screen"
            >
              {/* Back + Name */}
              <div className="flex items-center gap-3 px-4 pt-4 pb-2 z-40 relative">
                <button onClick={() => { setPageState('home'); setIsExploded(false); setVisibleLayers(new Set(ingredientLayers.map(l => l.id))) }}
                  className="w-9 h-9 rounded-full bg-black/60 border border-white/10 text-[#D4AF37] flex items-center justify-center active:scale-90 shrink-0">
                  <ArrowLeft size={16} />
                </button>
                <h2 className="text-sm sm:text-base font-serif font-black text-white tracking-tight truncate">{item.name}</h2>
              </div>

              {/* 3D Food */}
              <div className="relative w-full h-[260px] sm:h-[300px] z-20 pointer-events-auto">
                <Food3D
                  type={foodType}
                  selectedToppings={selectedToppings}
                  rotationOffset={rotationOffset}
                  isExploded={isExploded}
                  visibleLayers={visibleLayers}
                  onLayerClick={handleLayerClick}
                />
              </div>

              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                className="flex-1 bg-[#0C0A09]/95 backdrop-blur border-t border-white/5 rounded-t-[2rem] p-4 sm:p-5 shadow-[0_-12px_40px_rgba(0,0,0,0.8)] z-30"
              >
                {/* Name + Price */}
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="min-w-0">
                    {item.popular && (
                      <span className="text-[#D4AF37] text-[7px] sm:text-[8px] font-black tracking-widest uppercase mb-1 bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/20 inline-block">
                        Most Popular
                      </span>
                    )}
                    <h2 className="text-lg sm:text-xl font-serif font-black text-white tracking-tight leading-tight">{item.name}</h2>
                  </div>
                  <div className="text-lg sm:text-xl font-black text-[#D4AF37] pt-1 shrink-0">{price} ETB</div>
                </div>

                <p className="text-[10px] sm:text-[11px] text-white/50 mb-3 leading-relaxed line-clamp-2">{item.description}</p>

                {/* Explode */}
                <div className="mb-3 flex gap-2">
                  <button onClick={handleExplode}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-bold border transition-all active:scale-95 ${
                      isExploded ? 'border-[#E87A30] bg-[#E87A30]/10 text-[#E87A30]' : 'border-white/10 bg-white/5 text-white/60'
                    }`}>
                    <Package size={12} />
                    {isExploded ? 'Assembling...' : 'Explode View'}
                  </button>
                  {isExploded && (
                    <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                      onClick={handleReassemble}
                      className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-bold border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] active:scale-95">
                      <RotateCcw size={12} /> All
                    </motion.button>
                  )}
                </div>

                {/* Layer controls */}
                <AnimatePresence>
                  {isExploded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-3">
                      <div className="bg-white/5 rounded-xl border border-white/5 p-2.5">
                        <p className="text-[7px] sm:text-[8px] text-[#D4AF37] font-bold tracking-widest uppercase mb-2">Tap layers to show/hide</p>
                        <div className="grid grid-cols-2 gap-1.5 max-h-[90px] overflow-y-auto pr-1 hide-scrollbar">
                          {ingredientLayers.map(layer => {
                            const vis = visibleLayers.has(layer.id)
                            return (
                              <button key={layer.id} onClick={() => handleLayerClick(layer.id)}
                                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-left transition-all active:scale-95 ${
                                  vis ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-white' : 'border-white/5 bg-white/3 text-white/30'
                                }`}>
                                <span className="text-xs">{layer.emoji}</span>
                                <span className="text-[8px] sm:text-[9px] font-medium truncate flex-1">{layer.label}</span>
                                <div className={`w-2 h-2 rounded-full border ${vis ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/20'}`} />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Ingredients */}
                <div className="mb-3 py-2 border-t border-b border-white/5 overflow-x-auto hide-scrollbar flex gap-1.5">
                  {item.ingredients.slice(0, 5).map((ing, i) => (
                    <span key={i} className="flex-shrink-0 px-2 py-1 bg-white/3 text-white/60 rounded-full text-[8px] sm:text-[9px] font-medium border border-white/5">
                      {ing}
                    </span>
                  ))}
                </div>

                {/* Toppings */}
                {isCustomizable && (
                  <div className="mb-4">
                    <h3 className="text-[8px] sm:text-[9px] font-bold text-[#D4AF37] mb-2 uppercase tracking-widest">
                      Customize Toppings <span className="text-[#A89F91] normal-case opacity-70 ml-1">(tap to add)</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2 max-h-[120px] sm:max-h-[140px] overflow-y-auto pr-1 hide-scrollbar">
                      {toppingsForItem.map(t => {
                        const active = selectedToppings.includes(t.id)
                        return (
                          <button key={t.id} onClick={() => handleToppingToggle(t.id)}
                            className={`flex items-center gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl border transition-all active:scale-95 ${
                              active ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white font-bold' : 'border-white/5 bg-white/3 text-white/50'
                            }`}>
                            <span className="text-sm sm:text-base leading-none">{t.emoji}</span>
                            <span className="text-[9px] sm:text-[10px] truncate flex-1 leading-none">{t.label}</span>
                            {active && <div className="w-3 h-3 rounded-full bg-[#D4AF37] flex items-center justify-center text-black text-[8px] font-bold">✓</div>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <a href="tel:+251988984865"
                  className="flex justify-center items-center gap-2 w-full py-3.5 rounded-xl bg-[#D4AF37] text-black font-black text-xs tracking-wider uppercase hover:bg-[#E5C059] transition shadow-lg active:scale-[0.98]">
                  📞 Call to Order
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart FAB */}
        <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-[#E87A30] text-white flex items-center justify-center shadow-lg shadow-[#E87A30]/30 z-40">
          <ShoppingCart size={20} />
        </motion.button>

      </div>
    </div>
  )
}
