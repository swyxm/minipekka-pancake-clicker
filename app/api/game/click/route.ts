import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo purposes
// In production, this would be replaced with a database
let gameState: any = {
  pancakes: 0,
  totalPancakes: 0,
  clickPower: 1,
  pancakesPerSecond: 0,
  totalClicks: 0,
  playTime: 0,
  startTime: Date.now(),
  upgrades: [],
  achievements: [],
  unlockedAchievements: []
}

export async function POST(request: NextRequest) {
  try {
    const { clickPower = 1 } = await request.json()
    
    // Update game state
    gameState.pancakes += clickPower
    gameState.totalPancakes += clickPower
    gameState.totalClicks += 1
    
    // Check for achievements
    const newAchievements = checkAchievements(gameState)
    gameState.achievements = newAchievements
    gameState.unlockedAchievements = newAchievements
      .filter(a => a.unlocked)
      .map(a => a.id)
    
    return NextResponse.json({
      success: true,
      gameState: {
        pancakes: gameState.pancakes,
        totalPancakes: gameState.totalPancakes,
        clickPower: gameState.clickPower,
        pancakesPerSecond: gameState.pancakesPerSecond,
        totalClicks: gameState.totalClicks,
        playTime: Math.floor((Date.now() - gameState.startTime) / 1000),
        achievements: gameState.achievements,
        unlockedAchievements: gameState.unlockedAchievements
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process click' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    gameState: {
      pancakes: gameState.pancakes,
      totalPancakes: gameState.totalPancakes,
      clickPower: gameState.clickPower,
      pancakesPerSecond: gameState.pancakesPerSecond,
      totalClicks: gameState.totalClicks,
      playTime: Math.floor((Date.now() - gameState.startTime) / 1000),
      achievements: gameState.achievements,
      unlockedAchievements: gameState.unlockedAchievements
    }
  })
}

function checkAchievements(state: any) {
  const achievements = [
    {
      id: 'first-pancake',
      name: 'First Pancake',
      description: 'Make your first pancake!',
      condition: 1,
      reward: 10,
      unlocked: state.totalPancakes >= 1,
      icon: '🥞'
    },
    {
      id: 'hundred-pancakes',
      name: 'Pancake Master',
      description: 'Make 100 pancakes!',
      condition: 100,
      reward: 50,
      unlocked: state.totalPancakes >= 100,
      icon: '🏆'
    },
    {
      id: 'thousand-pancakes',
      name: 'Pancake Legend',
      description: 'Make 1,000 pancakes!',
      condition: 1000,
      reward: 200,
      unlocked: state.totalPancakes >= 1000,
      icon: '👑'
    },
    {
      id: 'ten-thousand-pancakes',
      name: 'Pancake King',
      description: 'Make 10,000 pancakes!',
      condition: 10000,
      reward: 1000,
      unlocked: state.totalPancakes >= 10000,
      icon: '👑'
    },
    {
      id: 'hundred-thousand-pancakes',
      name: 'Pancake Emperor',
      description: 'Make 100,000 pancakes!',
      condition: 100000,
      reward: 5000,
      unlocked: state.totalPancakes >= 100000,
      icon: '👑'
    },
    {
      id: 'million-pancakes',
      name: 'Pancake God',
      description: 'Make 1,000,000 pancakes!',
      condition: 1000000,
      reward: 25000,
      unlocked: state.totalPancakes >= 1000000,
      icon: '👑'
    }
  ]
  
  return achievements
}
