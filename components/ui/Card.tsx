'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  onClick?: () => void
}

export default function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  onClick
}: CardProps) {
  const baseClasses = 'game-card rounded-xl p-6'
  const hoverClasses = hover ? 'game-card-hover cursor-pointer' : ''
  const glowClasses = glow ? 'game-glow' : ''
  
  const Component = onClick ? motion.div : 'div'
  const motionProps = onClick ? {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.1 }
  } : {}
  
  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${glowClasses} ${className}`}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  )
}
