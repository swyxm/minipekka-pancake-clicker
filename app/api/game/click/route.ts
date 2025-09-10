import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

import { cookies } from 'next/headers'
import { click, getOrCreateSessionId, getState, serializeState, SESSION_COOKIE } from '@/lib/game'

export async function POST(request: NextRequest) {
  try {
    const _ = await request.json().catch(() => ({}))
    const { id, isNew } = await getOrCreateSessionId()
    const state = getState(id)
    if (isNew) {
      const jar = await cookies()
      jar.set(SESSION_COOKIE, id, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 365 })
    }
    click(state)
    return NextResponse.json(
      { success: true, gameState: serializeState(state) },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process click' },
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
    { success: true, gameState: serializeState(state) },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
