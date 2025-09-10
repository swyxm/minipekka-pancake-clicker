import { create } from 'zustand'

const PURCHASE_COOLDOWN_MS = 150
let lastPurchaseAt = 0

export interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  level: number
  maxLevel: number
  pancakesPerSecond: number
  clickPowerBonus?: number
  rarity: 'starter' | 'common' | 'rare' | 'epic' | 'legendary' | 'champion'
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
  lastUpdate?: number
  
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
      const response = await fetch('/api/game/click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}), cache: 'no-store' as RequestCache })
      const data = await response.json()
      if (data.success) {
        // Guard against stale responses: only apply if it would not reduce counters
        set((s) => ({
          pancakes: Math.max(s.pancakes, data.gameState.pancakes),
          totalPancakes: Math.max(s.totalPancakes, data.gameState.totalPancakes),
          clickPower: data.gameState.clickPower,
          pancakesPerSecond: data.gameState.pancakesPerSecond,
          totalClicks: Math.max(s.totalClicks, data.gameState.totalClicks),
          playTime: data.gameState.playTime,
          achievements: data.gameState.achievements,
          unlockedAchievements: data.gameState.unlockedAchievements,
        }))
      }
    } catch (error) {
      // Keep optimistic state; optionally surface a toast
    }
  },

  buyUpgrade: async (upgradeId: string, quantity?: number | 'max') => {
    set({ error: null })

    const now = Date.now()
    if (now - lastPurchaseAt < PURCHASE_COOLDOWN_MS) {
      return false
    }
    lastPurchaseAt = now
    // Determine intended quantity from mode if not passed
    let requestedQty: number | 'max' = quantity ?? 1
    const mode = get().quantityMode
    if (quantity === undefined) {
      requestedQty = mode === 'x10' ? 10 : mode === 'x100' ? 100 : mode === 'max' ? 'max' : 1
    }

    // Compute local affordable qty and totalCost using current store state for instant UI update
    const state = get()
    const upgradesCopy = state.upgrades.map(u => ({ ...u }))
    const target = upgradesCopy.find(u => u.id === upgradeId)
    if (!target) {
      return false
    }

    // Derive qty if 'max' and cap by affordability
    let nextCost = target.cost
    let qtyNum = typeof requestedQty === 'number' ? requestedQty : Number.MAX_SAFE_INTEGER
    let totalCost = 0
    let affordableQty = 0
    let tempPancakes = state.pancakes
    for (let i = 0; i < qtyNum; i++) {
      if (tempPancakes < nextCost) break
      totalCost += nextCost
      tempPancakes -= nextCost
      affordableQty += 1
      nextCost = Math.floor(nextCost * 1.15)
    }

    if (affordableQty === 0) {
      return false
    }

    // Optimistic update: deduct pancakes, bump level and cost immediately
    set((s) => {
      const updatedUpgrades = s.upgrades.map(u => {
        if (u.id !== upgradeId) return u
        // compute next cost after affordableQty levels
        let nc = u.cost
        for (let i = 0; i < affordableQty; i++) {
          nc = Math.floor(nc * 1.15)
        }
        return {
          ...u,
          level: u.level + affordableQty,
          cost: nc,
          unlocked: true,
        }
      })
      // Recompute derived stats locally
      const pancakesPerSecond = updatedUpgrades.reduce((sum, u) => sum + u.pancakesPerSecond * u.level, 0)
      const clickPower = 1 + updatedUpgrades.reduce((sum, u) => sum + (u.clickPowerBonus || 0) * u.level, 0)
      return {
        pancakes: s.pancakes - totalCost,
        upgrades: updatedUpgrades,
        pancakesPerSecond,
        clickPower,
      }
    })

    // Send request to server and reconcile
    try {
      const response = await fetch('/api/game/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upgradeId, quantity: requestedQty }),
        cache: 'no-store' as RequestCache,
      })
      const data = await response.json()
      if (data.success) {
        set((s) => ({
          pancakes: Math.max(s.pancakes, data.gameState.pancakes),
          totalPancakes: Math.max(s.totalPancakes, data.gameState.totalPancakes),
          clickPower: data.gameState.clickPower,
          pancakesPerSecond: data.gameState.pancakesPerSecond,
          totalClicks: Math.max(s.totalClicks, data.gameState.totalClicks),
          playTime: data.gameState.playTime,
          upgrades: data.gameState.upgrades,
          achievements: data.gameState.achievements,
          unlockedAchievements: data.gameState.unlockedAchievements,
        }))
        return true
      } else {
        // If server rejected, reload state to correct optimistic UI
        await get().loadGameState({ silent: true })
        if (data.error && !data.error.toLowerCase().includes('not enough')) {
          set({ error: data.error })
        }
        return false
      }
    } catch (error) {
      await get().loadGameState({ silent: true })
      set({ error: 'Failed to purchase upgrade' })
      return false
    }
  },

  loadGameState: async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent ?? false
    if (!silent) set({ isLoading: true, error: null })
    try {
      const response = await fetch('/api/game/state', { cache: 'no-store' as RequestCache })
      const data = await response.json()
      if (data.success) {
        set((s) => ({
          pancakes: Math.max(s.pancakes, data.gameState.pancakes),
          totalPancakes: Math.max(s.totalPancakes, data.gameState.totalPancakes),
          clickPower: data.gameState.clickPower,
          pancakesPerSecond: data.gameState.pancakesPerSecond,
          totalClicks: Math.max(s.totalClicks, data.gameState.totalClicks),
          playTime: data.gameState.playTime,
          upgrades: data.gameState.upgrades,
          achievements: data.gameState.achievements,
          unlockedAchievements: data.gameState.unlockedAchievements,
          isLoading: false
        }))
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
