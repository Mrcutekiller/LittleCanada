'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { menuItems } from '@/lib/menu-data'
import { foodModels } from '@/lib/food-models'
import { Food3D } from './Food3D'

interface Carousel3DProps {
  onSelectItem: (itemId: string) => void
}

const toppingOptions = [
  { id: 'cheese', label: '🧀 Cheese', key: 'cheese' },
  { id: 'lettuce', label: '🥬 Lettuce', key: 'lettuce' },
  { id: 'tomato', label: '🍅 Tomato', key: 'tomato' },
  { id: 'pepperoni', label: '🌶️ Pepperoni', key: 'pepperoni' },
  { id: 'mushroom', label: '🍄 Mushroom', key: 'mushroom' },
  { id: 'olive', label: '⚫ Olive', key: 'olive' },
]

export function Carousel3D({ onSelectItem }: Carousel3DProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])

  const item = useMemo(() => menuItems[currentIndex], [currentIndex])
  const model = foodModels[item.id as keyof typeof foodModels]

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? menuItems.length - 1 : prev - 1))
    setSelectedToppings([])
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === menuItems.length - 1 ? 0 : prev + 1))
    setSelectedToppings([])
  }, [])

  const toggleTopping = useCallback((topping: string) => {
    setSelectedToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    )
  }, [])

  const modelType = model.type as 'burger' | 'pizza' | 'sandwich' | 'dessert'

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#FBF7F2] to-[#F5EFEA] overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 text-center pt-4 md:pt-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-[#1C1008]">Little Canada</h1>
        <p className="text-xs md:text-sm text-[#8A7968]">Explore & Customize</p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-4 py-6 max-w-7xl mx-auto h-[calc(100vh-120px)]">
        {/* Left: 3D Food Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full h-full min-h-96 bg-white/40 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Food3D
                type={modelType}
                color={model.color}
                selectedToppings={selectedToppings}
              />
            </motion.div>
          </AnimatePresence>

          {/* Item Info Overlay */}
          <motion.div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">{item.name}</h2>
            <p className="text-xs md:text-sm text-gray-200 mb-3 line-clamp-1">
              {item.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl md:text-3xl font-bold text-[#E87A30]">
                {item.basePrice} ETB
              </span>
              {item.popular && (
                <span className="text-xs font-semibold text-[#E87A30] bg-white/20 px-3 py-1 rounded-full">
                  Popular
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Controls & Customization */}
        <div className="flex flex-col justify-between h-full">
          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="p-3 md:p-4 rounded-full bg-[#E87A30] text-white hover:bg-[#D6671D] transition-colors shadow-lg"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </motion.button>

            <div className="flex gap-2 flex-wrap justify-center flex-1 mx-4">
              {menuItems.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx)
                    setSelectedToppings([])
                  }}
                  className={`rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-[#E87A30] w-3 h-3 md:w-4 md:h-4'
                      : 'bg-[#D4BFB0] w-2 h-2 hover:bg-[#C4AFA0]'
                  }`}
                  aria-label={`Go to item ${idx + 1}`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="p-3 md:p-4 rounded-full bg-[#E87A30] text-white hover:bg-[#D6671D] transition-colors shadow-lg"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </motion.button>
          </motion.div>

          {/* Customization Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl"
          >
            <h3 className="text-lg md:text-xl font-bold text-[#1C1008] mb-4">
              Customize (Free)
            </h3>

            {/* Topping Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-6">
              {toppingOptions.map((topping) => (
                <motion.button
                  key={topping.id}
                  onClick={() => toggleTopping(topping.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base transition-all ${
                    selectedToppings.includes(topping.key)
                      ? 'bg-[#E87A30] text-white shadow-lg'
                      : 'bg-gray-200 text-[#1C1008] hover:bg-gray-300'
                  }`}
                >
                  {topping.label}
                </motion.button>
              ))}
            </div>

            {/* Selected Toppings Display */}
            <AnimatePresence>
              {selectedToppings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-3 bg-[#FBF7F2] rounded-lg border-2 border-[#E87A30]"
                >
                  <p className="text-xs md:text-sm text-[#1C1008] font-medium">
                    <span className="text-[#E87A30]">✓</span> {selectedToppings.length} topping
                    {selectedToppings.length > 1 ? 's' : ''} added to your preview
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ingredients */}
            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-xs md:text-sm text-[#8A7968] font-medium mb-2">Ingredients:</p>
              <div className="flex flex-wrap gap-1">
                {item.ingredients.slice(0, 4).map((ing, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-white rounded-full text-[#1C1008]"
                  >
                    {ing}
                  </span>
                ))}
                {item.ingredients.length > 4 && (
                  <span className="text-xs px-2 py-1 bg-white rounded-full text-[#8A7968]">
                    +{item.ingredients.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Clear Customization */}
            {selectedToppings.length > 0 && (
              <motion.button
                onClick={() => setSelectedToppings([])}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2 text-sm border-2 border-[#1C1008] text-[#1C1008] rounded-lg hover:bg-[#1C1008] hover:text-white transition-colors"
              >
                Clear Customization
              </motion.button>
            )}
          </motion.div>

          {/* Back to Browse Button */}
          <motion.button
            onClick={() => onSelectItem('')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 px-6 py-3 md:py-4 bg-[#E87A30] text-white rounded-2xl font-bold text-base md:text-lg shadow-xl hover:bg-[#D6671D] transition-colors"
          >
            Share This
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#FBF7F2] to-transparent px-4 py-4 z-20"
      >
        <div className="text-center text-xs md:text-sm text-[#8A7968]">
          <p>Swipe or use arrows to explore • Customize with free toppings</p>
        </div>
      </motion.div>
    </div>
  )
}
