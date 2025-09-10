import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'
import { buyUpgrade, getOrCreateSessionId, getState, SESSION_COOKIE, STATE_COOKIE, encodeStateToCookie, hydrateStateFromCookie } from '@/lib/game'

export async function POST(request: NextRequest) {
  try {
    const { upgradeId, quantity = 1 } = await request.json()
    const { id, isNew } = await getOrCreateSessionId()
    const state = getState(id)
    const jar = await cookies()
    const encoded = jar.get(STATE_COOKIE)?.value || null
    hydrateStateFromCookie(state, encoded)
    if (isNew) {
      jar.set(SESSION_COOKIE, id, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 })
    }
    const result = buyUpgrade(state, upgradeId, quantity)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
    jar.set(STATE_COOKIE, encodeStateToCookie(state), { httpOnly: false, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 })
    return NextResponse.json(
      { success: true, purchased: result.purchased, totalCost: result.totalCost, gameState: state },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to purchase upgrade' },
      { status: 500 }
    )
  }
}

export async function GET() {
  const { id, isNew } = await getOrCreateSessionId()
  const state = getState(id)
  if (isNew) {
    const jar = await cookies()
    jar.set(SESSION_COOKIE, id, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 })
  }
  return NextResponse.json(
    { success: true, upgrades: state.upgrades },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
