'use client'

import { useApiGameStore } from '@/store/apiGameStore'
import { ShoppingCart } from 'lucide-react'
import Card from '@/components/ui/Card'
import UpgradeCard from '@/components/game/UpgradeCard'
import { useState, useMemo } from 'react'

export default function UpgradesPanel() {
  const { upgrades, quantityMode, setQuantityMode } = useApiGameStore()
  const [tab, setTab] = useState<'characters' | 'click-power'>('characters')

  const filtered = useMemo(() => {
    if (tab === 'click-power') {
      return upgrades.filter(u => (u as any).clickPowerBonus && ((u as any).clickPowerBonus as number) > 0)
    }
    return upgrades.filter(u => !((u as any).clickPowerBonus && ((u as any).clickPowerBonus as number) > 0))
  }, [upgrades, tab])

  return (
    <Card className="h-[60vh] flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <h3 className="text-2xl font-bold clash-font-bold text-pekka-blue mb-4 flex items-center">
          <ShoppingCart className="w-6 h-6 mr-2" />
          Upgrades
        </h3>
        <div className="mb-4 flex items-center gap-2">
          <button
            className={`px-3 py-1 rounded-full border ${tab==='characters' ? 'game-button' : 'game-card'}`}
            onClick={() => setTab('characters')}
          >Characters</button>
          <button
            className={`px-3 py-1 rounded-full border ${tab==='click-power' ? 'game-button' : 'game-card'}`}
            onClick={() => setTab('click-power')}
          >Click Power</button>
        </div>
        
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
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 thin-scrollbar">
        {filtered.map((upgrade) => (
          <UpgradeCard key={upgrade.id} upgrade={upgrade} />
        ))}
      </div>
    </Card>
  )
}
