'use client'

import { useApiGameStore } from '@/store/apiGameStore'
import { ShoppingCart } from 'lucide-react'
import Card from '@/components/ui/Card'
import UpgradeCard from '@/components/game/UpgradeCard'

export default function UpgradesPanel() {
  const { upgrades } = useApiGameStore()

  return (
    <Card>
      <h3 className="text-2xl font-bold clash-font-bold text-pekka-blue mb-6 flex items-center">
        <ShoppingCart className="w-6 h-6 mr-2" />
        Upgrades
      </h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {upgrades.map((upgrade) => (
          <UpgradeCard key={upgrade.id} upgrade={upgrade} />
        ))}
      </div>
    </Card>
  )
}
