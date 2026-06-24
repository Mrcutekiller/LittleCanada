'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { menuItems } from '@/lib/menu-data'

interface CarouselHeroProps {
  onSelectItem: (itemId: string) => void
}

export function CarouselHero({ onSelectItem }: CarouselHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentItem = menuItems[currentIndex]
  const rotationY = (dragX / 100) * 45

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % menuItems.length)
    setDragX(0)
  }

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length)
    setDragX(0)
  }

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 50
    if (info.offset.x > swipeThreshold) {
      prevItem()
    } else if (info.offset.x < -swipeThreshold) {
      nextItem()
    }
    setDragX(0)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#FBF7F2] to-[#F5EFE7] flex items-center justify-center overflow-hidden pt-20 pb-24">
      {/* Floating Decorations */}
      <motion.div
        className="absolute top-20 left-10 text-5xl opacity-40 deco-1"
        initial={{ y: 0, rotate: 0 }}
      >
        🍅
      </motion.div>
      <motion.div
        className="absolute top-32 right-12 text-6xl opacity-40 deco-2"
        initial={{ y: 0, rotate: 0 }}
      >
        🌿
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-8 text-5xl opacity-30 deco-3"
        initial={{ y: 0, rotate: 0 }}
      >
        🍕
      </motion.div>

      {/* Main Carousel Container */}
      <div className="flex flex-col items-center gap-8 w-full px-4 max-w-2xl">
        {/* Item Name */}
        <motion.h1
          key={`name-${currentIndex}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="text-4xl md:text-5xl font-bold text-[#1C1008] text-center"
        >
          {currentItem.name}
        </motion.h1>

        {/* Carousel Area */}
        <motion.div
          ref={containerRef}
          drag="x"
          dragElastic={0.2}
          onDrag={(_: any, info: any) => {
            setDragX(info.offset.x)
          }}
          onDragEnd={handleDragEnd}
          className="relative w-full h-72 md:h-96 flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {/* Pizza Plate with 3D Rotation */}
          <motion.div
            key={`plate-${currentIndex}`}
            initial={{ rotateY: -45, opacity: 0 }}
            animate={{ rotateY: rotationY, opacity: 1 }}
            exit={{ rotateY: 45, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-64 h-64 md:w-80 md:h-80"
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Circular Plate Background */}
            <div className="absolute inset-0 rounded-full bg-white shadow-2xl border-8 border-[#E87A30] flex items-center justify-center overflow-hidden">
              {/* Item Image/Emoji */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-8xl md:text-9xl"
              >
                {currentItem.emoji}
              </motion.div>
            </div>

            {/* Price Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#E87A30] text-white px-6 py-2 rounded-full font-bold text-lg md:text-xl whitespace-nowrap shadow-lg"
            >
              {currentItem.basePrice} ETB
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Navigation Arrows */}
        <div className="flex gap-8 items-center mt-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevItem}
            className="p-3 rounded-full bg-[#E87A30] text-white hover:bg-[#d66a20] transition-colors shadow-lg"
          >
            <ChevronLeft size={28} />
          </motion.button>

          {/* Indicator Dots */}
          <div className="flex gap-2">
            {menuItems.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx)
                  setDragX(0)
                }}
                className={`rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-[#E87A30] w-3 h-3'
                    : 'bg-[#D4C4B0] w-2 h-2 hover:bg-[#E87A30]'
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextItem}
            className="p-3 rounded-full bg-[#E87A30] text-white hover:bg-[#d66a20] transition-colors shadow-lg"
          >
            <ChevronRight size={28} />
          </motion.button>
        </div>

        {/* Select Item Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectItem(currentItem.id)}
          className="mt-8 px-8 py-3 bg-[#E87A30] text-white rounded-full font-bold text-lg hover:bg-[#d66a20] transition-colors shadow-lg"
        >
          View Details & Customize
        </motion.button>
      </div>
    </div>
  )
}
