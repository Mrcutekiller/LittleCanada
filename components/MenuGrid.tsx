'use client'

import { motion } from 'framer-motion'
import type { MenuItem } from '@/lib/menu-data'
import { FoodPlate } from './FoodPlate'

interface MenuGridProps {
  items: MenuItem[]
  onItemSelect: (item: MenuItem) => void
}

export function MenuGrid({ items, onItemSelect }: MenuGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  }

  return (
    <motion.div
      key={`grid-${items[0]?.id}`}
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 px-4 pb-24"
    >
      {items.map((menuItem) => (
        <motion.button
          key={menuItem.id}
          variants={item}
          onClick={() => onItemSelect(menuItem)}
          className="bg-white rounded-2xl p-4 text-center hover:shadow-lg transition-all relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {menuItem.popular && (
            <div className="absolute top-2 left-2 bg-[#E87A30] text-white text-xs font-bold px-2 py-1 rounded-full">
              🔥
            </div>
          )}

          <div className="flex justify-center mb-3 relative h-20">
            <FoodPlate emoji={menuItem.emoji} itemId={menuItem.id} size="small" />
          </div>

          <h3 className="font-bold text-[#1C1008] text-sm mb-1 line-clamp-2">{menuItem.name}</h3>
          <p className="text-[#8A7968] text-xs mb-2 line-clamp-2">{menuItem.desc}</p>

          <div className="absolute bottom-3 right-3 bg-[#E87A30] text-white rounded-full px-3 py-1 text-xs font-bold">
            {menuItem.price} ETB
          </div>
        </motion.button>
      ))}
    </motion.div>
  )
}
