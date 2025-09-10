'use client'

import { useApiGameStore } from '@/store/apiGameStore'
import Card from '@/components/ui/Card'
import NumberDisplay from '@/components/ui/NumberDisplay'

export default function Header() {
  const { pancakes, totalPancakes } = useApiGameStore()

  return (
    <header className="game-card p-6">
      <div className="flex items-center justify-between">
        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-bold clash-font-bold text-pekka-blue mb-2 text-glow">
            Mini Pekka's
          </h2>
          <h1 className="text-4xl md:text-6xl font-bold clash-font-bold pekka-text-secondary mb-2 text-glow">
            Pancake Clicker
          </h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <NumberDisplay
            value={pancakes}
            label="Pancakes"
            size="lg"
            color="primary"
          />
          
          <NumberDisplay
            value={totalPancakes}
            label="Total"
            size="lg"
            color="accent"
          />
        </div>
      </div>
    </header>
  )
}
