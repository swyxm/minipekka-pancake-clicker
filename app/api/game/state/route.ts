import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'
import { getOrCreateSessionId, getState, resetState, serializeState, SESSION_COOKIE } from '@/lib/game'

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
  achievements: [
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
  ],
  unlockedAchievements: []
}

export async function GET() {
  const { id, isNew } = await getOrCreateSessionId()
  const state = getState(id)
  if (isNew) {
    const jar = await cookies()
    jar.set(SESSION_COOKIE, id, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 })
  }
  return NextResponse.json(
    { success: true, gameState: serializeState(state) },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

export async function POST(request: NextRequest) {
  try {
    const _ = await request.json().catch(() => ({}))
    const { id, isNew } = await getOrCreateSessionId()
    const state = getState(id)
    if (isNew) {
      const jar = await cookies()
      jar.set(SESSION_COOKIE, id, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 })
    }
    return NextResponse.json(
      { success: true, gameState: serializeState(state) },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update game state' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const { id, isNew } = await getOrCreateSessionId()
  const state = resetState(id)
  if (isNew) {
    const jar = await cookies()
    jar.set(SESSION_COOKIE, id, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 })
  }
  return NextResponse.json(
    { success: true, gameState: serializeState(state) },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
