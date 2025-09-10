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
    // Compact formatting up to nonillion
    const tiers = [
      { v: 1e30, s: 'Nn' }, // nonillion (10^30)
      { v: 1e27, s: 'Oc' }, // octillion
      { v: 1e24, s: 'Sp' }, // septillion
      { v: 1e21, s: 'Sx' }, // sextillion
      { v: 1e18, s: 'Qi' }, // quintillion
      { v: 1e15, s: 'Qa' }, // quadrillion
      { v: 1e12, s: 'T' },  // trillion
      { v: 1e9,  s: 'B' },  // billion
      { v: 1e6,  s: 'M' },  // million
      { v: 1e3,  s: 'K' },  // thousand
    ]
    const abs = Math.abs(num)
    for (const t of tiers) {
      if (abs >= t.v) {
        const val = (num / t.v)
        const formatted = val >= 100 ? val.toFixed(0) : val >= 10 ? val.toFixed(1) : val.toFixed(2)
        return formatted.replace(/\.0+$/, '') + t.s
      }
    }
    return num.toLocaleString()
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
