'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApiGameStore } from '@/store/apiGameStore'
import Button from '@/components/ui/Button'
import NumberDisplay from '@/components/ui/NumberDisplay'
import Card from '@/components/ui/Card'
import PancakeEmitter from '@/components/visual/PancakeEmitter'

interface FloatingPancake {
  id: number
  x: number
  y: number
  delay: number
}

export default function Clicker() {
  const { click, pancakes, clickPower, pancakesPerSecond } = useApiGameStore()
  const [floatingPancakes, setFloatingPancakes] = useState<FloatingPancake[]>([])
  const [isClicking, setIsClicking] = useState(false)

  const onEmit = () => {
    click()
    setIsClicking(true)
    setTimeout(() => setIsClicking(false), 150)
  }

  return (
    <Card className="text-center" glow>
      <h2 className="clash-font-bold text-3xl font-bold text-pekka-blue mb-6 text-glow">
        Click Mini Pekka!
      </h2>
      
      <div className="relative inline-block mb-8">
        <PancakeEmitter onEmit={onEmit} className="relative inline-block">
        <motion.div
          className={`relative p-8 rounded-full transition-all duration-150 cursor-pointer ${
            isClicking 
              ? 'scale-95 bg-pekka-navy/30 mechanical-click' 
              : 'hover:scale-105 bg-pekka-navy/20 hover:bg-pekka-navy/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-8xl mb-2 pancake-float">
            🤖
          </div>
          <div className="clash-font-bold text-2xl text-pekka-blue font-bold">
            Mini Pekka
          </div>
          <div className="clash-font text-sm text-pekka-text-secondary mt-1">
            +{clickPower.toLocaleString()} per click
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-pekka-blue/20 animate-pulse-soft"></div>
        </motion.div>
        </PancakeEmitter>
        
        {/* Pancake particles now handled by PancakeEmitter */}
      </div>
      
      <PancakeEmitter onEmit={onEmit} className="block mt-4">
      <Button
        onClick={() => { /* onEmit will be invoked by PancakeEmitter wrapper */ }}
        size="lg"
        className="w-full game-glow"
      >
        CLICK MINI PEKKA
      </Button>
      </PancakeEmitter>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <NumberDisplay
          value={pancakes}
          label="Current Pancakes"
          size="lg"
          color="primary"
        />
        
        <NumberDisplay
          value={clickPower}
          label="Click Power"
          size="lg"
          color="accent"
        />
        
        <NumberDisplay
          value={pancakesPerSecond}
          label="Per Second"
          size="lg"
          color="success"
        />
      </div>
    </Card>
  )
}
