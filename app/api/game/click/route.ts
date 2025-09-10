import { NextRequest, NextResponse } from 'next/server'
import { click, getOrCreateSessionId, getState, serializeState } from '@/lib/game'

export async function POST(request: NextRequest) {
  try {
    const _ = await request.json().catch(() => ({}))
    const sessionId = getOrCreateSessionId()
    const state = getState(sessionId)
    click(state)
    return NextResponse.json({ success: true, gameState: serializeState(state) })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process click' },
      { status: 500 }
    )
  }
}
export async function GET() {
  const sessionId = getOrCreateSessionId()
  const state = getState(sessionId)
  return NextResponse.json({ success: true, gameState: serializeState(state) })
}
