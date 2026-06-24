'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import type { MenuItem } from '@/lib/menu-data'
import { FoodPlate } from './FoodPlate'
import { FloatingDecorations } from './FloatingDecorations'
import { ToppingSelector } from './ToppingSelector'

interface ItemDetailProps {
  item: MenuItem | null
  onClose: () => void
}

const CUSTOMIZABLE_ITEMS = ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'p1', 'p2', 'p3', 'p4', 'p5', 'p6']

export function ItemDetail({ item, onClose }: ItemDetailProps) {
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false)
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (item) {
      setSelectedToppings([])
    }
  }, [item])

  const handleToppingToggle = (topping: string) => {
    setSelectedToppings((prev) => (prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]))
  }

  const handleWhatsApp = () => {
    const message = `Hi! I'd like to order: ${item?.name} - ${item?.price} ETB${selectedToppings.length > 0 ? ` with ${selectedToppings.join(', ')}` : ''}`
    window.open(`https://wa.me/251988984865?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleCall = () => {
    window.location.href = 'tel:+251988984865'
  }

  const getDecoType = (id: string): 'burger' | 'pizza' | 'breakfast' | 'dessert' => {
    if (id.startsWith('b')) return 'burger'
    if (id.startsWith('p')) return 'pizza'
    if (id.startsWith('br')) return 'breakfast'
    return 'dessert'
  }

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 280, damping: 32 }}
          className="fixed inset-0 bg-white z-50 overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white z-40 px-4 py-4 border-b border-[#E8DCC8] flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FBF7F2] rounded-lg transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center flex-1">
              <h2 className="font-bold text-[#1C1008]">{item.name}</h2>
            </div>
            <div className="w-10" />
          </div>

          {/* Top 45% - Food display zone */}
          <div className="relative pt-8 pb-6 flex flex-col items-center min-h-[45vh]">
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Floating decorations */}
              <FloatingDecorations type={getDecoType(item.id)} />

              {/* Packaging box background */}
              <motion.div
                ref={boxRef}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="absolute w-64 h-72 bg-amber-100 rounded-lg border-4 border-amber-800 opacity-20 z-0"
              >
                <div className="absolute top-0 left-0 right-0 h-2 border-b-2 border-amber-800" />
              </motion.div>

              {/* Main plate circle with hero transition */}
              <FoodPlate emoji={item.emoji} itemId={item.id} size="large" />
            </div>
          </div>

          {/* Bottom 55% - Info zone */}
          <div className="px-6 pb-32">
            {/* Category pill */}
            <div className="inline-block mb-3">
              <span className="text-xs font-semibold text-[#E87A30] bg-[#FBF7F2] px-3 py-1 rounded-full">
                {item.id.startsWith('b') && '🍔 Burger'}
                {item.id.startsWith('p') && '🍕 Pizza'}
                {item.id.startsWith('br') && '🍳 Breakfast'}
                {item.id.startsWith('d') && '🍫 Dessert'}
              </span>
            </div>

            {/* Item name (already in header but repeating for layout) */}
            <h1 className="text-2xl font-bold text-[#1C1008] mb-2">{item.name}</h1>

            {/* Description */}
            <p className="text-[#8A7968] text-sm mb-6">{item.desc}</p>

            {/* Ingredients accordion */}
            <div className="border-b border-[#E8DCC8]">
              <button
                onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
                className="w-full py-4 flex items-center justify-between text-[#1C1008] font-semibold hover:text-[#E87A30] transition-colors"
              >
                <span>Ingredients</span>
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: isIngredientsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </motion.svg>
              </button>

              <AnimatePresence>
                {isIngredientsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="py-3 px-0 space-y-1">
                      {item.ingredients.map((ing, idx) => (
                        <p key={idx} className="text-sm text-[#8A7968]">
                          • {ing}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Price */}
            <div className="mt-6 mb-6">
              <p className="text-4xl font-bold text-[#E87A30]">{item.price} ETB</p>
            </div>

            {/* Topping selector */}
            <ToppingSelector
              isForCustomizable={CUSTOMIZABLE_ITEMS.includes(item.id)}
              selectedToppings={selectedToppings}
              onToppingSelect={handleToppingToggle}
            />

            {/* Pulse box animation on topping select */}
            {selectedToppings.length > 0 && boxRef.current && (
              <style>{`
                @keyframes box-pulse {
                  0%, 100% { transform: scale(1); }
                  50% { transform: scale(1.04); }
                }
                div[ref] { animation: box-pulse 0.3s ease-in-out; }
              `}</style>
            )}
          </div>

          {/* Fixed CTA buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8DCC8] p-4 flex gap-3 max-w-2xl mx-auto">
            <button
              onClick={handleCall}
              className="flex-1 border-2 border-[#E87A30] text-[#E87A30] font-semibold py-3 rounded-lg hover:bg-[#FBF7F2] transition-colors"
            >
              📞 Call to Order
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex-1 bg-[#E87A30] text-white font-semibold py-3 rounded-lg hover:bg-[#D6671D] transition-colors"
            >
              💬 WhatsApp
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
