'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
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
  const { click, pancakes, clickPower, pancakesPerSecond, totalClicks } = useApiGameStore()
  const [floatingPancakes, setFloatingPancakes] = useState<FloatingPancake[]>([])
  const [isClicking, setIsClicking] = useState(false)
  const [isClickingSession, setIsClickingSession] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const playSound = () => {
    if (audioRef.current) {
      const audio = new Audio('/pancakes.mp3')
      audio.volume = 0.7
      audio.play().catch(() => {
      })
    }
  }

  const onEmit = () => {
    click()
    setIsClicking(true)
    setTimeout(() => setIsClicking(false), 150)
    
    if (!isClickingSession) {
      setIsClickingSession(true)
      setSessionStartTime(Date.now())
      playSound()
    }
  }

  useEffect(() => {
    if (isClickingSession && sessionStartTime) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      intervalRef.current = setInterval(() => {
        playSound()
      }, 3000)
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [isClickingSession, sessionStartTime])

  useEffect(() => {
    if (isClickingSession) {
      const timeout = setTimeout(() => {
        setIsClickingSession(false)
        setSessionStartTime(null)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [isClickingSession, totalClicks])

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source src="/pancakes.mp3" type="audio/mpeg" />
      </audio>
      <div style={{ height: '514px' }}>
        <Card className="text-center overflow-visible h-full" glow>
        <h2 className="clash-font-bold text-3xl font-bold text-pekka-blue mb-6 text-glow">
          Click the Pancakes!
        </h2>
      
      <div className="relative inline-block">
        <PancakeEmitter onEmit={onEmit} className="relative inline-block">
        <motion.div
          className="relative transition-all duration-150 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute w-[270px] h-[270px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/30 animate-pulse-soft -z-10"></div>
          <div className="relative w-[256px] h-[256px] mx-auto">
            <Image
              src="/pancakes.png"
              alt="Pancakes"
              width={256}
              height={256}
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
        </PancakeEmitter>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-8">
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
      </div>
    </>
  )
}
