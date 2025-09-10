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

  // Load game state on mount (silent)
  useEffect(() => {
    loadGameState({ silent: true })
  }, [loadGameState])

  // Poll server state every second to pick up passive gain and other updates
  useEffect(() => {
    const interval = setInterval(() => {
      useApiGameStore.getState().loadGameState()
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // No blocking full-screen loading; the UI renders while state hydrates

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
