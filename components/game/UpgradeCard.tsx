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

  // compute batch cost and quantity based on current selection
  const computeBatch = () => {
    const costStep = (c: number) => Math.floor(c * 1.5)
    let totalCost = 0
    let qty = 0
    let nextCost = upgrade.cost
    let remainingLevels = upgrade.maxLevel - upgrade.level
    let target = quantityMode === 'x10' ? 10 : quantityMode === 'x100' ? 100 : quantityMode === 'max' ? Number.MAX_SAFE_INTEGER : 1

    if (quantityMode === 'max') {
      // compute max affordable respecting next cost changes
      let tempPancakes = pancakes
      while (remainingLevels > 0 && tempPancakes >= nextCost) {
        totalCost += nextCost
        tempPancakes -= nextCost
        qty += 1
        remainingLevels -= 1
        nextCost = costStep(nextCost)
      }
      return { totalCost, qty }
    }

    const buyQty = Math.min(target, remainingLevels)
    for (let i = 0; i < buyQty; i++) {
      totalCost += nextCost
      nextCost = costStep(nextCost)
      qty += 1
    }
    return { totalCost, qty }
  }

  const { totalCost, qty } = computeBatch()
  const canAfford = pancakes >= totalCost && qty > 0
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
          
          <div className="text-right">
            <div className="clash-font text-pekka-text-secondary text-xs">Price ({quantityMode.toUpperCase()}{quantityMode==='max'?'':''}{qty>0 && quantityMode!=='max'?`×${qty}`:''})</div>
            <NumberDisplay
              value={totalCost}
              size="md"
              color={canAfford ? 'primary' : 'warning'}
            />
          </div>
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
