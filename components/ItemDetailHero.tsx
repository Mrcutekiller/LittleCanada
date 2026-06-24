'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Minus, MessageCircle, Phone } from 'lucide-react'
import { MenuItem } from '@/lib/menu-data'

interface ItemDetailHeroProps {
  item: MenuItem
  onBack: () => void
}

const sizes = [
  { label: 'Small', multiplier: 0.8, id: 's' },
  { label: 'Medium', multiplier: 1, id: 'm' },
  { label: 'Large', multiplier: 1.2, id: 'l' },
]

const toppingOptions = [
  { id: 'cheese', label: 'Extra Cheese', emoji: '🧀', priceAdd: 50 },
  { id: 'pepperoni', label: 'Pepperoni', emoji: '🌶️', priceAdd: 75 },
  { id: 'mushroom', label: 'Mushroom', emoji: '🍄', priceAdd: 40 },
  { id: 'onion', label: 'Onion', emoji: '🧅', priceAdd: 30 },
  { id: 'olive', label: 'Olive', emoji: '🫒', priceAdd: 35 },
  { id: 'tomato', label: 'Tomato', emoji: '🍅', priceAdd: 25 },
]

export function ItemDetailHero({ item, onBack }: ItemDetailHeroProps) {
  const [selectedSize, setSelectedSize] = useState('m')
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [flyingToppings, setFlyingToppings] = useState<
    Array<{ id: string; x: number; y: number }>
  >([])

  const sizeMultiplier =
    sizes.find((s) => s.id === selectedSize)?.multiplier || 1
  const toppingPrice = selectedToppings.reduce((sum, toppingId) => {
    const topping = toppingOptions.find((t) => t.id === toppingId)
    return sum + (topping?.priceAdd || 0)
  }, 0)
  const totalPrice = Math.round(item.basePrice * sizeMultiplier + toppingPrice)

  const toggleTopping = (
    toppingId: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2 - 100

    // Add flying topping animation
    setFlyingToppings((prev) => [
      ...prev,
      {
        id: `${toppingId}-${Date.now()}`,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      },
    ])

    // Toggle selection
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((t) => t !== toppingId)
        : [...prev, toppingId]
    )

    // Remove flying animation after completion
    setTimeout(() => {
      setFlyingToppings((prev) => prev.filter((t) => t.id !== `${toppingId}-${Date.now()}`))
    }, 600)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF7F2] to-[#F5EFE7] overflow-hidden">
      {/* Header with Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#E87A30]/20 p-4"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#1C1008] hover:text-[#E87A30] transition-colors"
        >
          <ArrowLeft size={24} />
          <span className="font-semibold">Back</span>
        </button>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section with Item */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center gap-8 mb-12"
        >
          {/* Large Item Display */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ rotate: -15, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white shadow-2xl border-8 border-[#E87A30] flex items-center justify-center overflow-hidden"
              >
                <motion.div
                  animate={{ scale: sizeMultiplier }}
                  transition={{ duration: 0.3 }}
                  className="text-9xl md:text-[140px]"
                >
                  {item.emoji}
                </motion.div>
              </div>

              {/* Floating SVG Decorations */}
              <motion.div
                className="absolute -top-8 -right-8 text-4xl opacity-50"
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🍅
              </motion.div>
              <motion.div
                className="absolute -bottom-8 -left-8 text-5xl opacity-50"
                animate={{ y: [0, -20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
              >
                🌿
              </motion.div>
            </motion.div>

            {/* Flying Toppings Animation Container */}
            <AnimatePresence>
              {flyingToppings.map((flying) => {
                const centerX = window.innerWidth / 2
                const centerY = window.innerHeight / 2 - 100
                const topping = toppingOptions.find(
                  (t) => t.id === flying.id.split('-')[0]
                )

                return (
                  <motion.div
                    key={flying.id}
                    initial={{
                      x: flying.x - centerX,
                      y: flying.y - centerY,
                      opacity: 1,
                      scale: 1,
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      opacity: 0,
                      scale: 0.2,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="fixed pointer-events-none text-3xl"
                    style={{ left: centerX, top: centerY }}
                  >
                    {topping?.emoji}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#1C1008] mb-2">
              {item.name}
            </h1>
            <p className="text-[#666] text-lg mb-6">{item.description}</p>

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="font-bold text-[#1C1008] mb-2">Ingredients:</h3>
              <p className="text-[#666] text-sm">
                {item.ingredients.join(', ')}
              </p>
            </div>

            {/* Size Selector with Price Update */}
            <div className="mb-8">
              <h3 className="font-bold text-[#1C1008] mb-3">Size:</h3>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <motion.button
                    key={size.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedSize === size.id
                        ? 'bg-[#E87A30] text-white shadow-lg'
                        : 'bg-white border-2 border-[#D4C4B0] text-[#1C1008] hover:border-[#E87A30]'
                    }`}
                  >
                    {size.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price Display */}
            <motion.div
              key={totalPrice}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-[#E87A30] mb-8"
            >
              {totalPrice} ETB
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Toppings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-[#1C1008] mb-4">Add Toppings</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {toppingOptions.map((topping) => (
              <motion.button
                key={topping.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => toggleTopping(topping.id, e)}
                className={`p-4 rounded-lg font-semibold transition-all border-2 flex items-center gap-2 ${
                  selectedToppings.includes(topping.id)
                    ? 'bg-[#E87A30] text-white border-[#E87A30] shadow-lg'
                    : 'bg-white border-[#D4C4B0] text-[#1C1008] hover:border-[#E87A30]'
                }`}
              >
                <span className="text-xl">{topping.emoji}</span>
                <div className="text-left">
                  <div className="text-sm">{topping.label}</div>
                  <div className="text-xs opacity-75">+{topping.priceAdd} ETB</div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Packaging Box Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl border-2 border-[#D4C4B0] p-6 mb-12 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">📦</div>
            <div className="flex-1">
              <h3 className="font-bold text-[#1C1008] text-lg">
                Ready to Deliver
              </h3>
              <p className="text-[#666] text-sm">
                Your order will be carefully packaged and ready for pickup or delivery
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E87A30]/20 p-4 md:relative md:border-t-0"
        >
          <div className="max-w-4xl mx-auto flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-6 py-3 bg-[#E87A30] text-white rounded-lg font-bold hover:bg-[#d66a20] transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add to Cart - {totalPrice} ETB
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 bg-[#F5EFE7] border-2 border-[#D4C4B0] rounded-lg font-semibold text-[#1C1008] hover:bg-[#E87A30] hover:text-white hover:border-[#E87A30] transition-all flex items-center justify-center gap-2"
            >
              <Phone size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-3 bg-[#F5EFE7] border-2 border-[#D4C4B0] rounded-lg font-semibold text-[#1C1008] hover:bg-[#E87A30] hover:text-white hover:border-[#E87A30] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
