import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo purposes
let gameState: any = {
  pancakes: 0,
  totalPancakes: 0,
  clickPower: 1,
  pancakesPerSecond: 0,
  totalClicks: 0,
  playTime: 0,
  startTime: Date.now(),
  upgrades: [
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
  ],
  achievements: [],
  unlockedAchievements: []
}

export async function POST(request: NextRequest) {
  try {
    const { upgradeId } = await request.json()
    
    const upgrade = gameState.upgrades.find((u: any) => u.id === upgradeId)
    
    if (!upgrade) {
      return NextResponse.json(
        { success: false, error: 'Upgrade not found' },
        { status: 404 }
      )
    }
    
    if (upgrade.level >= upgrade.maxLevel) {
      return NextResponse.json(
        { success: false, error: 'Upgrade is at max level' },
        { status: 400 }
      )
    }
    
    if (gameState.pancakes < upgrade.cost) {
      return NextResponse.json(
        { success: false, error: 'Not enough pancakes' },
        { status: 400 }
      )
    }
    
    // Purchase upgrade
    gameState.pancakes -= upgrade.cost
    upgrade.level += 1
    upgrade.cost = Math.floor(upgrade.cost * 1.5)
    upgrade.unlocked = true
    
    // Update pancakes per second
    gameState.pancakesPerSecond = gameState.upgrades.reduce((total: number, u: any) => {
      return total + (u.pancakesPerSecond * u.level)
    }, 0)
    
    return NextResponse.json({
      success: true,
      gameState: {
        pancakes: gameState.pancakes,
        totalPancakes: gameState.totalPancakes,
        clickPower: gameState.clickPower,
        pancakesPerSecond: gameState.pancakesPerSecond,
        totalClicks: gameState.totalClicks,
        playTime: Math.floor((Date.now() - gameState.startTime) / 1000),
        upgrades: gameState.upgrades,
        achievements: gameState.achievements,
        unlockedAchievements: gameState.unlockedAchievements
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to purchase upgrade' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    upgrades: gameState.upgrades
  })
}
