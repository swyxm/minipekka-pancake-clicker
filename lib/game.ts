import { cookies } from 'next/headers'

export type Rarity = 'starter' | 'common' | 'rare' | 'epic' | 'legendary' | 'champion'

export interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  level: number
  maxLevel: number
  pancakesPerSecond: number
  clickPowerBonus?: number
  rarity: Rarity
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
  pancakes: number
  totalPancakes: number
  clickPower: number
  pancakesPerSecond: number
  totalClicks: number
  playTime: number
  startTime: number
  lastUpdate: number
  upgrades: Upgrade[]
  achievements: Achievement[]
  unlockedAchievements: string[]
}

export const SESSION_COOKIE = 'mp_session'

// In-memory session store (replace with DB for persistence)
const sessionIdToState = new Map<string, GameState>()

const initialUpgrades: Upgrade[] = [
  {
    id: 'mini-pekka-sharp-blade',
    name: 'Sharpened Blade',
    description: 'Sharper sword, harder hits. Clicks slice for more!',
    cost: 15,
    level: 0,
    maxLevel: Number.MAX_SAFE_INTEGER,
    pancakesPerSecond: 0,
    clickPowerBonus: 1,
    rarity: 'common',
    icon: '🗡️',
    unlocked: true,
  },
  {
    id: 'royal-reinforcement',
    name: 'Royal Reinforcement',
    description: 'King sends better steel. Clicks deal extra damage.',
    cost: 100,
    level: 0,
    maxLevel: Number.MAX_SAFE_INTEGER,
    pancakesPerSecond: 0,
    clickPowerBonus: 2,
    rarity: 'common',
    icon: '🏰',
    unlocked: false,
  },
  {
    id: 'elixir-overclock',
    name: 'Elixir Overclock',
    description: 'Turbo-charge your gauntlets with Elixir!',
    cost: 500,
    level: 0,
    maxLevel: Number.MAX_SAFE_INTEGER,
    pancakesPerSecond: 0,
    clickPowerBonus: 5,
    rarity: 'rare',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'rage-spell',
    name: 'Rage Spell',
    description: 'Rage-boost your fingers for furious taps.',
    cost: 2500,
    level: 0,
    maxLevel: Number.MAX_SAFE_INTEGER,
    pancakesPerSecond: 0,
    clickPowerBonus: 10,
    rarity: 'epic',
    icon: '✨',
    unlocked: false,
  },
  {
    id: 'pekka-core-upgrade',
    name: 'P.E.K.K.A Core',
    description: 'Upgrade the P.E.K.K.A core for monstrous clicks.',
    cost: 15000,
    level: 0,
    maxLevel: Number.MAX_SAFE_INTEGER,
    pancakesPerSecond: 0,
    clickPowerBonus: 25,
    rarity: 'legendary',
    icon: '🤖',
    unlocked: false,
  },
  // Passive Generation Upgrades
  {
    id: 'mini-pekka',
    name: 'Mini Pekka',
    description: 'A loyal Mini Pekka that makes pancakes!',
    cost: 10,
    level: 0,
    maxLevel: Number.MAX_SAFE_INTEGER,
    pancakesPerSecond: 1,
    rarity: 'starter',
    icon: '🥞',
    unlocked: true,
  },
  {
    id: 'knight',
    name: 'Knight',
    description: 'A brave knight who loves pancake duty!',
    cost: 50,
    level: 0,
    maxLevel: Number.MAX_SAFE_INTEGER,
    pancakesPerSecond: 2,
    rarity: 'common',
    icon: '🛡️',
    unlocked: false,
  },
  {
    id: 'wizard',
    name: 'Wizard',
    description: 'A magical wizard who conjures pancakes!',
    cost: 200,
    level: 0,
    maxLevel: Number.MAX_SAFE_INTEGER,
    pancakesPerSecond: 5,
    rarity: 'rare',
    icon: '🧙‍♂️',
    unlocked: false,
  },
  {
    id: 'dragon',
    name: 'Baby Dragon',
    description: 'A cute dragon who breathes pancake fire!',
    cost: 1000,
    level: 0,
    maxLevel: Number.MAX_SAFE_INTEGER,
    pancakesPerSecond: 15,
    rarity: 'epic',
    icon: '🐉',
    unlocked: false,
  },
  {
    id: 'prince',
    name: 'Prince',
    description: 'A royal prince who commands pancake armies!',
    cost: 5000,
    level: 0,
    maxLevel: Number.MAX_SAFE_INTEGER,
    pancakesPerSecond: 50,
    rarity: 'legendary',
    icon: '👑',
    unlocked: false,
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
    unlocked: false,
  },
]

const initialAchievements: Achievement[] = [
  { id: 'first-pancake', name: 'First Pancake', description: 'Make your first pancake!', condition: 1, reward: 10, unlocked: false, icon: '🥞' },
  { id: 'hundred-pancakes', name: 'Pancake Master', description: 'Make 100 pancakes!', condition: 100, reward: 50, unlocked: false, icon: '🏆' },
  { id: 'thousand-pancakes', name: 'Pancake Legend', description: 'Make 1,000 pancakes!', condition: 1000, reward: 200, unlocked: false, icon: '👑' },
  { id: 'ten-thousand-pancakes', name: 'Pancake King', description: 'Make 10,000 pancakes!', condition: 10000, reward: 1000, unlocked: false, icon: '👑' },
  { id: 'hundred-thousand-pancakes', name: 'Pancake Emperor', description: 'Make 100,000 pancakes!', condition: 100000, reward: 5000, unlocked: false, icon: '👑' },
  { id: 'million-pancakes', name: 'Pancake God', description: 'Make 1,000,000 pancakes!', condition: 1000000, reward: 25000, unlocked: false, icon: '👑' },
]

function createInitialState(): GameState {
  const now = Date.now()
  return {
    pancakes: 0,
    totalPancakes: 0,
    clickPower: 1,
    pancakesPerSecond: 0,
    totalClicks: 0,
    playTime: 0,
    startTime: now,
    lastUpdate: now,
    upgrades: JSON.parse(JSON.stringify(initialUpgrades)),
    achievements: JSON.parse(JSON.stringify(initialAchievements)),
    unlockedAchievements: [],
  }
}

export async function getOrCreateSessionId(): Promise<{ id: string, isNew: boolean }> {
  const jar = await cookies()
  let id = jar.get(SESSION_COOKIE)?.value
  let isNew = false
  if (!id) {
    id = crypto.randomUUID()
    isNew = true
  }
  return { id, isNew }
}

export function getState(sessionId: string): GameState {
  let state = sessionIdToState.get(sessionId)
  if (!state) {
    state = createInitialState()
    sessionIdToState.set(sessionId, state)
  }
  applyPassiveGain(state)
  return state
}

export function resetState(sessionId: string): GameState {
  const state = createInitialState()
  sessionIdToState.set(sessionId, state)
  return state
}

export function applyPassiveGain(state: GameState): void {
  const now = Date.now()
  const elapsedMs = now - state.lastUpdate
  if (elapsedMs <= 0) {
    return
  }
  const elapsedSeconds = Math.floor(elapsedMs / 1000)
  if (elapsedSeconds > 0) {
    const gain = state.pancakesPerSecond * elapsedSeconds
    if (gain > 0) {
      state.pancakes += gain
      state.totalPancakes += gain
    }
    state.playTime = Math.floor((now - state.startTime) / 1000)
    state.lastUpdate = now
    updateAchievements(state)
  }
}

export function updatePancakesPerSecond(state: GameState): void {
  state.pancakesPerSecond = state.upgrades.reduce((sum, u) => sum + u.pancakesPerSecond * u.level, 0)
}

export function updateClickPower(state: GameState): void {
  state.clickPower = 1 + state.upgrades.reduce((sum, u) => sum + (u.clickPowerBonus || 0) * u.level, 0)
}

export function click(state: GameState): void {
  applyPassiveGain(state)
  state.pancakes += state.clickPower
  state.totalPancakes += state.clickPower
  state.totalClicks += 1
  updateAchievements(state)
}

export function buyUpgrade(state: GameState, upgradeId: string, quantity: number | 'max') {
  applyPassiveGain(state)
  const upgrade = state.upgrades.find(u => u.id === upgradeId)
  if (!upgrade) {
    return { success: false, error: 'Upgrade not found' }
  }
  if (upgrade.level >= upgrade.maxLevel) {
    return { success: false, error: 'Upgrade is at max level' }
  }

  // Determine quantity
  let qty = typeof quantity === 'number' ? quantity : 0
  if (quantity === 'max') {
    // compute the maximum affordable considering rounding
    let tempCost = upgrade.cost
    let tempLevel = upgrade.level
    let tempPancakes = state.pancakes
    let count = 0
    while (tempLevel < upgrade.maxLevel && tempPancakes >= tempCost) {
      tempPancakes -= tempCost
      tempLevel += 1
      tempCost = Math.floor(tempCost * 1.15)
      count += 1
    }
    qty = count
  }

  qty = Math.max(1, Math.min(qty, upgrade.maxLevel - upgrade.level))

  // Calculate total cost iteratively to respect rounding
  let totalCost = 0
  let nextCost = upgrade.cost
  let levelsToBuy = qty
  while (levelsToBuy > 0) {
    totalCost += nextCost
    nextCost = Math.floor(nextCost * 1.15)
    levelsToBuy -= 1
  }

  if (state.pancakes < totalCost) {
    return { success: false, error: 'Not enough pancakes' }
  }

  // Apply purchase
  state.pancakes -= totalCost
  upgrade.level += qty
  upgrade.unlocked = true
  upgrade.cost = nextCost // next cost after qty increments

  updatePancakesPerSecond(state)
  updateClickPower(state)
  updateAchievements(state)

  return { success: true, purchased: qty, totalCost }
}

function updateAchievements(state: GameState) {
  state.achievements = state.achievements.map(a => ({
    ...a,
    unlocked: state.totalPancakes >= a.condition || a.unlocked,
  }))
  state.unlockedAchievements = state.achievements.filter(a => a.unlocked).map(a => a.id)
}

export function serializeState(state: GameState) {
  return {
    pancakes: state.pancakes,
    totalPancakes: state.totalPancakes,
    clickPower: state.clickPower,
    pancakesPerSecond: state.pancakesPerSecond,
    totalClicks: state.totalClicks,
    playTime: state.playTime,
    lastUpdate: state.lastUpdate,
    upgrades: state.upgrades,
    achievements: state.achievements,
    unlockedAchievements: state.unlockedAchievements,
  }
}


