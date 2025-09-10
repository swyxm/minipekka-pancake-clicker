import { NextRequest, NextResponse } from 'next/server'
import { buyUpgrade, getOrCreateSessionId, getState } from '@/lib/game'

export async function POST(request: NextRequest) {
  try {
    const { upgradeId, quantity = 1 } = await request.json()
    const sessionId = getOrCreateSessionId()
    const state = getState(sessionId)
    const result = buyUpgrade(state, upgradeId, quantity)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true, purchased: result.purchased, totalCost: result.totalCost, gameState: state })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to purchase upgrade' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const sessionId = getOrCreateSessionId()
  const state = getState(sessionId)
  return NextResponse.json({ success: true, upgrades: state.upgrades })
}
