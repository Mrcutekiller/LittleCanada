'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, ChefHat } from 'lucide-react'
import { MenuItem } from '@/lib/menu-data'

interface ItemDetailHeroProps {
  item: MenuItem
  onBack: () => void
}

const toppingOptions = [
  { id: 'cheese', label: 'Extra Cheese', emoji: '🧀' },
  { id: 'pepperoni', label: 'Pepperoni', emoji: '🌶️' },
  { id: 'mushroom', label: 'Mushroom', emoji: '🍄' },
  { id: 'onion', label: 'Onion', emoji: '🧅' },
  { id: 'olive', label: 'Olive', emoji: '🫒' },
  { id: 'tomato', label: 'Tomato', emoji: '🍅' },
]

export function ItemDetailHero({ item, onBack }: ItemDetailHeroProps) {
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)

  const toggleTopping = useCallback((toppingId: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    )
  }, [])

  const handleAddQuantity = useCallback(() => setQuantity((q) => q + 1), [])
  const handleRemoveQuantity = useCallback(
    () => setQuantity((q) => (q > 1 ? q - 1 : 1)),
    []
  )

  const totalPrice = item.basePrice * quantity

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-gradient-to-b from-[#FBF7F2] to-[#F5EFEA] overflow-y-auto overscroll-none"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-between px-4 py-3 md:py-4 border-b border-[#E8DCC8]"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 rounded-full hover:bg-[#F5EFEA] transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-[#1C1008]" />
        </motion.button>
        <h1 className="text-lg md:text-xl font-bold text-[#1C1008] flex-1 ml-4">
          {item.name}
        </h1>
      </motion.div>

      <div className="flex flex-col px-4 py-6 md:py-8 max-w-md mx-auto pb-24">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl mb-6 md:mb-8 bg-white"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            priority
            sizes="90vw"
            quality={90}
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="text-sm md:text-base text-[#8A7968] mb-6"
        >
          {item.description}
        </motion.p>

        {/* Ingredients */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-sm md:text-base font-bold text-[#1C1008] mb-3 flex items-center gap-2">
            <ChefHat size={18} className="text-[#E87A30]" />
            Ingredients
          </h3>
          <div className="flex flex-wrap gap-2">
            {item.ingredients.map((ingredient, idx) => (
              <motion.div
                key={ingredient}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="px-3 py-1 bg-[#F5EFEA] text-xs md:text-sm text-[#8A7968] rounded-full"
              >
                {ingredient}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Toppings Section */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-sm md:text-base font-bold text-[#1C1008] mb-3">
            Customize (Free)
          </h3>
          <div className="flex flex-wrap gap-2">
            {toppingOptions.map((topping) => (
              <motion.button
                key={topping.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTopping(topping.id)}
                className={`px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-all ${
                  selectedToppings.includes(topping.id)
                    ? 'bg-[#E87A30] text-white shadow-lg'
                    : 'bg-[#F5EFEA] text-[#1C1008] hover:bg-[#EBE5DE]'
                }`}
              >
                {topping.emoji} {topping.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quantity Selector */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="mb-8 flex items-center gap-4 bg-[#F5EFEA] p-4 rounded-xl"
        >
          <span className="text-sm md:text-base font-semibold text-[#1C1008]">
            Quantity
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRemoveQuantity}
              className="p-1.5 rounded-lg hover:bg-white transition-colors"
            >
              <span className="text-lg font-bold text-[#E87A30]">−</span>
            </motion.button>
            <span className="w-8 text-center font-bold text-[#1C1008]">
              {quantity}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddQuantity}
              className="p-1.5 rounded-lg hover:bg-white transition-colors"
            >
              <span className="text-lg font-bold text-[#E87A30]">+</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Price and CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8DCC8] px-4 py-4 max-w-md mx-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg md:text-xl font-bold text-[#1C1008]">
              Total
            </span>
            <span className="text-2xl md:text-3xl font-bold text-[#E87A30]">
              {totalPrice} ETB
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 md:py-4 bg-[#E87A30] text-white rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-xl hover:bg-[#D6671D] transition-colors mb-3"
          >
            Add to Order
          </motion.button>
          <div className="flex gap-2">
            <a
              href="tel:+251988984865"
              className="flex-1 py-2.5 md:py-3 border-2 border-[#E87A30] text-[#E87A30] rounded-xl font-medium hover:bg-[#FBF7F2] transition-colors text-xs md:text-sm text-center"
            >
              📞 Call
            </a>
            <a
              href="https://wa.me/251988984865"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 md:py-3 bg-[#E87A30] text-white rounded-xl font-medium hover:bg-[#D6671D] transition-colors text-xs md:text-sm text-center"
            >
              💬 Chat
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
