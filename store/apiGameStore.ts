import { create } from 'zustand'

export interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  level: number
  maxLevel: number
  pancakesPerSecond: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'champion'
  icon: string
  unlocked: boolean
}

export interface Achievement {
  id: string
  name: string
  description: string
  condition: number
  reward: number
  unlocked: boolean
  icon: string
}

export interface GameState {
  // Core game state
  pancakes: number
  totalPancakes: number
  pancakesPerSecond: number
  clicksPerSecond: number
  clickPower: number
  
  // Upgrades
  upgrades: Upgrade[]
  purchasedUpgrades: string[]
  
  // Achievements
  achievements: Achievement[]
  unlockedAchievements: string[]
  
  // Stats
  totalClicks: number
  playTime: number
  startTime: number
  
  // Loading states
  isLoading: boolean
  error: string | null
  
  // Actions
  click: () => Promise<void>
  buyUpgrade: (upgradeId: string, quantity?: number | 'max') => Promise<boolean>
  loadGameState: (opts?: { silent?: boolean }) => Promise<void>
  resetGame: () => Promise<void>
  setError: (error: string | null) => void
  setQuantityMode: (mode: 'x1' | 'x10' | 'x100' | 'max') => void
  quantityMode: 'x1' | 'x10' | 'x100' | 'max'
}

export const useApiGameStore = create<GameState>((set, get) => ({
  // Initial state
  pancakes: 0,
  totalPancakes: 0,
  pancakesPerSecond: 0,
  clicksPerSecond: 0,
  clickPower: 1,
  upgrades: [],
  purchasedUpgrades: [],
  achievements: [],
  unlockedAchievements: [],
  totalClicks: 0,
  playTime: 0,
  startTime: Date.now(),
  isLoading: false,
  error: null,
  quantityMode: 'x1',

  // Actions
  click: async () => {
    // Optimistic UI: update instantly, then sync
    const { clickPower } = get()
    set((s) => ({
      pancakes: s.pancakes + clickPower,
      totalPancakes: s.totalPancakes + clickPower,
      totalClicks: s.totalClicks + 1,
    }))
    try {
      const response = await fetch('/api/game/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      const data = await response.json()
      if (data.success) {
        set({
          pancakes: data.gameState.pancakes,
          totalPancakes: data.gameState.totalPancakes,
          clickPower: data.gameState.clickPower,
          pancakesPerSecond: data.gameState.pancakesPerSecond,
          totalClicks: data.gameState.totalClicks,
          playTime: data.gameState.playTime,
          achievements: data.gameState.achievements,
          unlockedAchievements: data.gameState.unlockedAchievements,
        })
      }
    } catch (error) {
      // Keep optimistic state; optionally surface a toast
    }
  },

  buyUpgrade: async (upgradeId: string, quantity?: number | 'max') => {
    set({ isLoading: true, error: null })
    
    try {
      let qty: number | 'max' = quantity ?? 1
      const mode = get().quantityMode
      if (quantity === undefined) {
        qty = mode === 'x10' ? 10 : mode === 'x100' ? 100 : mode === 'max' ? 'max' : 1
      }

      const response = await fetch('/api/game/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ upgradeId, quantity: qty }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        set({
          pancakes: data.gameState.pancakes,
          totalPancakes: data.gameState.totalPancakes,
          clickPower: data.gameState.clickPower,
          pancakesPerSecond: data.gameState.pancakesPerSecond,
          totalClicks: data.gameState.totalClicks,
          playTime: data.gameState.playTime,
          upgrades: data.gameState.upgrades,
          achievements: data.gameState.achievements,
          unlockedAchievements: data.gameState.unlockedAchievements,
          isLoading: false
        })
        return true
      } else {
        set({ error: data.error, isLoading: false })
        return false
      }
    } catch (error) {
      set({ 
        error: 'Failed to purchase upgrade', 
        isLoading: false 
      })
      return false
    }
  },

  loadGameState: async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false
    if (!silent) set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/game/state')
      const data = await response.json()
      if (data.success) {
        set({
          pancakes: data.gameState.pancakes,
          totalPancakes: data.gameState.totalPancakes,
          clickPower: data.gameState.clickPower,
          pancakesPerSecond: data.gameState.pancakesPerSecond,
          totalClicks: data.gameState.totalClicks,
          playTime: data.gameState.playTime,
          upgrades: data.gameState.upgrades,
          achievements: data.gameState.achievements,
          unlockedAchievements: data.gameState.unlockedAchievements,
          isLoading: false
        })
      } else {
        set({ error: data.error, isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to load game state', isLoading: false })
    }
  },

  resetGame: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/game/state', {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        set({
          pancakes: 0,
          totalPancakes: 0,
          pancakesPerSecond: 0,
          clicksPerSecond: 0,
          clickPower: 1,
          upgrades: [],
          purchasedUpgrades: [],
          achievements: [],
          unlockedAchievements: [],
          totalClicks: 0,
          playTime: 0,
          startTime: Date.now(),
          isLoading: false
        })
      } else {
        set({ error: data.error, isLoading: false })
      }
    } catch (error) {
      set({ 
        error: 'Failed to reset game', 
        isLoading: false 
      })
    }
  },

  setError: (error: string | null) => {
    set({ error })
  },

  setQuantityMode: (mode: 'x1' | 'x10' | 'x100' | 'max') => set({ quantityMode: mode })
}))
