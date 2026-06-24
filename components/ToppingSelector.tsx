'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { TOPPINGS } from '@/lib/menu-data'

interface ToppingSelectorProps {
  isForCustomizable: boolean
  selectedToppings: string[]
  onToppingSelect: (topping: string) => void
}

export function ToppingSelector({ isForCustomizable, selectedToppings, onToppingSelect }: ToppingSelectorProps) {
  const [flyingToppings, setFlyingToppings] = useState<Array<{ id: string; emoji: string }>>([])
  const plateRef = useRef<HTMLDivElement>(null)

  if (!isForCustomizable) return null

  const handleToppingClick = (topping: string) => {
    const emoji = topping.split(' ')[0]
    const id = `${topping}-${Date.now()}`

    setFlyingToppings((prev) => [...prev, { id, emoji }])
    setTimeout(() => {
      setFlyingToppings((prev) => prev.filter((t) => t.id !== id))
    }, 550)

    onToppingSelect(topping)
  }

  return (
    <div className="mt-6 border-t border-[#E8DCC8] pt-6">
      <p className="text-sm font-semibold text-[#1C1008] mb-3">Customise your toppings</p>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2 min-w-min">
          {TOPPINGS.map((topping) => {
            const isSelected = selectedToppings.includes(topping)
            return (
              <motion.button
                key={topping}
                onClick={() => handleToppingClick(topping)}
                className="px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
                style={{
                  backgroundColor: isSelected ? '#E87A30' : 'white',
                  color: isSelected ? 'white' : '#1C1008',
                  border: isSelected ? 'none' : '2px solid #E87A30',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {topping}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Selected toppings pills */}
      {selectedToppings.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedToppings.map((topping) => (
            <motion.div
              key={topping}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-[#FBF7F2] border border-[#E87A30] text-[#1C1008] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2"
            >
              {topping}
              <button
                onClick={() => onToppingSelect(topping)}
                className="text-[#E87A30] font-bold hover:text-[#D6671D]"
              >
                ×
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Flying toppings animation */}
      <div className="relative pointer-events-none">
        <AnimatePresence>
          {flyingToppings.map((flying) => (
            <motion.div
              key={flying.id}
              initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
              animate={{
                y: -180,
                x: Math.random() * 40 - 20,
                opacity: 0,
                scale: 0.5,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.8, 0.4, 1] }}
              className="absolute text-3xl"
              style={{ left: '50%', bottom: 0 }}
            >
              {flying.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
