'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
}

const TiltCard = ({ children, className = "" }: TiltCardProps) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        rotateX: 5,
        rotateY: 5,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
      style={{
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default TiltCard
