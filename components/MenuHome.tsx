'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CarouselHero } from './CarouselHero'
import { ItemDetailHero } from './ItemDetailHero'
import { menuItems } from '@/lib/menu-data'

export function MenuHome() {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const selectedItem = menuItems.find((item) => item.id === selectedItemId)

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {selectedItem ? (
          <div key="detail">
            <ItemDetailHero
              item={selectedItem}
              onBack={() => setSelectedItemId(null)}
            />
          </div>
        ) : (
          <div key="carousel">
            <CarouselHero onSelectItem={setSelectedItemId} />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
