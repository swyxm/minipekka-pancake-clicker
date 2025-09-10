'use client'

import { useApiGameStore } from '@/store/apiGameStore'
import { ShoppingCart } from 'lucide-react'
import Card from '@/components/ui/Card'
import UpgradeCard from '@/components/game/UpgradeCard'

export default function UpgradesPanel() {
  const { upgrades, quantityMode, setQuantityMode } = useApiGameStore()

  return (
    <Card>
      <h3 className="text-2xl font-bold clash-font-bold text-pekka-blue mb-6 flex items-center">
        <ShoppingCart className="w-6 h-6 mr-2" />
        Upgrades
      </h3>
      
      <div className="mb-4 flex items-center gap-2">
        <button
          className={`px-3 py-1 rounded-md border ${quantityMode === 'x1' ? 'game-button' : 'game-card'}`}
          onClick={() => setQuantityMode('x1')}
        >x1</button>
        <button
          className={`px-3 py-1 rounded-md border ${quantityMode === 'x10' ? 'game-button' : 'game-card'}`}
          onClick={() => setQuantityMode('x10')}
        >x10</button>
        <button
          className={`px-3 py-1 rounded-md border ${quantityMode === 'x100' ? 'game-button' : 'game-card'}`}
          onClick={() => setQuantityMode('x100')}
        >x100</button>
        <button
          className={`px-3 py-1 rounded-md border ${quantityMode === 'max' ? 'game-button' : 'game-card'}`}
          onClick={() => setQuantityMode('max')}
        >Max</button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {upgrades.map((upgrade) => (
          <UpgradeCard key={upgrade.id} upgrade={upgrade} />
        ))}
      </div>
    </Card>
  )
}
