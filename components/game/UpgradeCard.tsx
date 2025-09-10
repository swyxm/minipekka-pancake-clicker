'use client'

import { motion } from 'framer-motion'
import { useApiGameStore } from '@/store/apiGameStore'
import { Upgrade } from '@/store/apiGameStore'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import NumberDisplay from '@/components/ui/NumberDisplay'
import { Zap } from 'lucide-react'
import Image from 'next/image'

interface UpgradeCardProps {
  upgrade: Upgrade
}

export default function UpgradeCard({ upgrade }: UpgradeCardProps) {
  const { pancakes, buyUpgrade, quantityMode } = useApiGameStore()

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'starter': return 'rarity-starter'
      case 'common': return 'rarity-common'
      case 'rare': return 'rarity-rare'
      case 'epic': return 'rarity-epic'
      case 'legendary': return 'rarity-legendary'
      case 'champion': return 'rarity-champion'
      default: return 'rarity-common'
    }
  }

  // compute batch cost and quantity based on current selection (matches server logic)
  const computeBatch = () => {
    const target = quantityMode === 'x10' ? 10 : quantityMode === 'x100' ? 100 : quantityMode === 'max' ? Number.MAX_SAFE_INTEGER : 1

    // Start from the current next-cost for this upgrade
    let nextCost = upgrade.cost
    let totalCost = 0
    let qty = 0

    if (quantityMode === 'max') {
      let tempPancakes = pancakes
      while (tempPancakes >= nextCost) {
        totalCost += nextCost
        tempPancakes -= nextCost
        qty += 1
        nextCost = Math.floor(nextCost * 1.15)
      }
      return { totalCost, qty }
    }

    const buyQty = target
    for (let i = 0; i < buyQty; i++) {
      totalCost += nextCost
      nextCost = Math.floor(nextCost * 1.15)
      qty += 1
    }
    return { totalCost, qty }
  }

  const { totalCost, qty } = computeBatch()
  const canAfford = pancakes >= totalCost && qty > 0

  const handleBuy = () => {
    if (canAfford) {
      const qty = quantityMode === 'max' ? 'max' : quantityMode === 'x10' ? 10 : quantityMode === 'x100' ? 100 : 1
      buyUpgrade(upgrade.id, qty)
    }
  }

  const getImageSrc = () => {
    // char
    if (upgrade.id === 'mini-pekka') return '/minipekka.png'
    if (upgrade.id === 'knight') return '/knight.png'
    if (upgrade.id === 'prince') return '/prince.png'
    if (upgrade.id === 'wizard') return '/wizard.png'
    if (upgrade.id === 'dragon') return '/bbdragon.png'
    if (upgrade.id === 'pekka') return '/pekka.png'
    
    // cp
    if (upgrade.id === 'mini-pekka-sharp-blade') return '/minisword.png'
    if (upgrade.id === 'royal-reinforcement') return '/royalreinforcement.png'
    if (upgrade.id === 'elixir-overclock') return '/elixir.png'
    if (upgrade.id === 'rage-spell') return '/rage.png'
    if (upgrade.id === 'pekka-core-upgrade') return '/pekkacore.png'
    
    return null
  }

  const imageSrc = getImageSrc()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`p-2 transition-all duration-200 overflow-hidden ${
          getRarityColor(upgrade.rarity)
        } ${canAfford ? 'game-card-hover cursor-pointer game-glow' : 'opacity-50'}`}
        onClick={handleBuy}
        hover={canAfford}
      >
        <div className="flex h-28">
          <div className={`flex-shrink-0 flex items-center justify-center h-full ${
            upgrade.clickPowerBonus && upgrade.clickPowerBonus > 0 
              ? 'w-16' 
              : 'w-24'
          }`}>
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={upgrade.name}
                width={upgrade.id === 'pekka' ? 120 : upgrade.id === 'pekka-core-upgrade' ? 120 : upgrade.clickPowerBonus && upgrade.clickPowerBonus > 0 ? 64 : 96}
                height={upgrade.id === 'pekka' ? 120 : upgrade.id === 'pekka-core-upgrade' ? 120 : upgrade.clickPowerBonus && upgrade.clickPowerBonus > 0 ? 64 : 96}
                className={`object-contain w-full h-full ${
                  upgrade.id === 'pekka' ? '-ml-4 scale-150' : 
                  upgrade.id === 'pekka-core-upgrade' ? '-ml-4 scale-150' : ''
                }`}
              />
            ) : (
              <span className={`${upgrade.clickPowerBonus && upgrade.clickPowerBonus > 0 ? 'text-3xl' : 'text-5xl'}`}>{upgrade.icon}</span>
            )}
          </div>
          
          <div className="flex-1 flex flex-col justify-between ml-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="clash-font-bold text-lg font-bold text-pekka-text">
                  {upgrade.name}
                </h4>
                <div className="flex items-center">
                  <span className="text-xs clash-font text-pekka-text-secondary">
                    Owned {upgrade.level}
                  </span>
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
            
            <p className="clash-font text-pekka-text-secondary text-sm">
              {upgrade.description}
            </p>
            
            <div className="flex items-center justify-between">
              {upgrade.pancakesPerSecond > 0 && (
                <div className="flex items-center text-sm clash-font">
                  <Zap className="w-4 h-4 mr-1 text-pekka-success" />
                  <span className="text-pekka-success">
                    +{upgrade.pancakesPerSecond.toLocaleString()}/sec
                  </span>
                </div>
              )}
              {upgrade.clickPowerBonus && upgrade.clickPowerBonus > 0 && (
                <div className="flex items-center text-sm clash-font">
                  <Zap className="w-4 h-4 mr-1 text-pekka-accent" />
                  <span className="text-pekka-accent">
                    +{upgrade.clickPowerBonus.toLocaleString()}/click
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
