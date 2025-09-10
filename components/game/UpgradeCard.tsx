'use client'

import { motion } from 'framer-motion'
import { useApiGameStore } from '@/store/apiGameStore'
import { Upgrade } from '@/store/apiGameStore'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import NumberDisplay from '@/components/ui/NumberDisplay'
import ProgressBar from '@/components/ui/ProgressBar'
import { Zap, Star } from 'lucide-react'

interface UpgradeCardProps {
  upgrade: Upgrade
}

export default function UpgradeCard({ upgrade }: UpgradeCardProps) {
  const { pancakes, buyUpgrade, quantityMode } = useApiGameStore()

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'rarity-common'
      case 'rare': return 'rarity-rare'
      case 'epic': return 'rarity-epic'
      case 'legendary': return 'rarity-legendary'
      case 'champion': return 'rarity-champion'
      default: return 'rarity-common'
    }
  }

  const canAfford = pancakes >= upgrade.cost
  const isMaxLevel = upgrade.level >= upgrade.maxLevel
  const isLocked = !upgrade.unlocked

  const handleBuy = () => {
    if (canAfford && !isMaxLevel && !isLocked) {
      const qty = quantityMode === 'max' ? 'max' : quantityMode === 'x10' ? 10 : quantityMode === 'x100' ? 100 : 1
      buyUpgrade(upgrade.id, qty)
    }
  }

  const progressPercentage = (upgrade.level / upgrade.maxLevel) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`p-4 transition-all duration-200 ${
          getRarityColor(upgrade.rarity)
        } ${
          !isLocked && canAfford && !isMaxLevel
            ? 'pekka-card-hover cursor-pointer pekka-glow'
            : 'cursor-not-allowed opacity-50'
        }`}
        onClick={handleBuy}
        hover={!isLocked && canAfford && !isMaxLevel}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{upgrade.icon}</span>
            <div>
              <h4 className="clash-font-bold text-lg font-bold text-pekka-text">
                {upgrade.name}
              </h4>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < upgrade.level ? 'text-pekka-warning fill-current' : 'text-pekka-text-secondary'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm clash-font text-pekka-text-secondary">
                  Level {upgrade.level}/{upgrade.maxLevel}
                </span>
              </div>
            </div>
          </div>
          
          <NumberDisplay
            value={upgrade.cost}
            label="cost"
            size="md"
            color="primary"
          />
        </div>
        
        <p className="clash-font text-pekka-text-secondary text-sm mb-3">
          {upgrade.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm clash-font">
              <Zap className="w-4 h-4 mr-1 text-pekka-success" />
              <span className="text-pekka-success">
                +{upgrade.pancakesPerSecond.toLocaleString()}/sec
              </span>
            </div>
            
            {isMaxLevel && (
              <div className="text-pekka-warning clash-font-bold text-sm font-bold">
                MAX LEVEL!
              </div>
            )}
            
            {isLocked && (
              <div className="text-pekka-text-secondary clash-font text-sm">
                Locked
              </div>
            )}
          </div>
          
          <ProgressBar
            progress={progressPercentage}
            height="sm"
            color="primary"
            showPercentage={false}
          />
        </div>
      </Card>
    </motion.div>
  )
}
