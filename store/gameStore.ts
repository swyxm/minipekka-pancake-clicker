import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  
  // Actions
  click: () => void
  buyUpgrade: (upgradeId: string) => boolean
  checkAchievements: () => void
  updatePancakesPerSecond: () => void
  resetGame: () => void
  loadGame: () => void
  saveGame: () => void
}

const initialUpgrades: Upgrade[] = [
  {
    id: 'mini-pekka',
    name: 'Mini Pekka',
    description: 'A loyal Mini Pekka that makes pancakes!',
    cost: 10,
    level: 0,
    maxLevel: 10,
    pancakesPerSecond: 1,
    rarity: 'common',
    icon: '🥞',
    unlocked: true
  },
  {
    id: 'knight',
    name: 'Knight',
    description: 'A brave knight who loves pancake duty!',
    cost: 50,
    level: 0,
    maxLevel: 10,
    pancakesPerSecond: 2,
    rarity: 'common',
    icon: '🛡️',
    unlocked: false
  },
  {
    id: 'wizard',
    name: 'Wizard',
    description: 'A magical wizard who conjures pancakes!',
    cost: 200,
    level: 0,
    maxLevel: 10,
    pancakesPerSecond: 5,
    rarity: 'rare',
    icon: '🧙‍♂️',
    unlocked: false
  },
  {
    id: 'dragon',
    name: 'Baby Dragon',
    description: 'A cute dragon who breathes pancake fire!',
    cost: 1000,
    level: 0,
    maxLevel: 10,
    pancakesPerSecond: 15,
    rarity: 'epic',
    icon: '🐉',
    unlocked: false
  },
  {
    id: 'prince',
    name: 'Prince',
    description: 'A royal prince who commands pancake armies!',
    cost: 5000,
    level: 0,
    maxLevel: 10,
    pancakesPerSecond: 50,
    rarity: 'legendary',
    icon: '👑',
    unlocked: false
  },
  {
    id: 'pekka',
    name: 'P.E.K.K.A',
    description: 'The ultimate pancake making machine!',
    cost: 25000,
    level: 0,
    maxLevel: 10,
    pancakesPerSecond: 200,
    rarity: 'champion',
    icon: '🤖',
    unlocked: false
  }
]

const initialAchievements: Achievement[] = [
  {
    id: 'first-pancake',
    name: 'First Pancake',
    description: 'Make your first pancake!',
    condition: 1,
    reward: 10,
    unlocked: false,
    icon: '🥞'
  },
  {
    id: 'hundred-pancakes',
    name: 'Pancake Master',
    description: 'Make 100 pancakes!',
    condition: 100,
    reward: 50,
    unlocked: false,
    icon: '🏆'
  },
  {
    id: 'thousand-pancakes',
    name: 'Pancake Legend',
    description: 'Make 1,000 pancakes!',
    condition: 1000,
    reward: 200,
    unlocked: false,
    icon: '👑'
  },
  {
    id: 'ten-thousand-pancakes',
    name: 'Pancake King',
    description: 'Make 10,000 pancakes!',
    condition: 10000,
    reward: 1000,
    unlocked: false,
    icon: '👑'
  },
  {
    id: 'hundred-thousand-pancakes',
    name: 'Pancake Emperor',
    description: 'Make 100,000 pancakes!',
    condition: 100000,
    reward: 5000,
    unlocked: false,
    icon: '👑'
  },
  {
    id: 'million-pancakes',
    name: 'Pancake God',
    description: 'Make 1,000,000 pancakes!',
    condition: 1000000,
    reward: 25000,
    unlocked: false,
    icon: '👑'
  }
]

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      pancakes: 0,
      totalPancakes: 0,
      pancakesPerSecond: 0,
      clicksPerSecond: 0,
      clickPower: 1,
      upgrades: initialUpgrades,
      purchasedUpgrades: [],
      achievements: initialAchievements,
      unlockedAchievements: [],
      totalClicks: 0,
      playTime: 0,
      startTime: Date.now(),

      // Actions
      click: () => {
        const state = get()
        const newPancakes = state.pancakes + state.clickPower
        const newTotalPancakes = state.totalPancakes + state.clickPower
        const newTotalClicks = state.totalClicks + 1
        
        set({
          pancakes: newPancakes,
          totalPancakes: newTotalPancakes,
          totalClicks: newTotalClicks
        })
        
        // Check achievements after each click
        get().checkAchievements()
      },

      buyUpgrade: (upgradeId: string) => {
        const state = get()
        const upgrade = state.upgrades.find(u => u.id === upgradeId)
        
        if (!upgrade || upgrade.level >= upgrade.maxLevel || state.pancakes < upgrade.cost) {
          return false
        }

        const newPancakes = state.pancakes - upgrade.cost
        const newUpgrades = state.upgrades.map(u => 
          u.id === upgradeId 
            ? { 
                ...u, 
                level: u.level + 1, 
                cost: Math.floor(u.cost * 1.5),
                unlocked: true
              }
            : u
        )
        
        set({
          pancakes: newPancakes,
          upgrades: newUpgrades
        })
        
        get().updatePancakesPerSecond()
        get().checkAchievements()
        
        return true
      },

      checkAchievements: () => {
        const state = get()
        const newAchievements = state.achievements.map(achievement => {
          if (achievement.unlocked) return achievement
          
          const shouldUnlock = state.totalPancakes >= achievement.condition
          if (shouldUnlock) {
            return {
              ...achievement,
              unlocked: true
            }
          }
          return achievement
        })
        
        const newUnlockedAchievements = newAchievements
          .filter(a => a.unlocked)
          .map(a => a.id)
        
        set({
          achievements: newAchievements,
          unlockedAchievements: newUnlockedAchievements
        })
      },

      updatePancakesPerSecond: () => {
        const state = get()
        const totalPPS = state.upgrades.reduce((total, upgrade) => {
          return total + (upgrade.pancakesPerSecond * upgrade.level)
        }, 0)
        
        set({ pancakesPerSecond: totalPPS })
      },

      resetGame: () => {
        set({
          pancakes: 0,
          totalPancakes: 0,
          pancakesPerSecond: 0,
          clicksPerSecond: 0,
          clickPower: 1,
          upgrades: initialUpgrades,
          purchasedUpgrades: [],
          achievements: initialAchievements,
          unlockedAchievements: [],
          totalClicks: 0,
          playTime: 0,
          startTime: Date.now()
        })
      },

      loadGame: () => {
        // This will be handled by the persist middleware
      },

      saveGame: () => {
        // This will be handled by the persist middleware
      }
    }),
    {
      name: 'minipekka-pancake-clicker',
      partialize: (state) => ({
        pancakes: state.pancakes,
        totalPancakes: state.totalPancakes,
        upgrades: state.upgrades,
        achievements: state.achievements,
        unlockedAchievements: state.unlockedAchievements,
        totalClicks: state.totalClicks,
        playTime: state.playTime
      })
    }
  )
)
