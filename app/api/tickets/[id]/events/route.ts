import { NextRequest, NextResponse } from 'next/server'
import { ticketService } from '@/lib/services/ticketService'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const events = await ticketService.getEvents(params.id)
    return NextResponse.json(events)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}