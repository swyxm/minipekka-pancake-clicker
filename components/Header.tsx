'use client'

import { useApiGameStore } from '@/store/apiGameStore'
import { RotateCcw, Settings } from 'lucide-react'
import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import NumberDisplay from '@/components/ui/NumberDisplay'

export default function Header() {
  const { pancakes, totalPancakes, resetGame } = useApiGameStore()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleReset = () => {
    resetGame()
    setShowResetConfirm(false)
  }

  return (
    <header className="game-card p-6">
      <div className="flex items-center justify-between">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold clash-font-bold text-pekka-blue mb-2 text-glow">
            Mini Pekka Pancake Clicker
          </h1>
          <p className="text-pekka-cyan text-lg clash-font">
            🤖 Click to make pancakes! 🤖
          </p>
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
          
          <Button
            onClick={() => setShowResetConfirm(true)}
            variant="danger"
            size="sm"
            className="p-3"
            title="Reset Game"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-pekka-darker/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="max-w-md mx-4">
            <h3 className="text-2xl font-bold clash-font-bold text-pekka-error mb-4 text-center">
              Reset Game?
            </h3>
            <p className="text-pekka-text-secondary clash-font mb-6 text-center">
              This will reset all your progress, pancakes, and upgrades. Are you sure?
            </p>
            <div className="flex space-x-4">
              <Button
                onClick={handleReset}
                variant="danger"
                className="flex-1"
              >
                Yes, Reset
              </Button>
              <Button
                onClick={() => setShowResetConfirm(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </header>
  )
}
