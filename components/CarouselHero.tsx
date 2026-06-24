'use client'

import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { menuItems } from '@/lib/menu-data'

interface CarouselHeroProps {
  onSelectItem: (itemId: string) => void
}

export function CarouselHero({ onSelectItem }: CarouselHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const item = useMemo(() => menuItems[currentIndex], [currentIndex])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? menuItems.length - 1 : prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === menuItems.length - 1 ? 0 : prev + 1))
  }, [])

  const handleDragEnd = useCallback(
    (info: any) => {
      if (info.offset.x > 50) handlePrev()
      else if (info.offset.x < -50) handleNext()
    },
    [handlePrev, handleNext]
  )

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#FBF7F2] to-[#F5EFEA] flex flex-col items-center justify-center px-4 py-6 md:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-6 md:mb-8 w-full"
      >
        <h1 className="text-2xl md:text-4xl font-bold text-[#1C1008] mb-1">
          Little Canada
        </h1>
        <p className="text-xs md:text-sm text-[#8A7968]">Fresh & Delicious Café</p>
      </motion.div>

      {/* Main Carousel Card */}
      <motion.div
        drag="x"
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="relative w-full max-w-sm md:max-w-md mb-6"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden aspect-square"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 500px"
              quality={85}
            />
            {item.popular && (
              <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-[#E87A30] text-white px-2 md:px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                Popular
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Item Info */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`info-${item.id}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-center w-full max-w-sm md:max-w-md mb-6"
        >
          <h2 className="text-xl md:text-2xl font-bold text-[#1C1008] mb-2">
            {item.name}
          </h2>
          <p className="text-xs md:text-sm text-[#8A7968] mb-3 line-clamp-2">
            {item.description}
          </p>
          <div className="text-2xl md:text-3xl font-bold text-[#E87A30]">
            {item.basePrice} ETB
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3 md:gap-4 items-center justify-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrev}
          className="p-2 md:p-3 rounded-full bg-[#E87A30] text-white hover:bg-[#D6671D] transition-colors shadow-lg"
          aria-label="Previous"
        >
          <ChevronLeft size={20} className="md:w-6 md:h-6" />
        </motion.button>

        <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
          {menuItems.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-[#E87A30] w-2.5 h-2.5 md:w-3 md:h-3'
                  : 'bg-[#D4BFB0] w-2 h-2 hover:bg-[#C4AFA0]'
              }`}
              aria-label={`Go to item ${idx + 1}`}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="p-2 md:p-3 rounded-full bg-[#E87A30] text-white hover:bg-[#D6671D] transition-colors shadow-lg"
          aria-label="Next"
        >
          <ChevronRight size={20} className="md:w-6 md:h-6" />
        </motion.button>
      </div>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectItem(item.id)}
        className="w-full max-w-sm px-6 py-3 md:py-4 bg-[#E87A30] text-white rounded-2xl font-bold text-base md:text-lg shadow-xl hover:bg-[#D6671D] transition-colors mb-8"
      >
        View Details & Customize
      </motion.button>

      {/* Footer Contact */}
      <div className="text-center text-xs md:text-sm text-[#8A7968] max-w-sm w-full px-4">
        <p className="mb-3">⚠️ Please inform us of any allergies</p>
        <div className="flex gap-2 justify-center">
          <a
            href="tel:+251988984865"
            className="flex-1 px-3 py-2 border-2 border-[#E87A30] text-[#E87A30] rounded-xl font-medium hover:bg-[#FBF7F2] transition-colors text-xs md:text-sm"
          >
            📞 Call
          </a>
          <a
            href="https://wa.me/251988984865"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-3 py-2 bg-[#E87A30] text-white rounded-xl font-medium hover:bg-[#D6671D] transition-colors text-xs md:text-sm"
          >
            💬 WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
