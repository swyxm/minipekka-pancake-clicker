'use client'

import { useApiGameStore } from '@/store/apiGameStore'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import Card from '@/components/ui/Card'
import AchievementCard from '@/components/game/AchievementCard'

export default function AchievementsPanel() {
  const { achievements, totalPancakes } = useApiGameStore()

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <h3 className="text-2xl font-bold clash-font-bold text-pekka-blue mb-4 flex items-center">
          <Trophy className="w-6 h-6 mr-2" />
          Achievements
          <span className="ml-2 text-lg text-pekka-text-secondary clash-font">
            ({unlockedCount}/{totalCount})
          </span>
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 thin-scrollbar">
        {achievements.map((achievement) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            totalPancakes={totalPancakes}
          />
        ))}
      </div>
      
      {unlockedCount === totalCount && (
        <motion.div
          className="mt-4 p-4 pekka-glow rounded-xl border border-pekka-warning text-center flex-shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Trophy className="w-8 h-8 text-pekka-warning mx-auto mb-2" />
          <div className="clash-font-bold text-pekka-warning text-lg font-bold">
            All Achievements Unlocked!
          </div>
          <div className="clash-font text-pekka-text-secondary text-sm">
            You are a true Pancake Master! 🏆
          </div>
        </motion.div>
      )}
    </Card>
  )
}
