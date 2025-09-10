'use client'

import { useApiGameStore } from '@/store/apiGameStore'
import { Clock, MousePointer, Trophy, Target } from 'lucide-react'
import Card from '@/components/ui/Card'
import NumberDisplay from '@/components/ui/NumberDisplay'

export default function StatsPanel() {
  const { totalClicks, totalPancakes, playTime, unlockedAchievements } = useApiGameStore()

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const clicksPerSecond = playTime > 0 ? totalClicks / playTime : 0
  const pancakesPerClick = totalClicks > 0 ? totalPancakes / totalClicks : 0

  return (
    <Card>
      <h3 className="text-2xl font-bold clash-font-bold text-pekka-blue mb-6 flex items-center">
        <Trophy className="w-6 h-6 mr-2" />
        Game Stats
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 game-card rounded-xl">
          <div className="flex items-center">
            <MousePointer className="w-5 h-5 text-pekka-blue mr-3" />
            <span className="clash-font text-pekka-text-secondary">Total Clicks</span>
          </div>
          <NumberDisplay
            value={totalClicks}
            size="md"
            color="primary"
          />
        </div>
        
        <div className="flex items-center justify-between p-4 game-card rounded-xl">
          <div className="flex items-center">
            <Target className="w-5 h-5 text-pekka-accent mr-3" />
            <span className="clash-font text-pekka-text-secondary">Total Pancakes</span>
          </div>
          <NumberDisplay
            value={totalPancakes}
            size="md"
            color="accent"
          />
        </div>
        
        <div className="flex items-center justify-between p-4 game-card rounded-xl">
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-pekka-success mr-3" />
            <span className="clash-font text-pekka-text-secondary">Play Time</span>
          </div>
          <span className="orbitron-font font-bold text-pekka-success text-lg">
            {formatTime(playTime)}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 game-card rounded-xl">
          <div className="flex items-center">
            <Trophy className="w-5 h-5 text-pekka-warning mr-3" />
            <span className="clash-font text-pekka-text-secondary">Achievements</span>
          </div>
          <NumberDisplay
            value={unlockedAchievements.length}
            size="md"
            color="warning"
          />
        </div>
        
        {totalClicks > 0 && (
          <>
            <div className="flex items-center justify-between p-4 game-card rounded-xl">
              <div className="flex items-center">
                <MousePointer className="w-5 h-5 text-pekka-error mr-3" />
                <span className="clash-font text-pekka-text-secondary">Clicks/Second</span>
              </div>
              <span className="orbitron-font font-bold text-pekka-error text-lg">
                {clicksPerSecond.toFixed(1)}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-4 game-card rounded-xl">
              <div className="flex items-center">
                <Target className="w-5 h-5 text-pekka-cyan mr-3" />
                <span className="clash-font text-pekka-text-secondary">Pancakes/Click</span>
              </div>
              <span className="orbitron-font font-bold text-pekka-cyan text-lg">
                {pancakesPerClick.toFixed(1)}
              </span>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
