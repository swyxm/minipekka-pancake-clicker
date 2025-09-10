'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  progress: number // 0-100
  height?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'accent'
  showPercentage?: boolean
  className?: string
}

export default function ProgressBar({
  progress,
  height = 'md',
  color = 'primary',
  showPercentage = false,
  className = ''
}: ProgressBarProps) {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const colorClasses = {
    primary: 'bg-pekka-blue',
    success: 'bg-pekka-success',
    warning: 'bg-pekka-warning',
    accent: 'bg-pekka-accent'
  }

  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-pekka-dark rounded-full overflow-hidden ${heightClasses[height]}`}>
        <motion.div
          className={`h-full rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {showPercentage && (
        <div className="pekka-font-mono text-pekka-text-secondary text-xs mt-1 text-right">
          {clampedProgress.toFixed(1)}%
        </div>
      )}
    </div>
  )
}
