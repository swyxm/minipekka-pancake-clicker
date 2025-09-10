'use client'

import { motion } from 'framer-motion'
import { Achievement } from '@/store/apiGameStore'
import Card from '@/components/ui/Card'
import NumberDisplay from '@/components/ui/NumberDisplay'
import ProgressBar from '@/components/ui/ProgressBar'
import { Trophy, Gift, Star } from 'lucide-react'

interface AchievementCardProps {
  achievement: Achievement
  totalPancakes: number
}

export default function AchievementCard({ achievement, totalPancakes }: AchievementCardProps) {
  const isUnlocked = achievement.unlocked
  const progress = Math.min((totalPancakes / achievement.condition) * 100, 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`p-4 transition-all duration-200 overflow-hidden ${
          isUnlocked
            ? 'pekka-glow border-pekka-warning'
            : 'border-pekka-border'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center min-w-0">
            <span className="text-3xl mr-3 flex-shrink-0">
              {isUnlocked ? '🏆' : achievement.icon}
            </span>
            <div className="min-w-0">
              <h4 className={`clash-font-bold text-lg font-bold truncate ${
                isUnlocked ? 'text-pekka-warning' : 'text-pekka-text'
              }`}>
                {achievement.name}
              </h4>
              <p className="clash-font text-sm text-pekka-text-secondary line-clamp-2 break-words">
                {achievement.description}
              </p>
            </div>
          </div>
          
          {isUnlocked && (
            <div className="flex items-center text-pekka-warning">
              <Gift className="w-5 h-5 mr-1" />
              <NumberDisplay
                value={achievement.reward}
                size="sm"
                color="warning"
              />
            </div>
          )}
        </div>
        
        {!isUnlocked && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm clash-font">
              <span className="text-pekka-text-secondary">Progress</span>
              <span className="text-pekka-text">
                {totalPancakes.toLocaleString()} / {achievement.condition.toLocaleString()}
              </span>
            </div>
            
            <ProgressBar
              progress={progress}
              height="sm"
              color="primary"
              showPercentage={true}
            />
          </div>
        )}
        
        {isUnlocked && (
          <div className="flex items-center justify-center text-pekka-warning clash-font-bold font-bold">
            <Star className="w-4 h-4 mr-1" />
            ACHIEVEMENT UNLOCKED!
          </div>
        )}
      </Card>
    </motion.div>
  )
}
