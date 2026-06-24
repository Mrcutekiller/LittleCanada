'use client'

import { motion } from 'framer-motion'

interface FoodPlateProps {
  emoji: string
  itemId: string
  size?: 'small' | 'large'
  onClick?: () => void
}

export function FoodPlate({ emoji, itemId, size = 'small', onClick }: FoodPlateProps) {
  const sizeMap = {
    small: { diameter: 130, fontSize: 64 },
    large: { diameter: 260, fontSize: 120 },
  }

  const config = sizeMap[size]

  return (
    <motion.div
      layoutId={`food-${itemId}`}
      onClick={onClick}
      className="flex items-center justify-center rounded-full"
      style={{
        width: config.diameter,
        height: config.diameter,
        border: `4px solid #8B5E3C`,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <motion.div
        className="flex items-center justify-center"
        style={{
          fontSize: config.fontSize,
          lineHeight: 1,
        }}
      >
        {emoji}
      </motion.div>
    </motion.div>
  )
}
