'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApiGameStore } from '@/store/apiGameStore'
import Button from '@/components/ui/Button'
import NumberDisplay from '@/components/ui/NumberDisplay'
import Card from '@/components/ui/Card'

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

  const handleClick = () => {
    click()
    setIsClicking(true)
    
    // Add floating pancake
    const newPancake: FloatingPancake = {
      id: Date.now(),
      x: Math.random() * 200 + 50,
      y: Math.random() * 100 + 50,
      delay: Math.random() * 0.5
    }
    
    setFloatingPancakes(prev => [...prev, newPancake])
    
    // Remove floating pancake after animation
    setTimeout(() => {
      setFloatingPancakes(prev => prev.filter(p => p.id !== newPancake.id))
    }, 2000)
    
    // Reset clicking state
    setTimeout(() => setIsClicking(false), 150)
  }

  return (
    <Card className="text-center" glow>
      <h2 className="pekka-font-futuristic text-3xl font-bold text-pekka-blue mb-6 pekka-text-glow">
        Click Mini Pekka!
      </h2>
      
      <div className="relative inline-block mb-8">
        <motion.div
          className={`relative p-8 rounded-full transition-all duration-150 ${
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
          <div className="pekka-font-futuristic text-2xl text-pekka-blue font-bold">
            Mini Pekka
          </div>
          <div className="pekka-font text-sm text-pekka-text-secondary mt-1">
            +{clickPower.toLocaleString()} per click
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-pekka-blue/20 animate-pulse-soft"></div>
        </motion.div>
        
        {/* Floating pancakes */}
        {floatingPancakes.map((pancake) => (
          <motion.div
            key={pancake.id}
            className="absolute text-2xl pointer-events-none"
            initial={{ 
              x: pancake.x, 
              y: pancake.y, 
              opacity: 1, 
              scale: 0.5 
            }}
            animate={{ 
              y: pancake.y - 100, 
              opacity: 0, 
              scale: 1.2 
            }}
            transition={{ 
              duration: 2, 
              delay: pancake.delay,
              ease: "easeOut" 
            }}
          >
            🥞
          </motion.div>
        ))}
      </div>
      
      <Button
        onClick={handleClick}
        size="lg"
        className="w-full pekka-glow"
        disabled={isClicking}
      >
        {isClicking ? 'CLICKING...' : 'CLICK MINI PEKKA'}
      </Button>
      
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
