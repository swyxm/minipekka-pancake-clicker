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
  buyUpgrade: (upgradeId: string) => Promise<boolean>
  loadGameState: () => Promise<void>
  resetGame: () => Promise<void>
  setError: (error: string | null) => void
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

  // Actions
  click: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/game/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clickPower: get().clickPower }),
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
          achievements: data.gameState.achievements,
          unlockedAchievements: data.gameState.unlockedAchievements,
          isLoading: false
        })
      } else {
        set({ error: data.error, isLoading: false })
      }
    } catch (error) {
      set({ 
        error: 'Failed to process click', 
        isLoading: false 
      })
    }
  },

  buyUpgrade: async (upgradeId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/game/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ upgradeId }),
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

  loadGameState: async () => {
    set({ isLoading: true, error: null })
    
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
      set({ 
        error: 'Failed to load game state', 
        isLoading: false 
      })
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
  }
}))
