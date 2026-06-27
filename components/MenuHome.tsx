'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { MENU, CATEGORIES, type CategoryKey } from '@/lib/menu-data'
import { useScrollTransition, interpolate } from '@/hooks/useScrollTransition'

function isDarkImage(imgSrc?: string): boolean {
  if (!imgSrc) return false
  const darkImages = ['Fried Chicken Burger', 'Half Half Burger', 'L.C Special Burger']
  return darkImages.some(name => imgSrc.includes(name))
}

const t = {
  bg: '#FFFFFF',
  card: 'from-black/5 to-black/[0.02]',
  text: '#0A0A0A',
  muted: '#666666',
  border: 'rgba(0,0,0,0.1)',
  accent: '#D4AF37',
  surface: 'bg-black/5'
}

const INGREDIENT_IMAGES: Record<string, string> = {
  'beef': 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=600&q=80',
  'double beef': 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
  'canadian cheese': 'https://images.unsplash.com/photo-1486299267070-8382e21b471a?auto=format&fit=crop&w=600&q=80',
  'cheese': 'https://images.unsplash.com/photo-1486299267070-8382e21b471a?auto=format&fit=crop&w=600&q=80',
  'lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80',
  'tomato': 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80',
  'sauce': 'https://images.unsplash.com/photo-1614373451955-a4e70e93ef8a?auto=format&fit=crop&w=600&q=80',
  'onion': 'https://images.unsplash.com/photo-1618512496248-a07fe8376604?auto=format&fit=crop&w=600&q=80',
  'mayo': 'https://images.unsplash.com/photo-1669994537466-433652ab10fa?auto=format&fit=crop&w=600&q=80',
  'fried chicken': 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80',
  'chicken': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
  'plant-based patty': 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=600&q=80',
  'vegan mayo': 'https://images.unsplash.com/photo-1669994537466-433652ab10fa?auto=format&fit=crop&w=600&q=80',
  'double chicken': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
  'veggie': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  'tomato sauce': 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=600&q=80',
  'bbq sauce': 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&w=600&q=80',
  'meat': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
  'caramelized onions': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?auto=format&fit=crop&w=600&q=80',
  'mushroom': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
  'pepper': 'https://images.unsplash.com/photo-1563565312879-8a7b047743d8?auto=format&fit=crop&w=600&q=80',
  'ham': 'https://images.unsplash.com/photo-1524438418349-4b1a78669e52?auto=format&fit=crop&w=600&q=80',
  'pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=80',
  'plant-based toppings': 'https://images.unsplash.com/photo-1622484211148-716598e0901a?auto=format&fit=crop&w=600&q=80',
  'egg omelette': 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=600&q=80',
  'toasted bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  'tuna': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80',
  'egg': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
  'eggs': 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80',
  'butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80',
  'cinnamon': 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80',
  'nutella': 'https://images.unsplash.com/photo-1553456558-aff63285bdd1?auto=format&fit=crop&w=600&q=80',
  'white chocolate': 'https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=600&q=80',
  'maple syrup': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80',
  'syrup': 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80',
  'oreo': 'https://images.unsplash.com/photo-1646619271415-f9d1aac4e87a?auto=format&fit=crop&w=600&q=80',
  'kitkat': 'https://images.unsplash.com/photo-1582208993730-80d6f35b62b7?auto=format&fit=crop&w=600&q=80',
  'mars': 'https://images.unsplash.com/photo-1623660053975-cf75a8be0908?auto=format&fit=crop&w=600&q=80',
  'strawberry': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=80',
  'flour': 'https://images.unsplash.com/photo-1627735483792-233bf632619b?auto=format&fit=crop&w=600&q=80',
  'fresh cream': 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80',
  'cream': 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=80',
  'vanilla': 'https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&w=600&q=80',
  'sugar': 'https://images.unsplash.com/photo-1581781862590-f203876e4f3a?auto=format&fit=crop&w=600&q=80',
  'ice cream': 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=600&q=80',
  'wafer': 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80',
  'coffee/milk': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
  'ice': 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=600&q=80',
  'coca-cola': 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=600&q=80',
  'sprite': 'https://images.unsplash.com/photo-1680404005217-a441afdefe83?auto=format&fit=crop&w=600&q=80',
  'fanta': 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=600&q=80',
  'water': 'https://images.unsplash.com/photo-1548839140-29a88648f138?auto=format&fit=crop&w=600&q=80',
  'veggies': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
}

function getIngredientEmoji(ing: string): string {
  const name = ing.toLowerCase()
  if (name.includes('beef')) return '🥩'
  if (name.includes('chicken')) return '🍗'
  if (name.includes('cheese')) return '🧀'
  if (name.includes('lettuce') || name.includes('lettuch')) return '🥬'
  if (name.includes('tomato')) return '🍅'
  if (name.includes('sauce')) return '🫗'
  if (name.includes('onion')) return '🧅'
  if (name.includes('mayo')) return '🍶'
  if (name.includes('patty')) return '🍔'
  if (name.includes('veggie') || name.includes('topping')) return '🥗'
  if (name.includes('mushroom')) return '🍄'
  if (name.includes('pepper') || name.includes('papper')) return '🫑'
  if (name.includes('ham')) return '🥓'
  if (name.includes('pineapple')) return '🍍'
  if (name.includes('egg')) return '🍳'
  if (name.includes('bread')) return '🍞'
  if (name.includes('tuna')) return '🐟'
  if (name.includes('butter')) return '🧈'
  if (name.includes('cinnamon')) return '🍂'
  if (name.includes('nutella')) return '🍫'
  if (name.includes('chocolate')) return '🍫'
  if (name.includes('syrup')) return '🍯'
  if (name.includes('oreo') || name.includes('kitkat') || name.includes('mars')) return '🍪'
  if (name.includes('strawberry')) return '🍓'
  if (name.includes('flour')) return '🌾'
  if (name.includes('cream')) return '🍨'
  if (name.includes('vanilla')) return '🍦'
  if (name.includes('sugar')) return '🍬'
  if (name.includes('wafer')) return '🧇'
  if (name.includes('coffee') || name.includes('milk')) return '☕'
  if (name.includes('ice')) return '🧊'
  if (name.includes('cola')) return '🥤'
  if (name.includes('sprite') || name.includes('fanta')) return '🥤'
  if (name.includes('water')) return '💧'
  return '🍽️'
}

function capitalizeWords(str: string): string {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export function MenuHome() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('burgers')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(360)

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth)
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Programmatic global preloader for instant asset load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Eagerly preload all cover images
      Object.values(MENU).flat().forEach((menuItem) => {
        if (menuItem.coverImage) {
          const img = new Image()
          img.src = `${menuItem.coverImage}?v=lc-2`
        }
      })

      // Eagerly preload all ingredient images
      Object.values(INGREDIENT_IMAGES).forEach((url) => {
        const img = new Image()
        img.src = url
      })
    }
  }, [])

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

  const dragX = useMotionValue(0)

  const items = useMemo(() => MENU[activeCategory], [activeCategory])
  const item = items[currentIndex] ?? items[0]

  const go = useCallback((dir: 1 | -1) => {
    setCurrentIndex(prev => {
      const next = prev + dir
      if (next < 0) return items.length - 1
      if (next >= items.length) return 0
      return next
    })
  }, [items.length])

  const handleCategoryChange = (cat: CategoryKey) => {
    setActiveCategory(cat)
    setCurrentIndex(0)
  }

  const cardWidth = containerWidth > 480 ? 270 : 230
  const gap = 16
  const centeringOffset = (containerWidth - cardWidth) / 2
  const targetX = centeringOffset - currentIndex * (cardWidth + gap)

  useEffect(() => {
    animate(dragX, targetX, { type: 'spring', stiffness: 280, damping: 28 })
  }, [currentIndex, targetX, dragX])

  const handleCardDragEnd = useCallback((_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipe = info.offset.x
    const velocity = info.velocity.x
    
    if (swipe < -60 || velocity < -500) {
      go(1)
    } else if (swipe > 60 || velocity > 500) {
      go(-1)
    } else {
      animate(dragX, targetX, { type: 'spring', stiffness: 280, damping: 28 })
    }
  }, [go, dragX, targetX])

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

  return (
    <div
      className="h-[100dvh] max-h-[100dvh] overflow-hidden font-sans transition-colors duration-300"
      style={{ backgroundColor: t.bg, color: t.text }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="max-w-lg mx-auto h-[100dvh] max-h-[100dvh] relative flex flex-col overflow-hidden transition-colors duration-300" style={{ backgroundColor: t.bg }}>

        {/* Background Image Preloader for instant transitions (offscreen to force browser layout and eager decoding) */}
        <div 
          style={{ 
            position: 'absolute', 
            width: '1px', 
            height: '1px', 
            opacity: 0.01, 
            overflow: 'hidden', 
            pointerEvents: 'none',
            top: '-10px',
            left: '-10px'
          }} 
          aria-hidden="true"
        >
          {/* Preload cover images for all menu items globally */}
          {Object.values(MENU).flat().map((menuItem) => (
            menuItem.coverImage ? (
              <img
                key={menuItem.id}
                src={`${menuItem.coverImage}?v=lc-2`}
                alt=""
                loading="eager"
              />
            ) : null
          ))}
          {/* Preload all ingredient modal images */}
          {Object.entries(INGREDIENT_IMAGES).map(([name, url]) => (
            <img
              key={name}
              src={url}
              alt=""
              loading="eager"
            />
          ))}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-5 pb-0 z-10 relative"
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
            style={{ backgroundColor: t.bg + 'CC', borderColor: 'rgba(0,0,0,0.1)', color: t.accent }}>
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-sm sm:text-base font-serif font-black tracking-tight truncate" style={{ color: t.text }}>{item.name}</h2>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2 mt-2 sm:mt-3 px-5 sm:px-6 z-10 relative snap-x"
          style={{ opacity: homeOpacity }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => handleCategoryChange(cat.key)}
              onPointerDown={(e) => e.stopPropagation()}
              className={`snap-start flex-shrink-0 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-bold transition-all active:scale-95 ${
                activeCategory === cat.key ? 'shadow-md' : ''
              }`}
              style={activeCategory === cat.key
                ? { backgroundColor: t.accent, color: '#ffffff' }
                : { backgroundColor: t.accent + '08', color: t.muted, border: `1px solid ${t.accent}15` }
              }>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Food Name */}
        <div className="text-center mt-2 sm:mt-3 mb-1 min-h-[50px] sm:min-h-[60px] flex flex-col items-center justify-center z-10 relative px-5">
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

        {/* Food Cards Carousel */}
        <div className="flex-1 flex items-center justify-center relative mt-1 z-10 w-full overflow-hidden" ref={containerRef}>
          <motion.div
            drag="x"
            dragConstraints={{
              left: centeringOffset - (items.length - 1) * (cardWidth + gap) - 50,
              right: centeringOffset + 50,
            }}
            dragElastic={0.25}
            onDragEnd={handleCardDragEnd}
            className="flex items-center absolute left-0"
            style={{ gap, x: dragX }}
          >
            {items.map((menuItem, idx) => {
              const isActive = idx === currentIndex;
              
              // Define local animations for each card based on active state and progress
              const scale = isActive ? cardScale : 0.82 * (1 - progress);
              const y = isActive ? cardY : 8;
              const borderRadius = isActive ? cardRadius : 32;
              const opacity = (isActive ? 1 : 0.45) * (1 - progress);
              const rotate = isActive ? 0 : (idx < currentIndex ? -8 : 8);

              return (
                <motion.div
                  key={menuItem.id}
                  style={{
                    width: cardWidth,
                    height: cardWidth,
                    backgroundColor: isDarkImage(menuItem.coverImage) ? '#050505' : '#ffffff',
                    borderColor: isDarkImage(menuItem.coverImage) ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                    scale,
                    y,
                    borderRadius,
                    opacity,
                    rotate,
                  }}
                  className="relative overflow-hidden flex items-center justify-center p-3 shrink-0 shadow-2xl border transition-colors duration-300"
                >
                  <div className="w-full h-full relative flex items-center justify-center">
                    {menuItem.coverImage && (
                      <img
                        src={`${menuItem.coverImage}?v=lc-2`}
                        alt={menuItem.name}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* View Details Button */}
        <div className="mt-2 sm:mt-3 px-5 sm:px-6 z-10 relative" style={{ opacity: homeOpacity }}>
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
        <div className="flex justify-between items-center mt-2 sm:mt-3 mb-3 sm:mb-4 px-5 sm:px-6 z-10 relative" style={{ opacity: homeOpacity }}>
          <button onClick={() => go(-1)} onPointerDown={(e) => e.stopPropagation()} className="w-9 h-9 rounded-full border flex items-center justify-center hover:opacity-80 active:scale-90"
            style={{ backgroundColor: t.accent + '08', borderColor: 'rgba(0,0,0,0.1)', color: t.accent }}>
            <ChevronLeft size={16} />
          </button>
          <p className="text-[9px] sm:text-[10px] tracking-widest uppercase" style={{ color: t.muted + '60' }}>
            {currentIndex + 1} / {items.length}
          </p>
          <button onClick={() => go(1)} onPointerDown={(e) => e.stopPropagation()} className="w-9 h-9 rounded-full border flex items-center justify-center hover:opacity-80 active:scale-90"
            style={{ backgroundColor: t.accent + '08', borderColor: 'rgba(0,0,0,0.1)', color: t.accent }}>
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
          <div className="border-t rounded-t-[2.5rem] p-5 sm:p-7 transition-colors duration-300 overflow-y-auto h-[78vh] sm:h-[82vh] relative"
            style={{ backgroundColor: t.bg, borderColor: 'rgba(0,0,0,0.08)', boxShadow: '0 -12px 40px rgba(0,0,0,0.15)' }}>
            
            {/* Drag Handle Indicator */}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-1 rounded-full bg-black/10" />
            </div>

            <div className="pb-24 sm:pb-32">
                <div 
                  className="mb-5 rounded-2xl overflow-hidden border shadow-sm flex items-center justify-center h-[220px] sm:h-[260px] relative transition-colors duration-300"
                  style={{ 
                    backgroundColor: isDarkImage(item.coverImage) ? '#000000' : '#ffffff', 
                    borderColor: 'rgba(0,0,0,0.08)'
                  }}
                >
                  {items.map((menuItem) => (
                    menuItem.coverImage ? (
                      <img
                        key={menuItem.id}
                        src={`${menuItem.coverImage}?v=lc-2`}
                        alt={menuItem.name}
                        className="w-full h-full object-contain p-2 absolute inset-0 transition-opacity duration-75"
                        style={{
                          opacity: menuItem.id === item.id ? 1 : 0,
                          pointerEvents: menuItem.id === item.id ? 'auto' : 'none',
                        }}
                      />
                    ) : null
                  ))}
                </div>

              <div className="mb-4 text-center">
                <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight" style={{ color: t.text }}>{item.name}</h2>
                <span className="text-xl sm:text-2xl font-black" style={{ color: t.accent }}>{price} ETB</span>
              </div>

              {/* Ingredients List */}
              <div className="mb-5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-center" style={{ color: t.accent }}>
                  Ingredients (Tap to see photo)
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {item.ingredients.map((ing) => (
                    <button
                      key={ing}
                      onClick={() => setSelectedIngredient(ing)}
                      className="px-4 py-2 rounded-full text-[11px] font-bold border transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm animate-fade-in"
                      style={{
                        backgroundColor: t.accent + '05',
                        color: t.text,
                        borderColor: t.accent + '25',
                      }}
                    >
                      <span className="text-xs">{getIngredientEmoji(ing)}</span>
                      <span>{capitalizeWords(ing)}</span>
                    </button>
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

        {/* Ingredient Detail Modal */}
        {selectedIngredient && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedIngredient(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-sm max-h-[85vh] rounded-[2rem] border overflow-hidden shadow-2xl p-5 cursor-default flex flex-col"
              style={{ 
                backgroundColor: '#ffffff', 
                borderColor: 'rgba(0,0,0,0.1)' 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedIngredient(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border text-xs font-bold transition-all active:scale-90 z-10 cursor-pointer"
                style={{ 
                  borderColor: t.accent + '30', 
                  color: t.accent, 
                  backgroundColor: t.accent + '10' 
                }}
              >
                ✕
              </button>

              {/* Ingredient Image */}
              <div className="w-full h-40 sm:h-48 rounded-2xl overflow-hidden border mb-4 bg-black/5 flex items-center justify-center shrink-0">
                <img 
                  src={INGREDIENT_IMAGES[selectedIngredient.toLowerCase()] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'} 
                  alt={selectedIngredient} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="text-center overflow-y-auto pr-1">
                <h3 className="text-lg font-serif font-black tracking-tight mb-1" style={{ color: t.text }}>
                  {capitalizeWords(selectedIngredient)}
                </h3>
                <p className="text-[10px] tracking-widest uppercase mb-2" style={{ color: t.accent }}>
                  Fresh Ingredient
                </p>
                <p className="text-[11.5px] leading-relaxed" style={{ color: t.muted }}>
                  This fresh {selectedIngredient} is premium-sourced, prepared daily, and forms an essential layer of flavor in our {item.name}.
                </p>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  )
}
