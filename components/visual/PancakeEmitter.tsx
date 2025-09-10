'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  delay: number
}

interface PancakeEmitterProps {
  children: React.ReactNode
  onEmit?: () => void
  className?: string
  emoji?: string
  durationMs?: number
}

export default function PancakeEmitter({
  children,
  onEmit,
  className = '',
  emoji = '🥞',
  durationMs = 1600,
}: PancakeEmitterProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  const emitAt = (coords: { clientX: number; clientY: number; currentTarget: HTMLDivElement }) => {
    const rect = coords.currentTarget.getBoundingClientRect()
    const x = coords.clientX - rect.left
    const y = coords.clientY - rect.top

    const id = Date.now() + Math.floor(Math.random() * 1000)
    const newParticle: Particle = {
      id,
      x,
      y,
      delay: Math.random() * 0.15,
    }

    setParticles((prev) => [...prev, newParticle])
    onEmit?.()

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id))
    }, durationMs)
  }

  return (
    <div
      className={`relative ${className}`}
      onPointerDown={(e) => emitAt({ clientX: e.clientX, clientY: e.clientY, currentTarget: e.currentTarget as HTMLDivElement })}
      onClick={(e) => emitAt({ clientX: e.clientX, clientY: e.clientY, currentTarget: e.currentTarget as HTMLDivElement })}
    >
      {children}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-2xl pointer-events-none select-none"
          style={{ left: p.x, top: p.y }}
          initial={{ opacity: 1, scale: 0.7, y: 0 }}
          animate={{ opacity: 0, scale: 1.15, y: -80 }}
          transition={{ duration: durationMs / 1000, delay: p.delay, ease: 'easeOut' }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  )
}


