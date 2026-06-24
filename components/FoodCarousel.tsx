'use client'

import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { MenuItem } from '@/lib/menu-data'
import { FoodPlate } from './FoodPlate'

interface FoodCarouselProps {
  items: MenuItem[]
  onItemSelect: (item: MenuItem) => void
}

export function FoodCarousel({ items, onItemSelect }: FoodCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const x = useMotionValue(0)
  const rotateY = useTransform(x, [-200, 0, 200], [40, 0, -40])

  if (items.length === 0) {
    return null
  }

  const displayItems = items.slice(0, 4)

  return (
    <div className="w-full px-4 py-6">
      <div className="relative">
        <motion.div
          drag="x"
          dragConstraints={{ left: -320 * (displayItems.length - 1), right: 0 }}
          onDragEnd={(e, info) => {
            const distance = info.offset.x
            if (distance < -50 && currentIndex < displayItems.length - 1) {
              setCurrentIndex(currentIndex + 1)
            } else if (distance > 50 && currentIndex > 0) {
              setCurrentIndex(currentIndex - 1)
            }
          }}
          animate={{ x: -currentIndex * 320 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ x, rotateY }}
          className="flex gap-4 cursor-grab active:cursor-grabbing"
        >
          {displayItems.map((item, idx) => (
            <motion.div
              key={item.id}
              className="flex-shrink-0 w-80 h-48 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow relative overflow-hidden"
              onClick={() => onItemSelect(item)}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.07, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative z-10 flex flex-col items-center justify-center flex-1">
                <FoodPlate emoji={item.emoji} itemId={item.id} size="small" onClick={() => onItemSelect(item)} />
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-bold text-[#1C1008]">{item.name}</h3>
                <p className="text-[#E87A30] font-bold">{item.price} ETB</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2 mt-4">
        {displayItems.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="w-2 h-2 rounded-full transition-colors"
            animate={{
              backgroundColor: currentIndex === idx ? '#E87A30' : '#D4C4B8',
              scale: currentIndex === idx ? 1.2 : 1,
            }}
          />
        ))}
      </div>
    </div>
  )
}
