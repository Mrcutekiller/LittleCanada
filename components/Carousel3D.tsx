'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { menuItems } from '@/lib/menu-data'
import { Food3D } from './Food3D'

interface Carousel3DProps {
  onSelectItem: (itemId: string) => void
}

const toppingOptions = [
  { id: 'cheese', label: '🧀 Cheese' },
  { id: 'lettuce', label: '🥬 Lettuce' },
  { id: 'tomato', label: '🍅 Tomato' },
  { id: 'pepperoni', label: '🌶️ Pepperoni' },
  { id: 'mushroom', label: '🍄 Mushroom' },
  { id: 'olive', label: '⚫ Olive' },
]

function getFoodType(itemId: string): 'burger' | 'pizza' | 'sandwich' | 'dessert' {
  if (itemId.startsWith('b')) return 'burger'
  if (itemId.startsWith('p')) return 'pizza'
  if (itemId.startsWith('br')) return 'sandwich'
  return 'dessert'
}

export function Carousel3D({ onSelectItem }: Carousel3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])

  const item = useMemo(() => menuItems[currentIndex], [currentIndex])
  const foodType = useMemo(() => getFoodType(item.id), [item.id])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? menuItems.length - 1 : prev - 1))
    setSelectedToppings([])
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === menuItems.length - 1 ? 0 : prev + 1))
    setSelectedToppings([])
  }, [])

  const handleDragEnd = useCallback(
    (info: any) => {
      if (!info || !info.offset) return
      
      if (Math.abs(info.offset.x) > 50) {
        if (info.offset.x > 0) handlePrev()
        else handleNext()
      }
    },
    [handlePrev, handleNext]
  )

  const toggleTopping = useCallback((topping: string) => {
    setSelectedToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping]
    )
  }, [])

  const clearCustomization = useCallback(() => {
    setSelectedToppings([])
  }, [])

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#FBF7F2] via-[#FDFAF6] to-[#F5EFE7] overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E87A30]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E87A30]/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-20 text-center pt-6 md:pt-8 pb-4"
      >
        <h1 className="text-4xl md:text-5xl font-black text-[#1C1008] tracking-tight">
          Little Canada
        </h1>
        <p className="text-sm md:text-base text-[#8A7968] mt-2 font-medium">
          Premium Café Experience
        </p>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 px-4 md:px-6 py-6 md:py-8">
        {/* Mobile/Tablet: Stacked Layout */}
        <div className="md:hidden flex flex-col gap-6 max-w-md mx-auto">
          {/* 3D Display */}
          <motion.div
            key={`mobile-${item.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white/50 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden aspect-square"
          >
            <Food3D type={foodType} selectedToppings={selectedToppings} />
          </motion.div>

          {/* Info Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`info-${item.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#1C1008] leading-tight">
                    {item.name}
                  </h2>
                  {item.popular && (
                    <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold text-white bg-[#E87A30] rounded-full">
                      Popular Choice
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-[#8A7968] mb-4 line-clamp-2">
                {item.description}
              </p>
              <div className="text-3xl font-black text-[#E87A30] tracking-tight">
                {item.basePrice} ETB
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="p-3 rounded-full bg-[#E87A30] text-white hover:bg-[#D6671D] shadow-lg transition-colors"
              aria-label="Previous item"
            >
              <ChevronLeft size={24} />
            </motion.button>

            <div className="flex gap-2">
              {menuItems.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx)
                    setSelectedToppings([])
                  }}
                  className={`rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-[#E87A30] w-2.5 h-2.5'
                      : 'bg-[#D4BFB0] w-2 h-2 hover:bg-[#C4AFA0]'
                  }`}
                  whileHover={{ scale: 1.15 }}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="p-3 rounded-full bg-[#E87A30] text-white hover:bg-[#D6671D] shadow-lg transition-colors"
              aria-label="Next item"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div>

          {/* Customize Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
            <h3 className="text-lg font-bold text-[#1C1008] mb-4">
              Customize <span className="text-[#E87A30]">(Free)</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {toppingOptions.map((topping) => (
                <motion.button
                  key={topping.id}
                  onClick={() => toggleTopping(topping.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`py-3 px-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    selectedToppings.includes(topping.id)
                      ? 'bg-[#E87A30] text-white shadow-lg'
                      : 'bg-[#F0E8DC] text-[#1C1008] hover:bg-[#E5DCC8]'
                  }`}
                >
                  {topping.label}
                </motion.button>
              ))}
            </div>

            {selectedToppings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-3 py-2 bg-[#E87A30]/10 rounded-lg text-sm text-[#E87A30] font-medium mb-3"
              >
                <span>✓ {selectedToppings.length} topping{selectedToppings.length !== 1 ? 's' : ''} added</span>
              </motion.div>
            )}

            {selectedToppings.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearCustomization}
                className="w-full py-2 px-3 border-2 border-[#E87A30] text-[#E87A30] rounded-xl font-semibold hover:bg-[#E87A30]/10 transition-colors"
              >
                <Trash2 size={16} className="inline mr-2" />
                Clear
              </motion.button>
            )}
          </div>

          {/* Ingredients */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-lg">
            <h3 className="text-lg font-bold text-[#1C1008] mb-3">Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {item.ingredients.slice(0, 4).map((ing, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-[#F0E8DC] text-[#8A7968] rounded-full text-xs font-medium"
                >
                  {ing}
                </span>
              ))}
              {item.ingredients.length > 4 && (
                <span className="px-3 py-1.5 bg-[#E87A30]/20 text-[#E87A30] rounded-full text-xs font-medium">
                  +{item.ingredients.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Desktop: Side-by-Side Layout */}
        <div className="hidden md:grid grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left: 3D Display with Controls */}
          <div className="flex flex-col gap-6">
            {/* 3D Viewer */}
            <motion.div
              drag="x"
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              key={`desktop-${item.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden aspect-square cursor-grab active:cursor-grabbing"
            >
              <Food3D type={foodType} selectedToppings={selectedToppings} />

              {/* Popular Badge */}
              {item.popular && (
                <div className="absolute top-6 right-6 px-4 py-2 bg-[#E87A30] text-white rounded-full font-bold text-sm shadow-lg">
                  Popular
                </div>
              )}

              {/* Item Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 text-white">
                <h2 className="text-3xl font-black mb-2">{item.name}</h2>
                <p className="text-sm opacity-90 mb-4">{item.description}</p>
                <div className="text-4xl font-black text-[#FFD700]">{item.basePrice} ETB</div>
              </div>
            </motion.div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handlePrev}
                className="p-4 rounded-full bg-[#E87A30] text-white hover:bg-[#D6671D] shadow-lg transition-colors"
              >
                <ChevronLeft size={28} />
              </motion.button>

              <div className="flex gap-2">
                {menuItems.map((_, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx)
                      setSelectedToppings([])
                    }}
                    className={`rounded-full transition-all ${
                      idx === currentIndex
                        ? 'bg-[#E87A30] w-3 h-3'
                        : 'bg-[#D4BFB0] w-2 h-2 hover:bg-[#C4AFA0]'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleNext}
                className="p-4 rounded-full bg-[#E87A30] text-white hover:bg-[#D6671D] shadow-lg transition-colors"
              >
                <ChevronRight size={28} />
              </motion.button>
            </div>
          </div>

          {/* Right: Customization Panel */}
          <div className="flex flex-col gap-6">
            {/* Customize Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl"
            >
              <h3 className="text-2xl font-black text-[#1C1008] mb-6">
                Customize <span className="text-[#E87A30]">(Free)</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {toppingOptions.map((topping) => (
                  <motion.button
                    key={topping.id}
                    onClick={() => toggleTopping(topping.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`py-4 px-4 rounded-2xl font-bold text-base transition-all duration-200 ${
                      selectedToppings.includes(topping.id)
                        ? 'bg-[#E87A30] text-white shadow-lg scale-105'
                        : 'bg-[#F0E8DC] text-[#1C1008] hover:bg-[#E5DCC8]'
                    }`}
                  >
                    {topping.label}
                  </motion.button>
                ))}
              </div>

              {selectedToppings.length > 0 && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    className="flex items-center gap-2 px-4 py-3 bg-[#E87A30]/10 rounded-xl text-[#E87A30] font-bold mb-4 origin-left"
                  >
                    <span className="text-lg">✓</span>
                    <span>{selectedToppings.length} topping{selectedToppings.length !== 1 ? 's' : ''} added to your preview</span>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearCustomization}
                    className="w-full py-3 px-4 border-2 border-[#E87A30] text-[#E87A30] rounded-xl font-bold hover:bg-[#E87A30]/10 transition-colors mb-4"
                  >
                    <Trash2 size={18} className="inline mr-2" />
                    Clear Customization
                  </motion.button>
                </>
              )}
            </motion.div>

            {/* Ingredients Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl flex-1"
            >
              <h3 className="text-2xl font-black text-[#1C1008] mb-4">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {item.ingredients.map((ing, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-4 py-2 bg-gradient-to-br from-[#F0E8DC] to-[#E5DCC8] text-[#8A7968] rounded-full text-sm font-semibold"
                  >
                    {ing}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Footer Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 text-center text-sm text-[#8A7968]"
            >
              <p className="mb-3">📞 Need Help? Contact Us</p>
              <div className="flex gap-3">
                <a
                  href="tel:+251988984865"
                  className="flex-1 px-4 py-2 bg-[#E87A30] text-white rounded-lg font-bold hover:bg-[#D6671D] transition-colors"
                >
                  Call
                </a>
                <a
                  href="https://wa.me/251988984865"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2 border-2 border-[#E87A30] text-[#E87A30] rounded-lg font-bold hover:bg-[#E87A30]/10 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer Contact (Mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="md:hidden relative z-10 px-4 py-6 text-center"
      >
        <p className="text-sm text-[#8A7968] mb-3">Questions? Reach out to us</p>
        <div className="flex gap-3 max-w-md mx-auto">
          <a
            href="tel:+251988984865"
            className="flex-1 px-4 py-3 bg-[#E87A30] text-white rounded-xl font-bold hover:bg-[#D6671D] transition-colors"
          >
            📞 Call
          </a>
          <a
            href="https://wa.me/251988984865"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 border-2 border-[#E87A30] text-[#E87A30] rounded-xl font-bold hover:bg-[#E87A30]/10 transition-colors"
          >
            💬 WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  )
}
