'use client'

import { motion } from 'framer-motion'
import { CATEGORIES, type CategoryKey } from '@/lib/menu-data'

interface CategoryTabsProps {
  activeCategory: CategoryKey
  onCategoryChange: (category: CategoryKey) => void
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-16 bg-[#FBF7F2] z-30 px-4 py-3 border-b border-[#E8DCC8]">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-full">
        <div className="relative flex gap-2 pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onCategoryChange(cat.key)}
              className="px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                color: activeCategory === cat.key ? '#1C1008' : '#8A7968',
              }}
            >
              {cat.label}
              {activeCategory === cat.key && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#E87A30] rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
