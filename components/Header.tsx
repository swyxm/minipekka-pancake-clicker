'use client'

import { useApiGameStore } from '@/store/apiGameStore'
import Card from '@/components/ui/Card'
import NumberDisplay from '@/components/ui/NumberDisplay'
import Image from 'next/image'

export default function Header() {
  const { pancakes, totalPancakes } = useApiGameStore()

  return (
    <header className="game-card p-6">
      <div className="flex flex-col items-center">
        {/* Title row with flanking pancakes */}
        <div className="flex items-center justify-center gap-4">
          <Image src="/pancakes.png" alt="Pancakes" width={100} height={100} className="object-contain" />
          <div className="text-center">
            <h2 className="text-2xl md:text-4xl font-bold clash-font-bold text-pekka-blue mb-1 text-glow">
              Mini Pekka's
            </h2>
            <h1 className="text-4xl md:text-6xl font-bold clash-font-bold pekka-text-secondary text-glow">
              Pancake Clicker
            </h1>
          </div>
          <Image src="/pancakes.png" alt="Pancakes" width={100} height={100} className="object-contain" />
        </div>

        {/* Counters below title on the same line */}
        <div className="mt-3 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <NumberDisplay value={pancakes} size="md" color="primary" />
            <span className="clash-font text-pekka-text-secondary text-sm">Pancakes</span>
          </div>
          <div className="flex items-center gap-2">
            <NumberDisplay value={totalPancakes} size="md" color="accent" />
            <span className="clash-font text-pekka-text-secondary text-sm">Total</span>
          </div>
        </div>
      </div>
    </header>
  )
}
