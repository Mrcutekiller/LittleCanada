'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { MenuItem, CategoryKey } from '@/lib/menu-data'
import { MENU, CATEGORIES } from '@/lib/menu-data'
import { CategoryTabs } from './CategoryTabs'
import { FoodCarousel } from './FoodCarousel'
import { MenuGrid } from './MenuGrid'
import { ItemDetail } from './ItemDetail'

export function MenuHome() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('burgers')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const currentItems = MENU[activeCategory]

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#FBF7F2] min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-[#FBF7F2] z-40 px-4 py-4 border-b border-[#E8DCC8]">
        <h1 className="text-2xl font-bold text-[#1C1008] flex items-center gap-2">
          <span>🍁</span>
          <span>Little Canada</span>
        </h1>
      </header>

      {/* Category tabs */}
      <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      {/* Featured carousel */}
      <FoodCarousel items={currentItems} onItemSelect={setSelectedItem} />

      {/* Menu grid */}
      <MenuGrid items={currentItems} onItemSelect={setSelectedItem} />

      {/* Footer info */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#FBF7F2] border-t border-[#E8DCC8] px-4 py-3 max-w-2xl mx-auto">
        <div className="text-xs text-[#8A7968] mb-3 text-center">
          <p>⚠️ Allergies? Please inform our staff before ordering.</p>
        </div>
        <div className="flex gap-2 justify-center">
          <a
            href="tel:+251988984865"
            className="px-4 py-2 border-2 border-[#E87A30] text-[#E87A30] rounded-full text-sm font-medium hover:bg-[#FBF7F2] transition-colors"
          >
            📞 Call
          </a>
          <a
            href="https://wa.me/251988984865"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#E87A30] text-white rounded-full text-sm font-medium hover:bg-[#D6671D] transition-colors"
          >
            💬 WhatsApp
          </a>
        </div>
      </footer>

      {/* Item detail modal */}
      <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}
