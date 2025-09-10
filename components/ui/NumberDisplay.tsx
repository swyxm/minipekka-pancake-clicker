'use client'

import { motion } from 'framer-motion'

interface NumberDisplayProps {
  value: number
  label?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning'
  className?: string
  animated?: boolean
}

export default function NumberDisplay({
  value,
  label,
  size = 'md',
  color = 'primary',
  className = '',
  animated = true
}: NumberDisplayProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B'
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }

  const colorClasses = {
    primary: 'text-pekka-blue',
    secondary: 'text-pekka-text-secondary',
    accent: 'text-pekka-accent',
    success: 'text-pekka-success',
    warning: 'text-pekka-warning'
  }

  const Component = animated ? motion.div : 'div'
  const motionProps = animated ? {
    initial: { scale: 1.1, opacity: 0.8 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.2 }
  } : {}

  return (
    <div className={`text-center ${className}`}>
      <Component
        key={value}
        className={`orbitron-font font-bold ${sizeClasses[size]} ${colorClasses[color]} number-counter`}
        {...motionProps}
      >
        {formatNumber(value)}
      </Component>
      {label && (
        <div className="clash-font text-pekka-text-secondary text-sm mt-1">
          {label}
        </div>
      )}
    </div>
  )
}
