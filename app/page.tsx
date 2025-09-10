'use client'

import { useEffect } from 'react'
import { useApiGameStore } from '@/store/apiGameStore'
import PancakeClicker from '@/components/PancakeClicker'
import StatsPanel from '@/components/StatsPanel'
import UpgradesPanel from '@/components/UpgradesPanel'
import AchievementsPanel from '@/components/AchievementsPanel'
import Header from '@/components/Header'

export default function Home() {
  const { loadGameState, pancakesPerSecond, isLoading, error } = useApiGameStore()

  // Load game state on mount
  useEffect(() => {
    loadGameState()
  }, [loadGameState])

  // Game loop for passive pancake generation
  useEffect(() => {
    const interval = setInterval(() => {
      if (pancakesPerSecond > 0) {
        useApiGameStore.getState().click()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [pancakesPerSecond])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-pekka-navy-dark flex items-center justify-center">
        <div className="text-center">
          <div className="clash-font-bold text-2xl text-pekka-blue mb-4">
            Loading Mini Pekka...
          </div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pekka-blue mx-auto"></div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-pekka-navy-dark flex items-center justify-center">
        <div className="text-center">
          <div className="clash-font-bold text-2xl text-pekka-error mb-4">
            Error: {error}
          </div>
          <button
            onClick={() => loadGameState()}
            className="game-button px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-pekka-navy-dark">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            <PancakeClicker />
            <StatsPanel />
          </div>
          
          {/* Side Panels */}
          <div className="space-y-6">
            <UpgradesPanel />
            <AchievementsPanel />
          </div>
        </div>
      </div>
    </main>
  )
}
